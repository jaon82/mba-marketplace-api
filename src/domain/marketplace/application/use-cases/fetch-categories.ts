import { Either, right } from '@/core/either';
import { Category } from '@/domain/marketplace/enterprise/entities/category';
import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../repositories/categories-repository';

type FetchRecentCategoriesUseCaseResponse = Either<
  null,
  {
    categories: Category[];
  }
>;

@Injectable()
export class FetchRecentCategoriesUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute(): Promise<FetchRecentCategoriesUseCaseResponse> {
    const categories = await this.categoriesRepository.findAll();
    return right({
      categories,
    });
  }
}
