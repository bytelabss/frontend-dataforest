import React, { useEffect, useState } from "react";

interface Geometry {
    type: string;
    coordinates: number[][][];
}

interface ReforestedArea {
    id: string;
    name: string;
    description: string;
    area_in_m2: number;
    geom: Geometry;
    user_id: string;
    created_at: string;
    updated_at: string;
}

interface RasterData {
    valor: number;
    medida: string;
}

interface Raster {
    temperatura?: RasterData;
    precipitacao?: RasterData;
    altitude?: RasterData;
    declividade?: RasterData;
    exposicao?: RasterData;
    distancia_vertical_drenagem?: RasterData;
    densidade_drenagem?: RasterData;
    cobertura_arborea?: RasterData;
    solo?: {
        valor: string;
        medida: string;
    };
}

interface GeospatialData {
    id: string;
    geom: string;
    raster: Raster;
}

interface AmbientalRisks {
    seca : boolean;
    queimadas: boolean;
    inundacao: boolean;
    desertificacao: boolean;
    alagamento_urbano: boolean;
}

interface GeologicalRisks {
    erosao: boolean;
    deslizamento: boolean;
    contaminacao_aquifero: boolean;
}

interface BiologicalRisks {
    pragas: boolean;
    baixa_resiliencia: boolean;
}

interface AnthropogenicRisks {
    poluicao: boolean;
    isolamento_hidrico: boolean;
}

interface RiskFactors {
    ambientais: AmbientalRisks;
    geologicos: GeologicalRisks;
    biologicos: BiologicalRisks;
    antrópicos: AnthropogenicRisks;
}

interface RiskArea {
    area: ReforestedArea;
    geospatialData: GeospatialData;
    risks: RiskFactors;
}

const classifySoilType = (solo: string): string => {
    const s = solo.toLowerCase();

    if (s.includes("argilúvico") || s.includes("argiloso") || s.includes("lva") || s.includes("pva")) {
        return "baixo_drenagem"; // propício a alagamentos, deslizamentos
    }

    if (s.includes("arenoso") || s.includes("areia") || s.includes("ar") || s.includes("rl")) {
        return "alta_infiltracao"; // risco de contaminação/desertificação
    }

    if (s.includes("distrófico")) {
        return "baixa_fertilidade";
    }

    if (s.includes("eutrófico")) {
        return "alta_fertilidade";
    }

    if (s.includes("cx") || s.includes("fx") || s.includes("la")) {
        return "compactado";
    }

    return "indefinido";
};

const RiskAreas: React.FC = () => {
    const [riskAreas, setRiskAreas] = useState<RiskArea[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [selectedArea, setSelectedArea] = useState<RiskArea | null>(null);

    const fetchReforestedAreas = async (): Promise<ReforestedArea[]> => {
        try {
            const response = await fetch("http://127.0.0.1:5000/reforested_areas");

            if (!response.ok) {
                throw new Error("Erro ao buscar as áreas reflorestadas");
            }

            const data: ReforestedArea[] = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const fetchReforestedAreaData = async (area: ReforestedArea): Promise<GeospatialData | null> => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch("http://127.0.0.1:5000/geospatial_data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    coordinates: area.geom.coordinates[0].map(coord => [coord[1], coord[0]]),
                }),
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar os dados geoespaciais da área: ${response.statusText}`);
            }

            const data: GeospatialData = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const verifyRisk = (area: GeospatialData): RiskFactors => {
        const temperatura = area.raster.temperatura?.valor || 0;
        const precipitacao = area.raster.precipitacao?.valor || 0;
        const declividade = area.raster.declividade?.valor || 0;
        const cobertura = area.raster.cobertura_arborea?.valor || 0;
        const drenagem = area.raster.densidade_drenagem?.valor || 0;
        const distDrenagem = area.raster.distancia_vertical_drenagem?.valor || 0;
        const soloOriginal = area.raster.solo?.valor || "";
        const altitude = area.raster.altitude?.valor || 0;

        const tipoSolo = classifySoilType(soloOriginal);

        const risks: RiskFactors = {
            ambientais: {
                seca: temperatura > 30 && precipitacao < 1000,
                queimadas: temperatura > 35 && cobertura < 20 && precipitacao < 800,
                inundacao: tipoSolo === "baixo_drenagem" && declividade < 10 && precipitacao > 1200,
                desertificacao: temperatura > 32 && precipitacao < 600 && cobertura < 10,
                alagamento_urbano: declividade < 5 && distDrenagem < 50
            },
            geologicos: {
                erosao: declividade > 30 && cobertura < 50,
                deslizamento: declividade > 25 && cobertura < 30 && tipoSolo === "baixo_drenagem",
                contaminacao_aquifero: altitude < 400 && distDrenagem < 50 && tipoSolo === "alta_infiltracao"
            },
            biologicos: {
                pragas: cobertura < 40 && distDrenagem < 50,
                baixa_resiliencia: cobertura < 10 && drenagem > 25
            },
            antrópicos: {
                poluicao: distDrenagem < 100 && drenagem > 10,
                isolamento_hidrico: altitude > 800 && distDrenagem > 150
            }
        };

        console.log("Riscos identificados:", risks);

        return risks;       

    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const areas = await fetchReforestedAreas();
            const resolvedRiskAreas: RiskArea[] = [];
    
            for (const area of areas) {
                const geospatialData = await fetchReforestedAreaData(area);
                if (geospatialData) {
                    const risks = verifyRisk(geospatialData);
                    resolvedRiskAreas.push({ area, geospatialData, risks });
                }
            }
    
            setRiskAreas(resolvedRiskAreas);
            setLoading(false);
        };
    
        loadData();
    }, []);
   

    if (loading) {
        return <p>Carregando áreas de risco...</p>;
    }
    if (riskAreas.length === 0) {
        return <p>Nenhuma área de risco encontrada.</p>;
    }

    return <p>{JSON.stringify(riskAreas, null, 2)}</p>;
  
};

export default RiskAreas;
