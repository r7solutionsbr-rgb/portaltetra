import React from 'react';
import { useMockData } from '../../hooks/useMockData';
import { Vehicle } from '../../types';

const getStatusClass = (status: Vehicle['status']) => {
  switch (status) {
    case 'Operacional': return 'bg-green-100 text-green-800';
    case 'Em Manutenção': return 'bg-yellow-100 text-yellow-800';
    case 'Inativo': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const FleetManagement: React.FC = () => {
    const { vehicles } = useMockData();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Gestão de Frota</h1>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Veículos Cadastrados</h2>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                        Adicionar Veículo
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motorista</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Próx. Revisão</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {vehicles.map((vehicle) => (
                                <tr key={vehicle.id} className="hover:bg-gray-50">
                                    <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-900">{vehicle.plate}</td>
                                    <td className="p-3 whitespace-nowrap text-sm text-gray-500">{vehicle.model}</td>
                                    <td className="p-3 whitespace-nowrap text-sm text-gray-500">{vehicle.driver}</td>
                                    <td className="p-3 whitespace-nowrap text-sm text-gray-500">{vehicle.nextInspection}</td>
                                    <td className="p-3 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(vehicle.status)}`}>
                                            {vehicle.status}
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
