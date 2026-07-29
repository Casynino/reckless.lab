-- Admin-assignable courier + courier tracking number on orders
ALTER TABLE "Order" ADD COLUMN "courier" TEXT;
ALTER TABLE "Order" ADD COLUMN "courierTracking" TEXT;
