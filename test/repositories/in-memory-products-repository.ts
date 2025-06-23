import { ProductsRepository } from '@/domain/marketplace/application/repositories/products-repository';
import { Product } from '@/domain/marketplace/enterprise/entities/product';
import { ProductDetails } from '@/domain/marketplace/enterprise/entities/value-objects/product-details';
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository';
import { InMemoryCategoriesRepository } from './in-memory-categories-repository';
import { InMemoryProductAttachmentsRepository } from './in-memory-product-attachments-repository';
import { InMemoryUsersRepository } from './in-memory-users-repository';

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = [];

  constructor(
    private productAttachmentsRepository: InMemoryProductAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private usersRepository: InMemoryUsersRepository,
    private categoriesRepository: InMemoryCategoriesRepository,
  ) {}

  async findById(id: string) {
    const product = this.items.find((item) => item.id.toString() === id);
    if (!product) {
      return null;
    }
    return product;
  }

  async findDetailsById(id: string) {
    const product = this.items.find((item) => item.id.toValue() === id);
    if (!product) {
      return null;
    }
    const owner = this.usersRepository.items.find((user) => {
      return user.id.equals(product.ownerId);
    });
    if (!owner) {
      throw new Error(
        `Owner with ID "${product.ownerId.toString()}" does not exist.`,
      );
    }
    const category = this.categoriesRepository.items.find((category) => {
      return category.id.equals(product.categoryId);
    });
    if (!category) {
      throw new Error(
        `Category with ID "${product.categoryId.toString()}" does not exist.`,
      );
    }
    const productAttachments = this.productAttachmentsRepository.items.filter(
      (productAttachment) => {
        return productAttachment.productId.equals(product.id);
      },
    );
    const attachments = productAttachments.map((productAttachment) => {
      const attachment = this.attachmentsRepository.items.find((attachment) => {
        return attachment.id.equals(productAttachment.attachmentId);
      });
      if (!attachment) {
        throw new Error(
          `Attachment with ID "${productAttachment.attachmentId.toString()}" does not exist.`,
        );
      }
      return attachment;
    });
    return ProductDetails.create({
      id: product.id,
      ownerId: product.ownerId,
      owner: owner,
      category: category,
      title: product.title,
      description: product.description,
      priceInCents: product.priceInCents,
      status: product.status,
      attachments,
      createdAt: product.createdAt,
    });
  }

  async findManyRecent() {
    const products = this.items.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    return products;
  }

  async findManyByOwner(ownerId: string) {
    const products = this.items
      .filter((item) => item.ownerId.toString() === ownerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return products;
  }

  async create(product: Product) {
    this.items.push(product);

    await this.productAttachmentsRepository.createMany(
      product.attachments.getItems(),
    );
  }

  async save(product: Product) {
    const itemIndex = this.items.findIndex((item) => item.id === product.id);
    this.items[itemIndex] = product;

    await this.productAttachmentsRepository.createMany(
      product.attachments.getNewItems(),
    );
    await this.productAttachmentsRepository.deleteMany(
      product.attachments.getRemovedItems(),
    );
  }

  async delete(product: Product) {
    const itemIndex = this.items.findIndex((item) => item.id === product.id);
    this.items.splice(itemIndex, 1);
    await this.productAttachmentsRepository.deleteManyByProductId(
      product.id.toString(),
    );
  }
}
