import { prisma } from './lib/prisma';

async function testConnection() {
    console.log('🔍 Testando conexão com o banco de dados Neon...');
    console.log('');

    try {
        // Teste 1: Contar usuários
        const userCount = await prisma.user.count();
        console.log('✅ Conexão estabelecida com sucesso!');
        console.log('');

        // Teste 2: Buscar estatísticas
        console.log('📊 Estatísticas do banco:');
        console.log(`   • Usuários: ${userCount}`);
        console.log(`   • Clientes: ${await prisma.customer.count()}`);
        console.log(`   • Contratos: ${await prisma.contract.count()}`);
        console.log(`   • Veículos: ${await prisma.vehicle.count()}`);
        console.log(`   • Faturas: ${await prisma.invoice.count()}`);
        console.log(`   • Entregas: ${await prisma.delivery.count()}`);
        console.log(`   • Solicitações de Pagamento: ${await prisma.paymentRequest.count()}`);
        console.log(`   • Pessoas: ${await prisma.person.count()}`);
        console.log(`   • Mensagens do Bot: ${await prisma.botMessage.count()}`);
        console.log('');

        // Teste 3: Buscar um registro de exemplo
        const firstCustomer = await prisma.customer.findFirst({
            include: {
                contracts: true,
            },
        });

        if (firstCustomer) {
            console.log('📋 Exemplo de cliente com contratos:');
            console.log(`   Nome: ${firstCustomer.name}`);
            console.log(`   CNPJ: ${firstCustomer.cnpj}`);
            console.log(`   Contratos: ${firstCustomer.contracts.length}`);
            console.log('');
        }

        console.log('🎉 Todos os testes passaram!');

    } catch (error) {
        console.error('');
        console.error('❌ Erro ao conectar com o banco de dados:');
        console.error('');
        console.error(error);
        console.error('');
        console.error('💡 Verifique:');
        console.error('   1. Se a DATABASE_URL está correta no arquivo .env');
        console.error('   2. Se o banco de dados Neon está acessível');
        console.error('   3. Se você executou "npx prisma db push"');
        console.error('');
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
