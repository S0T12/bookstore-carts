import { IsNotEmpty, IsString } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @IsNotEmpty()
  @IsString()
  readonly bookId: string;

  @IsNotEmpty()
  readonly quantity: number;
}
