export interface SystemResponse {
  data: {
    sys_id: number;
    sys_name: string;
    sys_description: string;
    sys_status: boolean;
    sys_credential: string;
    sys_secret: string;
    sys_url: string;
    sys_security: string;
    sys_path: string;
    sys_created_at: string;
    sys_updated_at: string;
  }[];
}

export interface Data {
  'ID': number;
  'Status': boolean;
  'Nome': string;
  'Descrição': string;
  'Credencial': string;
  'Secret': string;
  'URL': string;
  'Segurança': string;
  'Pasta': string;
  'Data criação': string;
  'Data atualização': string;
}

export interface PostCreateSystem {
  sys_name: string;
  sys_description: string;
  sys_status: boolean;
  sys_credential: string;
  sys_secret: string;
  sys_url: string;
  sys_security: string;
  sys_path: string;
}