import * as Captions from './captions';
import * as Channels from './channels';
import * as Comments from './comments';
import * as I18n from './i18n';
import * as LiveChat from './liveChat';
import * as PlaylistImages from './playlistImages';
import * as PlaylistItems from './playlistItems';
import * as Playlists from './playlists';
import * as Search from './search';
import * as Subscriptions from './subscriptions';
import * as VideoActions from './videoActions';
import * as Videos from './videos';

export const PlaylistsEndpoints = {
	list: Playlists.list,
	create: Playlists.create,
	update: Playlists.update,
	delete: Playlists.del,
};

export const PlaylistItemsEndpoints = {
	add: PlaylistItems.add,
	list: PlaylistItems.list,
	update: PlaylistItems.update,
	delete: PlaylistItems.del,
};

export const VideosEndpoints = {
	get: Videos.get,
	getBatch: Videos.getBatch,
	list: Videos.list,
	listMostPopular: Videos.listMostPopular,
	update: Videos.update,
	upload: Videos.upload,
	uploadMultipart: Videos.uploadMultipart,
	delete: Videos.del,
};

export const ChannelsEndpoints = {
	getStatistics: Channels.getStatistics,
	getIdByHandle: Channels.getIdByHandle,
	getActivities: Channels.getActivities,
	update: Channels.channelUpdate,
	sectionsList: Channels.sectionsList,
	sectionsCreate: Channels.sectionsCreate,
	sectionsUpdate: Channels.sectionsUpdate,
	sectionsDelete: Channels.sectionsDelete,
};

export const CommentsEndpoints = {
	list: Comments.list,
	threadsList: Comments.threadsList,
	threadsList2: Comments.threadsList2,
	post: Comments.post,
	createReply: Comments.createReply,
	update: Comments.update,
	delete: Comments.del,
	markSpam: Comments.markSpam,
	setModerationStatus: Comments.setModerationStatus,
};

export const SearchEndpoints = {
	youtube: Search.youtube,
};

export const SubscriptionsEndpoints = {
	list: Subscriptions.list,
	subscribe: Subscriptions.subscribe,
	unsubscribe: Subscriptions.unsubscribe,
};

export const VideoActionsEndpoints = {
	rate: VideoActions.rate,
	getRating: VideoActions.getRating,
	reportAbuse: VideoActions.reportAbuse,
	listAbuseReasons: VideoActions.listAbuseReasons,
	updateThumbnail: VideoActions.updateThumbnail,
};

export const CaptionsEndpoints = {
	list: Captions.list,
	update: Captions.update,
	load: Captions.load,
};

export const LiveChatEndpoints = {
	listMessages: LiveChat.listMessages,
	listSuperChatEvents: LiveChat.listSuperChatEvents,
};

export const I18nEndpoints = {
	listLanguages: I18n.listLanguages,
	listRegions: I18n.listRegions,
};

export const VideoCategoriesEndpoints = {
	list: I18n.videoCategoriesList,
};

export const PlaylistImagesEndpoints = {
	list: PlaylistImages.list,
};

export * from './types';
