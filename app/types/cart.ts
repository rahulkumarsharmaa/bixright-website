export interface CartItemType {
  _id: string;
  productId: string;
  title: string;
  price: number;
  discountedPrice:number;
  images: Array<{
    imageUrl: string;
    imageId: string;
    isCover: boolean;
    sortOrder: number;
    _id: string;
  }>;
  image: string;
  brandName: string;
  subTitle?: string;
  stock?: number;
  variantId?: string;
  color: string;
  size: string;
  quantity: number;
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
