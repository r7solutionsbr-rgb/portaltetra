export type PaymentCategory = 'Fornecedor' | 'Imposto' | 'Serviço' | 'Reembolso';
export type PaymentPriority = 'Alta' | 'Normal';

export interface PaymentRequestBody {
  beneficiary: string;
  amount: number;
  dueDate: string;
  category: PaymentCategory;
  priority: PaymentPriority;
  description: string;
  attachmentUrl?: string;
}
