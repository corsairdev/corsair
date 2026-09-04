import * as Carousel from './carousel';
import * as Comments from './comments';
import * as Conversations from './conversations';
import * as Image from './image';
import * as Media from './media';
import * as Messages from './messages';
import * as Messenger from './messenger-profile';
import * as Post from './post';
import * as Profile from './profile';
import * as Publish from './publish-content';
import * as Reel from './reel';
import * as Video from './video';

export const ProfileEndpoints = {
	get: Profile.get,
	insights: Profile.insights,
	contentPublishingLimit: Profile.contentPublishingLimit,
	liveMedia: Profile.liveMedia,
	media: Profile.media,
	stories: Profile.stories,
	tags: Profile.tags,
	info: Profile.info,
	userInsights: Profile.userInsights,
	userMedia: Profile.userMedia,
	replyMentions: Profile.replyMentions,
};

export const MediaEndpoints = {
	list: Media.list,
	get: Media.get,
	status: Media.status,
	insights: Media.insights,
	createMediaContainer: Media.createMediaContainer,
	children: Media.children,
	comments: Media.comments,
	getMediaInsights: Media.getMediaInsights,
	postIgUserMedia: Media.postIgUserMedia,
};

export const ImageEndpoints = {
	post: Image.post,
	story: Image.story,
};

export const ReelEndpoints = {
	post: Reel.post,
};

export const PublishEndpoints = {
	publish: Publish.publish,
	createPost: Publish.createPost,
	publishIgUserMedia: Publish.publishIgUserMedia,
};

export const VideoEndpoints = {
	story: Video.story,
	container: Video.container,
};

export const CarouselEndpoints = {
	post: Carousel.post,
};

export const ConversationsEndpoints = {
	list: Conversations.list,
	get: Conversations.get,
	getConversation: Conversations.getConversation,
	pageConversations: Conversations.pageConversations,
	listAll: Conversations.listAll,
};

export const MessagesEndpoints = {
	get: Messages.get,
	send: Messages.send,
	listAll: Messages.listAll,
	markSeen: Messages.markSeen,
	sendImage: Messages.sendImage,
	sendTextMessage: Messages.sendTextMessage,
};

export const CommentsEndpoints = {
	list: Comments.list,
	reply: Comments.reply,
	send: Comments.send,
	get: Comments.get,
	update: Comments.update,
	remove: Comments.remove,
	getReplies: Comments.getReplies,
	postReplies: Comments.postReplies,
	postComments: Comments.postComments,
	replyToComment: Comments.replyToComment,
};

export const MessengerEndpoints = {
	getProfile: Messenger.getProfile,
	updateProfile: Messenger.updateProfile,
	deleteProfile: Messenger.deleteProfile,
};

export const PostEndpoints = {
	comments: Post.getComments,
	insights: Post.getInsights,
	status: Post.getStatus,
};
