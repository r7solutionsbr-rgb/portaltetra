import { useState, useEffect } from 'react';
import { Invoice, Delivery, ConsumptionData, OrderStatus, PaymentRequest, Vehicle, Person, BotMessage, Customer, Contract, CustomerStatus, ContractStatus, PaymentCategory, PaymentPriority } from '../types';

const generateInvoices = (count: number): Invoice[] => {
  const invoices: Invoice[] = [];
  const statusOptions: Invoice['status'][] = ['Paga', 'Em Aberto', 'Vencida'];
  for (let i = 0; i < count; i++) {
    const issueDate = new Date(2023, 10 - i, 28 - i);
    const dueDate = new Date(issueDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    invoices.push({
      id: `NF-00${12345 + i}`,
      issueDate: issueDate.toLocaleDateString('pt-BR'),
      dueDate: dueDate.toLocaleDateString('pt-BR'),
      amount: parseFloat((Math.random() * (15000 - 2000) + 2000).toFixed(2)),
      status: i < 3 && i > 0 ? 'Em Aberto' : (i === 0 ? 'Vencida' : 'Paga'),
    });
  }
  return invoices;
};

const generateDeliveries = (count: number): Delivery[] => {
  const deliveries: Delivery[] = [];
  const statusOptions = Object.values(OrderStatus);
  const products = ['Diesel S-10', 'Diesel S-500', 'Arla 32'];
  for (let i = 0; i < count; i++) {
    const date = new Date(2023, 10, 28 - i * 2);
    deliveries.push({
      id: `ENT-0${54321 - i}`,
      orderId: `PED-0${98765 - i}`,
      date: date.toLocaleString('pt-BR'),
      product: products[i % products.length],
      volume: Math.floor(Math.random() * (10000 - 1000) + 1000),
      status: i < 2 ? OrderStatus.ENTREGUE : statusOptions[i % statusOptions.length],
      deliveryLocation: {
        lat: -23.5505 + (Math.random() - 0.5) * 0.1,
        lng: -46.6333 + (Math.random() - 0.5) * 0.1,
        address: 'Rua Fictícia, 123 - São Paulo, SP',
      },
      proofOfDeliveryUrl: `https://picsum.photos/seed/${i}/800/600`,
    });
  }
  return deliveries;
};

const generateConsumptionData = (): ConsumptionData[] => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentMonth = new Date().getMonth();
    const data: ConsumptionData[] = [];
    for(let i=5; i>=0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        data.push({
            month: months[monthIndex],
            liters: Math.floor(Math.random() * (90000 - 50000) + 50000),
        })
    }
    return data;
}

const generatePaymentRequests = (count: number): PaymentRequest[] => {
  const requests: PaymentRequest[] = [];
  const statuses: PaymentRequest['status'][] = ['Pendente', 'Aprovado', 'Rejeitado'];
  const categories: PaymentCategory[] = ['Fornecedor', 'Imposto', 'Serviço', 'Reembolso'];
  const priorities: PaymentPriority[] = ['Alta', 'Normal'];
  const beneficiaries = ['Fornecedor A', 'Governo Federal', 'Consultoria XYZ', 'Funcionário X'];

  for (let i = 0; i < count; i++) {
    const requestDate = new Date(2023, 10, 28 - i);
    const dueDate = new Date(requestDate.getTime() + (15 * 24 * 60 * 60 * 1000));
    requests.push({
      id: `PAY-REQ-00${i + 1}`,
      invoiceId: `NF-00${12345 + i}`,
      amount: parseFloat((Math.random() * (15000 - 2000) + 2000).toFixed(2)),
      requester: 'Financeiro',
      requestDate: requestDate.toLocaleDateString('pt-BR'),
      status: i < 2 ? 'Pendente' : statuses[(i + 1) % statuses.length],
      beneficiary: beneficiaries[i % beneficiaries.length],
      dueDate: dueDate.toISOString().split('T')[0], // YYYY-MM-DD
      category: categories[i % categories.length],
      description: `Pagamento referente a ${categories[i % categories.length]}`,
      priority: priorities[i % priorities.length],
      attachmentUrl: 'boleto_fake.pdf',
    });
  }
  return requests;
};

const generateVehicles = (count: number): Vehicle[] => {
  const vehicles: Vehicle[] = [];
  const models = ['Scania R450', 'Volvo FH540', 'Mercedes-Benz Actros'];
  const drivers = ['Carlos Silva', 'João Pereira', 'Marcos Almeida', 'Lucas Souza'];
  const statuses: Vehicle['status'][] = ['Operacional', 'Em Manutenção', 'Inativo'];
  for (let i = 0; i < count; i++) {
    const lastInspection = new Date(2023, 10 - i, 15);
    const nextInspection = new Date(lastInspection.getTime() + 6 * 30 * 24 * 60 * 60 * 1000);
    vehicles.push({
      id: `VEH-00${i + 1}`,
      plate: `ABC-${1000 + i}`,
      model: models[i % models.length],
      driver: drivers[i % drivers.length],
      lastInspection: lastInspection.toLocaleDateString('pt-BR'),
      nextInspection: nextInspection.toLocaleDateString('pt-BR'),
      status: statuses[i % statuses.length],
    });
  }
  return vehicles;
};

const generatePeople = (count: number): Person[] => {
  const people: Person[] = [];
  const names = ['Ana Costa', 'Beatriz Martins', 'Carlos Dias', 'Daniela Rocha', 'Eduardo Lima'];
  const roles = ['Motorista', 'Analista Logístico', 'Gerente de Frota', 'Assistente ADM'];
  for(let i=0; i<count; i++) {
    people.push({
      id: `PER-00${i+1}`,
      name: names[i % names.length],
      role: roles[i % roles.length],
      contact: `(11) 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: i % 5 === 0 ? 'Inativo' : 'Ativo'
    });
  }
  return people;
}

const generateBotMessages = (): BotMessage[] => {
  return [
    { id: 1, sender: 'BOT', text: 'Novo pedido recebido do cliente "Posto Central": 5000L de Diesel S-10. Agendar entrega?', timestamp: '09:30' },
    { id: 2, sender: 'ADM', text: 'Confirmado. Agendar para amanhã, 08:00.', timestamp: '09:31' },
    { id: 3, sender: 'BOT', text: 'Entrega agendada. Deseja notificar o motorista João Pereira?', timestamp: '09:31' },
    { id: 4, sender: 'ADM', text: 'Sim.', timestamp: '09:32' },
    { id: 5, sender: 'BOT', text: 'O cliente "Fazenda Boa Vista" está com baixo nível de crédito. Gerar alerta?', timestamp: '10:15' },
    { id: 6, sender: 'ADM', text: 'Sim, enviar alerta para o financeiro.', timestamp: '10:16' },
  ];
};

const generateCustomers = (count: number): Customer[] => {
    const customers: Customer[] = [];
    const names = ['Transportadora Ágil', 'Agropecuária Sol Nascente', 'Indústria Metalúrgica Forte', 'Viação Rápida', 'Fazenda Terra Boa', 'Construções S.A.'];
    const segments: Customer['segment'][] = ['Transporte', 'Agro', 'Indústria'];
    const salespeople = ['Mariana Lima', 'Ricardo Alves', 'Sofia Costa'];
    for(let i=0; i<count; i++) {
        customers.push({
            id: `CUST-00${i+1}`,
            name: `${names[i % names.length]}`,
            cnpj: `${Math.floor(10+Math.random()*90)}.${Math.floor(100+Math.random()*900)}.${Math.floor(100+Math.random()*900)}/0001-${Math.floor(10+Math.random()*90)}`,
            segment: segments[i % segments.length],
            status: i % 7 === 0 ? CustomerStatus.BLOQUEADO : CustomerStatus.ATIVO,
            creditLimit: 100000 + i * 5000,
            salesperson: salespeople[i % salespeople.length]
        })
    }
    return customers;
}

const generateContracts = (customers: Customer[]): Contract[] => {
    const contracts: Contract[] = [];
    let contractIdCounter = 1;
    for (const customer of customers) {
        const numContracts = Math.random() > 0.3 ? 1: 2; // 70% chance of 1 contract, 30% of 2
        for(let i=0; i<numContracts; i++) {
            const totalVolume = (50000 + Math.random() * 150000);
            // make some contracts almost finished
            const consumptionRatio = (i === 0 && Math.random() > 0.7) ? 0.95 : Math.random() * 0.8;
            const consumedVolume = totalVolume * consumptionRatio;

            contracts.push({
                id: `CTR-00${contractIdCounter++}`,
                customerId: customer.id,
                contractNumber: `CT-2023-${1000+contractIdCounter}`,
                startDate: '01/01/2023',
                endDate: '31/12/2023',
                totalVolume: totalVolume,
                consumedVolume: consumedVolume,
                product: 'Diesel S-10',
                unitPrice: 5.50 + (Math.random() - 0.5) * 0.5,
                status: ContractStatus.ATIVO
            });
        }
    }
    return contracts;
}

export const useMockData = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [consumptionData, setConsumptionData] = useState<ConsumptionData[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [botMessages, setBotMessages] = useState<BotMessage[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);


  useEffect(() => {
    // Client-facing data
    setInvoices(generateInvoices(25));
    setDeliveries(generateDeliveries(20));
    setConsumptionData(generateConsumptionData());
    setPaymentRequests(generatePaymentRequests(10));
    setVehicles(generateVehicles(15));
    setPeople(generatePeople(12));
    setBotMessages(generateBotMessages());
    
    // Internal CRM data
    const mockCustomers = generateCustomers(15);
    setCustomers(mockCustomers);
    setContracts(generateContracts(mockCustomers));
  }, []);

  const creditData = {
    used: 135780.50,
    total: 200000.00
  };

  const priceVariation = -2.5; // percent

  return { invoices, deliveries, consumptionData, creditData, priceVariation, paymentRequests, vehicles, people, botMessages, customers, contracts };
};
