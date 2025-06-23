import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ProductDetails } from '../../enterprise/entities/value-objects/product-details';
import { ProductsRepository } from '../repositories/products-repository';

type FetchProductsByOwnerUseCaseResponse = Either<
  null,
  {
    products: ProductDetails[];
  }
>;

@Injectable()
export class FetchProductsByOwnerUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute(ownerId: string): Promise<FetchProductsByOwnerUseCaseResponse> {
    const products = await this.productsRepository.findManyByOwner(ownerId);
    return right({
      products,
    });
  }
}
