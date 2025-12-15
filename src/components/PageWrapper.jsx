export default function PageWrapper({ title, children }) {
  return (
    <div className="w-full">
      {title && (
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          {title}
        </h1>
      )}

      <div className="shadow-md rounded-xl p-6 bg-gradient-to-r from-slate-300 to-slate-500">
        {children}
      </div>
    </div>
  );
}
