import { Product } from '../../enterprise/entities/product';
import { ProductDetails } from '../../enterprise/entities/value-objects/product-details';

export abstract class ProductsRepository {
  abstract findById(id: string): Promise<Product | null>;
  abstract findDetailsById(id: string): Promise<ProductDetails | null>;
  abstract findManyRecent(): Promise<ProductDetails[]>;
  abstract findManyByOwner(ownerId: string): Promise<ProductDetails[]>;
  abstract save(product: Product): Promise<void>;
  abstract create(product: Product): Promise<void>;
  abstract delete(product: Product): Promise<void>;
}
