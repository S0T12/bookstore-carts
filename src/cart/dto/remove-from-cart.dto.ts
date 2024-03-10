import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveFromCartDto {
  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @IsNotEmpty()
  @IsString()
  readonly bookId: string;
}
