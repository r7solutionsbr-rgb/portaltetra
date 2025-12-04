import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Users,
    UserCheck,
    Shield,
    MoreVertical,
    Plus,
    Search,
    Mail,
    Edit2,
    Key,
    Ban,
    CheckCircle2,
    XCircle
} from 'lucide-react';

interface SystemUser {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    avatarUrl: string | null;
}

// Mock data for last access since backend doesn't provide it yet
const getRandomLastAccess = () => {
    const options = ['Há 2 horas', 'Há 5 horas', 'Ontem', 'Há 2 dias', 'Há 1 semana', 'Nunca'];
    return options[Math.floor(Math.random() * options.length)];
};

export const Team: React.FC = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState<(SystemUser & { lastAccess?: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    // Form state
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'Operacional', sendInvite: true });

    useEffect(() => {
        fetchUsers();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            // Add mock last access
            const enrichedData = data.map((u: SystemUser) => ({
                ...u,
                lastAccess: getRandomLastAccess()
            }));
            setUsers(enrichedData);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: newUser.name,
                    email: newUser.email,
                    password: newUser.password,
                    role: newUser.role
                })
            });

            if (response.ok) {
                setShowModal(false);
                setNewUser({ name: '', email: '', password: '', role: 'Operacional', sendInvite: true });
                fetchUsers();
            }
        } catch (error) {
            console.error('Failed to create user', error);
        }
    };

    const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ isActive: !currentStatus })
            });
            fetchUsers();
        } catch (error) {
            console.error('Failed to update user', error);
        }
    };

    const getRoleBadgeStyle = (role: string) => {
        switch (role) {
            case 'Gestor': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'Financeiro': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Comercial': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'Operacional': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    const activeUsers = users.filter(u => u.isActive).length;
    const totalLicenses = 15; // Mock limit

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Equipe & Acessos</h1>
                        <p className="text-slate-400">Gerencie quem tem acesso ao portal e seus níveis de permissão.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                        <Plus className="w-5 h-5" />
                        Novo Usuário
                    </button>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                            <Users className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Total de Usuários</p>
                            <p className="text-2xl font-bold text-white">{users.length}</p>
                        </div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-lg">
                            <UserCheck className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Usuários Ativos</p>
                            <p className="text-2xl font-bold text-white">{activeUsers}</p>
                        </div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-lg">
                            <Shield className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Licenças Disponíveis</p>
                            <p className="text-2xl font-bold text-white">{totalLicenses - activeUsers} <span className="text-sm font-normal text-slate-500">de {totalLicenses}</span></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-visible shadow-xl">
                <div className="p-4 border-b border-slate-700 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou email..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                    </div>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-medium">Usuário</th>
                            <th className="px-6 py-4 font-medium">Função</th>
                            <th className="px-6 py-4 font-medium">Último Acesso</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-700/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-white font-bold overflow-hidden border border-slate-600 shadow-sm">
                                            {user.avatarUrl ? (
                                                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                user.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{user.name}</div>
                                            <div className="text-slate-400 text-sm">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeStyle(user.role)}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-slate-400 text-sm">{user.lastAccess}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                                        <span className={`text-sm ${user.isActive ? 'text-green-400' : 'text-red-400'}`}>
                                            {user.isActive ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMenu(activeMenu === user.id ? null : user.id);
                                        }}
                                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                    >
                                        <MoreVertical className="w-5 h-5" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {activeMenu === user.id && (
                                        <div className="absolute right-8 top-12 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                            <div className="py-1">
                                                <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2">
                                                    <Edit2 className="w-4 h-4" /> Editar Permissões
                                                </button>
                                                <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2">
                                                    <Key className="w-4 h-4" /> Resetar Senha
                                                </button>
                                                <button
                                                    onClick={() => toggleUserStatus(user.id, user.isActive)}
                                                    className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-700 flex items-center gap-2 ${user.isActive ? 'text-red-400' : 'text-green-400'}`}
                                                >
                                                    {user.isActive ? (
                                                        <><Ban className="w-4 h-4" /> Desativar Acesso</>
                                                    ) : (
                                                        <><CheckCircle2 className="w-4 h-4" /> Ativar Acesso</>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* New User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Novo Usuário</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Nome Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={newUser.name}
                                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Ex: João Silva"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Corporativo</label>
                                <input
                                    type="email"
                                    required
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="joao@empresa.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Senha Temporária</label>
                                <input
                                    type="password"
                                    required
                                    value={newUser.password}
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Função / Permissão</label>
                                <select
                                    value={newUser.role}
                                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                                >
                                    <option value="Gestor">Gestor (Acesso Total)</option>
                                    <option value="Financeiro">Financeiro</option>
                                    <option value="Comercial">Comercial</option>
                                    <option value="Operacional">Operacional</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                <input
                                    type="checkbox"
                                    id="sendInvite"
                                    checked={newUser.sendInvite}
                                    onChange={e => setNewUser({ ...newUser, sendInvite: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="sendInvite" className="text-sm text-slate-300 cursor-pointer select-none">
                                    Enviar convite por e-mail com instruções de acesso
                                </label>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-lg transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    <Mail className="w-4 h-4" />
                                    Criar Usuário
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
