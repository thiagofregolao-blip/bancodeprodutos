const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addCascadeDelete() {
  console.log('🔧 Adicionando CASCADE DELETE na relação Category → Products...\n');
  
  try {
    // Remove a constraint antiga
    console.log('1️⃣ Removendo constraint antiga...');
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "products_category_id_fkey";'
    );
    console.log('✅ Constraint antiga removida\n');
    
    // Adiciona a nova constraint com CASCADE
    console.log('2️⃣ Adicionando nova constraint com CASCADE DELETE...');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "products" 
        ADD CONSTRAINT "products_category_id_fkey" 
        FOREIGN KEY ("category_id") 
        REFERENCES "categories"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE;
    `);
    console.log('✅ Constraint adicionada com sucesso!\n');
    
    console.log('🎉 PRONTO! Agora ao deletar uma categoria, todos os produtos dela serão deletados automaticamente!\n');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addCascadeDelete();
