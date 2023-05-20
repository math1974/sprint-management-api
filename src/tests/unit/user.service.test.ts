import { UserEntity } from '@app/entities';
import { pick, omit } from 'lodash';
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
import Profession from '@app/enum/profession.enum';

describe('UserService', () => {
	let service: UserService;

	const userInfo = {
		name: 'matheus',
		email: 'matheus.ribeiro@example.com',
		password: 'matheus',
		profession: ProfessionEnum.DEVELOPER
	};

	beforeAll(async () => {
		const app: TestingModule = await HelperUtils.createTestingModule({
			imports: [UserModule, TypeOrmModule.forFeature([UserEntity])],
			controllers: [UserController],
			providers: [UserService]
		});

		service = app.get<UserService>(UserService);
	});

	beforeEach(async () => {
		await UserEntity.clear();
	});

	afterAll(async () => {
		await UserEntity.clear();
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
				const userData: upsertUserDto = { ...userInfo };

				const createdUser: UserInterfaces.CreateUser = await service.create(userData);

				expect(createdUser).toHaveProperty('token');

				expect(pick(createdUser, ['name', 'email', 'profession'])).toMatchObject(pick(userData, ['name', 'email', 'profession']));
			});
		});
	});

	describe('#find', () => {
		describe('with unexistent id', () => {
			it('should return null', async () => {
				const user = await service.find({
					id: 99999
				});

				expect(user).toBeNull();
			});
		});

		describe('with valid id', () => {
			it('should return the user', async () => {
				const userData: upsertUserDto = {
					name: 'matheus',
					email: 'matheus.ribeiro@a.com',
					password: 'matheus',
					profession: ProfessionEnum.DEVELOPER
				};

				const createdUser: UserInterfaces.CreateUser = await service.create(userData);

				const user = await service.find({
					id: createdUser.id
				});

				expect(user).not.toBeNull();
				expect(user.id).toBe(createdUser.id);
			});
		});
	});

	describe('#update', () => {
		describe('with unexistent id', () => {
			it('should return NOT_FOUND', async () => {
				const error = await service
					.update({
						filter: {
							id: 9999999
						},
						changes: userInfo
					})
					.catch((r) => r);

				expect(error).toMatchInlineSnapshot(`[HttpException: NOT_FOUND]`);
			});
		});

		describe('with valid id', () => {
			describe('and email that is being used', () => {
				it('should return EMAIL_IN_USE', async () => {
					const firstUserInfo = {
						...userInfo,
						email: 'foo@bar.com'
					};

					await service.create(firstUserInfo);

					const secondUserCreated = await service.create({
						...userInfo,
						email: 'test@example.com'
					});

					const error = await service
						.update({
							filter: {
								id: secondUserCreated.id
							},
							changes: firstUserInfo
						})
						.catch((err) => err);

					expect(error).toMatchInlineSnapshot(`[HttpException: EMAIL_IN_USE]`);
				});
			});

			describe('and valid data', () => {
				it('should return the user updated', async () => {
					const userCreated = await service.create(userInfo);
					const changes = {
						name: 'new name',
						email: 'new.email@hotmail.com',
						profession: Profession.DESIGNER,
						password: 'new password'
					};

					const userUpdated = await service.update({
						filter: {
							id: userCreated.id
						},
						changes
					});

					expect(userUpdated).toMatchObject(omit(changes, ['password']));
				});
			});
		});
	});
});
