import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ProductStatus } from '@/domain/marketplace/enterprise/entities/product';
import { ProductDetails } from '@/domain/marketplace/enterprise/entities/value-objects/product-details';
import {
  Attachment as PrismaAttachment,
  Category as PrismaCategory,
  Product as PrismaProduct,
  User as PrismaUser,
} from '@prisma/client';
import { PrismaAttachmentMapper } from './prisma-attachment-mapper';
import { PrismaCategoryMapper } from './prisma-category-mapper';
import { PrismaUserMapper } from './prisma-user-mapper';

type PrismaProductDetails = PrismaProduct & {
  owner: PrismaUser;
  category: PrismaCategory;
  attachments: PrismaAttachment[];
};

export class PrismaProductDetailsMapper {
  static toDomain(raw: PrismaProductDetails): ProductDetails {
    return ProductDetails.create({
      id: new UniqueEntityID(raw.id),
      ownerId: new UniqueEntityID(raw.owner.id),
      title: raw.title,
      priceInCents: raw.priceInCents,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      description: raw.description,
      status: raw.status as ProductStatus,
      category: PrismaCategoryMapper.toDomain(raw.category),
      owner: PrismaUserMapper.toDomain(raw.owner),
      createdAt: raw.createdAt,
    });
  }
}
