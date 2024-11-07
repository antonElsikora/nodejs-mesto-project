import { Request, Response } from 'express';
import Card, { ICard } from '../models/card';

export interface RequestWithUser extends Request {
  user: {
    _id: string;
  };
}

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards: ICard[] = await Card.find({}).populate(['owner', 'likes']);
    res.status(200).send(cards);
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Произошла ошибка при получении карточек' });
  }
};

export const createCard = async (req: Request, res: Response) => {
  const { name, link } = req.body;
  const userId = (req as RequestWithUser).user._id;

  try {
    const card: ICard = await Card.create({ name, link, owner: userId });
    res.status(201).send(card);
  } catch (err) {
    res
      .status(400)
      .send({ message: 'Переданы некорректные данные при создании карточки' });
  }
};

export const deleteCard = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const card: ICard | null = await Card.findByIdAndDelete(req.params.cardId);

    if (!card) {
      res.status(404).send({ message: 'Карточка не найдена' });
      return;
    }

    res.status(200).send({ message: 'Карточка удалена' });
  } catch (err) {
    res.status(400).send({ message: 'Некорректный _id карточки' });
  }
};

export const likeCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as RequestWithUser).user._id;
    const card: ICard | null = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    ).populate(['owner', 'likes']);

    if (!card) {
      res.status(404).send({ message: 'Карточка не найдена' });
      return;
    }

    res.status(200).send(card);
  } catch (err) {
    res.status(400).send({ message: 'Некорректный _id карточки' });
  }
};

export const dislikeCard = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = (req as RequestWithUser).user._id;
    const card: ICard | null = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } },
      { new: true },
    ).populate(['owner', 'likes']);

    if (!card) {
      res.status(404).send({ message: 'Карточка не найдена' });
      return;
    }

    res.status(200).send(card);
  } catch (err) {
    res.status(400).send({ message: 'Некорректный _id карточки' });
  }
};
