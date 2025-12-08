-- CreateTable
CREATE TABLE "_SportToUserDevice" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SportToUserDevice_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SportToUserDevice_B_index" ON "_SportToUserDevice"("B");

-- AddForeignKey
ALTER TABLE "_SportToUserDevice" ADD CONSTRAINT "_SportToUserDevice_A_fkey" FOREIGN KEY ("A") REFERENCES "Sport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SportToUserDevice" ADD CONSTRAINT "_SportToUserDevice_B_fkey" FOREIGN KEY ("B") REFERENCES "UserDevice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
