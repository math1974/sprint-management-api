import { UsePipes, Body, Controller, Post, ValidationPipe, Get, UseGuards, Put, Param, Query } from '@nestjs/common';
import { AuthGuard } from '@app/guards';
import { TaskEntity } from '@app/entities';
import { TaskService } from '@app/services';
import { User } from '@app/decorators/user.decorator';
import { listQueryDto, upsertTaskDto } from '@app/dtos/task.dto';

@Controller('tasks')
@UseGuards(AuthGuard)
@UsePipes(new ValidationPipe())
export default class TaskController {
	constructor(private readonly taskService: TaskService) {}

	@Post()
	create(@User('id') userId: number, @Body('task') data: upsertTaskDto): Promise<TaskEntity> {
		return this.taskService.create({
			userId,
			data
		});
	}

	@Get()
	async list(@User('id') userId: number, @Query() queryParams: listQueryDto): Promise<TaskEntity[]> {
		return await this.taskService.list({ userId, boardId: queryParams.board_id });
	}

	@Get('/:id')
	@UsePipes(new ValidationPipe())
	find(@User('id') userId: number, @Param('id') taskId: number): Promise<TaskEntity> {
		return this.taskService.find({ taskId, userId });
	}

	@Put()
	update(@User('id') userId: number, @Param('id') taskId: number, @Body('task') changes: upsertTaskDto): Promise<TaskEntity> {
		return this.taskService.update({
			filter: {
				userId,
				taskId
			},
			changes
		});
	}
}
