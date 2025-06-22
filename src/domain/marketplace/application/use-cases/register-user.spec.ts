import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { RegisterUserUseCase } from './register-user';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let fakeHasher: FakeHasher;
let sut: RegisterUserUseCase;

describe('Register User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterUserUseCase(
      inMemoryUsersRepository,
      inMemoryAttachmentsRepository,
      fakeHasher,
    );
  });

  it('should be able to register a new user', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      phone: '9999999999',
      email: 'johndoe@example.com',
      password: '123456',
      passwordConfirmation: '123456',
    });
    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    });
  });

  it('should hash user password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      phone: '9999999999',
      email: 'johndoe@example.com',
      password: '123456',
      passwordConfirmation: '123456',
    });
    const hashedPassword = await fakeHasher.hash('123456');
    expect(result.isRight()).toBe(true);
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword);
  });

  it('should not be able to register user with same email', async () => {
    await sut.execute({
      name: 'John Doe',
      phone: '9999999999',
      email: 'johndoe@example.com',
      password: '123456',
      passwordConfirmation: '123456',
    });
    const result = await sut.execute({
      name: 'Jane Doe',
      phone: '8888888888',
      email: 'johndoe@example.com',
      password: '123456',
      passwordConfirmation: '123456',
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
  });

  it('should not be able to register user with same phone', async () => {
    await sut.execute({
      name: 'John Doe',
      phone: '8888888888',
      email: 'johndoe@example.com',
      password: '123456',
      passwordConfirmation: '123456',
    });
    const result = await sut.execute({
      name: 'John Doe',
      phone: '8888888888',
      email: 'johndoe@example.com',
      password: '123456',
      passwordConfirmation: '123456',
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
  });
});
