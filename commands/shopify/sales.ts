import {
  AutocompleteInteraction,
  CommandInteraction,
  EmbedBuilder,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { Graphql } from "../../graphql-codegen";
import { isString } from "lodash";
import prisma from "../../utils/prisma";
import { convertToTimeZone } from "date-fns-timezone";
import { startOfDay } from "date-fns";

export const data = new SlashCommandBuilder()
  .setName("sales")
  .setDescription("商品の合計販売数を集計します")
  .addStringOption((option) =>
    option
      .setName("商品名")
      .setDescription("商品を選択してください")
      .setRequired(true)
      .setAutocomplete(true),
  )
  .addStringOption((option) =>
    option
      .setName("バリエーション")
      .setDescription("バリエーションを選択してください")
      .setRequired(false)
      .setAutocomplete(true),
  );
export const autocomplete = async (interaction: AutocompleteInteraction) => {
  const focusedValue = interaction.options.getFocused(true);
  const client = new Graphql().admin;
  switch (focusedValue.name) {
    case "商品名": {
      const {
        products: { edges: matchedProducts },
      } = await client.getProductsByWords({
        input: `title:${focusedValue.value}*`,
      });
      await interaction.respond(
        matchedProducts.map((product) => {
          return {
            name: product.node.title,
            value: product.node.id,
          };
        }),
      );
      break;
    }
    case "バリエーション": {
      const currentProduct = interaction.options.get("商品名");
      if (!currentProduct || !isString(currentProduct.value)) {
        await interaction.respond([]);
        break;
      }
      const {
        productVariants: { edges: matchedVariants },
      } = await client.getVariantsByProduct({
        input: `product_id:${currentProduct.value.slice(-13)}`,
      });
      await interaction.respond(
        matchedVariants.map((variant) => {
          return {
            name: variant.node.title,
            value: variant.node.id,
          };
        }),
      );
      break;
    }
    default:
      throw new Error("unknwon option name");
  }
};

async function getCurrentSales(productId: string, variantId?: string) {
  if (!variantId) {
    const prevSales = await prisma.salesResults.findMany({
      where: {
        productId,
      },
      include: {
        variantOptions: true,
      },
    });
    const result = structuredClone(prevSales);
    const now = convertToTimeZone(new Date(), { timeZone: "Asia/Tokyo" });
    const today = startOfDay(now);
    await prisma.$transaction(async (tx) => {
      await Promise.all(
        prevSales.map(async ({ variantId }) => {
          const todaySales = await tx.todaySales.findMany({
            where: {
              variantId,
              createdAt: {
                gte: today,
              },
            },
          });
          todaySales.forEach(({ variantId, quantity }) => {
            const index = result.findIndex(
              (sales) => sales.variantId === variantId,
            );
            result[index].currentSold += quantity;
          });
        }),
      );
    });
    return result;
  } else {
    return null;
  }
}

export const execute = async (interaction: CommandInteraction) => {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  const product = interaction.options.get("商品名");
  const variant = interaction.options.get("バリエーション");
  if (!product || !product.value || !isString(product.value)) {
    await interaction.editReply({ content: "エラーが発生しました" });
    return;
  }
  if (variant && !isString(variant.value)) {
    await interaction.editReply({ content: "エラーが発生しました" });
    return;
  }
  const salesResult = await getCurrentSales(
    product.value,
    variant?.value as string | undefined,
  );
  if (!salesResult) {
    await interaction.editReply({
      content: "該当する注文がありませんでした",
    });
    return;
  }
  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(`${salesResult.length}個のバリエーション`)
    .setDescription(`現在の注文数\n`)
    .setTimestamp()
    .addFields(
      salesResult.map((sales) => ({
        name: sales.displayName,
        value: `${sales.currentSold}`,
      })),
    );
  await interaction.editReply({ embeds: [embed] });
};
