-- Persist the full shipping address on each order
ALTER TABLE "Order" ADD COLUMN "address1" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "address2" TEXT;
ALTER TABLE "Order" ADD COLUMN "city" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "region" TEXT;
ALTER TABLE "Order" ADD COLUMN "postalCode" TEXT;
