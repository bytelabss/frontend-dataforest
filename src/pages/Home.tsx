// src/pages/Home.tsx
import { JSX } from "react";
import Plant from "../assets/plant.svg";
import TermModal from "../components/TermModal";

export default function Home(): JSX.Element {
  return (
    <div className="p-6 bg-gray-20 relative min-h-screen">
      {/* Conteúdo principal */}
      <div className="w-full flex justify-end items-center gap-24 mr-10">
        <div className="w-1/3">
          <p>
            Na Data Forest, juntamos o poder da Inteligência Artificial e das nossas bases de dados
            para auxiliar na restauração de ecossistemas e no processo de reflorestamento.
          </p>
          <br />
          <p className="text-xs">
            SAÚDE FLORESTAL | MINIMIZAÇÃO DE RISCOS | PLANTIO INTELIGENTE
          </p>
          <br />
          <div className="flex gap-2">
            <button className="rounded-md bg-secondary-500 px-10 py-2 hover:bg-primary-500 hover:text-white">
              Comece Aqui!
            </button>
            <span className="pt-4">ou</span>
          </div>
          <br />
          <a href="" className="pt-10 underline decoration-solid">
            Me leve até o dashboard.
          </a>
        </div>
        <div className="w-2xl">
          <img src={Plant} alt="Reflorestamento" />
        </div>
        <TermModal 
        showInitially={true} // Opcional - padrão é true
        onAccept={() => {
          // Callback quando termos são aceitos
          console.log("Termos aceitos com sucesso!");
        }}
      />
      </div>
      </div>
  );
}