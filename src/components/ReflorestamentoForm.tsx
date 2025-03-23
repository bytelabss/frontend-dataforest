import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  nome: yup.string().required("O nome da área é obrigatório"),
  description: yup.string().required("A descrição da área é obrigatório"), 
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

    console.log(coordinates)

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
        // Aqui você pode fazer algo, como exibir uma mensagem de sucesso ou redirecionar o usuário
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
          {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
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
          {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
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
