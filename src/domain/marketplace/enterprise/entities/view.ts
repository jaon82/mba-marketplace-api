import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { User } from './user';
import { ProductDetails } from './value-objects/product-details';

export interface ViewProps {
  viewer: User;
  product: ProductDetails;
  createdAt: Date;
}

export class View extends Entity<ViewProps> {
  get viewer() {
    return this.props.viewer;
  }
  get product() {
    return this.props.product;
  }
  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: Optional<ViewProps, 'createdAt'>, id?: UniqueEntityID) {
    const view = new View(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
    return view;
  }
}
