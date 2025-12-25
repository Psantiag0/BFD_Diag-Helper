import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import BarraPesquisa from "../components/BarraPesquisa";
import ListaPacientes from "../components/ListaPacientes";

import ModalConcluido from "../modals/ModalConcluido";
import ModalFalha from "../modals/ModalFalha";
import ModalProcessando from "../modals/ModalProcessando";
import ListaLaudos from "../components/ListaLaudos";

export default function GerarLaudo() {
  /* ===============================
     PACIENTES
  =============================== */
  const [pacientes, setPacientes] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [pesquisaDebounced, setPesquisaDebounced] = useState("");
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);

  /* ===============================
     MÉDICOS
  =============================== */
  const [medicos, setMedicos] = useState([]);
  const [medicoSelecionado, setMedicoSelecionado] = useState(null);

  /* ===============================
     LAUDO
  =============================== */
  const [modalAberto, setModalAberto] = useState(null);
  const [imagens, setImagens] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [observacoes, setObservacoes] = useState("");
  const [dataLaudo, setDataLaudo] = useState("");
  const [laudos, setLaudos] = useState([]);

  /* ===============================
     BUSCAR PACIENTES
  =============================== */
  useEffect(() => {
    fetch("http://localhost:3001/pacientes")
      .then((res) => res.json())
      .then((data) => setPacientes(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  /* ===============================
     BUSCAR MÉDICOS
  =============================== */
  useEffect(() => {
    fetch("http://localhost:3001/usuarios")
      .then((res) => res.json())
      .then((data) => {
        const medicosAtivos = data.filter(
          (u) =>
            u.status === "Ativo" &&
            (u.perfis?.medicoAssistente || u.perfis?.medicoLaudista)
        );
        setMedicos(medicosAtivos);
      })
      .catch(console.error);
  }, []);

  /* ===============================
     DEBOUNCE
  =============================== */
  useEffect(() => {
    const timer = setTimeout(() => {
      setPesquisaDebounced(pesquisa);
    }, 500);
    return () => clearTimeout(timer);
  }, [pesquisa]);

  /* ===============================
     FILTRO PACIENTES
  =============================== */
  const pacientesFiltrados = pacientes.filter(
  (p) =>
    p.nome.toLowerCase().includes(pesquisaDebounced.toLowerCase()) ||
    p.cpf.includes(pesquisaDebounced)
);


  /* ===============================
     IMAGENS
  =============================== */
  function handleImagem(e) {
    const files = Array.from(e.target.files);
    setImagens(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  }

  function removerImagem(idx) {
    setImagens((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  }

  /* ===============================
     GERAR LAUDO
  =============================== */
  function handleGerarLaudo() {
    if (
      !medicoSelecionado ||
      !pacienteSelecionado ||
      !dataLaudo ||
      imagens.length === 0
    ) {
      setModalAberto("falha");
      return;
    }

    setModalAberto("processando");

    setTimeout(() => {
      const novoLaudo = {
        id: Date.now(),
        medico: medicoSelecionado,
        paciente: pacienteSelecionado,
        data: dataLaudo,
        observacoes,
        imagens: previews,
      };

      setLaudos((prev) => [novoLaudo, ...prev]);
      setModalAberto("concluido");

      // reset
      setPacienteSelecionado(null);
      setMedicoSelecionado(null);
      setDataLaudo("");
      setObservacoes("");
      setImagens([]);
      setPreviews([]);
      setPesquisa("");
      setPesquisaDebounced("");
    }, 1500);
  }

  return (
    <PageWrapper title="Gerar Laudo">
      <main className="p-6 space-y-10">
        {/* ===============================
           SELEÇÃO DE PACIENTE
        =============================== */}
        <section className="bg-white p-6 rounded-xl shadow max-w-6xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Selecionar Paciente</h2>

          <div className="max-w-md mb-4">
           <BarraPesquisa pesquisa={pesquisa} setPesquisa={setPesquisa} />

          </div>

          <ListaPacientes
            pacientes={pacientesFiltrados}
            onSelect={setPacienteSelecionado}
            selectedPacienteId={pacienteSelecionado?.id}
            showActions={false}
            showExames={false}
            showSelectButton
          />
        </section>

        {/* ===============================
           FORMULÁRIO DO LAUDO
        =============================== */}
        <section className="bg-white p-8 rounded-xl shadow max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* MÉDICO */}
            <div>
              <p>Médico</p>
              <select
  className="border rounded-lg p-3 w-full"
  value={medicoSelecionado?.id ?? ""}
  onChange={(e) => {
    const medico = medicos.find(
      (m) => String(m.id) === e.target.value
    );
    setMedicoSelecionado(medico);
  }}
>
  <option value="">Selecione o médico</option>
  {medicos.map((m) => (
    <option key={m.id} value={String(m.id)}>
      {m.nome}
    </option>
  ))}
</select>

            </div>

            {/* PACIENTE */}
            <div>
              <p>Paciente</p>
              <input
                type="text"
                value={pacienteSelecionado?.nome || ""}
                disabled
                className="border rounded-lg p-3 bg-gray-100"
              />
            </div>

            {/* DATA */}
            <div>
              <p>Data do laudo</p>
              <input
                type="date"
                value={dataLaudo}
                onChange={(e) => setDataLaudo(e.target.value)}
                className="border rounded-lg p-3"
              />
            </div>
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImagem}
            className="mb-4 cursor-pointer px-3 py-2 rounded-md bg-slate-100 hover:bg-slate-200"
          />

          {previews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {previews.map((src, i) => (
                <div key={i} className="relative border rounded-lg p-2">
                  <img src={src} className="h-40 w-full object-contain" />
                  <button
                    onClick={() => removerImagem(i)}
                    className="absolute top-2 right-2 bg-red-600 text-white px-2 text-xs rounded"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}

          <textarea
            className="w-full border rounded-lg p-3 mb-4"
            placeholder="Observações"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          />

          <button
            onClick={handleGerarLaudo}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Gerar Laudo
          </button>
        </section>

        {laudos.length > 0 && <ListaLaudos laudos={laudos} />}

        <ModalConcluido
          open={modalAberto === "concluido"}
          onClose={() => setModalAberto(null)}
        />
        <ModalFalha
          open={modalAberto === "falha"}
          onClose={() => setModalAberto(null)}
        />
        <ModalProcessando open={modalAberto === "processando"} />
      </main>
    </PageWrapper>
  );
}
