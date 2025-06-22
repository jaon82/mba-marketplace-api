import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { User } from '../../enterprise/entities/user';
import { HashGenerator } from '../cryptography/hash-generator';
import { AttachmentsRepository } from '../repositories/attachments-repository';
import { UsersRepository } from '../repositories/users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

interface RegisterUserUseCaseRequest {
  name: string;
  phone: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  avatarId?: string;
}
type RegisterUserUseCaseResponse = Either<
  UserAlreadyExistsError | ResourceNotFoundError,
  {
    user: User;
  }
>;

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private attachmentsRepository: AttachmentsRepository,
    private hashGenerator: HashGenerator,
  ) {}
  async execute({
    name,
    phone,
    email,
    password,
    passwordConfirmation,
    avatarId,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    if (password != passwordConfirmation) {
      return left(new WrongCredentialsError());
    }
    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email));
    }
    const userWithSamePhone = await this.usersRepository.findByPhone(phone);
    if (userWithSamePhone) {
      return left(new UserAlreadyExistsError(phone));
    }
    let avatar;
    if (avatarId) {
      avatar = await this.attachmentsRepository.findById(avatarId);
      if (!avatar) {
        return left(new ResourceNotFoundError());
      }
    }
    const hashedPassword = await this.hashGenerator.hash(password);
    const user = User.create({
      name,
      phone,
      email,
      password: hashedPassword,
      avatar,
    });
    await this.usersRepository.create(user);
    return right({
      user,
    });
  }
}
