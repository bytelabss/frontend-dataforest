import { useEffect, useState } from "react";
import PredictionDisplay from "../components/PredictionDisplay";
import { ReforestedArea, ClassificationResult, PredictionResponse, ClassificationResponse, GeospatialData } from "../shared/types";
import SelectReforestedAreas from "../components/SelectReforestedAreas";
import PredictionButton from "../components/PredictionButton";

export default function Predicao() {
  const [selectedArea, setSelectedArea] = useState<ReforestedArea | null>(null);
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [predictionResponse, setPredictionResponse] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSingleArea = async (area_id) => {
      try {
        const response = await fetch("http://127.0.0.1:5000/reforested_areas/" + area_id);
        const area: ReforestedArea = await response.json();
        if (area) {
          setSelectedArea(area);
        }
      } catch (err) {
        console.error("Erro ao buscar a área:", err);
      }
    };
    fetchSingleArea(selectedArea?.id);
  }, []);

  const fetchGeospatialData = async (area: ReforestedArea): Promise<GeospatialData | null> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5000/geospatial_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          coordinates: area.geom.coordinates[0].map((coord) => [coord[1], coord[0]]),
        }),
      });

      if (!response.ok) throw new Error("Erro ao buscar dados geoespaciais");

      const data: GeospatialData = await response.json();
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handlePredictionWorkflow = async () => {
    if (!selectedArea) return;
    setIsLoading(true);
    setError(null);

    const geoData = await fetchGeospatialData(selectedArea);
    if (!geoData) {
      setError("Erro ao obter dados geoespaciais");
      setIsLoading(false);
      return;
    }

    const payload = {
      temperatura: geoData.raster.temperatura?.valor ?? 0,
      precipitacao: geoData.raster.precipitacao?.valor ?? 0,
      altitude: geoData.raster.altitude?.valor ?? 0,
      declividade: geoData.raster.declividade?.valor ?? 0,
      exposicao: geoData.raster.exposicao?.valor ?? 0,
      distancia_vertical_drenagem: geoData.raster.distancia_vertical_drenagem?.valor ?? 0,
      densidade_drenagem: geoData.raster.densidade_drenagem?.valor ?? 0,
      cobertura_arborea: geoData.raster.cobertura_arborea?.valor ?? 0,
    };

    console.log("Payload enviado:", payload);

    try {
      const classRes = await fetch("http://127.0.0.1:5000/classificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!classRes.ok) throw new Error("Erro ao classificar");
      const classData: ClassificationResponse = await classRes.json();
      setClassification(classData.species);

      const predRes = await fetch("http://127.0.0.1:5000/prever-estrategia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!predRes.ok) throw new Error("Erro ao predizer");
      const predData: PredictionResponse = await predRes.json();
      console.log("Predição:", predData);
      setPredictionResponse(predData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro durante a classificação ou predição");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-36 px-24">
      <h1 className="text-4xl font-bold mb-4">Predição</h1>
      <p className="text-lg text-gray-600 mb-1">
        Bem-vindo à predição inteligente Dataforest!
      </p>
      <p className="text-lg text-gray-600 mb-8">
        Aqui você pode utilizar nosso modelo de Machine Learning e ter acesso às melhores espécies e estratégias, <br />
        e assim maximizar a eficácia do seu reflorestamento! Vamos começar?
      </p>
  
      <div className="flex flex-col sm:flex-row items-center gap-6 my-8">
        <h3>Selecione uma área para predição:</h3>
        <SelectReforestedAreas 
          onAreaSelected={setSelectedArea}
          apiUrl={"http://127.0.0.1:5000/reforested_areas"}
          defaultOptionText="Selecione uma área reflorestada"
        />
        <PredictionButton
          selectedArea={selectedArea}
          onClassify={() => {
            if (!selectedArea) {
              setError("Nenhuma área selecionada para classificação.");
              return;
            }
            handlePredictionWorkflow();
          }}
          onPredict={() => {
            if (!selectedArea) {
              setError("Nenhuma área selecionada para predição.");
              return;
            }
            handlePredictionWorkflow();
          }}
          isLoading={isLoading}
          onReset={() => {
            setClassification(null);
            setPredictionResponse(null);
            setError(null);
          }}
        />
      </div>
  
      {error && <p className="text-red-500 mt-4">{error}</p>}
  
      <PredictionDisplay
        classification={classification ?? undefined}
        predictionResponse={predictionResponse ?? undefined}
      />
    </div>
  );
  
  
}
