import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import dbConfig from '@app/config/database';
import { AuthModule, TagModule, UserModule } from '@app/modules';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

async function setup(): Promise<boolean> {
	const app = await Test.createTestingModule({
		imports: [TypeOrmModule.forRoot(dbConfig), TagModule, UserModule, AuthModule],
		controllers: [AppController],
		providers: [AppService]
	});

	return app;
}

export default setup;
