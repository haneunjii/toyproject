import { Module } from '@nestjs/common';

import { PostModule } from './post/post.module';
import { SocialModule } from './social/social.module';

@Module({
  imports: [PostModule, SocialModule],
})
export class CommunityModule {}
