import { ProfessionEnum } from '@app/enum';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class upsertUserDto {
	@IsNotEmpty()
	@IsEmail()
	readonly email: string;

	@IsNotEmpty()
	readonly password: string;

	@IsNotEmpty()
	readonly name: string;

	@IsNotEmpty()
	@IsEnum(ProfessionEnum)
	readonly profession: ProfessionEnum;
}

export class findUserDto {
	@IsNotEmpty()
	readonly id: number;
}
