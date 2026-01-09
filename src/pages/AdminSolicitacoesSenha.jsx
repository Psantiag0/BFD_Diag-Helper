import { useEffect, useState } from "react";

export default function AdminSolicitacoesSuporte() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const dados =
      JSON.parse(localStorage.getItem("solicitacoesSuporte")) || [];
    setSolicitacoes(dados);
  }, []);

  function abrirModal(solicitacao) {
    setSolicitacaoSelecionada(solicitacao);
    setSenha("");
    setConfirmarSenha("");
    setErro("");
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setSolicitacaoSelecionada(null);
  }

  function salvarNovaSenha() {
    if (!senha || !confirmarSenha) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    const usuarios =
      JSON.parse(localStorage.getItem("appUsuarios")) || [];

    const usuariosAtualizados = usuarios.map((u) =>
      u.email === solicitacaoSelecionada.email
        ? { ...u, senha }
        : u
    );

    localStorage.setItem(
      "appUsuarios",
      JSON.stringify(usuariosAtualizados)
    );

    const solicitacoesAtualizadas = solicitacoes.map((s) =>
      s.id === solicitacaoSelecionada.id
        ? { ...s, status: "finalizado" }
        : s
    );

    setSolicitacoes(solicitacoesAtualizadas);
    localStorage.setItem(
      "solicitacoesSuporte",
      JSON.stringify(solicitacoesAtualizadas)
    );

    fecharModal();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Solicitações de Redefinição de Senha
      </h1>

      {solicitacoes.length === 0 ? (
        <p className="text-gray-500">
          Nenhuma solicitação encontrada.
        </p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">E-mail</th>
                <th className="p-3 text-left">Mensagem</th>
                <th className="p-3 text-left">Data</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>

            <tbody>
              {solicitacoes.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-3">{s.nome}</td>
                  <td className="p-3">{s.email}</td>
                  <td className="p-3">{s.mensagem || "-"}</td>
                  <td className="p-3">{s.data}</td>

                  <td className="p-3">
                    {s.status === "pendente" ? (
                      <span className="text-yellow-600">
                        Pendente
                      </span>
                    ) : (
                      <span className="text-green-600">
                        Finalizado
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-center">
                    {s.status === "pendente" ? (
                      <button
                        onClick={() => abrirModal(s)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Redefinir senha
                      </button>
                    ) : (
                      <span className="text-gray-400">
                        Concluído
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              Redefinir senha
            </h2>

            <label className="text-sm font-medium">
              Nova senha
            </label>
            <input
              type="password"
              className="w-full border rounded-lg p-2 mt-1 mb-3"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            <label className="text-sm font-medium">
              Confirmar nova senha
            </label>
            <input
              type="password"
              className="w-full border rounded-lg p-2 mt-1 mb-3"
              value={confirmarSenha}
              onChange={(e) =>
                setConfirmarSenha(e.target.value)
              }
            />

            {erro && (
              <p className="text-red-600 text-sm mb-3">
                {erro}
              </p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={fecharModal}
                className="px-4 py-2 rounded border"
              >
                Cancelar
              </button>
              <button
                onClick={salvarNovaSenha}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Salvar senha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
