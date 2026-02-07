-- CreateTable
CREATE TABLE "Admin" (
    "admin_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "UserOTP" (
    "otp_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "otp_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserOTP_pkey" PRIMARY KEY ("otp_id")
);

-- CreateTable
CREATE TABLE "HeritageSite" (
    "site_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL,
    "gps_coordinates" TEXT NOT NULL,

    CONSTRAINT "HeritageSite_pkey" PRIMARY KEY ("site_id")
);

-- CreateTable
CREATE TABLE "Museum" (
    "museum_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "opening_hours" TEXT NOT NULL,

    CONSTRAINT "Museum_pkey" PRIMARY KEY ("museum_id")
);

-- CreateTable
CREATE TABLE "Story" (
    "story_id" SERIAL NOT NULL,
    "site_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "god_or_goddess_name" TEXT NOT NULL,
    "media_url" TEXT NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("story_id")
);

-- CreateTable
CREATE TABLE "MapRoute" (
    "route_id" SERIAL NOT NULL,
    "site_id" INTEGER NOT NULL,
    "start_location" TEXT NOT NULL,
    "end_location" TEXT NOT NULL,
    "distance" TEXT NOT NULL,
    "estimated_time" TEXT NOT NULL,

    CONSTRAINT "MapRoute_pkey" PRIMARY KEY ("route_id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "ticket_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "museum_id" INTEGER NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL,
    "ticket_pdf" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "payment_status" TEXT NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("ticket_id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "payment_id" SERIAL NOT NULL,
    "ticket_id" INTEGER NOT NULL,
    "payment_method" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "FavoriteSite" (
    "fav_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "site_id" INTEGER NOT NULL,
    "added_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteSite_pkey" PRIMARY KEY ("fav_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteSite_user_id_site_id_key" ON "FavoriteSite"("user_id", "site_id");

-- AddForeignKey
ALTER TABLE "UserOTP" ADD CONSTRAINT "UserOTP_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "HeritageSite"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapRoute" ADD CONSTRAINT "MapRoute_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "HeritageSite"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_museum_id_fkey" FOREIGN KEY ("museum_id") REFERENCES "Museum"("museum_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "Ticket"("ticket_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteSite" ADD CONSTRAINT "FavoriteSite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteSite" ADD CONSTRAINT "FavoriteSite_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "HeritageSite"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;
