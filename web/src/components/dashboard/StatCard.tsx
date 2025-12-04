import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  children?: React.ReactNode;
}

const TrendIcon = ({ value }: { value: number }) => {
    const isPositive = value > 0;
    return (
        <span className={`flex items-center text-sm font-semibold ${isPositive ? 'text-red-500' : 'text-green-500'}`}>
            {isPositive ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-11.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 8.414V13a1 1 0 102 0V8.414l1.293 1.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.707-6.707a1 1 0 001.414-1.414l3-3a1 1 0 10-1.414-1.414L11 11.586V7a1 1 0 10-2 0v4.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3z" clipRule="evenodd" />
                </svg>
            )}
            {Math.abs(value)}%
        </span>
    );
};

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
        {change !== undefined && <TrendIcon value={change} />}
      </div>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};
