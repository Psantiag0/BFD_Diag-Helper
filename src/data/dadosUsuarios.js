const STORAGE_KEY = "appUsuarios";

// Lista de usuários iniciais
const USUARIOS_INICIAIS = [
  {
    nome: "Administrador Geral",
    email: "admin@app.com",
    senha: "123",
    perfil: "administrador",
    crm: null,
    cpf: null,
  },
  {
    nome: "Dr. João",
    email: "medico@teste.com",
    senha: "123",
    perfil: "medico",
    crm: "CRM12345",
    cpf: null,
  },
  {
    nome: "Maria de Souza",
    email: "recepcao@teste.com",
    senha: "123",
    perfil: "recepcionista",
    crm: null,
    cpf: "123.456.789-00",
  },
];

/**
 * Carrega a lista de usuários do localStorage.
 * Se for o primeiro acesso, inicializa com usuários padrão.
 */
function carregarUsuarios() {
  const usuariosSalvos = localStorage.getItem(STORAGE_KEY);

  if (usuariosSalvos) {
    return JSON.parse(usuariosSalvos);
  } else {
    salvarUsuarios(USUARIOS_INICIAIS);
    return USUARIOS_INICIAIS;
  }
}

/**
 * Salva a lista completa de usuários no localStorage.
 */
function salvarUsuarios(usuarios) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
}

export { carregarUsuarios, salvarUsuarios };
