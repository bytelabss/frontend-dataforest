export enum SelectedPage {
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