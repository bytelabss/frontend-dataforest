import React, { useEffect, useState } from "react";
import UserCreateForm from "./UserCreateForm"; // ajuste o caminho conforme necessário

type User = {
  id: string;
  full_name: string;
  email: string;
  role: string;
};

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    const token = localStorage.getItem("token");

    const confirmed = window.confirm("Tem certeza que deseja excluir este usuário?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userId));
      } else {
        console.error("Erro ao excluir usuário:", await res.text());
      }
    } catch (err) {
      console.error("Erro de rede:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserCreated = () => {
    setShowForm(false);
    fetchUsers(); // atualiza a lista
  };

  const loggedUserId = localStorage.getItem("id");

  console.log(loggedUserId)

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Lista de Usuários</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          {showForm ? "Fechar formulário" : "Cadastrar novo usuário"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <UserCreateForm
            onSubmit={(data) => {
              console.log("Usuário criado:", data);
              handleUserCreated();
            }}
          />
        </div>
      )}

      {loading ? (
        <p className="text-center">Carregando usuários...</p>
      ) : (
        <table className="w-full table-auto border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left border-b">Nome</th>
              <th className="p-3 text-left border-b">Email</th>
              <th className="p-3 text-left border-b">Papel</th>
              <th className="text-left p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (

                
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{user.full_name}</td>
                <td className="p-3 border-b">{user.email}</td>
                <td className="p-3 border-b capitalize">{user.role}</td>
                <td className="p-2">
                    {user.id !== loggedUserId && (
                        <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:underline"
                        >
                        Excluir
                        </button>
                    )}
                    </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {loggedUserId && (
  <p className="mt-4 text-sm">
    <button
      onClick={async () => {
        const confirmed = window.confirm("Tem certeza que deseja excluir seus dados pessoais? Essa ação é irreversível.");
        if (!confirmed) return;

        try {
          const token = localStorage.getItem("token");

          const res = await fetch(`http://localhost:5000/users/${loggedUserId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.ok) {
            localStorage.removeItem("token");
            localStorage.removeItem("id");
            window.location.href = "/SignIn";
          } else {
            console.error("Erro ao excluir usuário logado:", await res.text());
            alert("Erro ao excluir seus dados. Tente novamente.");
          }
        } catch (err) {
          console.error("Erro de rede:", err);
          alert("Erro de rede. Tente novamente.");
        }
      }}
      className="text-red-600 hover:underline bg-transparent border-none p-0 cursor-pointer"
    >
      Excluir meus dados pessoais
    </button>
  </p>
)}

    </div>
  );
};

export default UserList;
