import { AttachmentsRepository } from '@/domain/marketplace/application/repositories/attachments-repository';
import { Attachment } from '@/domain/marketplace/enterprise/entities/attachment';

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  async findById(id: string) {
    const attachment = this.items.find((item) => item.id.toString() === id);
    if (!attachment) {
      return null;
    }
    return attachment;
  }

  public items: Attachment[] = [];

  async create(attachment: Attachment) {
    this.items.push(attachment);
  }
}
