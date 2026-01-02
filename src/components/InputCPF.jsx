import React from "react";


const formatarCPF = (value) => {
  if (!value) return "";
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .substring(0, 14);
};

export default function InputCPF({ value, onChange, label, ...props }) {
  const handleChange = (e) => {
    const valorFormatado = formatarCPF(e.target.value);

    onChange({
      target: {
        name: props.name,
        value: valorFormatado
      }
    });
  };

  return (
    <div className="flex flex-col w-full gap-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase ml-1">{label}</label>
      <input
        {...props}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="000.000.000-00"
        maxLength="14"
        className="border border-slate-200 p-3 rounded-xl w-full bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
      />
    </div>
  );
}