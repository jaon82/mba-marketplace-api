/*
  Warnings:

  - You are about to drop the `_AttachmentToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AttachmentToProduct" DROP CONSTRAINT "_AttachmentToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_AttachmentToProduct" DROP CONSTRAINT "_AttachmentToProduct_B_fkey";

-- AlterTable
ALTER TABLE "attachments" ADD COLUMN     "product_id" TEXT;

-- DropTable
DROP TABLE "_AttachmentToProduct";

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
