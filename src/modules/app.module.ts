import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';

import { AuthModule, TagModule, UserModule } from '@app/modules';
import dbConfig from '@app/config/database';

@Module({
	imports: [TypeOrmModule.forRoot(dbConfig), TagModule, UserModule, AuthModule],
	controllers: [AppController],
	providers: [AppService]
})
export default class AppModule {}
