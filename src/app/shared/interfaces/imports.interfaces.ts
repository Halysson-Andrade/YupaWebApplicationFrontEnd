export interface ApiImportResponse {
  data: {
    ali_id: number;
    ali_status: number;
    ali_start_date: string;
    ali_end_date: string;
    ali_comp: string;
  }[];
}

export interface ImportsData {
  'ID': number;
  'Status': number;
  'Início período de ponto': string;
  'Fim período de ponto': string;
  'Competência': string;
}