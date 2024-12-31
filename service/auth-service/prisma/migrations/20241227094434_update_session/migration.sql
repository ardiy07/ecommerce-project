/*
  Warnings:

  - You are about to drop the column `acces_token` on the `sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sessions` DROP COLUMN `acces_token`,
    ADD COLUMN `access_token` VARCHAR(255) NULL,
    MODIFY `refresh_token` VARCHAR(255) NULL;
