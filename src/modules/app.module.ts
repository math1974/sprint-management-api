import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';

import dbConfig from '@app/config/database';
import { AuthMiddleware } from '@app/middlewares';
import { AuthModule, TagModule, UserModule } from '@app/modules';

@Module({
	imports: [TypeOrmModule.forRoot(dbConfig), TagModule, UserModule, AuthModule],
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
