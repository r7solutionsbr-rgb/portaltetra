import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface CompanySettings {
    id: string;
    name: string;
    cnpj: string;
    primaryColor: string;
    logoUrl: string | null;
}

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

    if (loading) return <div className="p-8 text-slate-400">Carregando...</div>;
    if (!company) return <div className="p-8 text-red-400">Erro ao carregar dados da empresa.</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Perfil da Empresa</h1>
                <p className="text-slate-400">Gerencie as informações principais da sua organização</p>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Nome da Empresa</label>
                            <input
                                type="text"
                                value={company.name}
                                onChange={(e) => setCompany({ ...company, name: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">CNPJ</label>
                            <input
                                type="text"
                                value={company.cnpj}
                                disabled
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-400 cursor-not-allowed"
                            />
                            <p className="text-xs text-slate-500 mt-1">O CNPJ não pode ser alterado.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Cor Primária (Tema)</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={company.primaryColor}
                                    onChange={(e) => setCompany({ ...company, primaryColor: e.target.value })}
                                    className="h-10 w-20 bg-transparent cursor-pointer rounded border border-slate-700"
                                />
                                <span className="text-slate-400 font-mono">{company.primaryColor}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">URL do Logo</label>
                            <input
                                type="text"
                                value={company.logoUrl || ''}
                                onChange={(e) => setCompany({ ...company, logoUrl: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700 flex items-center justify-between">
                        {message && (
                            <span className="text-green-400 text-sm font-medium animate-fade-in">
                                {message}
                            </span>
                        )}
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors ml-auto disabled:opacity-50"
                        >
                            {saving ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
