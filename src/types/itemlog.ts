import { ItemView } from "./item";
import { Paging } from "./pagination";


export declare interface ItemlogView {
  id: string;
  itemId: string;
  type: string; // STOCK | SENT
  notes: string;
  quantity: number;
  createBy: string;
  createDt: string;
  updateBy: string;
  updateDt: string;
  deleteDt: string;
  companyName: string;
  itemName: string;
  createName: string;
  updateName: string;
  item?: ItemView;
}

export declare interface PageItemlog extends Paging {
  itemId?: string;
  notes?: string;
  type?: string;
  startQuantity?: number | string;
  endQuantity?: number | string;
  startCreateDt?: string | DateConstructor;
  endCreateDt?: string | DateConstructor;
  createName?: string;
  itemName?: string;
  search?: string;
  preloads?: string;
}

export declare interface CreateItemlog {
  itemId: string;
  type: string;
  notes: string;
  quantity: string | number;
}