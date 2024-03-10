import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CartService } from './cart.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @MessagePattern({ cmd: 'getCartByUserId' })
  async getCartByuserId(@Payload() userId: string) {
    return this.cartService.getCartByUserId(userId);
  }

  @MessagePattern({ cmd: 'getCartById' })
  async getCartById(@Payload() cartId: string) {
    return this.cartService.getCartById(cartId);
  }

  @MessagePattern({ cmd: 'addToCart' })
  async addToCart(@Payload() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(addToCartDto);
  }

  @MessagePattern({ cmd: 'removeFromCart' })
  async removeFromCart(@Payload() removeFromCartDto: RemoveFromCartDto) {
    return this.cartService.removeFromCart(removeFromCartDto);
  }

  @MessagePattern({ cmd: 'clearCart' })
  async clearCart(@Payload() userId: string) {
    return this.cartService.clearCart(userId);
  }

  @MessagePattern({ cmd: 'updateCart' })
  async updateCart(@Payload() updateCartDto: UpdateCartDto) {
    return this.cartService.updateCart(updateCartDto);
  }
}
