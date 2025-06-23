import { ViewsRepository } from '@/domain/marketplace/application/repositories/view-repository';
import { View } from '@/domain/marketplace/enterprise/entities/view';
import { Injectable } from '@nestjs/common';
import { PrismaViewMapper } from '../mappers/prisma-view-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaViewsRepository implements ViewsRepository {
  constructor(private prisma: PrismaService) {}

  async countViewsBySeller(sellerId: string): Promise<number> {
    console.log(sellerId);
    return 3;
  }

  async countViewsPerDayBySeller(sellerId: string): Promise<any> {
    console.log(sellerId);
    return {
      viewsPerDay: [
        {
          date: null,
          amount: 1,
        },
      ],
    };
  }

  async countViewsByProduct(productId: string): Promise<number> {
    console.log(productId);
    return 30;
  }

  async create(view: View): Promise<View> {
    const data = PrismaViewMapper.toPrisma(view);
    await this.prisma.view.create({
      data,
    });
    return view;
  }
}
