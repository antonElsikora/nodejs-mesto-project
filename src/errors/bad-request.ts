import MESSAGES from '../utils/messages';
import STATUS_CODES from '../utils/status-codes';

export default class BadRequest extends Error {
  statusCode: number;

  constructor(message: string = MESSAGES.DEFAULT_ERROR.INCORRECT_REQUEST) {
    super(message);
    this.statusCode = STATUS_CODES.CLIENT_ERROR.BAD_REQUEST;
  }
}
