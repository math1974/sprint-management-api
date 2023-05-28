import { findTaskDto, listTaskDto, upsertTaskDto } from '@app/dtos/task.dto';
import { TaskEntity } from '@app/entities';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export default class TaskService {
	constructor(
		@InjectRepository(TaskEntity)
		private readonly taskRepository: Repository<TaskEntity>
	) {}

	async find(filter: findTaskDto): Promise<TaskEntity> {
		return await this.taskRepository.findOne({
			where: {
				id: filter.taskId,
				is_deleted: false
			},
			select: ['id', 'title', 'status', 'content', 'board', 'created_at']
		});
	}

	async list(filter: listTaskDto): Promise<TaskEntity[]> {
		return this.taskRepository.find({
			where: {
				board_id: filter.boardId,
				is_deleted: false
			},
			order: {
				created_at: 'ASC'
			},
			select: ['id', 'title', 'status', 'content', 'status', 'created_at']
		});
	}

	async create({ userId, data }: { userId: number; data: upsertTaskDto }): Promise<TaskEntity> {
		const task = new TaskEntity();

		Object.assign(task, {
			...data,
			creator_id: userId
		});

		const taskCreated: TaskEntity = await this.taskRepository.save(task);

		return this.find({
			userId,
			taskId: taskCreated.id
		});
	}

	async update({ filter, changes }: { filter: findTaskDto; changes: upsertTaskDto }): Promise<TaskEntity> {
		const task: TaskEntity = await this.find(filter);

		if (!task) {
			throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
		}

		Object.assign(task, changes);

		await this.taskRepository.save(task);

		return this.find(filter);
	}
}
