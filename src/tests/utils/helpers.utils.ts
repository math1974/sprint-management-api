import dbConfig from '@app/config/database';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INestApplication, Module } from '@nestjs/common';
import { AppModule, AuthModule, TagModule, UserModule } from '@app/modules';

@Module({
	imports: [TypeOrmModule.forRoot(dbConfig), TagModule, UserModule, AuthModule],
	controllers: [AppController],
	providers: [AppService]
})
class E2eTestModule extends AppModule {}

export const createTestApplication = async (): Promise<INestApplication> => {
	const moduleFixture: TestingModule = await createTestingModule();

	const app: INestApplication = moduleFixture.createNestApplication();

	await app.init();

	return app;
};

export const createTestingModule = async (): Promise<TestingModule> => {
	return await Test.createTestingModule({
		imports: [E2eTestModule]
	}).compile();
};
