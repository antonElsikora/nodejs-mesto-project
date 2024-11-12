import { Request, Response, NextFunction } from 'express';
import Card, { ICard } from '../models/card';
import NotFound from '../errors/not-found';
import BadRequest from '../errors/bad-request';
import Forbidden from '../errors/forbidden';
import STATUS_CODES from '../utils/status-codes';
import MESSAGES from '../utils/messages';

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
    const cards: ICard[] = await Card.find({});
    if (cards.length === 0) {
      res.status(STATUS_CODES.SUCCESS.OK).send(MESSAGES.CARD.NO_CARDS);
    } else {
      res.status(STATUS_CODES.SUCCESS.OK).send(cards);
    }
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
    res.status(STATUS_CODES.SUCCESS.CREATED).send(card);
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(new BadRequest(MESSAGES.CARD.INVALID_CREATE));
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
  const userId = (req as RequestWithUser).user._id;

  try {
    const card: ICard | null = await Card.findById(req.params.cardId);

    if (!card) {
      next(new NotFound(MESSAGES.CARD.NOT_FOUND));
    } else if (card.owner.toString() !== userId) {
      next(new Forbidden(MESSAGES.USER.NOT_ALLOW));
    } else {
      await card.deleteOne();
      res.status(STATUS_CODES.SUCCESS.OK).send(MESSAGES.CARD.DELETED);
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
    const userId = (req as RequestWithUser).user._id;
    const card: ICard | null = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true, runValidators: true },
    );

    if (card) {
      res.status(STATUS_CODES.SUCCESS.OK).send(card);
    } else {
      next(new NotFound(MESSAGES.CARD.NOT_FOUND));
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
    const userId = (req as RequestWithUser).user._id;
    const card: ICard | null = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );
    if (card) {
      res.status(STATUS_CODES.SUCCESS.OK).send(card);
    } else {
      next(new NotFound(MESSAGES.CARD.NOT_FOUND));
    }
  } catch (err) {
    next(err);
  }
};
