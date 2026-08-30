export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string | null;
  color?: string | null;
  availableSizes?: string[] | null;
  availableColors?: string[] | null;
}
