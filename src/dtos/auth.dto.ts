import { IsEmail, IsNotEmpty } from 'class-validator';

export class loginDto {
	@IsNotEmpty()
	@IsEmail()
	readonly email: string;

	@IsNotEmpty()
	readonly password: string;
}
