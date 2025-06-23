import { CategoriesRepository } from '@/domain/marketplace/application/repositories/categories-repository';
import { Category } from '@/domain/marketplace/enterprise/entities/category';
import { Injectable } from '@nestjs/common';
import { PrismaCategoryMapper } from '../mappers/prisma-category-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaCategoriesRepository implements CategoriesRepository {
  constructor(private prismaService: PrismaService) {}

  async findById(id: string): Promise<Category | null> {
    const category = await this.prismaService.category.findUnique({
      where: {
        id,
      },
    });
    if (!category) {
      return null;
    }
    return PrismaCategoryMapper.toDomain(category);
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.prismaService.category.findMany({
      orderBy: {
        title: 'asc',
      },
    });
    return categories.map(PrismaCategoryMapper.toDomain);
  }
}
