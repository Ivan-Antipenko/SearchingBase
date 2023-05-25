import { Router } from 'express';
import { createUser, login } from '../controllers/users';

const authRouter = Router();
export default authRouter;

authRouter.post('/signup', createUser);
authRouter.post('/signin', login);
