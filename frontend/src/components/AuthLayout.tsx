import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#0d1117] font-sans">
            <div className="hidden md:flex md:w-3/5 lg:w-[65%] relative overflow-hidden">
                <img 
                    src="/bg-berinjela.png" 
                    alt="Background" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-[#0d1117]/90" />
                
                <div className="absolute bottom-10 left-10 p-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-white font-bold text-lg">Eggplant Logs</p>
                    <p className="text-slate-300 text-sm">Sua governança de IA em boas mãos.</p>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-[#0d1117] z-10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
                <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-right duration-500">
                    {children}
                </div>
            </div>
        </div>
    );
}