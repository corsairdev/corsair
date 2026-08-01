import {
	FacebookAlbumEntity,
	FacebookCommentEntity,
	FacebookConversationEntity,
	FacebookInsightEntity,
	FacebookMessageEntity,
	FacebookPageEntity,
	FacebookPageRoleEntity,
	FacebookPhotoEntity,
	FacebookPostEntity,
	FacebookReactionEntity,
	FacebookUserEntity,
	FacebookVideoEntity,
} from './database';

export const FacebookSchema = {
	version: '1.0.0',
	entities: {
		users: FacebookUserEntity,
		pages: FacebookPageEntity,
		posts: FacebookPostEntity,
		comments: FacebookCommentEntity,
		conversations: FacebookConversationEntity,
		messages: FacebookMessageEntity,
		albums: FacebookAlbumEntity,
		photos: FacebookPhotoEntity,
		videos: FacebookVideoEntity,
		insights: FacebookInsightEntity,
		reactions: FacebookReactionEntity,
		pageRoles: FacebookPageRoleEntity,
	},
} as const;
