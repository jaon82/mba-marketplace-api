import { UsersRepository } from '@/domain/marketplace/application/repositories/users-repository';
import { User } from '@/domain/marketplace/enterprise/entities/user';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async findById(id: string) {
    const user = this.items.find((item) => item.id.toString() === id);
    if (!user) {
      return null;
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);
    if (!user) {
      return null;
    }
    return user;
  }

  async findByPhone(phone: string) {
    const user = this.items.find((item) => item.phone === phone);
    if (!user) {
      return null;
    }
    return user;
  }

  async create(user: User) {
    this.items.push(user);
  }

  async save(user: User) {
    const itemIndex = this.items.findIndex((item) => item.id === user.id);
    this.items[itemIndex] = user;
  }
}
