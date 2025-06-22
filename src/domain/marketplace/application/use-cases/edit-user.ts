import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { User } from '../../enterprise/entities/user';
import { HashGenerator } from '../cryptography/hash-generator';
import { AttachmentsRepository } from '../repositories/attachments-repository';
import { UsersRepository } from '../repositories/users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

interface EditUserUseCaseRequest {
  userId: string;
  name: string;
  phone: string;
  email: string;
  avatarId?: string;
  password?: string;
  newPassword?: string;
}
type EditUserUseCaseResponse = Either<
  UserAlreadyExistsError | WrongCredentialsError,
  {
    user: User;
  }
>;

@Injectable()
export class EditUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private attachmentsRepository: AttachmentsRepository,
    private hashGenerator: HashGenerator,
  ) {}
  async execute({
    userId,
    name,
    phone,
    email,
    avatarId,
    password,
    newPassword,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      return left(new ResourceNotFoundError());
    }
    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail && userWithSameEmail.id.toString() !== userId) {
      return left(new UserAlreadyExistsError(email));
    }
    const userWithSamePhone = await this.usersRepository.findByPhone(phone);
    if (userWithSamePhone && userWithSamePhone.id.toString() !== userId) {
      return left(new UserAlreadyExistsError(phone));
    }

    user.name = name;
    user.phone = phone;
    user.email = email;
    let avatar;
    if (avatarId) {
      avatar = await this.attachmentsRepository.findById(avatarId);
      if (!avatar) {
        return left(new ResourceNotFoundError());
      }
      user.avatar = avatar;
    }
    let hashedPassword;
    if (newPassword) {
      if (newPassword === password) {
        return left(new WrongCredentialsError());
      }
      hashedPassword = await this.hashGenerator.hash(newPassword);
      user.password = hashedPassword;
    }
    await this.usersRepository.save(user);
    return right({
      user,
    });
  }
}
