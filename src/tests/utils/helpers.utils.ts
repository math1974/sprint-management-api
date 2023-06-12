import dbConfig from '@app/config/database';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INestApplication, Module } from '@nestjs/common';
import { AppModule, AuthModule, BoardModule, UserModule } from '@app/modules';
import typeormDatasource from '@app/config/typeorm.datasource';

@Module({
	imports: [TypeOrmModule.forRoot(dbConfig), UserModule, AuthModule, BoardModule],
	controllers: [AppController],
	providers: [AppService]
})
class E2eTestModule extends AppModule {}

export const createTestApplication = async (): Promise<INestApplication> => {
	const moduleFixture: TestingModule = await createTestingModule();

	const app: INestApplication = moduleFixture.createNestApplication();

	await app.init();

	await clearDB();

	return app;
};

export async function clearDB() {
	if (!typeormDatasource.isInitialized) {
		await typeormDatasource.initialize();
	}

	const entities = typeormDatasource.entityMetadatas;

	const truncateTablePromises = entities.map(async (entity) => {
		const repository = await typeormDatasource.getRepository(entity.name);

		return repository.query(`TRUNCATE ${entity.tableName} RESTART IDENTITY CASCADE;`);
	});

	await Promise.all(truncateTablePromises);

	return true;
}

export const createTestingModule = async (): Promise<TestingModule> => {
	return await Test.createTestingModule({
		imports: [E2eTestModule]
	}).compile();
};