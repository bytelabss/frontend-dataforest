import { JSX } from "react";
import ReflorestamentoForm from "../components/ReflorestamentoForm";

type FormData = {
  nome: string;
  description: string;
  localizacao: string;
  area: string;
};

export default function ReforestedAreaCreate(): JSX.Element {
  const handleSubmit = (data: FormData) => {
    console.log(data); 
  };

  const initialData: FormData = {
    nome: "",
    description: "",
    localizacao: "",
    area: ""
  };

  return (
    <div>
      <div style={{ paddingTop: "150px" }}> 
        <ReflorestamentoForm onSubmit={handleSubmit} initialData={initialData} />
      </div>
    </div>
  );
};
