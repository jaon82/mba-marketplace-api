import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error';
import { User } from '../../enterprise/entities/user';
import { UsersRepository } from '../repositories/users-repository';

type GetUserProfileUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User;
  }
>;

@Injectable()
export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}
  async execute(userId: string): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      return left(new ResourceNotFoundError());
    }
    return right({
      user,
    });
  }
}
