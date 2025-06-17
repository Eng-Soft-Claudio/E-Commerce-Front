// Este tipo representa um produto como ele vem da nossa API
export interface Product {
  id: number;
  name: string;
  image_url: string | null;
  price: number;
  description: string | null;
  category: {
    id: number;
    title: string;
  };
}