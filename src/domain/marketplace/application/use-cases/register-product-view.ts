import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error';
import { View } from '../../enterprise/entities/view';
import { ProductsRepository } from '../repositories/products-repository';
import { UsersRepository } from '../repositories/users-repository';
import { ViewsRepository } from '../repositories/view-repository';

interface RegisterProductViewUseCaseRequest {
  viewerId: string;
  productId: string;
}

type RegisterProductViewUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    view: View;
  }
>;

@Injectable()
export class RegisterProductViewUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private usersRepository: UsersRepository,
    private viewersRepository: ViewsRepository,
  ) {}

  async execute({
    viewerId,
    productId,
  }: RegisterProductViewUseCaseRequest): Promise<RegisterProductViewUseCaseResponse> {
    const product = await this.productsRepository.findDetailsById(productId);
    if (!product) {
      return left(new ResourceNotFoundError());
    }
    const viewer = await this.usersRepository.findById(viewerId);
    if (!viewer) {
      return left(new ResourceNotFoundError());
    }
    const view = View.create({
      viewer: viewer,
      product: product,
    });
    await this.viewersRepository.create(view);
    return right({
      view,
    });
  }
}
