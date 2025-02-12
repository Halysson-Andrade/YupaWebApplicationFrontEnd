export interface ApiResponse {
  data: {
    usr_id: number;
    usr_email: string;
    usr_profile: number;
    usr_name: string;
    usr_ad: string;
    usr_protheus: string;
    usr_sucessFactory: string;
    usr_sap: string;
    usr_vpn: string;
    usr_status: boolean;
    permissions: [];
    systems: [];
  }[];
}

export interface UserData {
  'ID': number;
  'Perfil': number;
  'Email': string;
  'Nome': string;
  'usr_ad': string;
  'usr_protheus': string;
  'usr_sucessFactory': string;
  'usr_sap': string;
  'usr_vpn': string;
  'Status': boolean;
  'Pemissoes': [];
  'Systems': [];
}

export interface PermissionApiResponse {
  data: {
    pms_id: number;
    pms_action: string;
    pms_description: string;
    pms_status: boolean;
    pms_status_mnu: number;
  }[];
}

export interface PermissionData {
  'ID': number;
  'Ação': string;
  'Descrição': string;
  'Status': boolean;
  'Menu': number;
}

export interface PostCreateUser {
  usr_email: string;
  usr_ad: string;
  usr_sucessFactory: string;
  usr_protheus: string;
  usr_sap: string;
  usr_vpn: string;
  usr_profile: string;
  usr_name: string;
  usr_status: boolean;
  pms_id: number[]; // Atualizado para ser um array de números
  sys_id: number[]; // Atualizado para ser um array de números
}