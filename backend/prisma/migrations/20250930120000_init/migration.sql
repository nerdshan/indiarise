-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('mineral', 'agricultural', 'dairy');

-- CreateEnum
CREATE TYPE "JobRoleType" AS ENUM ('technical', 'non_technical');

-- CreateEnum
CREATE TYPE "JobPostingStatus" AS ENUM ('hiring_now', 'upcoming');

-- CreateTable
CREATE TABLE "State" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "id" SERIAL NOT NULL,
    "state_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" "ProductCategory" NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "district_products" (
    "id" SERIAL NOT NULL,
    "district_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "avg_price" DECIMAL(12,2) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "district_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "district_info" (
    "id" SERIAL NOT NULL,
    "district_id" INTEGER NOT NULL,
    "avg_land_cost" DECIMAL(12,2) NOT NULL,
    "electricity_rate_industrial" DECIMAL(8,2) NOT NULL,
    "electricity_fixed_charge" DECIMAL(8,2),
    "electricity_tariff_notes" TEXT,
    "nearest_water_source" TEXT NOT NULL,
    "nearest_national_highway" TEXT NOT NULL,
    "highway_distance_km" DECIMAL(8,2),

    CONSTRAINT "district_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subsidies" (
    "id" SERIAL NOT NULL,
    "district_id" INTEGER NOT NULL,
    "product_id" INTEGER,
    "scheme_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT,

    CONSTRAINT "subsidies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobRole" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "JobRoleType" NOT NULL,

    CONSTRAINT "JobRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_job_postings" (
    "id" SERIAL NOT NULL,
    "company_name" TEXT NOT NULL,
    "district_id" INTEGER NOT NULL,
    "job_role_id" INTEGER NOT NULL,
    "status" "JobPostingStatus" NOT NULL,
    "contact_info" TEXT NOT NULL,

    CONSTRAINT "company_job_postings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DairyUnion" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DairyUnion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "district_dairy_union" (
    "district_id" INTEGER NOT NULL,
    "dairy_union_id" INTEGER NOT NULL,

    CONSTRAINT "district_dairy_union_pkey" PRIMARY KEY ("district_id","dairy_union_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "State_name_key" ON "State"("name");

-- CreateIndex
CREATE UNIQUE INDEX "districts_state_id_name_key" ON "districts"("state_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "district_products_district_id_product_id_key" ON "district_products"("district_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "district_info_district_id_key" ON "district_info"("district_id");

-- CreateIndex
CREATE UNIQUE INDEX "JobRole_name_key" ON "JobRole"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DairyUnion_name_key" ON "DairyUnion"("name");

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "district_products" ADD CONSTRAINT "district_products_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "district_products" ADD CONSTRAINT "district_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "district_info" ADD CONSTRAINT "district_info_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subsidies" ADD CONSTRAINT "subsidies_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subsidies" ADD CONSTRAINT "subsidies_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_job_postings" ADD CONSTRAINT "company_job_postings_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_job_postings" ADD CONSTRAINT "company_job_postings_job_role_id_fkey" FOREIGN KEY ("job_role_id") REFERENCES "JobRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "district_dairy_union" ADD CONSTRAINT "district_dairy_union_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "district_dairy_union" ADD CONSTRAINT "district_dairy_union_dairy_union_id_fkey" FOREIGN KEY ("dairy_union_id") REFERENCES "DairyUnion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
