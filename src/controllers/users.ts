import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/user';
import { RequestWithUser } from './cards';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';
import STATUS_CODES from '../utils/statusCodes';
import MESSAGES from '../utils/messages';

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
      res.status(STATUS_CODES.SUCCESS.OK).send(user);
    } else {
      next(new NotFoundError(MESSAGES.USER.NOT_FOUND));
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(new BadRequestError(MESSAGES.USER.INVALID_UPDATE));
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
      next(new BadRequestError(MESSAGES.USER.AVATAR_REQUIRED));
    } else {
      const user: IUser | null = await User.findByIdAndUpdate(
        userId,
        { avatar },
        { new: true, runValidators: true },
      );
      if (user) {
        res.status(STATUS_CODES.SUCCESS.OK).send(user);
      } else {
        next(new NotFoundError(MESSAGES.USER.NOT_FOUND));
      }
    }
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(MESSAGES.USER.INVALID_AVATAR));
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
    res.status(STATUS_CODES.SUCCESS.OK).send(users);
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
      res.status(STATUS_CODES.SUCCESS.OK).send(user);
    } else {
      next(new NotFoundError(MESSAGES.USER.NOT_FOUND));
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      next(new BadRequestError(MESSAGES.USER.INVALID_ID));
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
    res.status(STATUS_CODES.SUCCESS.CREATED).send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(new BadRequestError(MESSAGES.USER.INVALID_CREATE));
    } else {
      next(err);
    }
  }
};
