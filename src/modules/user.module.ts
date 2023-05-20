import { UserController } from '@app/controllers';
import { UserEntity } from '@app/entities';
import { AuthGuard } from '@app/guards';
import { UserService } from '@app/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
	controllers: [UserController],
	providers: [UserService, AuthGuard],
	exports: [UserService, AuthGuard]
})
export default class UserModule {}
