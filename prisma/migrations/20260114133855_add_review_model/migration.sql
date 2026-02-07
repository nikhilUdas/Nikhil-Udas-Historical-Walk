-- CreateTable
CREATE TABLE "Review" (
    "review_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "museum_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "thoughts" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("review_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Review_user_id_museum_id_key" ON "Review"("user_id", "museum_id");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_museum_id_fkey" FOREIGN KEY ("museum_id") REFERENCES "Museum"("museum_id") ON DELETE CASCADE ON UPDATE CASCADE;
