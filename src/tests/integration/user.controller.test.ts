import * as request from 'supertest';
import { omit } from 'lodash';
import { HttpStatus, INestApplication } from '@nestjs/common';

import { createTestApplication } from '@app/tests/utils/helpers.utils';
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
		app = await createTestApplication();
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

	describe('GET /users', () => {
		describe('without token', () => {
			it('should return the unauthorized error', async () => {
				const { body: errorResponse }: request.Response = await request(app.getHttpServer()).get('/users').expect(HttpStatus.UNAUTHORIZED);

				expect(errorResponse.message).toMatchInlineSnapshot(`"UNAUTHORIZED"`);
			});
		});

		describe('with token of a non existent or deleted user', () => {
			it('should return the unauthorized error', async () => {
				const { body } = await request(app.getHttpServer()).post('/users').send({ user: createUserInfo }).expect(HttpStatus.CREATED);

				await UserEntity.update(body.id, { is_deleted: true });

				const { body: errorResponse }: request.Response = await request(app.getHttpServer())
					.get('/users')
					.set('Authorization', `Bearer ${body.token}`)
					.expect(HttpStatus.UNAUTHORIZED);

				expect(errorResponse.message).toMatchInlineSnapshot(`"UNAUTHORIZED"`);
			});
		});
	});

	describe('PUT /users', () => {
		describe('without token', () => {
			it('should return the unauthorized error', async () => {
				const { body: errorResponse }: request.Response = await request(app.getHttpServer()).put('/users').expect(HttpStatus.UNAUTHORIZED);

				expect(errorResponse.message).toMatchInlineSnapshot(`"UNAUTHORIZED"`);
			});
		});

		describe('with token of a non existent or deleted user', () => {
			it('should return the unauthorized error', async () => {
				const { body } = await request(app.getHttpServer()).post('/users').send({ user: createUserInfo }).expect(HttpStatus.CREATED);

				await UserEntity.update(body.id, { is_deleted: true });

				const { body: errorResponse }: request.Response = await request(app.getHttpServer())
					.put('/users')
					.set('Authorization', `Bearer ${body.token}`)
					.expect(HttpStatus.UNAUTHORIZED);

				expect(errorResponse.message).toMatchInlineSnapshot(`"UNAUTHORIZED"`);
			});
		});

		describe('with valid data', () => {
			describe('and the email is in use', () => {
				it('should return EMAIL_IN_USE error', async () => {
					await request(app.getHttpServer()).post('/users').send({ user: createUserInfo }).expect(HttpStatus.CREATED);

					const { body: secondUserResponse } = await request(app.getHttpServer())
						.post('/users')
						.send({ user: { ...createUserInfo, email: 'new-email@example.com' } })
						.expect(HttpStatus.CREATED);

					const { body: errorResponse }: request.Response = await request(app.getHttpServer())
						.put('/users')
						.send({ user: createUserInfo })
						.set('Authorization', `Bearer ${secondUserResponse.token}`)
						.expect(HttpStatus.CONFLICT);

					expect(errorResponse.message).toMatchInlineSnapshot(`"EMAIL_IN_USE"`);
				});
			});

			describe('and email is not in use', () => {
				it('should return the user updated', async () => {
					const { body: userResponse } = await request(app.getHttpServer()).post('/users').send({ user: createUserInfo }).expect(HttpStatus.CREATED);

					const { body: updateResponse }: request.Response = await request(app.getHttpServer())
						.put('/users')
						.send({ user: createUserInfo })
						.set('Authorization', `Bearer ${userResponse.token}`)
						.expect(HttpStatus.OK);

					expect(updateResponse).toMatchObject(omit(createUserInfo, ['password']));
				});
			});
		});
	});
});
