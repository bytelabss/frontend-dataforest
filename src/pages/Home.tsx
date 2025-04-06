import { JSX, useEffect, useState } from "react";
import Plant from "../assets/plant.svg";

interface Section {
  id: string;
  title: string;
  description: string;
  required: boolean;
}

export default function Home(): JSX.Element {
  const [mostrarModal, setMostrarModal] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("http://127.0.0.1:5000/terms/ativo")
      .then((res) => res.json())
      .then((data) => {
        setSections(data.sections);
        const initialChecks: Record<string, boolean> = {};
        data.sections.forEach((s: Section) => {
          initialChecks[s.id] = false;
        });
        setChecks(initialChecks);
      })
      .catch((err) => console.error("Erro ao carregar termo:", err));
  }, []);

  const aceitarTermo = () => {
    setMostrarModal(false);
  };

  const handleCheck = (id: string) => {
    setChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const podeSeguir = sections
    .filter((s) => s.required)
    .every((s) => checks[s.id]);

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
          <a href="#" className="pt-10 underline decoration-solid">
            Me leve até o dashboard.
          </a>
        </div>
        <div className="w-2xl">
          <img src={Plant} alt="Reflorestamento" />
        </div>
      </div>

      {/* Modal visível até aceitar */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-[90%] max-w-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Termo de Consentimento</h2>

            {sections.map((section) => (
              <div className="mb-3" key={section.id}>
                <label className="flex gap-2 items-start">
                  <input
                    type="checkbox"
                    checked={!!checks[section.id]}
                    onChange={() => handleCheck(section.id)}
                  />
                  <span>
                    <strong>{section.title}:</strong> {section.description}
                    {section.required && <span className="text-red-500">*</span>}
                  </span>
                </label>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                className={`px-6 py-2 rounded text-white ${
                  podeSeguir ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!podeSeguir}
                onClick={aceitarTermo}
              >
                Aceitar Termo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
