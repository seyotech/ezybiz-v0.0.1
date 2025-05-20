export interface Product {
    id: number;
    title: string;
    price?: number;
    description: string;
    category?: string;
    images?: string;
    thumbnail: string;
    count?: number = 0;
}
export interface Products {
    products: Product[];
}
export interface ProductResponce {
    products: Product[{category: ProductCategory}];
    limit: number;
    skip: number;
    total: number;
}
export interface ProductCategories {
    slug: string;
    name: string;
    url: string;
}
export interface ProductCategory {
    category: string;
}

export interface User {
    // id: number;
    username: string;
    email?: string;
    token: string;
  }
export interface IParams {
    query?: string;
    limit: number;
    skip: number;
    sortOrder: string;
  }