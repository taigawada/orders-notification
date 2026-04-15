import { deleteLessThanYesterdaySales } from "./batch";
import prisma from "../utils/prisma";

jest.mock("../utils/prisma", () => ({
  __esModule: true,
  default: {
    todaySales: {
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
  },
}));

jest.mock("../graphql-codegen", () => ({
  __esModule: true,
  Graphql: jest.fn().mockImplementation(() => ({
    admin: {},
  })),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test("deleteLessThanYesterdaySales", async () => {
  const today = new Date("2025-02-10T00:00:00+09:00");
  await deleteLessThanYesterdaySales(today);

  expect(prisma.todaySales.deleteMany).toHaveBeenCalledTimes(1);
  expect(prisma.todaySales.deleteMany).toHaveBeenCalledWith({
    where: {
      createdAt: {
        lt: today,
      },
    },
  });
});
