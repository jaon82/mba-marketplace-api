import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Product } from '@/domain/marketplace/enterprise/entities/product';
import { Injectable } from '@nestjs/common';
import { ProductAttachment } from '../../enterprise/entities/product-attachment';
import { ProductAttachmentList } from '../../enterprise/entities/product-attachment-list';
import { AttachmentsRepository } from '../repositories/attachments-repository';
import { CategoriesRepository } from '../repositories/categories-repository';
import { ProductsRepository } from '../repositories/products-repository';
import { UsersRepository } from '../repositories/users-repository';

interface CreateProductUseCaseRequest {
  title: string;
  description: string;
  priceInCents: number;
  attachmentsIds: string[];
  categoryId: string;
  ownerId: string;
}

type CreateProductUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    product: Product;
  }
>;

@Injectable()
export class CreateProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private usersRepository: UsersRepository,
    private categoriesRepository: CategoriesRepository,
    private attachmentsRepository: AttachmentsRepository,
  ) {}
  async execute({
    title,
    description,
    priceInCents,
    attachmentsIds,
    ownerId,
    categoryId,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const user = await this.usersRepository.findById(ownerId);
    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const category = await this.categoriesRepository.findById(categoryId);
    if (!category) {
      return left(new ResourceNotFoundError());
    }

    const product = Product.create({
      ownerId: new UniqueEntityID(ownerId),
      categoryId: new UniqueEntityID(categoryId),
      title,
      description,
      priceInCents,
    });

    for (const attachmentId of attachmentsIds) {
      const attachment =
        await this.attachmentsRepository.findById(attachmentId);
      if (!attachment) {
        return left(new ResourceNotFoundError());
      }
    }
    const productAttachments = attachmentsIds.map((attachmentId) => {
      return ProductAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        productId: product.id,
      });
    });
    product.attachments = new ProductAttachmentList(productAttachments);

    await this.productsRepository.create(product);
    return right({
      product,
    });
  }
}
