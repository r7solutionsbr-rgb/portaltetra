import React from 'react';
import { Link } from 'react-router-dom';

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
  valueColor?: string;
  footerLinkText?: string;
  footerLinkUrl?: string;
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

export const StatCard: React.FC<StatCardProps> = ({ 
    title, 
    value, 
    change, 
    icon, 
    valueColor = 'text-gray-800', 
    footerLinkText, 
    footerLinkUrl, 
    children 
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between h-full transition-shadow hover:shadow-md">
      <div>
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
            {icon && <div className="text-gray-400 p-2 bg-gray-50 rounded-lg">{icon}</div>}
          </div>
          
          <div className="mt-4 flex items-baseline">
            <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
            {change !== undefined && <div className="ml-3"><TrendIcon value={change} /></div>}
          </div>
          
          {children && <div className="mt-4">{children}</div>}
      </div>

      {footerLinkText && footerLinkUrl && (
        <div className="mt-4 pt-4 border-t border-gray-100">
            <Link to={footerLinkUrl} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center group">
                {footerLinkText}
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </Link>
        </div>
      )}
    </div>
  );
};
