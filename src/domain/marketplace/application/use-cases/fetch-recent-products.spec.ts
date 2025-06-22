import { makeProduct } from 'test/factories/make-product';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository';
import { InMemoryProductAttachmentsRepository } from 'test/repositories/in-memory-product-attachments-repository';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { FetchRecentProductsUseCase } from './fetch-recent-products';

let inMemoryProductAttachmentsRepository: InMemoryProductAttachmentsRepository;
let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let sut: FetchRecentProductsUseCase;

describe('Fetch Recent Products', () => {
  beforeEach(() => {
    inMemoryProductAttachmentsRepository =
      new InMemoryProductAttachmentsRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();
    inMemoryProductsRepository = new InMemoryProductsRepository(
      inMemoryProductAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryUsersRepository,
      inMemoryCategoriesRepository,
    );
    sut = new FetchRecentProductsUseCase(inMemoryProductsRepository);
  });

  it('should be able to fetch recent products', async () => {
    await inMemoryProductsRepository.create(
      makeProduct({ createdAt: new Date(2022, 0, 20) }),
    );
    await inMemoryProductsRepository.create(
      makeProduct({ createdAt: new Date(2022, 0, 18) }),
    );
    await inMemoryProductsRepository.create(
      makeProduct({ createdAt: new Date(2022, 0, 23) }),
    );
    const result = await sut.execute();
    expect(result.value?.products).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ]);
  });
});
