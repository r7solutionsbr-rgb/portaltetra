export enum UserRole {
  GESTOR = 'Gestor',
  FINANCEIRO = 'Financeiro',
  AUDITOR = 'Auditor',
  OPERACIONAL = 'Operacional',
  COMERCIAL = 'Comercial',
}

export interface User {
  name: string;
  company: string;
  role: UserRole;
}

export interface Invoice {
  id: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'Paga' | 'Em Aberto' | 'Vencida';
}

export enum OrderStatus {
  SOLICITADO = 'Solicitado',
  AGENDADO = 'Agendado',
  EM_TRANSITO = 'Em Trânsito',
  ENTREGUE = 'Entregue',
  CANCELADO = 'Cancelado',
}

export interface Delivery {
  id: string;
  orderId: string;
  date: string;
  product: string;
  volume: number;
  status: OrderStatus;
  deliveryLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  proofOfDeliveryUrl: string;
}

export interface ConsumptionData {
  month: string;
  liters: number;
}

export type PaymentCategory = 'Fornecedor' | 'Imposto' | 'Serviço' | 'Reembolso';
export type PaymentPriority = 'Alta' | 'Normal';

export interface PaymentRequest {
  id: string;
  invoiceId: string;
  amount: number;
  requester: string;
  requestDate: string;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
  // --- CAMPOS ATUALIZADOS ---
  beneficiary: string;
  dueDate: string;
  category: PaymentCategory;
  description: string;
  attachmentUrl?: string; // Simula o anexo
  priority: PaymentPriority;
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  driver: string;
  lastInspection: string;
  nextInspection: string;
  status: 'Operacional' | 'Em Manutenção' | 'Inativo';
}

export interface Person {
  id: string;
  name: string;
  role: string;
  contact: string;
  status: 'Ativo' | 'Inativo';
}

export interface BotMessage {
  id: number;
  sender: 'BOT' | 'ADM';
  text: string;
  timestamp: string;
}

// --- NOVOS TIPOS PARA CRM ---

export enum CustomerStatus {
  ATIVO = 'Ativo',
  BLOQUEADO = 'Bloqueado',
}

export interface Customer {
  id: string;
  name: string;
  cnpj: string;
  segment: 'Transporte' | 'Agro' | 'Indústria';
  status: CustomerStatus;
  creditLimit: number;
  salesperson: string;
}

export enum ContractStatus {
  ATIVO = 'Ativo',
  CONCLUIDO = 'Concluído',
  CANCELADO = 'Cancelado',
}

export interface Contract {
  id: string;
  customerId: string;
  contractNumber: string;
  startDate: string;
  endDate: string;
  totalVolume: number;
  consumedVolume: number;
  unitPrice: number;
  product: 'Diesel S-10' | 'Diesel S-500' | 'Arla 32';
  status: ContractStatus;
}
