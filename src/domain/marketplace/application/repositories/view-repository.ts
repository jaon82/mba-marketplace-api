import { View } from '../../enterprise/entities/view';

export abstract class ViewsRepository {
  abstract countViewsBySeller(sellerId: string): Promise<number>;
  abstract countViewsPerDayBySeller(sellerId: string): Promise<number>;
  abstract countViewsByProduct(productId: string): Promise<number>;
  abstract create(view: View): Promise<void>;
}
