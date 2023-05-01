import dbConfig from '@app/config/database';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

type createModuleInterface = {
	imports?: any[];
	controllers?: any[];
	providers?: any[];
};

export const createTestingModule = async ({ imports = [], controllers = [], providers = [] }: createModuleInterface): Promise<TestingModule> => {
	return await Test.createTestingModule({
		imports: [TypeOrmModule.forRoot(dbConfig), ...imports],
		controllers: [AppController, ...controllers],
		providers: [AppService, ...providers]
	}).compile();
};
