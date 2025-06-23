import { ProductAttachmentsRepository } from '@/domain/marketplace/application/repositories/product-attachments-repository';
import { ProductsRepository } from '@/domain/marketplace/application/repositories/products-repository';
import { Product } from '@/domain/marketplace/enterprise/entities/product';
import { ProductDetails } from '@/domain/marketplace/enterprise/entities/value-objects/product-details';
import { Injectable } from '@nestjs/common';
import { PrismaProductDetailsMapper } from '../mappers/prisma-product-details-mapper';
import { PrismaProductMapper } from '../mappers/prisma-product-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(
    private prismaService: PrismaService,
    private productAttachmentsRepository: ProductAttachmentsRepository,
  ) {}

  async findById(id: string): Promise<Product | null> {
    const product = await this.prismaService.product.findUnique({
      where: {
        id,
      },
    });
    if (!product) {
      return null;
    }
    return PrismaProductMapper.toDomain(product);
  }

  async findDetailsById(id: string): Promise<ProductDetails | null> {
    const product = await this.prismaService.product.findUnique({
      where: {
        id,
      },
      include: {
        owner: {
          include: {
            avatar: true,
          },
        },
        category: true,
        attachments: true,
      },
    });
    if (!product) {
      return null;
    }
    const productDetails = PrismaProductDetailsMapper.toDomain(product);
    return productDetails;
  }

  async findManyRecent(): Promise<ProductDetails[]> {
    const products = await this.prismaService.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        owner: {
          include: {
            avatar: true,
          },
        },
        category: true,
        attachments: true,
      },
    });
    return products.map(PrismaProductDetailsMapper.toDomain);
  }

  async findManyByOwner(ownerId: string): Promise<ProductDetails[]> {
    const products = await this.prismaService.product.findMany({
      where: {
        ownerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        owner: {
          include: {
            avatar: true,
          },
        },
        category: true,
        attachments: true,
      },
    });
    return products.map(PrismaProductDetailsMapper.toDomain);
  }

  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product);
    await this.prismaService.product.create({
      data,
    });

    await this.productAttachmentsRepository.createMany(
      product.attachments.getItems(),
    );
  }

  async save(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product);
    await Promise.all([
      this.prismaService.product.update({
        where: {
          id: product.id.toString(),
        },
        data,
      }),
      this.productAttachmentsRepository.createMany(
        product.attachments.getNewItems(),
      ),
      this.productAttachmentsRepository.deleteMany(
        product.attachments.getRemovedItems(),
      ),
    ]);
  }

  async delete(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product);
    await this.prismaService.product.delete({
      where: {
        id: data.id,
      },
    });
  }
}
