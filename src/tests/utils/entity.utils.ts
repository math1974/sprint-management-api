import { ProfessionEnum } from '@app/enum';
import { UserEntity } from '@app/entities';
import { UserInterfaces } from '@app/types';
import { AuthUtils } from '@app/utils';

const fakeUserInfo = {
	name: 'matheus',
	email: 'matheus.ribeiro@example.com',
	password: 'matheus',
	profession: ProfessionEnum.DEVELOPER
};

export const createUser = async (additionalProperties?: object | undefined): Promise<UserEntity> => {
	const defaultUserInfo = {
		...fakeUserInfo,
		...(additionalProperties || {})
	};

	const user = new UserEntity();

	Object.assign(user, defaultUserInfo);

	return UserEntity.getRepository().save(user);
};

export const createAndAuthenticateUser = async (user: object = fakeUserInfo): Promise<UserInterfaces.CreateUser> => {
	const userCreated = await createUser(user);

	return {
		...userCreated,
		token: AuthUtils.generateBearerToken({
			id: userCreated.id,
			name: userCreated.name,
			email: userCreated.email
		})
	};
};
