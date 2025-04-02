import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Definindo o esquema de validação
const schema = yup.object().shape({
  nome: yup.string().required("O nome da área é obrigatório"),
  description: yup.string().required("A descrição da área é obrigatória"), 
  localizacao: yup
    .string() 
    .required("A localização (latitude e longitude) é obrigatória"),
  area: yup.string().required("Área é obrigatória"), 
});

type FormData = {
  nome: string;
  description : string;
  localizacao: string;
  area: string;
};

type FormProps = {
  onSubmit: (data: FormData) => void;
  initialData?: FormData;
};

const ReflorestamentoForm: React.FC<FormProps> = ({ initialData }) => {
  const [showModal, setShowModal] = useState(false);  // Estado para controlar a visibilidade do modal

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      nome: "",
      description : "",
      localizacao: "",
      area: ""
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    const coordenadasCompletas = data.localizacao.split(';');
    console.log(coordenadasCompletas);

    const coordinates = coordenadasCompletas.map(coord => {
        const [latitude, longitude] = coord.split(',').map((value) => parseFloat(value.trim()));
        return [latitude, longitude]; 
      });

    console.log("coordenadas: " + coordinates)

    const requestBody = {
      user_id: "4f656555-8199-44bf-ac56-1a1b2f1c363a", 
      name: data.nome,
      description: data.description, 
      area_in_m2: parseFloat(data.area), 
      geom: {
        type: "Polygon",
        coordinates: [
            coordinates 
        ]
      }
    };

    console.log(requestBody)

    try {
      const response = await fetch("http://127.0.0.1:5000/reforested_areas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Requisição bem-sucedida:", result);
        setShowModal(true);  // Exibe o modal de sucesso
      } else {
        console.error("Erro na requisição:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-semibold text-center mb-6">Formulário de Áreas Reflorestadas</h1>
      
      {/* Modal de Sucesso */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-semibold text-green-500">Cadastro realizado com sucesso!</h2>
            <p className="mt-2">A área foi cadastrada corretamente no sistema.</p>
            <button
              className="mt-4 py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
              onClick={() => setShowModal(false)}  // Fecha o modal
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="form-group">
          <label htmlFor="nome" className="block text-lg font-medium">Nome da área</label>
          <Controller
            name="nome"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="mt-2 p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
              />
            )}
          />
          {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="block text-lg font-medium">Descrição</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="mt-2 p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
              />
            )}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="localizacao" className="block text-lg font-medium">Localização</label>
          <Controller
            name="localizacao"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="mt-2 p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
              />
            )}
          />
          {errors.localizacao && (
            <p className="text-red-500 text-sm mt-1">{errors.localizacao.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="area" className="block text-lg font-medium">Área</label>
          <Controller
            name="area"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="mt-2 p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
              />
            )}
          />
          {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Salvar
        </button>
      </form>
    </div>
  );
};

export default ReflorestamentoForm;
