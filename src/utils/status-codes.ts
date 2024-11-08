const STATUS_CODES = {
  SUCCESS: {
    OK: 200,
    CREATED: 201,
  },
  CLIENT_ERROR: {
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
  },
  SERVER_ERROR: {
    INTERNAL_SERVER_ERROR: 500,
  },
} as const;

export default STATUS_CODES;
