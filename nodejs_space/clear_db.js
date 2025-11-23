const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    console.log('🗑️  Deletando todos os dados...');
    
    // Deletar na ordem correta (respeitar foreign keys)
    const imagesDeleted = await prisma.image.deleteMany({});
    console.log(`✅ ${imagesDeleted.count} imagens deletadas`);
    
    const productsDeleted = await prisma.product.deleteMany({});
    console.log(`✅ ${productsDeleted.count} produtos deletados`);
    
    const categoriesDeleted = await prisma.category.deleteMany({});
    console.log(`✅ ${categoriesDeleted.count} categorias deletadas`);
    
    console.log('\n✅ TUDO LIMPO! Banco de dados zerado.');
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
