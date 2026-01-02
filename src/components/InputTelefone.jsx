import React from "react";

export default function InputTelefone({ label, value, onChange, name, ...props }) {
  
  const aplicarMascaraTelefone = (valor) => {
    if (!valor) return "";
    
    // Remove tudo que não é dígito
    const apenasNumeros = valor.replace(/\D/g, "");
    
    return apenasNumeros
      .replace(/^(\d{2})(\d)/g, "($1) $2") // Adiciona parênteses no DDD
      .replace(/(\d{1})(\d{4})(\d{4})$/, "$1 $2-$3") // Formato (xx) x xxxx-xxxx
      .substring(0, 16); // Limite de caracteres para o formato formatado
  };

  const handleChange = (e) => {
    const { value: valorDigitado } = e.target;
    const valorComMascara = aplicarMascaraTelefone(valorDigitado);
    
    // Mantém a compatibilidade com o seu handler genérico
    onChange({
      target: {
        name: name,
        value: valorComMascara
      }
    });
  };

  return (
    <div className="flex flex-col w-full gap-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase ml-1">{label}</label>
      <input
        {...props}
        type="text"
        name={name}
        value={value}
        onChange={handleChange}
        placeholder="(00) 0 0000-0000"
        maxLength="16"
        className="border border-slate-200 p-3 rounded-xl w-full bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
      />
    </div>
  );
}