import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { carregarUsuarios, salvarUsuarios } from "../data/dadosUsuarios"; 
import PageWrapper from "../components/PageWrapper";
import { MdSave, MdDeleteSweep, MdPerson, MdSettings, MdShield } from "react-icons/md";

export default function Configuracoes() {
  const navigate = useNavigate(); 

  const usuarioLocalStorage = JSON.parse(localStorage.getItem("usuario")) || {
    nome: "Usuário",
    email: "",
    tipoUsuario: "deslogado",
  };

  const [tema, setTema] = useState("claro");
  const [menuExpandido, setMenuExpandido] = useState(true);
  const [mostrarAvatar, setMostrarAvatar] = useState(true);

  const [nome, setNome] = useState(usuarioLocalStorage.nome || "");
  const [emailAtual, setEmailAtual] = useState(usuarioLocalStorage.email || ""); 
  const [novoEmail, setNovoEmail] = useState(usuarioLocalStorage.email || ""); 
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [erroSenha, setErroSenha] = useState("");

  const [logsAtivos, setLogsAtivos] = useState(true);
  const [tempoSessao, setTempoSessao] = useState(30);
  const [modoPrivado, setModoPrivado] = useState(false);

  function salvarConfiguracoes() {
    let deveFazerLogout = false;
    
    if (novaSenha && novaSenha !== confirmaSenha) {
      setErroSenha("As senhas não coincidem!");
      return;
    }
    setErroSenha("");

    const novasPreferencias = { tema, menuExpandido, mostrarAvatar, logsAtivos, tempoSessao, modoPrivado };
    localStorage.setItem("preferencias", JSON.stringify(novasPreferencias));

    let atualizacaoNecessaria = nome !== usuarioLocalStorage.nome || novoEmail !== emailAtual || novaSenha.length > 0;

    if (atualizacaoNecessaria) {
      const todosUsuarios = carregarUsuarios();
      const usuarioIndex = todosUsuarios.findIndex(u => u.email === emailAtual);

      if (usuarioIndex !== -1) {
        let usuarioAtualizado = { ...todosUsuarios[usuarioIndex] };
        usuarioAtualizado.nome = nome;

        if (novoEmail !== emailAtual) {
          if (todosUsuarios.some((u, index) => index !== usuarioIndex && u.email === novoEmail)) {
            alert("Erro: O novo email já está sendo usado.");
            return;
          }
          usuarioAtualizado.email = novoEmail;
        }

        if (novaSenha) {
          usuarioAtualizado.senha = novaSenha;
          deveFazerLogout = true;
        }

        todosUsuarios[usuarioIndex] = usuarioAtualizado;
        salvarUsuarios(todosUsuarios);

        localStorage.setItem("usuario", JSON.stringify({
          nome: usuarioAtualizado.nome,
          email: usuarioAtualizado.email,
          tipoUsuario: usuarioAtualizado.tipoUsuario
        }));

        setEmailAtual(usuarioAtualizado.email);
        setNovaSenha("");
        setConfirmaSenha("");
      }
    }
    
    alert("Configurações salvas com sucesso!");
    if (deveFazerLogout) {
      localStorage.removeItem('usuario');
      navigate("/"); 
    }
  }

  function limparTudo() {
    if (confirm("Deseja apagar Sessão e Preferências? O login será encerrado.")) {
      localStorage.removeItem("preferencias");
      localStorage.removeItem("usuario");
      navigate("/");
    }
  }

  return (
    <PageWrapper title="Configurações">
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        
 
        <section className="bg-white p-4 md:p-6 shadow-sm border border-slate-200 rounded-2xl">
          <div className="flex items-center gap-2 mb-6 text-slate-800">
            <MdPerson size={24} className="text-blue-600" />
            <h2 className="text-xl font-bold">Alteração de Cadastro</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
            
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 mb-1 uppercase ml-1">E-mail Atual</label>
              <input type="text" value={emailAtual} readOnly className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 text-slate-400 cursor-not-allowed outline-none" />
            </div>

            <Input label="Novo E-mail" type="email" value={novoEmail} onChange={(e) => setNovoEmail(e.target.value)} />
            <Input label="Nova Senha" type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} placeholder="••••••••" />
            
            <div className="md:col-span-1">
              <Input label="Confirme a Senha" type="password" value={confirmaSenha} onChange={(e) => setConfirmaSenha(e.target.value)} placeholder="••••••••" />
              {erroSenha && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{erroSenha}</p>}
            </div>
          </div>
        </section>

    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Preferências */}
          <section className="bg-white p-6 shadow-sm border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-2 mb-6 text-slate-800">
              <MdSettings size={22} className="text-purple-600" />
              <h2 className="text-lg font-bold">Preferências</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Tema do Sistema</label>
                <select value={tema} onChange={(e) => setTema(e.target.value)} className="w-full border border-slate-300 p-2.5 rounded-lg mt-1 bg-white outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="claro">Modo Claro</option>
                  <option value="escuro">Modo Escuro</option>
                </select>
              </div>

              <Toggle label="Menu lateral expandido" checked={menuExpandido} onChange={() => setMenuExpandido(!menuExpandido)} />
              <Toggle label="Mostrar meu avatar" checked={mostrarAvatar} onChange={() => setMostrarAvatar(!mostrarAvatar)} />
            </div>
          </section>

          {/* Sistema */}
          <section className="bg-white p-6 shadow-sm border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-2 mb-6 text-slate-800">
              <MdShield size={22} className="text-green-600" />
              <h2 className="text-lg font-bold">Segurança</h2>
            </div>

            <div className="space-y-4">
              <Toggle label="Logs de auditoria" checked={logsAtivos} onChange={() => setLogsAtivos(!logsAtivos)} />
              <Toggle label="Modo de privacidade" checked={modoPrivado} onChange={() => setModoPrivado(!modoPrivado)} />
              
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Sessão (minutos)</label>
                <input type="number" value={tempoSessao} onChange={(e) => setTempoSessao(e.target.value)} className="w-full border border-slate-300 p-2.5 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </section>
        </div>

        {/* 🚀 BOTÕES DE AÇÃO */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button onClick={salvarConfiguracoes} className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-800 text-white rounded-xl shadow-lg hover:bg-slate-900 transition-all cursor-pointer font-bold">
            <MdSave size={20} /> Salvar Alterações
          </button>

          <button onClick={limparTudo} className="flex items-center justify-center gap-2 px-6 py-3.5 border border-red-200 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all cursor-pointer font-medium">
            <MdDeleteSweep size={20} /> Limpar Cache
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}

/* COMPONENTES AUXILIARES INTERNOS */
function Input({ label, type = "text", ...props }) {
  return (
    <div className="flex flex-col w-full">
      <label className="text-xs font-bold text-slate-500 mb-1 ml-1 uppercase">{label}</label>
      <input type={type} className="border border-slate-300 p-2.5 rounded-lg w-full bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300" {...props} />
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100">
      <span className="text-sm text-slate-700 font-medium">{label}</span>
      <div className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </div>
    </label>
  );
}