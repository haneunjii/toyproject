import { BadRequestException, ConflictException } from '@nestjs/common';

export const USER_ERRORS = {
  DUPLICATED_USERNAME: 'DUPLICATED_USERNAME',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
};

export class DuplicatedUsernameException extends ConflictException {
  constructor() {
    super('이미 사용중인 아이디입니다.', USER_ERRORS.DUPLICATED_USERNAME);
  }
}

export class UserNotFoundException extends BadRequestException {
  constructor() {
    super('사용자를 찾을 수 없습니다.', USER_ERRORS.USER_NOT_FOUND);
  }
}
