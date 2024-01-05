-- DropForeignKey
ALTER TABLE "cards" DROP CONSTRAINT "cards_columnId_fkey";

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "columns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
