import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { RequestWithUser } from './controllers/cards';
import errorHandler from './middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/mestodb').catch(() => {});

app.use((req: Request, res: Response, next: NextFunction) => {
  (req as RequestWithUser).user = {
    _id: '672c13e50aa1d6425d1aeb7a',
  };
  next();
});

app.use(express.json());
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use(errorHandler);

app.listen(PORT, () => {});
