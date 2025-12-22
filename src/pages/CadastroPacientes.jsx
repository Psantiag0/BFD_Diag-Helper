import { useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";

// Importação dos componentes extraídos
import FormularioPaciente from "../components/FormularioPaciente";
import CardPaciente from "../components/CardPacientes";
import BarraPesquisa from "../components/BarraPesquisa";
import ListaPacientes from "../components/ListaPacientes";

// Importação dos Modais
import ModalConfirmarExclusao from "../modals/ModalConfirmarExclusao";

function CadastroPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [pesquisa, setPesquisa] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [idSelecionado, setIdSelecionado] = useState(null);

  const [formPacientes, setFormPacientes] = useState({
    nome: "",
    dataNascimento: "",
    telefone: "",
    cpf: "",
    exames: [],
  });

  const [novoExame, setNovoExame] = useState({
    tipo: "",
    data: "",
    resultado: "",
  });

  const [modalExameAberto, setModalExameAberto] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [exameNovoModal, setExameNovoModal] = useState({
    tipo: "",
    data: "",
    resultado: "",
  });

  // --- EFEITOS E BUSCA ---
  useEffect(() => {
    fetch("http://localhost:3001/pacientes")
      .then((res) => res.json())
      .then((data) => setPacientes(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar pacientes:", err));
  }, []);

  // --- LÓGICA DE FORMULÁRIO ---
  const handleChange = (e) => {
    setFormPacientes({ ...formPacientes, [e.target.name]: e.target.value });
  };

  const handleExameChange = (e) => {
    setNovoExame({ ...novoExame, [e.target.name]: e.target.value });
  };

  const adicionarExame = () => {
    if (!novoExame.tipo || !novoExame.data || !novoExame.resultado) return;
    setFormPacientes({
      ...formPacientes,
      exames: [...(formPacientes.exames || []), novoExame],
    });
    setNovoExame({ tipo: "", data: "", resultado: "" });
  };

  // --- LÓGICA DE CRUD ---
  const cadastrarPaciente = async (e) => {
    e.preventDefault();
    if (!formPacientes.nome || !formPacientes.dataNascimento) {
      alert("Preencha os campos obrigatórios!");
      return;
    }
    try {
      const res = await fetch("http://localhost:3001/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPacientes),
      });
      const novo = await res.json();
      setPacientes((prev) => [...prev, novo]);
      limparFormulario();
    } catch (err) { console.error(err); }
  };

  const iniciarEdicao = (paciente) => {
    setEditId(paciente.id);
    setFormPacientes(paciente);
  };

  const salvarEdicao = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/pacientes/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPacientes),
      });
      const atualizado = await res.json();
      setPacientes((prev) => prev.map((p) => (p.id === editId ? atualizado : p)));
      setEditId(null);
      limparFormulario();
    } catch (err) { console.error(err); }
  };

  const confirmarExclusao = async () => {
    try {
      await fetch(`http://localhost:3001/pacientes/${idSelecionado}`, { method: "DELETE" });
      setPacientes((prev) => prev.filter((p) => p.id !== idSelecionado));
      setOpenModal(false);
    } catch (err) { console.error(err); }
  };

  // --- LÓGICA DO MODAL DE EXAME ---
  const abrirModalExame = (paciente) => {
    setPacienteSelecionado(paciente);
    setExameNovoModal({ tipo: "", data: "", resultado: "" });
    setModalExameAberto(true);
  };

  const salvarExameModal = async () => {
    const examesAtualizados = [...(pacienteSelecionado.exames || []), exameNovoModal];
    try {
      const res = await fetch(`http://localhost:3001/pacientes/${pacienteSelecionado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pacienteSelecionado, exames: examesAtualizados }),
      });
      const atualizado = await res.json();
      setPacientes((prev) => prev.map((p) => (p.id === atualizado.id ? atualizado : p)));
      setModalExameAberto(false);
    } catch (err) { console.error(err); }
  };

  const limparFormulario = () => {
    setFormPacientes({ nome: "", dataNascimento: "", telefone: "", cpf: "", exames: [] });
    setNovoExame({ tipo: "", data: "", resultado: "" });
  };

  const pacientesFiltrados = pacientes.filter((p) =>
    (p.nome || "").toLowerCase().includes(pesquisa.toLowerCase()) || (p.cpf || "").includes(pesquisa)
  );

  return (
    <PageWrapper title="Cadastro pacientes">
      <main className={`flex-1 p-8 ${modalExameAberto ? "blur-sm" : ""}`}>
        
        {/* Componente 1: Barra de Pesquisa */}
        <BarraPesquisa pesquisa={pesquisa} setPesquisa={setPesquisa} />

        {/* Componente 2: Formulário */}
        <FormularioPaciente 
          formPacientes={formPacientes}
          handleChange={handleChange}
          novoExame={novoExame}
          handleExameChange={handleExameChange}
          adicionarExame={adicionarExame}
          onSubmit={editId ? salvarEdicao : cadastrarPaciente}
          editId={editId}
        />

        {/* Componente 3: Lista de Pacientes (que usa o CardPaciente internamente) */}
        <ListaPacientes 
          pacientes={pacientesFiltrados}
          onEdit={iniciarEdicao}
          onDelete={(id) => { setIdSelecionado(id); setOpenModal(true); }}
          onAddExame={abrirModalExame}
        />

      </main>

      {/* Modais de Controle */}
      <ModalConfirmarExclusao 
        open={openModal} 
        onClose={() => setOpenModal(false)} 
        onConfirm={confirmarExclusao} 
      />

      {modalExameAberto && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          {/* ... Conteúdo do modal de novo exame que você já tinha ... */}
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
             <h2 className="text-xl font-bold mb-4">Novo Exame para {pacienteSelecionado?.nome}</h2>
             <input type="text" placeholder="Tipo" value={exameNovoModal.tipo} onChange={(e) => setExameNovoModal({...exameNovoModal, tipo: e.target.value})} className="w-full p-2 border rounded mb-2" />
             <input type="date" value={exameNovoModal.data} onChange={(e) => setExameNovoModal({...exameNovoModal, data: e.target.value})} className="w-full p-2 border rounded mb-2" />
             <input type="text" placeholder="Resultado" value={exameNovoModal.resultado} onChange={(e) => setExameNovoModal({...exameNovoModal, resultado: e.target.value})} className="w-full p-2 border rounded mb-4" />
             <div className="flex justify-between">
                <button onClick={() => setModalExameAberto(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
                <button onClick={salvarExameModal} className="bg-green-600 text-white px-4 py-2 rounded">Salvar</button>
             </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

export default CadastroPacientes;