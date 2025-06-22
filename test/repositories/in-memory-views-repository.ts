import { ViewsRepository } from '@/domain/marketplace/application/repositories/view-repository';
import { View } from '@/domain/marketplace/enterprise/entities/view';
import { InMemoryUsersRepository } from './in-memory-users-repository';

export class InMemoryViewsRepository implements ViewsRepository {
  public items: View[] = [];

  constructor(private usersRepository: InMemoryUsersRepository) {}

  async countViewsBySeller(sellerId: string): Promise<number> {
    const viewsCount = this.items.filter(
      (item) => item.viewer.id.toString() === sellerId,
    ).length;
    return viewsCount;
  }

  async countViewsPerDayBySeller(sellerId: string): Promise<number> {
    const viewsCount = this.items.filter(
      (item) => item.viewer.id.toString() === sellerId,
    ).length;
    return viewsCount;
  }

  async countViewsByProduct(productId: string): Promise<number> {
    const viewsCount = this.items.filter(
      (item) => item.product.id.toString() === productId,
    ).length;
    return viewsCount;
  }

  async create(view: View) {
    this.items.push(view);
  }
}
