import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Product,
  ProductProps,
} from '@/domain/marketplace/enterprise/entities/product';
import { PrismaProductMapper } from '@/infra/database/prisma/mappers/prisma-product-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeProduct(
  override: Partial<ProductProps> = {},
  id?: UniqueEntityID,
) {
  const product = Product.create(
    {
      ownerId: new UniqueEntityID(),
      categoryId: new UniqueEntityID(),
      priceInCents: faker.number.int({ min: 100, max: 100000 }),
      title: faker.lorem.sentence(),
      description: faker.lorem.text(),
      ...override,
    },
    id,
  );
  return product;
}

@Injectable()
export class ProductFactory {
  constructor(private prismaService: PrismaService) {}
  async makePrismaProduct(data: Partial<ProductProps> = {}): Promise<Product> {
    const product = makeProduct(data);
    await this.prismaService.product.create({
      data: PrismaProductMapper.toPrisma(product),
    });
    return product;
  }
}
