import express, { type Express } from 'express';
import cors from 'cors';
import auth from './routes/auth';
import todos from './routes/todos';

import { myDataSource } from './database';
import { protect } from './modules/auth';

myDataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use('/api', auth);
app.use('/api', protect, todos);

export default app;
