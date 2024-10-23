/*
  Warnings:

  - You are about to drop the column `factoryId` on the `Emission` table. All the data in the column will be lost.
  - You are about to drop the column `pollutantId` on the `Emission` table. All the data in the column will be lost.
  - You are about to alter the column `destination` on the `Emission` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to drop the column `email` on the `Factory` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `Factory` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `location` on the `Factory` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the column `content` on the `Pollutant` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Pollutant` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Pollutant` table. All the data in the column will be lost.
  - Added the required column `factory_id` to the `Emission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pollutant_id` to the `Emission` table without a default value. This is not possible if the table is not empty.
  - Made the column `destination` on table `Emission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Factory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `Factory` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `name` to the `Pollutant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Emission" DROP CONSTRAINT "Emission_factoryId_fkey";

-- DropForeignKey
ALTER TABLE "Emission" DROP CONSTRAINT "Emission_pollutantId_fkey";

-- DropIndex
DROP INDEX "Factory_email_key";

-- AlterTable
ALTER TABLE "Emission" DROP COLUMN "factoryId",
DROP COLUMN "pollutantId",
ADD COLUMN     "factory_id" INTEGER NOT NULL,
ADD COLUMN     "pollutant_id" INTEGER NOT NULL,
ALTER COLUMN "destination" SET NOT NULL,
ALTER COLUMN "destination" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Factory" DROP COLUMN "email",
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "location" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Pollutant" DROP COLUMN "content",
DROP COLUMN "published",
DROP COLUMN "title",
ADD COLUMN     "name" VARCHAR(100) NOT NULL;

-- AddForeignKey
ALTER TABLE "Emission" ADD CONSTRAINT "Emission_factory_id_fkey" FOREIGN KEY ("factory_id") REFERENCES "Factory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emission" ADD CONSTRAINT "Emission_pollutant_id_fkey" FOREIGN KEY ("pollutant_id") REFERENCES "Pollutant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
