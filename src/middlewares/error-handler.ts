import { Request, Response, NextFunction } from 'express';
import STATUS_CODES from '../utils/status-codes';
import MESSAGES from '../utils/messages';

export interface ICustomError extends Error {
  statusCode?: number;
  code?: number;
}

const errorHandler = (
  err: ICustomError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const {
    statusCode = STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
    message,
  } = err;

  res.status(statusCode).send({
    message:
      statusCode === STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR
        ? MESSAGES.SYSTEM.SERVER_ERROR
        : message,
  });
};

export default errorHandler;
