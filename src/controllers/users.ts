import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/user';
import { RequestWithUser } from './cards';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { name, about } = req.body;
  const userId = (req as RequestWithUser).user._id;

  try {
    const user: IUser | null = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (user) {
      res.status(200).send(user);
    } else {
      next(new NotFoundError('Пользователь с указанным _id не найден.'));
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(
        new BadRequestError(
          'Переданы некорректные данные при обновлении профиля.',
        ),
      );
    } else {
      next(err);
    }
  }
};

export const updateAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { avatar } = req.body;
  const userId = (req as RequestWithUser).user._id;

  try {
    if (!avatar) {
      next(new BadRequestError('Поле "avatar" обязательно.'));
    } else {
      const user: IUser | null = await User.findByIdAndUpdate(
        userId,
        { avatar },
        { new: true, runValidators: true },
      );
      if (user) {
        res.status(200).send(user);
      } else {
        next(new NotFoundError('Пользователь с указанным _id не найден.'));
      }
    }
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      next(
        new BadRequestError(
          'Переданы некорректные данные при обновлении аватара.',
        ),
      );
    } else {
      next(err);
    }
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users: IUser[] = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user: IUser | null = await User.findById(req.params.userId);
    if (user) {
      res.status(200).send(user);
    } else {
      next(new NotFoundError('Пользователь с указанным _id не найден.'));
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      next(
        new BadRequestError('Некорректный формат идентификатора пользователя'),
      );
    } else {
      next(err);
    }
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { name, about, avatar } = req.body;

  try {
    const user: IUser = await User.create({ name, about, avatar });
    res.status(201).send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(
        new BadRequestError(
          'Переданы некорректные данные при создании пользователя',
        ),
      );
    } else {
      next(err);
    }
  }
};
