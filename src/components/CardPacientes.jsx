import React from "react";

const CardPaciente = ({ paciente, onEdit, onDelete, onAddExame }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 bg-white p-4 rounded-lg border items-start">
      <p><span className="font-bold">Nome:</span> {paciente.nome}</p>
      <p><span className="font-bold">Nascimento:</span> {paciente.dataNascimento}</p>
      <p><span className="font-bold">Telefone:</span> {paciente.telefone}</p>
      <p><span className="font-bold">CPF:</span> {paciente.cpf}</p>

      <div className="flex flex-col gap-1">
        {/* BOTÕES DE AÇÃO */}
        <div className="flex gap-3 items-center">
          <button 
            onClick={() => onEdit(paciente)} 
            className="text-blue-600 font-semibold hover:underline"
          >
            Editar
          </button>

          <button 
            onClick={() => onDelete(paciente.id)} 
            className="text-red-600 font-semibold hover:underline"
          >
            Excluir
          </button>

          <button 
            onClick={() => onAddExame(paciente)} 
            className="text-green-700 text-xl font-bold hover:scale-125 transition"
            title="Adicionar exame"
          >
            +
          </button>
        </div>

        {/* LISTA DE EXAMES DO PACIENTE */}
        <div className="mt-2">
          <p className="font-bold text-xs">Exames:</p>
          {paciente.exames && paciente.exames.length > 0 ? (
            <ul className="list-disc list-inside text-xs text-gray-600">
              {paciente.exames.map((e, idx) => (
                <li key={idx}>
                  {e.tipo} - {e.data}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-xs">Nenhum exame</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardPaciente;