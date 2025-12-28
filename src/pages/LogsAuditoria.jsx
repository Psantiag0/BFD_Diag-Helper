import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import { MdSearch, MdFilterList, MdHistory } from "react-icons/md";

export default function LogsAuditoria() {
  const [logs, setLogs] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    async function carregarLogs() {
      try {
        const resposta = await fetch("http://localhost:3000/logsAuditoria");
        const dados = await resposta.json();
        setLogs(Array.isArray(dados) ? dados : []);
      } catch (error) {
        console.error("Erro ao carregar logs:", error);
      }
    }
    carregarLogs();
  }, []);

  const logsFiltrados = logs.filter((log) => {
    const texto = pesquisa.toLowerCase();
    const correspondePesquisa =
      log.usuario?.toLowerCase().includes(texto) ||
      log.acao?.toLowerCase().includes(texto);

    const correspondeFiltro = filtro ? log.tipo === filtro : true;
    return correspondePesquisa && correspondeFiltro;
  });

  // Função para definir a cor do Badge baseado no tipo de ação
  const getBadgeColor = (tipo) => {
    switch (tipo) {
      case 'LOGIN': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'EXCLUSÃO': return 'bg-red-100 text-red-700 border-red-200';
      case 'CADASTRO': return 'bg-green-100 text-green-700 border-green-200';
      case 'EDIÇÃO': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <PageWrapper title="Logs de Auditoria">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* FILTROS RESPONSIVOS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Pesquisar usuário ou ação..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="relative">
            <MdFilterList className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full sm:w-60 pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
            >
              <option value="">Todos os tipos</option>
              <option value="LOGIN">Login</option>
              <option value="CADASTRO">Cadastro</option>
              <option value="EDIÇÃO">Edição</option>
              <option value="EXCLUSÃO">Exclusão</option>
              <option value="EXAME">Exame</option>
            </select>
          </div>
        </div>

        {/* TABELA RESPONSIVA */}
        <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <Th>Evento</Th> {/* Usuário + Ação no mobile */}
                  <Th className="hidden md:table-cell">Tipo</Th>
                  <Th className="hidden sm:table-cell">Data e Hora</Th>
                  <Th className="hidden lg:table-cell text-right">Endereço IP</Th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {logsFiltrados.length === 0 ? (
                  <tr>
                    <td className="p-12 text-center text-slate-400 italic" colSpan="4">
                      <div className="flex flex-col items-center gap-2">
                        <MdHistory size={40} className="text-slate-200" />
                        <p>Nenhum log encontrado para esta busca.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  logsFiltrados.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                      <Td>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{log.usuario}</span>
                          <span className="text-slate-600 text-xs md:text-sm">{log.acao}</span>
                          {/* Badge visível apenas no mobile para economizar espaço horizontal */}
                          <div className="md:hidden mt-2">
                            <Badge tipo={log.tipo} colorClass={getBadgeColor(log.tipo)} />
                          </div>
                        </div>
                      </Td>
                      
                      <Td className="hidden md:table-cell">
                        <Badge tipo={log.tipo} colorClass={getBadgeColor(log.tipo)} />
                      </Td>

                      <Td className="hidden sm:table-cell text-slate-500 font-mono text-xs">
                        {new Date(log.data).toLocaleString("pt-BR")}
                      </Td>

                      <Td className="hidden lg:table-cell text-right text-slate-400 font-mono text-xs">
                        {log.ip}
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

/* COMPONENTES INTERNOS */
function Th({ children, className = "" }) {
  return (
    <th className={`p-4 text-xs uppercase tracking-wider font-bold text-slate-500 ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = "" }) {
  return (
    <td className={`p-4 align-middle ${className}`}>
      {children}
    </td>
  );
}

function Badge({ tipo, colorClass }) {
  return (
    <span className={`px-2.5 py-1 border rounded-full text-[10px] font-bold uppercase tracking-tight ${colorClass}`}>
      {tipo}
    </span>
  );
}