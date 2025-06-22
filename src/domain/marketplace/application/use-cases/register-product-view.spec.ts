import { makeProduct } from 'test/factories/make-product';
import { makeUser } from 'test/factories/make-user';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository';
import { InMemoryProductAttachmentsRepository } from 'test/repositories/in-memory-product-attachments-repository';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryViewsRepository } from 'test/repositories/in-memory-views-repository';
import { RegisterProductViewUseCase } from './register-product-view';

let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryProductAttachmentsRepository: InMemoryProductAttachmentsRepository;
let inMemoryViewsRepository: InMemoryViewsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let sut: RegisterProductViewUseCase;

describe('View a Product', () => {
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
    inMemoryViewsRepository = new InMemoryViewsRepository(
      inMemoryUsersRepository,
    );
    sut = new RegisterProductViewUseCase(
      inMemoryProductsRepository,
      inMemoryUsersRepository,
      inMemoryViewsRepository,
    );
  });

  it('should be able to view a product', async () => {
    const product = makeProduct();
    const viewer = makeUser();
    await inMemoryUsersRepository.create(viewer);
    await inMemoryProductsRepository.create(product);
    await sut.execute({
      productId: product.id.toString(),
      viewerId: viewer.id.toString(),
    });
    expect(inMemoryViewsRepository.items[0].viewer.id).toEqual(viewer.id);
  });
});
