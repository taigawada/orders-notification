import { difference, isString } from "lodash";
import { Graphql } from "../graphql-codegen";
import z from "zod";
import prisma from "../utils/prisma";
import { format, startOfDay, sub } from "date-fns";
import { convertToTimeZone } from "date-fns-timezone";
import { sendLine } from "../utils/line";

const orderSchema = z.object({
  __typename: z.enum(["Order"]),
  id: z.string(),
  name: z.string(),
});

const lineItemSchema = z.object({
  __typename: z.enum(["LineItem"]),
  id: z.string(),
  quantity: z.number(),
  currentQuantity: z.number(),
  refundableQuantity: z.number(),
  variant: z
    .object({
      id: z.string(),
      displayName: z.string(),
      selectedOptions: z.array(
        z.object({ name: z.string(), value: z.string() }),
      ),
      product: z.object({
        id: z.string(),
        title: z.string(),
      }),
    })
    .nullish(),
  __parentId: z.string().nullish(),
});

type Order = z.infer<typeof orderSchema> & {
  lineItems: z.infer<typeof lineItemSchema>[];
};

async function* jsonlGeneratorFactory(
  reader: ReadableStreamDefaultReader,
): AsyncGenerator<Order[], void> {
  const matcher = /\r?\n/;
  const decoder = new TextDecoder();
  let buf: string = "";
  let next = reader.read();
  while (true) {
    const { done, value } = await next;
    if (done) {
      if (buf.length > 0) {
        yield JSON.parse(buf);
      }
      return;
    }
    const chunk = decoder.decode(value, { stream: true });
    buf += chunk;
    const parts = buf.split(matcher);
    buf = parts.pop() || "";
    for (const i of parts) {
      yield JSON.parse(i);
    }
    next = reader.read();
  }
}

async function parseOrdersJsonL(jsonlUrl: string) {
  const result: Order[] = [];
  const { body } = await fetch(jsonlUrl);
  if (!body) throw new Error("Invalid Response Body");
  const readable = body.getReader();
  const jsonlGenerator = jsonlGeneratorFactory(readable);
  while (true) {
    const { done, value } = await jsonlGenerator.next();
    if (done) {
      return result;
    }
    const order = orderSchema.safeParse(value);
    const lineItem = lineItemSchema.safeParse(value);
    if (!order.success && !lineItem.success) {
      throw new Error("Invalid Json value");
    }
    if (order.success) {
      result.push({ ...order.data, lineItems: [] });
    }
    if (lineItem.success) {
      const targetIndex = result.findIndex(
        (data) => data.id === lineItem.data.__parentId,
      );
      if (targetIndex === -1) {
        throw new Error("__parentId Not Found");
      }
      result[targetIndex].lineItems.push(lineItem.data);
    }
  }
}

const gqlClient = new Graphql().admin;

export async function getAllOrders(today: Date) {
  const query = `
  {
    orders(query: "created_at:<='${today.toISOString()}'" sortKey:ORDER_NUMBER, reverse:true) {
      edges {
        node {
          __typename
          name
          id
          lineItems(first:250) {
            pageInfo {
              hasNextPage
            }
            edges {
              node {
                __typename
                id
                quantity
                currentQuantity
                refundableQuantity
                variant {
                  id
                  displayName
                  selectedOptions {
                    name
                    value
                  }
                  product {
                    id
                    title
                  }
                }
              }
            }
          }
        }
      }
    }
  }`;
  const { bulkOperationRunQuery } = await gqlClient.startBulkOperation({
    query,
  });
  if (!bulkOperationRunQuery?.bulkOperation?.id) {
    console.error(bulkOperationRunQuery?.userErrors);
    throw new Error("Bulk Operation Query error");
  }
  let resultUrl: string | undefined;
  const bulkOperation = await gqlClient.getBulkOperationById({
    input: bulkOperationRunQuery.bulkOperation.id,
  });
  resultUrl =
    bulkOperation.node?.__typename === "BulkOperation" &&
    bulkOperation.node.status === "COMPLETED" &&
    isString(bulkOperation.node.url)
      ? bulkOperation.node.url
      : undefined;
  while (!resultUrl) {
    const interval = 3000;
    await new Promise((resolve) => setTimeout(resolve, interval));
    const bulkOperationPolling = await gqlClient.getBulkOperationById({
      input: bulkOperationRunQuery.bulkOperation.id,
    });
    if (
      bulkOperationPolling.node?.__typename === "BulkOperation" &&
      bulkOperationPolling.node.status === "COMPLETED" &&
      isString(bulkOperationPolling.node.url)
    ) {
      resultUrl = bulkOperationPolling.node.url;
    }
  }
  if (!resultUrl) throw new Error("jsonl url is invalid");
  return resultUrl;
}

export async function createTotalSales(orders: Order[]) {
  interface SalesResults {
    productId: string;
    productTitle: string;
    variantId: string;
    variantOptionValues: {
      name: string;
      value: string;
    }[];
    displayName: string;
    currentSold: number;
  }
  const salesResults: SalesResults[] = [];
  orders.forEach((order) => {
    order.lineItems.forEach((lineItem) => {
      if (!lineItem.variant) return;
      const target = salesResults.findIndex(
        (variant) => variant.variantId === lineItem.variant?.id,
      );
      if (target !== -1) {
        salesResults[target].currentSold += lineItem.currentQuantity;
      } else {
        salesResults.push({
          productId: lineItem.variant.product.id,
          productTitle: lineItem.variant.product.title,
          variantId: lineItem.variant.id,
          variantOptionValues: lineItem.variant.selectedOptions,
          displayName: lineItem.variant.displayName,
          currentSold: lineItem.currentQuantity,
        });
      }
    });
  });
  await prisma.$transaction(
    salesResults.map(({ variantOptionValues, ...results }) =>
      prisma.salesResults.upsert({
        where: {
          variantId: results.variantId,
        },
        update: {
          currentSold: results.currentSold,
        },
        create: {
          ...results,
          variantOptions: {
            createMany: {
              data: variantOptionValues,
            },
          },
        },
      }),
    ),
  );
}

export async function ordersCountCheck(today: Date, yesterday: Date) {
  const todaySalesCount = await prisma.todaySales.count({
    where: {
      createdAt: {
        gte: yesterday,
        lt: today,
      },
    },
  });
  const { ordersCount } = await gqlClient.getOrdersCount({
    query: `created_at:>'${yesterday.toISOString()}' AND created_at:<='${today.toISOString()}'`,
  });
  if (!ordersCount) {
    throw new Error("The ordersCount could not be retrieved.");
  }
  return ordersCount.count !== todaySalesCount;
}

export async function getDifferenceOrderNames(today: Date, yesterday: Date) {
  const {
    orders: { edges: orderEdges },
  } = await gqlClient.getOrdersByQuery({
    query: `created_at:>'${yesterday.toISOString()}' AND created_at:<='${today.toISOString()}'`,
  });
  const todaySales = await prisma.todaySales.findMany({
    where: {
      createdAt: {
        gte: yesterday,
        lt: today,
      },
    },
  });
  const diff = difference(
    orderEdges.map(({ node }) => node.id),
    todaySales.map((order) => order.orderId),
  );
  const diffOrderNames = diff
    .map(
      (orderId) =>
        orderEdges.find(({ node }) => node.id === orderId)?.node.name,
    )
    .filter((orderId): orderId is string => typeof orderId === "string");
  return diffOrderNames;
}

export async function deleteLessThanYesterdaySales(today: Date) {
  await prisma.todaySales.deleteMany({
    where: {
      createdAt: {
        lt: today,
      },
    },
  });
}

export async function batch() {
  const now = convertToTimeZone(new Date(), { timeZone: "Asia/Tokyo" });
  const today = startOfDay(now);
  const yesterday = sub(today, { days: 1 });

  console.log(`[${now}] batch process started`);
  const { id: batchProcessId } = await prisma.batchProcess.create({
    data: {
      startedAt: now,
    },
  });

  const url = await getAllOrders(today);
  const orders = await parseOrdersJsonL(url);
  await createTotalSales(orders);
  const countEqual = await ordersCountCheck(today, yesterday);
  if (!countEqual) {
    const differentOrderNames = await getDifferenceOrderNames(today, yesterday);
    await sendLine([
      {
        type: "text",
        text: `【Shopify注文通知】${format(today, "MM月dd日")}\nエラーが発生したWebhookがあります\n注文番号:${differentOrderNames.join(", ")}`,
      },
    ]);
  }
  await deleteLessThanYesterdaySales(today);
  const finishedAt = convertToTimeZone(new Date(), { timeZone: "Asia/Tokyo" });
  await prisma.batchProcess.update({
    where: {
      id: batchProcessId,
    },
    data: {
      finishedAt,
      isSuccess: true,
    },
  });
  console.log(`[${finishedAt}] batch process finished`);
}
