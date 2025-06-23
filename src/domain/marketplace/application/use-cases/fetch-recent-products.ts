import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ProductDetails } from '../../enterprise/entities/value-objects/product-details';
import { ProductsRepository } from '../repositories/products-repository';

type FetchRecentProductsUseCaseResponse = Either<
  null,
  {
    products: ProductDetails[];
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
