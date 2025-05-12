import React, { useEffect, useState } from "react";

type User = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
};

const UserData: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [formData, setFormData] = useState({ full_name: "", email: "", role: "" });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");

      const res = await fetch(`http://localhost:5000/users/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUser(data);
      setFormData({ full_name: data.full_name, email: data.email, role: data.role });
    } catch (err) {
      console.error("Erro ao buscar dados do usuário:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");

      const res = await fetch(`http://localhost:5000/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        setEditMode(false);
        showToast("Usuário atualizado com sucesso!", "success");
      } else {
        const text = await res.text();
        console.error("Erro ao atualizar usuário:", text);
        showToast("Erro ao atualizar o usuário.", "error");
      }
    } catch (err) {
      console.error("Erro de rede:", err);
      showToast("Erro de rede ao atualizar usuário.", "error");
    }
  };

  const deleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");

      const res = await fetch(`http://localhost:5000/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        localStorage.clear();
        showToast("Conta excluída com sucesso.", "success");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        console.error("Erro ao excluir conta:", await res.text());
        showToast("Erro ao excluir a conta.", "error");
      }
    } catch (err) {
      console.error("Erro de rede:", err);
      showToast("Erro de rede ao excluir conta.", "error");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) return <p className="text-center">Carregando perfil...</p>;
  if (!user) return <p className="text-center">Usuário não encontrado.</p>;

  return (
    <div className="relative">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded shadow-md text-white flex items-start justify-between gap-4 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-white font-bold ml-4">×</button>
        </div>
      )}

      {/* Popup de confirmação */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-4">Confirmar exclusão</h3>
            <p className="mb-6">Tem certeza que deseja excluir sua conta e todos os seus dados?</p>
            <p className="mb-6 text-red-500 font-bold">Essa ação não pode ser desfeita.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  deleteAccount();
                  setShowConfirm(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Sim, excluir
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Meu Perfil</h2>

        {editMode ? (
          <>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Nome</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value, role: user.role })
                }
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value, role: user.role })
                }
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={updateUserData}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Salvar
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="text-gray-600 hover:underline"
              >
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <>
            <p><strong>Nome:</strong> {user.full_name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Papel:</strong> {user.role}</p>
            <hr style={{ margin: "10px 0", border: "1px solid #ccc" }} />
            <p>
              <strong>Data de criação:</strong>{" "}
              {new Date(user.created_at).toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
            <p>
              <strong>Última atualização:</strong>{" "}
              {new Date(user.updated_at).toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Editar
              </button>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowConfirm(true)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Excluir Conta e Meus Dados Pessoais
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserData;
