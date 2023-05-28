import { StatusEnum } from '@app/enum';
import { CastUtils } from '@app/utils';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, Min } from 'class-validator';

export class upsertTaskDto {
	readonly id: number;

	@IsNotEmpty()
	@Min(1)
	readonly board_id: number;

	@IsNotEmpty()
	readonly title: string;

	readonly content: string;

	@IsNotEmpty()
	@IsEnum(StatusEnum)
	readonly status: StatusEnum;
}

export class findTaskDto {
	@IsNotEmpty()
	@Min(1)
	readonly taskId: number;

	@IsNotEmpty()
	@Min(1)
	readonly userId: number;
}

export class listTaskDto {
	@IsNotEmpty()
	@Min(1)
	readonly userId: number;

	@IsNotEmpty()
	@Min(1)
	readonly boardId: number;
}

export class listQueryDto {
	@Transform(CastUtils.toInteger)
	@IsNotEmpty()
	@Min(1)
	readonly board_id: number;
}
