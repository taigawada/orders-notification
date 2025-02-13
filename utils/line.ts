import "dotenv/config";

export type Message = {
  type: "text";
  text: string;
}[];

export async function sendLine(messages: Message) {
  const body = JSON.stringify({
    to: process.env.MY_LINE_USER_ID,
    messages,
  });
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.LINE_TOKEN}`,
  };
  try {
    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "post",
      headers,
      body,
    });
    if (!response.ok) {
      throw new Error(
        `status: ${response.status},statusText: ${response.statusText}`,
      );
    }
  } catch (e) {
    return e;
  }
}
