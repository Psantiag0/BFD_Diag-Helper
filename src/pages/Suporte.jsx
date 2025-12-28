import { Mail, Phone, MessageCircle, ArrowLeft, LifeBuoy } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Suporte() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="bg-white shadow-2xl shadow-slate-200 rounded-[2rem] p-8 md:p-10 max-w-lg w-full border border-slate-100">
                
                {/* Botão Voltar Estilizado */}
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center text-slate-500 mb-8 hover:text-blue-600 transition-colors font-medium text-sm"
                >
                    <div className="bg-slate-100 group-hover:bg-blue-50 p-2 rounded-full mr-3 transition-colors">
                        <ArrowLeft size={18} />
                    </div>
                    Voltar para o login
                </button>

                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-4">
                        <LifeBuoy size={32} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        Precisa de Ajuda?
                    </h1>
                    <p className="text-slate-500 mt-3 text-lg">
                        Escolha um canal abaixo para falar com nossa equipe técnica.
                    </p>
                </div>

                <div className="space-y-4">
                    {/* WhatsApp - Destaque Principal */}
                    <button
                        className="w-full bg-emerald-600 text-white p-4 rounded-2xl flex items-center justify-between group hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-100 transition-all active:scale-[0.98]"
                        onClick={() => window.open("https://wa.me/5511999999999", "_blank")}
                    >
                        <div className="flex items-center gap-4 font-bold">
                            <MessageCircle size={24} className="group-hover:animate-bounce" />
                            WhatsApp Suporte
                        </div>
                        <span className="text-xs bg-emerald-500 px-2 py-1 rounded-md">Online</span>
                    </button>

                    {/* Telefone */}
                    <button
                        className="w-full border-2 border-slate-100 bg-white p-4 rounded-2xl flex items-center gap-4 text-slate-700 font-bold hover:border-blue-200 hover:bg-blue-50 transition-all active:scale-[0.98]"
                        onClick={() => (window.location.href = "tel:+5511999999999")}
                    >
                        <div className="text-blue-600">
                            <Phone size={22} />
                        </div>
                        Ligar agora
                    </button>

                    {/* Email */}
                    <button
                        className="w-full border-2 border-slate-100 bg-white p-4 rounded-2xl flex items-center gap-4 text-slate-700 font-bold hover:border-blue-200 hover:bg-blue-50 transition-all active:scale-[0.98]"
                        onClick={() => (window.location.href = "mailto:suporte@clinic.com")}
                    >
                        <div className="text-blue-600">
                            <Mail size={22} />
                        </div>
                        Enviar e-mail
                    </button>
                </div>

                {/* Info de Recuperação de Senha */}
                <div className="mt-10 p-5 bg-blue-50 rounded-2xl border border-blue-100">
                    <p className="text-center text-sm text-blue-800 font-medium leading-relaxed">
                        🔑 Para <strong>recuperação de senha</strong>, tenha em mãos seu <strong>CPF ou E-mail</strong> cadastrado para agilizar o atendimento.
                    </p>
                </div>

                <p className="mt-8 text-center text-xs text-slate-400 font-medium uppercase tracking-widest">
                    Atendimento de Seg. à Sex. • 08h às 18h
                </p>
            </div>
        </div>
    );
}