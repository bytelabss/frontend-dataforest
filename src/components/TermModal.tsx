// src/components/TermoModal.tsx
import { useState, useEffect } from "react";

interface Section {
  id: string;
  title: string;
  description: string;
  required: boolean;
}

interface TermoModalProps {
  onAccept?: () => void; // Callback opcional quando termos são aceitos
  showInitially?: boolean; // Se deve mostrar o modal ao carregar
}

export default function TermoModal({ 
  onAccept, 
  showInitially = true 
}: TermoModalProps): JSX.Element | null {
  const [mostrarModal, setMostrarModal] = useState(showInitially);
  const [sections, setSections] = useState<Section[]>([]);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carrega os termos da API
  useEffect(() => {
    const carregarTermos = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/terms/ativo");
        if (!response.ok) {
          throw new Error("Falha ao carregar termos");
        }
        const data = await response.json();
        
        setSections(data.sections);
        const initialChecks = data.sections.reduce((acc: Record<string, boolean>, section: Section) => {
          acc[section.id] = false;
          return acc;
        }, {});
        
        setChecks(initialChecks);
      } catch (err) {
        console.error("Erro:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setIsLoading(false);
      }
    };

    carregarTermos();
  }, []);

  const handleCheck = (id: string) => {
    setChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const podeSeguir = sections
    .filter(s => s.required)
    .every(s => checks[s.id]);

  const aceitarTermo = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://127.0.0.1:5000/terms/aceite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          sections: Object.entries(checks)
            .filter(([_, checked]) => checked)
            .map(([id]) => ({ section_id: id })),
          accepted: true
        })
      });

      if (!response.ok) {
        throw new Error("Falha ao aceitar termos");
      }

      setMostrarModal(false);
      onAccept?.(); // Chama a callback se existir
    } catch (err) {
      console.error("Erro:", err);
      setError(err instanceof Error ? err.message : "Erro ao aceitar termos");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mostrarModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Termo de Consentimento</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-600 hover:underline"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            <p className="mb-6 text-gray-600">
              Para continuar usando nossa plataforma, por favor leia e aceite os termos abaixo:
            </p>

            <div className="space-y-4 mb-6">
              {sections.map((section) => (
                <div 
                  key={section.id}
                  className={`p-4 rounded-lg border ${
                    checks[section.id] 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200'
                  } transition-colors`}
                >
                  <label className="flex gap-3 items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!checks[section.id]}
                      onChange={() => handleCheck(section.id)}
                      className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {section.title}
                        {section.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {section.description}
                      </p>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-4">
              <p className="text-sm text-gray-500">
                Campos marcados com <span className="text-red-500">*</span> são obrigatórios
              </p>
              <button
                disabled={!podeSeguir || isLoading}
                onClick={aceitarTermo}
                className={`px-6 py-2 rounded text-white transition-colors ${
                  podeSeguir 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-gray-400 cursor-not-allowed"
                } flex items-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processando...
                  </>
                ) : (
                  "Aceitar Termo"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}