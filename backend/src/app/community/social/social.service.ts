import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

import { SocialPlaceCreateRequestCommand } from '@app/community/social/commands/social-place.commands';
import {
  SocialCreateRequestCommand,
  SocialListQuery,
  SocialUpdateRequestCommand,
} from '@app/community/social/commands/social.commands';
import { SocialPreviewResponse } from '@app/community/social/dto/social-preview.response';
import { UserService } from '@app/user/user.service';
import {
  DontHaveToRequest,
  HaveToRequest,
  SocialAdminCantLeave,
  SocialNotFoundException,
  SocialPlaceNotFound,
  SocialRequestAlreadyExist,
  SocialUserIsNotAdmin,
  SocialUserNotFoundException,
} from '@domain/errors/social.errors';
import { UserNotFoundException } from '@domain/errors/user.errors';
import {
  SocialGroupMemberRole,
  SocialGroupMemberStatus,
} from '@domain/social/social-group';
import { SocialGroupPlace } from '@domain/social/social-group-place.entity';
import { SocialGroupUser } from '@domain/social/social-group-user.entity';
import { SocialGroup } from '@domain/social/social-group.entity';
import { User } from '@domain/user/user.entity';

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(SocialGroup)
    private readonly socialRepository: Repository<SocialGroup>,
    @InjectRepository(SocialGroupUser)
    private readonly socialGroupUserRepository: Repository<SocialGroupUser>,
    @InjectRepository(SocialGroupPlace)
    private readonly socialGroupPlaceRepository: Repository<SocialGroupPlace>,
    private readonly userService: UserService,
  ) {}

  async getSocials(
    data: SocialListQuery,
  ): Promise<Pagination<SocialPreviewResponse>> {
    const { items, meta } = await paginate(
      this.socialRepository,
      {
        page: data.page,
        limit: data.limit,
      },
      {
        relations: ['socialGroupPlaces'],
        // where: {},
      },
    );

    return {
      items: items.map(
        (socialGroup) =>
          new SocialPreviewResponse({
            ...socialGroup,
            region3DepthName: socialGroup.socialPlace.region3DepthName,
          }),
      ),
      meta,
    };
  }

  async getSocialProfile(socialId: string): Promise<SocialGroup> {
    return await this.findById(socialId);
  }

  async getSocialInviteRequestList(id: string): Promise<User[]> {
    const socialGroup = await this.findById(id);
    if (!socialGroup) {
      throw new SocialNotFoundException();
    }

    const socialGroupUsers = await this.socialGroupUserRepository.find({
      where: {
        id: socialGroup.id,
        userStatus: SocialGroupMemberStatus.WAITING,
      },
    });
    return socialGroupUsers.map((socialGroupUser) => socialGroupUser.user);
  }

  async createSocial(
    data: SocialCreateRequestCommand,
    user: User,
  ): Promise<SocialGroup> {
    const admin = await this.userService.findById(user.id);

    if (!admin) {
      throw new UserNotFoundException();
    }
    if (data.isOffline) {
      if (!data.socialPlace) {
        throw new SocialPlaceNotFound();
      }

      return await this.generateSocialGroup(data, admin, data.socialPlace);
    }
    return await this.generateSocialGroup(data, admin);
  }

  async requestInviteSocial(socialId: string, user: User): Promise<boolean> {
    const socialGroup = await this.findById(socialId);
    if (!socialGroup) {
      throw new SocialNotFoundException();
    }
    if (!socialGroup.needApprove) {
      throw new DontHaveToRequest();
    }

    const users = await this.socialGroupUserRepository.count({
      where: { socialGroup: { id: socialGroup.id }, user: { id: user.id } },
    });
    if (users > 0) {
      throw new SocialRequestAlreadyExist();
    }

    const { affected } = await this.socialGroupUserRepository.update(
      { socialGroup: { id: socialGroup.id }, user: { id: user.id } },
      {
        userStatus: SocialGroupMemberStatus.WAITING,
        userRole: SocialGroupMemberRole.MEMBER,
      },
    );

    return affected > 0;
  }

  async joinSocial(socialId: string, user: User): Promise<boolean> {
    const socialGroup = await this.findById(socialId);
    if (!socialGroup) {
      throw new SocialNotFoundException();
    }
    if (socialGroup.needApprove) {
      throw new HaveToRequest();
    }

    const users = await this.socialGroupUserRepository.count({
      where: { socialGroup: { id: socialGroup.id }, user: { id: user.id } },
    });
    if (users > 0) {
      throw new SocialRequestAlreadyExist();
    }

    const { affected } = await this.socialGroupUserRepository.update(
      { socialGroup: { id: socialGroup.id }, user: { id: user.id } },
      {
        userStatus: SocialGroupMemberStatus.JOINED,
        userRole: SocialGroupMemberRole.MEMBER,
      },
    );
    return affected > 0;
  }

  async leaveSocial(socialId: string, user: User) {
    const socialGroup = await this.findById(socialId);
    if (!socialGroup) {
      throw new SocialUserNotFoundException();
    }

    const users = await this.socialGroupUserRepository.count({
      where: {
        socialGroup: { id: socialGroup.id },
        user: { id: user.id },
        userStatus:
          SocialGroupMemberStatus.JOINED || SocialGroupMemberStatus.WAITING,
      },
    });
    if (users > 0) {
      throw new SocialRequestAlreadyExist();
    }

    if (
      socialGroup.admin.id === user.id &&
      socialGroup.members.filter(
        (member) => member.userRole !== SocialGroupMemberRole.ADMIN,
      ).length > 0
    ) {
      throw new SocialAdminCantLeave();
    }

    await this.socialRepository.softDelete({ id: socialGroup.id });
    if (socialGroup.socialPlace) {
      await this.socialGroupPlaceRepository.softDelete({ id: socialGroup.id });
    }
    if (
      socialGroup.members.filter(
        (member) => member.userRole === SocialGroupMemberRole.ADMIN,
      ).length < 2
    ) {
      await this.socialGroupUserRepository.softDelete({ id: socialGroup.id });
    }

    return true;
  }

  async kickSocial(socialId: string, userId: string, userData: User) {
    const socialGroup = await this.findById(socialId);
    if (!socialGroup) {
      throw new SocialUserNotFoundException();
    }

    const adminUser = await this.userService.findById(userData.id);
    if (!adminUser) {
      throw new UserNotFoundException();
    }
    if (socialGroup.admin.id !== adminUser.id) {
      throw new SocialUserIsNotAdmin();
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    if (!socialGroup.members.find((member) => member.user.id === user.id)) {
      throw new SocialUserNotFoundException();
    }

    const kickedUser = await this.socialGroupUserRepository.save({
      id: user.id,
      socialGroup,
      userStatus: SocialGroupMemberStatus.KICKED,
    });

    return kickedUser.userStatus === SocialGroupMemberStatus.KICKED;
  }

  async updateSocial(
    socialId: string,
    userData: User,
    data: SocialUpdateRequestCommand,
  ): Promise<SocialGroup> {
    const socialGroup = await this.findById(socialId);
    if (!socialGroup) {
      throw new SocialNotFoundException();
    }

    const user = await this.userService.findById(userData.id);
    if (!user) {
      throw new UserNotFoundException();
    }

    if (socialGroup.admin.id !== user.id) {
      throw new SocialUserIsNotAdmin();
    }

    return await this.socialRepository.save({
      id: socialGroup.id,
      ...data,
    });
  }

  async deleteSocial(socialId: string, user: User) {
    const socialGroup = await this.findById(socialId);
    if (!socialGroup) {
      throw new SocialNotFoundException();
    }

    if (socialGroup.admin.id !== user.id) {
      throw new SocialUserIsNotAdmin();
    }

    const { affected } = await this.socialRepository.softDelete({
      id: socialGroup.id,
    });
    return affected > 0;
  }

  async findById(id: string): Promise<SocialGroup> {
    return await this.socialRepository.findOne({
      where: { id },
      relations: ['members'],
    });
  }

  async generateSocialGroup(
    socialGroupCreateData: SocialCreateRequestCommand,
    socialGroupAdmin: User,
    socialGroupPlaceCreateData?: SocialPlaceCreateRequestCommand,
  ): Promise<SocialGroup> {
    return await this.socialRepository.save({
      ...socialGroupCreateData,
      socialPlace: socialGroupPlaceCreateData,
      admin: socialGroupAdmin,
      members: [
        {
          user: socialGroupAdmin,
          userStatus: SocialGroupMemberStatus.JOINED,
          userRole: SocialGroupMemberRole.ADMIN,
        },
      ],
    });
  }
}
