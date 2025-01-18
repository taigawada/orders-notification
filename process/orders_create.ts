import { BaseGuildTextChannel, EmbedBuilder } from "discord.js";
import { OrdersCreate } from "../@types/payload";
import discord from "../discord";

export async function ordersCreateProcess(payload: OrdersCreate) {
  const channel: BaseGuildTextChannel = discord.channels.cache.get(
    "1305201158884692079",
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
