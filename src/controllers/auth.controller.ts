import { UsePipes, Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { loginDto } from '@app/dtos/auth.dto';

import { AuthService } from '@app/services';
import { AuthInterfaces } from '@app/types';

@Controller('auth')
@UsePipes(new ValidationPipe())
export default class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/login')
	create(@Body() data: loginDto): Promise<AuthInterfaces.Login> {
		return this.authService.login(data);
	}
}
