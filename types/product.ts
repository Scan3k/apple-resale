export type ProductStatus = "available" | "reserved" | "sold";

export type ProductCategory =
  | "iphone"
  | "ipad"
  | "macbook"
  | "imac"
  | "apple-watch"
  | "airpods"
  | "accessories";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  images: string[];
  isVisible: boolean;

  brand?: string;
  model?: string;
  description?: string;
  condition?: string;
  storage?: string;
  color?: string;
  oldPrice?: number;
  isFeatured?: boolean;
  status?: ProductStatus;

  createdAt?: string;
  updatedAt?: string;
};