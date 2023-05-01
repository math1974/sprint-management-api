import { UserEntity } from '@app/entities';
import { Module } from '@nestjs/common';
import { AuthController } from '@app/controllers';
import { AuthService } from '@app/services';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
	controllers: [AuthController],
	providers: [AuthService]
})
export default class AuthModule {}
