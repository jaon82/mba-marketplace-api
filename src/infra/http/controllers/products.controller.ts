import { CreateProductUseCase } from '@/domain/marketplace/application/use-cases/create-product';
import { EditProductUseCase } from '@/domain/marketplace/application/use-cases/edit-product';
import { EditProductStatusUseCase } from '@/domain/marketplace/application/use-cases/edit-product-status';
import { FetchProductsByOwnerUseCase } from '@/domain/marketplace/application/use-cases/fetch-products-by-owner';
import { FetchRecentProductsUseCase } from '@/domain/marketplace/application/use-cases/fetch-recent-products';
import { GetProductByIdUseCase } from '@/domain/marketplace/application/use-cases/get-product-by-id';
import { RegisterProductViewUseCase } from '@/domain/marketplace/application/use-cases/register-product-view';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { z } from 'zod';
import { ProductDetailsPresenter } from '../presenters/product-details-presenter';
import { ProductPresenter } from '../presenters/product-presenter';
import { ProductViewPresenter } from '../presenters/product-view-presenter';

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
    private fetchRecentProductsUseCase: FetchRecentProductsUseCase,
    private fetchProductsByOwnerUseCase: FetchProductsByOwnerUseCase,
    private editProductStatusUseCase: EditProductStatusUseCase,
    private registerProductViewUseCase: RegisterProductViewUseCase,
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
        product: ProductDetailsPresenter.toHTTP(product),
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
        product: ProductDetailsPresenter.toHTTP(product),
      };
    }
  }

  @Get('/me')
  async getAllBySeller(@CurrentUser() user: UserPayload) {
    const result = await this.fetchProductsByOwnerUseCase.execute(user.sub);
    if (result.isLeft()) {
      throw new BadRequestException();
    }
    const { products } = result.value;
    return {
      product: products.map(ProductPresenter.toHTTP),
    };
  }

  @Get('/:id')
  async get(@Param('id') productId: string) {
    const result = await this.getProductByIdUseCase.execute({ id: productId });
    if (result.isLeft()) {
      throw new BadRequestException();
    }
    const { product } = result.value;
    return {
      product: ProductDetailsPresenter.toHTTP(product),
    };
  }

  @Get()
  async getAll() {
    const result = await this.fetchRecentProductsUseCase.execute();
    if (result.isLeft()) {
      throw new BadRequestException();
    }
    const { products } = result.value;
    return {
      product: products.map(ProductPresenter.toHTTP),
    };
  }

  @Post('/:id/views')
  async view(@Param('id') productId: string, @CurrentUser() user: UserPayload) {
    const viewerId = user.sub;
    const result = await this.registerProductViewUseCase.execute({
      productId,
      viewerId,
    });
    if (result.isLeft()) {
      throw new BadRequestException();
    }
    return ProductViewPresenter.toHTTP(result.value.view);
  }

  @Patch('/:id/:status')
  async editStatus(
    @CurrentUser() user: UserPayload,
    @Param('id') productId: string,
    @Param('status') status: string,
  ) {
    const ownerId = user.sub;
    const result = await this.editProductStatusUseCase.execute({
      ownerId,
      productId,
      status,
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
        product: ProductDetailsPresenter.toHTTP(product),
      };
    }
  }
}
