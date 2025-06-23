import { Product } from '@/domain/marketplace/enterprise/entities/product';

export class ProductPresenter {
  static toHTTP(product: Product) {
    return {
      id: product.id.toString(),
      title: product.title,
      createdAt: product.createdAt,
    };
  }
}
