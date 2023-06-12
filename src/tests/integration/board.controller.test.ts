import * as request from 'supertest';
import { pick, omit } from 'lodash';
import { HttpStatus, INestApplication } from '@nestjs/common';

import { clearDB, createTestApplication } from '@app/tests/utils/helpers.utils';
import { EntityUtils } from '../utils';
import { UserInterfaces } from '@app/types';

describe('BoardController', () => {
	let app: INestApplication;
	let createdUser: UserInterfaces.CreateUser;

	const createBoardInfo = {
		title: 'title',
		description: 'description'
	};

	afterEach(async () => {
		await clearDB();
	});

	beforeEach(async () => {
		createdUser = await EntityUtils.createAndAuthenticateUser();
	});

	beforeAll(async () => {
		app = await createTestApplication();
	});

	describe('POST /boards', () => {
		describe('without token', () => {
			it('should return authentication error', async () => {
				const errorResponse: request.Response = await request(app.getHttpServer()).post('/boards').send().expect(HttpStatus.UNAUTHORIZED);

				expect(errorResponse.text).toMatchInlineSnapshot(`"{"statusCode":401,"message":"UNAUTHORIZED"}"`);
			});
		});

		describe('without title', () => {
			it('should return validation error', async () => {
				const errorResponse: request.Response = await request(app.getHttpServer())
					.post('/boards')
					.send({
						board: {
							description: 'description'
						}
					})
					.set('Authorization', `Bearer ${createdUser.token}`)
					.expect(HttpStatus.BAD_REQUEST);

				expect(errorResponse.text).toMatchInlineSnapshot(`"{"statusCode":400,"message":["title should not be empty"],"error":"Bad Request"}"`);
			});
		});

		describe('with valid data', () => {
			it('should return the board created', async () => {
				const response: request.Response = await request(app.getHttpServer())
					.post('/boards')
					.send({
						board: createBoardInfo
					})
					.set('Authorization', `Bearer ${createdUser.token}`)
					.expect(HttpStatus.CREATED);

				expect(response.body).toMatchObject({
					...omit(createBoardInfo),
					creator_id: createdUser.id
				});
			});
		});
	});

	describe('GET /boards', () => {
		describe('without token', () => {
			it('should return authentication error', async () => {
				const { body: errorResponse }: request.Response = await request(app.getHttpServer()).get('/boards').expect(HttpStatus.UNAUTHORIZED);

				expect(errorResponse.message).toMatchInlineSnapshot(`"UNAUTHORIZED"`);
			});
		});

		describe('with valid user', () => {
			describe('without boards created', () => {
				it('should return an empty list', async () => {
					const { body: boards }: request.Response = await request(app.getHttpServer())
						.get('/boards')
						.set('Authorization', `Bearer ${createdUser.token}`)
						.expect(HttpStatus.OK);

					expect(boards).toHaveLength(0);
				});
			});

			describe('with boards created', () => {
				it('should return the boards created ordered alphabetically', async () => {
					const [{ body: firstBoard }, { body: secondBoard }]: request.Response[] = await Promise.all([
						request(app.getHttpServer())
							.post('/boards')
							.send({
								board: {
									...createBoardInfo,
									title: 'A - BOARD'
								}
							})
							.set('Authorization', `Bearer ${createdUser.token}`)
							.expect(HttpStatus.CREATED),
						request(app.getHttpServer())
							.post('/boards')
							.send({
								board: {
									...createBoardInfo,
									title: 'B - BOARD'
								}
							})
							.set('Authorization', `Bearer ${createdUser.token}`)
							.expect(HttpStatus.CREATED)
					]);

					const { body: boards }: request.Response = await request(app.getHttpServer())
						.get('/boards')
						.set('Authorization', `Bearer ${createdUser.token}`)
						.expect(HttpStatus.OK);

					expect(boards).toHaveLength(2);
					expect(boards[0]).toMatchObject(pick(firstBoard, ['id', 'title', 'description']));
					expect(boards[1]).toMatchObject(pick(secondBoard, ['id', 'title', 'description']));
				});
			});
		});
	});

	describe('GET /boards/:id', () => {
		describe('without token', () => {
			it('should return authentication error', async () => {
				const { body: errorResponse }: request.Response = await request(app.getHttpServer()).get('/boards/1').expect(HttpStatus.UNAUTHORIZED);

				expect(errorResponse.message).toMatchInlineSnapshot(`"UNAUTHORIZED"`);
			});
		});

		describe('with unexistent board id', () => {
			it('should return NOT_FOUND error', async () => {
				const { body: errorResponse }: request.Response = await request(app.getHttpServer())
					.get('/boards/999999')
					.set('Authorization', `Bearer ${createdUser.token}`)
					.expect(HttpStatus.NOT_FOUND);

				expect(errorResponse.text).toMatchInlineSnapshot(`undefined`);
			});
		});

		describe('with valid id', () => {
			it('should return the board', async () => {
				const { body: createdBoardResponse } = await request(app.getHttpServer())
					.post('/boards')
					.send({
						board: createBoardInfo
					})
					.set('Authorization', `Bearer ${createdUser.token}`)
					.expect(HttpStatus.CREATED);

				const { body: findBoardResponse } = await request(app.getHttpServer())
					.get(`/boards/${createdBoardResponse.id}`)
					.set('Authorization', `Bearer ${createdUser.token}`)
					.expect(HttpStatus.OK);

				expect(findBoardResponse).toHaveProperty('id', createdBoardResponse.id);
			});
		});
	});

	describe('PUT /boards/:id', () => {
		describe('without token', () => {
			it('should return authentication error', async () => {
				const { body: errorResponse }: request.Response = await request(app.getHttpServer()).get('/boards/1').expect(HttpStatus.UNAUTHORIZED);

				expect(errorResponse.message).toMatchInlineSnapshot(`"UNAUTHORIZED"`);
			});
		});

		describe('with unexistent board id', () => {
			it('should return NOT_FOUND error', async () => {
				const { body: errorResponse }: request.Response = await request(app.getHttpServer())
					.put('/boards/999999')
					.send({ board: createBoardInfo })
					.set('Authorization', `Bearer ${createdUser.token}`)
					.expect(HttpStatus.NOT_FOUND);

				expect(errorResponse.text).toMatchInlineSnapshot(`undefined`);
			});
		});

		describe('with valid data', () => {
			it('should return the board updated', async () => {
				const { body: createdBoardResponse } = await request(app.getHttpServer())
					.post('/boards')
					.send({
						board: createBoardInfo
					})
					.set('Authorization', `Bearer ${createdUser.token}`)
					.expect(HttpStatus.CREATED);

				const boardChanges = {
					title: 'new title',
					description: 'new description'
				};

				const { body: updateResponse }: request.Response = await request(app.getHttpServer())
					.put(`/boards/${createdBoardResponse.id}`)
					.send({ board: boardChanges })
					.set('Authorization', `Bearer ${createdUser.token}`)
					.expect(HttpStatus.OK);

				expect(updateResponse).toMatchObject({
					id: createdBoardResponse.id,
					creator_id: createdBoardResponse.creator_id,
					...boardChanges
				});
			});
		});
	});
});
