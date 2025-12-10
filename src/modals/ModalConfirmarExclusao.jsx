export default function ModalConfirmarExclusao({ open, onClose, onConfirm }) {
  if (!open) return null; // se não estiver aberto, não renderiza nada

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">

        <h2 className="text-lg font-semibold mb-4">
          Confirmar exclusão
        </h2>

        <p className="text-gray-600 mb-6">
          Tem certeza que deseja excluir este paciente?
        </p>

        <div className="flex justify-end gap-3">
          
          {/* Botão cancelar */}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancelar
          </button>

          {/* Botão confirmar */}
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Excluir
          </button>

        </div>

      </div>
    </div>
  );
}
