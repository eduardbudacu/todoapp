import { Router } from 'express';
import { login, register } from '../controllers/auth';

const auth = Router();

auth.post('/login', login);
auth.post('/users', register);

export default auth;
