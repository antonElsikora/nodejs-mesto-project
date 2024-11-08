export default class BadRequest extends Error {
  statusCode: number;

  constructor(message = 'Некорректный запрос') {
    super(message);
    this.statusCode = 400;
  }
}
