import { upsertUserDto, findUserDto } from '@app/dtos/user.dto';
import { UserEntity } from '@app/entities';
import { UserInterfaces } from '@app/types';
import { AuthUtils } from '@app/utils';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export default class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) {}

	async find(filter: findUserDto): Promise<UserEntity> {
		return await this.userRepository.findOne({
			where: {
				id: filter.id,
				is_deleted: false
			},
			select: ['id', 'name', 'email', 'profession', 'created_at']
		});
	}

	async create(data: upsertUserDto): Promise<UserInterfaces.CreateUser> {
		const isEmailInUse = await this.userRepository.count({
			where: {
				email: data.email
			}
		});

		if (isEmailInUse) {
			throw new HttpException('EMAIL_IN_USE', HttpStatus.CONFLICT);
		}

		const user = new UserEntity();

		Object.assign(user, data);

		const userCreated: UserEntity = await this.userRepository.save(user);

		return {
			id: userCreated.id,
			name: userCreated.name,
			email: userCreated.email,
			profession: userCreated.profession,
			token: AuthUtils.generateBearerToken({
				id: userCreated.id,
				name: userCreated.name,
				email: userCreated.email
			})
		};
	}

	async update({ filter, changes }: { filter: findUserDto; changes: upsertUserDto }): Promise<UserEntity> {
		const isEmailInUse = await this.userRepository
			.createQueryBuilder()
			.where('email = :email and id <> :id', { email: changes.email, id: filter.id })
			.getCount();

		if (isEmailInUse) {
			throw new HttpException('EMAIL_IN_USE', HttpStatus.CONFLICT);
		}

		const user = await this.find(filter);

		if (!user) {
			throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
		}

		Object.assign(user, changes);

		await this.userRepository.save(user);

		return this.find(filter);
	}
}
