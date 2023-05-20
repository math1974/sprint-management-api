import { JwtPayload } from 'jsonwebtoken';

export interface Login {
	id: number;
	name: string;
	email: string;
	profession: string;
	token: string;
}

export type BearerTokenInterface = {
	id: number;
	name: string;
	email: string;
};

export interface JwtPayloadInterface extends JwtPayload {
	user: BearerTokenInterface;
}
