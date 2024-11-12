import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import {
  createCardValidation,
  cardIdValidation,
} from '../validators/cardValidation';

const cardsRouter = Router();

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', createCardValidation, createCard);
cardsRouter.delete('/cards/:cardId', cardIdValidation, deleteCard);
cardsRouter.put('/cards/:cardId/likes', cardIdValidation, likeCard);
cardsRouter.delete('/cards/:cardId/likes', cardIdValidation, dislikeCard);

export default cardsRouter;
