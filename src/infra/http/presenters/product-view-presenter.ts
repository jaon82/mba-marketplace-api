import { View } from '@/domain/marketplace/enterprise/entities/view';
import { ProductDetailsPresenter } from './product-details-presenter';
import { UserPresenter } from './user-presenter';

export class ProductViewPresenter {
  static toHTTP(view: View) {
    return {
      product: ProductDetailsPresenter.toHTTP(view.product),
      viewer: UserPresenter.toHTTP(view.viewer),
    };
  }
}
