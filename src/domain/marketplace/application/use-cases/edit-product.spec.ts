import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeAttachment } from 'test/factories/make-attachment';
import { makeProduct } from 'test/factories/make-product';
import { makeProductAttachment } from 'test/factories/make-product-attachments';
import { makeUser } from 'test/factories/make-user';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository';
import { InMemoryProductAttachmentsRepository } from 'test/repositories/in-memory-product-attachments-repository';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { NotAllowedError } from '../../../../core/errors/not-allowed-error';
import { EditProductUseCase } from './edit-product';

let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryProductAttachmentsRepository: InMemoryProductAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let sut: EditProductUseCase;

describe('Edit Product', () => {
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
    sut = new EditProductUseCase(
      inMemoryProductsRepository,
      inMemoryProductAttachmentsRepository,
      inMemoryUsersRepository,
      inMemoryCategoriesRepository,
      inMemoryAttachmentsRepository,
    );
  });

  it('should be able to edit a product', async () => {
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
    inMemoryProductAttachmentsRepository.items.push(
      makeProductAttachment({
        productId: newProduct.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeProductAttachment({
        productId: newProduct.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    );
    inMemoryAttachmentsRepository.items.push(
      makeAttachment({}, new UniqueEntityID('1')),
      makeAttachment({}, new UniqueEntityID('3')),
    );
    await sut.execute({
      productId: newProduct.id.toValue(),
      ownerId: 'user-1',
      title: 'Test Product',
      description: 'Description',
      attachmentsIds: ['1', '3'],
      priceInCents: 1000,
      categoryId: '1',
    });
    expect(inMemoryProductsRepository.items[0]).toMatchObject({
      title: 'Test Product',
      description: 'Description',
      priceInCents: 1000,
      categoryId: new UniqueEntityID('1'),
    });
    expect(
      inMemoryProductsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryProductsRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ]);
  });

  it('should not be able to edit a product from another user', async () => {
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

    const userId2 = new UniqueEntityID('user-2');
    const user2 = makeUser({ name: 'John Doe' }, userId2);
    await inMemoryUsersRepository.create(user2);
    const result = await sut.execute({
      productId: newProduct.id.toValue(),
      ownerId: userId2.toString(),
      title: 'Test Product',
      description: 'Description',
      attachmentsIds: [],
      priceInCents: 1000,
      categoryId: '1',
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should sync new and removed attachment when editing a product', async () => {
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
    inMemoryProductAttachmentsRepository.items.push(
      makeProductAttachment({
        productId: newProduct.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeProductAttachment({
        productId: newProduct.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    );
    inMemoryAttachmentsRepository.items.push(
      makeAttachment({}, new UniqueEntityID('1')),
      makeAttachment({}, new UniqueEntityID('3')),
    );
    const result = await sut.execute({
      productId: newProduct.id.toValue(),
      ownerId: 'user-1',
      title: 'Test Product',
      description: 'Description',
      attachmentsIds: ['1', '3'],
      priceInCents: 1000,
      categoryId: '1',
    });
    expect(result.isRight()).toBe(true);
    expect(inMemoryProductAttachmentsRepository.items).toHaveLength(2);
    expect(inMemoryProductAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('3'),
        }),
      ]),
    );
  });
});
