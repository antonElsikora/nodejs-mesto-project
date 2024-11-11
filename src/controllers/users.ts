import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/user';
import { RequestWithUser } from './cards';
import NotFound from '../errors/not-found';
import BadRequest from '../errors/bad-request';
import ConflictError from '../errors/conflict';
import UnauthorizedError from '../errors/unauthorized';
import STATUS_CODES from '../utils/status-codes';
import MESSAGES from '../utils/messages';

import { ICustomError } from '../middlewares/error-handler';

const { JWT_SECRET = 'some-secret-key' } = process.env;

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
      next(new NotFound(MESSAGES.USER.NOT_FOUND));
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(new BadRequest(MESSAGES.USER.INVALID_UPDATE));
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
      next(new BadRequest(MESSAGES.USER.AVATAR_REQUIRED));
    } else {
      const user: IUser | null = await User.findByIdAndUpdate(
        userId,
        { avatar },
        { new: true, runValidators: true },
      );
      if (user) {
        res.status(STATUS_CODES.SUCCESS.OK).send(user);
      } else {
        next(new NotFound(MESSAGES.USER.NOT_FOUND));
      }
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(new BadRequest(MESSAGES.USER.INVALID_AVATAR));
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
      next(new NotFound(MESSAGES.USER.NOT_FOUND));
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      next(new BadRequest(MESSAGES.USER.INVALID_ID));
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
  const { name, about, avatar, email, password } = req.body;

  try {
    if (!email || !password) {
      next(new BadRequest(MESSAGES.USER.REQUIRED_CREDENTIALS));
    } else {
      const hash = await bcrypt.hash(password, 10);
      const user: IUser = await User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      });
      res.status(STATUS_CODES.SUCCESS.CREATED).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(new BadRequest(MESSAGES.USER.INVALID_CREATE));
    } else if ((err as ICustomError).code === 11000) {
      next(new ConflictError(MESSAGES.USER.EMAIL_EXISTS));
    } else {
      next(err);
    }
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      next(new BadRequest(MESSAGES.USER.REQUIRED_CREDENTIALS));
    } else {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        next(new UnauthorizedError(MESSAGES.USER.INVALID_CREDENTIALS));
      } else {
        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
          next(new UnauthorizedError(MESSAGES.USER.INVALID_CREDENTIALS));
        } else {
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: '7d',
          });
          res
            .cookie('jwt', token, {
              httpOnly: true,
              sameSite: true,
            })
            .status(STATUS_CODES.SUCCESS.OK)
            .send({ message: MESSAGES.USER.LOGIN_SUCCESS });
        }
      }
    }
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const userId = (req as RequestWithUser).user._id;
  try {
    const user = await User.findById(userId);
    if (user) {
      res.status(STATUS_CODES.SUCCESS.OK).send(user);
    } else {
      next(new NotFound(MESSAGES.USER.NOT_FOUND));
    }
  } catch (err) {
    next(err);
  }
};
