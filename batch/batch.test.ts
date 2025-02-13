import { convertToTimeZone } from "date-fns-timezone";
import { deleteLessThanYesterdaySales } from "./batch";
import { startOfDay } from "date-fns";

test("deleteLessThanYesterdaySales", async () => {
  const now = convertToTimeZone(new Date(), { timeZone: "Asia/Tokyo" });
  const today = startOfDay(now);
  await deleteLessThanYesterdaySales(today);
});
