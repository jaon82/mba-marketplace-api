import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Attachment } from '@/domain/marketplace/enterprise/entities/attachment';
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client';

export class PrismaAttachmentMapper {
  static toDomain(raw: PrismaAttachment): Attachment {
    return Attachment.create(
      {
        url: raw.url,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    attachment: Attachment,
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      url: attachment.url,
    };
  }
}
