import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Limpando banco de dados...');

  // Limpar dados existentes (ordem importa por causa das relações)
  await prisma.botMessage.deleteMany();
  await prisma.person.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.paymentRequest.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Banco limpo!');
  console.log('');
  console.log('🌱 Populando banco de dados...');

  // ============================================
  // 1. USERS
  // ============================================
  console.log('📝 Criando usuários...');
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@trr.com.br',
      password: '$2a$10$rOiXXXXXXXXXXXXXXXXXXX', // Hash fictício - em produção usar bcrypt
      company: 'TRR Distribuidora',
      role: 'Gestor',
    },
  });

  const financeiro = await prisma.user.create({
    data: {
      name: 'Maria Silva',
      email: 'financeiro@trr.com.br',
      password: '$2a$10$rOiXXXXXXXXXXXXXXXXXXX',
      company: 'TRR Distribuidora',
      role: 'Financeiro',
    },
  });

  console.log(`   ✓ ${await prisma.user.count()} usuários criados`);

  // ============================================
  // 2. CUSTOMERS
  // ============================================
  console.log('📝 Criando clientes...');
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Transportadora Ágil Ltda',
        cnpj: '12.345.678/0001-90',
        segment: 'Transporte',
        status: 'Ativo',
        creditLimit: 150000,
        salesperson: 'Mariana Lima',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Agropecuária Sol Nascente',
        cnpj: '23.456.789/0001-81',
        segment: 'Agro',
        status: 'Ativo',
        creditLimit: 200000,
        salesperson: 'Ricardo Alves',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Indústria Metalúrgica Forte S.A.',
        cnpj: '34.567.890/0001-72',
        segment: 'Indústria',
        status: 'Ativo',
        creditLimit: 300000,
        salesperson: 'Sofia Costa',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Viação Rápida Express',
        cnpj: '45.678.901/0001-63',
        segment: 'Transporte',
        status: 'Ativo',
        creditLimit: 120000,
        salesperson: 'Mariana Lima',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Fazenda Terra Boa',
        cnpj: '56.789.012/0001-54',
        segment: 'Agro',
        status: 'Bloqueado',
        creditLimit: 80000,
        salesperson: 'Ricardo Alves',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Construções Alicerce S.A.',
        cnpj: '67.890.123/0001-45',
        segment: 'Indústria',
        status: 'Ativo',
        creditLimit: 250000,
        salesperson: 'Sofia Costa',
      },
    }),
  ]);

  console.log(`   ✓ ${customers.length} clientes criados`);

  // ============================================
  // 3. CONTRACTS
  // ============================================
  console.log('📝 Criando contratos...');
  const contracts = await Promise.all([
    prisma.contract.create({
      data: {
        customerId: customers[0].id,
        contractNumber: 'CT-2023-1001',
        startDate: '01/01/2023',
        endDate: '31/12/2023',
        totalVolume: 150000,
        consumedVolume: 95000,
        unitPrice: 5.50,
        product: 'Diesel S-10',
        status: 'Ativo',
      },
    }),
    prisma.contract.create({
      data: {
        customerId: customers[1].id,
        contractNumber: 'CT-2023-1002',
        startDate: '01/02/2023',
        endDate: '31/01/2024',
        totalVolume: 200000,
        consumedVolume: 120000,
        unitPrice: 5.45,
        product: 'Diesel S-10',
        status: 'Ativo',
      },
    }),
    prisma.contract.create({
      data: {
        customerId: customers[2].id,
        contractNumber: 'CT-2023-1003',
        startDate: '15/03/2023',
        endDate: '14/03/2024',
        totalVolume: 300000,
        consumedVolume: 285000,
        unitPrice: 5.40,
        product: 'Diesel S-500',
        status: 'Ativo',
      },
    }),
    prisma.contract.create({
      data: {
        customerId: customers[3].id,
        contractNumber: 'CT-2023-1004',
        startDate: '01/04/2023',
        endDate: '31/03/2024',
        totalVolume: 100000,
        consumedVolume: 45000,
        unitPrice: 5.55,
        product: 'Diesel S-10',
        status: 'Ativo',
      },
    }),
    prisma.contract.create({
      data: {
        customerId: customers[5].id,
        contractNumber: 'CT-2023-1005',
        startDate: '01/05/2023',
        endDate: '30/04/2024',
        totalVolume: 250000,
        consumedVolume: 180000,
        unitPrice: 5.42,
        product: 'Diesel S-10',
        status: 'Ativo',
      },
    }),
    prisma.contract.create({
      data: {
        customerId: customers[1].id,
        contractNumber: 'CT-2023-1006',
        startDate: '01/06/2023',
        endDate: '31/05/2024',
        totalVolume: 50000,
        consumedVolume: 12000,
        unitPrice: 3.20,
        product: 'Arla 32',
        status: 'Ativo',
      },
    }),
  ]);

  console.log(`   ✓ ${contracts.length} contratos criados`);

  // ============================================
  // 4. VEHICLES
  // ============================================
  console.log('📝 Criando veículos...');
  const vehicleData = [
    { plate: 'ABC-1234', model: 'Scania R450', driver: 'Carlos Silva', status: 'Operacional' },
    { plate: 'DEF-5678', model: 'Volvo FH540', driver: 'João Pereira', status: 'Operacional' },
    { plate: 'GHI-9012', model: 'Mercedes-Benz Actros', driver: 'Marcos Almeida', status: 'Em Manutenção' },
    { plate: 'JKL-3456', model: 'Scania R450', driver: 'Lucas Souza', status: 'Operacional' },
    { plate: 'MNO-7890', model: 'Volvo FH540', driver: 'Carlos Silva', status: 'Operacional' },
    { plate: 'PQR-1122', model: 'Mercedes-Benz Actros', driver: 'João Pereira', status: 'Operacional' },
    { plate: 'STU-3344', model: 'Scania R450', driver: 'Marcos Almeida', status: 'Inativo' },
    { plate: 'VWX-5566', model: 'Volvo FH540', driver: 'Lucas Souza', status: 'Operacional' },
    { plate: 'YZA-7788', model: 'Mercedes-Benz Actros', driver: 'Carlos Silva', status: 'Operacional' },
    { plate: 'BCD-9900', model: 'Scania R450', driver: 'João Pereira', status: 'Operacional' },
    { plate: 'EFG-1212', model: 'Volvo FH540', driver: 'Marcos Almeida', status: 'Operacional' },
    { plate: 'HIJ-3434', model: 'Mercedes-Benz Actros', driver: 'Lucas Souza', status: 'Em Manutenção' },
    { plate: 'KLM-5656', model: 'Scania R450', driver: 'Carlos Silva', status: 'Operacional' },
    { plate: 'NOP-7878', model: 'Volvo FH540', driver: 'João Pereira', status: 'Operacional' },
    { plate: 'QRS-9090', model: 'Mercedes-Benz Actros', driver: 'Marcos Almeida', status: 'Operacional' },
  ];

  for (const vehicle of vehicleData) {
    const lastInspection = new Date(2023, 9, 15);
    const nextInspection = new Date(lastInspection.getTime() + 6 * 30 * 24 * 60 * 60 * 1000);

    await prisma.vehicle.create({
      data: {
        ...vehicle,
        lastInspection: lastInspection.toLocaleDateString('pt-BR'),
        nextInspection: nextInspection.toLocaleDateString('pt-BR'),
      },
    });
  }

  console.log(`   ✓ ${await prisma.vehicle.count()} veículos criados`);

  // ============================================
  // 5. INVOICES
  // ============================================
  console.log('📝 Criando faturas...');

  for (let i = 0; i < 25; i++) {
    const issueDate = new Date(2023, 10 - Math.floor(i / 3), 28 - (i % 28));
    const dueDate = new Date(issueDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    let status: string;
    if (i === 0) status = 'Vencida';
    else if (i < 4) status = 'Em Aberto';
    else status = 'Paga';

    await prisma.invoice.create({
      data: {
        id: `NF-00${12345 + i}`,
        issueDate: issueDate.toLocaleDateString('pt-BR'),
        dueDate: dueDate.toLocaleDateString('pt-BR'),
        amount: parseFloat((Math.random() * (15000 - 2000) + 2000).toFixed(2)),
        status,
      },
    });
  }

  console.log(`   ✓ ${await prisma.invoice.count()} faturas criadas`);

  // ============================================
  // 6. DELIVERIES
  // ============================================
  console.log('📝 Criando entregas...');
  const deliveryStatuses = ['Solicitado', 'Agendado', 'Em Trânsito', 'Entregue', 'Cancelado'];
  const products = ['Diesel S-10', 'Diesel S-500', 'Arla 32'];

  for (let i = 0; i < 20; i++) {
    const date = new Date(2023, 10, 28 - i * 2);
    const status = i < 2 ? 'Entregue' : deliveryStatuses[i % deliveryStatuses.length];

    await prisma.delivery.create({
      data: {
        id: `ENT-0${54321 - i}`,
        orderId: `PED-0${98765 - i}`,
        date: date.toLocaleString('pt-BR'),
        product: products[i % products.length],
        volume: Math.floor(Math.random() * (10000 - 1000) + 1000),
        status,
        deliveryLat: -23.5505 + (Math.random() - 0.5) * 0.1,
        deliveryLng: -46.6333 + (Math.random() - 0.5) * 0.1,
        deliveryAddress: 'Rua Fictícia, 123 - São Paulo, SP',
        proofOfDeliveryUrl: `https://picsum.photos/seed/${i}/800/600`,
      },
    });
  }

  console.log(`   ✓ ${await prisma.delivery.count()} entregas criadas`);

  // ============================================
  // 7. PAYMENT REQUESTS
  // ============================================
  console.log('📝 Criando solicitações de pagamento...');
  const paymentStatuses = ['Pendente', 'Aprovado', 'Rejeitado'];
  const categories = ['Fornecedor', 'Imposto', 'Serviço', 'Reembolso'];
  const priorities = ['Alta', 'Normal'];
  const beneficiaries = ['Fornecedor A', 'Governo Federal', 'Consultoria XYZ', 'Funcionário X'];

  for (let i = 0; i < 10; i++) {
    const requestDate = new Date(2023, 10, 28 - i);
    const dueDate = new Date(requestDate.getTime() + 15 * 24 * 60 * 60 * 1000);
    const status = i < 2 ? 'Pendente' : paymentStatuses[(i + 1) % paymentStatuses.length];

    await prisma.paymentRequest.create({
      data: {
        id: `PAY-REQ-00${i + 1}`,
        invoiceId: `NF-00${12345 + i}`,
        amount: parseFloat((Math.random() * (15000 - 2000) + 2000).toFixed(2)),
        requester: 'Financeiro',
        requestDate: requestDate.toLocaleDateString('pt-BR'),
        status,
        beneficiary: beneficiaries[i % beneficiaries.length],
        dueDate: dueDate.toISOString().split('T')[0],
        category: categories[i % categories.length],
        description: `Pagamento referente a ${categories[i % categories.length]}`,
        priority: priorities[i % priorities.length],
        attachmentUrl: 'boleto_fake.pdf',
      },
    });
  }

  console.log(`   ✓ ${await prisma.paymentRequest.count()} solicitações de pagamento criadas`);

  // ============================================
  // 8. PEOPLE
  // ============================================
  console.log('📝 Criando pessoas...');
  const peopleData = [
    { name: 'Ana Costa', role: 'Motorista', contact: '(11) 98765-4321', status: 'Ativo' },
    { name: 'Beatriz Martins', role: 'Analista Logístico', contact: '(11) 97654-3210', status: 'Ativo' },
    { name: 'Carlos Dias', role: 'Gerente de Frota', contact: '(11) 96543-2109', status: 'Ativo' },
    { name: 'Daniela Rocha', role: 'Assistente ADM', contact: '(11) 95432-1098', status: 'Ativo' },
    { name: 'Eduardo Lima', role: 'Motorista', contact: '(11) 94321-0987', status: 'Inativo' },
    { name: 'Fernanda Silva', role: 'Analista Logístico', contact: '(11) 93210-9876', status: 'Ativo' },
    { name: 'Gabriel Santos', role: 'Motorista', contact: '(11) 92109-8765', status: 'Ativo' },
    { name: 'Helena Oliveira', role: 'Assistente ADM', contact: '(11) 91098-7654', status: 'Ativo' },
    { name: 'Igor Pereira', role: 'Motorista', contact: '(11) 90987-6543', status: 'Ativo' },
    { name: 'Juliana Costa', role: 'Gerente de Frota', contact: '(11) 89876-5432', status: 'Ativo' },
    { name: 'Kevin Almeida', role: 'Motorista', contact: '(11) 88765-4321', status: 'Inativo' },
    { name: 'Larissa Souza', role: 'Analista Logístico', contact: '(11) 87654-3210', status: 'Ativo' },
  ];

  for (const person of peopleData) {
    await prisma.person.create({ data: person });
  }

  console.log(`   ✓ ${await prisma.person.count()} pessoas criadas`);

  // ============================================
  // 9. BOT MESSAGES
  // ============================================
  console.log('📝 Criando mensagens do bot...');
  const botMessages = [
    { sender: 'BOT', text: 'Novo pedido recebido do cliente "Posto Central": 5000L de Diesel S-10. Agendar entrega?', timestamp: '09:30' },
    { sender: 'ADM', text: 'Confirmado. Agendar para amanhã, 08:00.', timestamp: '09:31' },
    { sender: 'BOT', text: 'Entrega agendada. Deseja notificar o motorista João Pereira?', timestamp: '09:31' },
    { sender: 'ADM', text: 'Sim.', timestamp: '09:32' },
    { sender: 'BOT', text: 'O cliente "Fazenda Boa Vista" está com baixo nível de crédito. Gerar alerta?', timestamp: '10:15' },
    { sender: 'ADM', text: 'Sim, enviar alerta para o financeiro.', timestamp: '10:16' },
  ];

  for (const message of botMessages) {
    await prisma.botMessage.create({ data: message });
  }

  console.log(`   ✓ ${await prisma.botMessage.count()} mensagens do bot criadas`);

  console.log('');
  console.log('='.repeat(60));
  console.log('🚀 Banco de dados Neon conectado e populado com sucesso!');
  console.log('='.repeat(60));
  console.log('');
  console.log('📊 Resumo:');
  console.log(`   • ${await prisma.user.count()} usuários`);
  console.log(`   • ${await prisma.customer.count()} clientes`);
  console.log(`   • ${await prisma.contract.count()} contratos`);
  console.log(`   • ${await prisma.vehicle.count()} veículos`);
  console.log(`   • ${await prisma.invoice.count()} faturas`);
  console.log(`   • ${await prisma.delivery.count()} entregas`);
  console.log(`   • ${await prisma.paymentRequest.count()} solicitações de pagamento`);
  console.log(`   • ${await prisma.person.count()} pessoas`);
  console.log(`   • ${await prisma.botMessage.count()} mensagens do bot`);
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao popular banco de dados:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
