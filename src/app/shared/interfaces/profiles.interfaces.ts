export interface ProfileResponse {
  data: {
    prf_id: number;
    prf_name: string;
    prf_description: string;
    prf_status: boolean;
    prf_created_at: string;
    prf_updated_at: string;
  }[];
}

export interface ProfileData {
  'ID': number;
  'Status': boolean;
  'Nome': string;
  'Descrição': string;
  'Data criação': string;
  'Data atualização': string;
}

export interface PostCreateSystem {
  prf_name: string;
  prf_description: string;
  prf_status: boolean;
  prf_created_at: string;
  prf_updated_at: string;
}