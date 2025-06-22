import { makeAttachment } from 'test/factories/make-attachment';
import { makeProduct } from 'test/factories/make-product';
import { makeProductAttachment } from 'test/factories/make-product-attachments';
import { makeUser } from 'test/factories/make-user';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository';
import { InMemoryProductAttachmentsRepository } from 'test/repositories/in-memory-product-attachments-repository';
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { GetProductByIdUseCase } from './get-product-by-id';

let inMemoryProductAttachmentsRepository: InMemoryProductAttachmentsRepository;
let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let sut: GetProductByIdUseCase;

describe('Get Product By Id', () => {
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
    sut = new GetProductByIdUseCase(inMemoryProductsRepository);
  });

  it('should be able to get a product by id', async () => {
    const user = makeUser({ name: 'John Doe' });
    await inMemoryUsersRepository.create(user);
    const newProduct = makeProduct({
      ownerId: user.id,
      categoryId: inMemoryCategoriesRepository.items[0]?.id,
    });

    await inMemoryProductsRepository.create(newProduct);
    const attachment = makeAttachment();
    inMemoryAttachmentsRepository.items.push(attachment);
    inMemoryProductAttachmentsRepository.items.push(
      makeProductAttachment({
        attachmentId: attachment.id,
        productId: newProduct.id,
      }),
    );
    const result = await sut.execute({
      id: newProduct.id.toString(),
    });

    expect(result.value).toMatchObject({
      product: expect.objectContaining({
        title: newProduct.title,
        ownerId: user.id,
        attachments: [
          expect.objectContaining({
            url: attachment.url,
          }),
        ],
      }),
    });
  });
});
