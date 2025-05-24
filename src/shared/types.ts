export enum SelectedPage {
  Home = "home",
  Dashboard = "dashboard",
  CadastrarDados = "cadastrardados",
  Monitoramento = "monitoramento",
  Predicao = "predicao",
  SignIn = "SignIn"
}

export interface Geometry {
  type: string;
  coordinates: number[][][];
}

export interface ReforestedArea {
  id: string;
  name: string;
  description: string;
  area_in_m2: number;
  geom: Geometry;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface RasterData{
  valor: number;
  medida: string;
}

export interface Raster {
  temperatura?: RasterData;
  precipitacao?: RasterData;
  altitude?: RasterData;
  declividade?: RasterData;
  exposicao?: RasterData;
  distancia_vertical_drenagem?: RasterData;
  densidade_drenagem?: RasterData;
  cobertura_arborea?: RasterData;
}

export interface GeospatialData {
  id: string;
  geom: string;
  raster: Raster;
}

export type ClassificationResult = 'pinha' | 'eucalipto';
export type PredictionResult = 'mecanizacao' | 'reflorestamento_natural' | 'intensiva_irrigacao' | 'fertilizacao_alta';

export interface ClassificationResponse {
  cluster: number;
  mensagem: string;
  species: ClassificationResult; // 'pinheiro' | 'eucalipto'
}


export interface PredictionResponse {
  estrategia_prevista: PredictionResult;
  justificativa: string;
  eucalipto: string;
  pinha: string;
  adubacao: string;
}
