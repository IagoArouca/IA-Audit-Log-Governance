import { LayoutDashboard, Key, ClipboardList, Settings, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
    const { user, signOut } = useAuth();

    return (
        <div className="flex h-screen bg-[#0d1117] text-slate-300 font-sans">
            
            {/* SIDEBAR */}
            <aside className="w-64 bg-[#161b22] border-r border-white/5 flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                        <Shield className="text-slate-950" size={20} />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tighter">IAauditLog</span>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <SidebarItem icon={<LayoutDashboard size={20}/>} label="Overview" active />
                    <SidebarItem icon={<Key size={20}/>} label="API Keys" />
                    <SidebarItem icon={<ClipboardList size={20}/>} label="Audit Logs" />
                    <SidebarItem icon={<Settings size={20}/>} label="Settings" />
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button 
                        onClick={signOut}
                        className="flex items-center gap-3 px-4 py-3 w-full hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all group"
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        <span className="font-medium">Sair do Sistema</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-y-auto p-8">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Bem-vindo, {user?.name}</h1>
                        <p className="text-slate-500 text-sm">Monitore e audite chamadas de IA em tempo real.</p>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-[#161b22] p-2 pr-6 rounded-full border border-white/5">
                        <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 font-bold">
                            {user?.name?.charAt(0)}
                        </div>
                        <span className="text-sm font-medium">{user?.email}</span>
                    </div>
                </header>

                {/* Conteúdo das Sprints Futuras virá aqui */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Total de Chamadas" value="12,405" sub="Últimos 30 dias" />
                    <StatCard title="Custo Estimado" value="$ 42.08" sub="Economia de 12%" />
                    <StatCard title="Dados Sensíveis" value="03" sub="Interceptações" alert />
                </div>
            </main>
        </div>
    );
}

// Sub-componentes para manter o código limpo (Mentalidade Pleno)
function SidebarItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
    return (
        <a href="#" className={`
            flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
            ${active ? 'bg-amber-500 text-slate-950' : 'hover:bg-white/5 text-slate-400 hover:text-white'}
        `}>
            {icon}
            {label}
        </a>
    );
}

function StatCard({ title, value, sub, alert = false }: any) {
    return (
        <div className="bg-[#161b22] p-6 rounded-[2rem] border border-white/5">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
            <h3 className={`text-3xl font-bold ${alert ? 'text-red-500' : 'text-white'}`}>{value}</h3>
            <p className="text-[10px] text-slate-600 mt-2 font-medium">{sub}</p>
        </div>
    );
}