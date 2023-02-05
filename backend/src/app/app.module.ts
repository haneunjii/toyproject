import { Module } from '@nestjs/common';

import { CommunityModule } from './community/community.module';

import { AppController } from '@app/app.controller';
import { AuthModule } from '@app/auth/auth.module';
import { UserModule } from '@app/user/user.module';

@Module({
  imports: [AuthModule, UserModule, CommunityModule],
  controllers: [AppController],
})
export class AppModule {}
