import { JSX } from "react";
import UserCreateForm from "../components/UserCreateForm";

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
        <UserCreateForm onSubmit={handleSubmit} initialData={initialData} />
      </div>
    </div>
  );
};
