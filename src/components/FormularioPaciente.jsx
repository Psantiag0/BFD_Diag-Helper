import React from "react";

const FormularioPaciente = ({ 
  formPacientes, 
  handleChange, 
  novoExame, 
  handleExameChange, 
  adicionarExame, 
  onSubmit, 
  editId 
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-lg border"
    >
      {/* Dados do Paciente */}
      <div>
        <label className="font-medium text-gray-700">Nome</label>
        <input type="text" name="nome" value={formPacientes.nome} onChange={handleChange} className="w-full p-2 mt-1 border rounded-lg" />
      </div>

      <div>
        <label className="font-medium text-gray-700">Data de Nascimento</label>
        <input type="date" name="dataNascimento" value={formPacientes.dataNascimento} onChange={handleChange} className="w-full p-2 mt-1 border rounded-lg" />
      </div>

      <div>
        <label className="font-medium text-gray-700">Telefone</label>
        <input type="text" name="telefone" value={formPacientes.telefone} onChange={handleChange} className="w-full p-2 mt-1 border rounded-lg" placeholder="(xx) xxxxx-xxxx" />
      </div>

      <div>
        <label className="font-medium text-gray-700">CPF</label>
        <input type="text" name="cpf" value={formPacientes.cpf} onChange={handleChange} className="w-full p-2 mt-1 border rounded-lg" placeholder="xxx.xxx.xxx-xx" />
      </div>

      {/* Seção de Adicionar Exame Temporário */}
      <div className="md:col-span-3 border-t pt-4 mt-4">
        <h2 className="font-bold text-lg mb-2">Adicionar Exame</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
          <input type="text" name="tipo" placeholder="Tipo" value={novoExame.tipo} onChange={handleExameChange} className="w-full p-2 border rounded-lg" />
          <input type="date" name="data" value={novoExame.data} onChange={handleExameChange} className="w-full p-2 border rounded-lg" />
          <input type="text" name="resultado" placeholder="Resultado" value={novoExame.resultado} onChange={handleExameChange} className="w-full p-2 border rounded-lg" />
        </div>
        <button type="button" onClick={adicionarExame} className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition">
          Adicionar Exame
        </button>

        {/* Lista de exames que ainda não foram salvos no banco, apenas no form */}
        {formPacientes.exames && formPacientes.exames.length > 0 && (
          <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
            {formPacientes.exames.map((e, idx) => (
              <li key={idx}>{e.tipo} - {e.data} - {e.resultado}</li>
            ))}
          </ul>
        )}
      </div>

      <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition md:col-span-3">
        {editId ? "Salvar edição" : "Cadastrar paciente"}
      </button>
    </form>
  );
};

export default FormularioPaciente;