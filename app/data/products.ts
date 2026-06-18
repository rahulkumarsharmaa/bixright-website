export interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
  categorySlug: string;
}

export const allProducts: Product[] = [
  {
    id: "1",
    title: "Pink Anarkali",
    image: "/products/pink-anarkali.jpg",
    price: 2999,
    categorySlug: "anarkalis",
  },
  {
    id: "2",
    title: "gray Sari",
    image: "/products/gray-sari.jpg",
    price: 4599,
    categorySlug: "saris",
  },
  {
    id: "3",
    title: "Gold Kurta",
    image: "/products/gold-kurta.jpg",
    price: 1999,
    categorySlug: "kurtas",
  },
];

export default allProducts;
