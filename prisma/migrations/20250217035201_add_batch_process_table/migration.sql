-- CreateTable
CREATE TABLE "BatchProcess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startedAt" DATETIME NOT NULL,
    "finishedAt" DATETIME,
    "isSuccess" BOOLEAN NOT NULL DEFAULT false
);
