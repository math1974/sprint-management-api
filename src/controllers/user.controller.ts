import { UsePipes, Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { upsertUserDto } from '@app/dtos/user.dto';

import { UserService } from '@app/services';
import { UserInterfaces } from '@app/types';

@Controller('users')
@UsePipes(new ValidationPipe())
export default class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	create(@Body('user') user: upsertUserDto): Promise<UserInterfaces.CreateUser> {
		return this.userService.create(user);
	}
}
