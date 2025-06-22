import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { NotAllowedError } from '../../../../core/errors/not-allowed-error';
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error';
import { Product, ProductStatus } from '../../enterprise/entities/product';
import { ProductAttachmentsRepository } from '../repositories/product-attachments-repository';
import { ProductsRepository } from '../repositories/products-repository';

interface EditProductStatusUseCaseRequest {
  ownerId: string;
  productId: string;
  status: string;
}

type EditProductStatusUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    product: Product;
  }
>;

@Injectable()
export class EditProductStatusUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private productAttachmentsRepository: ProductAttachmentsRepository,
  ) {}

  async execute({
    ownerId,
    productId,
    status,
  }: EditProductStatusUseCaseRequest): Promise<EditProductStatusUseCaseResponse> {
    const product = await this.productsRepository.findById(productId);
    if (!product) {
      return left(new ResourceNotFoundError());
    }
    if (ownerId !== product.ownerId.toString()) {
      return left(new NotAllowedError());
    }

    product.status = status as ProductStatus;
    await this.productsRepository.save(product);
    return right({
      product,
    });
  }
}
