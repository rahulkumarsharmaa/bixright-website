export interface ProductImage {
  _id: string;
  imageUrl: string;
  imageId: string;
  isCover: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  _id: string;
  sku: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
  image: string;
  status: string;
  variantId: string;
  discountedPrice: number;
  discount?: number;
}

export interface Product {
  _id: string;
  title: string;
  subTitle: string;
  description: string;
  basePrice: number;
  price: number;
  discount: number;
  discountedPrice?: number | "undefined";
  categoryId?: string;
  categorySlug: string;
  categoryName?: string;
  subCategoryId?: string;
  subCategoryName?: string;
  sizeId?: string;
  sizeName?: string;
  brandId?: string;
  brandName?: string | "undefined";
  quantity: number;
  images: ProductImage[];
  features: string[];
  specifications: Record<string, string>;
  status?: string;
  isVisible?: boolean;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stock?: number;
  originalPrice: number;
  variants: ProductVariant[];
  variantId: string;
  color: string;
  size: string;
}

export type Option = {
  id: string;
  name: string;
};

export type priceOption = {
  min: number;
  max: number;
};

export type FilterOptions = {
  size: Option[];
  color: Option[];
  brand: Option[];
  price: priceOption;
};

export interface OrderProduct {
  variantId: string;
  quantity: number;
  title: string;
  price: number;
  image: string;
  total: number;
  color?: string;
  size?: string;
  productId: string;
}

export interface Address {
  fullName?: string;
  street?: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface Order {
  _id: string;
  orderId: string;
  products: OrderProduct[];
  billingAddress: Address;
  shippingAddress: Address;
  paymentMethod: string;
  totalAmount: number;
  createdAt: string;
  orderStatus: string;
  startDeliveryDate?: string;
  endDeliveryDate?: string;
  deliveryDate?: string;
  courierCompany?: string;
  trackingNumber?: string;
  isPaid?: boolean;
}
export interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

export interface ShippingErrors {
  [key: string]: string;
}
