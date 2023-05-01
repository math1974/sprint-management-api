import * as request from 'supertest';
import { omit } from 'lodash';
import { HttpStatus, INestApplication } from '@nestjs/common';

import { createTestApplication } from '@app/tests/utils/helpers.utils';
import { UserModule } from '@app/modules';
import { UserEntity } from '@app/entities';
import { ProfessionEnum } from '@app/enum';

describe('UserController', () => {
	let app: INestApplication;

	const createUserInfo = {
		name: 'name',
		password: 'password',
		email: 'email@example.com',
		profession: ProfessionEnum.DEVELOPER
	};

	beforeEach(async () => {
		await UserEntity.clear();
	});

	beforeAll(async () => {
		app = await createTestApplication({
			imports: [UserModule]
		});
	});

	describe('POST /users', () => {
		describe('with invalid email', () => {
			it('should return validation error', async () => {
				const errorResponse: request.Response = await request(app.getHttpServer())
					.post('/users')
					.send({
						user: {
							...createUserInfo,
							email: null
						}
					})
					.expect(HttpStatus.BAD_REQUEST);

				expect(errorResponse.text).toMatchInlineSnapshot(
					`"{"statusCode":400,"message":["email must be an email","email should not be empty"],"error":"Bad Request"}"`
				);
			});
		});

		describe('with invalid password', () => {
			it('should return validation error', async () => {
				const errorResponse: request.Response = await request(app.getHttpServer())
					.post('/users')
					.send({
						user: {
							...createUserInfo,
							password: null
						}
					})
					.expect(HttpStatus.BAD_REQUEST);

				expect(errorResponse.text).toMatchInlineSnapshot(`"{"statusCode":400,"message":["password should not be empty"],"error":"Bad Request"}"`);
			});
		});

		describe('with invalid name', () => {
			it('should return validation error', async () => {
				const errorResponse: request.Response = await request(app.getHttpServer())
					.post('/users')
					.send({
						user: {
							...createUserInfo,
							name: null
						}
					})
					.expect(HttpStatus.BAD_REQUEST);

				expect(errorResponse.text).toMatchInlineSnapshot(`"{"statusCode":400,"message":["name should not be empty"],"error":"Bad Request"}"`);
			});
		});

		describe('with invalid profession', () => {
			it('should return validation error', async () => {
				const errorResponse: request.Response = await request(app.getHttpServer())
					.post('/users')
					.send({
						user: {
							...createUserInfo,
							profession: null
						}
					})
					.expect(HttpStatus.BAD_REQUEST);

				expect(errorResponse.text).toMatchInlineSnapshot(
					`"{"statusCode":400,"message":["profession must be one of the following values: DEVELOPER, PRODUCT_MANAGER, DESIGNER, OTHERS","profession should not be empty"],"error":"Bad Request"}"`
				);
			});
		});

		describe('with email in use', () => {
			it('should return EMAIL_IN_USE', async () => {
				await request(app.getHttpServer()).post('/users').send({
					user: createUserInfo
				});

				const errorResponse: request.Response = await request(app.getHttpServer())
					.post('/users')
					.send({
						user: {
							...createUserInfo
						}
					})
					.expect(HttpStatus.CONFLICT);

				expect(errorResponse.text).toMatchInlineSnapshot(`"{"statusCode":409,"message":"EMAIL_IN_USE"}"`);
			});
		});

		describe('with valid data and email is not in use', () => {
			it('should return the user created', async () => {
				const response: request.Response = await request(app.getHttpServer())
					.post('/users')
					.send({
						user: createUserInfo
					})
					.expect(HttpStatus.CREATED);

				expect(response.body).toHaveProperty('token');
				expect(response.body).toMatchObject(omit(createUserInfo, ['password']));
			});
		});
	});
});
