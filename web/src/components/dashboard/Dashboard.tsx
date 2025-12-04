import React from 'react';
import { useAppData } from '../../hooks/useAppData';
import { StatCard } from './StatCard';
import { ConsumptionChart } from './ConsumptionChart';
import {
    CreditCard,
    TrendingUp,
    Truck,
    FileText,
    Download,
    MessageCircle,
    PlusCircle,
    Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CreditLimitBar: React.FC<{ used: number, total: number }> = ({ used, total }) => {
    const percentage = Math.min((used / total) * 100, 100);
    return (
        <div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 mt-2 overflow-hidden">
                <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${percentage > 80 ? 'bg-red-500' : 'bg-blue-600'}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-right font-medium">
                {used.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} de {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
        </div>
    );
};

const QuickAction = ({ icon, label, onClick, to, external }: any) => {
    const content = (
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group h-full">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3 group-hover:bg-blue-100 transition-colors">
                {icon}
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 text-center">{label}</span>
        </div>
    );

    if (to) {
        return <Link to={to} className="block h-full">{content}</Link>;
    }

    if (external) {
        return <a href={external} target="_blank" rel="noopener noreferrer" className="block h-full">{content}</a>;
    }

    return <div onClick={onClick} className="block h-full">{content}</div>;
};

export const Dashboard: React.FC = () => {
    const {
        consumptionData,
        creditData,
        priceVariation,
        invoices,
        deliveries,
        paymentRequests,
        loading
    } = useAppData();

    // Calculate recent activity
    const recentActivity = [
        ...invoices.map(i => ({
            id: i.id,
            type: 'Fatura',
            description: `Fatura #${i.id}`,
            date: new Date(i.issueDate),
            status: i.status,
            amount: i.amount
        })),
        ...deliveries.map(d => ({
            id: d.id,
            type: 'Entrega',
            description: `Entrega #${d.id} - ${d.product}`,
            date: new Date(d.date),
            status: d.status,
            amount: d.volume
        })),
        ...paymentRequests.map(p => ({
            id: p.id,
            type: 'Pagamento',
            description: `Solicitação #${p.id}`,
            date: new Date(p.requestDate),
            status: p.status,
            amount: p.amount
        }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5);

    const getStatusColor = (status: string) => {
        if (['Paga', 'Entregue', 'Aprovado', 'Concluído'].includes(status)) return 'text-green-700 bg-green-50 border-green-100';
        if (['Pendente', 'Solicitado', 'Em Aberto', 'Agendado', 'Em Trânsito'].includes(status)) return 'text-yellow-700 bg-yellow-50 border-yellow-100';
        if (['Vencida', 'Cancelado', 'Rejeitado'].includes(status)) return 'text-red-700 bg-red-50 border-red-100';
        return 'text-gray-700 bg-gray-50 border-gray-100';
    };

    const getStatusIcon = (type: string) => {
        switch (type) {
            case 'Fatura': return <FileText size={16} />;
            case 'Entrega': return <Truck size={16} />;
            case 'Pagamento': return <CreditCard size={16} />;
            default: return <Activity size={16} />;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const availableCredit = creditData.total - creditData.used;
    const isLowCredit = availableCredit < (creditData.total * 0.2);

    // Find next delivery
    const nextDelivery = deliveries
        .filter(d => ['Agendado', 'Em Trânsito', 'Solicitado'].includes(d.status))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

    const isDeliveryToday = nextDelivery && new Date(nextDelivery.date).toDateString() === new Date().toDateString();

    return (
        <div className="space-y-8 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Executivo</h1>
                    <p className="text-gray-500 mt-1">Visão geral da sua operação e financeiro</p>
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                    Atualizado: {new Date().toLocaleTimeString()}
                </span>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickAction icon={<PlusCircle size={24} />} label="Solicitar Cotação" to="/orders/new" />
                <QuickAction icon={<Download size={24} />} label="Baixar Boletos" to="/financial" />
                <QuickAction icon={<Truck size={24} />} label="Rastrear Frota" to="/fleet" />
                <QuickAction icon={<MessageCircle size={24} />} label="Suporte WhatsApp" external="https://wa.me/5511999999999" />
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Limite de Crédito Disponível"
                    value={availableCredit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    icon={<CreditCard size={20} />}
                    valueColor={isLowCredit ? 'text-red-600' : 'text-gray-800'}
                    footerLinkText="Ver extrato financeiro"
                    footerLinkUrl="/financial"
                >
                    <CreditLimitBar used={creditData.used} total={creditData.total} />
                </StatCard>

                <StatCard
                    title="Variação do Preço Médio"
                    value="Diesel S-10"
                    change={priceVariation}
                    icon={<TrendingUp size={20} />}
                    footerLinkText="Ver histórico de preços"
                    footerLinkUrl="/prices"
                >
                    <p className="text-xs text-gray-500 mt-2">Comparado ao mês anterior</p>
                </StatCard>

                <StatCard
                    title="Próxima Entrega"
                    value={nextDelivery ? new Date(nextDelivery.date).toLocaleDateString() : "--/--/----"}
                    icon={<Truck size={20} />}
                    valueColor={isDeliveryToday ? 'text-yellow-600' : 'text-gray-800'}
                    footerLinkText="Ver todos os pedidos"
                    footerLinkUrl="/orders"
                >
                    {nextDelivery ? (
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                            <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded ${nextDelivery.status === 'Em Trânsito' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                {nextDelivery.status}
                            </span>
                            #{nextDelivery.id.substring(0, 8)}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 mt-2">Nenhuma entrega agendada</p>
                    )}
                </StatCard>
            </div>

            {/* Chart and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <ConsumptionChart data={consumptionData} />
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col h-96">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Activity size={20} className="mr-2 text-blue-600" />
                        Últimas Movimentações
                    </h3>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {recentActivity.map((activity) => (
                            <div key={`${activity.type}-${activity.id}`} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100 group">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${getStatusColor(activity.status).split(' ')[1]} ${getStatusColor(activity.status).split(' ')[0]}`}>
                                        {getStatusIcon(activity.type)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">{activity.description}</p>
                                        <p className="text-xs text-gray-500">{activity.date.toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${getStatusColor(activity.status)}`}>
                                        {activity.status}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {recentActivity.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <Activity size={32} className="mb-2 opacity-50" />
                                <p>Nenhuma atividade recente.</p>
                            </div>
                        )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                        <Link to="/notifications" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center">
                            Ver todas as notificações
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
