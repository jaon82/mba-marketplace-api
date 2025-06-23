import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { User } from '@/domain/marketplace/enterprise/entities/user';
import { Prisma, User as PrismaUser } from '@prisma/client';

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        phone: raw.phone,
        password: raw.password,
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
    };
  }
}
