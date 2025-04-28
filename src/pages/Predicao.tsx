import { JSX, useState } from "react";
import PredictionButton from "../components/PredictionButton";
import PredictionDisplay from "../components/PredictionDisplay";
import { ReforestedArea, ClassificationResult, PredictionResult, ClassificationResponse, PredictionResponse } from "../shared/types";
import SelectReforestedAreas from "../components/SelectReforestedAreas";

export default function Predicao(): JSX.Element {
  const [selectedArea, setSelectedArea] = useState<ReforestedArea | null>(null);
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [, setPrediction] = useState<PredictionResult | null>(null);
  const [predictionResponse, setPredictionResponse] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAreaSelected = (area: ReforestedArea | null) => {
    setSelectedArea(area);
    // setClassification(null);
    // setPrediction(null);
    // setError(null);
  };

  const mockJSON_eucalipto = {
		"temperatura": 24,
	  "precipitacao": 1300,
		"altitude": 500,
		"declividade": 12.3,
	  "exposicao": 180,
	  "distancia_vertical_drenagem": 45.2,
    "densidade_drenagem": 0.8,
	 	"cobertura_arborea": 30.5
  }

  const mockJSON_pinha = {
		"temperatura": 25.9,
	  "precipitacao": 2160.0,
		"altitude": 52.43000030517578,
		"declividade": 0.3255650103092193,
	  "exposicao": 254.0546112060547,
	  "distancia_vertical_drenagem": 24.950000762939453,
    "densidade_drenagem": 19.884899139404297,
	 	"cobertura_arborea": 86.0
  }

  const handleClassify = async (area: ReforestedArea) => {
    
    setIsLoading(true);
    setError(null);

    console.log("Area a ser classificada: ", area) // Debugging line to check the area object

    if (area.name === "Área de Reflorestamento do Front") {
      console.log("Body: ", mockJSON_eucalipto) // Debugging line to check the body being sent
      try {
        const response = await fetch('http://127.0.0.1:5000/classificar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // body: JSON.stringify({
          //   area_id: area.id,
          //   geom: area.geom
          // })
          body: JSON.stringify(mockJSON_eucalipto)
        });
  
        if (!response.ok) {
          throw new Error(`Classification failed: ${response.statusText}`);
        }
  
        const result: ClassificationResponse = await response.json();
        setClassification(result.species); // Extract the species from response
        console.log("RESULTADO: ", result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Classification failed');
      } finally {
        setIsLoading(false);
      }
    } else {
        try {
          const response = await fetch('http://127.0.0.1:5000/classificar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            // body: JSON.stringify({
            //   area_id: area.id,
            //   geom: area.geom
            // })
            body: JSON.stringify(mockJSON_pinha)
          });
    
          if (!response.ok) {
            throw new Error(`Classification failed: ${response.statusText}`);
          }
    
          const result: ClassificationResponse = await response.json();
          setClassification(result.species); // Extract the species from response
          console.log("RESULTADO: ", result);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Classification failed');
        } finally {
          setIsLoading(false);
        }

  } };

  const handlePredict = async (area: ReforestedArea) => {

    setError(null);

    console.log(area) // Debugging line to check the area object

    if (area.name === "Área de Reflorestamento do Front") {

      try {
        const response = await fetch('http://127.0.0.1:5000/prever-estrategia', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // body: JSON.stringify({
          //   area_id: area.id,
          //   area_in_m2: area.area_in_m2,
          //   geom: area.geom
          // })
          body: JSON.stringify(mockJSON_eucalipto)
        });
  
        if (!response.ok) {
          throw new Error(`Prediction failed: ${response.statusText}`);
        }
  
        const result: PredictionResponse = await response.json();
        setPredictionResponse(result);
        setPrediction(result.estrategia_prevista); // Keep this for backward compatibility if needed
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Prediction failed');
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const response = await fetch('http://127.0.0.1:5000/prever-estrategia', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // body: JSON.stringify({
          //   area_id: area.id,
          //   area_in_m2: area.area_in_m2,
          //   geom: area.geom
          // })
          body: JSON.stringify(mockJSON_pinha)
        });
  
        if (!response.ok) {
          throw new Error(`Prediction failed: ${response.statusText}`);
        }
  
        const result: PredictionResponse = await response.json();
        setPredictionResponse(result);
        setPrediction(result.estrategia_prevista); // Keep this for backward compatibility if needed
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Prediction failed');
      } finally {
        setIsLoading(false);
      }
    };
  };

  return (
    <div>
      <div className="pt-36 px-24"> 
        <h1 className="text-4xl font-bold mb-4">Predição</h1>
        <p className="text-lg text-gray-600 mb-1">Bem-vindo à predição inteligente Dataforest!</p>
        <p className="text-lg text-gray-600 mb-8">Aqui você pode utilizar nosso modelo de Machine Learning e ter acesso às melhores espécies e estratégias, <br /> e assim maximizar a eficácia do seu reflorestamento! Vamos começar? </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-6 my-8">
          <h3>Selecione uma área para predição:</h3>
          <SelectReforestedAreas 
            onAreaSelected={handleAreaSelected}
            apiUrl={"http://127.0.0.1:5000/reforested_areas"}
            defaultOptionText="Selecione uma área reflorestada"
          />
          
          <PredictionButton
            selectedArea={selectedArea}
            onClassify={handleClassify}
            onPredict={handlePredict}
            isLoading={isLoading}
            onReset={() => {
              setClassification(null);
              setPrediction(null);
              setPredictionResponse(null);
              setError(null);
            }}
          />
        </div>

        {error && (
          <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
            {error}
          </div>
        )}

        {selectedArea && (
          <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "4px" }}>
            <h4>Área Selecionada:</h4>
            <p><strong>Nome:</strong> {selectedArea.name}</p>
            <p><strong>Descrição:</strong> {selectedArea.description}</p>
            <p><strong>Tamanho:</strong> {selectedArea.area_in_m2} m²</p>
          </div>
        )}

        {(classification || predictionResponse) && (
            <PredictionDisplay 
              classification={classification || undefined}
              predictionResponse={predictionResponse || undefined}
              message={classification ? "Área classificada com sucesso!" : "Estratégia prevista com sucesso!"}
            />
        )}
      </div>
    </div>
  );
}