-- CreateEnum
CREATE TYPE "VerticalEnum" AS ENUM ('FASHION', 'HOME', 'GENERAL');

-- CreateTable
CREATE TABLE "Catalog" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL,
    "verticalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Catalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vertical" (
    "id" TEXT NOT NULL,
    "name" "VerticalEnum" NOT NULL,

    CONSTRAINT "Vertical_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locale" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Locale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatalogLocale" (
    "catalogId" TEXT NOT NULL,
    "localeId" TEXT NOT NULL,

    CONSTRAINT "CatalogLocale_pkey" PRIMARY KEY ("catalogId","localeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Catalog_name_key" ON "Catalog"("name");

-- CreateIndex
CREATE INDEX "Catalog_id_userId_idx" ON "Catalog"("id", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Vertical_name_key" ON "Vertical"("name");

-- CreateIndex
CREATE INDEX "Vertical_id_name_idx" ON "Vertical"("id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Locale_name_key" ON "Locale"("name");

-- CreateIndex
CREATE INDEX "Locale_id_name_idx" ON "Locale"("id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "CatalogLocale_catalogId_localeId_idx" ON "CatalogLocale"("catalogId", "localeId");

-- AddForeignKey
ALTER TABLE "Catalog" ADD CONSTRAINT "Catalog_verticalId_fkey" FOREIGN KEY ("verticalId") REFERENCES "Vertical"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Catalog" ADD CONSTRAINT "Catalog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatalogLocale" ADD CONSTRAINT "CatalogLocale_localeId_fkey" FOREIGN KEY ("localeId") REFERENCES "Locale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatalogLocale" ADD CONSTRAINT "CatalogLocale_catalogId_fkey" FOREIGN KEY ("catalogId") REFERENCES "Catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
