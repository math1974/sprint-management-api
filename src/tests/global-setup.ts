import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import dbConfig from '@app/config/database';
import { AuthModule, UserModule } from '@app/modules';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

async function setup(): Promise<TestingModuleBuilder> {
	const app = await Test.createTestingModule({
		imports: [TypeOrmModule.forRoot(dbConfig), UserModule, AuthModule],
		controllers: [AppController],
		providers: [AppService]
	});

	return app;
}

export default setup;
