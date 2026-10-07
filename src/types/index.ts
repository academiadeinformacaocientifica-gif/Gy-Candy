export type CategoryId =
  | 'todos'
  | 'tipicos'
  | 'internacionais'
  | 'arroz_massas'
  | 'entradas'
  | 'sopas'
  | 'guarnicoes'
  | 'bebidas'
  | 'sobremesas_vinhos';

export interface Dish {
  id: string;
  name: string;
  category: CategoryId;
  categoryLabel: string;
  description: string;
  price: number; // in Kwanza (Kz)
  prepTime: string;
  badge?: string; // e.g. "Especialidade", "Chef", "Prato do Dia"
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  availableAccompaniments: string[];
  spiceLevels: string[];
}

export interface CartItem {
  cartItemId: string;
  dish: Dish;
  quantity: number;
  selectedAccompaniment: string;
  spicyLevel: string;
  notes: string;
  itemTotal: number;
}

export interface BairroLuanda {
  id: string;
  name: string;
  deliveryFee: number; // in Kz
  estimatedTimeMin: string;
  zone: 'Centro' | 'Sul' | 'Litoral' | 'Norte';
}

export type PaymentMethodId = 'mcx' | 'tpa' | 'dinheiro' | 'transferencia';

export interface PaymentMethodOption {
  id: PaymentMethodId;
  name: string;
  description: string;
  iconName: string;
}

export type OrderStatus = 'confirmado' | 'preparando' | 'em_transito' | 'entregue';

export interface CourierInfo {
  name: string;
  phone: string;
  vehicle: string;
  plate: string;
  rating: number;
  photoUrl: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  packagingFee: number;
  total: number;
  bairro: BairroLuanda;
  streetAddress: string;
  referencePoint: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: PaymentMethodId;
  status: OrderStatus;
  statusUpdatedAt: string;
  estimatedArrivalMinutes: number;
  courier: CourierInfo;
}
