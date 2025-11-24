
-- AlterTable: Add CASCADE DELETE to category_id foreign key
ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "products_category_id_fkey";

ALTER TABLE "products" 
  ADD CONSTRAINT "products_category_id_fkey" 
  FOREIGN KEY ("category_id") 
  REFERENCES "categories"("id") 
  ON DELETE CASCADE 
  ON UPDATE CASCADE;
