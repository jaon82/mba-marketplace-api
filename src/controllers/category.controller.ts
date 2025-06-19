import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
