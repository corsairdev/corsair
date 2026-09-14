import * as Carousel from './carousel';
import * as Comments from './comments';
import * as Conversations from './conversations';
import * as Image from './image';
import * as Media from './media';
import * as Messages from './messages';
import * as Messenger from './messenger-profile';
import * as Profile from './profile';
import * as Publish from './publish-content';
import * as Reel from './reel';
import * as Video from './video';

export const ProfileEndpoints = {
	get: Profile.get,
	insights: Profile.insights,
	contentPublishingLimit: Profile.contentPublishingLimit,
	liveMedia: Profile.liveMedia,
	stories: Profile.stories,
	tags: Profile.tags,
	replyMentions: Profile.replyMentions,
};

export const MediaEndpoints = {
	list: Media.list,
	get: Media.get,
	status: Media.status,
	insights: Media.insights,
	children: Media.children,
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
};

export const MessagesEndpoints = {
	get: Messages.get,
	send: Messages.send,
	markSeen: Messages.markSeen,
	sendImage: Messages.sendImage,
};

export const CommentsEndpoints = {
	list: Comments.list,
	reply: Comments.reply,
	send: Comments.send,
	get: Comments.get,
	update: Comments.update,
	remove: Comments.remove,
	getReplies: Comments.getReplies,
};

export const MessengerEndpoints = {
	getProfile: Messenger.getProfile,
	updateProfile: Messenger.updateProfile,
	deleteProfile: Messenger.deleteProfile,
};
