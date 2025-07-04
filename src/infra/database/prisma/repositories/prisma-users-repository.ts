import { UsersRepository } from '@/domain/marketplace/application/repositories/users-repository';
import { User } from '@/domain/marketplace/enterprise/entities/user';
import { Injectable } from '@nestjs/common';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        avatar: true,
      },
    });
    if (!user) {
      return null;
    }
    return PrismaUserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return null;
    }
    return PrismaUserMapper.toDomain(user);
  }

  async findByPhone(phone: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        phone,
      },
    });
    if (!user) {
      return null;
    }
    return PrismaUserMapper.toDomain(user);
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);
    await this.prisma.user.create({
      data,
    });
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);
    await this.prisma.user.update({
      data,
      where: {
        id: data.id,
      },
    });
  }
}
