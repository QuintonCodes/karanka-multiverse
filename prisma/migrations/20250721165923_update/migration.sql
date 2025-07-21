/*
  Warnings:

  - You are about to drop the column `blockHash` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `privateKey` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `publicKey` on the `Wallet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[txHash]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `isVerified` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "productType" AS ENUM ('onceOff', 'subscription', 'unavailable');

-- CreateEnum
CREATE TYPE "slugType" AS ENUM ('basic', 'pro', 'premium');

-- CreateEnum
CREATE TYPE "subStatus" AS ENUM ('active', 'cancelled', 'expired');

-- AlterEnum
ALTER TYPE "paymentStatus" ADD VALUE 'expired';

-- DropIndex
DROP INDEX "Wallet_privateKey_key";

-- DropIndex
DROP INDEX "Wallet_publicKey_key";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "productId" TEXT,
ADD COLUMN     "tokenPackageId" TEXT;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "blockHash",
ADD COLUMN     "confirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "txHash" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "privateKey",
DROP COLUMN "publicKey",
ADD COLUMN     "chain" TEXT NOT NULL DEFAULT 'bsc',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "OtpCode" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "zarPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "image" TEXT,
    "tokens" INTEGER NOT NULL,
    "productType" "productType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenPackage" (
    "id" TEXT NOT NULL,
    "slug" "slugType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "tokens" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "zarPrice" DECIMAL(65,30) NOT NULL,
    "features" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "paymentId" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "cancelledAt" TIMESTAMP(3),
    "autoRenew" BOOLEAN NOT NULL DEFAULT false,
    "status" "subStatus" NOT NULL DEFAULT 'active',

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OtpCode_code_key" ON "OtpCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TokenPackage_slug_key" ON "TokenPackage"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_paymentId_key" ON "Subscription"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_txHash_key" ON "Transaction"("txHash");

-- AddForeignKey
ALTER TABLE "OtpCode" ADD CONSTRAINT "OtpCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_tokenPackageId_fkey" FOREIGN KEY ("tokenPackageId") REFERENCES "TokenPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
