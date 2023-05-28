import { listBoardDto, findBoardDto, upsertBoardDto } from '@app/dtos/board.dto';
import { BoardEntity, BoardUserEntity } from '@app/entities';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export default class UserService {
	constructor(
		@InjectRepository(BoardEntity)
		private readonly boardRepository: Repository<BoardEntity>,
		@InjectRepository(BoardUserEntity)
		private readonly boardUserRepository: Repository<BoardUserEntity>
	) {}

	async find(filter: findBoardDto): Promise<BoardEntity> {
		return await this.boardRepository.findOne({
			where: {
				id: filter.boardId,
				is_deleted: false
			},
			select: ['id', 'title', 'description', 'created_at']
		});
	}

	async list(filter: listBoardDto): Promise<BoardEntity[]> {
		return this.boardRepository.find({
			where: {
				creator_id: filter.userId,
				is_deleted: false
			},
			order: {
				created_at: 'ASC'
			},
			select: ['id', 'title', 'description', 'created_at']
		});
	}

	async create({ userId, data }: { userId: number; data: upsertBoardDto }): Promise<BoardEntity> {
		const board = new BoardEntity();

		Object.assign(board, {
			...data,
			creator_id: userId
		});

		const boardCreated: BoardEntity = await this.boardRepository.save(board);

		const boardUser = new BoardUserEntity();

		Object.assign(boardUser, {
			user_id: userId,
			creator_id: userId,
			board_id: boardCreated.id
		});

		await this.boardUserRepository.save(boardUser);

		return this.find({
			userId,
			boardId: boardCreated.id
		});
	}

	async update({ filter, changes }: { filter: findBoardDto; changes: upsertBoardDto }): Promise<BoardEntity> {
		const board: BoardEntity = await this.find(filter);

		if (!board) {
			throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
		}

		Object.assign(board, changes);

		await this.boardRepository.save(board);

		return this.find(filter);
	}
}
