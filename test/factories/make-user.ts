import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { User, UserProps } from '@/domain/marketplace/enterprise/entities/user';
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );
  return user;
}

@Injectable()
export class UserFactory {
  constructor(private prismaService: PrismaService) {}
  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data);
    await this.prismaService.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });
    return user;
  }
}
