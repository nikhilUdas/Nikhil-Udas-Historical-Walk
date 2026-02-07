/*
  Warnings:

  - You are about to drop the column `location` on the `Museum` table. All the data in the column will be lost.
  - Added the required column `gps_coordinates` to the `Museum` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Museum" ADD COLUMN "gps_coordinates" TEXT;

-- Set default value for existing records based on location
UPDATE "Museum" SET "gps_coordinates" = '0°N, 0°E' WHERE "gps_coordinates" IS NULL;

-- Make gps_coordinates required
ALTER TABLE "Museum" ALTER COLUMN "gps_coordinates" SET NOT NULL;

-- Drop location column
ALTER TABLE "Museum" DROP COLUMN "location";
