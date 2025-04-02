import { JSX, useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLng, LatLngBounds } from "leaflet";
import './styles.css';

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

  const [areas, setAreas] = useState<ReforestedArea[]>([]);

  useEffect(() => {
    const getAreas = async () => {
      const areasData = await fetchReforestedAreas();
      console.log("areasData : " + areasData);
      if (areasData.length > 0) {
        setAreas(areasData);  
        console.log('Estado atualizado com as áreas:', areasData);  
      } else {
        console.log('Nenhuma área foi recebida ou os dados estão vazios.');
      }
    };

    getAreas();
    
  }, []);
  
  const fetchReforestedAreas = async (): Promise<ReforestedArea[]> => {
    try {
      const response = await fetch('http://127.0.0.1:5000/reforested_areas');
      
      if (!response.ok) {
        throw new Error('Erro ao buscar as áreas reflorestadas');
      }
      
      const data: ReforestedArea[] = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const pontoInicial = new LatLng(-3.8376309530695285, -63.90355421315689);

  const blackOptions = { color: 'black' };

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
        const coordinates = area.geom.coordinates[0].map(coord => new LatLng(coord[0], coord[1])); // [latitude, longitude]
        
        console.log("Coordenadas para poligono: " + coordinates);

        const polygonBounds = new LatLngBounds(coordinates);
        const center = polygonBounds.getCenter();

        return (
          <Polygon key={area.id} positions={coordinates} pathOptions={blackOptions}>
            <Popup position={center}>
              <div>
                <h3>{area.name}</h3>
                <p><strong>Descrição:</strong> {area.description}</p>
                <p><strong>Área:</strong> {area.area_in_m2} m²</p>
              </div>
            </Popup>
          </Polygon>
        );
      })}
    </MapContainer>
  );
}
