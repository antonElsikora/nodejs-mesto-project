import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized';
import { RequestWithUser } from '../controllers/cards';
import MESSAGES from '../utils/messages';

const { JWT_SECRET = 'some-secret-key' } = process.env;

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new UnauthorizedError(MESSAGES.USER.NEED_LOGIN));
  } else {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (typeof decoded === 'object' && '_id' in decoded) {
        (req as RequestWithUser).user = { _id: decoded._id as string };
        next();
      } else {
        next(new UnauthorizedError(MESSAGES.SYSTEM.INCORRECT_TOKEN));
      }
    } catch {
      next(new UnauthorizedError(MESSAGES.USER.NEED_LOGIN));
    }
  }
};

export default auth;
