const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixProductNames() {
  console.log('🔧 Corrigindo nomes dos produtos...\n');
  
  try {
    // Buscar todos os produtos
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    console.log(`📊 Total de produtos: ${products.length}\n`);

    let updatedCount = 0;

    for (const product of products) {
      // Verificar se o nome parece ser uma frase/descrição (mais de 80 caracteres ou contém vírgula ou ponto)
      const nameNeedsFixing = 
        product.name.length > 80 || 
        product.name.includes(', ') || 
        product.name.match(/\.\s/) ||
        product.name.toLowerCase().startsWith('o ') ||
        product.name.toLowerCase().includes(' é ');

      if (nameNeedsFixing && product.description) {
        // Tentar extrair um nome curto da descrição
        const descLines = product.description.split('\n');
        
        // Procurar por um título curto nas primeiras linhas
        let newName = null;
        
        for (const line of descLines.slice(0, 3)) {
          const cleanLine = line.trim();
          // Se encontrar uma linha curta (menos de 100 chars) que parece um título
          if (cleanLine.length > 10 && cleanLine.length <= 100 && !cleanLine.match(/^[a-záàâãéèêíìîóòôõúùûç\s]+$/i)) {
            // Verificar se tem padrão de nome de produto (letras maiúsculas, números, etc)
            if (cleanLine.match(/[A-Z0-9]/)) {
              newName = cleanLine;
              break;
            }
          }
        }

        // Se não encontrou, pegar as primeiras palavras do nome atual até 80 chars
        if (!newName) {
          const words = product.name.split(' ');
          let shortName = '';
          for (const word of words) {
            if ((shortName + ' ' + word).length > 80) break;
            shortName += (shortName ? ' ' : '') + word;
          }
          newName = shortName || product.name.substring(0, 80);
        }

        // Atualizar o produto
        await prisma.product.update({
          where: { id: product.id },
          data: { name: newName },
        });

        console.log(`✅ Produto ${product.id} atualizado:`);
        console.log(`   Antes: "${product.name.substring(0, 80)}..."`);
        console.log(`   Depois: "${newName}"\n`);
        
        updatedCount++;
      }
    }

    console.log(`\n✨ Correção concluída!`);
    console.log(`📊 Produtos atualizados: ${updatedCount} de ${products.length}`);

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixProductNames();
