import { compareSync } from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { AuthUtils } from '@app/utils';
import { UserEntity } from '@app/entities';
import { AuthInterfaces } from '@app/types';
import { loginDto } from '@app/dtos/auth.dto';

@Injectable()
export default class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) {}

	async login(data: loginDto): Promise<AuthInterfaces.Login> {
		let user: UserEntity = await this.userRepository.findOne({
			where: {
				email: data.email
			},
			select: ['id', 'name', 'email', 'password', 'profession']
		});

		if (!user) {
			const fakeUser: UserEntity = new UserEntity();

			fakeUser.id = 1;
			fakeUser.password = 'FAKE_PASSWORD';

			user = fakeUser;
		}

		const isValidPassword = compareSync(data.password, user.password);

		if (!isValidPassword) {
			throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
		}

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			profession: user.profession,
			token: AuthUtils.generateBearerToken({
				id: user.id,
				name: user.name,
				email: user.email
			})
		};
	}
}
