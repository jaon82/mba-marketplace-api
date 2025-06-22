import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeUser } from 'test/factories/make-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { GetUserProfileUseCase } from './get-user-profile';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(inMemoryUsersRepository);
  });

  it('should be able to get a product by id', async () => {
    const userId = new UniqueEntityID('user-1');
    const user = makeUser({ name: 'John Doe' }, userId);
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute(userId.toString());

    expect(result.value).toMatchObject({
      user: expect.objectContaining({
        name: 'John Doe',
      }),
    });
  });
});
