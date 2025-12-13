import Navbar from "./Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Navbar />

      {/* Conteúdo da Página */}
      <main className="flex-1 p-2 bg-background-100"> 
        {/* Ajuste principal está aqui ↑ */}
        {children}
      </main>
    </div>
  );
}
