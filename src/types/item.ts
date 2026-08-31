import { Paging } from "./pagination";

export declare interface ItemView {
    id: string;
    name: string;
    notes: string;
    stock: number;
    sent: number;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    createName: string;
    updateName: string;
}



export declare interface PageItem extends Paging {
  name?: string;
  notes?: string;
  startStock?: number | string;
  endStock?: number | string;
  startSent?: number | string;
  endSent?: number | string;
  startCreateDt?: string | DateConstructor;
  endCreateDt?: string | DateConstructor;
  createName?: string;
  search?: string;
  preloads?: string;
}

export declare interface CreateItem {
  name: string;
  notes: string;
}

export declare interface UpdateItem {
  name: string;
  notes: string;
}