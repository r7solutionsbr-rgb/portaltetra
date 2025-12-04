import React from 'react';
import { useMockData } from '../../hooks/useMockData';
import { StatCard } from './StatCard';
import { ConsumptionChart } from './ConsumptionChart';

const CreditLimitBar: React.FC<{ used: number, total: number }> = ({ used, total }) => {
    const percentage = (used / total) * 100;
    return (
        <div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2 text-right">
                {used.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} de {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
        </div>
    );
};

export const Dashboard: React.FC = () => {
  const { consumptionData, creditData, priceVariation } = useMockData();

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Executivo</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
                title="Limite de Crédito Disponível" 
                value={(creditData.total - creditData.used).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            >
                <CreditLimitBar used={creditData.used} total={creditData.total} />
            </StatCard>
            <StatCard 
                title="Variação do Preço Médio" 
                value="Diesel S-10"
                change={priceVariation}
            />
            <StatCard 
                title="Próxima Entrega Agendada" 
                value="25/11/2023"
            >
                 <p className="text-sm text-gray-500 mt-2">Pedido #PED-098764</p>
            </StatCard>
        </div>
        <div className="w-full">
            <ConsumptionChart data={consumptionData} />
        </div>
    </div>
  );
};
