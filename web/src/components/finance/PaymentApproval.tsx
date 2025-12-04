import React, { useState, useEffect } from 'react';
import { useMockData } from '../../hooks/useMockData';
import { PaymentRequest } from '../../types';
import { Modal } from '../shared/Modal';
import { PaymentRequestForm } from './PaymentRequestForm';

const getStatusClass = (status: PaymentRequest['status']) => {
  switch (status) {
    case 'Aprovado': return 'bg-green-100 text-green-800';
    case 'Pendente': return 'bg-yellow-100 text-yellow-800';
    case 'Rejeitado': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const PaymentApproval: React.FC = () => {
  const { paymentRequests: initialPaymentRequests } = useMockData();
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(initialPaymentRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setPaymentRequests(initialPaymentRequests);
  }, [initialPaymentRequests]);

  const handleSuccess = (newRequest: PaymentRequest) => {
    setPaymentRequests(prev => [newRequest, ...prev]);
    setIsModalOpen(false);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Workflow de Aprovação</h1>
       <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Solicitações de Pagamento</h2>
                 <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>+ Nova Solicitação</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beneficiário</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridade</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paymentRequests.map((req) => (
                            <tr key={req.id} className="hover:bg-gray-50">
                                <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <div>{req.beneficiary}</div>
                                    <div className="text-xs text-gray-500">{req.category}</div>
                                </td>
                                <td className="p-3 whitespace-nowrap text-sm text-gray-500">{new Date(req.dueDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                                <td className="p-3 whitespace-nowrap text-sm text-gray-500">{req.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                <td className="p-3 whitespace-nowrap text-sm text-gray-500">
                                     <span className={`font-semibold ${req.priority === 'Alta' ? 'text-red-600' : 'text-gray-600'}`}>{req.priority}</span>
                                </td>
                                <td className="p-3 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(req.status)}`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="p-3 whitespace-nowrap text-sm space-x-2">
                                    {req.status === 'Pendente' && (
                                        <>
                                            <button className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-xs font-medium">Aprovar</button>
                                            <button className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-xs font-medium">Rejeitar</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
       </div>

       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Solicitação de Pagamento">
            <PaymentRequestForm onSuccess={handleSuccess} />
       </Modal>
    </div>
  );
};
