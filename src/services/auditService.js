
import api from "./api"; 

export const registrarLog = async (usuario, acao, tipo, detalhes = null) => {
  const novoLog = {
    usuario,
    acao,
    tipo,
    detalhes, // Onde salvaremos o "De -> Para"
    data: new Date().toISOString(),
    ip: "127.0.0.1"
  };

  try {
    // Usando axios (api) em vez de fetch para melhor performance e interceptores
    await api.post("/LogsAuditoria", novoLog);
  } catch (error) {
    console.error("Erro ao registrar log de auditoria:", error);
  }
};