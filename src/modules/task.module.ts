import { TaskController } from '@app/controllers';
import { BoardEntity, BoardUserEntity, TaskEntity, UserEntity } from '@app/entities';
import { AuthGuard } from '@app/guards';
import { TaskService } from '@app/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, BoardEntity, BoardUserEntity, TaskEntity])],
	controllers: [TaskController],
	providers: [TaskService, AuthGuard],
	exports: [TaskService, AuthGuard]
})
export default class TaskModule {}
