import { BaseGuildTextChannel, EmbedBuilder } from "discord.js";
import { OrdersCreate } from "../@types/payload";
import discord from "../utils/discord";
import prisma from "../utils/prisma";

export async function createTodaySales(payload: OrdersCreate) {
  await prisma.todaySales.createMany({
    data: payload.line_items.map((lineItem) => ({
      orderId: payload.admin_graphql_api_id,
      variantId: `gid://shopify/ProductVariant/${lineItem.variant_id}`,
      quantity: lineItem.current_quantity,
    })),
  });
}

export async function sendOrder(payload: OrdersCreate) {
  const channel: BaseGuildTextChannel = discord.channels.cache.get(
    process.env.DISCORD_CHANNEL_ID!,
  ) as BaseGuildTextChannel;

  const nickName = payload.shipping_address.company;
  const realName = payload.shipping_address.name;
  // LineItem Sample
  // { name: "・単独衣装チェキ ×8", value: "あみな/なし", inline: false }
  const lineItems = payload.line_items.map((lineItem) => ({
    name: `${lineItem.title} \u00d7 ${lineItem.quantity}`,
    value: `${lineItem.variant_title ? lineItem.variant_title : "\n"}`,
    inline: false,
  }));
  const amount = parseInt(payload.total_line_items_price).toLocaleString();

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(
      `オンラインストアから${lineItems.length}アイテムの新しい注文がありました`,
    )
    .setDescription(`**${nickName}**\n${realName}\n`)
    .addFields(...lineItems)
    .setFooter({ text: `合計金額は${amount}円です` })
    .setTimestamp();
  await channel.send({ embeds: [embed] });
}

export async function ordersCreateProcess(payload: OrdersCreate) {
  await Promise.all([sendOrder(payload), createTodaySales(payload)]);
}
