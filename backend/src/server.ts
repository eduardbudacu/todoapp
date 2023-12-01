import express, { type Express } from 'express';
import cors from 'cors';
import auth from './routes/auth';
import todos from './routes/todos';

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use('/api', auth);
app.use('/api', todos);

export default app;
