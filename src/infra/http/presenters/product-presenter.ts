import { ProductDetails } from '@/domain/marketplace/enterprise/entities/value-objects/product-details';
import { AttachmentPresenter } from './attachment-presenter';
import { CategoryPresenter } from './category-presenter ';
import { UserPresenter } from './user-presenter';

export class ProductPresenter {
  static toHTTP(product: ProductDetails) {
    return {
      id: product.id.toString(),
      title: product.title,
      description: product.description,
      priceInCents: product.priceInCents,
      status: product.status,
      owner: UserPresenter.toHTTP(product.owner),
      category: CategoryPresenter.toHTTP(product.category),
      attachments: product.attachments.map(AttachmentPresenter.toHTTP),
    };
  }
}
