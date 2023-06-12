import { UsePipes, Body, Controller, Post, ValidationPipe, Get, UseGuards, Put, Param } from '@nestjs/common';
import { AuthGuard } from '@app/guards';
import { BoardEntity } from '@app/entities';
import { BoardService } from '@app/services';
import { User } from '@app/decorators/user.decorator';
import { upsertBoardDto } from '@app/dtos/board.dto';

@Controller('boards')
@UseGuards(AuthGuard)
@UsePipes(new ValidationPipe())
export default class BoardController {
	constructor(private readonly boardService: BoardService) {}

	@Post()
	create(@User('id') userId: number, @Body('board') data: upsertBoardDto): Promise<BoardEntity> {
		return this.boardService.create({
			userId,
			data
		});
	}

	@Get()
	list(@User('id') userId: number): Promise<BoardEntity[]> {
		return this.boardService.list({ userId });
	}

	@Get('/:id')
	find(@User('id') userId: number, @Param('id') boardId: number): Promise<BoardEntity> {
		return this.boardService.find({ boardId, userId });
	}

	@Put('/:id')
	update(@User('id') userId: number, @Param('id') boardId: number, @Body('board') changes: upsertBoardDto): Promise<BoardEntity> {
		return this.boardService.update({
			filter: {
				userId,
				boardId
			},
			changes
		});
	}
}
