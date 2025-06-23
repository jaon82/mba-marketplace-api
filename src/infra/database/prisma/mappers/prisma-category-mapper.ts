import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Category } from '@/domain/marketplace/enterprise/entities/category';
import { Slug } from '@/domain/marketplace/enterprise/entities/value-objects/slug';
import { Prisma, Category as PrismaCategory } from '@prisma/client';

export class PrismaCategoryMapper {
  static toDomain(raw: PrismaCategory): Category {
    return Category.create(
      {
        title: raw.title,
        slug: Slug.createFromText(raw.title),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(category: Category): Prisma.CategoryUncheckedCreateInput {
    return {
      id: category.id.toString(),
      title: category.title,
      slug: Slug.createFromText(category.title).value,
    };
  }
}
