import { ExpressRequest } from '@app/types/request.types';
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export default class AuthGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<ExpressRequest>();

		if (request.user) {
			return true;
		}

		throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
	}
}
