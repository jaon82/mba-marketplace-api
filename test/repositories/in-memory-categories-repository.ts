import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { CategoriesRepository } from '@/domain/marketplace/application/repositories/categories-repository';
import { Category } from '@/domain/marketplace/enterprise/entities/category';

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public items: Category[] = [
    Category.create(
      {
        title: 'Books',
      },
      new UniqueEntityID('1'),
    ),
    Category.create(
      {
        title: 'Eletronics',
      },
      new UniqueEntityID('2'),
    ),
  ];

  async findAll(): Promise<Category[]> {
    return this.items;
  }

  async findById(id: string) {
    const category = this.items.find((item) => item.id.toString() === id);
    if (!category) {
      return null;
    }
    return category;
  }
}
