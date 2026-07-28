-- Promotions engine: richer coupons + order discount
ALTER TYPE "CouponType" ADD VALUE IF NOT EXISTS 'FREE_SHIPPING';

ALTER TABLE "Coupon" ADD COLUMN "description" TEXT;
ALTER TABLE "Coupon" ADD COLUMN "minSubtotal" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Coupon" ADD COLUMN "firstOrderOnly" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Coupon" ADD COLUMN "startsAt" TIMESTAMP(3);

ALTER TABLE "Order" ADD COLUMN "discount" INTEGER NOT NULL DEFAULT 0;
