import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Upload, Check, Loader2, LayoutDashboard, Users, Settings, FileText } from 'lucide-react';

interface CompanySettings {
    id: string;
    name: string;
    cnpj: string;
    primaryColor: string;
    logoUrl: string | null;
}

const PRESET_COLORS = ['#1E293B', '#2563EB', '#059669', '#D97706', '#DC2626'];

export const CompanyProfile: React.FC = () => {
    const { token } = useAuth();
    const [company, setCompany] = useState<CompanySettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchCompanyData();
    }, []);

    const fetchCompanyData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/company/settings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            setCompany(data);
        } catch (error) {
            console.error('Failed to fetch company settings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!company) return;

        setSaving(true);
        setMessage('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/company/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: company.name,
                    primaryColor: company.primaryColor,
                    logoUrl: company.logoUrl
                })
            });

            if (response.ok) {
                setMessage('Configurações salvas com sucesso!');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Failed to update settings', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
    );

    if (!company) return <div className="p-8 text-red-400">Erro ao carregar dados da empresa.</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Central da Marca</h1>
                <p className="text-slate-400">Personalize a identidade visual da sua empresa no portal.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Edit Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-blue-500" />
                            Dados & Identidade
                        </h2>

                        <form onSubmit={handleSave} className="space-y-8">
                            {/* Logo Section */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-4">Logo da Empresa</label>
                                <div className="flex items-start gap-6">
                                    <div className="w-32 h-32 rounded-lg bg-slate-900 border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden relative group">
                                        {company.logoUrl ? (
                                            <img
                                                src={company.logoUrl}
                                                alt="Logo Preview"
                                                className="w-full h-full object-contain p-2"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '';
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                    (e.target as HTMLImageElement).parentElement?.classList.add('fallback-active');
                                                }}
                                            />
                                        ) : (
                                            <Upload className="w-8 h-8 text-slate-500" />
                                        )}
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-xs text-white font-medium">Preview</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={company.logoUrl || ''}
                                            onChange={(e) => setCompany({ ...company, logoUrl: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none mb-2"
                                            placeholder="https://exemplo.com/logo.png"
                                        />
                                        <p className="text-xs text-slate-500">
                                            Cole a URL da imagem do seu logo. Recomendamos formato PNG com fundo transparente.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Company Name */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Nome da Empresa</label>
                                    <input
                                        type="text"
                                        value={company.name}
                                        onChange={(e) => setCompany({ ...company, name: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                {/* CNPJ (Locked) */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">CNPJ</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={company.cnpj}
                                            disabled
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-400 cursor-not-allowed pl-10"
                                        />
                                        <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> Campo protegido
                                    </p>
                                </div>
                            </div>

                            {/* Primary Color */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-3">Cor Primária (Tema)</label>
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="relative">
                                        <input
                                            type="color"
                                            value={company.primaryColor}
                                            onChange={(e) => setCompany({ ...company, primaryColor: e.target.value })}
                                            className="h-12 w-20 bg-transparent cursor-pointer rounded-lg border border-slate-700 p-1"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-700">
                                        {PRESET_COLORS.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setCompany({ ...company, primaryColor: color })}
                                                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${company.primaryColor === color ? 'border-white ring-2 ring-blue-500/50' : 'border-transparent'}`}
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-slate-400 font-mono text-sm ml-2">{company.primaryColor}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-6 border-t border-slate-700 flex items-center justify-between">
                                {message && (
                                    <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-2 rounded-lg animate-fade-in">
                                        <Check className="w-4 h-4" />
                                        <span className="text-sm font-medium">{message}</span>
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ml-auto disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Salvando...
                                        </>
                                    ) : (
                                        'Salvar Alterações'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: Preview Card */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8">
                        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg">
                            <h3 className="text-lg font-semibold text-white mb-4">Visualização no Portal</h3>
                            <p className="text-sm text-slate-400 mb-6">
                                É assim que a sua marca aparecerá no topo do menu lateral.
                            </p>

                            {/* Sidebar Preview Simulation */}
                            <div className="rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-900">
                                <div className="flex h-64">
                                    {/* Simulated Sidebar */}
                                    <div
                                        className="w-16 flex flex-col items-center py-4 gap-4 transition-colors duration-300"
                                        style={{ backgroundColor: company.primaryColor }}
                                    >
                                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                            {company.logoUrl ? (
                                                <img src={company.logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
                                            ) : (
                                                <div className="w-6 h-6 bg-white/20 rounded-full" />
                                            )}
                                        </div>
                                        <div className="w-8 h-1 bg-white/20 rounded-full mt-2" />

                                        {/* Fake Menu Items */}
                                        <div className="mt-4 space-y-4 w-full flex flex-col items-center">
                                            <div className="p-2 bg-white/20 rounded-lg">
                                                <LayoutDashboard className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="p-2 opacity-50">
                                                <FileText className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="p-2 opacity-50">
                                                <Users className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Simulated Content Area */}
                                    <div className="flex-1 bg-slate-50 p-4">
                                        <div className="h-4 w-32 bg-slate-200 rounded mb-4" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="h-20 bg-white rounded shadow-sm border border-slate-100" />
                                            <div className="h-20 bg-white rounded shadow-sm border border-slate-100" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <p className="text-xs text-blue-400 text-center">
                                    A cor primária também será usada em botões, links e destaques do sistema.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
