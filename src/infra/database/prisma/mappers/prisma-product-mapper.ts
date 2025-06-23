import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Product,
  ProductStatus,
} from '@/domain/marketplace/enterprise/entities/product';
import { Prisma, Product as PrismaProduct } from '@prisma/client';

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct): Product {
    return Product.create(
      {
        title: raw.title,
        description: raw.description,
        priceInCents: raw.priceInCents,
        status: raw.status as ProductStatus,
        ownerId: new UniqueEntityID(raw.ownerId),
        categoryId: new UniqueEntityID(raw.categoryId),
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(product: Product): Prisma.ProductUncheckedCreateInput {
    return {
      id: product.id.toString(),
      ownerId: product.ownerId.toString(),
      categoryId: product.categoryId.toString(),
      title: product.title,
      description: product.description,
      priceInCents: product.priceInCents,
      status: product.status,
      createdAt: product.createdAt,
    };
  }
}
