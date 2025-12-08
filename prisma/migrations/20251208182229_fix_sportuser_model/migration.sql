/*
  Warnings:

  - You are about to drop the `_SportToUserDevice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SportToUserDevice" DROP CONSTRAINT "_SportToUserDevice_A_fkey";

-- DropForeignKey
ALTER TABLE "_SportToUserDevice" DROP CONSTRAINT "_SportToUserDevice_B_fkey";

-- DropTable
DROP TABLE "_SportToUserDevice";

-- CreateTable
CREATE TABLE "SportUser" (
    "id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "sport_id" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "SportUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SportUser" ADD CONSTRAINT "SportUser_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "UserDevice"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SportUser" ADD CONSTRAINT "SportUser_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "Sport"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
