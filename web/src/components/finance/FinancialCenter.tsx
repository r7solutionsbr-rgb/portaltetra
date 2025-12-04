import React, { useState } from 'react';
import { useMockData } from '../../hooks/useMockData';
import { Invoice } from '../../types';

const getStatusClass = (status: Invoice['status']) => {
  switch (status) {
    case 'Paga':
      return 'bg-green-100 text-green-800';
    case 'Em Aberto':
      return 'bg-blue-100 text-blue-800';
    case 'Vencida':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);


export const FinancialCenter: React.FC = () => {
  const { invoices } = useMockData();
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedInvoices(new Set(invoices.map(inv => inv.id)));
    } else {
      setSelectedInvoices(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelection = new Set(selectedInvoices);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedInvoices(newSelection);
  };
  
  const handleBulkDownload = (type: 'XMLs' | 'Boletos') => {
    if (selectedInvoices.size === 0) {
        alert("Por favor, selecione ao menos uma fatura.");
        return;
    }
    alert(`Iniciando download de ${selectedInvoices.size} ${type}. Um arquivo ZIP será gerado.`);
  }

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Central Financeira</h1>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Faturas e Boletos</h2>
                <div className="flex space-x-2">
                    <button 
                        onClick={() => handleBulkDownload('XMLs')}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 disabled:bg-gray-300"
                        disabled={selectedInvoices.size === 0}
                    >
                        <DownloadIcon className="h-5 w-5"/>
                        <span>Baixar XMLs em Lote</span>
                    </button>
                     <button
                        onClick={() => handleBulkDownload('Boletos')} 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 disabled:bg-gray-300"
                        disabled={selectedInvoices.size === 0}
                    >
                        <DownloadIcon className="h-5 w-5"/>
                        <span>Baixar Boletos em Lote</span>
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 w-12 text-left">
                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" onChange={handleSelectAll} checked={selectedInvoices.size === invoices.length && invoices.length > 0} />
                            </th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota Fiscal</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emissão</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {invoices.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-gray-50">
                                <td className="p-3">
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={selectedInvoices.has(invoice.id)} onChange={() => handleSelectOne(invoice.id)} />
                                </td>
                                <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.id}</td>
                                <td className="p-3 whitespace-nowrap text-sm text-gray-500">{invoice.issueDate}</td>
                                <td className="p-3 whitespace-nowrap text-sm text-gray-500">{invoice.dueDate}</td>
                                <td className="p-3 whitespace-nowrap text-sm text-gray-500">{invoice.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                <td className="p-3 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(invoice.status)}`}>
                                        {invoice.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};
