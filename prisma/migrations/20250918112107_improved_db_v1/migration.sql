/*
  Warnings:

  - You are about to drop the column `productZar` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `productZar` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Wallet` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."paymentMethod" ADD VALUE 'eft';
ALTER TYPE "public"."paymentMethod" ADD VALUE 'creditCard';
ALTER TYPE "public"."paymentMethod" ADD VALUE 'crypto';

-- AlterTable
ALTER TABLE "public"."Payment" DROP COLUMN "productZar",
ALTER COLUMN "paymentMethod" DROP NOT NULL,
ALTER COLUMN "productTokens" SET DEFAULT 0,
ALTER COLUMN "productTokens" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "public"."Subscription" DROP COLUMN "productZar",
ADD COLUMN     "amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
ALTER COLUMN "productTokens" SET DEFAULT 0,
ALTER COLUMN "productTokens" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "public"."Transaction" ALTER COLUMN "paymentMethod" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Wallet" DROP COLUMN "value",
ADD COLUMN     "valueZar" DECIMAL(65,30) NOT NULL DEFAULT 0;
