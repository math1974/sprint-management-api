import { ExpressRequest } from '@app/types/request.types';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data: string | null, ctx: ExecutionContext) => {
	const req: ExpressRequest = ctx.switchToHttp().getRequest();

	if (!req.user) {
		return null;
	}

	if (data) {
		return req.user[data];
	}

	return req.user;
});
