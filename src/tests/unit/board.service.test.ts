import { BoardEntity, UserEntity } from '@app/entities';
import { pick, omit } from 'lodash';
import { EntityUtils, HelperUtils } from '@app/tests/utils';
import { TestingModule } from '@nestjs/testing';
import { BoardService } from '@app/services';
import { BoardInterfaces } from '@app/types';
import { clearDB } from '../utils/helpers.utils';

describe('BoardService', () => {
	let service: BoardService;
	let createdUser: UserEntity;

	const boardInfo = {
		title: 'title',
		description: 'description'
	};

	beforeAll(async () => {
		const app: TestingModule = await HelperUtils.createTestingModule();

		service = app.get<BoardService>(BoardService);
	});

	beforeEach(async () => {
		createdUser = await EntityUtils.createUser();
	});

	afterEach(async () => {
		await clearDB();
	});

	describe('#create', () => {
		describe('with valid data', () => {
			it('should return the board created', async () => {
				const boardData: BoardInterfaces.upsertBoard = {
					data: boardInfo,
					userId: createdUser.id
				};

				const createdBoard: BoardEntity = await service.create(boardData);

				const creationProps = ['title', 'description'];

				expect(pick(createdBoard, creationProps)).toMatchObject(pick(boardData, creationProps));
			});
		});
	});

	describe('#find', () => {
		describe('with unexistent id', () => {
			it('should return null', async () => {
				const board = await service.find({
					boardId: 9999,
					userId: createdUser.id
				});

				expect(board).toBeNull();
			});
		});

		describe('with valid id', () => {
			it('should return the user', async () => {
				const boardData: BoardInterfaces.upsertBoard = {
					data: boardInfo,
					userId: createdUser.id
				};

				const createdBoard: BoardEntity = await service.create(boardData);

				const board: BoardEntity = await service.find({
					boardId: createdBoard.id,
					userId: boardData.userId
				});

				expect(board).not.toBeNull();
				expect(board.id).toBe(createdBoard.id);
			});
		});
	});

	describe('#update', () => {
		describe('with unexistent id', () => {
			it('should return NOT_FOUND', async () => {
				const error = await service
					.update({
						filter: {
							boardId: 9999999,
							userId: createdUser.id
						},
						changes: boardInfo
					})
					.catch((r) => r);

				expect(error).toMatchInlineSnapshot(`[HttpException: NOT_FOUND]`);
			});
		});

		describe('with valid id', () => {
			describe('and invalid data', () => {
				it('should return VALIDATION ERROR', async () => {});
			});

			describe('and valid data', () => {
				it('should return the user updated', async () => {
					const boardData: BoardInterfaces.upsertBoard = {
						data: boardInfo,
						userId: createdUser.id
					};

					const boardCreated: BoardEntity = await service.create(boardData);

					const changes = {
						title: 'new title',
						description: 'new description'
					};

					const boardUpdated = await service.update({
						filter: {
							boardId: boardCreated.id,
							userId: boardData.userId
						},
						changes
					});

					expect(boardUpdated).toMatchObject(omit(changes, ['password']));
				});
			});
		});
	});
});
