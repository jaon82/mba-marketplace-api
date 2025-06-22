import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { NotAllowedError } from '../../../../core/errors/not-allowed-error';
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error';
import { Product, ProductStatus } from '../../enterprise/entities/product';

import { ProductAttachment } from '../../enterprise/entities/product-attachment';
import { ProductAttachmentList } from '../../enterprise/entities/product-attachment-list';
import { AttachmentsRepository } from '../repositories/attachments-repository';
import { CategoriesRepository } from '../repositories/categories-repository';
import { ProductAttachmentsRepository } from '../repositories/product-attachments-repository';
import { ProductsRepository } from '../repositories/products-repository';
import { UsersRepository } from '../repositories/users-repository';

interface EditProductUseCaseRequest {
  productId: string;
  title: string;
  description: string;
  priceInCents: number;
  attachmentsIds: string[];
  categoryId: string;
  ownerId: string;
}

type EditProductUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    product: Product;
  }
>;

@Injectable()
export class EditProductUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private productAttachmentsRepository: ProductAttachmentsRepository,
    private usersRepository: UsersRepository,
    private categoriesRepository: CategoriesRepository,
    private attachmentsRepository: AttachmentsRepository,
  ) {}

  async execute({
    productId,
    title,
    description,
    priceInCents,
    attachmentsIds,
    categoryId,
    ownerId,
  }: EditProductUseCaseRequest): Promise<EditProductUseCaseResponse> {
    const user = await this.usersRepository.findById(ownerId);
    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const category = await this.categoriesRepository.findById(categoryId);
    if (!category) {
      return left(new ResourceNotFoundError());
    }

    const product = await this.productsRepository.findById(productId);
    if (!product) {
      return left(new ResourceNotFoundError());
    }
    if (product.status === ProductStatus.SOLD) {
      return left(new NotAllowedError());
    }

    if (ownerId !== product.ownerId.toString()) {
      return left(new NotAllowedError());
    }

    for (const attachmentId of attachmentsIds) {
      const attachment =
        await this.attachmentsRepository.findById(attachmentId);
      if (!attachment) {
        return left(new ResourceNotFoundError());
      }
    }

    const currentProductAttachments =
      await this.productAttachmentsRepository.findManyByProductId(productId);
    const productAttachmentList = new ProductAttachmentList(
      currentProductAttachments,
    );
    const productAttachments = attachmentsIds.map((attachmentId) => {
      return ProductAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        productId: product.id,
      });
    });
    productAttachmentList.update(productAttachments);

    product.title = title;
    product.description = description;
    product.priceInCents = priceInCents;
    product.attachments = productAttachmentList;
    product.categoryId = new UniqueEntityID(categoryId);
    await this.productsRepository.save(product);
    return right({
      product,
    });
  }
}
