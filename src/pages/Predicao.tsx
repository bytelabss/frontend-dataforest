import { JSX } from "react";
import SelectReforestedAreas from "../components/SelectReforestedAreas";
import { ReforestedArea } from "../shared/types";
import { useState } from "react";

export default function Predicao(): JSX.Element {

  const [selectedArea, setSelectedArea] = useState<ReforestedArea | null>(null);

  const handleAreaSelected = (area: ReforestedArea | null) => {
    setSelectedArea(area);
    if (area) {
      console.log("Selected area for prediction:", area);
      // You can access all area properties here:
      // area.id, area.name, area.geom, etc.
    }
  };

  return (
    <div>
      <div style={{ paddingTop: "150px" }}> 
        <h1>Predição</h1>
        <p>Essa página é para predição de áreas reforestadas.</p>

        <div style={{ margin: "20px 0" }}>
          <h3>Selecione uma área para predição:</h3>
          <SelectReforestedAreas 
            onAreaSelected={handleAreaSelected}
            apiUrl={"http://127.0.0.1:5000/reforested_areas"}
            defaultOptionText="Selecione uma área cadastrada"
          />
        </div>

        {selectedArea && (
          <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "4px" }}>
            <h4>Área Selecionada:</h4>
            <p><strong>Nome:</strong> {selectedArea.name}</p>
            <p><strong>Descrição:</strong> {selectedArea.description}</p>
            <p><strong>Tamanho:</strong> {selectedArea.area_in_m2} m²</p>
            {/* You can add more details here */}
          </div>
        )}

        {!selectedArea && <p>Selecione uma área para ver detalhes e fazer predições.</p>}

      </div>
    </div>
  );
}