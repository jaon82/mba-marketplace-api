import { Either, right } from '@/core/either';
import { Product } from '@/domain/marketplace/enterprise/entities/product';
import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products-repository';

type FetchProductsByOwnerUseCaseResponse = Either<
  null,
  {
    products: Product[];
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
