import { useState, useEffect } from "react";
import { MenuSection } from "./components/MenuSection";
import { AdminModal } from "./components/AdminModal";

function App() {
  const getGirls = () => {
    try {
      const a = localStorage.getItem("agencia_girls");
      const b = localStorage.getItem("girls");
      const c = localStorage.getItem("menuItems");
      const data = a || b || c;
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  };

  const [girls, setGirls] = useState(getGirls());
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem("agencia_girls", JSON.stringify(girls));
    localStorage.setItem("girls", JSON.stringify(girls));
    localStorage.setItem("menuItems", JSON.stringify(girls));
  }, [girls]);

  const handleSave = (item: any) => {
    setGirls((prev: any[]) => {
      const exists = prev.findIndex((g) => g.id === item.id);
      let updated;
      if (exists >= 0) {
        updated = [...prev];
        updated[exists] = item;
      } else {
        updated = [...prev, item];
      }
      localStorage.setItem("agencia_girls", JSON.stringify(updated));
      localStorage.setItem("girls", JSON.stringify(updated));
      localStorage.setItem("menuItems", JSON.stringify(updated));
      return updated;
    });
    setIsAdminOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsAdminOpen(true);
  };

  const handleDelete = (id: any) => {
    if (!confirm("Apagar?")) return;
    setGirls((prev: any[]) => prev.filter((g) => g.id !== id));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "white" }}>
      <header style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #222" }}>
        <h1 style={{ fontWeight: "bold", fontSize: "20px" }}>🔥 Agencia Boas e Limpas</h1>
        <button onClick={() => { setEditingItem(null); setIsAdminOpen(true); }} style={{ background: "#dc2626", color: "white", padding: "8px 16px", borderRadius: "20px", border: "none", fontWeight: "bold" }}>
          + Nova Garota
        </button>
      </header>

      <MenuSection items={girls} onEdit={handleEdit} onDelete={handleDelete} />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => { setIsAdminOpen(false); setEditingItem(null); }}
        onSave={handleSave}
        saveItem={handleSave}
        addItem={handleSave}
        onDelete={handleDelete}
        editingItem={editingItem}
      />
    </div>
  );
}

export default App;
