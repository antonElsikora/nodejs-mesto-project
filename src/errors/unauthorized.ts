import MESSAGES from '../utils/messages';
import STATUS_CODES from '../utils/status-codes';

export default class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string = MESSAGES.DEFAULT_ERROR.NOT_FOUND) {
    super(message);
    this.statusCode = STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED;
  }
}
