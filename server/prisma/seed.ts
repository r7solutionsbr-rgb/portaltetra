import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ==========================================
// HELPERS
// ==========================================
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number) => parseFloat((Math.random() * (max - min) + min).toFixed(2));
const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const subDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// ==========================================
// DATA CONSTANTS
// ==========================================
const SEGMENTS = ['Transporte', 'Agro', 'Indústria', 'Posto de Combustível', 'Mineração'];
const PRODUCTS = ['Diesel S-10', 'Diesel S-500', 'Arla 32', 'Etanol Hidratado', 'Gasolina C'];
const VEHICLE_MODELS = ['Scania R450', 'Volvo FH540', 'Mercedes-Benz Actros', 'DAF XF', 'Iveco Stralis'];
const PAYMENT_CATEGORIES = ['Fornecedor', 'Imposto', 'Serviço', 'Reembolso', 'Manutenção', 'Combustível'];
const BENEFICIARIES = ['Petrobras Distribuidora', 'Shell Brasil', 'Ipiranga', 'Michelin Pneus', 'Seguradora Líder', 'Governo Federal'];
const CITIES = ['São Paulo, SP', 'Campinas, SP', 'Ribeirão Preto, SP', 'Santos, SP', 'Sorocaba, SP', 'Uberlândia, MG', 'Curitiba, PR', 'Londrina, PR'];

async function main() {
  console.log('🧹 Limpando banco de dados...');

  // Delete in order to respect foreign keys
  await prisma.botMessage.deleteMany();
  await prisma.person.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.paymentRequest.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  console.log('✅ Banco limpo!');
  console.log('');
  console.log('🌱 Iniciando Super Seed Tetra OIL...');

  // ============================================
  // 1. COMPANY & USERS
  // ============================================
  console.log('🏢 Criando Tetra OIL Matriz...');
  const company = await prisma.company.create({
    data: {
      name: 'Tetra OIL Matriz',
      cnpj: '12.345.678/0001-90',
      primaryColor: '#2563EB', // Blue-600
      logoUrl: 'https://via.placeholder.com/150/2563EB/FFFFFF?text=Tetra+OIL',
      settings: {
        theme: 'dark',
        notifications: true,
        features: ['dashboard', 'finance', 'fleet', 'crm']
      }
    }
  });

  const hashedPassword = await bcrypt.hash('123456', 10);

  await prisma.user.createMany({
    data: [
      {
        name: 'Administrador',
        email: 'admin@tetraoil.com.br',
        password: hashedPassword,
        companyId: company.id,
        role: 'Gestor',
        avatarUrl: 'https://i.pravatar.cc/150?u=admin',
        isActive: true,
      },
      {
        name: 'Ana Financeiro',
        email: 'financeiro@tetraoil.com.br',
        password: hashedPassword,
        companyId: company.id,
        role: 'Financeiro',
        avatarUrl: 'https://i.pravatar.cc/150?u=ana',
        isActive: true,
      },
      {
        name: 'Carlos Vendas',
        email: 'vendas@tetraoil.com.br',
        password: hashedPassword,
        companyId: company.id,
        role: 'Comercial',
        avatarUrl: 'https://i.pravatar.cc/150?u=carlos',
        isActive: true,
      },
      {
        name: 'Roberto Operações',
        email: 'ops@tetraoil.com.br',
        password: hashedPassword,
        companyId: company.id,
        role: 'Operacional',
        avatarUrl: 'https://i.pravatar.cc/150?u=roberto',
        isActive: true,
      }
    ]
  });
  console.log('   ✓ Usuários criados');

  // ============================================
  // 2. CUSTOMERS (30)
  // ============================================
  console.log('👥 Criando 30 Clientes...');
  const customersData = [];
  for (let i = 1; i <= 30; i++) {
    customersData.push({
      name: `Cliente Tetra ${i} ${randomItem(['Ltda', 'S.A.', 'Transportes', 'Agro'])}`,
      cnpj: `${randomInt(10, 99)}.${randomInt(100, 999)}.${randomInt(100, 999)}/0001-${randomInt(10, 99)}`,
      segment: randomItem(SEGMENTS),
      status: Math.random() > 0.1 ? 'Ativo' : 'Bloqueado', // 10% blocked
      creditLimit: randomFloat(50000, 500000),
      salesperson: randomItem(['Carlos Vendas', 'Mariana Lima', 'Ricardo Alves']),
    });
  }

  // Create customers and get their IDs
  // Prisma createMany doesn't return IDs, so we loop or use a transaction. 
  // For seed simplicity, we'll loop create to get IDs for contracts.
  const createdCustomers = [];
  for (const data of customersData) {
    const c = await prisma.customer.create({ data });
    createdCustomers.push(c);
  }
  console.log('   ✓ Clientes criados');

  // ============================================
  // 3. CONTRACTS (45)
  // ============================================
  console.log('📄 Criando 45 Contratos...');
  for (let i = 1; i <= 45; i++) {
    const customer = randomItem(createdCustomers);
    const totalVolume = randomInt(10000, 500000);

    // 20% of contracts near completion (alert test)
    let consumedVolume;
    if (Math.random() < 0.2) {
      consumedVolume = Math.floor(totalVolume * randomFloat(0.90, 0.99));
    } else {
      consumedVolume = Math.floor(totalVolume * randomFloat(0.1, 0.8));
    }

    await prisma.contract.create({
      data: {
        customerId: customer.id,
        contractNumber: `CT-2023-${1000 + i}`,
        startDate: subDays(new Date(), randomInt(30, 365)).toLocaleDateString('pt-BR'),
        endDate: addDays(new Date(), randomInt(30, 365)).toLocaleDateString('pt-BR'),
        totalVolume,
        consumedVolume,
        unitPrice: randomFloat(4.50, 6.20),
        product: randomItem(PRODUCTS),
        status: 'Ativo',
      }
    });
  }
  console.log('   ✓ Contratos criados');

  // ============================================
  // 4. VEHICLES (50)
  // ============================================
  console.log('🚛 Criando 50 Veículos...');
  const vehiclesData = [];
  for (let i = 1; i <= 50; i++) {
    const status = Math.random() > 0.1 ? 'Operacional' : (Math.random() > 0.5 ? 'Em Manutenção' : 'Inativo');
    vehiclesData.push({
      plate: `${String.fromCharCode(65 + randomInt(0, 25))}${String.fromCharCode(65 + randomInt(0, 25))}${String.fromCharCode(65 + randomInt(0, 25))}-${randomInt(1000, 9999)}`,
      model: randomItem(VEHICLE_MODELS),
      driver: `Motorista ${i}`,
      lastInspection: subDays(new Date(), randomInt(1, 180)).toLocaleDateString('pt-BR'),
      nextInspection: addDays(new Date(), randomInt(1, 180)).toLocaleDateString('pt-BR'),
      status,
    });
  }
  await prisma.vehicle.createMany({ data: vehiclesData });
  console.log('   ✓ Veículos criados');

  // ============================================
  // 5. INVOICES (150)
  // ============================================
  console.log('💰 Criando 150 Faturas (Histórico 6 meses)...');
  const invoicesData = [];
  const today = new Date();

  for (let i = 1; i <= 150; i++) {
    const issueDate = subDays(today, randomInt(1, 180));
    const dueDate = addDays(issueDate, 30);

    let status = 'Em Aberto';
    // Logic for status based on date
    if (dueDate < today) {
      status = Math.random() > 0.2 ? 'Paga' : 'Vencida'; // 20% chance of being overdue if past due date
    } else {
      status = Math.random() > 0.7 ? 'Paga' : 'Em Aberto'; // Some paid in advance
    }

    invoicesData.push({
      id: `NF-${2023000 + i}`,
      issueDate: issueDate.toLocaleDateString('pt-BR'),
      dueDate: dueDate.toLocaleDateString('pt-BR'),
      amount: randomFloat(2000, 50000),
      status,
    });
  }
  await prisma.invoice.createMany({ data: invoicesData });
  console.log('   ✓ Faturas criadas');

  // ============================================
  // 6. PAYMENT REQUESTS (50)
  // ============================================
  console.log('💸 Criando 50 Solicitações de Pagamento...');
  const requestsData = [];
  for (let i = 1; i <= 50; i++) {
    const requestDate = subDays(today, randomInt(0, 60));
    const status = Math.random() > 0.5 ? 'Pendente' : (Math.random() > 0.5 ? 'Aprovado' : 'Rejeitado');

    requestsData.push({
      id: `REQ-${1000 + i}`,
      invoiceId: `NF-EXT-${randomInt(1000, 9999)}`,
      amount: randomFloat(500, 15000),
      requester: randomItem(['Financeiro', 'Gestor', 'Operacional']),
      requestDate: requestDate.toLocaleDateString('pt-BR'),
      status,
      beneficiary: randomItem(BENEFICIARIES),
      dueDate: addDays(requestDate, 15).toISOString().split('T')[0],
      category: randomItem(PAYMENT_CATEGORIES),
      description: `Pagamento de ${randomItem(PAYMENT_CATEGORIES)} referente ao mês anterior`,
      priority: Math.random() > 0.8 ? 'Alta' : 'Normal',
      attachmentUrl: 'https://example.com/boleto.pdf',
    });
  }
  await prisma.paymentRequest.createMany({ data: requestsData });
  console.log('   ✓ Solicitações criadas');

  // ============================================
  // 7. DELIVERIES (80)
  // ============================================
  console.log('🚚 Criando 80 Entregas...');
  const deliveriesData = [];
  for (let i = 1; i <= 80; i++) {
    const date = subDays(today, randomInt(-10, 60)); // -10 means 10 days in future
    let status = 'Entregue';

    if (date > today) status = 'Agendado';
    else if (date.getDate() === today.getDate()) status = Math.random() > 0.5 ? 'Em Trânsito' : 'Solicitado';
    else status = Math.random() > 0.05 ? 'Entregue' : 'Cancelado'; // 5% cancelled in past

    deliveriesData.push({
      id: `ENT-${5000 + i}`,
      orderId: `PED-${9000 + i}`,
      date: date.toLocaleString('pt-BR'),
      product: randomItem(PRODUCTS),
      volume: randomInt(1000, 15000),
      status,
      deliveryLat: -23.5505 + (Math.random() - 0.5) * 0.5, // Spread around SP
      deliveryLng: -46.6333 + (Math.random() - 0.5) * 0.5,
      deliveryAddress: randomItem(CITIES),
      proofOfDeliveryUrl: status === 'Entregue' ? `https://picsum.photos/seed/${i}/400/300` : '',
    });
  }
  await prisma.delivery.createMany({ data: deliveriesData });
  console.log('   ✓ Entregas criadas');

  // ============================================
  // 8. PEOPLE & BOT
  // ============================================
  console.log('🤖 Criando Pessoas e Bot...');

  // People
  const peopleData = [];
  for (let i = 1; i <= 40; i++) {
    peopleData.push({
      name: `Colaborador ${i}`,
      role: i <= 30 ? 'Motorista' : (i <= 35 ? 'Analista Logístico' : 'Gerente'),
      contact: `(11) 9${randomInt(1000, 9999)}-${randomInt(1000, 9999)}`,
      status: Math.random() > 0.1 ? 'Ativo' : 'Inativo',
    });
  }
  await prisma.person.createMany({ data: peopleData });

  // Bot Messages
  await prisma.botMessage.createMany({
    data: [
      { sender: 'BOT', text: 'Bem-vindo ao Portal Tetra OIL! Como posso ajudar hoje?', timestamp: '08:00' },
      { sender: 'BOT', text: 'Alerta: Contrato CT-2023-1005 atingiu 95% do volume contratado.', timestamp: '09:15' },
      { sender: 'ADM', text: 'Obrigado, vou verificar com o cliente.', timestamp: '09:16' },
      { sender: 'BOT', text: 'Novo pedido de Diesel S-10 recebido. Aprovar?', timestamp: '10:30' },
      { sender: 'ADM', text: 'Aprovar.', timestamp: '10:31' },
      { sender: 'BOT', text: 'Pedido aprovado e enviado para expedição.', timestamp: '10:31' },
    ]
  });

  console.log('');
  console.log('='.repeat(60));
  console.log('🚀 SEED CONCLUÍDO COM SUCESSO!');
  console.log('='.repeat(60));
  console.log(`   • Empresa: Tetra OIL Matriz`);
  console.log(`   • Usuários: admin@tetraoil.com.br (Senha: 123456)`);
  console.log(`   • Dados gerados: 30 Clientes, 45 Contratos, 150 Faturas, 80 Entregas`);
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
