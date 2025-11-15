import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super('Invalid email or password', HttpStatus.UNAUTHORIZED);
  }
}

export class UserInactiveException extends HttpException {
  constructor() {
    super('User account is inactive', HttpStatus.FORBIDDEN);
  }
}

export class TokenExpiredException extends HttpException {
  constructor() {
    super('Token has expired', HttpStatus.UNAUTHORIZED);
  }
}

export class InsufficientPermissionsException extends HttpException {
  constructor() {
    super('Insufficient permissions', HttpStatus.FORBIDDEN);
  }
}
