import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ProductAttachment } from '@/domain/marketplace/enterprise/entities/product-attachment';
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client';

export class PrismaProductAttachmentMapper {
  static toDomain(raw: PrismaAttachment): ProductAttachment {
    if (!raw.productId) {
      throw new Error('Invalid attachment type.');
    }
    return ProductAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        productId: new UniqueEntityID(raw.productId),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrismaUpdateMany(
    attachments: ProductAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((attachment) => {
      return attachment.attachmentId.toString();
    });
    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        productId: attachments[0].productId.toString(),
      },
    };
  }
}
