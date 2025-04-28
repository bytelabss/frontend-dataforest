import { JSX, useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLng, LatLngBounds } from "leaflet";
import "./styles.css";
import { a } from "framer-motion/client";

export default function Map(): JSX.Element {
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

    interface RasterData{
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
    }

    interface GeospatialData {
        id: string;
        geom: string;
        raster: Raster;
    }

    const [areas, setAreas] = useState<ReforestedArea[]>([]);
    const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
    const [classificationResult, setClassificationResult] = useState<any>(null);
    const [strategyResult, setStrategyResult] = useState<any>(null);

    useEffect(() => {
        const getAreas = async () => {
            const areasData = await fetchReforestedAreas();
            if (areasData.length > 0) {
                setAreas(areasData);
            } else {
                console.log("Nenhuma área foi recebida ou os dados estão vazios.");
            }
        };

        getAreas();
    }, []);

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
        console.log("Fetch body:", area.geom.coordinates[0].map(coord => [coord[1], coord[0]]));
        try {
            const response = await fetch("http://127.0.0.1:5000/geospatial_data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
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
        }
        catch (error) {
            console.error(error);
            return null;
        }
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
            setClassificationResult(data);
        } catch (error) {
            console.error(error);
        }
    };

    const predictStrategy = async (area: GeospatialData) => {
        try {
            const payload = {
                temperatura: area.raster["temperatura"]?.["valor"] || 0,
                precipitacao: area.raster["precipitacao"]?.["valor"] || 0,
                altitude: area.raster["altitude"]?.["valor"] || 0,
                declividade: area.raster["altitude"]?.["valor"] || 0,
                exposicao: area.raster["altitude"]?.["valor"] || 0,
                distancia_vertical_drenagem: area.raster["altitude"]?.["valor"] || 0,
                densidade_drenagem: area.raster["altitude"]?.["valor"] || 0,
                cobertura_arborea: area.raster["altitude"]?.["valor"] || 0,
            };

            const response = await fetch("http://127.0.0.1:5000/prever-estrategia", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Erro ao prever a estratégia");
            }

            const data = await response.json();
            setStrategyResult(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handlePolygonClick = (area: ReforestedArea) => {
        setSelectedAreaId(area.id);
        fetchReforestedAreaData(area)
            .then((data) => {
                if (data) {
                    classifyArea(data);
                    predictStrategy(data);
                }
            })
            .catch((error) => console.error("Erro ao buscar dados geoespaciais:", error));
    };

    const pontoInicial = new LatLng(-3.8376309530695285, -63.90355421315689);

    const blackOptions = { color: "black" };

    return (
        <MapContainer
            center={pontoInicial}
            zoom={13}
            scrollWheelZoom={true}
            className="map-container"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {areas.map((area) => {
                const coordinates = area.geom.coordinates[0].map(
                    (coord) => new LatLng(coord[0], coord[1])
                );

                return (
                    <Polygon
                        key={area.id}
                        positions={coordinates}
                        pathOptions={blackOptions}
                        eventHandlers={{
                            click: () => handlePolygonClick(area),
                        }}
                    >
                        <Popup
                            closeOnClick={true}
                            autoClose={true}
                            open={selectedAreaId === area.id}
                        >
                            <div>
                                <h3 align="center">{area.name}</h3>
                                <p>
                                    <strong>Descrição:</strong> {area.description}
                                </p>
                                <p>
                                    <strong>Área:</strong> {area.area_in_m2} m²
                                </p>
                                <hr style={{ margin: "10px 0", border: "1px solid #ccc" }} />
                                {classificationResult && (
                                    <div>
                                        <h4 align="center">Classificação</h4>
                                        <p>
                                            <strong>Cluster:</strong> {classificationResult.cluster}
                                        </p>
                                        <p>
                                            <strong>Espécie:</strong>{" "}
                                            {classificationResult.species
                                                ?.toLowerCase()
                                                .replace(/\b\w/g, (char) => char.toUpperCase())}

                                        </p>
                                    </div>
                                )}
                                <hr style={{ margin: "10px 0", border: "1px solid #ccc" }} />
                                {strategyResult && (
                                    <div>
                                        <h4 align="center">Estratégia</h4>
                                        <p>
                                            <strong>Estratégia:</strong>{" "}
                                                {strategyResult.estrategia_prevista
                                                ?.toLowerCase()
                                                .replace(/_/g, " ")
                                                .replace(/\b\w/g, (char) => char.toUpperCase())}

                                        </p>
                                        <p>
                                            <strong>Justificativa:</strong>{" "}
                                            {strategyResult.justificativa}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </Polygon>
                );
            })}
        </MapContainer>
    );
}