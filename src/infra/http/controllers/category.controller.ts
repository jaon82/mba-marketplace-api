import { PrismaService } from '@/infra/prisma/prisma.service';
import { Controller, Get } from '@nestjs/common';

@Controller('/categories')
export class CategoryController {
  constructor(private prismaService: PrismaService) {}

  @Get()
  async getCategories() {
    const categories = await this.prismaService.category.findMany({
      orderBy: {
        title: 'asc',
      },
    });

    return { categories };
  }
}
