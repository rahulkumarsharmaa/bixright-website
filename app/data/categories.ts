export interface CategoryItem {
  _id?: string;
  name: string;
  image: string;
  href?: string;
  slug: string;
  parent?: string;
  categoryId?: string;
  subCategoryId?: string;
  subCategoryName?: string;
  categoryName?: string;
}

const categories: CategoryItem[] = [
  {
    _id: "692306676db53694aea1c4d3",
    name: "Earrings",
    image:
      "https://images.unsplash.com/photo-1693212793204-bcea856c75fe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RWFycmluZ3N8ZW58MHx8MHx8fDI%3D",
    slug: "earrings",
    parent: "Accessories",
    categoryId: "691306676db53694aea1c4e2",
    subCategoryId: "691ae7dd24bc57e47af7201c",
    subCategoryName: "Jewelry",
    categoryName: "Accessories",
  },
  {
    _id: "692306676db53694aea1c4d4",
    name: "Handbags",
    image:
      "https://images.unsplash.com/photo-1682745230951-8a5aa9a474a0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGFuZGJhZ3xlbnwwfHwwfHx8Mg%3D%3D",
    slug: "handbags",
    parent: "Accessories",
    categoryId: "691306676db53694aea1c4e2",
    subCategoryId: "691ae7dd24bc57e47af7201d",
    subCategoryName: "Bags",
    categoryName: "Accessories",
  },
  {
    _id: "692306676db53694aea1c4d5",
    name: "Footwear",
    image:
      "https://images.unsplash.com/photo-1588361861040-ac9b1018f6d5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vdHdlYXJ8ZW58MHx8MHx8fDI%3D",
    slug: "footwear",
    parent: "Accessories",
    categoryId: "691306676db53694aea1c4e2",
    subCategoryId: "691ae7dd24bc57e47af7201e",
    subCategoryName: "Shoes",
    categoryName: "Accessories",
  },

  // Home & Decor
  {
    _id: "692306676db53694aea1c4e1",
    name: "Wall Hangings",
    image:
      "https://images.unsplash.com/photo-1632761644913-0da6105863cb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8V2FsbCUyMEhhbmdpbmdzfGVufDB8fDB8fHwy",
    slug: "wall-hangings",
    parent: "Home Decor",
    categoryId: "691306676db53694aea1c4e3",
    subCategoryId: "691ae7dd24bc57e47af7201f",
    subCategoryName: "Decor",
    categoryName: "Home",
  },
];

export default categories;
