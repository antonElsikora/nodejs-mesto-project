import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import Card, { ICard } from '../models/card';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';

export interface RequestWithUser extends Request {
  user: {
    _id: string;
  };
}

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const cards: ICard[] = await Card.find({}).populate(['owner', 'likes']);
    res.status(200).send(cards);
  } catch (err) {
    next(err);
  }
};

export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { name, link } = req.body;
  const userId = (req as RequestWithUser).user._id;

  try {
    const card: ICard = await Card.create({ name, link, owner: userId });
    res.status(201).send(card);
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(
        new BadRequestError(
          'Переданы некорректные данные при создании карточки',
        ),
      );
    } else {
      next(err);
    }
  }
};

export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const card: ICard | null = await Card.findByIdAndDelete(req.params.cardId);

    if (card) {
      res.status(200).send({ message: 'Карточка удалена' });
    } else {
      next(new NotFoundError('Карточка с указанным _id не найдена.'));
    }
  } catch (err) {
    next(err);
  }
};

export const likeCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { cardId } = req.params;
    if (!mongoose.isValidObjectId(cardId)) {
      next(
        new BadRequestError(
          'Переданы некорректные данные для постановки/снятии лайка.',
        ),
      );
    } else {
      const userId = (req as RequestWithUser).user._id;
      const card: ICard | null = await Card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: userId } },
        { new: true, runValidators: true },
      ).populate(['owner', 'likes']);

      if (card) {
        res.status(200).send(card);
      } else {
        next(new NotFoundError('Передан несуществующий _id карточки.'));
      }
    }
  } catch (err) {
    next(err);
  }
};

export const dislikeCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { cardId } = req.params;
    if (!mongoose.isValidObjectId(cardId)) {
      next(
        new BadRequestError(
          'Переданы некорректные данные для постановки/снятии лайка.',
        ),
      );
    } else {
      const userId = (req as RequestWithUser).user._id;
      const card: ICard | null = await Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: userId } },
        { new: true },
      ).populate(['owner', 'likes']);
      if (card) {
        res.status(200).send(card);
      } else {
        next(new NotFoundError('Передан несуществующий _id карточки.'));
      }
    }
  } catch (err) {
    next(err);
  }
};
