import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { RequestWithUser } from './controllers/cards';
import errorHandler from './middlewares/error-handler';
import loadEnv from './utils/env-loader';
import { login, createUser } from './controllers/users';

loadEnv();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const MONGO_URI = process.env.MONGO_URI as string;

mongoose.connect(MONGO_URI).catch(() => {});

app.use((req: Request, res: Response, next: NextFunction) => {
  (req as RequestWithUser).user = {
    _id: '672c13e50aa1d6425d1aeb7a',
  };
  next();
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(express.json());
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use(errorHandler);

app.listen(PORT, () => {});
