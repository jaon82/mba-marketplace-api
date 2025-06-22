import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeAttachment } from 'test/factories/make-attachment';
import { makeUser } from 'test/factories/make-user';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository';
import { InMemoryProductAttachmentsRepository } from 'test/repositories/in-memory-product-attachments-repository';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { CreateProductUseCase } from './create-product';

let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryProductAttachmentsRepository: InMemoryProductAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let sut: CreateProductUseCase;

describe('Create Product', () => {
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
    sut = new CreateProductUseCase(
      inMemoryProductsRepository,
      inMemoryUsersRepository,
      inMemoryCategoriesRepository,
      inMemoryAttachmentsRepository,
    );
  });

  it('should be able to create a product', async () => {
    const userId = new UniqueEntityID('user-1');
    const user = makeUser({ name: 'John Doe' }, userId);
    await inMemoryUsersRepository.create(user);

    inMemoryAttachmentsRepository.items.push(
      makeAttachment({}, new UniqueEntityID('1')),
      makeAttachment({}, new UniqueEntityID('2')),
    );

    const result = await sut.execute({
      ownerId: userId.toString(),
      categoryId: '1',
      title: 'New Product',
      description: 'Description',
      priceInCents: 1000,
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryProductsRepository.items[0]).toMatchObject({
      priceInCents: 1000,
    });
    expect(
      inMemoryProductsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryProductsRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ]);
  });

  it('should persist attachments when creating a new product', async () => {
    const userId = new UniqueEntityID('user-1');
    const user = makeUser({ name: 'John Doe' }, userId);
    await inMemoryUsersRepository.create(user);

    inMemoryAttachmentsRepository.items.push(
      makeAttachment({}, new UniqueEntityID('1')),
      makeAttachment({}, new UniqueEntityID('2')),
    );

    const result = await sut.execute({
      ownerId: userId.toString(),
      categoryId: '1',
      title: 'New Product',
      description: 'Description',
      priceInCents: 1000,
      attachmentsIds: ['1', '2'],
    });
    expect(result.isRight()).toBe(true);
    expect(inMemoryProductAttachmentsRepository.items).toHaveLength(2);
    expect(inMemoryProductAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
      ]),
    );
  });
});
