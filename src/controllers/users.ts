// src/controllers/users.ts
import { Request, Response } from 'express';
import User, { IUser } from '../models/user';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users: IUser[] = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Произошла ошибка при получении пользователей' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user: IUser | null = await User.findById(req.params.userId);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ message: 'Пользователь не найден' });
    }
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Произошла ошибка при получении пользователя' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  try {
    const user: IUser = await User.create({ name, about, avatar });
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send({
      message: 'Переданы некорректные данные при создании пользователя',
    });
  }
};
