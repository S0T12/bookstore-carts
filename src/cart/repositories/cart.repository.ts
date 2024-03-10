import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from '../schema/cart.schema';
import { CartItem } from '../interfaces/cart-item.interface';

@Injectable()
export class CartRepository {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
  ) {}

  async createCart(userId: string): Promise<CartDocument> {
    const cart = new this.cartModel({ userId, items: [] });
    return cart.save();
  }

  async getCartByUserId(userId: string): Promise<CartDocument> {
    const result = await this.cartModel.findOne({ userId }).exec();
    return result;
  }

  async getCartById(cartId: string): Promise<CartDocument> {
    return this.cartModel.findOne({ _id: cartId }).exec();
  }

  async addToCart(
    userId: string,
    bookId: string,
    quantity: number,
  ): Promise<CartDocument> {
    let cart = await this.getCartByUserId(userId);
    if (!cart) {
      cart = await this.createCart(userId);
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.bookId === bookId,
    );
    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ bookId, quantity });
    }

    return cart.save();
  }

  async removeFromCart(userId: string, bookId: string): Promise<CartDocument> {
    const cart = await this.getCartByUserId(userId);

    cart.items = cart.items.filter((item: CartItem) => item.bookId !== bookId);
    return cart.save();
  }

  async clearCart(userId: string): Promise<CartDocument> {
    const cart = await this.getCartByUserId(userId);

    cart.items = [];
    return cart.save();
  }

  async updateCart(userId: string, items: CartItem[]): Promise<CartDocument> {
    const cart = await this.getCartByUserId(userId);

    cart.items = items;
    return cart.save();
  }
}
