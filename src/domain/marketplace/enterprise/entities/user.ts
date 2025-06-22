import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Attachment } from './attachment';

export interface UserProps {
  name: string;
  phone: string;
  email: string;
  password: string;
  avatar?: Attachment;
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }
  set name(name: string) {
    this.props.name = name;
  }

  get phone() {
    return this.props.phone;
  }
  set phone(phone: string) {
    this.props.phone = phone;
  }

  get email() {
    return this.props.email;
  }
  set email(email: string) {
    this.props.email = email;
  }

  get password() {
    return this.props.password;
  }
  set password(password: string) {
    this.props.password = password;
  }

  get avatar(): Attachment | undefined {
    return this.props.avatar;
  }
  set avatar(avatar: Attachment) {
    this.props.avatar = avatar;
  }

  static create(props: UserProps, id?: UniqueEntityID) {
    const user = new User(props, id);
    return user;
  }
}
