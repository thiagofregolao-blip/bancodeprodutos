const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function recreateKeys() {
  try {
    console.log('🔑 Recriando API keys...');
    
    const keys = await prisma.apiKey.createMany({
      data: [
        {
          key: 'pk_readonly_demo123',
          name: 'Chave Pública - Apenas Leitura',
          isActive: true,
          isAdmin: false,
        },
        {
          key: 'sk_admin_master456',
          name: 'Chave Admin - Acesso Total',
          isActive: true,
          isAdmin: true,
        },
      ],
    });
    
    console.log(`✅ ${keys.count} API keys recriadas com sucesso!`);
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

recreateKeys();
