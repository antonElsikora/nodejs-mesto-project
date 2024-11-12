import { celebrate, Joi, Segments } from 'celebrate';

export const createCardValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string()
      .required()
      .uri({ scheme: ['http', 'https'] }),
  }),
});

export const cardIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});
