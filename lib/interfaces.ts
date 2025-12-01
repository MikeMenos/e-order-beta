export interface ClientResponse {
  success: boolean;
  count: number;
  data: IStoreInfo[];
}

export interface IStoreInfo {
  TRDR: string;
  KEY_CODE: string;
  BRANCH: string;
  TYPOS: string;
  BRANCHES: string;
  NAME: string;
  AFM: string;
  ADDRESS: string;
  DISTRICT?: string;
  CITY: string;
  ZIP: string;
  PIN_A: string;
  PIN_B: string;
  PAYMENT?: string;
}

export interface IFamilyCategories {
  FAMILY: string;
}

export interface IProductItem {
  SUPPLIER: string;
  ITEMUID: string;
  CODE: string;
  FULL_DESCRIPTION: string;
  TITLE: string;
  DESCRIPTION: string;
  PRICE_PER_MU1: string;
  INVOICE_UNIT: string;
  ORDER_UNIT: string;
  SXESI: string;
  MANUFACTOR: string;
  CATEGORY: string;
  MARKA: string;
  FAMILY: string;
  IMAGE?: string;
  FAV: string;
}

export interface ICartProductItem {
  FINDOC: string;
  TRDR: string;
  BRANCH: string;
  MTRL: string;
  Qty1: string;
  Qty2: string;

  SUPPLIER: string;
  CODE: string;
  FULL_DESCRIPTION: string;
  TITLE: string;
  DESCRIPTION: string;
  PRICE_PER_MU1: string;
  INVOICE_UNIT: string;
  ORDER_UNIT: string;
  SXESI: string;
  MANUFACTOR: string;
  CATEGORY: string;
  IMAGE: string;
  MARKA: string;
  FAMILY: string;
}

export interface IProductInBasket {
  FINDOC: string;
  TRDR: string;
  BRANCH: string;
  MTRL: string;
  Qty1: string;
  Qty2: string;
  SXESI: string;
}

export interface ICart {
  success: boolean;
  count: number;
  data: IProductInBasket[];
}

export interface SalDocEntry {
  SERIES: string;
  TRDR: number;
  TRDBRANCH: number;
  PAYMENT: number;
  TRUCKS: number;
  DELIVDATE: string;
  COMMENTS: string;
  REMARKS: string;
}

export interface MtrDocEntry {
  TRUCKS: number;
  DELIVDATE: string;
}

export interface IteLineEntry {
  MTRL: number;
  QTY2: number;
}

export interface SophiaDataPayload {
  SALDOC: SalDocEntry[];
  MTRDOC: MtrDocEntry[];
  ITELINES: IteLineEntry[];
}

export interface AddToCartPayload {
  service: "setData";
  clientID: string;
  appId: string;
  OBJECT: "SALDOC";
  KEY: string;
  data: SophiaDataPayload;
}
