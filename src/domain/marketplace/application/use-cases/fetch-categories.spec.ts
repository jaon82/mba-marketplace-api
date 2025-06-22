import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository';
import { FetchRecentCategoriesUseCase } from './fetch-categories';

let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let sut: FetchRecentCategoriesUseCase;

describe('Fetch Categories', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();
    sut = new FetchRecentCategoriesUseCase(inMemoryCategoriesRepository);
  });

  it('should be able to fetch recent categories', async () => {
    const result = await sut.execute();
    expect(result.value?.categories.length).toEqual(2);
  });

  it('should be able to fetch paginated recent categories', async () => {
    const result = await sut.execute();
    expect(result.value?.categories).toHaveLength(2);
  });
});
