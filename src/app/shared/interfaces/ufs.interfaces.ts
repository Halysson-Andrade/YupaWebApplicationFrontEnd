export interface ApiUfResponse {
  data: {
    uf_id: number;
    uf_code: string;
    uf_state: boolean;
    uf_name: string;
    uf_ibge_code: string;
    uf_region: string;
  }[];
}

export interface UfData {
  'ID': number;
  'UF': string;
  'Status': boolean;
  'Nome': string;
  'IBGE': string;
  'Região': string;
}

export interface PostCreateUF {
  uf_code: string;
  uf_state: boolean;
  uf_name: string;
  uf_ibge_code: string;
  uf_region: string;
}