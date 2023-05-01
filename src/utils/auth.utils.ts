import { sign } from 'jsonwebtoken';
import environments from '@app/config/environments';

type BearerTokenInterface = {
	id: number;
	name: string;
	email: string;
};

export default class AuthUtils {
	public static generateBearerToken(data: BearerTokenInterface): string {
		return sign(
			{
				iss: data.id,
				user: data
			},
			environments.api_secret_key,
			{
				expiresIn: '24h'
			}
		);
	}
}
