export interface ApiResponse {
  data: {
    aut_id: number;
    aut_name: string;
    aut_fifth_string_params: string;
  }[];
}

export interface AutomarionData {
  'ID': number;
  'Nome automacao': string;
  'params': string;
}

export interface ApiCompanieResponse {
  data: {
    cmp_id: number;
    cmp_system_code: string;
    cmp_name: string;
    cmp_cnpj: string;
    cmp_uf: string;
    cmp_cei: string;
    cmp_docs_path: string;
    cmp_zip_code: string;
    cmp_address: string;
    cmp_neighborhood: string;
    cmp_city: string;
    cmp_number: string;
    cmp_ecac_subject: string;
    cmp_ecac_issuer: string;
    cmp_ecac_serial: string;
    automations: []
  }[];
}

export interface CompanieData {
  cmp_id: number;
  cmp_system_code: string;
  cmp_name: string;
  cmp_cnpj: string;
  cmp_uf: string;
  cmp_cei: string;
  cmp_docs_path: string;
  cmp_zip_code: string;
  cmp_address: string;
  cmp_neighborhood: string;
  cmp_city: string;
  cmp_number: string;
  cmp_ecac_subject: string;
  cmp_ecac_issuer: string;
  cmp_ecac_serial: string;
  automations: []
}