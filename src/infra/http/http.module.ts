import { Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CategoryController } from './controllers/category.controller';
import { UserController } from './controllers/user.controller';

@Module({
  controllers: [UserController, AuthenticateController, CategoryController],
  providers: [PrismaService],
})
export class HttpModule {}
