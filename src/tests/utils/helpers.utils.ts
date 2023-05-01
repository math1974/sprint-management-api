import dbConfig from '@app/config/database';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';

type createModuleInterface = {
	imports?: any[];
	controllers?: any[];
	providers?: any[];
};

export const createTestApplication = async ({ imports = [], controllers = [], providers = [] }: createModuleInterface): Promise<INestApplication> => {
	const moduleFixture: TestingModule = await createTestingModule({
		imports,
		controllers,
		providers
	});

	const app: INestApplication = moduleFixture.createNestApplication();

	await app.init();

	return app;
};

export const createTestingModule = async ({ imports = [], controllers = [], providers = [] }: createModuleInterface): Promise<TestingModule> => {
	return await Test.createTestingModule({
		imports: [TypeOrmModule.forRoot(dbConfig), ...imports],
		controllers: [AppController, ...controllers],
		providers: [AppService, ...providers]
	}).compile();
};
