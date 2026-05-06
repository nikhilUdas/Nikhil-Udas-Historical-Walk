/*
  Warnings:

  - You are about to drop the column `image_data` on the `HeritageSite` table. All the data in the column will be lost.
  - You are about to drop the column `image_data` on the `HeritageSiteImage` table. All the data in the column will be lost.
  - You are about to drop the column `image_data` on the `Museum` table. All the data in the column will be lost.
  - You are about to drop the column `image_data` on the `MuseumImage` table. All the data in the column will be lost.
  - You are about to drop the column `media_data` on the `Story` table. All the data in the column will be lost.
  - You are about to drop the column `media_url` on the `Story` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pidx]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[qr_code]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - Made the column `media_path` on table `Story` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "HeritageSite" DROP COLUMN "image_data";

-- AlterTable
ALTER TABLE "HeritageSiteImage" DROP COLUMN "image_data";

-- AlterTable
ALTER TABLE "Museum" DROP COLUMN "image_data";

-- AlterTable
ALTER TABLE "MuseumImage" DROP COLUMN "image_data";

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "media_data",
DROP COLUMN "media_url",
ALTER COLUMN "media_path" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "pidx" TEXT,
ADD COLUMN     "qr_code" TEXT,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "visit_date" TIMESTAMP(3),
ALTER COLUMN "purchase_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "ticket_pdf" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "location" TEXT;

-- CreateTable
CREATE TABLE "FavoriteMuseum" (
    "fav_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "museum_id" INTEGER NOT NULL,
    "added_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteMuseum_pkey" PRIMARY KEY ("fav_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteMuseum_user_id_museum_id_key" ON "FavoriteMuseum"("user_id", "museum_id");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_pidx_key" ON "Ticket"("pidx");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_qr_code_key" ON "Ticket"("qr_code");

-- AddForeignKey
ALTER TABLE "FavoriteMuseum" ADD CONSTRAINT "FavoriteMuseum_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteMuseum" ADD CONSTRAINT "FavoriteMuseum_museum_id_fkey" FOREIGN KEY ("museum_id") REFERENCES "Museum"("museum_id") ON DELETE CASCADE ON UPDATE CASCADE;
