import React from 'react';
import { useMockData } from '../../hooks/useMockData';

export const PeopleManagement: React.FC = () => {
    const { people } = useMockData();
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Gestão de Pessoas</h1>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Colaboradores</h2>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                        Adicionar Colaborador
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {people.map((person) => (
                                <tr key={person.id} className="hover:bg-gray-50">
                                    <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-900">{person.name}</td>
                                    <td className="p-3 whitespace-nowrap text-sm text-gray-500">{person.role}</td>
                                    <td className="p-3 whitespace-nowrap text-sm text-gray-500">{person.contact}</td>
                                    <td className="p-3 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${person.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {person.status}
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
}
