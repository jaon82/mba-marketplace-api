import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';
import { Attachment } from '../attachment';
import { Category } from '../category';
import { ProductStatus } from '../product';
import { User } from '../user';

export interface ProductDetailsProps {
  productId: UniqueEntityID;
  ownerId: UniqueEntityID;
  title: string;
  description: string;
  priceInCents: number;
  status: ProductStatus;
  attachments: Attachment[];
  createdAt: Date;
  owner: User;
  category: Category;
}

export class ProductDetails extends ValueObject<ProductDetailsProps> {
  get productId() {
    return this.props.productId;
  }
  get ownerId() {
    return this.props.ownerId;
  }
  get title() {
    return this.props.title;
  }
  get description() {
    return this.props.description;
  }
  get priceInCents() {
    return this.props.priceInCents;
  }
  get status() {
    return this.props.status;
  }
  get owner() {
    return this.props.owner;
  }
  get category() {
    return this.props.category;
  }
  get attachments() {
    return this.props.attachments;
  }
  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: ProductDetailsProps) {
    return new ProductDetails(props);
  }
}
