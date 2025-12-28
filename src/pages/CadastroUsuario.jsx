import { useState, useEffect } from "react";
import { MdSaveAlt, MdCancel, MdPersonAdd, MdDeleteOutline } from "react-icons/md";
import PageWrapper from "../components/PageWrapper";
import BarraPesquisa from "../components/BarraPesquisa";
import BotaoCadastrar from "../components/BotaoCadastrar";

export default function CadastroUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [formAtivo, setFormAtivo] = useState(false);
  const [pesquisa, setPesquisa] = useState(""); // Valor imediato
  const [pesquisaDebounced, setPesquisaDebounced] = useState(""); // Valor com atraso

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    cargo: "",
    status: "Ativo",
  });

  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [erroCadastro, setErroCadastro] = useState("");

  const [perfis, setPerfis] = useState({
    recepcionista: false,
    medicoAssistente: false,
    medicoLaudista: false,
    administrador: false,
  });

  /* ===============================
      CARREGAR DADOS
  =============================== */
  useEffect(() => {
    fetch("http://localhost:3001/usuarios")
      .then((res) => res.json())
      .then((data) => setUsuarios(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar usuários:", err));
  }, []);

  /* ===============================
      LÓGICA DE DEBOUNCE (500ms)
  =============================== */
  useEffect(() => {
    const handler = setTimeout(() => {
      setPesquisaDebounced(pesquisa);
    }, 500);

    return () => clearTimeout(handler);
  }, [pesquisa]);

  /* ===============================
      FILTRAGEM DE USUÁRIOS
  =============================== */
  const usuariosFiltrados = usuarios?.filter((u) => {
    const termo = pesquisaDebounced.toLowerCase();
    
    // Concatena campos para uma busca global eficiente
    const perfisAtivos = Object.entries(u.perfis || {})
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(" ");

    const textoBase = `${u.cpf} ${u.nome} ${u.cargo} ${u.status} ${perfisAtivos}`.toLowerCase();
    
    return textoBase.includes(termo);
  }) || [];

  /* ===============================
      AÇÕES DO FORMULÁRIO
  =============================== */
  const resetForm = () => {
    setForm({ nome: "", cpf: "", cargo: "", status: "Ativo" });
    setSenha("");
    setConfirmaSenha("");
    setPerfis({
      recepcionista: false,
      medicoAssistente: false,
      medicoLaudista: false,
      administrador: false,
    });
    setErroCadastro("");
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPerfis((prev) => ({ ...prev, [name]: checked }));
  };

  const cadastrar = async (e) => {
    e.preventDefault();
    if (senha !== confirmaSenha) {
      setErroCadastro("As senhas não coincidem.");
      return;
    }

    const agora = new Date();
    const criadoEm = `${agora.toLocaleDateString("pt-BR")} ${agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;

    const novoUsuario = { ...form, senha, perfis, criadoEm };

    try {
      const res = await fetch("http://localhost:3001/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoUsuario),
      });

      const usuarioSalvo = await res.json();
      setUsuarios((prev) => [...prev, usuarioSalvo]);
      resetForm();
      setFormAtivo(false);
    } catch (err) {
      setErroCadastro("Erro ao conectar com o servidor.");
    }
  };

  const remover = async (id) => {
    if (window.confirm("Deseja realmente excluir este usuário?")) {
      await fetch(`http://localhost:3001/usuarios/${id}`, { method: "DELETE" });
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    }
  };

  return (
    <PageWrapper title="Gestão de Usuários">
      <div className="max-w-7xl mx-auto space-y-6 pb-10">
        
        {/* CABEÇALHO DE PESQUISA */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-full md:max-w-md flex items-center gap-3">
            <BarraPesquisa
              pesquisa={pesquisa}
              setPesquisa={setPesquisa}
              placeholder="Nome, CPF, cargo ou perfil..."
            />
            {pesquisa !== pesquisaDebounced && (
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          {!formAtivo && (
            <BotaoCadastrar onClick={() => setFormAtivo(true)} label="Novo Usuário" />
          )}
        </div>

        {/* FORMULÁRIO DE CADASTRO */}
        {formAtivo && (
          <section className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-blue-100 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <MdPersonAdd size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Novo Usuário do Sistema</h2>
            </div>

            <form onSubmit={cadastrar} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input label="CPF" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} placeholder="000.000.000-00" />
              <Input label="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
              <Input label="Cargo" value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} />
              
              <div className="flex flex-col w-full gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Status</label>
                <select
                  className="border border-slate-200 p-3 rounded-xl w-full bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>

              <Input label="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
              <Input label="Confirme a Senha" type="password" value={confirmaSenha} onChange={(e) => setConfirmaSenha(e.target.value)} />

              <div className="lg:col-span-3 bg-slate-50 p-5 rounded-xl border border-slate-200">
                <p className="font-bold mb-4 text-xs uppercase text-slate-500 tracking-wider">Perfis de Acesso</p>
                <div className="flex flex-wrap gap-x-8 gap-y-3">
                  {[
                    ["recepcionista", "Recepcionista"],
                    ["medicoAssistente", "Médico Assistente"],
                    ["medicoLaudista", "Médico Laudista"],
                    ["administrador", "Administrador"],
                  ].map(([key, label]) => (
                    <label key={key} className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        name={key} 
                        checked={perfis[key]} 
                        onChange={handleCheckboxChange} 
                        className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500" 
                      />
                      <span className="group-hover:text-blue-600 transition-colors">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {erroCadastro && (
                <div className="col-span-full p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-bold text-center">
                  {erroCadastro}
                </div>
              )}

              <div className="col-span-full flex gap-3 pt-6 border-t border-slate-100 mt-2">
                <button type="submit" className="bg-blue-600 text-white rounded-xl flex items-center px-8 py-3 hover:bg-blue-700 transition-all shadow-md font-bold gap-2">
                  <MdSaveAlt size={20} /> Salvar Usuário
                </button>
                <button type="button" onClick={() => { resetForm(); setFormAtivo(false); }} className="bg-slate-100 text-slate-600 px-8 py-3 rounded-xl hover:bg-slate-200 transition-all font-bold flex items-center gap-2">
                  <MdCancel size={20} /> Cancelar
                </button>
              </div>
            </form>
          </section>
        )}

        {/* TABELA DE RESULTADOS */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <Th>Usuário</Th>
                  <Th className="hidden lg:table-cell">Cargo</Th>
                  <Th className="hidden sm:table-cell">Status</Th>
                  <Th className="hidden md:table-cell">Perfis Ativos</Th>
                  <Th className="text-right">Ações</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usuariosFiltrados.map((u) => (
                  <tr key={u.id} className="hover:bg-blue-50/30 transition-colors group">
                    <Td>
                      <div className="font-bold text-slate-800">{u.nome}</div>
                      <div className="text-xs text-slate-500 font-mono">{u.cpf}</div>
                    </Td>
                    <Td className="hidden lg:table-cell text-slate-600 font-medium">{u.cargo}</Td>
                    <Td className="hidden sm:table-cell">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                        u.status === 'Ativo' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {u.status}
                      </span>
                    </Td>
                    <Td className="hidden md:table-cell text-slate-500 text-xs italic max-w-[200px] truncate">
                      {Object.entries(u.perfis || {}).filter(([, v]) => v).map(([k]) => k).join(", ")}
                    </Td>
                    <Td className="text-right">
                      <button 
                        onClick={() => remover(u.id)} 
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Excluir Usuário"
                      >
                        <MdDeleteOutline size={22} />
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

/* COMPONENTES INTERNOS */
function Input({ label, type = "text", ...props }) {
  return (
    <div className="flex flex-col w-full gap-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase ml-1">{label}</label>
      <input
        type={type}
        className="border border-slate-200 p-3 rounded-xl w-full bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
        {...props}
        required
      />
    </div>
  );
}

function Th({ children, className = "" }) {
  return <th className={`px-6 py-4 ${className}`}>{children}</th>;
}

function Td({ children, className = "" }) {
  return <td className={`px-6 py-4 align-middle ${className}`}>{children}</td>;
}