import { BoardController } from '@app/controllers';
import { BoardEntity, BoardUserEntity, TaskEntity, UserEntity } from '@app/entities';
import { AuthGuard } from '@app/guards';
import { BoardService } from '@app/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([BoardEntity, BoardUserEntity, UserEntity, TaskEntity])],
	controllers: [BoardController],
	exports: [BoardService],
	providers: [BoardService, AuthGuard]
})
export default class BoardModule {}
