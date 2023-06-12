import { ProfessionEnum } from '@app/enum';
import { UserEntity } from '@app/entities';

export const createUser = async (additionalProperties?: object | undefined): Promise<UserEntity> => {
	const defaultUserInfo = {
		name: 'matheus',
		email: 'matheus.ribeiro@example.com',
		password: 'matheus',
		profession: ProfessionEnum.DEVELOPER,
		...(additionalProperties || {})
	};

	const user = new UserEntity();

	Object.assign(user, defaultUserInfo);

	return UserEntity.getRepository().save(user);
};
