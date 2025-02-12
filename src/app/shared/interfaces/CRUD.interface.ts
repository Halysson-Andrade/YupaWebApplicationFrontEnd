export interface CRUDInterface {
  theme?: string;
  page?: string;
  modal?:string
  token?:string
  environment?: string;
  apiRoute?: string;
  customSettings?: {
    enableLogging?: boolean;
    dateFormat?: string;
  };

}