import { upsertBoardDto } from '@app/dtos/board.dto';

export interface upsertBoard {
	data: upsertBoardDto;
	userId: number;
}
