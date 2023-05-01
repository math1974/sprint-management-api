import { UserEntity } from '@app/entities';
import { pick } from 'lodash';
import { upsertUserDto } from '@app/dtos/user.dto';
import { UserController } from '@app/controllers';
import { ProfessionEnum } from '@app/enum';
import { UserModule } from '@app/modules';
import { HelperUtils } from '@app/tests/utils';
import { TestingModule } from '@nestjs/testing';
import { UserService } from '@app/services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInterfaces } from '@app/types';
import { HttpException } from '@nestjs/common';

describe('UserService', () => {
	let service: UserService;

	beforeAll(async () => {
		const app: TestingModule = await HelperUtils.createTestingModule({
			imports: [UserModule, TypeOrmModule.forFeature([UserEntity])],
			controllers: [UserController],
			providers: [UserService]
		});

		service = app.get<UserService>(UserService);
	});

	beforeEach(async () => {
		await UserEntity.getRepository().clear();
	});

	afterAll(async () => {
		await UserEntity.getRepository().clear();
	});

	describe('#create', () => {
		describe('with email in use', () => {
			it('shoud return EMAIL_IN_USE error', async () => {
				const userData: upsertUserDto = {
					name: 'matheus',
					email: 'matheus.ribeiro@',
					password: 'matheus',
					profession: ProfessionEnum.DEVELOPER
				};

				await service.create(userData);

				const emailInUseError: HttpException = await service.create(userData).catch((e) => e);

				expect(emailInUseError).toMatchInlineSnapshot(`[HttpException: EMAIL_IN_USE]`);
			});
		});

		describe('with valid data and the email is not in database', () => {
			it('should return the user created', async () => {
				const userData: upsertUserDto = {
					name: 'matheus',
					email: 'matheus.ribeiro@a.com',
					password: 'matheus',
					profession: ProfessionEnum.DEVELOPER
				};

				const createdUser: UserInterfaces.CreateUser = await service.create(userData);

				expect(createdUser).toHaveProperty('token');

				expect(pick(createdUser, ['name', 'email', 'profession'])).toMatchObject(pick(userData, ['name', 'email', 'profession']));
			});
		});
	});
});
