import { Inject, Injectable } from '@nestjs/common';
import { CartRepository } from './repositories/cart.repository';
import { Cart } from './schema/cart.schema';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    @Inject('BOOK_SERVICE') private readonly bookClientProxy: ClientProxy,
    @Inject('USERS_SERVICE') private readonly userClientProxy: ClientProxy,
  ) {}

  async getCartByUserId(userId: string): Promise<Cart> {
    return this.cartRepository.getCartByUserId(userId);
  }

  async getCartById(cartId: string): Promise<Cart> {
    return this.cartRepository.getCartById(cartId);
  }

  async addToCart(addToCartDto: AddToCartDto): Promise<Cart> {
    const { userId, bookId, quantity } = addToCartDto;

    const user = await lastValueFrom(
      this.userClientProxy.send({ cmd: 'findOneUser' }, userId),
    );

    const book = await lastValueFrom(
      this.bookClientProxy.send({ cmd: 'findOneBook' }, bookId),
    );

    if (user && book) {
      const cart = await this.cartRepository.addToCart(
        userId,
        bookId,
        quantity,
      );

      // Update book stock
      await lastValueFrom(
        this.bookClientProxy.send(
          { cmd: 'updateBookStock' },
          { bookId, quantity, action: 'remove' },
        ),
      );

      return cart;
    }
  }

  async removeFromCart(removeFromCartDto: RemoveFromCartDto): Promise<Cart> {
    const { userId, bookId } = removeFromCartDto;
    const cart = await this.cartRepository.removeFromCart(userId, bookId);

    const quantity =
      cart.items.find((item) => item.bookId === bookId)?.quantity || 0;
    await lastValueFrom(
      this.bookClientProxy.send(
        { cmd: 'updateBookStock' },
        { bookId, quantity, action: 'add' },
      ),
    );

    return cart;
  }

  async clearCart(userId: string): Promise<Cart> {
    const cart = await this.cartRepository.getCartByUserId(userId);
    const updatedCart = await this.cartRepository.clearCart(userId);

    // Update book stock for all items
    for (const item of cart.items) {
      await lastValueFrom(
        this.bookClientProxy.send(
          { cmd: 'updateBookStock' },
          { bookId: item.bookId, quantity: item.quantity, action: 'add' },
        ),
      );
    }

    return updatedCart;
  }

  async updateCart(updateCartDto: UpdateCartDto): Promise<Cart> {
    const { userId, items } = updateCartDto;
    const oldCart = await this.cartRepository.getCartByUserId(userId);

    // Update book stock for removed items
    for (const oldItem of oldCart.items) {
      const newItem = items.find((item) => item.bookId === oldItem.bookId);
      if (!newItem) {
        await lastValueFrom(
          this.bookClientProxy.send(
            { cmd: 'updateBookStock' },
            {
              bookId: oldItem.bookId,
              quantity: oldItem.quantity,
              action: 'add',
            },
          ),
        );
      } else {
        const diff = oldItem.quantity - newItem.quantity;
        if (diff > 0) {
          await lastValueFrom(
            this.bookClientProxy.send(
              { cmd: 'updateBookStock' },
              { bookId: oldItem.bookId, quantity: diff, action: 'add' },
            ),
          );
        }
      }
    }

    // Update book stock for added items
    for (const newItem of items) {
      const oldItem = oldCart.items.find(
        (item) => item.bookId === newItem.bookId,
      );
      if (!oldItem) {
        await lastValueFrom(
          this.bookClientProxy.send(
            { cmd: 'updateBookStock' },
            {
              bookId: newItem.bookId,
              quantity: newItem.quantity,
              action: 'remove',
            },
          ),
        );
      } else {
        const diff = newItem.quantity - oldItem.quantity;
        if (diff > 0) {
          await lastValueFrom(
            this.bookClientProxy.send(
              { cmd: 'updateBookStock' },
              { bookId: newItem.bookId, quantity: diff, action: 'remove' },
            ),
          );
        }
      }
    }

    return this.cartRepository.updateCart(userId, items);
  }
}
