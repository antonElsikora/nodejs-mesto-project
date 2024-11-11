import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import errorHandler from './middlewares/error-handler';
import loadEnv from './utils/env-loader';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';

loadEnv();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const MONGO_URI = process.env.MONGO_URI as string;

mongoose.connect(MONGO_URI).catch(() => {});

app.use(express.json());
app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use(errorHandler);

app.listen(PORT, () => {});
