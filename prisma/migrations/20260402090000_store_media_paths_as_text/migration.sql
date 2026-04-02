-- Convert binary media columns to path-string columns.
-- Existing byte data is encoded to base64 text for backward compatibility.

ALTER TABLE "User"
  ALTER COLUMN "profile_image" TYPE TEXT
  USING CASE
    WHEN "profile_image" IS NULL THEN NULL
    ELSE encode("profile_image", 'base64')
  END;

ALTER TABLE "HeritageSite"
  ALTER COLUMN "image_data" TYPE TEXT
  USING CASE
    WHEN "image_data" IS NULL THEN NULL
    ELSE encode("image_data", 'base64')
  END;

ALTER TABLE "HeritageSiteImage"
  ALTER COLUMN "image_data" TYPE TEXT
  USING encode("image_data", 'base64');

ALTER TABLE "Museum"
  ALTER COLUMN "image_data" TYPE TEXT
  USING CASE
    WHEN "image_data" IS NULL THEN NULL
    ELSE encode("image_data", 'base64')
  END;

ALTER TABLE "MuseumImage"
  ALTER COLUMN "image_data" TYPE TEXT
  USING encode("image_data", 'base64');

ALTER TABLE "Story"
  ALTER COLUMN "media_data" TYPE TEXT
  USING CASE
    WHEN "media_data" IS NULL THEN NULL
    ELSE encode("media_data", 'base64')
  END;
