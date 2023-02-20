export const tags: SwaggerTag[] = [
  // 인증 관련 태그
  { name: '[인증] 계정', description: '인증 관련 기능' },

  // 유저 관련 태그
  { name: '[유저] 계정', description: '유저 관련 기능' },

  // 커뮤니티 관련 태그
  { name: '[커뮤니티] 소셜링', description: '소셜링 관련 기능' },
];
type SwaggerTag = { name: string; description: string };
