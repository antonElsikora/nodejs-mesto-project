import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { RequestWithUser } from './controllers/cards';

const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('Успешно подключились к базе данных'))
  .catch((error) => console.error('Ошибка подключения к базе данных:', error));

app.use((req: Request, res: Response, next: NextFunction) => {
  (req as RequestWithUser).user = {
    _id: 'ваш_идентификатор',
  };
  next();
});

app.use(express.json());
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
