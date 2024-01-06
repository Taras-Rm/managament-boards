-- AlterTable
ALTER TABLE "boards" ADD COLUMN     "alias" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "columns" ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;
