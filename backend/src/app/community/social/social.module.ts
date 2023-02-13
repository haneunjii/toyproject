import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SocialController } from './social.controller';
import { SocialService } from './social.service';

import { UserModule } from '@app/user/user.module';
import { SocialGroupPlace } from '@domain/social/social-group-place.entity';
import { SocialGroupUser } from '@domain/social/social-group-user.entity';
import { SocialGroup } from '@domain/social/social-group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SocialGroup, SocialGroupUser, SocialGroupPlace]),
    UserModule,
  ],
  controllers: [SocialController],
  providers: [SocialService],
})
export class SocialModule {}
