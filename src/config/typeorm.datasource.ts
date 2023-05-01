import { DataSource } from 'typeorm';

import dbConfig from './database';

export default new DataSource(dbConfig);
