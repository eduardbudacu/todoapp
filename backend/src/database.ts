import { DataSource } from 'typeorm';
import { join } from 'path';

export const myDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [join(__dirname, 'entities', '*.{ts,js}')],
  logging: true,
  synchronize: true
});
