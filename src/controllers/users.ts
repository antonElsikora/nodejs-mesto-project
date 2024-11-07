import { Request, Response } from 'express';
import User, { IUser } from '../models/user';
import { RequestWithUser } from './cards';

export const updateUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { name, about } = req.body;
  const userId = (req as RequestWithUser).user._id;

  try {
    const user: IUser | null = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      res.status(404).send({ message: 'Пользователь не найден' });
      return;
    }

    res.status(200).send(user);
  } catch (err) {
    res.status(400).send({
      message: 'Переданы некорректные данные при обновлении профиля',
    });
  }
};

export const updateAvatar = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { avatar } = req.body;
  const userId = (req as RequestWithUser).user._id;

  try {
    const user: IUser | null = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      res.status(404).send({ message: 'Пользователь не найден' });
      return;
    }

    res.status(200).send(user);
  } catch (err) {
    res
      .status(400)
      .send({ message: 'Переданы некорректные данные при обновлении аватара' });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users: IUser[] = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Произошла ошибка при получении пользователей' });
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user: IUser | null = await User.findById(req.params.userId);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ message: 'Пользователь не найден' });
    }
  } catch (err) {
    res.status(400).send({ message: 'Некорректный _id пользователя' });
  }
};

export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
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
