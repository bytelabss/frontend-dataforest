import { JSX } from "react";
import Plant from '../assets/plant.svg'

export default function Home(): JSX.Element {
    return (
      <div className="p-6 bg-gray-20">
        <div className="w-full flex justify-end items-center gap-24 mr-10">
          <div className="w-1/3">
            <p>Na Data Forest, juntamos o poder da Inteligência Artificial e das nossas bases de dados para auxiliar na restauração de ecossistemas e no processo de reflorestamento.</p>
            <br />
            <p className="text-xs">SAÚDE FLORESTAL | MINIMIZAÇÃO DE RISCOS | PLANTIO INTELIGENTE</p>
            <br />
            <button
              className="rounded-md bg-secondary-500 px-10 py-2 hover:bg-primary-500 hover:text-white"
            >
              Comece Aqui!
            </button>
          </div>
          <div className="w-2xl">
            <img src={Plant} alt="arrow" />
          </div>
        </div>
      </div>
    );
  }