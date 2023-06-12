import { IsNotEmpty, Min } from 'class-validator';

export class upsertBoardDto {
	readonly id?: number;

	@IsNotEmpty()
	readonly title: string;

	readonly description: string;
}

export class findBoardDto {
	@IsNotEmpty()
	@Min(1)
	readonly boardId: number;

	@IsNotEmpty()
	@Min(1)
	readonly userId: number;
}

export class listBoardDto {
	@IsNotEmpty()
	@Min(1)
	readonly userId: number;
}
