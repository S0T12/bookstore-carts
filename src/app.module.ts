import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    CartModule,
    MongooseModule.forRoot('mongodb://localhost:27017/cart'),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
