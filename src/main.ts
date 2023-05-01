if (process.env.NODE_ENV === 'production') {
	require('module-alias/register');
}

import { NestFactory } from '@nestjs/core';
import AppModule from './modules/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes();

	await app.listen(3000);
}
bootstrap();
