import { config } from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

if (process.env.NODE_ENV !== 'production') {
  config({ path: `${__dirname}/../../.env.${process.env.NODE_ENV}` });
}

const dbConfig: PostgresConnectionOptions = {
	type: 'postgres',
	port: Number(process.env.DB_PORT),
	password: process.env.DB_PASSWORD,
	username: process.env.DB_USER,
	database: process.env.DB_NAME,
	host: process.env.DB_HOST,
	entities: [`${__dirname}/../entities/*.entity{.ts, .js}`],
	migrations: [`${__dirname}/../migrations/**{.ts, .js}`],
	synchronize: false
};

export default dbConfig;
