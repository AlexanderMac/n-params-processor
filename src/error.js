module.exports = class ParamsProcessorError extends Error {
  static get(...params) {
    return new ParamsProcessorError(...params);
  }

  constructor(message) {
    super(message);

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
};
