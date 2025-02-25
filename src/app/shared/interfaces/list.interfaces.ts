export interface ApiListResponse {
  data: {
    impd_id: number;
    imp_id: number;
    car_plate: string;
    impd_status: number;
    impd_start_date: string;
    impd_target_date: string;
    impd_complete_kit: boolean;
    impd_restrition: boolean;
    impd_debit: boolean;
    impd_sale_com: boolean;
    impd_vistory_complete: boolean;
    impd_saler_pending: boolean;
    impd_crlv_avaible: boolean;
    impd_plate_change: boolean;
    impd_fineshed:boolean;
    impd_lote:string;
    impd_uf_transfer:string
  }[];
}

export interface ListData {
  'Status': number;
  'ID_importação': number;
  'Placa do Carro': string;
  'Lote':string;
  'Tranferencia UF ':string
  'Data Inicio': string;
  'Previsao de Conclusao ': string;
  'Kit doc Completo': boolean;
  'Restricoes': boolean;
  'Debitos Veiculares': boolean;
  'Comunicacao de Venda': boolean;
  'Vistoria Veicular': boolean;
  'Pendencias Comprador': boolean;
  'CRLV-e Disponível': boolean;
  'Trocar Placa': boolean;
}
