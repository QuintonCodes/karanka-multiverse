/*
  Warnings:

  - You are about to drop the column `tokenPackageId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TokenPackage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productName` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productSlug` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productType` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productSlug` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productType` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."productType" ADD VALUE 'tokenPackage';

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_tokenPackageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PaymentItem" DROP CONSTRAINT "PaymentItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Subscription" DROP CONSTRAINT "Subscription_productId_fkey";

-- AlterTable
ALTER TABLE "public"."Payment" DROP COLUMN "tokenPackageId",
ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "productPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "productSlug" TEXT NOT NULL,
ADD COLUMN     "productTokens" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "productType" "public"."productType" NOT NULL,
ADD COLUMN     "productZar" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."Subscription" ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "productPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "productSlug" TEXT NOT NULL,
ADD COLUMN     "productTokens" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "productType" "public"."productType" NOT NULL,
ADD COLUMN     "productZar" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."Wallet" ALTER COLUMN "chain" DROP DEFAULT;

-- DropTable
DROP TABLE "public"."Product";

-- DropTable
DROP TABLE "public"."TokenPackage";

-- DropEnum
DROP TYPE "public"."slugType";
