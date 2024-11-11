import { Request, Response, NextFunction } from 'express';
import NotFound from '../errors/not-found';

const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = new NotFound();
  next(error);
};

export default notFoundMiddleware;
