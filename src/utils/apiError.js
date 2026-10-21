export class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequest';
    this.status = 400;
  }
}

export class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.name = 'Unauthorized';
    this.status = 401;
  }
}

export class Forbidden extends Error {
  constructor(message) {
    super(message);
    this.name = 'Forbidden';
    this.status = 403;
  }
}

export class NotFound extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFound';
    this.status = 404;
  }
}
