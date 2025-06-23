import { EditUserUseCase } from '@/domain/marketplace/application/use-cases/edit-user';
import { RegisterUserUseCase } from '@/domain/marketplace/application/use-cases/register-user';
import { UploadAndCreateAttachmentUseCase } from '@/domain/marketplace/application/use-cases/upload-and-create-attachment';
import { Module } from '@nestjs/common';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { StorageModule } from '../storage/storage.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CategoryController } from './controllers/category.controller';
import { UploadAttachmentController } from './controllers/upload-attachment.controller';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    UserController,
    AuthenticateController,
    UploadAttachmentController,
    CategoryController,
  ],
  providers: [
    RegisterUserUseCase,
    EditUserUseCase,
    UploadAndCreateAttachmentUseCase,
  ],
})
export class HttpModule {}
