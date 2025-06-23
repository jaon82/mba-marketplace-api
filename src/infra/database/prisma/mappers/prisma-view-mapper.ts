import { View } from '@/domain/marketplace/enterprise/entities/view';
import { Prisma } from '@prisma/client';

export class PrismaViewMapper {
  static toPrisma(view: View): Prisma.ViewUncheckedCreateInput {
    return {
      id: view.id.toString(),
      productId: view.product.id.toString(),
      viewerId: view.viewer.id.toString(),
      createdAt: view.createdAt,
    };
  }
}
