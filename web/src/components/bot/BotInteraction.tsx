import React from 'react';
import { useMockData } from '../../hooks/useMockData';

export const BotInteraction: React.FC = () => {
  const { botMessages } = useMockData();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Interação BOTZap</h1>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col space-y-4 h-[60vh] overflow-y-auto p-4 bg-gray-50 rounded-lg">
          {botMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end ${msg.sender === 'ADM' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
                  msg.sender === 'ADM'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs text-right mt-1 opacity-75">{msg.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex">
            <input type="text" placeholder="Digite uma mensagem..." className="flex-1 p-2 border rounded-l-lg focus:ring-blue-500 focus:border-blue-500" />
            <button className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700">Enviar</button>
        </div>
      </div>
    </div>
  );
};
