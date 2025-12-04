import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ConsumptionData } from '../../types';

interface ConsumptionChartProps {
  data: ConsumptionData[];
}

export const ConsumptionChart: React.FC<ConsumptionChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-96">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Consumo de Combustível (Últimos 6 Meses)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 25,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#6B7280' }} />
          <YAxis 
            tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { notation: 'compact', compactDisplay: 'short' }).format(value as number)}
            tick={{ fill: '#6B7280' }}
          />
          <Tooltip 
            cursor={{fill: 'rgba(243, 244, 246, 0.5)'}}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            formatter={(value) => [`${(value as number).toLocaleString('pt-BR')} L`, 'Litros']}
          />
          <Legend wrapperStyle={{paddingTop: '20px'}}/>
          <Bar dataKey="liters" name="Litros" fill="#3B82F6" barSize={40} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
