import "dotenv/config";
import Fastify, { FastifyInstance, FastifyRequest } from "fastify";
import crypto from "crypto";
import { isObject, isString } from "lodash";
import { OrdersCreate } from "./@types/payload";
import { ordersCreateProcess } from "./process/orders_create";

const fastify: FastifyInstance = Fastify({
  logger: false,
});

fastify.removeContentTypeParser("application/json");
fastify.addContentTypeParser(
  "application/json",
  { parseAs: "string" },
  function (_req, body, done) {
    try {
      if (typeof body === "string") {
        const newBody = {
          raw: body,
          parsed: JSON.parse(body),
        };
        done(null, newBody);
      } else {
        throw new Error("body is not string");
      }
    } catch (error) {
      if (error instanceof Error) {
        done(error, undefined);
      } else {
        throw error;
      }
    }
  },
);

fastify.addHook("preHandler", (request, reply, next) => {
  if (
    request.url.match(/^\/api\/webhooks/i) &&
    "x-shopify-hmac-sha256" in request.headers &&
    isObject(request.body) &&
    "raw" in request.body &&
    isString(request.body.raw) &&
    process.env.SHOPIFY_WEBHOOK_SIGN
  ) {
    const hmac = request.headers["x-shopify-hmac-sha256"];
    const hash = crypto
      .createHmac("sha256", process.env.SHOPIFY_WEBHOOK_SIGN)
      .update(request.body.raw)
      .digest("base64");
    if (hmac === hash) {
      return next();
    } else {
      return reply.code(500).send();
    }
  }
  return next();
});

fastify.get("/ping", async (_request, _reply) => {
  return "pong\n";
});

type Topics = "ORDERS_CREATE" | "APP_UNINSTALLED";
type OrdersCreateType = { topic: "ORDERS_CREATE"; payload: OrdersCreate };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AppUninstalledType = { topic: "APP_UNINSTALLED"; payload: any };
type Result<T> = T extends "ORDERS_CREATE"
  ? OrdersCreateType
  : T extends "APP_UNINSTALLED"
    ? AppUninstalledType
    : never;

const parseWebhook = <T extends Topics>(topic: T, request: FastifyRequest) => {
  if (!isObject(request.body) || !("parsed" in request.body)) {
    throw new Error();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = request.body.parsed;
  switch (topic) {
    case "ORDERS_CREATE":
      return {
        topic: "ORDERS_CREATE",
        payload,
      } as const satisfies OrdersCreateType as Result<T>;
    case "APP_UNINSTALLED":
      return {
        topic: "APP_UNINSTALLED",
        payload,
      } as const satisfies AppUninstalledType as Result<T>;
    default: {
      const _never: never = topic;
      throw new Error(_never);
    }
  }
};

fastify.post("/api/webhooks/ordersCreate", async (request, reply) => {
  const { payload } = parseWebhook("ORDERS_CREATE", request);
  console.log("now processing...");
  ordersCreateProcess(payload);
  reply.code(200).send();
  return;
});

export const fastifyStart = async () => {
  try {
    await fastify.listen({ port: 3000 });
    const address = fastify.server.address();
    const port = typeof address === "string" ? address : address?.port;
    console.log(`fastify server is running on port:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
