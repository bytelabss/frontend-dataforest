import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  full_name: yup.string().required("Nome completo é obrigatório"),
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  password: yup.string().min(6, "Senha deve ter pelo menos 6 caracteres").required("Senha é obrigatória"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas não coincidem")
    .required("Confirme a senha"),
  role: yup.string().required("Cargo é obrigatório"),
});

type UserFormData = {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: string;
};


type Props = {
  onSubmit: (data: UserFormData) => void;
};

const UserCreateForm: React.FC<Props> = ({ onSubmit }) => {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: yupResolver(schema),
  });

  const submit = async (data: UserFormData) => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        console.log("Usuário criado:", result);
        reset(); // limpa o formulário
        onSubmit(result); // notifica o componente pai
      } else {
        console.error("Erro ao criar usuário:", await res.text());
      }
    } catch (err) {
      console.error("Erro de rede:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div>
        <label className="block font-medium">Nome completo</label>
        <Controller
          name="full_name"
          control={control}
          render={({ field }) => (
            <input {...field} className="w-full p-2 border rounded" />
          )}
        />
        {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Email</label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <input type="email" {...field} className="w-full p-2 border rounded" />
          )}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Senha</label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <input type="password" {...field} className="w-full p-2 border rounded" />
          )}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Confirmar Senha</label>
        <Controller
          name="confirm_password"
          control={control}
          render={({ field }) => (
            <input type="password" {...field} className="w-full p-2 border rounded" />
          )}
        />
        {errors.confirm_password && (
          <p className="text-red-500 text-sm">{errors.confirm_password.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium">Cargo</label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <select {...field} className="w-full p-2 border rounded">
              <option value="">Selecione...</option>
              <option value="ADMINISTRATOR">Administrador</option>
            </select>
          )}
        />
        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 rounded text-white bg-blue-600 hover:bg-blue-700 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Salvando..." : "Cadastrar"}
      </button>
    </form>
  );
};

export default UserCreateForm;
