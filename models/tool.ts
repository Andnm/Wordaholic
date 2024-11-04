export interface BuyItem {
  item_id: string;
  quantity: number;
}

export type BuyStamina = Omit<BuyItem, "item_id">;

export interface ItemType {
  _id: string;
  item_name: string;
  price: string;
  type: string;
  description: string;
}

export interface ToolType {
  item_id: ItemType;
  quantity: number;
}
