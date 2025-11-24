-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itineraries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "num_days" INTEGER NOT NULL,
    "budget" TEXT NOT NULL,
    "age_groups" TEXT[],
    "party_size" INTEGER NOT NULL,
    "activity_level" TEXT NOT NULL,
    "itinerary_data" JSONB NOT NULL,
    "name" TEXT,
    "regeneration_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "itineraries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "itineraries_user_id_idx" ON "itineraries"("user_id");

-- CreateIndex
CREATE INDEX "itineraries_destination_idx" ON "itineraries"("destination");

-- CreateIndex
CREATE INDEX "itineraries_created_at_idx" ON "itineraries"("created_at");

-- AddForeignKey
ALTER TABLE "itineraries" ADD CONSTRAINT "itineraries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
