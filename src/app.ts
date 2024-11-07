import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';

const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('Успешно подключились к базе данных'))
  .catch((error) => console.error('Ошибка подключения к базе данных:', error));

app.use(express.json());
app.use('/', usersRouter);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
