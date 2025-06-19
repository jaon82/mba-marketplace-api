import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { PrismaService } from '@/infra/prisma/prisma.service';
import {
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { z } from 'zod';

const createUserBodySchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  password: z.string(),
});
type CreateUserBodySchema = z.infer<typeof createUserBodySchema>;

@Controller('/sellers')
export class UserController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createUserBodySchema))
  async createUser(@Body() body: CreateUserBodySchema) {
    const { name, phone, email, password } = body;

    const userWithSameEmail = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new ConflictException('User with same email already exists.');
    }

    const userWithSamePhone = await this.prismaService.user.findUnique({
      where: {
        phone,
      },
    });

    if (userWithSamePhone) {
      throw new ConflictException('User with same phone already exists.');
    }

    const hashedPassword = await hash(password, 8);

    await this.prismaService.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
      },
    });
  }
}
