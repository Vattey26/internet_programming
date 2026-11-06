import { IsEmail, IsInt, IsString, Length, Max, Min } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(1)
  @Max(4)
  seats: number;
}