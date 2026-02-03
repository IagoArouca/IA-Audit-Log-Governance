import React, { useEffect, useState } from 'react';
import { 
    LayoutDashboard, Key, ClipboardList, Settings, 
    LogOut, Shield, Loader2, Zap, AlertCircle, 
    DollarSign, Check, ChevronDown, ChevronRight, Play, X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

interface Stats {
    totalCalls: number;
    totalCost: number | string;
    sensitiveDataAlerts: number;
}

interface ApiKey {
    id: string;
    key: string;
    name: string;
}

interface AuditLog {
    id: string;
    prompt: string;
    response: string;
    tokensUsed: number;
    cost: number;
    sensitiveDataFound: boolean;
    createdAt: string;
}

export default function Dashboard() {
    const { user, signOut } = useAuth();
    const [stats, setStats] = useState<Stats | null>(null);
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreatingKey, setIsCreatingKey] = useState(false);
    const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);

    const [testPrompt, setTestPrompt] = useState('');
    const [selectedKey, setSelectedKey] = useState('');
    const [testLoading, setTestLoading] = useState(false);
    const [testResult, setTestResult] = useState<any>(null);

    const loadData = async () => {
        try {
            const [statsRes, keysRes, logsRes] = await Promise.all([
                api.get('/audit-logs/stats'),
                api.get('/api-keys'),
                api.get('/audit-logs')
            ]);
            setStats(statsRes.data);
            setKeys(keysRes.data);
            setLogs(logsRes.data);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleCreateKey = async () => {
        if (!newKeyName) return toast.error("Dê um nome para a chave");
        try {
            const res = await api.post('/api-keys', { name: newKeyName });
            setKeys([...keys, res.data]);
            setIsCreatingKey(false);
            setNewKeyName('');
            toast.success('Chave gerada!');
        } catch (e) { toast.error('Erro ao gerar chave'); }
    };

    const handleRunTest = async () => {
        if (!selectedKey) return toast.error("Selecione uma chave de API");
        if (!testPrompt) return toast.error("Digite um prompt");

        setTestLoading(true);
        try {
            const res = await api.post('/proxy/chat', { prompt: testPrompt }, {
                headers: { 'x-api-key': selectedKey }
            });

            const isSensitive = res.data.security_check.sensitive_data_leaked;
            setTestResult({
                response: isSensitive 
                    ? "Esta é uma resposta de risco processada pelo Eggplant Logs. Proceda com cautela."
                    : "Esta é uma resposta segura processada pelo Eggplant Logs.",
                sensitive: isSensitive
            });

            toast.success("Auditoria realizada!");
            await loadData(); 
        } catch (e) { toast.error("Erro no Proxy. Verifique a chave."); }
        finally { setTestLoading(false); }
    };

    const formatCurrency = (val: any) => {
        if (val === undefined || val === null) return "$0.00";
        const cleanValue = typeof val === 'string' 
            ? parseFloat(val.replace(/[^\d.-]/g, '')) 
            : val;

        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD', 
            minimumFractionDigits: 2,
            maximumFractionDigits: 4
        }).format(cleanValue || 0);
    };

    const alertCount = logs.filter(log => 
        log.sensitiveDataFound === true || 
        String(log.sensitiveDataFound) === 'true' || 
        (log as any).sensitiveDataFound === 1
    ).length;

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-[#0f172a]">
            <Loader2 className="animate-spin text-indigo-500" size={40} />
        </div>
    );

    return (
        <div className="flex h-screen bg-[#0f172a] text-slate-300 overflow-hidden relative font-sans">

            {isCreatingKey && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsCreatingKey(false)} />
                    <div className="relative bg-[#1e1b4b] w-full max-w-sm p-6 rounded-2xl border border-white/10 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Nova Chave</h3>
                            <button onClick={() => setIsCreatingKey(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <input 
                            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white mb-4 outline-none focus:border-indigo-500/50 text-sm"
                            placeholder="Nome da Chave (ex: Produção)"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                        />
                        <button onClick={handleCreateKey} className="w-full bg-[#4338ca] text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-indigo-500 transition-all">
                            Gerar Chave
                        </button>
                    </div>
                </div>
            )}
            {isPlaygroundOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsPlaygroundOpen(false)} />
                    <div className="relative bg-[#1e1b4b] w-full max-w-4xl p-8 rounded-2xl border border-white/10 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <Play className="text-indigo-400" size={24} />
                                <h2 className="text-sm font-black text-white tracking-[0.2em] uppercase">Playground de Testes</h2>
                            </div>
                            <button onClick={() => setIsPlaygroundOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <select className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-slate-300 outline-none focus:border-indigo-500/50 transition-all cursor-pointer" value={selectedKey} onChange={(e) => setSelectedKey(e.target.value)}>
                                    <option value="">Selecione a chave de API...</option>
                                    {keys.map(k => <option key={k.id} value={k.key}>{k.name}</option>)}
                                </select>
                                <textarea rows={4} className="w-full bg-black/30 border border-white/10 rounded-xl p-5 text-white outline-none focus:border-indigo-500/50 resize-none transition-all" placeholder="Envie um prompt de teste..." value={testPrompt} onChange={(e) => setTestPrompt(e.target.value)} />
                                <button onClick={handleRunTest} disabled={testLoading} className="w-full bg-[#4338ca] text-white py-4 rounded-xl font-black flex justify-center uppercase tracking-[0.15em] hover:bg-indigo-500 disabled:opacity-50 transition-all">
                                    {testLoading ? <Loader2 className="animate-spin" /> : "Executar Auditoria"}
                                </button>
                            </div>
                            <div className="bg-black/20 rounded-xl p-6 flex flex-col justify-center items-center border border-white/5 relative overflow-hidden min-h-[250px]">
                                {testResult ? (
                                    <div className="text-center space-y-4 animate-in fade-in zoom-in duration-500 z-10">
                                        <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg inline-block ${testResult.sensitive ? 'bg-red-500 text-white' : 'bg-indigo-600 text-white'}`}>
                                            {testResult.sensitive ? 'Risco Detectado' : 'Seguro'}
                                        </div>
                                        <p className="text-md text-slate-200 font-medium leading-relaxed italic">"{testResult.response}"</p>
                                    </div>
                                ) : <span className="text-slate-600 font-black uppercase text-xs tracking-[0.4em]">Standby</span>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-[#020617] flex flex-col transition-all duration-300 relative border-r border-white/5 shadow-2xl`}>
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)} 
                    className="absolute -right-[18px] top-24 bg-[#4338ca] rounded-full p-1.5 text-white border-[6px] border-[#0f172a] z-[60] hover:scale-110 transition-transform shadow-lg"
                >
                    {isCollapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronDown className="rotate-90" size={14} strokeWidth={3} />}
                </button>

                <div className="p-8 flex items-center gap-3">
                    <Shield className="text-indigo-500 shrink-0" size={32} />
                    {!isCollapsed && <span className="text-xl font-bold text-white tracking-tighter">Eggplant Logs</span>}
                </div>
                
                <nav className="flex-1 px-4 space-y-2">
                    <SidebarLink icon={<LayoutDashboard size={20}/>} label="Overview" active collapsed={isCollapsed} />
                    <SidebarLink icon={<Key size={20}/>} label="API Keys" collapsed={isCollapsed} />
                    <SidebarLink icon={<ClipboardList size={20}/>} label="Audit Logs" collapsed={isCollapsed} />
                    <SidebarLink icon={<Settings size={20}/>} label="Settings" collapsed={isCollapsed} />
                </nav>

                <div className="p-6 border-t border-white/5">
                    <button onClick={signOut} className="flex items-center gap-4 text-slate-500 hover:text-red-400 font-bold text-[11px] uppercase tracking-widest transition-colors w-full px-4">
                        <LogOut size={20}/> {!isCollapsed && "Log Out"}
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto p-12 bg-[radial-gradient(circle_at_top_right,_#1e1b4b_0%,_#0f172a_100%)]">
                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <p className="text-indigo-400 font-bold text-xs uppercase tracking-[0.2em] mb-1">Eggplant Platform</p>
                        <h1 className="text-4xl font-black text-white tracking-tight leading-none">Security Operations Center</h1>
                    </div>
                </header>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard 
                        title="Chamadas" 
                        value={stats?.totalCalls || 0} 
                        icon={<Zap size={20} className="text-white" />} 
                        iconBg="bg-blue-600"
                        description="Total auditado" 
                    />
                    <StatCard 
                        title="Custo" 
                        value={formatCurrency(stats?.totalCost)} 
                        icon={<DollarSign size={20} className="text-white" />} 
                        iconBg="bg-emerald-600"
                        description="Investimento total" 
                    />
                    <StatCard 
                        title="Alertas" 
                        value={alertCount} 
                        icon={<AlertCircle size={20} className="text-white" />} 
                        iconBg="bg-red-600"
                        description="Riscos detectados" 
                        alert={alertCount > 0} 
                    />
                </div>

                <section className="bg-[#1e1b4b]/40 rounded-2xl overflow-hidden shadow-2xl border border-white/5 backdrop-blur-sm">
                    <div className="p-6 bg-[#020617]/60 flex justify-between items-center px-8 border-b border-white/5">
                        <h2 className="font-bold text-white uppercase text-xs tracking-[0.2em]">Logs de Auditoria</h2>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsPlaygroundOpen(true)} className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-white/5">
                                <Play size={12} fill="currentColor"/> Testes
                            </button>
                            <button onClick={() => setIsCreatingKey(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-900/20">
                                + Nova Chave
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="text-[11px] uppercase text-slate-500 font-black tracking-widest">
                                <tr>
                                    <th className="px-8 py-5 bg-[#020617]/40">Status</th>
                                    <th className="px-8 py-5 bg-[#0f172a]/40 border-b border-white/5">Prompt / Input</th>
                                    <th className="px-8 py-5 bg-[#0f172a]/40 border-b border-white/5 text-right">Data</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {logs.map(log => (
                                    <tr key={log.id} className="group transition-all">
                                        <td className="px-8 py-5 bg-[#020617]/20 whitespace-nowrap border-b border-white/5">
                                            {log.sensitiveDataFound ? 
                                                <span className="text-red-500 text-[10px] font-black uppercase flex items-center gap-2 tracking-tighter"><AlertCircle size={14}/> Risco</span> : 
                                                <span className="text-indigo-400 text-[10px] font-black uppercase flex items-center gap-2 tracking-tighter"><Check size={14}/> Seguro</span>
                                            }
                                        </td>
                                        <td className="px-8 py-5 bg-transparent group-hover:bg-white/5 transition-colors border-b border-white/5">
                                            <p className="text-sm text-slate-300 font-medium truncate max-w-md">{log.prompt}</p>
                                        </td>
                                        <td className="px-8 py-5 bg-transparent group-hover:bg-white/5 text-right transition-colors border-b border-white/5">
                                            <span className="text-[11px] text-slate-500 font-black tabular-nums tracking-wider">
                                                {new Date(log.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {logs.length === 0 && (
                        <div className="p-20 text-center text-slate-700 text-[10px] font-black uppercase tracking-[0.5em]">
                            Sem registros encontrados
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

function SidebarLink({ icon, label, active = false, collapsed = false }: any) {
    return (
        <a href="#" className={`flex items-center ${collapsed ? 'justify-center' : 'gap-4 px-6'} py-3.5 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${active ? 'bg-[#4338ca] text-white shadow-xl shadow-indigo-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
            <div className="shrink-0">{icon}</div> {!collapsed && <span>{label}</span>}
        </a>
    );
}

function StatCard({ title, value, icon, iconBg, description, alert = false }: any) {
    return (
        <div className={`bg-[#1e1b4b]/60 backdrop-blur-md p-6 rounded-2xl shadow-xl border transition-all duration-500 flex flex-col justify-between h-40 ${alert ? 'border-red-500/50 animate-[pulse_1.5s_infinite] shadow-red-500/10' : 'border-white/5'}`}>
            <div className="flex justify-between items-start">
                <p className="text-[10px] text-indigo-300/50 font-black uppercase tracking-widest">{title}</p>
                <div className={`${iconBg} p-2 rounded-xl shadow-lg shadow-black/20`}>
                    {icon}
                </div>
            </div>
            <div>
                <h3 className={`text-3xl font-black tracking-tighter mb-0.5 ${alert ? 'text-red-400' : 'text-white'}`}>
                    {value}
                </h3>
                <div className="flex items-center gap-2">
                    {alert && <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />}
                    <p className={`text-[9px] font-bold uppercase ${alert ? 'text-red-400' : 'text-slate-500'}`}>
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}