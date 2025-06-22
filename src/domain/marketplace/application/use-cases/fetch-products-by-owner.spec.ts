import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeProduct } from 'test/factories/make-product';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository';
import { InMemoryProductAttachmentsRepository } from 'test/repositories/in-memory-product-attachments-repository';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { FetchProductsByOwnerUseCase } from './fetch-products-by-owner';

let inMemoryProductAttachmentsRepository: InMemoryProductAttachmentsRepository;
let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let sut: FetchProductsByOwnerUseCase;

describe('Fetch Products By Owner', () => {
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
    sut = new FetchProductsByOwnerUseCase(inMemoryProductsRepository);
  });

  it('should be able to fetch products By owner', async () => {
    const ownerId = new UniqueEntityID();
    await inMemoryProductsRepository.create(
      makeProduct({ createdAt: new Date(2022, 0, 20), ownerId }),
    );
    await inMemoryProductsRepository.create(
      makeProduct({ createdAt: new Date(2022, 0, 18), ownerId }),
    );
    await inMemoryProductsRepository.create(
      makeProduct({ createdAt: new Date(2022, 0, 23), ownerId }),
    );
    const result = await sut.execute(ownerId.toString());

    expect(result.value?.products).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ]);
  });
});
