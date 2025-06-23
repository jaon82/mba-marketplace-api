import { CreateProductUseCase } from '@/domain/marketplace/application/use-cases/create-product';
import { EditUserUseCase } from '@/domain/marketplace/application/use-cases/edit-user';
import { GetProductByIdUseCase } from '@/domain/marketplace/application/use-cases/get-product-by-id';
import { GetUserProfileUseCase } from '@/domain/marketplace/application/use-cases/get-user-profile';
import { RegisterUserUseCase } from '@/domain/marketplace/application/use-cases/register-user';
import { UploadAndCreateAttachmentUseCase } from '@/domain/marketplace/application/use-cases/upload-and-create-attachment';
import { Module } from '@nestjs/common';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { StorageModule } from '../storage/storage.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CategoryController } from './controllers/category.controller';
import { ProductsController } from './controllers/products.controller';
import { UploadAttachmentController } from './controllers/upload-attachment.controller';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    UserController,
    AuthenticateController,
    UploadAttachmentController,
    CategoryController,
    ProductsController,
  ],
  providers: [
    RegisterUserUseCase,
    EditUserUseCase,
    UploadAndCreateAttachmentUseCase,
    GetUserProfileUseCase,
    CreateProductUseCase,
    GetProductByIdUseCase,
  ],
})
export class HttpModule {}
