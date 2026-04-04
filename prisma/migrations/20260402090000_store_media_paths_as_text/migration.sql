-- Reconstruct missing foundations of the schema
-- This includes creating tables and columns that were missing from previous migrations

-- 1. Create missing tables
CREATE TABLE IF NOT EXISTS "HeritageSiteImage" (
    "image_id" SERIAL NOT NULL,
    "site_id" INTEGER NOT NULL,
    "image_path" TEXT NOT NULL,
    "image_data" TEXT,
    CONSTRAINT "HeritageSiteImage_pkey" PRIMARY KEY ("image_id")
);

CREATE TABLE IF NOT EXISTS "MuseumImage" (
    "image_id" SERIAL NOT NULL,
    "museum_id" INTEGER NOT NULL,
    "image_path" TEXT NOT NULL,
    "image_data" TEXT,
    CONSTRAINT "MuseumImage_pkey" PRIMARY KEY ("image_id")
);

CREATE TABLE IF NOT EXISTS "StoryPayment" (
    "payment_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "story_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_method" TEXT NOT NULL,
    "pidx" TEXT,
    "transaction_uuid" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StoryPayment_pkey" PRIMARY KEY ("payment_id")
);

CREATE TABLE IF NOT EXISTS "SitePayment" (
    "payment_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "site_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_method" TEXT NOT NULL,
    "pidx" TEXT,
    "transaction_uuid" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SitePayment_pkey" PRIMARY KEY ("payment_id")
);

-- 2. Add missing columns to existing tables
ALTER TABLE "HeritageSite" ADD COLUMN IF NOT EXISTS "image_path" TEXT;
ALTER TABLE "Museum" ADD COLUMN IF NOT EXISTS "image_path" TEXT;

-- 3. Sync Story media (media_url -> media_data -> media_path)
ALTER TABLE "Story" ADD COLUMN IF NOT EXISTS "media_path" TEXT;
ALTER TABLE "Story" ADD COLUMN IF NOT EXISTS "media_data" TEXT;

-- 4. Update Review table
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "site_id" INTEGER;
ALTER TABLE "Review" ALTER COLUMN "museum_id" DROP NOT NULL;

-- 5. Add unique constraints for SitePayment, StoryPayment, Review, and FavoriteSite
CREATE UNIQUE INDEX IF NOT EXISTS "StoryPayment_pidx_key" ON "StoryPayment"("pidx");
CREATE UNIQUE INDEX IF NOT EXISTS "StoryPayment_transaction_uuid_key" ON "StoryPayment"("transaction_uuid");
CREATE UNIQUE INDEX IF NOT EXISTS "SitePayment_pidx_key" ON "SitePayment"("pidx");
CREATE UNIQUE INDEX IF NOT EXISTS "SitePayment_transaction_uuid_key" ON "SitePayment"("transaction_uuid");
CREATE UNIQUE INDEX IF NOT EXISTS "Review_user_id_site_id_key" ON "Review"("user_id", "site_id");

-- 6. Add Foreign Keys for new tables
ALTER TABLE "HeritageSiteImage" ADD CONSTRAINT "HeritageSiteImage_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "HeritageSite"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MuseumImage" ADD CONSTRAINT "MuseumImage_museum_id_fkey" FOREIGN KEY ("museum_id") REFERENCES "Museum"("museum_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StoryPayment" ADD CONSTRAINT "StoryPayment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StoryPayment" ADD CONSTRAINT "StoryPayment_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "Story"("story_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SitePayment" ADD CONSTRAINT "SitePayment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SitePayment" ADD CONSTRAINT "SitePayment_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "HeritageSite"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "HeritageSite"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 7. Ensure image/media types are TEXT (already should be based on previous migrations, but let's be sure)
ALTER TABLE "User" ALTER COLUMN "profile_image" TYPE TEXT;
ALTER TABLE "HeritageSite" ALTER COLUMN "image_data" TYPE TEXT;
ALTER TABLE "Museum" ALTER COLUMN "image_data" TYPE TEXT;

-- Drop old columns if needed (only if you're sure we don't need them and they exist)
-- ALTER TABLE "Story" DROP COLUMN IF EXISTS "media_url";
