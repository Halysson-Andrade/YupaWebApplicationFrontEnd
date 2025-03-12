export interface ApiDocumentsResponse {
  data: {
    doc_id: number;
    uf_code: string;
    doc_name: string;
    doc_description: string;
    doc_type: number;
  }[];
}

export interface DocumentsData {
  'ID': number;
  'UF': string;
  'Nome do documento': string;
  'Descrição': string;
  'Tipo': number;
}

export interface PostCreateDocuments {
  doc_id: number;
  uf_code: string;
  doc_name: string;
  doc_description: string;
  doc_type: number;
}