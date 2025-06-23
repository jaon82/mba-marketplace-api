import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { User } from '@/domain/marketplace/enterprise/entities/user';
import {
  Prisma,
  Attachment as PrismaAttachment,
  User as PrismaUser,
} from '@prisma/client';
import { PrismaAttachmentMapper } from './prisma-attachment-mapper';

type PrismaUserWithAvatar = PrismaUser & {
  avatar?: PrismaAttachment | null;
};

export class PrismaUserMapper {
  static toDomain(raw: PrismaUserWithAvatar): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        phone: raw.phone,
        password: raw.password,
        avatar: raw.avatar
          ? PrismaAttachmentMapper.toDomain(raw.avatar)
          : undefined,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      phone: user.phone,
      email: user.email,
      password: user.password,
      avatarId: user.avatar?.id.toString(),
    };
  }
}
