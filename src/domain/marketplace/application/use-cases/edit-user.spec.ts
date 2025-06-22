import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeUser } from 'test/factories/make-user';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { EditUserUseCase } from './edit-user';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let fakeHasher: FakeHasher;
let sut: EditUserUseCase;

describe('Edit User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    fakeHasher = new FakeHasher();
    sut = new EditUserUseCase(
      inMemoryUsersRepository,
      inMemoryAttachmentsRepository,
      fakeHasher,
    );
  });

  it('should be able to edit a user', async () => {
    const userId = new UniqueEntityID('user-1');
    const user = makeUser({}, userId);
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      userId: 'user-1',
      name: 'John Doe',
      phone: '9999999999',
      email: 'johndoe@example.com',
    });
    expect(result.isRight()).toBe(true);
    expect(inMemoryUsersRepository.items[0]).toMatchObject({
      name: 'John Doe',
      phone: '9999999999',
      email: 'johndoe@example.com',
    });
  });

  it('should hash user password upon edition', async () => {
    const userId = new UniqueEntityID('user-1');
    const user = makeUser(
      {
        name: 'John Doe',
        phone: '9999999999',
        email: 'johndoe@example.com',
        password: '123456',
      },
      userId,
    );
    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      userId: 'user-1',
      name: 'John Doe',
      phone: '9999999999',
      email: 'johndoe@example.com',
      password: '123456',
      newPassword: '111111',
    });
    const hashedPassword = await fakeHasher.hash('111111');
    expect(result.isRight()).toBe(true);
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword);
  });

  it('should not be able to edit user with same email', async () => {
    const userId = new UniqueEntityID('user-1');
    const user = makeUser(
      {
        name: 'John Doe',
        phone: '9999999999',
        email: 'johndoe@example.com',
        password: '123456',
      },
      userId,
    );
    await inMemoryUsersRepository.create(user);
    const user2 = makeUser({
      email: 'johndoe2@example.com',
    });
    await inMemoryUsersRepository.create(user2);

    const result = await sut.execute({
      userId: 'user-1',
      name: 'John Doe',
      phone: '9999999999',
      email: 'johndoe2@example.com',
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
  });

  it('should not be able to edit user with same phone', async () => {
    const userId = new UniqueEntityID('user-1');
    const user = makeUser(
      {
        name: 'John Doe',
        phone: '9999999999',
        email: 'johndoe@example.com',
        password: '123456',
      },
      userId,
    );
    await inMemoryUsersRepository.create(user);
    const user2 = makeUser({
      phone: '8888888888',
    });
    await inMemoryUsersRepository.create(user2);

    const result = await sut.execute({
      userId: 'user-1',
      name: 'John Doe',
      phone: '8888888888',
      email: 'johndoe2@example.com',
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
  });
});
