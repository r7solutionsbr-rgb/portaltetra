import React, { useState, useMemo } from 'react';
import { useMockData } from '../../hooks/useMockData';
import { Customer, Contract, CustomerStatus } from '../../types';

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const ContractProgressBar: React.FC<{ consumed: number, total: number }> = ({ consumed, total }) => {
    const percentage = total > 0 ? (consumed / total) * 100 : 0;
    const isAlert = percentage > 90;

    return (
        <div className="w-full">
            <div className="flex justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">{consumed.toLocaleString('pt-BR')} L</span>
                <span className="text-xs font-medium text-gray-500">{total.toLocaleString('pt-BR')} L</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className={`h-2.5 rounded-full ${isAlert ? 'bg-red-500' : 'bg-blue-600'}`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
             <div className="text-right mt-1">
                <span className={`text-sm font-semibold ${isAlert ? 'text-red-600' : 'text-blue-700'}`}>
                    {percentage.toFixed(1)}% Consumido
                </span>
            </div>
        </div>
    );
}

export const CustomerManagement: React.FC = () => {
    const { customers, contracts } = useMockData();
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(customers[0]?.id || null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCustomers = useMemo(() => {
        return customers.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            c.cnpj.includes(searchTerm)
        );
    }, [customers, searchTerm]);

    const selectedCustomer = useMemo(() => {
        return customers.find(c => c.id === selectedCustomerId);
    }, [customers, selectedCustomerId]);
    
    const customerContracts = useMemo(() => {
        return contracts.filter(c => c.customerId === selectedCustomerId);
    }, [contracts, selectedCustomerId]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Gestão de Clientes (CRM)</h1>
            <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md border border-gray-200 h-[calc(100vh-12rem)]">
                {/* Left Pane: Customer List */}
                <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar por nome ou CNPJ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    <ul className="flex-1 overflow-y-auto">
                        {filteredCustomers.map(customer => (
                            <li key={customer.id}>
                                <button 
                                    onClick={() => setSelectedCustomerId(customer.id)}
                                    className={`w-full text-left p-4 border-b hover:bg-gray-100 transition-colors ${selectedCustomerId === customer.id ? 'bg-blue-50' : ''}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-gray-800">{customer.name}</p>
                                        <span className={`h-2.5 w-2.5 rounded-full ${customer.status === CustomerStatus.ATIVO ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    </div>
                                    <p className="text-sm text-gray-500">{customer.cnpj}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Pane: Customer Details */}
                <div className="w-full md:w-2/3 p-6 overflow-y-auto">
                    {selectedCustomer ? (
                        <div className="space-y-6">
                            <div className="pb-4 border-b">
                                <h2 className="text-2xl font-bold text-gray-800">{selectedCustomer.name}</h2>
                                <div className="flex space-x-6 text-sm text-gray-600 mt-2">
                                    <span>CNPJ: {selectedCustomer.cnpj}</span>
                                    <span>Segmento: {selectedCustomer.segment}</span>
                                    <span>Vendedor(a): {selectedCustomer.salesperson}</span>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Contratos Ativos</h3>
                                {customerContracts.length > 0 ? (
                                    <div className="space-y-4">
                                        {customerContracts.map(contract => (
                                            <div key={contract.id} className="p-4 border rounded-lg bg-gray-50">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{contract.contractNumber}</p>
                                                        <p className="text-sm text-gray-500">{contract.product}</p>
                                                    </div>
                                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">{contract.status}</span>
                                                </div>
                                                <div className="mt-4">
                                                    <ContractProgressBar consumed={contract.consumedVolume} total={contract.totalVolume}/>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Nenhum contrato ativo para este cliente.</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">Selecione um cliente para ver os detalhes.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
