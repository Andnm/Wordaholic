export interface BuyItem {
  item_id: string;
  quantity: number;
}

export type BuyStamina = Omit<BuyItem, 'item_id'>;
