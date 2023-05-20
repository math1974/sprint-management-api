import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { ExpressRequest } from '@app/types/request.types';
import { AuthUtils } from '@app/utils';
import { UserService } from '@app/services';
import { UserEntity } from '@app/entities';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export default class AuthMiddleware implements NestMiddleware {
	constructor(private readonly userService: UserService) {}

	async use(req: ExpressRequest, res: Response, next: NextFunction) {
		if (req.headers.authorization) {
			const token: string = AuthUtils.getBearerToken(req);

			const decodedToken: JwtPayload | string = AuthUtils.decryptToken(token);

			if (decodedToken && typeof decodedToken !== 'string' && decodedToken.iss) {
				const user: UserEntity = await this.userService.find({
					id: ~~decodedToken.iss
				});

				req.user = user;
			}
		} else {
			req.user = null;
		}

		next();
	}
}
