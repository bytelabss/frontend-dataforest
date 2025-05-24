import React, { useEffect, useState } from "react";
import { exportToCSV } from "./ExportCSV.tsx";
import { exportToJSON } from "./ExportJSON";
import { exportToPDF } from "./ExportPDF";

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

interface Risk {
    valor: boolean;
    explicacao: string;
    recomendacao: string;
}

interface AmbientalRisks {
    seca: Risk;
    queimadas: Risk;
    inundacao: Risk;
    desertificacao: Risk;
    alagamento_urbano: Risk;
}

interface GeologicalRisks {
    erosao: Risk;
    deslizamento: Risk;
    contaminacao_aquifero: Risk;
    assoreamento: Risk;
    compactacao: Risk;
}

interface BiologicalRisks {
    pragas: Risk;
    baixa_resiliencia: Risk;
}

interface AnthropogenicRisks {
    poluicao: Risk;
    isolamento_hidrico: Risk;
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
    classification?: string;
}

const classifySoilType = (solo: string): string[] => {
    const s = solo.toLowerCase();
    const tipos: string[] = [];

    if (
        s.includes("argilúvico") ||
        s.includes("argiloso") ||
        s.includes("lva") ||
        s.includes("pva")
    ) {
        tipos.push("baixo_drenagem"); // propício a alagamentos e deslizamentos
    }

    if (
        s.includes("arenoso") ||
        s.includes("areia") ||
        s.includes("ar") ||
        s.includes("rl")
    ) {
        tipos.push("alta_infiltracao"); // risco de contaminação/desertificação
    }

    if (s.includes("distrófico")) {
        tipos.push("baixa_fertilidade");
    }

    if (s.includes("eutrófico")) {
        tipos.push("alta_fertilidade");
    }

    if (
        s.includes("cx") ||
        s.includes("fx") ||
        s.includes("la")
    ) {
        tipos.push("compactado");
    }

    if (tipos.length === 0) {
        tipos.push("indefinido");
    }

    return tipos;
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
                seca: {
                    valor:
                        temperatura > 30 &&
                        precipitacao < 1000 &&
                        (tipoSolo.includes("alta_infiltracao") || tipoSolo.includes("baixa_fertilidade")),
                    explicacao: "Temperatura acima de 30°C, precipitação abaixo de 1000mm e solo com alta infiltração ou baixa fertilidade.",
                    recomendacao: "Melhorar a retenção de água no solo com cobertura vegetal e uso de matéria orgânica. Implementar irrigação controlada.",
                },
                queimadas: {
                    valor: temperatura > 35 && cobertura < 20 && precipitacao < 800,
                    explicacao: "Temperatura acima de 35°C, cobertura arbórea abaixo de 20% e precipitação abaixo de 800mm.",
                    recomendacao: "Reforçar aceiros e realizar campanhas de prevenção contra incêndios."
                },
                inundacao: {
                    valor: tipoSolo.includes("baixo_drenagem") && declividade < 10 && precipitacao > 1200,
                    explicacao: "Solo de baixa drenagem, declividade abaixo de 10° e precipitação acima de 1200mm.",
                    recomendacao: "🛣️💧 Construir canais de drenagem e evitar construções em áreas de risco."
                },
                desertificacao: {
                    valor: temperatura > 32 && precipitacao < 600 && cobertura < 10,
                    explicacao: "Temperatura acima de 32°C, precipitação abaixo de 600mm e cobertura arbórea abaixo de 10%.",
                    recomendacao: "🌱🌳 Plantar espécies nativas resistentes e proteger o solo contra erosão."
                },
                alagamento_urbano: {
                    valor: declividade < 5 && distDrenagem < 50,
                    explicacao: "Declividade abaixo de 5° e distância da drenagem menor que 50m.",
                    recomendacao: "🛣️💧 Melhorar a infraestrutura de drenagem urbana e pavimentação permeável."
                }
            },
            geologicos: {
                erosao: {
                    valor: declividade > 10 && cobertura < 50,
                    explicacao: "Declividade acima de 10° e cobertura arbórea abaixo de 50%.",
                    recomendacao: "🛡️🌳 Instalar barreiras vegetais e promover cobertura vegetal permanente."
                },
                deslizamento: {
                    valor: declividade > 25 && cobertura < 30 && tipoSolo.includes("baixo_drenagem"),
                    explicacao: "Declividade acima de 25°, cobertura arbórea abaixo de 30% e solo de baixa drenagem.",
                    recomendacao: "🚫🏗️ Evitar cortes de encostas e usar técnicas de contenção com vegetação."
                },
                contaminacao_aquifero: {
                    valor: altitude < 400 && distDrenagem < 50 && tipoSolo.includes("alta_infiltracao"),
                    explicacao: "Altitude abaixo de 400m, distância da drenagem menor que 50m e solo de alta infiltração.",
                    recomendacao: "🚫🧴 Restringir uso de agrotóxicos e monitorar qualidade da água subterrânea."
                },
                assoreamento: {
                    valor: cobertura < 30 && declividade > 10 && distDrenagem < 50,
                    explicacao: "Cobertura arbórea baixa, declividade significativa e proximidade com corpos d'água.",
                    recomendacao: "🛡️🌿 Implantar barreiras vegetais e proteger as margens dos corpos d'água."
                },
                compactacao: {
                    valor: tipoSolo.includes("argiloso") && declividade < 5,
                    explicacao: "Solo argiloso com baixa declividade, propenso à compactação.",
                    recomendacao: "🏗️🛣️ Evitar tráfego pesado e realizar práticas de descompactação."
                }
            },
            biologicos: {
                pragas: {
                    valor: cobertura < 40 && distDrenagem < 50,
                    explicacao: "Cobertura arbórea abaixo de 40% e distância da drenagem menor que 50m.",
                    recomendacao: "🐞🧪 Adotar manejo integrado de pragas com monitoramento e controle biológico."
                },
                baixa_resiliencia: {
                    valor: cobertura < 10 && drenagem > 25,
                    explicacao: "Cobertura arbórea abaixo de 10% e drenagem acima de 25km/km².",
                    recomendacao: "🌱🌳 Diversificar a vegetação e restaurar áreas degradadas."
                }
            },
            antrópicos: {
                poluicao: {
                    valor: distDrenagem < 100 && drenagem > 10,
                    explicacao: "Distância da drenagem menor que 100m e drenagem acima de 10km/km².",
                    recomendacao: "🔍📢 Fiscalizar fontes de poluentes e promover educação ambiental."
                },
                isolamento_hidrico: {
                    valor: altitude > 800 && distDrenagem > 150,
                    explicacao: "Altitude acima de 800m e distância da drenagem maior que 150m.",
                    recomendacao: "🌊🌿 Interligar corpos hídricos com corredores ecológicos e reflorestamento."
                }
            }
        };

        return risks;

    };


    const classifyArea = async (area: GeospatialData) => {
        try {
            const payload = {
                temperatura: area.raster["temperatura"]?.["valor"] || null,
                precipitacao: area.raster["precipitacao"]?.["valor"] || null,
                altitude: area.raster["altitude"]?.["valor"] || null,
                declividade: area.raster["declividade"]?.["valor"] || null,
                exposicao: area.raster["exposicao"]?.["valor"] || null,
                distancia_vertical_drenagem: area.raster["distancia_vertical_drenagem"]?.["valor"] || null,
                densidade_drenagem: area.raster["densidade_drenagem"]?.["valor"] || null,
                cobertura_arborea: area.raster["cobertura_arborea"]?.["valor"] || null,
            };

            const response = await fetch("http://127.0.0.1:5000/classificar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Erro ao classificar a área");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
        }
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
                    const classification = await classifyArea(geospatialData);
                    const riskArea: RiskArea = {
                        area,
                        geospatialData,
                        risks,
                        classification: classification?.species || "indefinido"
                    };                    
                    resolvedRiskAreas.push(riskArea);
                }
            }

            setRiskAreas(resolvedRiskAreas);
            setLoading(false);
        };

        loadData();
    }, []);

    const handleExport = (format: string, data: any) => {
        var filename = "relatorio_geral"
         + "_" + new Date().toISOString().split('T')[0];
        if (typeof data === "object"){
            if (data.hasOwnProperty("area")){
            filename = `relatorio_area_${data.area.name.replace(/\s+/g, '_').toLowerCase()}` + "_" + new Date().toISOString().split('T')[0];
        }}
        switch (format) {
            case "csv":
                exportToCSV(data, filename);
                break;
            case "json":
                exportToJSON(data, filename);
                break;
            case "pdf":
                exportToPDF(data, filename);
                break;
            default:
                console.error("Formato não suportado");
        }
    };


    if (loading) {
        return <p>Carregando áreas de risco...</p>;
    }
    if (riskAreas.length === 0) {
        return <p>Nenhuma área de risco encontrada.</p>;
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 p-6 bg-white min-h-screen">
            <div className="grid-1 bg-[#f3eded57] p-6 shadow-lg rounded-lg w-4xl mx-auto md:w-2/3 md:h-2/3">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Áreas que correm Risco</h2>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {riskAreas.map((riskArea) => (
                        <div
                            key={riskArea.area.id}
                            onClick={() => setSelectedArea(riskArea)}
                            className="cursor-pointer bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
                        >
                            <h3 className="text-xl font-semibold text-black-700 mb-1">{riskArea.area.name}</h3>
                            <p className="text-gray-600 text-sm">{riskArea.area.description}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {Object.entries(riskArea.risks.ambientais)
                                    .filter(([_, v]) => v.valor === true)
                                    .map(([k]) => (
                                        <span key={k} className="bg-red-100 text-black text-s px-2 py-1 rounded-full">
                                            {k.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase())}
                                        </span>
                                    ))}
                                {Object.entries(riskArea.risks.geologicos)
                                    .filter(([_, v]) => v.valor === true)
                                    .map(([k]) => (
                                        <span key={k} className="bg-yellow-100 text-black text-s px-2 py-1 rounded-full">
                                            {k.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase())}
                                        </span>
                                    ))}
                                {Object.entries(riskArea.risks.biologicos)
                                    .filter(([_, v]) => v.valor === true)
                                    .map(([k]) => (
                                        <span key={k} className="bg-green-100 text-black text-s px-2 py-1 rounded-full">
                                            {k.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase())}
                                        </span>
                                    ))}
                                {Object.entries(riskArea.risks.antrópicos)
                                    .filter(([_, v]) => v.valor === true)
                                    .map(([k]) => (
                                        <span key={k} className="bg-blue-100 text-black text-s px-2 py-1 rounded-full">
                                            {k.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase())}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="relative flex justify-center mt-5">
                                <button
                                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                                    onClick={(e) => {
                                        const dropdown = e.currentTarget.nextElementSibling as HTMLElement;
                                        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
                                    }}
                                >
                                    📥 Exportar Relatório Geral
                                </button>
                                <div
                                    className="absolute bg-white border border-gray-300 rounded shadow-lg mt-2 w-48"
                                    style={{ display: "none" }}
                                >
                                    <button
                                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white transition"
                                        onClick={() => handleExport("csv", riskAreas)}
                                    >
                                        Exportar CSV
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white transition"
                                        onClick={() => handleExport("json", riskAreas)}
                                    >
                                        Exportar JSON
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white transition"
                                        onClick={() => handleExport("pdf", riskAreas)}
                                    >
                                        Exportar PDF
                                    </button>
                                </div>
                </div>
            </div>

            {selectedArea && (
                <div className="w-full md:w-1/3 bg-[#f3eded57] p-6 shadow-lg rounded-lg sticky top-6 self-start">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedArea.area.name}</h2>
                    <p className="text-gray-600 text-sm mb-4">{selectedArea.area.description}</p>

                    <div className="flex flex-row gap-4 mb-4">
                        <div className="bg-[#ccdfcf] p-4 rounded-lg shadow-lg flex-1 text-center">
                            <p className="font-bold"><strong>Espécie Recomendada:</strong></p>
                            <p className="">{selectedArea.classification ? selectedArea.classification.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase()) : "Indefinido"}</p>
                        </div>
                        <div className="bg-[#ccdfcf] p-4 rounded-lg shadow-lg flex-1 text-center">
                            <p className="font-bold"><strong>Área (m²):</strong></p>
                            <p className="">{selectedArea.area.area_in_m2}</p>
                        </div>
                    </div>
                    <p className="text-sm text-black mt-3">
                        <strong>Usuário:</strong>{" "}
                        {selectedArea.area.user_id}
                    </p>
                    <p className="text-sm text-black mt-3">
                        <strong>Criação:</strong>{" "}
                        {new Date(selectedArea.area.created_at).toLocaleString("pt-BR")}
                    </p>
                    <p className="text-sm text-black">
                        <strong>Atualização:</strong>{" "}
                        {new Date(selectedArea.area.updated_at).toLocaleString("pt-BR")}
                    </p>

                    <details className="mt-4">
                        <summary className="text-lg font-semibold text-gray-700 mb-2 cursor-pointer">
                            🔍Dados Aproximados da Área
                        </summary>
                        <hr style={{ margin: "10px 0", border: "1px solid #ccc" }} />
                        <p><strong>Tipo de Solo:</strong> {selectedArea.geospatialData.raster.solo?.valor}</p>
                        <p><strong>Temperatura:</strong> {selectedArea.geospatialData.raster.temperatura?.valor?.toFixed(2)}°C</p>
                        <p><strong>Precipitação:</strong> {selectedArea.geospatialData.raster.precipitacao?.valor?.toFixed(2)} mm</p>
                        <p><strong>Altitude:</strong> {selectedArea.geospatialData.raster.altitude?.valor?.toFixed(2)} m</p>
                        <p><strong>Drenagem:</strong> {selectedArea.geospatialData.raster.densidade_drenagem?.valor?.toFixed(2)} km/km²</p>
                        <p><strong>Declividade:</strong> {selectedArea.geospatialData.raster.declividade?.valor?.toFixed(2)}°</p>
                        <p><strong>Exposição:</strong> {selectedArea.geospatialData.raster.exposicao?.valor?.toFixed(2)}°</p>
                        <p><strong>Distância Vertical da Drenagem:</strong> {selectedArea.geospatialData.raster.distancia_vertical_drenagem?.valor?.toFixed(2)} m</p>
                        <p><strong>Cobertura Arbórea:</strong> {selectedArea.geospatialData.raster.cobertura_arborea?.valor?.toFixed(2)}%</p>
                    </details>

                    <details className="mt-4">
                        <summary className="text-lg font-semibold text-gray-700 mb-2">
                            ⚠️ Riscos Identificados
                        </summary>

                        <div className="flex flex-wrap gap-2">
                            {Object.entries(selectedArea.risks.ambientais)
                                .filter(([_, v]) => v.valor === true)
                                .map(([k]) => (
                                    <details key={k} className="bg-red-100 text-black px-2 py-1 rounded-md w-full">
                                        <summary className="cursor-pointer">
                                            🌱💧☀️ {k.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase())}
                                        </summary>
                                        <hr style={{ margin: "10px 0", border: "1px solid #ccc" }} />
                                        <p className="text-gray-600 text-s">{selectedArea.risks.ambientais[k].explicacao}</p>
                                    </details>
                                ))}
                            {Object.entries(selectedArea.risks.geologicos)
                                .filter(([_, v]) => v.valor === true)
                                .map(([k]) => (
                                    <details key={k} className="bg-yellow-100 text-black px-2 py-1 rounded-md w-full">
                                        <summary className="cursor-pointer">
                                            🪨☣️⛰️ {k.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase())}
                                        </summary>
                                        <hr style={{ margin: "10px 0", border: "1px solid #ccc" }} />
                                        <p className="text-gray-600 text-s">{selectedArea.risks.geologicos[k].explicacao}</p>
                                    </details>
                                ))}
                            {Object.entries(selectedArea.risks.biologicos)
                                .filter(([_, v]) => v.valor === true)
                                .map(([k]) => (
                                    <details key={k} className="bg-green-100 text-black px-2 py-1 rounded-md w-full">
                                        <summary className="cursor-pointer">
                                            🐛🪴⚠️ {k.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase())}
                                        </summary>
                                        <hr style={{ margin: "10px 0", border: "1px solid #ccc" }} />
                                        <p className="text-gray-600 text-s">{selectedArea.risks.biologicos[k].explicacao}</p>
                                    </details>
                                ))}
                            {Object.entries(selectedArea.risks.antrópicos)
                                .filter(([_, v]) => v.valor === true)
                                .map(([k]) => (
                                    <details key={k} className="bg-blue-100 text-black px-2 py-1 rounded-md w-full">
                                        <summary className="cursor-pointer">
                                            🏭🚱💨 {k.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase())}
                                        </summary>
                                        <hr style={{ margin: "10px 0", border: "1px solid #ccc" }} />
                                        <p className="text-gray-600 text-s">{selectedArea.risks.antrópicos[k].explicacao}</p>
                                    </details>
                                ))}
                        </div>
                    </details>

                    <details className="mt-4">
                        <summary className="text-lg font-semibold text-gray-700 mb-2">🛠️ Recomendações Gerais</summary>
                        <div className="flex flex-wrap gap-2">
                            <ul className="list-disc list-inside">
                                
                            {Object.entries(selectedArea.risks.ambientais)
                                .filter(([_, v]) => v.valor === true)
                                .map(([k]) => (
                                    <li key={`ambientais-${k}`} className="text-gray-600 text-s">
                                        {selectedArea.risks.ambientais[k as keyof AmbientalRisks].recomendacao}
                                    </li>
                                ))}
                            {Object.entries(selectedArea.risks.geologicos)
                                .filter(([_, v]) => v.valor === true)
                                .map(([k]) => (
                                    <li key={`geologicos-${k}`} className="text-gray-600 text-s">
                                        {selectedArea.risks.geologicos[k as keyof GeologicalRisks].recomendacao}
                                    </li>
                                ))}
                            {Object.entries(selectedArea.risks.biologicos)
                                .filter(([_, v]) => v.valor === true)
                                .map(([k]) => (
                                    <li key={`biologicos-${k}`} className="text-gray-600 text-s">
                                        {selectedArea.risks.biologicos[k as keyof BiologicalRisks].recomendacao}
                                    </li>
                                ))}
                            {Object.entries(selectedArea.risks.antrópicos)
                                .filter(([_, v]) => v.valor === true)
                                .map(([k]) => (
                                    <li key={`antrópicos-${k}`} className="text-gray-600 text-s">
                                        {selectedArea.risks.antrópicos[k as keyof AnthropogenicRisks].recomendacao}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </details>
                    <div className="flex flex-row gap-4 mb-4 items-bottom mt-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <button
                                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                                    onClick={(e) => {
                                        const dropdown = e.currentTarget.nextElementSibling as HTMLElement;
                                        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
                                    }}
                                >
                                    📥 Exportar Relatório
                                </button>
                                <div
                                    className="absolute bg-white border border-gray-300 rounded shadow-lg mt-2 w-48"
                                    style={{ display: "none" }}
                                >
                                    <button
                                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white transition"
                                        onClick={() => handleExport("csv", selectedArea)}
                                    >
                                        Exportar CSV
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white transition"
                                        onClick={() => handleExport("json", selectedArea)}
                                    >
                                        Exportar JSON
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white transition"
                                        onClick={() => handleExport("pdf", selectedArea)}
                                    >
                                        Exportar PDF
                                    </button>
                                </div>
                            </div>
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
                                onClick={() => setSelectedArea(null)}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

};

export default RiskAreas;
