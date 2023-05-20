import { UsePipes, Body, Controller, Post, ValidationPipe, Get, UseGuards, Put } from '@nestjs/common';
import { AuthGuard } from '@app/guards';
import { UserEntity } from '@app/entities';
import { UserInterfaces } from '@app/types';
import { UserService } from '@app/services';
import { User } from '@app/decorators/user.decorator';
import { upsertUserDto } from '@app/dtos/user.dto';

@Controller('users')
@UsePipes(new ValidationPipe())
export default class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	create(@Body('user') user: upsertUserDto): Promise<UserInterfaces.CreateUser> {
		return this.userService.create(user);
	}

	@Get()
	@UseGuards(AuthGuard)
	find(@User() user: UserEntity): Promise<UserEntity> {
		return this.userService.find(user);
	}

	@Put()
	@UseGuards(AuthGuard)
	update(@User('id') userId: number, @Body('user') changes: upsertUserDto): Promise<UserEntity> {
		return this.userService.update({
			filter: {
				id: userId
			},
			changes
		});
	}
}
