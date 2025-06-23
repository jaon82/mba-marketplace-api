import { User } from '@/domain/marketplace/enterprise/entities/user';
import { AttachmentPresenter } from './attachment-presenter';

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id.toString(),
      name: user.name,
      phone: user.phone,
      email: user.email,
      avatar: user.avatar ? AttachmentPresenter.toHTTP(user.avatar) : null,
    };
  }
}
