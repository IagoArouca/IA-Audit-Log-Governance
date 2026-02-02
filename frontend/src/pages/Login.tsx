import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Loader2, Target, ChevronRight } from 'lucide-react'; 
import { useNavigate, Link } from "react-router-dom"; 
import { useAuth } from "../hooks/useAuth"; // Nosso hook customizado
import toast from "react-hot-toast";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Consumindo o signIn do nosso Contexto
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Chamada ao Contexto que gerencia Axios e LocalStorage
            await signIn({
                email: formData.email,
                password: formData.password
            });
            
            toast.success("Acesso autorizado ao Sentinel."); 
            navigate('/dashboard'); // Rota que criaremos na Sprint 2
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Falha na verificação de identidade.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0d1117] relative overflow-hidden font-sans">
            
            {/* Background Decorativo - Identidade Sentinel */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#30363d_1px,transparent_1px),linear-gradient(to_bottom,#30363d_1px,transparent_1px)] bg-[size:30px_30px]" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-[500px] h-[500px] border-[50px] border-slate-700/30 rounded-full border-dotted rotate-12" />
            </div>

            <div className="relative z-10 w-full max-w-[420px] px-6">
                
                {/* Card de Login */}
                <div className="bg-[#161b22] rounded-[2.5rem] p-10 shadow-2xl border border-white/5 relative">
                    
                    {/* Logo/Header */}
                    <div className="text-center mb-10">
                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-amber-500/30 blur-2xl rounded-full" />
                            <div className="relative w-20 h-20 bg-[#21262d] border border-slate-700 rounded-3xl flex items-center justify-center">
                                <Target className="text-amber-500 w-10 h-10" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            Sentinel<span className="text-amber-500/90 font-light">.io</span>
                        </h1>
                        <p className="text-slate-500 text-[11px] mt-2 font-medium tracking-widest uppercase">AI Governance & Audit</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            {/* Input E-mail */}
                            <div className="space-y-2">
                                <label className="text-[10px] text-slate-400 font-bold ml-4 uppercase tracking-widest">E-mail corporativo</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={16} />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="user@company.com"
                                        className="w-full pl-12 pr-4 py-3.5 bg-[#2d333b] border border-transparent rounded-full text-white text-sm placeholder-slate-600 focus:bg-[#30363d] focus:border-amber-500/50 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {/* Input Senha */}
                            <div className="space-y-2">
                                <label className="text-[10px] text-slate-400 font-bold ml-4 uppercase tracking-widest">Senha de acesso</label>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={16} />
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-12 py-3.5 bg-[#2d333b] border border-transparent rounded-full text-white text-sm placeholder-slate-600 focus:bg-[#30363d] focus:border-amber-500/50 transition-all outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-500 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Botão de Submissão */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#e3a651] hover:bg-[#d49540] disabled:bg-slate-700 text-slate-950 font-extrabold py-4 rounded-full transition-all text-sm shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Autenticar no Sistema
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer do Card */}
                    <div className="mt-10 pt-6 border-t border-slate-800/50 text-center">
                        <p className="text-[11px] text-slate-500">
                            Novo por aqui?{" "}
                            <Link to="/register" className="text-amber-500 font-bold hover:underline tracking-tight">
                                Solicitar acesso de operador
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}