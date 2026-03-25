export type ProductStatus = "available" | "reserved" | "sold";

export type ProductCategory =
  | "iphone"
  | "ipad"
  | "macbook"
  | "imac"
  | "apple-watch"
  | "airpods"
  | "accessories";

export type ProductSpecification = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;

  // legacy compatibility field on transition stage
  images: string[];

  mainImage: string;
  galleryImages: string[];
  specifications: ProductSpecification[];
  description: string;

  isVisible: boolean;

  brand?: string;
  model?: string;
  condition?: string;
  storage?: string;
  color?: string;
  oldPrice?: number;
  isFeatured?: boolean;
  status?: ProductStatus;

  createdAt?: string;
  updatedAt?: string;
};