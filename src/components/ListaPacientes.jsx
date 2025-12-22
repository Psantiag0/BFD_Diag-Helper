import CardPaciente from "./CardPacientes";

const ListaPacientes = ({ pacientes, onEdit, onDelete, onAddExame }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Pacientes cadastrados ({pacientes.length})
      </h2>

      <div className="space-y-2">
        {pacientes.length > 0 ? (
          pacientes.map((p) => (
            <CardPaciente
              key={p.id}
              paciente={p}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddExame={onAddExame}
            />
          ))
        ) : (
          <div className="bg-gray-50 p-8 rounded-lg border border-dashed text-center text-gray-500">
            Nenhum paciente encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaPacientes;