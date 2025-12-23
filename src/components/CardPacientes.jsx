// import React from "react";

// const CardPaciente = ({ paciente, onEdit, onDelete, onAddExame }) => {
//   return (
//     <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 bg-white px-4 sm:px-px-6 lg:px-8 py-6 rounded-lg border items-start">
//       <p><span className="font-bold">Nome:</span> {paciente.nome}</p>
//       <p><span className="font-bold">Nascimento:</span> {paciente.dataNascimento}</p>
//       <p><span className="font-bold">Telefone:</span> {paciente.telefone}</p>
//       <p><span className="font-bold">CPF:</span> {paciente.cpf}</p>

//       <div className="flex flex-col gap-4 md:col-span-2">
//         {/* BOTÕES DE AÇÃO */}
//         <div className="flex gap-6 items-center">
//           <button 
//             onClick={() => onEdit(paciente)} 
//             className="text-blue-600 text-base font-semibold hover:scale-125 transition"
//           >
//             Editar
//           </button>

//           <button 
//             onClick={() => onDelete(paciente.id)} 
//             className="text-red-600 text-base font-semibold hover:scale-125 transition"
//           >
//             Excluir
//           </button>

//           <button 
//             onClick={() => onAddExame(paciente)} 
//             className="text-green-700 text-base font-semibold hover:scale-125 transition"
//             title="Adicionar exame"
//           >
//             Adiciona Exame
//           </button>
//         </div>

//         {/* LISTA DE EXAMES DO PACIENTE */}
//         <div className="mt-2">
//           <p className="font-bold text-xs">Exames:</p>
//           {paciente.exames && paciente.exames.length > 0 ? (
//             <ul className="list-disc list-inside text-xs text-gray-600">
//               {paciente.exames.map((e, idx) => (
//                 <li key={idx}>
//                   {e.tipo} - {e.data}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-gray-500 text-xs">Nenhum exame</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CardPaciente;

import React from "react";

const CardPacientes = ({
  paciente,
  onEdit,
  onDelete,
  onAddExame,
  onSelect,
  selected = false,
  showActions = true,
  showExames = true,
  showSelectButton = false,
}) => {
  return (
    <div
      className={`w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4
        px-4 sm:px-6 lg:px-8 py-6 rounded-lg border transition
        ${selected ? "border-primary-500 bg-primary-50" : "bg-white"}
      `}
    >
      <p><span className="font-bold">Nome:</span> {paciente.nome}</p>
      <p><span className="font-bold">Nascimento:</span> {paciente.dataNascimento}</p>
      <p><span className="font-bold">Telefone:</span> {paciente.telefone}</p>
      <p><span className="font-bold">CPF:</span> {paciente.cpf}</p>

      {(showActions || showExames || showSelectButton) && (
        <div className="flex flex-col gap-4 md:col-span-2">

          {/* BOTÃO SELECIONAR (GerarLaudo) */}
          {showSelectButton && (
            <button
              onClick={() => onSelect(paciente)}
              className={`px-4 py-2 rounded-md font-semibold transition cursor-pointer
                ${
                  selected
                    ? "bg-primary-500 text-primary"
                    : "bg-linear-to-r from-slate-100 to-slate-200 hover:from-primary-200 hover:to-primary-400"
                }
              `}
            >
              {selected ? "Paciente selecionado" : "Selecionar paciente"}
            </button>
          )}

          {/* AÇÕES (CRUD) */}
          {showActions && (
            <div className="flex gap-6 items-center">
              <button onClick={() => onEdit(paciente)} className="text-blue-600 font-semibold hover:scale-125 transition">
                Editar
              </button>

              <button onClick={() => onDelete(paciente.id)} className="text-red-600 font-semibold hover:scale-125 transition">
                Excluir
              </button>

              <button onClick={() => onAddExame(paciente)} className="text-green-700 font-semibold hover:scale-125 transition">
                Adicionar Exame
              </button>
            </div>
          )}

          {/* EXAMES */}
          {showExames && (
            <div className="mt-2">
              <p className="font-bold text-xs">Exames:</p>
              {paciente.exames?.length > 0 ? (
                <ul className="list-disc list-inside text-xs text-gray-600">
                  {paciente.exames.map((e, idx) => (
                    <li key={idx}>{e.tipo} - {e.data}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-xs">Nenhum exame</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CardPacientes;
