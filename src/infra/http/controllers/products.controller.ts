import { CreateProductUseCase } from '@/domain/marketplace/application/use-cases/create-product';
import { EditProductUseCase } from '@/domain/marketplace/application/use-cases/edit-product';
import { GetProductByIdUseCase } from '@/domain/marketplace/application/use-cases/get-product-by-id';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { z } from 'zod';
import { ProductPresenter } from '../presenters/product-presenter';

const createProductBodySchema = z.object({
  title: z.string(),
  categoryId: z.string(),
  description: z.string(),
  priceInCents: z.coerce.number(),
  attachmentsIds: z.array(z.string().uuid()),
});
type CreateProductBodySchema = z.infer<typeof createProductBodySchema>;
const bodyValidationPipe = new ZodValidationPipe(createProductBodySchema);

@Controller('/products')
export class ProductsController {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private getProductByIdUseCase: GetProductByIdUseCase,
    private editProductUseCase: EditProductUseCase,
  ) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateProductBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, description, priceInCents, attachmentsIds, categoryId } =
      body;
    const userId = user.sub;
    const result = await this.createProductUseCase.execute({
      ownerId: userId,
      title,
      description,
      priceInCents,
      attachmentsIds,
      categoryId,
    });
    if (result.isLeft()) {
      throw new BadRequestException();
    }
    const fetchResult = await this.getProductByIdUseCase.execute({
      id: result.value.product.id.toString(),
    });
    if (fetchResult.isRight()) {
      const { product } = fetchResult.value;
      return {
        product: ProductPresenter.toHTTP(product),
      };
    }
  }

  @Put('/:id')
  async edit(
    @Body(bodyValidationPipe) body: CreateProductBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') productId: string,
  ) {
    const { title, description, priceInCents, attachmentsIds, categoryId } =
      body;
    const userId = user.sub;
    const result = await this.editProductUseCase.execute({
      ownerId: userId,
      title,
      description,
      priceInCents,
      attachmentsIds,
      categoryId,
      productId,
    });
    if (result.isLeft()) {
      throw new BadRequestException();
    }
    const fetchResult = await this.getProductByIdUseCase.execute({
      id: result.value.product.id.toString(),
    });
    if (fetchResult.isRight()) {
      const { product } = fetchResult.value;
      return {
        product: ProductPresenter.toHTTP(product),
      };
    }
  }

  @Get('/:id')
  async get(@Param('id') productId: string) {
    const result = await this.getProductByIdUseCase.execute({ id: productId });
    if (result.isLeft()) {
      throw new BadRequestException();
    }
    const { product } = result.value;
    return {
      product: ProductPresenter.toHTTP(product),
    };
  }
}
