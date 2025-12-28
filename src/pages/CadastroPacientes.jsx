import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import BotaoCadastrar from "../components/BotaoCadastrar";
import BarraPesquisa from "../components/BarraPesquisa";
import { MdSave, MdCancel, MdEdit, MdDelete, MdPersonAdd } from "react-icons/md";

export default function CadastroPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [pesquisa, setPesquisa] = useState(""); // Valor imediato do input
  const [pesquisaDebounced, setPesquisaDebounced] = useState(""); // Valor após pausa
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    cpf: "",
    nome: "",
    dataNascimento: "",
    telefone: "",
  });

  /* ===============================
      BUSCAR DADOS (API)
  =============================== */
  useEffect(() => {
    fetch("http://localhost:3001/pacientes")
      .then((res) => res.json())
      .then((data) => setPacientes(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  /* ===============================
      LÓGICA DE DEBOUNCE ⚡
  =============================== */
  useEffect(() => {
    // Cria um timer para atualizar o valor debounced após 500ms
    const handler = setTimeout(() => {
      setPesquisaDebounced(pesquisa);
    }, 300);

    // Limpa o timer se o usuário digitar novamente antes dos 500ms passarem
    return () => {
      clearTimeout(handler);
    };
  }, [pesquisa]);

  /* ===============================
      FILTRAGEM (Usa o valor Debounced)
  =============================== */
  const pacientesFiltrados = pacientes?.filter((p) => {
    const termo = pesquisaDebounced.toLowerCase();
    return (
      p.nome?.toLowerCase().includes(termo) || 
      p.cpf?.includes(termo)
    );
  }) || [];

  /* ===============================
      AÇÕES DO FORMULÁRIO
  =============================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const limparFormulario = () => {
    setForm({ cpf: "", nome: "", dataNascimento: "", telefone: "" });
    setEditId(null);
    setMostrarFormulario(false);
  };

  const salvarPaciente = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const res = await fetch(`http://localhost:3001/pacientes/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const atualizado = await res.json();
        setPacientes((prev) => prev.map((p) => (p.id === editId ? atualizado : p)));
      } else {
        const res = await fetch("http://localhost:3001/pacientes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const novo = await res.json();
        setPacientes((prev) => [...prev, novo]);
      }
      limparFormulario();
    } catch (error) {
      console.error(error);
    }
  };

  const editarPaciente = (paciente) => {
    setForm(paciente);
    setEditId(paciente.id);
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removerPaciente = async (id) => {
    if (window.confirm("Deseja realmente excluir este paciente?")) {
      await fetch(`http://localhost:3001/pacientes/${id}`, { method: "DELETE" });
      setPacientes((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <PageWrapper title="Gestão de Pacientes">
      <div className="max-w-7xl mx-auto space-y-6 pb-10">
        
      
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-full md:max-w-md flex items-center gap-2">
            <BarraPesquisa
              pesquisa={pesquisa}
              setPesquisa={setPesquisa}
              placeholder="Digite para pesquisar..."
            />
          
            {pesquisa !== pesquisaDebounced && (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          {!mostrarFormulario && (
            <BotaoCadastrar
              onClick={() => setMostrarFormulario(true)}
              label="Cadastrar Novo Paciente"
            />
          )}
        </div>


        
        {mostrarFormulario && (
          <section className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-blue-100 animate-in slide-in-from-top duration-300">
             <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <MdPersonAdd size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                {editId ? "Atualizar Cadastro" : "Cadastro de Novo Paciente"}
              </h2>
            </div>

            <form onSubmit={salvarPaciente} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Input label="CPF" name="cpf" value={form.cpf} onChange={handleChange} />
              <Input label="Nome Completo" name="nome" value={form.nome} onChange={handleChange} />
              <Input label="Nascimento" name="dataNascimento" type="date" value={form.dataNascimento} onChange={handleChange} />
              <Input label="Telefone" name="telefone" value={form.telefone} onChange={handleChange} />

              <div className="col-span-full flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100 mt-2">
                <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                  <MdSave size={20} /> {editId ? "Salvar Alterações" : "Confirmar Cadastro"}
                </button>
                <button type="button" onClick={limparFormulario} className="bg-slate-100 text-slate-600 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all">
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase">
                  <Th>Dados do Paciente</Th>
                  <Th className="hidden md:table-cell">Data de Nascimento</Th>
                  <Th className="hidden sm:table-cell">Contato</Th>
                  <Th className="text-right">Ações</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pacientesFiltrados.map((p) => (
                  <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                    <Td>
                      <div className="font-bold text-slate-800">{p.nome}</div>
                      <div className="text-xs text-slate-500 font-mono bg-slate-100 w-fit px-1.5 py-0.5 rounded mt-1">{p.cpf}</div>
                    </Td>
                    <Td className="hidden md:table-cell">{p.dataNascimento ? new Date(p.dataNascimento).toLocaleDateString('pt-BR') : '-'}</Td>
                    <Td className="hidden sm:table-cell">{p.telefone || '-'}</Td>
                    <Td className="text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => editarPaciente(p)} className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl transition-all"><MdEdit size={20} /></button>
                        <button onClick={() => removerPaciente(p.id)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all"><MdDelete size={20} /></button>
                      </div>
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


function Input({ label, type = "text", name, ...props }) {
  return (
    <div className="flex flex-col w-full gap-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase ml-1">{label}</label>
      <input type={type} name={name} className="border border-slate-200 p-3 rounded-xl w-full bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" {...props} required />
    </div>
  );
}
function Th({ children, className = "" }) { return <th className={`px-6 py-4 font-bold ${className}`}>{children}</th>; }
function Td({ children, className = "" }) { return <td className={`px-6 py-4 align-middle ${className}`}>{children}</td>; }