import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';

import dbConfig from '@app/config/database';
import { AuthMiddleware } from '@app/middlewares';
import { AuthModule, BoardModule, TagModule, UserModule, TaskModule } from '@app/modules';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			...dbConfig,
			autoLoadEntities: true
		}),
		TagModule,
		UserModule,
		AuthModule,
		BoardModule,
		TaskModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export default class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes({
			path: '*',
			method: RequestMethod.ALL
		});
	}
}
