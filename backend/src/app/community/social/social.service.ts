import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { FindOptionsWhere, Repository } from 'typeorm';

import { SocialPlaceCreateRequestCommand } from '@app/community/social/commands/social-place.commands';
import {
  SocialCreateRequestCommand,
  SocialListQuery,
  SocialUpdateRequestCommand,
} from '@app/community/social/commands/social.commands';
import { SocialPreviewResponse } from '@app/community/social/dto/social-preview.response';
import { UserProfileCommand } from '@app/user/user.commands';
import { UserService } from '@app/user/user.service';
import {
  DontHaveToRequest,
  HaveToRequestJoin,
  SocialAdminCantLeave,
  SocialAdminCantRequestInvite,
  SocialCantKickAdmin,
  SocialCantLeaveAtNotJoin,
  SocialNotFoundException,
  SocialPlaceNotFound,
  SocialRequestAlreadyExist,
  SocialRequestNotFoundException,
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
    private readonly socialGroupRepository: Repository<SocialGroup>,
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
      this.socialGroupRepository,
      {
        page: data.page,
        limit: data.limit,
      },
      {
        where: {
          type: data.category,
        },
        relations: ['socialPlace', 'admin'],
        order: {
          createdAt: 'DESC',
        },
      },
    );

    return {
      items: items.map(
        (socialGroup) =>
          new SocialPreviewResponse({
            ...socialGroup,
            region3DepthName: socialGroup.socialPlace?.region3DepthName,
          }),
      ),
      meta,
    };
  }

  async getSocialProfile(socialId: string): Promise<SocialGroup> {
    const socialGroup = await this.findById(socialId);
    if (!socialGroup) throw new SocialNotFoundException();

    socialGroup.members = await this.findMembersById(socialId, {
      userStatus: SocialGroupMemberStatus.JOINED,
    });
    return socialGroup;
  }

  async getSocialInviteRequestList(
    id: string,
    admin: UserProfileCommand,
  ): Promise<SocialGroupUser[]> {
    const socialGroup = await this.findById(id);
    if (!socialGroup) throw new SocialNotFoundException();

    const user = await this.userService.findById(admin.id);
    if (!user) throw new UserNotFoundException();
    if (socialGroup.admin.id !== user.id) throw new SocialUserIsNotAdmin();

    return await this.findMembersById(socialGroup.id, {
      userStatus: SocialGroupMemberStatus.WAITING,
    });
  }

  async createSocial(
    data: SocialCreateRequestCommand,
    user: UserProfileCommand,
  ): Promise<SocialGroup> {
    const admin = await this.userService.findById(user.id);
    if (!admin) throw new UserNotFoundException();

    if (data.isOffline) {
      if (!data.socialPlace) throw new SocialPlaceNotFound();

      return await this.generateSocialGroup(data, admin, data.socialPlace);
    }
    return await this.generateSocialGroup(data, admin);
  }

  async requestInviteSocial(data: {
    socialId: string;
    user: UserProfileCommand;
  }): Promise<boolean> {
    const socialGroup = await this.findById(data.socialId);
    if (!socialGroup) throw new SocialNotFoundException();
    if (!socialGroup.needApprove) throw new DontHaveToRequest();

    const user = await this.userService.findById(data.user.id);
    if (!user) throw new UserNotFoundException();

    const members = await this.findMembersById(socialGroup.id);
    if (socialGroup.admin.id === user.id)
      throw new SocialAdminCantRequestInvite();

    if (members.find((member) => member.user.id === user.id))
      throw new SocialRequestAlreadyExist();

    const joinedUser = await this.socialGroupUserRepository.save({
      socialGroup: { id: socialGroup.id },
      user: { id: user.id },
      userStatus: SocialGroupMemberStatus.WAITING,
      userRole: SocialGroupMemberRole.MEMBER,
    });

    return !!joinedUser;
  }

  async joinSocial(data: {
    socialId: string;
    user: UserProfileCommand;
  }): Promise<boolean> {
    const socialGroup = await this.findById(data.socialId);
    if (!socialGroup) throw new SocialNotFoundException();
    if (socialGroup.needApprove) throw new HaveToRequestJoin();

    const user = await this.userService.findById(data.user.id);
    if (!user) throw new UserNotFoundException();

    const users = await this.socialGroupUserRepository.count({
      where: {
        socialGroup: { id: socialGroup.id },
        user,
      },
    });
    if (users > 0) throw new SocialRequestAlreadyExist();

    const joinedUser = await this.addMemberToSocialGroup(
      socialGroup,
      user,
      SocialGroupMemberStatus.JOINED,
    );

    return !!joinedUser;
  }

  async acceptInviteSocial(data: {
    socialId: string;
    userId: string;
    user: UserProfileCommand;
  }) {
    const socialGroup = await this.findById(data.socialId);
    if (!socialGroup) throw new SocialNotFoundException();

    const admin = await this.userService.findById(data.user.id);
    if (!admin) throw new UserNotFoundException();

    if (socialGroup.admin.id !== admin.id) throw new SocialUserIsNotAdmin();

    const user = await this.userService.findById(data.userId);
    if (!user) throw new UserNotFoundException();

    const joinRequest = await this.socialGroupUserRepository.findOne({
      where: {
        socialGroup: { id: socialGroup.id },
        user: { id: user.id },
        userStatus: SocialGroupMemberStatus.WAITING,
        userRole: SocialGroupMemberRole.MEMBER,
      },
    });
    if (!joinRequest) throw new SocialRequestNotFoundException();

    const { affected } = await this.socialGroupUserRepository.update(
      {
        socialGroup,
        user,
      },
      {
        userStatus: SocialGroupMemberStatus.JOINED,
      },
    );

    return affected > 0;
  }

  async leaveSocial(socialId: string, user: UserProfileCommand) {
    const socialGroup = await this.findById(socialId);
    if (!socialGroup) throw new SocialNotFoundException();

    socialGroup.members = await this.findMembersById(socialGroup.id);

    const users = await this.socialGroupUserRepository.count({
      where: {
        socialGroup: { id: socialGroup.id },
        user: { id: user.id },
        userStatus:
          SocialGroupMemberStatus.JOINED || SocialGroupMemberStatus.WAITING,
      },
    });
    if (users < 1) throw new SocialCantLeaveAtNotJoin();

    if (
      socialGroup.admin.id === user.id &&
      socialGroup.members.filter(
        (member) =>
          member.userRole !== SocialGroupMemberRole.ADMIN &&
          member.userStatus === SocialGroupMemberStatus.JOINED,
      ).length > 0
    )
      throw new SocialAdminCantLeave();

    await this.socialGroupRepository.softDelete({ id: socialGroup.id });
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

  async kickSocial(
    socialId: string,
    userId: string,
    userData: UserProfileCommand,
  ) {
    const socialGroup = await this.findById(socialId);
    if (!socialGroup) throw new SocialUserNotFoundException();

    const adminUser = await this.userService.findById(userData.id);
    if (!adminUser) throw new UserNotFoundException();

    if (socialGroup.admin.id !== adminUser.id) throw new SocialUserIsNotAdmin();

    const socialGroupJoinedUser = await this.findMemberById(
      socialGroup.id,
      userId,
      {
        userStatus:
          SocialGroupMemberStatus.JOINED || SocialGroupMemberStatus.WAITING,
      },
    );
    if (socialGroupJoinedUser.userRole === SocialGroupMemberRole.ADMIN)
      throw new SocialCantKickAdmin();
    if (!socialGroupJoinedUser) throw new SocialUserNotFoundException();

    const kickedUser = await this.socialGroupUserRepository.save({
      ...socialGroupJoinedUser,
      socialGroup,
      userStatus: SocialGroupMemberStatus.KICKED,
    });

    return kickedUser.userStatus === SocialGroupMemberStatus.KICKED;
  }

  async updateSocial(
    socialId: string,
    userData: UserProfileCommand,
    data: SocialUpdateRequestCommand,
  ): Promise<SocialGroup> {
    const socialGroup = await this.findById(socialId);
    if (!socialGroup) throw new SocialNotFoundException();

    const user = await this.userService.findById(userData.id);
    if (!user) throw new UserNotFoundException();

    if (socialGroup.admin.id !== user.id) throw new SocialUserIsNotAdmin();

    const updatedSocialGroup = await this.socialGroupRepository.save({
      id: socialGroup.id,
      ...data,
    });
    updatedSocialGroup.members = await this.findMembersById(socialId, {
      userStatus: SocialGroupMemberStatus.JOINED,
    });

    return updatedSocialGroup;
  }

  async findById(id: string): Promise<SocialGroup> {
    return await this.socialGroupRepository.findOne({
      where: { id },
      relations: ['admin'],
    });
  }

  async findMembersById(
    id: string,
    whereOptions?: FindOptionsWhere<SocialGroupUser>,
  ): Promise<SocialGroupUser[]> {
    return await this.socialGroupUserRepository.find({
      where: { socialGroup: { id }, ...whereOptions },
      relations: ['user'],
    });
  }

  async findMemberById(
    socialGroupId: string,
    memberId: string,
    whereOptions?: FindOptionsWhere<SocialGroupUser>,
  ): Promise<SocialGroupUser> {
    return await this.socialGroupUserRepository.findOne({
      where: {
        socialGroup: { id: socialGroupId },
        user: { id: memberId },
        ...whereOptions,
      },
      relations: ['user'],
    });
  }

  async generateSocialGroup(
    socialGroupCreateData: SocialCreateRequestCommand,
    socialGroupAdmin: User,
    socialGroupPlaceCreateData?: SocialPlaceCreateRequestCommand,
  ): Promise<SocialGroup> {
    const socialGroup = await this.socialGroupRepository.save({
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

    await this.socialGroupUserRepository.save({
      user: socialGroupAdmin,
      socialGroup,
      userStatus: SocialGroupMemberStatus.JOINED,
      userRole: SocialGroupMemberRole.ADMIN,
    });

    return socialGroup;
  }

  async addMemberToSocialGroup(
    socialGroup: SocialGroup,
    user: User,
    userStatus: SocialGroupMemberStatus,
  ): Promise<SocialGroupUser> {
    return await this.socialGroupUserRepository.save({
      user,
      socialGroup,
      userStatus,
      userRole: SocialGroupMemberRole.MEMBER,
    });
  }
}
