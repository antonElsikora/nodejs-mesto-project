import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errors } from 'celebrate';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import errorHandler from './middlewares/error-handler';
import loadEnv from './utils/env-loader';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import notFound from './middlewares/notFound';
import { signupValidation, loginValidation } from './validators/authValidation';

loadEnv();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mestodb';

mongoose.connect(MONGO_URI).catch(() => {});

app.use(express.json());
app.use(cookieParser());
const corsAllowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];
app.use(
  cors({
    origin: corsAllowedOrigins,
    credentials: true,
  }),
);
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', loginValidation, login);
app.post('/signup', signupValidation, createUser);

app.use(auth);
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use(notFound);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {});
