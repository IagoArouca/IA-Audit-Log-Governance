import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Loader2, Mail, Lock, User, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import AuthLayout from "../components/AuthLayout";

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { signUp } = useAuth(); 
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await signUp(name, email, password);
            toast.success('Conta criada com sucesso!');
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erro ao criar conta.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout>
            <div className="mb-10 text-center md:text-left">
                <div className="relative inline-flex mb-6">
                    <div className="absolute inset-0 bg-indigo-500/30 blur-2xl rounded-full" />
                    <div className="relative w-16 h-16 bg-[#161b22] border border-slate-700 rounded-2xl flex items-center justify-center">
                        <Shield className="text-indigo-500 w-8 h-8" />
                    </div>
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight">
                    Criar Conta<span className="text-indigo-500"></span>
                </h1>
                <p className="text-slate-500 text-xs mt-3 font-bold uppercase tracking-[0.2em]">
                    Inicie sua jornada de auditoria
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-black ml-1 uppercase tracking-widest">Nome Completo</label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Nome"
                            className="w-full pl-12 pr-4 py-4 bg-[#161b22] border border-slate-800 rounded-xl text-white text-sm focus:border-indigo-500/50 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-black ml-1 uppercase tracking-widest">E-mail Corporativo</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            className="w-full pl-12 pr-4 py-4 bg-[#161b22] border border-slate-800 rounded-xl text-white text-sm focus:border-indigo-500/50 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-black ml-1 uppercase tracking-widest">Senha de Acesso</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-4 py-4 bg-[#161b22] border border-slate-800 rounded-xl text-white text-sm focus:border-indigo-500/50 outline-none transition-all"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl transition-all text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 group mt-4 shadow-lg shadow-indigo-900/20"
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : (
                        <>Finalizar Cadastro <ChevronRight size={16} /></>
                    )}
                </button>
            </form>

            <div className="mt-12 pt-8 border-t border-slate-800/50 text-center md:text-left">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    Já possui conta?{" "}
                    <Link to="/" className="text-indigo-500 hover:text-indigo-400 transition-colors ml-1 font-black">
                        Fazer Login
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}