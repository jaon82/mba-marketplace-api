import { AttachmentsRepository } from '@/domain/marketplace/application/repositories/attachments-repository';
import { CategoriesRepository } from '@/domain/marketplace/application/repositories/categories-repository';
import { ProductAttachmentsRepository } from '@/domain/marketplace/application/repositories/product-attachments-repository';
import { ProductsRepository } from '@/domain/marketplace/application/repositories/products-repository';
import { UsersRepository } from '@/domain/marketplace/application/repositories/users-repository';
import { ViewsRepository } from '@/domain/marketplace/application/repositories/view-repository';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository';
import { PrismaCategoriesRepository } from './prisma/repositories/prisma-categories-repository';
import { PrismaProductAttachmentsRepository } from './prisma/repositories/prisma-product-attachments-repository';
import { PrismaProductsRepository } from './prisma/repositories/prisma-products-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { PrismaViewsRepository } from './prisma/repositories/prisma-views-repository';

@Module({
  providers: [
    PrismaService,
    { provide: UsersRepository, useClass: PrismaUsersRepository },
    { provide: ProductsRepository, useClass: PrismaProductsRepository },
    {
      provide: CategoriesRepository,
      useClass: PrismaCategoriesRepository,
    },
    {
      provide: ProductAttachmentsRepository,
      useClass: PrismaProductAttachmentsRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: ViewsRepository,
      useClass: PrismaViewsRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    ProductsRepository,
    CategoriesRepository,
    AttachmentsRepository,
    ProductAttachmentsRepository,
    ViewsRepository,
  ],
})
export class DatabaseModule {}
