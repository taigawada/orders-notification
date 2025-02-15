-- CreateTable
CREATE TABLE "SalesResults" (
    "variantId" TEXT NOT NULL PRIMARY KEY,
    "displayName" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productTitle" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "currentSold" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "VariantOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "SalesResultsVariantId" TEXT NOT NULL,
    CONSTRAINT "VariantOption_SalesResultsVariantId_fkey" FOREIGN KEY ("SalesResultsVariantId") REFERENCES "SalesResults" ("variantId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TodaySales" (
    "orderId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("orderId", "variantId")
);
