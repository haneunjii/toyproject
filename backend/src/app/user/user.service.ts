import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';

import {
  UserAddressResponseCommand,
  UserAddressUpdateRequestCommand,
  UserCreateRequestCommand,
} from '@app/user/user.commands';
import { KakaoApiFailedException } from '@domain/errors/auth.errors';
import {
  DuplicatedUsernameException,
  UserNotFoundException,
} from '@domain/errors/user.errors';
import { UserAddress } from '@domain/user/user-address.entity';
import { UserProfile } from '@domain/user/user-profile.entity';
import { UserSns } from '@domain/user/user-sns.entity';
import { User } from '@domain/user/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
    @InjectRepository(UserAddress)
    private readonly userAddressRepository: Repository<UserAddress>,
    @InjectRepository(UserSns)
    private readonly userSnsRepository: Repository<UserSns>,
    private readonly httpService: HttpService,
  ) {}

  async joinUser(data: UserCreateRequestCommand): Promise<User> {
    await this.isValidateUsername(data.user.username);

    const user = await this.userRepository.save({
      ...data.user,
    });

    const userProfile = await this.userProfileRepository.save({
      ...data.profile,
      user,
    });

    const userSns = await this.userSnsRepository.save({
      ...data.authType,
      user,
    });

    const joinedUser = await this.userRepository.save({
      ...user,
      profile: userProfile,
      authType: userSns,
    });

    return joinedUser;
  }

  async isValidateUsername(username: string): Promise<void> {
    const user = await this.userRepository.count({ where: { username } });
    if (user > 0) {
      throw new DuplicatedUsernameException();
    }
  }

  async findById(id: string, select?: FindOptionsSelect<User>) {
    const user = await this.userRepository.findOne({ where: { id }, select });

    return user;
  }

  async findByUsername(username: string, select?: FindOptionsSelect<User>) {
    const user = await this.userRepository.findOne({
      where: { username },
      select,
    });

    return user;
  }

  async updateUserAddress(
    id: string,
    address: UserAddressUpdateRequestCommand,
  ): Promise<UserAddressResponseCommand> {
    const user = await this.findById(id);
    if (!user) {
      throw new UserNotFoundException();
    }

    const { data: kakaoAuthData, status: kakaoAuthStatus } =
      await this.httpService.axiosRef.request({
        method: 'GET',
        url: `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${address.latitude}&y=${address.longitude}&input_coord=WGS84`,
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`,
        },
      });

    if (kakaoAuthStatus !== 200) {
      throw new KakaoApiFailedException();
    }

    if (kakaoAuthData.documents[0].address) {
      const { region_1depth_name, region_2depth_name, region_3depth_name } =
        kakaoAuthData.documents[0].address;

      const updatedUserAddress = await this.userAddressRepository.save({
        user,
        latitude: address.latitude,
        longitude: address.longitude,
        region1DepthName: region_1depth_name,
        region2DepthName: region_2depth_name,
        region3DepthName: region_3depth_name,
      });

      await this.userRepository.save({
        ...user,
        addressInfo: updatedUserAddress,
      });

      return updatedUserAddress;
    }
  }

  async getProfile(user: User): Promise<User> {
    return user;
  }
}
