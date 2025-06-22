import { Either, right } from '@/core/either';
import { Product } from '@/domain/marketplace/enterprise/entities/product';
import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products-repository';

type FetchRecentProductsUseCaseResponse = Either<
  null,
  {
    products: Product[];
  }
>;

@Injectable()
export class FetchRecentProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute(): Promise<FetchRecentProductsUseCaseResponse> {
    const products = await this.productsRepository.findManyRecent();
    return right({
      products,
    });
  }
}
