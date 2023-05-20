import { UserEntity } from '@app/entities';
import { Request } from 'express';

export interface ExpressRequest extends Request {
	user?: UserEntity;
}
