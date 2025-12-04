import React, { useState } from 'react';
import { useMockData } from '../../hooks/useMockData';
import { Delivery, OrderStatus } from '../../types';
import { Modal } from '../shared/Modal';

const getStatusClass = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.ENTREGUE: return 'bg-green-100 text-green-800';
        case OrderStatus.EM_TRANSITO: return 'bg-blue-100 text-blue-800';
        case OrderStatus.AGENDADO: return 'bg-yellow-100 text-yellow-800';
        case OrderStatus.CANCELADO: return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);


export const DeliveryAudit: React.FC = () => {
    const { deliveries } = useMockData();
    const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Auditoria de Entregas</h1>
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedido</th>
                                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data da Entrega</th>
                                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {deliveries.map((delivery) => (
                                <tr key={delivery.id} className="hover:bg-gray-50">
                                    <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-900">{delivery.orderId}</td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-500">{delivery.date}</td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-500">{delivery.product}</td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-500">{delivery.volume.toLocaleString('pt-BR')} L</td>
                                    <td className="p-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(delivery.status)}`}>
                                            {delivery.status}
                                        </span>
                                    </td>
                                    <td className="p-4 whitespace-nowrap text-sm">
                                        <button 
                                            onClick={() => setSelectedDelivery(delivery)}
                                            className="text-blue-600 hover:text-blue-800 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                                            disabled={delivery.status !== OrderStatus.ENTREGUE}
                                        >
                                            Ver Comprovante
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <Modal isOpen={!!selectedDelivery} onClose={() => setSelectedDelivery(null)} title={`Detalhes da Entrega - ${selectedDelivery?.orderId}`}>
                {selectedDelivery && (
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Comprovante de Entrega</h4>
                            <img src={selectedDelivery.proofOfDeliveryUrl} alt="Comprovante de Entrega" className="rounded-lg border w-full object-cover" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Local da Entrega</h4>
                            <div className="p-2 border rounded-lg">
                                <p className="text-sm text-gray-600 flex items-center">
                                    <MapPinIcon className="h-5 w-5 mr-2 text-gray-400"/>
                                    {selectedDelivery.deliveryLocation.address}
                                </p>
                                <div className="mt-2 h-48 bg-gray-200 rounded-md flex items-center justify-center">
                                    <p className="text-gray-500">Visualização do mapa (placeholder)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
