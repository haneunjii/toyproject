import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

export const SOCIAL_ERRORS = {
  SOCIAL_NOT_FOUND: 'SOCIAL_NOT_FOUND',
  SOCIAL_PLACE_NOT_FOUND: 'SOCIAL_PLACE_NOT_FOUND',
  SOCIAL_REQUEST_ALREADY_EXIST: 'SOCIAL_REQUEST_ALREADY_EXIST',
  DONT_HAVE_TO_REQUEST: 'DONT_HAVE_TO_REQUEST',
  HAVE_TO_REQUEST_JOIN: 'HAVE_TO_REQUEST_JOIN',
  SOCIAL_USER_NOT_FOUND_EXCEPTION: 'SOCIAL_USER_NOT_FOUND_EXCEPTION',
  SOCIAL_ADMIN_CANT_LEAVE: 'SOCIAL_ADMIN_CANT_LEAVE',
  SOCIAL_USER_IS_NOT_ADMIN: 'SOCIAL_USER_IS_NOT_ADMIN',
  SOCIAL_ADMIN_CANT_REQUEST_INVITE: 'SOCIAL_ADMIN_CANT_REQUEST_INVITE',
  SOCIAL_REQUEST_NOT_FOUND: 'SOCIAL_REQUEST_NOT_FOUND',
  SOCIAL_CANT_LEAVE_AT_NOT_JOIN: 'SOCIAL_CANT_LEAVE_AT_NOT_JOIN',
  SOCIAL_CANT_KICK_ADMIN: 'SOCIAL_CANT_KICK_ADMIN',
};

export class SocialNotFoundException extends NotFoundException {
  constructor() {
    super('존재하지 않는 소셜링입니다.', SOCIAL_ERRORS.SOCIAL_NOT_FOUND);
  }
}

export class SocialPlaceNotFound extends BadRequestException {
  constructor() {
    super(
      '오프라인 모임은 소셜링 장소를 입력해야합니다.',
      SOCIAL_ERRORS.SOCIAL_PLACE_NOT_FOUND,
    );
  }
}

export class SocialRequestAlreadyExist extends ConflictException {
  constructor() {
    super(
      '이미 소셜링에 참여 요청을 하였습니다.',
      SOCIAL_ERRORS.SOCIAL_REQUEST_ALREADY_EXIST,
    );
  }
}

export class DontHaveToRequest extends BadRequestException {
  constructor() {
    super(
      '이 소셜링은 참여 요청이 필요없습니다.',
      SOCIAL_ERRORS.DONT_HAVE_TO_REQUEST,
    );
  }
}

export class HaveToRequestJoin extends BadRequestException {
  constructor() {
    super(
      '이 소셜링은 참여 요청이 필요합니다.',
      SOCIAL_ERRORS.HAVE_TO_REQUEST_JOIN,
    );
  }
}

export class SocialUserNotFoundException extends NotFoundException {
  constructor() {
    super(
      '이 소셜링에 해당 회원이 존재하지 않습니다.',
      SOCIAL_ERRORS.SOCIAL_USER_NOT_FOUND_EXCEPTION,
    );
  }
}

export class SocialUserIsNotAdmin extends BadRequestException {
  constructor() {
    super(
      '이 소셜링의 관리 권한이 없습니다.',
      SOCIAL_ERRORS.SOCIAL_USER_IS_NOT_ADMIN,
    );
  }
}

export class SocialAdminCantLeave extends BadRequestException {
  constructor() {
    super(
      '소셜링에 회원이 존재할 때, 관리자는 소셜링을 탈퇴할 수 없습니다.',
      SOCIAL_ERRORS.SOCIAL_ADMIN_CANT_LEAVE,
    );
  }
}

export class SocialAdminCantRequestInvite extends BadRequestException {
  constructor() {
    super(
      '소셜링 어드민은 소셜링 초대를 요청할 수 없습니다.',
      SOCIAL_ERRORS.SOCIAL_ADMIN_CANT_REQUEST_INVITE,
    );
  }
}

export class SocialRequestNotFoundException extends NotFoundException {
  constructor() {
    super(
      '존재하지 않는 소셜링 참여 요청입니다.',
      SOCIAL_ERRORS.SOCIAL_REQUEST_NOT_FOUND,
    );
  }
}

export class SocialCantLeaveAtNotJoin extends ConflictException {
  constructor() {
    super(
      '소셜링에 참가 중이 아닐 때는 탈퇴할 수 없습니다.',
      SOCIAL_ERRORS.SOCIAL_CANT_LEAVE_AT_NOT_JOIN,
    );
  }
}

export class SocialCantKickAdmin extends BadRequestException {
  constructor() {
    super(
      '소셜링 어드민은 추방할 수 없습니다.',
      SOCIAL_ERRORS.SOCIAL_CANT_KICK_ADMIN,
    );
  }
}
