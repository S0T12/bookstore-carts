import { IsNotEmpty, IsString } from 'class-validator';
import { CartItem } from '../interfaces/cart-item.interface';

export class UpdateCartDto {
  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @IsNotEmpty()
  readonly items: CartItem[];
}
