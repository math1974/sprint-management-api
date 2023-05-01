import { UserEntity } from '@app/entities';
import { upsertUserDto } from '@app/dtos/user.dto';
import { ProfessionEnum } from '@app/enum';
import { AuthModule, UserModule } from '@app/modules';
import { HelperUtils } from '@app/tests/utils';
import { TestingModule } from '@nestjs/testing';
import { AuthService, UserService } from '@app/services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInterfaces } from '@app/types';
import { loginDto } from '@app/dtos/auth.dto';

describe('AuthService', () => {
	let service: AuthService;
	let userService: UserService;

	beforeAll(async () => {
		const app: TestingModule = await HelperUtils.createTestingModule({
			imports: [AuthModule, TypeOrmModule.forFeature([UserEntity]), UserModule]
		});

		service = app.get<AuthService>(AuthService);
		userService = app.get<UserService>(UserService);
	});

	beforeEach(async () => {
		await UserEntity.getRepository().clear();
	});

	afterAll(async () => {
		await UserEntity.getRepository().clear();
	});

	describe('#login', () => {
		describe('with email that is not registered', () => {
			it('shoud return NOT_FOUND', async () => {
				const userData: loginDto = {
					email: 'unexistent-email@email.com',
					password: 'FAKE_PASSWORD'
				};

				const emailNotFoundError = await service.login(userData).catch((e) => e);

				expect(emailNotFoundError).toMatchInlineSnapshot(`[HttpException: NOT_FOUND]`);
			});
		});

		describe('with valid data and the email is in database', () => {
			it('should return the user and token', async () => {
				const userData: upsertUserDto = {
					name: 'matheus',
					email: 'matheus.rbrm@gmail.com',
					password: 'matheus',
					profession: ProfessionEnum.DEVELOPER
				};

				const createUserResponse = await userService.create(userData);

				const loginResponse: UserInterfaces.CreateUser = await service.login({
					email: userData.email,
					password: userData.password
				});

				expect(loginResponse).toHaveProperty('token');

				expect(loginResponse).toMatchObject(createUserResponse);
			});
		});
	});
});
