import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeProduct } from 'test/factories/make-product';
import { makeUser } from 'test/factories/make-user';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository';
import { InMemoryProductAttachmentsRepository } from 'test/repositories/in-memory-product-attachments-repository';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { NotAllowedError } from '../../../../core/errors/not-allowed-error';
import { EditProductStatusUseCase } from './edit-product-status';

let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryProductAttachmentsRepository: InMemoryProductAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let sut: EditProductStatusUseCase;

describe('Edit Product Satatus', () => {
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
    sut = new EditProductStatusUseCase(
      inMemoryProductsRepository,
      inMemoryProductAttachmentsRepository,
    );
  });

  it('should be able to edit a product status', async () => {
    const userId = new UniqueEntityID('user-1');
    const user = makeUser({ name: 'John Doe' }, userId);
    await inMemoryUsersRepository.create(user);

    const newProduct = makeProduct(
      {
        ownerId: userId,
      },
      new UniqueEntityID('product-1'),
    );
    await inMemoryProductsRepository.create(newProduct);
    await sut.execute({
      productId: newProduct.id.toValue(),
      ownerId: userId.toString(),
      status: 'cancelled',
    });
    expect(inMemoryProductsRepository.items[0]).toMatchObject({
      status: 'cancelled',
    });
  });

  it('should not be able to edit a product status from another user product', async () => {
    const userId = new UniqueEntityID('user-1');
    const user = makeUser({ name: 'John Doe' }, userId);
    await inMemoryUsersRepository.create(user);

    const newProduct = makeProduct(
      {
        ownerId: userId,
      },
      new UniqueEntityID('product-1'),
    );
    await inMemoryProductsRepository.create(newProduct);
    const result = await sut.execute({
      productId: newProduct.id.toValue(),
      ownerId: 'owner-2',
      status: 'cancelled',
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
