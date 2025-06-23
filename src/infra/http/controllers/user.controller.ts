import { EditUserUseCase } from '@/domain/marketplace/application/use-cases/edit-user';
import { UserAlreadyExistsError } from '@/domain/marketplace/application/use-cases/errors/user-already-exists-error';
import { GetUserProfileUseCase } from '@/domain/marketplace/application/use-cases/get-user-profile';
import { RegisterUserUseCase } from '@/domain/marketplace/application/use-cases/register-user';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { Public } from '@/infra/auth/public';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { UserPresenter } from '../presenters/user-presenter';

const createUserBodySchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  password: z.string(),
  passwordConfirmation: z.string(),
  avatarId: z.string().optional(),
});
type CreateUserBodySchema = z.infer<typeof createUserBodySchema>;

const editUserBodySchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  password: z.string().optional(),
  newPassword: z.string().optional(),
  avatarId: z.string().optional(),
});
type EditUserBodySchema = z.infer<typeof editUserBodySchema>;
const editValidationPipe = new ZodValidationPipe(editUserBodySchema);

@Controller('/sellers')
export class UserController {
  constructor(
    private registerStudentUseCase: RegisterUserUseCase,
    private editUserUseCase: EditUserUseCase,
    private getUserProfileUseCase: GetUserProfileUseCase,
  ) {}

  @Public()
  @Post()
  @UsePipes(new ZodValidationPipe(createUserBodySchema))
  async createUser(@Body() body: CreateUserBodySchema) {
    const { name, phone, email, password, passwordConfirmation, avatarId } =
      body;

    const result = await this.registerStudentUseCase.execute({
      name,
      phone,
      email,
      password,
      passwordConfirmation,
      avatarId,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
    const seller = result.value.user;
    return { seller: UserPresenter.toHTTP(seller) };
  }

  @Put()
  async editUser(
    @Body(editValidationPipe) body: EditUserBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, phone, email, password, newPassword, avatarId } = body;

    const result = await this.editUserUseCase.execute({
      email,
      name,
      phone,
      userId: user.sub,
      avatarId,
      newPassword,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
    const seller = result.value.user;
    return { seller: UserPresenter.toHTTP(seller) };
  }

  @Get('/me')
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.getUserProfileUseCase.execute(user.sub);
    if (result.isLeft()) {
      throw new BadRequestException();
    }
    return { seller: UserPresenter.toHTTP(result.value.user) };
  }
}
