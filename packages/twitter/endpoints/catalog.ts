// Generated with endpoints/operation-types.ts from X's OpenAPI spec: one
// entry per operation in twitter-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8). The two legacy `tweets.*` endpoints are
// hand-written in endpoints/tweets.ts and added in index.ts.
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { twitterSchemaEntry } from './openapi-schema';
import { createTwitterOperation as op } from './operations';

export const twitterGeneratedEndpointsNested = {
	account: {
		ensure: op('account.ensure'),
		get: op('account.get'),
	},
	accountActivity: {
		subscriptions: {
			count: op('accountActivity.subscriptions.count'),
			create: op('accountActivity.subscriptions.create'),
			delete: op('accountActivity.subscriptions.delete'),
			list: op('accountActivity.subscriptions.list'),
			validate: op('accountActivity.subscriptions.validate'),
		},
	},
	activity: {
		subscriptions: {
			create: op('activity.subscriptions.create'),
			delete: op('activity.subscriptions.delete'),
			deleteMany: op('activity.subscriptions.deleteMany'),
			list: op('activity.subscriptions.list'),
			update: op('activity.subscriptions.update'),
		},
	},
	articles: {
		createDraft: op('articles.createDraft'),
		publish: op('articles.publish'),
	},
	bots: {
		create: op('bots.create'),
		delete: op('bots.delete'),
		list: op('bots.list'),
		token: {
			revoke: op('bots.token.revoke'),
			rotate: op('bots.token.rotate'),
		},
		update: op('bots.update'),
	},
	broadcasts: {
		chat: {
			deleteMessage: op('broadcasts.chat.deleteMessage'),
			list: op('broadcasts.chat.list'),
			muteUser: op('broadcasts.chat.muteUser'),
			send: op('broadcasts.chat.send'),
			unmuteUser: op('broadcasts.chat.unmuteUser'),
		},
		chatModerators: {
			add: op('broadcasts.chatModerators.add'),
			list: op('broadcasts.chatModerators.list'),
			remove: op('broadcasts.chatModerators.remove'),
		},
		chatMutes: {
			create: op('broadcasts.chatMutes.create'),
			delete: op('broadcasts.chatMutes.delete'),
			list: op('broadcasts.chatMutes.list'),
		},
		create: op('broadcasts.create'),
		delete: op('broadcasts.delete'),
		end: op('broadcasts.end'),
		get: op('broadcasts.get'),
		list: op('broadcasts.list'),
		listCategories: op('broadcasts.listCategories'),
		scheduled: {
			create: op('broadcasts.scheduled.create'),
			delete: op('broadcasts.scheduled.delete'),
			get: op('broadcasts.scheduled.get'),
			goLive: op('broadcasts.scheduled.goLive'),
			list: op('broadcasts.scheduled.list'),
			update: op('broadcasts.scheduled.update'),
		},
		update: op('broadcasts.update'),
	},
	calls: {
		create: op('calls.create'),
		get: op('calls.get'),
		join: op('calls.join'),
		leave: op('calls.leave'),
		scheduled: {
			cancel: op('calls.scheduled.cancel'),
			create: op('calls.scheduled.create'),
			get: op('calls.scheduled.get'),
			list: op('calls.scheduled.list'),
			respond: op('calls.scheduled.respond'),
			update: op('calls.scheduled.update'),
		},
	},
	chat: {
		conversations: {
			addKeys: op('chat.conversations.addKeys'),
			archive: op('chat.conversations.archive'),
			delete: op('chat.conversations.delete'),
			disableMessageTtl: op('chat.conversations.disableMessageTtl'),
			enableMessageTtl: op('chat.conversations.enableMessageTtl'),
			get: op('chat.conversations.get'),
			list: op('chat.conversations.list'),
			listEvents: op('chat.conversations.listEvents'),
			listPinnedMessages: op('chat.conversations.listPinnedMessages'),
			markRead: op('chat.conversations.markRead'),
			markUnread: op('chat.conversations.markUnread'),
			mute: op('chat.conversations.mute'),
			sendTyping: op('chat.conversations.sendTyping'),
			unarchive: op('chat.conversations.unarchive'),
			unmute: op('chat.conversations.unmute'),
			updateScreenCapture: op('chat.conversations.updateScreenCapture'),
		},
		groups: {
			adminRequests: {
				approve: op('chat.groups.adminRequests.approve'),
				create: op('chat.groups.adminRequests.create'),
				list: op('chat.groups.adminRequests.list'),
				reject: op('chat.groups.adminRequests.reject'),
			},
			admins: {
				add: op('chat.groups.admins.add'),
				remove: op('chat.groups.admins.remove'),
			},
			create: op('chat.groups.create'),
			initialize: op('chat.groups.initialize'),
			inviteLink: {
				disable: op('chat.groups.inviteLink.disable'),
				enable: op('chat.groups.inviteLink.enable'),
				get: op('chat.groups.inviteLink.get'),
			},
			joinRequests: {
				create: op('chat.groups.joinRequests.create'),
				reject: op('chat.groups.joinRequests.reject'),
			},
			members: {
				add: op('chat.groups.members.add'),
				remove: op('chat.groups.members.remove'),
			},
			update: op('chat.groups.update'),
			updateAdminSettings: op('chat.groups.updateAdminSettings'),
		},
		media: {
			appendUpload: op('chat.media.appendUpload'),
			download: op('chat.media.download'),
			finalizeUpload: op('chat.media.finalizeUpload'),
			initializeUpload: op('chat.media.initializeUpload'),
		},
		messageRequests: {
			accept: op('chat.messageRequests.accept'),
			get: op('chat.messageRequests.get'),
			list: op('chat.messageRequests.list'),
		},
		messages: {
			delete: op('chat.messages.delete'),
			send: op('chat.messages.send'),
		},
		settings: {
			get: op('chat.settings.get'),
			update: op('chat.settings.update'),
		},
	},
	communities: {
		get: op('communities.get'),
		search: op('communities.search'),
	},
	communityNotes: {
		create: op('communityNotes.create'),
		delete: op('communityNotes.delete'),
		evaluate: op('communityNotes.evaluate'),
		searchEligiblePosts: op('communityNotes.searchEligiblePosts'),
		searchWritten: op('communityNotes.searchWritten'),
	},
	compliance: {
		jobs: {
			cancel: op('compliance.jobs.cancel'),
			create: op('compliance.jobs.create'),
			downloadResults: op('compliance.jobs.downloadResults'),
			get: op('compliance.jobs.get'),
			list: op('compliance.jobs.list'),
			upload: op('compliance.jobs.upload'),
		},
	},
	connections: {
		history: op('connections.history'),
		terminateAll: op('connections.terminateAll'),
		terminateByEndpoint: op('connections.terminateByEndpoint'),
		terminateMany: op('connections.terminateMany'),
	},
	directMessages: {
		conversations: {
			create: op('directMessages.conversations.create'),
		},
		events: {
			delete: op('directMessages.events.delete'),
			get: op('directMessages.events.get'),
			list: op('directMessages.events.list'),
			listByConversation: op('directMessages.events.listByConversation'),
			listWithParticipant: op('directMessages.events.listWithParticipant'),
		},
		media: {
			download: op('directMessages.media.download'),
		},
		sendToConversation: op('directMessages.sendToConversation'),
		sendToParticipant: op('directMessages.sendToParticipant'),
	},
	lists: {
		create: op('lists.create'),
		delete: op('lists.delete'),
		followers: {
			list: op('lists.followers.list'),
		},
		get: op('lists.get'),
		members: {
			add: op('lists.members.add'),
			list: op('lists.members.list'),
			remove: op('lists.members.remove'),
		},
		posts: {
			list: op('lists.posts.list'),
		},
		update: op('lists.update'),
	},
	media: {
		amplify: {
			addPost: op('media.amplify.addPost'),
			programs: {
				get: op('media.amplify.programs.get'),
				list: op('media.amplify.programs.list'),
				listPosts: op('media.amplify.programs.listPosts'),
			},
		},
		analytics: op('media.analytics'),
		get: op('media.get'),
		getMany: op('media.getMany'),
		library: {
			add: op('media.library.add'),
			listCategories: op('media.library.listCategories'),
			remove: op('media.library.remove'),
			update: op('media.library.update'),
		},
		metadata: {
			create: op('media.metadata.create'),
		},
		subtitles: {
			create: op('media.subtitles.create'),
			delete: op('media.subtitles.delete'),
		},
		upload: {
			append: op('media.upload.append'),
			finalize: op('media.upload.finalize'),
			getStatus: op('media.upload.getStatus'),
			initialize: op('media.upload.initialize'),
			single: op('media.upload.single'),
		},
	},
	news: {
		get: op('news.get'),
		search: op('news.search'),
	},
	posts: {
		analytics: op('posts.analytics'),
		counts: {
			all: op('posts.counts.all'),
			recent: op('posts.counts.recent'),
		},
		create: op('posts.create'),
		delete: op('posts.delete'),
		drafts: {
			create: op('posts.drafts.create'),
			delete: op('posts.drafts.delete'),
			list: op('posts.drafts.list'),
		},
		get: op('posts.get'),
		getMany: op('posts.getMany'),
		hideReply: op('posts.hideReply'),
		likingUsers: op('posts.likingUsers'),
		quotes: op('posts.quotes'),
		repostedBy: op('posts.repostedBy'),
		reposts: op('posts.reposts'),
		search: {
			all: op('posts.search.all'),
			recent: op('posts.search.recent'),
		},
		streamLinks: {
			create: op('posts.streamLinks.create'),
			delete: op('posts.streamLinks.delete'),
			list: op('posts.streamLinks.list'),
		},
		streamRules: {
			counts: op('posts.streamRules.counts'),
			list: op('posts.streamRules.list'),
			update: op('posts.streamRules.update'),
		},
	},
	sources: {
		create: op('sources.create'),
		delete: op('sources.delete'),
		get: op('sources.get'),
		getIngestRegion: op('sources.getIngestRegion'),
		getStreamKey: op('sources.getStreamKey'),
		list: op('sources.list'),
		rename: op('sources.rename'),
	},
	spaces: {
		get: op('spaces.get'),
		getByCreators: op('spaces.getByCreators'),
		getMany: op('spaces.getMany'),
		listBuyers: op('spaces.listBuyers'),
		listPosts: op('spaces.listPosts'),
		search: op('spaces.search'),
	},
	trends: {
		byWoeid: op('trends.byWoeid'),
		locations: op('trends.locations'),
		personalized: op('trends.personalized'),
	},
	usage: {
		credits: op('usage.credits'),
		get: op('usage.get'),
	},
	users: {
		affiliates: op('users.affiliates'),
		blockDms: op('users.blockDms'),
		blocking: {
			block: op('users.blocking.block'),
			list: op('users.blocking.list'),
			unblock: op('users.blocking.unblock'),
		},
		bookmarks: {
			create: op('users.bookmarks.create'),
			delete: op('users.bookmarks.delete'),
			folders: {
				create: op('users.bookmarks.folders.create'),
				list: op('users.bookmarks.folders.list'),
				listPosts: op('users.bookmarks.folders.listPosts'),
			},
			list: op('users.bookmarks.list'),
		},
		broadcasts: {
			create: op('users.broadcasts.create'),
			delete: op('users.broadcasts.delete'),
			get: op('users.broadcasts.get'),
			list: op('users.broadcasts.list'),
			updateState: op('users.broadcasts.updateState'),
		},
		followedLists: {
			follow: op('users.followedLists.follow'),
			list: op('users.followedLists.list'),
			unfollow: op('users.followedLists.unfollow'),
		},
		followers: op('users.followers'),
		following: {
			follow: op('users.following.follow'),
			list: op('users.following.list'),
			unfollow: op('users.following.unfollow'),
		},
		get: op('users.get'),
		getByUsername: op('users.getByUsername'),
		getMany: op('users.getMany'),
		getManyByUsernames: op('users.getManyByUsernames'),
		likes: {
			like: op('users.likes.like'),
			list: op('users.likes.list'),
			unlike: op('users.likes.unlike'),
		},
		listMemberships: op('users.listMemberships'),
		me: op('users.me'),
		mentions: op('users.mentions'),
		muting: {
			list: op('users.muting.list'),
			mute: op('users.muting.mute'),
			unmute: op('users.muting.unmute'),
		},
		myFollowers: op('users.myFollowers'),
		myFollowing: op('users.myFollowing'),
		ownedLists: op('users.ownedLists'),
		pinnedLists: {
			list: op('users.pinnedLists.list'),
			pin: op('users.pinnedLists.pin'),
			unpin: op('users.pinnedLists.unpin'),
		},
		posts: op('users.posts'),
		publicKeys: {
			add: op('users.publicKeys.add'),
			get: op('users.publicKeys.get'),
			getMany: op('users.publicKeys.getMany'),
		},
		reposts: {
			create: op('users.reposts.create'),
			delete: op('users.reposts.delete'),
		},
		repostsOfMe: op('users.repostsOfMe'),
		search: op('users.search'),
		sources: {
			create: op('users.sources.create'),
			delete: op('users.sources.delete'),
			get: op('users.sources.get'),
			list: op('users.sources.list'),
			rename: op('users.sources.rename'),
		},
		timeline: op('users.timeline'),
		unblockDms: op('users.unblockDms'),
	},
	webhooks: {
		create: op('webhooks.create'),
		delete: op('webhooks.delete'),
		list: op('webhooks.list'),
		replay: op('webhooks.replay'),
		validate: op('webhooks.validate'),
	},
} as const;

export const twitterGeneratedEndpointSchemas = {
	'account.ensure': twitterSchemaEntry('account.ensure'),
	'account.get': twitterSchemaEntry('account.get'),
	'accountActivity.subscriptions.count': twitterSchemaEntry(
		'accountActivity.subscriptions.count',
	),
	'accountActivity.subscriptions.create': twitterSchemaEntry(
		'accountActivity.subscriptions.create',
	),
	'accountActivity.subscriptions.delete': twitterSchemaEntry(
		'accountActivity.subscriptions.delete',
	),
	'accountActivity.subscriptions.list': twitterSchemaEntry(
		'accountActivity.subscriptions.list',
	),
	'accountActivity.subscriptions.validate': twitterSchemaEntry(
		'accountActivity.subscriptions.validate',
	),
	'activity.subscriptions.create': twitterSchemaEntry(
		'activity.subscriptions.create',
	),
	'activity.subscriptions.delete': twitterSchemaEntry(
		'activity.subscriptions.delete',
	),
	'activity.subscriptions.deleteMany': twitterSchemaEntry(
		'activity.subscriptions.deleteMany',
	),
	'activity.subscriptions.list': twitterSchemaEntry(
		'activity.subscriptions.list',
	),
	'activity.subscriptions.update': twitterSchemaEntry(
		'activity.subscriptions.update',
	),
	'articles.createDraft': twitterSchemaEntry('articles.createDraft'),
	'articles.publish': twitterSchemaEntry('articles.publish'),
	'bots.create': twitterSchemaEntry('bots.create'),
	'bots.delete': twitterSchemaEntry('bots.delete'),
	'bots.list': twitterSchemaEntry('bots.list'),
	'bots.token.revoke': twitterSchemaEntry('bots.token.revoke'),
	'bots.token.rotate': twitterSchemaEntry('bots.token.rotate'),
	'bots.update': twitterSchemaEntry('bots.update'),
	'broadcasts.chat.deleteMessage': twitterSchemaEntry(
		'broadcasts.chat.deleteMessage',
	),
	'broadcasts.chat.list': twitterSchemaEntry('broadcasts.chat.list'),
	'broadcasts.chat.muteUser': twitterSchemaEntry('broadcasts.chat.muteUser'),
	'broadcasts.chat.send': twitterSchemaEntry('broadcasts.chat.send'),
	'broadcasts.chat.unmuteUser': twitterSchemaEntry(
		'broadcasts.chat.unmuteUser',
	),
	'broadcasts.chatModerators.add': twitterSchemaEntry(
		'broadcasts.chatModerators.add',
	),
	'broadcasts.chatModerators.list': twitterSchemaEntry(
		'broadcasts.chatModerators.list',
	),
	'broadcasts.chatModerators.remove': twitterSchemaEntry(
		'broadcasts.chatModerators.remove',
	),
	'broadcasts.chatMutes.create': twitterSchemaEntry(
		'broadcasts.chatMutes.create',
	),
	'broadcasts.chatMutes.delete': twitterSchemaEntry(
		'broadcasts.chatMutes.delete',
	),
	'broadcasts.chatMutes.list': twitterSchemaEntry('broadcasts.chatMutes.list'),
	'broadcasts.create': twitterSchemaEntry('broadcasts.create'),
	'broadcasts.delete': twitterSchemaEntry('broadcasts.delete'),
	'broadcasts.end': twitterSchemaEntry('broadcasts.end'),
	'broadcasts.get': twitterSchemaEntry('broadcasts.get'),
	'broadcasts.list': twitterSchemaEntry('broadcasts.list'),
	'broadcasts.listCategories': twitterSchemaEntry('broadcasts.listCategories'),
	'broadcasts.scheduled.create': twitterSchemaEntry(
		'broadcasts.scheduled.create',
	),
	'broadcasts.scheduled.delete': twitterSchemaEntry(
		'broadcasts.scheduled.delete',
	),
	'broadcasts.scheduled.get': twitterSchemaEntry('broadcasts.scheduled.get'),
	'broadcasts.scheduled.goLive': twitterSchemaEntry(
		'broadcasts.scheduled.goLive',
	),
	'broadcasts.scheduled.list': twitterSchemaEntry('broadcasts.scheduled.list'),
	'broadcasts.scheduled.update': twitterSchemaEntry(
		'broadcasts.scheduled.update',
	),
	'broadcasts.update': twitterSchemaEntry('broadcasts.update'),
	'calls.create': twitterSchemaEntry('calls.create'),
	'calls.get': twitterSchemaEntry('calls.get'),
	'calls.join': twitterSchemaEntry('calls.join'),
	'calls.leave': twitterSchemaEntry('calls.leave'),
	'calls.scheduled.cancel': twitterSchemaEntry('calls.scheduled.cancel'),
	'calls.scheduled.create': twitterSchemaEntry('calls.scheduled.create'),
	'calls.scheduled.get': twitterSchemaEntry('calls.scheduled.get'),
	'calls.scheduled.list': twitterSchemaEntry('calls.scheduled.list'),
	'calls.scheduled.respond': twitterSchemaEntry('calls.scheduled.respond'),
	'calls.scheduled.update': twitterSchemaEntry('calls.scheduled.update'),
	'chat.conversations.addKeys': twitterSchemaEntry(
		'chat.conversations.addKeys',
	),
	'chat.conversations.archive': twitterSchemaEntry(
		'chat.conversations.archive',
	),
	'chat.conversations.delete': twitterSchemaEntry('chat.conversations.delete'),
	'chat.conversations.disableMessageTtl': twitterSchemaEntry(
		'chat.conversations.disableMessageTtl',
	),
	'chat.conversations.enableMessageTtl': twitterSchemaEntry(
		'chat.conversations.enableMessageTtl',
	),
	'chat.conversations.get': twitterSchemaEntry('chat.conversations.get'),
	'chat.conversations.list': twitterSchemaEntry('chat.conversations.list'),
	'chat.conversations.listEvents': twitterSchemaEntry(
		'chat.conversations.listEvents',
	),
	'chat.conversations.listPinnedMessages': twitterSchemaEntry(
		'chat.conversations.listPinnedMessages',
	),
	'chat.conversations.markRead': twitterSchemaEntry(
		'chat.conversations.markRead',
	),
	'chat.conversations.markUnread': twitterSchemaEntry(
		'chat.conversations.markUnread',
	),
	'chat.conversations.mute': twitterSchemaEntry('chat.conversations.mute'),
	'chat.conversations.sendTyping': twitterSchemaEntry(
		'chat.conversations.sendTyping',
	),
	'chat.conversations.unarchive': twitterSchemaEntry(
		'chat.conversations.unarchive',
	),
	'chat.conversations.unmute': twitterSchemaEntry('chat.conversations.unmute'),
	'chat.conversations.updateScreenCapture': twitterSchemaEntry(
		'chat.conversations.updateScreenCapture',
	),
	'chat.groups.adminRequests.approve': twitterSchemaEntry(
		'chat.groups.adminRequests.approve',
	),
	'chat.groups.adminRequests.create': twitterSchemaEntry(
		'chat.groups.adminRequests.create',
	),
	'chat.groups.adminRequests.list': twitterSchemaEntry(
		'chat.groups.adminRequests.list',
	),
	'chat.groups.adminRequests.reject': twitterSchemaEntry(
		'chat.groups.adminRequests.reject',
	),
	'chat.groups.admins.add': twitterSchemaEntry('chat.groups.admins.add'),
	'chat.groups.admins.remove': twitterSchemaEntry('chat.groups.admins.remove'),
	'chat.groups.create': twitterSchemaEntry('chat.groups.create'),
	'chat.groups.initialize': twitterSchemaEntry('chat.groups.initialize'),
	'chat.groups.inviteLink.disable': twitterSchemaEntry(
		'chat.groups.inviteLink.disable',
	),
	'chat.groups.inviteLink.enable': twitterSchemaEntry(
		'chat.groups.inviteLink.enable',
	),
	'chat.groups.inviteLink.get': twitterSchemaEntry(
		'chat.groups.inviteLink.get',
	),
	'chat.groups.joinRequests.create': twitterSchemaEntry(
		'chat.groups.joinRequests.create',
	),
	'chat.groups.joinRequests.reject': twitterSchemaEntry(
		'chat.groups.joinRequests.reject',
	),
	'chat.groups.members.add': twitterSchemaEntry('chat.groups.members.add'),
	'chat.groups.members.remove': twitterSchemaEntry(
		'chat.groups.members.remove',
	),
	'chat.groups.update': twitterSchemaEntry('chat.groups.update'),
	'chat.groups.updateAdminSettings': twitterSchemaEntry(
		'chat.groups.updateAdminSettings',
	),
	'chat.media.appendUpload': twitterSchemaEntry('chat.media.appendUpload'),
	'chat.media.download': twitterSchemaEntry('chat.media.download'),
	'chat.media.finalizeUpload': twitterSchemaEntry('chat.media.finalizeUpload'),
	'chat.media.initializeUpload': twitterSchemaEntry(
		'chat.media.initializeUpload',
	),
	'chat.messageRequests.accept': twitterSchemaEntry(
		'chat.messageRequests.accept',
	),
	'chat.messageRequests.get': twitterSchemaEntry('chat.messageRequests.get'),
	'chat.messageRequests.list': twitterSchemaEntry('chat.messageRequests.list'),
	'chat.messages.delete': twitterSchemaEntry('chat.messages.delete'),
	'chat.messages.send': twitterSchemaEntry('chat.messages.send'),
	'chat.settings.get': twitterSchemaEntry('chat.settings.get'),
	'chat.settings.update': twitterSchemaEntry('chat.settings.update'),
	'communities.get': twitterSchemaEntry('communities.get'),
	'communities.search': twitterSchemaEntry('communities.search'),
	'communityNotes.create': twitterSchemaEntry('communityNotes.create'),
	'communityNotes.delete': twitterSchemaEntry('communityNotes.delete'),
	'communityNotes.evaluate': twitterSchemaEntry('communityNotes.evaluate'),
	'communityNotes.searchEligiblePosts': twitterSchemaEntry(
		'communityNotes.searchEligiblePosts',
	),
	'communityNotes.searchWritten': twitterSchemaEntry(
		'communityNotes.searchWritten',
	),
	'compliance.jobs.cancel': twitterSchemaEntry('compliance.jobs.cancel'),
	'compliance.jobs.create': twitterSchemaEntry('compliance.jobs.create'),
	'compliance.jobs.downloadResults': twitterSchemaEntry(
		'compliance.jobs.downloadResults',
	),
	'compliance.jobs.get': twitterSchemaEntry('compliance.jobs.get'),
	'compliance.jobs.list': twitterSchemaEntry('compliance.jobs.list'),
	'compliance.jobs.upload': twitterSchemaEntry('compliance.jobs.upload'),
	'connections.history': twitterSchemaEntry('connections.history'),
	'connections.terminateAll': twitterSchemaEntry('connections.terminateAll'),
	'connections.terminateByEndpoint': twitterSchemaEntry(
		'connections.terminateByEndpoint',
	),
	'connections.terminateMany': twitterSchemaEntry('connections.terminateMany'),
	'directMessages.conversations.create': twitterSchemaEntry(
		'directMessages.conversations.create',
	),
	'directMessages.events.delete': twitterSchemaEntry(
		'directMessages.events.delete',
	),
	'directMessages.events.get': twitterSchemaEntry('directMessages.events.get'),
	'directMessages.events.list': twitterSchemaEntry(
		'directMessages.events.list',
	),
	'directMessages.events.listByConversation': twitterSchemaEntry(
		'directMessages.events.listByConversation',
	),
	'directMessages.events.listWithParticipant': twitterSchemaEntry(
		'directMessages.events.listWithParticipant',
	),
	'directMessages.media.download': twitterSchemaEntry(
		'directMessages.media.download',
	),
	'directMessages.sendToConversation': twitterSchemaEntry(
		'directMessages.sendToConversation',
	),
	'directMessages.sendToParticipant': twitterSchemaEntry(
		'directMessages.sendToParticipant',
	),
	'lists.create': twitterSchemaEntry('lists.create'),
	'lists.delete': twitterSchemaEntry('lists.delete'),
	'lists.followers.list': twitterSchemaEntry('lists.followers.list'),
	'lists.get': twitterSchemaEntry('lists.get'),
	'lists.members.add': twitterSchemaEntry('lists.members.add'),
	'lists.members.list': twitterSchemaEntry('lists.members.list'),
	'lists.members.remove': twitterSchemaEntry('lists.members.remove'),
	'lists.posts.list': twitterSchemaEntry('lists.posts.list'),
	'lists.update': twitterSchemaEntry('lists.update'),
	'media.amplify.addPost': twitterSchemaEntry('media.amplify.addPost'),
	'media.amplify.programs.get': twitterSchemaEntry(
		'media.amplify.programs.get',
	),
	'media.amplify.programs.list': twitterSchemaEntry(
		'media.amplify.programs.list',
	),
	'media.amplify.programs.listPosts': twitterSchemaEntry(
		'media.amplify.programs.listPosts',
	),
	'media.analytics': twitterSchemaEntry('media.analytics'),
	'media.get': twitterSchemaEntry('media.get'),
	'media.getMany': twitterSchemaEntry('media.getMany'),
	'media.library.add': twitterSchemaEntry('media.library.add'),
	'media.library.listCategories': twitterSchemaEntry(
		'media.library.listCategories',
	),
	'media.library.remove': twitterSchemaEntry('media.library.remove'),
	'media.library.update': twitterSchemaEntry('media.library.update'),
	'media.metadata.create': twitterSchemaEntry('media.metadata.create'),
	'media.subtitles.create': twitterSchemaEntry('media.subtitles.create'),
	'media.subtitles.delete': twitterSchemaEntry('media.subtitles.delete'),
	'media.upload.append': twitterSchemaEntry('media.upload.append'),
	'media.upload.finalize': twitterSchemaEntry('media.upload.finalize'),
	'media.upload.getStatus': twitterSchemaEntry('media.upload.getStatus'),
	'media.upload.initialize': twitterSchemaEntry('media.upload.initialize'),
	'media.upload.single': twitterSchemaEntry('media.upload.single'),
	'news.get': twitterSchemaEntry('news.get'),
	'news.search': twitterSchemaEntry('news.search'),
	'posts.analytics': twitterSchemaEntry('posts.analytics'),
	'posts.counts.all': twitterSchemaEntry('posts.counts.all'),
	'posts.counts.recent': twitterSchemaEntry('posts.counts.recent'),
	'posts.create': twitterSchemaEntry('posts.create'),
	'posts.delete': twitterSchemaEntry('posts.delete'),
	'posts.drafts.create': twitterSchemaEntry('posts.drafts.create'),
	'posts.drafts.delete': twitterSchemaEntry('posts.drafts.delete'),
	'posts.drafts.list': twitterSchemaEntry('posts.drafts.list'),
	'posts.get': twitterSchemaEntry('posts.get'),
	'posts.getMany': twitterSchemaEntry('posts.getMany'),
	'posts.hideReply': twitterSchemaEntry('posts.hideReply'),
	'posts.likingUsers': twitterSchemaEntry('posts.likingUsers'),
	'posts.quotes': twitterSchemaEntry('posts.quotes'),
	'posts.repostedBy': twitterSchemaEntry('posts.repostedBy'),
	'posts.reposts': twitterSchemaEntry('posts.reposts'),
	'posts.search.all': twitterSchemaEntry('posts.search.all'),
	'posts.search.recent': twitterSchemaEntry('posts.search.recent'),
	'posts.streamLinks.create': twitterSchemaEntry('posts.streamLinks.create'),
	'posts.streamLinks.delete': twitterSchemaEntry('posts.streamLinks.delete'),
	'posts.streamLinks.list': twitterSchemaEntry('posts.streamLinks.list'),
	'posts.streamRules.counts': twitterSchemaEntry('posts.streamRules.counts'),
	'posts.streamRules.list': twitterSchemaEntry('posts.streamRules.list'),
	'posts.streamRules.update': twitterSchemaEntry('posts.streamRules.update'),
	'sources.create': twitterSchemaEntry('sources.create'),
	'sources.delete': twitterSchemaEntry('sources.delete'),
	'sources.get': twitterSchemaEntry('sources.get'),
	'sources.getIngestRegion': twitterSchemaEntry('sources.getIngestRegion'),
	'sources.getStreamKey': twitterSchemaEntry('sources.getStreamKey'),
	'sources.list': twitterSchemaEntry('sources.list'),
	'sources.rename': twitterSchemaEntry('sources.rename'),
	'spaces.get': twitterSchemaEntry('spaces.get'),
	'spaces.getByCreators': twitterSchemaEntry('spaces.getByCreators'),
	'spaces.getMany': twitterSchemaEntry('spaces.getMany'),
	'spaces.listBuyers': twitterSchemaEntry('spaces.listBuyers'),
	'spaces.listPosts': twitterSchemaEntry('spaces.listPosts'),
	'spaces.search': twitterSchemaEntry('spaces.search'),
	'trends.byWoeid': twitterSchemaEntry('trends.byWoeid'),
	'trends.locations': twitterSchemaEntry('trends.locations'),
	'trends.personalized': twitterSchemaEntry('trends.personalized'),
	'usage.credits': twitterSchemaEntry('usage.credits'),
	'usage.get': twitterSchemaEntry('usage.get'),
	'users.affiliates': twitterSchemaEntry('users.affiliates'),
	'users.blockDms': twitterSchemaEntry('users.blockDms'),
	'users.blocking.block': twitterSchemaEntry('users.blocking.block'),
	'users.blocking.list': twitterSchemaEntry('users.blocking.list'),
	'users.blocking.unblock': twitterSchemaEntry('users.blocking.unblock'),
	'users.bookmarks.create': twitterSchemaEntry('users.bookmarks.create'),
	'users.bookmarks.delete': twitterSchemaEntry('users.bookmarks.delete'),
	'users.bookmarks.folders.create': twitterSchemaEntry(
		'users.bookmarks.folders.create',
	),
	'users.bookmarks.folders.list': twitterSchemaEntry(
		'users.bookmarks.folders.list',
	),
	'users.bookmarks.folders.listPosts': twitterSchemaEntry(
		'users.bookmarks.folders.listPosts',
	),
	'users.bookmarks.list': twitterSchemaEntry('users.bookmarks.list'),
	'users.broadcasts.create': twitterSchemaEntry('users.broadcasts.create'),
	'users.broadcasts.delete': twitterSchemaEntry('users.broadcasts.delete'),
	'users.broadcasts.get': twitterSchemaEntry('users.broadcasts.get'),
	'users.broadcasts.list': twitterSchemaEntry('users.broadcasts.list'),
	'users.broadcasts.updateState': twitterSchemaEntry(
		'users.broadcasts.updateState',
	),
	'users.followedLists.follow': twitterSchemaEntry(
		'users.followedLists.follow',
	),
	'users.followedLists.list': twitterSchemaEntry('users.followedLists.list'),
	'users.followedLists.unfollow': twitterSchemaEntry(
		'users.followedLists.unfollow',
	),
	'users.followers': twitterSchemaEntry('users.followers'),
	'users.following.follow': twitterSchemaEntry('users.following.follow'),
	'users.following.list': twitterSchemaEntry('users.following.list'),
	'users.following.unfollow': twitterSchemaEntry('users.following.unfollow'),
	'users.get': twitterSchemaEntry('users.get'),
	'users.getByUsername': twitterSchemaEntry('users.getByUsername'),
	'users.getMany': twitterSchemaEntry('users.getMany'),
	'users.getManyByUsernames': twitterSchemaEntry('users.getManyByUsernames'),
	'users.likes.like': twitterSchemaEntry('users.likes.like'),
	'users.likes.list': twitterSchemaEntry('users.likes.list'),
	'users.likes.unlike': twitterSchemaEntry('users.likes.unlike'),
	'users.listMemberships': twitterSchemaEntry('users.listMemberships'),
	'users.me': twitterSchemaEntry('users.me'),
	'users.mentions': twitterSchemaEntry('users.mentions'),
	'users.muting.list': twitterSchemaEntry('users.muting.list'),
	'users.muting.mute': twitterSchemaEntry('users.muting.mute'),
	'users.muting.unmute': twitterSchemaEntry('users.muting.unmute'),
	'users.myFollowers': twitterSchemaEntry('users.myFollowers'),
	'users.myFollowing': twitterSchemaEntry('users.myFollowing'),
	'users.ownedLists': twitterSchemaEntry('users.ownedLists'),
	'users.pinnedLists.list': twitterSchemaEntry('users.pinnedLists.list'),
	'users.pinnedLists.pin': twitterSchemaEntry('users.pinnedLists.pin'),
	'users.pinnedLists.unpin': twitterSchemaEntry('users.pinnedLists.unpin'),
	'users.posts': twitterSchemaEntry('users.posts'),
	'users.publicKeys.add': twitterSchemaEntry('users.publicKeys.add'),
	'users.publicKeys.get': twitterSchemaEntry('users.publicKeys.get'),
	'users.publicKeys.getMany': twitterSchemaEntry('users.publicKeys.getMany'),
	'users.reposts.create': twitterSchemaEntry('users.reposts.create'),
	'users.reposts.delete': twitterSchemaEntry('users.reposts.delete'),
	'users.repostsOfMe': twitterSchemaEntry('users.repostsOfMe'),
	'users.search': twitterSchemaEntry('users.search'),
	'users.sources.create': twitterSchemaEntry('users.sources.create'),
	'users.sources.delete': twitterSchemaEntry('users.sources.delete'),
	'users.sources.get': twitterSchemaEntry('users.sources.get'),
	'users.sources.list': twitterSchemaEntry('users.sources.list'),
	'users.sources.rename': twitterSchemaEntry('users.sources.rename'),
	'users.timeline': twitterSchemaEntry('users.timeline'),
	'users.unblockDms': twitterSchemaEntry('users.unblockDms'),
	'webhooks.create': twitterSchemaEntry('webhooks.create'),
	'webhooks.delete': twitterSchemaEntry('webhooks.delete'),
	'webhooks.list': twitterSchemaEntry('webhooks.list'),
	'webhooks.replay': twitterSchemaEntry('webhooks.replay'),
	'webhooks.validate': twitterSchemaEntry('webhooks.validate'),
} satisfies RequiredPluginEndpointSchemas<
	typeof twitterGeneratedEndpointsNested
>;

export const twitterGeneratedEndpointMeta = {
	'account.ensure': {
		riskLevel: 'write',
		description:
			'Creates an X Developer Platform account for the authenticated user if they do not already have one, and returns it. Idempotent: when the user already has an account it is returned unchanged with `created` false. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope developer.write (pass scopes to the plugin).',
	},
	'account.get': {
		riskLevel: 'read',
		description:
			"Returns the X Developer Platform account that is billed for the authenticated user's API access. A user with no such account gets a resource-not-found error entry. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope developer.read (pass scopes to the plugin).",
	},
	'accountActivity.subscriptions.count': {
		riskLevel: 'read',
		description:
			"Retrieves a count of currently active Account Activity subscriptions. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'accountActivity.subscriptions.create': {
		riskLevel: 'write',
		description:
			'Creates an Account Activity subscription for the user and the given webhook. Needs a user (OAuth 2.0) token.',
	},
	'accountActivity.subscriptions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes an Account Activity subscription for the given webhook and user ID. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'accountActivity.subscriptions.list': {
		riskLevel: 'read',
		description:
			"Retrieves a list of all active subscriptions for a given webhook. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'accountActivity.subscriptions.validate': {
		riskLevel: 'read',
		description:
			"Checks a user's Account Activity subscription for a given webhook. Needs a user (OAuth 2.0) token.",
	},
	'activity.subscriptions.create': {
		riskLevel: 'write',
		description:
			'Creates a subscription for an X activity event. OAuth2 user-context tokens must hold the scope matching the requested event_type: dm.read for chat.* and dm.* events, like.read for like.* events, mute.read for mute.* events, block.read for block.* events, follows.read for subscriptions.* events, and tweet.read for all other event types.',
	},
	'activity.subscriptions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a subscription for an X activity event.',
	},
	'activity.subscriptions.deleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes multiple subscriptions for X activity events by their IDs. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'activity.subscriptions.list': {
		riskLevel: 'read',
		description:
			'Get a list of active subscriptions for XAA. Optional user_id narrows the list to subscriptions whose filter.user_id matches; with a user-context token it must identify the authenticated user.',
	},
	'activity.subscriptions.update': {
		riskLevel: 'write',
		description: 'Updates a subscription for an X activity event.',
	},
	'articles.createDraft': {
		riskLevel: 'write',
		description:
			'Creates a new Article draft that can later be published. Needs a user (OAuth 2.0) token.',
	},
	'articles.publish': {
		riskLevel: 'destructive',
		description:
			'Publishes a draft Article, making it publicly visible. Needs a user (OAuth 2.0) token.',
	},
	'bots.create': {
		riskLevel: 'destructive',
		description:
			"Creates a bot account in the calling app's project and returns its bearer token. Repeating the request for a handle the project already has returns that bot with a new token and revokes the previous one, so a retry can revoke a token another caller just received. Coordinate retries for the same handle.",
	},
	'bots.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes a bot account from the calling app's project. With an OAuth 2.0 user token, the user must be an admin of the project's developer account. On API Connect, where the request bills the user's own account, the bot is deleted from the user's project instead.",
	},
	'bots.list': {
		riskLevel: 'read',
		description:
			"Retrieves the bot accounts in the calling app's project. meta.max_bots is the most bots the project can have. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'bots.token.revoke': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Revokes a bot's bearer token. The bot account is kept, and rotating its token mints a new one. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'bots.token.rotate': {
		riskLevel: 'destructive',
		description:
			'Mints a new bearer token for a bot and invalidates every token previously issued for it. The new token is returned only once.',
	},
	'bots.update': {
		riskLevel: 'write',
		description:
			"Updates a bot's handle, display name, or who may send it Direct Messages. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'broadcasts.chat.deleteMessage': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes a specific chat message from a running broadcast where the authenticated user is the host or a moderator. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).',
	},
	'broadcasts.chat.list': {
		riskLevel: 'read',
		description:
			'Returns newest-first chat messages for a broadcast owned by the authenticated user. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read (pass scopes to the plugin).',
	},
	'broadcasts.chat.muteUser': {
		riskLevel: 'write',
		description:
			'Prevents a user from posting further messages in a running broadcast chat. When `end_at_ms` is provided, the mute expires at that time. The authenticated user must be the broadcast host or a moderator. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).',
	},
	'broadcasts.chat.send': {
		riskLevel: 'destructive',
		description:
			'Posts a chat message to a running broadcast, attributed to the authenticated user. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).',
	},
	'broadcasts.chat.unmuteUser': {
		riskLevel: 'write',
		description:
			'Allows a muted user to post messages in a running broadcast chat again. The authenticated user must be the broadcast host or a moderator. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).',
	},
	'broadcasts.chatModerators.add': {
		riskLevel: 'write',
		description:
			"Adds a moderator to the authenticated broadcaster's persistent list and returns the updated moderator user IDs. The list applies to all current and future broadcast chats. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).",
	},
	'broadcasts.chatModerators.list': {
		riskLevel: 'read',
		description:
			"Returns the authenticated broadcaster's persistent moderators as User resources. The list applies to all of their current and future broadcast chats. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read (pass scopes to the plugin).",
	},
	'broadcasts.chatModerators.remove': {
		riskLevel: 'write',
		description:
			"Removes a moderator from the authenticated broadcaster's persistent list and returns the updated moderator user IDs. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).",
	},
	'broadcasts.chatMutes.create': {
		riskLevel: 'write',
		description:
			"Prevents a user from posting messages in all of a broadcaster's chats. Without `broadcast_id`, the user is muted in the authenticated user's own chats. Moderators pass `broadcast_id` to mute the user in that broadcast host's chats. When `end_at_ms` is provided, the mute expires at that time. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).",
	},
	'broadcasts.chatMutes.delete': {
		riskLevel: 'write',
		description:
			"Allows a muted user to post messages in a broadcaster's chats again. Without `broadcast_id`, the user is unmuted in the authenticated user's own chats. Moderators pass `broadcast_id` to unmute the user in that broadcast host's chats. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).",
	},
	'broadcasts.chatMutes.list': {
		riskLevel: 'read',
		description:
			"Returns the users muted in the authenticated broadcaster's chat, with the expiry time of timed mutes. Mutes apply to all of their broadcasts. Expired timed mutes are omitted. Use `expansions=user_id` to include the muted users. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read (pass scopes to the plugin).",
	},
	'broadcasts.create': {
		riskLevel: 'destructive',
		description:
			"Takes one or more of the authenticated user's sources live and returns 201 with the new broadcast. Several sources (`source_id` plus `additional_source_ids`, one per video format) go live together as one broadcast; they must all be RTMP sources in one region, and when one of them is already live its broadcast is returned only if it holds every listed source. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).",
	},
	'broadcasts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes one of the authenticated user's broadcasts, scheduled or ended, including its replay. A running broadcast must be ended first. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).",
	},
	'broadcasts.end': {
		riskLevel: 'destructive',
		description:
			"Ends one of the authenticated user's broadcasts. Only `state: END` is supported. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).",
	},
	'broadcasts.get': {
		riskLevel: 'read',
		description:
			'Returns a broadcast owned by the authenticated user. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read (pass scopes to the plugin).',
	},
	'broadcasts.list': {
		riskLevel: 'read',
		description:
			"Returns the authenticated user's live-video broadcasts, or selected owned broadcasts when ids are provided. At most one of `ids`, `max_results` may be provided. At most one of `ids`, `pagination_token` may be provided. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read (pass scopes to the plugin).",
	},
	'broadcasts.listCategories': {
		riskLevel: 'read',
		description:
			"Returns the live categories a host can pick when going live, in display order. Pass a category's `id` as `live_category_id` on POST /2/broadcasts. Ids are permanent; names can change, so store the id and show the current name. The whole list is returned in one response, without paging. Needs the extra OAuth scope broadcast.read (pass scopes to the plugin).",
	},
	'broadcasts.scheduled.create': {
		riskLevel: 'write',
		description:
			"Schedules a broadcast for the authenticated user on one of their sources: `source_id` is required. Passing a stream key as `source_id` is deprecated and stops working when the /2/users/:id/sources and /2/users/:id/broadcasts routes reach end of life on January 1, 2027; pass the source's `id` from GET /2/sources instead. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).",
	},
	'broadcasts.scheduled.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a scheduled broadcast by its alphanumeric broadcast id. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).',
	},
	'broadcasts.scheduled.get': {
		riskLevel: 'read',
		description:
			'Returns a single scheduled broadcast by its alphanumeric broadcast id. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read (pass scopes to the plugin).',
	},
	'broadcasts.scheduled.goLive': {
		riskLevel: 'destructive',
		description:
			'Publishes a schedule that was created or updated with `manual_publish: true`. Without that flag the coordinator auto-publishes at start and this call is rejected. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).',
	},
	'broadcasts.scheduled.list': {
		riskLevel: 'read',
		description:
			'Returns scheduled broadcasts owned by the authenticated user. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read (pass scopes to the plugin).',
	},
	'broadcasts.scheduled.update': {
		riskLevel: 'write',
		description:
			"Updates a scheduled broadcast. Path `:id` is the broadcast id; the body must include `scheduled_broadcast_id`. Re-send every field that should be kept. Passing a stream key as `source_id` is deprecated and stops working when the /2/users/:id/sources and /2/users/:id/broadcasts routes reach end of life on January 1, 2027; pass the source's `id` from GET /2/sources instead. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).",
	},
	'broadcasts.update': {
		riskLevel: 'write',
		description:
			"Changes the title, chat option or live category of one of the authenticated user's broadcasts and returns the broadcast. Send at least one of `title`, `chat_option` and `live_category_id`; fields left out keep their values. A broadcast can be updated before it starts, while it is live and after it has ended. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).",
	},
	'calls.create': {
		riskLevel: 'destructive',
		description:
			'Starts an X call hosted by the authenticated user (typically a bot). Pass an XChat conversation_id to start the call in that conversation, or omit it for a standalone call anyone can join with the returned join_url (subject to join_policy). The call starts empty: put an agent in it with POST /2/calls/:id/join. When the host joins a conversation call, the other members are rung. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope calls.write (pass scopes to the plugin).',
	},
	'calls.get': {
		riskLevel: 'read',
		description:
			"Returns a call's title, join policy, host and participant count, and whether the authenticated user may join it without asking the host. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope calls.read (pass scopes to the plugin).",
	},
	'calls.join': {
		riskLevel: 'write',
		description:
			'Starts a media session that takes part in the call as the authenticated user. The response carries a media_url and a short-lived media_token: open a WebSocket to media_url with the token as a Bearer credential to exchange PCM16 audio and events with the call; the user enters the call when the WebSocket connects. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope calls.join (pass scopes to the plugin).',
	},
	'calls.leave': {
		riskLevel: 'write',
		description:
			"Ends the authenticated user's media session in the call (its WebSocket receives session.ended with reason left) and removes the user from the call. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope calls.join (pass scopes to the plugin).",
	},
	'calls.scheduled.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Cancels a scheduled call the authenticated user organizes, and takes it off invitees' calendars. For a recurring call, scope and occurrence_start_time pick the occurrences: all of them (the default), one, or one and every one after it. Cancelling what is already cancelled succeeds. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope calls.write (pass scopes to the plugin).",
	},
	'calls.scheduled.create': {
		riskLevel: 'destructive',
		description:
			"Puts an X call on the authenticated user's X Calls calendar, with them as its organizer, and invites people to it. The call exists right away: share its join_url, or put an agent in it at start time with POST /2/calls/:id/join. A recurrence (an RFC 5545 RRULE) repeats it. Invitees get an email unless notify_invitees is false. Invitees get an email unless notify_invitees is false. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope calls.write (pass scopes to the plugin).",
	},
	'calls.scheduled.get': {
		riskLevel: 'read',
		description:
			'Returns a scheduled call the authenticated user organizes or is invited to, at its occurrence running now or its next one within a year: its time, call, recurrence and who is invited and how they answered. Changes can take a few seconds to show here. Use scheduled_call.fields to select which fields are returned. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope calls.read (pass scopes to the plugin).',
	},
	'calls.scheduled.list': {
		riskLevel: 'read',
		description:
			"Returns the X calls on the authenticated user's calendar, earliest first: events on their X Calls calendar, and events on the Microsoft Outlook calendars they linked to X whose conference is an X call. Calls still running at start_time are included. The window defaults to the next 24 hours and may span at most 7 days. Use scheduled_call.fields to select which fields are returned. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope calls.read (pass scopes to the plugin).",
	},
	'calls.scheduled.respond': {
		riskLevel: 'write',
		description:
			'Accepts, declines or tentatively accepts an invitation to a scheduled call for the authenticated user. For a recurring call, scope and occurrence_start_time pick the occurrences the answer is for: all of them (the default), one, or one and every one after it. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope calls.write (pass scopes to the plugin).',
	},
	'calls.scheduled.update': {
		riskLevel: 'destructive',
		description:
			'Moves, renames or re-invites a scheduled call the authenticated user organizes. Only the fields sent change. For a recurring call, scope and occurrence_start_time pick the occurrences: all of them (the default), one, or one and every one after it. Invitees get an email about the change unless notify_invitees is false. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope calls.write (pass scopes to the plugin).',
	},
	'chat.conversations.addKeys': {
		riskLevel: 'write',
		description:
			"Adds (initializes or rotates) the encryption keys for a Chat conversation. Call this before sending messages in a new 1:1 conversation, and again with a newer key version to rotate the conversation key. For 1:1 conversations, provide the recipient's user ID as the conversation id; the server constructs the canonical conversation ID from the authenticated user and recipient. Needs a user (OAuth 2.0) token.",
	},
	'chat.conversations.archive': {
		riskLevel: 'write',
		description:
			"Archives a Chat conversation for the authenticated user only. Archiving an archived conversation changes nothing. Works for group and 1:1 conversations. For 1:1 conversations, provide the recipient's user ID; the server constructs the canonical conversation ID from the authenticated user and recipient. Needs a user (OAuth 2.0) token.",
	},
	'chat.conversations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes a Chat conversation for the authenticated user only; other participants keep it. Works for group and 1:1 conversations. For 1:1 conversations, provide the recipient's user ID; the server constructs the canonical conversation ID from the authenticated user and recipient. Deleting a pending message request's conversation deletes the request, like Delete in the X app. Needs a user (OAuth 2.0) token.",
	},
	'chat.conversations.disableMessageTtl': {
		riskLevel: 'write',
		description:
			"Stops new messages in a 1:1 or group Chat conversation from disappearing, for every participant. For 1:1 conversations, provide the recipient's user ID; the server constructs the canonical conversation ID from the authenticated user and recipient. Needs a user (OAuth 2.0) token.",
	},
	'chat.conversations.enableMessageTtl': {
		riskLevel: 'write',
		description:
			"Sets how long new messages in a 1:1 or group Chat conversation last before they disappear, for every participant. For 1:1 conversations, provide the recipient's user ID; the server constructs the canonical conversation ID from the authenticated user and recipient. Needs a user (OAuth 2.0) token.",
	},
	'chat.conversations.get': {
		riskLevel: 'read',
		description:
			"Returns metadata for a Chat conversation including type, muted status, group details, and your unread state. For the unread state, request chat_conversation.fields=unread,last_read_event_id,newest_event_id: those fields give your read state, computed from your latest read receipt and the conversation's latest notifying message. Use chat_conversation.fields to select which fields are returned. Needs a user (OAuth 2.0) token.",
	},
	'chat.conversations.list': {
		riskLevel: 'read',
		description:
			"Retrieves a list of Chat conversations for the authenticated user's inbox, newest first: the most recently active conversation comes first. To find the chat with a particular person, start with participant_query set to their @username or name; with expansions=participant_ids, user.fields=receives_your_chat says how you can message each match. Needs a user (OAuth 2.0) token.",
	},
	'chat.conversations.listEvents': {
		riskLevel: 'read',
		description:
			"Retrieves the events of a specific Chat conversation, newest first, with pagination support: messages, key changes, group changes, and read receipts. Events with an id above the conversation's last_read_event_id are unread: they come after the point you read up to. To collect them, page until an event's id is at or below it. Only `id` and `encoded_event` are always present. Needs a user (OAuth 2.0) token.",
	},
	'chat.conversations.listPinnedMessages': {
		riskLevel: 'read',
		description:
			"Retrieves the pinned message events of a Chat conversation with pagination support. Each event is a Base64-encoded Thrift pin event whose contents are end-to-end encrypted; decode and decrypt it client-side. For 1:1 conversations, provide the recipient's user ID; the server constructs the canonical conversation ID from the authenticated user and recipient. Needs a user (OAuth 2.0) token.",
	},
	'chat.conversations.markRead': {
		riskLevel: 'write',
		description:
			"Marks a specific Chat conversation as read on behalf of the authenticated user. For 1:1 conversations, provide the recipient's user ID; the server constructs the canonical conversation ID from the authenticated user and recipient. Without action_signatures the conversation is marked read up to its newest event and the read receipt is unsigned. Needs a user (OAuth 2.0) token.",
	},
	'chat.conversations.markUnread': {
		riskLevel: 'write',
		description:
			"Marks a specific Chat conversation as unread on behalf of the authenticated user. For 1:1 conversations, provide the recipient's user ID; the server constructs the canonical conversation ID from the authenticated user and recipient. Needs a user (OAuth 2.0) token.",
	},
	'chat.conversations.mute': {
		riskLevel: 'write',
		description:
			"Mutes notifications for a Chat conversation for the authenticated user only. Works for group and 1:1 conversations. For 1:1 conversations, provide the recipient's user ID; the server constructs the canonical conversation ID from the authenticated user and recipient. Needs a user (OAuth 2.0) token.",
	},
	'chat.conversations.sendTyping': {
		riskLevel: 'write',
		description:
			"Sends a typing indicator to a specific Chat conversation on behalf of the authenticated user. For 1:1 conversations, provide the recipient's user ID; the server constructs the canonical conversation ID from the authenticated user and recipient. Needs a user (OAuth 2.0) token.",
	},
	'chat.conversations.unarchive': {
		riskLevel: 'write',
		description:
			"Unarchives a Chat conversation for the authenticated user only. Unarchiving a conversation that is not archived changes nothing. Works for group and 1:1 conversations. For 1:1 conversations, provide the recipient's user ID; the server constructs the canonical conversation ID from the authenticated user and recipient. Needs a user (OAuth 2.0) token.",
	},
	'chat.conversations.unmute': {
		riskLevel: 'write',
		description:
			"Unmutes notifications for a Chat conversation for the authenticated user only. Works for group and 1:1 conversations. For 1:1 conversations, provide the recipient's user ID; the server constructs the canonical conversation ID from the authenticated user and recipient. Needs a user (OAuth 2.0) token.",
	},
	'chat.conversations.updateScreenCapture': {
		riskLevel: 'write',
		description:
			"Turns screenshot blocking or screenshot detection on or off in a Chat conversation, for every participant. In a group conversation, only admins can change these settings. Each request changes one setting: send either blocking or detection. For 1:1 conversations, provide the recipient's user ID; the server constructs the canonical conversation ID from the authenticated user and recipient. Needs a user (OAuth 2.0) token.",
	},
	'chat.groups.adminRequests.approve': {
		riskLevel: 'write',
		description:
			'Makes the user who requested admin permissions an admin of an encrypted Chat group conversation. Only a group admin can approve. Needs a user (OAuth 2.0) token.',
	},
	'chat.groups.adminRequests.create': {
		riskLevel: 'write',
		description:
			'Asks the admins of an encrypted Chat group conversation to make the authenticated user an admin. An admin approves or rejects the request. Needs a user (OAuth 2.0) token.',
	},
	'chat.groups.adminRequests.list': {
		riskLevel: 'read',
		description:
			'Returns the users who have asked to become admins of an encrypted Chat group conversation. Only a group admin can list admin requests. Use user.fields to select which profile fields are returned. Needs a user (OAuth 2.0) token.',
	},
	'chat.groups.adminRequests.reject': {
		riskLevel: 'write',
		description:
			"Declines a user's pending request for admin permissions in an encrypted Chat group conversation. Only a group admin can reject. Needs a user (OAuth 2.0) token.",
	},
	'chat.groups.admins.add': {
		riskLevel: 'write',
		description:
			'Grants admin rights to one or more members of an existing encrypted Chat group conversation. Needs a user (OAuth 2.0) token.',
	},
	'chat.groups.admins.remove': {
		riskLevel: 'write',
		description:
			'Revokes admin rights from one or more admins of an existing encrypted Chat group conversation. They stay members of the group. Needs a user (OAuth 2.0) token.',
	},
	'chat.groups.create': {
		riskLevel: 'destructive',
		description:
			'Creates a new encrypted Chat group conversation on behalf of the authenticated user. Needs a user (OAuth 2.0) token.',
	},
	'chat.groups.initialize': {
		riskLevel: 'write',
		description:
			'Initializes a new Chat group conversation and returns a unique conversation ID. Use the returned conversation_id in a subsequent POST /chat/conversations/group call to fully create and configure the group. Needs a user (OAuth 2.0) token.',
	},
	'chat.groups.inviteLink.disable': {
		riskLevel: 'write',
		description:
			'Turns off the invite link for an encrypted Chat group conversation. The existing link stops working. Needs a user (OAuth 2.0) token.',
	},
	'chat.groups.inviteLink.enable': {
		riskLevel: 'write',
		description:
			"Turns on the invite link for an encrypted Chat group conversation and returns the link details. The client builds the link and sends it as invite_url, in the form https://x.com/i/chat/group_join/<conversation_id>/<token>, where the token is exactly 10 letters, digits, '-' or '_'. invite_url is required when action_signatures is sent. Needs a user (OAuth 2.0) token.",
	},
	'chat.groups.inviteLink.get': {
		riskLevel: 'read',
		description:
			"Returns the preview of an encrypted Chat group conversation from its invite link: group name, avatar, member count, and the authenticated user's join state. The conversation ID and the token both come from the invite link. Needs a user (OAuth 2.0) token.",
	},
	'chat.groups.joinRequests.create': {
		riskLevel: 'write',
		description:
			'Asks to join an encrypted Chat group conversation through its invite link. The request stays pending until a group admin adds the user to the group. Needs a user (OAuth 2.0) token.',
	},
	'chat.groups.joinRequests.reject': {
		riskLevel: 'write',
		description:
			'Rejects pending requests to join an encrypted Chat group conversation. Only group admins can reject requests. To approve a request instead, add the requesting users with addChatGroupMembers; adding a user clears their pending request. Needs a user (OAuth 2.0) token.',
	},
	'chat.groups.members.add': {
		riskLevel: 'write',
		description:
			'Adds one or more members to an existing encrypted Chat group conversation, rotating the conversation key. Adding a user who has a pending join request approves that request; approval needs the same key-rotation body as adding any member. Needs a user (OAuth 2.0) token.',
	},
	'chat.groups.members.remove': {
		riskLevel: 'write',
		description:
			'Removes one or more members from an existing encrypted Chat group conversation. To leave a group, pass your own user ID. Leaving does not delete the conversation for the caller. When the removal rotates the conversation key, send group_key_rotation_data and the action signatures for the removal and the key change, in that order. Needs a user (OAuth 2.0) token.',
	},
	'chat.groups.update': {
		riskLevel: 'write',
		description:
			'Renames an encrypted Chat group conversation, changes its avatar, or sets its description. The client encrypts each value with the conversation key and lists the values it changed in modified_fields. Needs a user (OAuth 2.0) token.',
	},
	'chat.groups.updateAdminSettings': {
		riskLevel: 'write',
		description:
			'Sets which actions only admins can perform in an existing encrypted Chat group conversation. A setting set to true restricts that action to admins, and false opens it to all members. Setting `send_message` to true makes the group announcement-only. Omitted settings keep their stored value. Needs a user (OAuth 2.0) token.',
	},
	'chat.media.appendUpload': {
		riskLevel: 'write',
		description:
			'Appends media data to an XChat upload session. Pass media as { base64: "…" }, { url } or a public URL string (a bare string is a URL, not base64); the plugin base64-encodes the bytes for X. Up to 4 MB per segment. Needs a user (OAuth 2.0) token.',
	},
	'chat.media.download': {
		riskLevel: 'read',
		description:
			'Downloads encrypted media bytes from an XChat conversation. The response body contains raw binary bytes. A media item too large to return in one response fails with a 413 problem of type `https://api.x.com/2/problems/response-too-large`, and a retry fails the same way. Needs a user (OAuth 2.0) token.',
	},
	'chat.media.finalizeUpload': {
		riskLevel: 'write',
		description:
			'Finalizes an XChat media upload session. Needs a user (OAuth 2.0) token.',
	},
	'chat.media.initializeUpload': {
		riskLevel: 'write',
		description:
			'Initializes an XChat media upload session. Needs a user (OAuth 2.0) token.',
	},
	'chat.messageRequests.accept': {
		riskLevel: 'write',
		description:
			"Accepts the other user's pending message request in a 1:1 Chat conversation, which moves to the authenticated user's inbox. Without a pending request, including after a successful accept, the response is 404. Replying to a request does not accept it. Needs a user (OAuth 2.0) token.",
	},
	'chat.messageRequests.get': {
		riskLevel: 'write',
		description:
			'Retrieves the message request state of a 1:1 Chat conversation and its newest message events. Like opening the request in an X app, reading it marks the returned messages as delivered and updates the unread badge. Needs a user (OAuth 2.0) token.',
	},
	'chat.messageRequests.list': {
		riskLevel: 'read',
		description:
			"Retrieves the authenticated user's pending Chat message requests from one inbox. Message contents are end-to-end encrypted unless the conversation is unencrypted. Accepting or deleting requests between pages can skip or repeat requests, and a page can be empty while `next_token` is set. Needs a user (OAuth 2.0) token.",
	},
	'chat.messages.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes one or more messages from a Chat conversation. For 1:1 conversations, provide the recipient's user ID; the server constructs the canonical conversation ID from the authenticated user and recipient. Delete for all removes a message you sent (or, in groups you administer, any message) for every participant; delete for self removes any message only from your own view. Needs a user (OAuth 2.0) token.",
	},
	'chat.messages.send': {
		riskLevel: 'destructive',
		description:
			'Sends a message or reaction to a Chat conversation, which you can find with `participant_query` on Get Chat Conversations. Send it end-to-end encrypted by default: `encoded_message_create_event`, built with the Chat XDK. Needs a user (OAuth 2.0) token.',
	},
	'chat.settings.get': {
		riskLevel: 'read',
		description:
			"Returns the authenticated user's Chat privacy settings: who can message them, read receipts, the message quality filter, and audio/video call permissions. Needs a user (OAuth 2.0) token.",
	},
	'chat.settings.update': {
		riskLevel: 'write',
		description:
			"Updates the authenticated user's Chat privacy settings: who can message them, read receipts, the message quality filter, and audio/video call permissions. allow_dms_from, dm_receipt_settings, and dm_quality_filter accept only their listed values, matched exactly and case-sensitively; anything else is a 400. av_settings must set at least one of its settings. Needs a user (OAuth 2.0) token.",
	},
	'communities.get': {
		riskLevel: 'read',
		description: 'Retrieves details of a specific Community by its ID.',
	},
	'communities.search': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Communities matching the specified search query. Needs a user (OAuth 2.0) token.',
	},
	'communityNotes.create': {
		riskLevel: 'destructive',
		description:
			'Creates a Community Note on a Post. With test_mode set to true, the note is only for testing and is not publicly visible. Needs a user (OAuth 2.0) token.',
	},
	'communityNotes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a community note. Needs a user (OAuth 2.0) token.',
	},
	'communityNotes.evaluate': {
		riskLevel: 'write',
		description:
			'Evaluates the text of a proposed Community Note on a Post and returns its claim-opinion score. Needs a user (OAuth 2.0) token.',
	},
	'communityNotes.searchEligiblePosts': {
		riskLevel: 'read',
		description:
			'Retrieves Posts that are eligible for Community Notes. Needs a user (OAuth 2.0) token.',
	},
	'communityNotes.searchWritten': {
		riskLevel: 'read',
		description:
			'Retrieves the Community Notes written by the authenticated user. Needs a user (OAuth 2.0) token.',
	},
	'compliance.jobs.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Cancels a Compliance Job that has not finished processing; its status becomes failed and a new job of the same type can be created. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'compliance.jobs.create': {
		riskLevel: 'write',
		description:
			"Creates a new Compliance Job for the specified job type. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'compliance.jobs.downloadResults': {
		riskLevel: 'read',
		description:
			"Downloads the results file of a completed Compliance Job using the signed URL returned at job creation. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'compliance.jobs.get': {
		riskLevel: 'read',
		description:
			"Retrieves details of a specific Compliance Job by its ID. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'compliance.jobs.list': {
		riskLevel: 'read',
		description:
			"Retrieves a list of Compliance Jobs filtered by job type and optional status. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'compliance.jobs.upload': {
		riskLevel: 'write',
		description:
			"Uploads the newline-delimited ID file for a Compliance Job using the signed URL returned at job creation. Pass file as { base64 } or a URL to a text file with one post or user ID per line. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'connections.history': {
		riskLevel: 'read',
		description:
			"Returns active and historical streaming connections with disconnect reasons for the authenticated application. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'connections.terminateAll': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Terminates all active streaming connections for the authenticated application. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'connections.terminateByEndpoint': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Terminates all streaming connections for a specific endpoint ID for the authenticated application. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'connections.terminateMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Terminates multiple streaming connections by their UUIDs for the authenticated application. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'directMessages.conversations.create': {
		riskLevel: 'destructive',
		description:
			'Initiates a new direct message conversation with specified participants. Billed by X: $0.015 per Direct Message. Needs a user (OAuth 2.0) token.',
	},
	'directMessages.events.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a specific direct message event by its ID, if owned by the authenticated user. Needs a user (OAuth 2.0) token.',
	},
	'directMessages.events.get': {
		riskLevel: 'read',
		description:
			'Retrieves details of a specific direct message event by its ID. Needs a user (OAuth 2.0) token.',
	},
	'directMessages.events.list': {
		riskLevel: 'read',
		description:
			'Retrieves a list of recent direct message events across all conversations. Billed by X per DM event returned ($0.010 each). Needs a user (OAuth 2.0) token.',
	},
	'directMessages.events.listByConversation': {
		riskLevel: 'read',
		description:
			'Retrieves direct message events for a specific conversation by its ID. Needs a user (OAuth 2.0) token.',
	},
	'directMessages.events.listWithParticipant': {
		riskLevel: 'read',
		description:
			'Retrieves direct message events for the one-to-one conversation between the authenticated user and a specific participant. Needs a user (OAuth 2.0) token.',
	},
	'directMessages.media.download': {
		riskLevel: 'read',
		description:
			'Downloads media attached to a legacy Direct Message. The requesting user must be a participant in the conversation containing the specified DM event. The response body contains raw binary bytes. Needs a user (OAuth 2.0) token.',
	},
	'directMessages.sendToConversation': {
		riskLevel: 'destructive',
		description:
			'Sends a new direct message to a specific conversation by its ID. Billed by X: $0.015 per Direct Message. Needs a user (OAuth 2.0) token.',
	},
	'directMessages.sendToParticipant': {
		riskLevel: 'destructive',
		description:
			'Sends a new direct message to a specific participant by their ID. Billed by X: $0.015 per Direct Message. Needs a user (OAuth 2.0) token.',
	},
	'lists.create': {
		riskLevel: 'write',
		description:
			'Creates a new List for the authenticated user. Needs a user (OAuth 2.0) token.',
	},
	'lists.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a specific List owned by the authenticated user by its ID. Needs a user (OAuth 2.0) token.',
	},
	'lists.followers.list': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Users who follow a specific List by its ID.',
	},
	'lists.get': {
		riskLevel: 'read',
		description: 'Retrieves details of a specific List by its ID.',
	},
	'lists.members.add': {
		riskLevel: 'write',
		description:
			'Adds a User to a specific List by its ID. Needs a user (OAuth 2.0) token.',
	},
	'lists.members.list': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Users who are members of a specific List by its ID.',
	},
	'lists.members.remove': {
		riskLevel: 'write',
		description:
			'Removes a User from a List by their ID. Needs a user (OAuth 2.0) token.',
	},
	'lists.posts.list': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Posts associated with a specific List by its ID.',
	},
	'lists.update': {
		riskLevel: 'write',
		description:
			'Updates the details of a specific List owned by the authenticated user by its ID. Needs a user (OAuth 2.0) token.',
	},
	'media.amplify.addPost': {
		riskLevel: 'destructive',
		description:
			"Publishes one of the authenticated user's video posts into one or more active Amplify pre-roll programs the user is enrolled in as a publisher. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope media.library.write (pass scopes to the plugin).",
	},
	'media.amplify.programs.get': {
		riskLevel: 'read',
		description:
			'Returns one Amplify pre-roll program the authenticated user is enrolled in as a publisher. A program the user is not enrolled in is reported as not found. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope media.library.read (pass scopes to the plugin).',
	},
	'media.amplify.programs.list': {
		riskLevel: 'read',
		description:
			'Returns the Amplify pre-roll programs the authenticated user is enrolled in as a publisher. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope media.library.read (pass scopes to the plugin).',
	},
	'media.amplify.programs.listPosts': {
		riskLevel: 'read',
		description:
			'Returns the posts published into an Amplify pre-roll program the authenticated user is enrolled in as a publisher. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope media.library.read (pass scopes to the plugin).',
	},
	'media.analytics': {
		riskLevel: 'read',
		description:
			'Retrieves analytics data for media. Needs a user (OAuth 2.0) token.',
	},
	'media.get': {
		riskLevel: 'read',
		description: 'Retrieves details of a specific Media file by its media key.',
	},
	'media.getMany': {
		riskLevel: 'read',
		description: 'Retrieves details of Media files by their media keys.',
	},
	'media.library.add': {
		riskLevel: 'write',
		description:
			"Adds previously uploaded media to the authenticated user's Media Library with its library metadata. The user must own the media. Geo restrictions, content expiry, the preview image and the audience policy are set with the Media metadata endpoint. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope media.library.write (pass scopes to the plugin).",
	},
	'media.library.listCategories': {
		riskLevel: 'read',
		description:
			'Returns the video categories a publisher can assign to a media library item and the advertiser categories whose ads can be blocked from running against it. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope media.library.read (pass scopes to the plugin).',
	},
	'media.library.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Removes an item from the authenticated user's Media Library. Posts scheduled through the API that have not yet been published and still use the media are cancelled. Published posts and the underlying media are not affected. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope media.library.write (pass scopes to the plugin).",
	},
	'media.library.update': {
		riskLevel: 'write',
		description:
			"Updates the library metadata of an item in the authenticated user's Media Library. Only the fields sent are changed; the others keep their values. Geo restrictions, content expiry, the preview image and the audience policy are set with the Media metadata endpoint. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope media.library.write (pass scopes to the plugin).",
	},
	'media.metadata.create': {
		riskLevel: 'write',
		description:
			'Creates metadata for a Media file. Needs a user (OAuth 2.0) token.',
	},
	'media.subtitles.create': {
		riskLevel: 'write',
		description:
			'Creates subtitles for a specific Media file. Needs a user (OAuth 2.0) token.',
	},
	'media.subtitles.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes subtitles for a specific Media file. Needs a user (OAuth 2.0) token.',
	},
	'media.upload.append': {
		riskLevel: 'write',
		description:
			'Appends one segment of the file to a chunked upload. Send the segment base64-encoded in media (raw bytes in multipart bodies) and its position in the file in segment_index, counting from 0. A segment can be up to 8 MB; in a JSON body keep it to 4 MB or less, because base64 adds a third. After the last segment, call Finalize Media Upload. Pass media as { base64: "…" }, { url } or a public URL string (a bare string is a URL, not base64); the plugin base64-encodes the bytes for X. Up to 4 MB per segment. Needs a user (OAuth 2.0) token.',
	},
	'media.upload.finalize': {
		riskLevel: 'write',
		description:
			'Completes a chunked upload once every segment is appended. For video the result carries processing_info: the media can go on a Post only when its state is succeeded, so call Get Media Upload Status until it is. A result without processing_info is ready to use. Needs a user (OAuth 2.0) token.',
	},
	'media.upload.getStatus': {
		riskLevel: 'read',
		description:
			"Returns how far X has processed an uploaded media file, in processing_info.state: pending, in_progress, succeeded or failed. Call it after Finalize Media Upload returns processing_info, waiting check_after_secs between calls, until the state is succeeded. A failed state means the media can't be used. Needs a user (OAuth 2.0) token.",
	},
	'media.upload.initialize': {
		riskLevel: 'write',
		description:
			"Starts a chunked media upload and returns its id. Use it for video and for other files too large for one request. For a video on a Post, set media_category to tweet_video, media_type to the file's type (for example video/mp4) and total_bytes to the file's size. Send the file with Append Media Upload, call Finalize Media Upload, then pass the id in media.media_ids on Create or Edit Post. Needs a user (OAuth 2.0) token.",
	},
	'media.upload.single': {
		riskLevel: 'write',
		description:
			'Uploads a media file in one request and returns its id. Send the file base64-encoded in media (raw bytes in multipart bodies). For a Post, set media_category to tweet_image (JPG, PNG, GIF or WEBP, up to 5 MB) or tweet_gif, then pass the returned id in media.media_ids on Create or Edit Post. DM media uses dm_image or dm_gif. For video, use Initialize Media Upload. Pass media as { base64: "…" }, { url } or a public URL string (a bare string is a URL, not base64); the plugin base64-encodes the bytes for X. Up to 15 MB here; use the chunked upload (initialize, append, finalize) for video. Needs a user (OAuth 2.0) token.',
	},
	'news.get': {
		riskLevel: 'read',
		description: 'Retrieves news story by its ID.',
	},
	'news.search': {
		riskLevel: 'read',
		description:
			'Retrieves a list of News stories matching the specified search query.',
	},
	'posts.analytics': {
		riskLevel: 'read',
		description:
			'Retrieves analytics data for specified Posts within a defined time range. Needs a user (OAuth 2.0) token.',
	},
	'posts.counts.all': {
		riskLevel: 'read',
		description:
			"Retrieves the count of Posts matching a search query from the full archive. At most one of `pagination_token`, `next_token` may be provided. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'posts.counts.recent': {
		riskLevel: 'read',
		description:
			'Retrieves the count of Posts from the last 7 days matching a search query. At most one of `pagination_token`, `next_token` may be provided.',
	},
	'posts.create': {
		riskLevel: 'destructive',
		description:
			'Creates a new Post for the authenticated user, or edits an existing Post when edit_options are provided. Media in media.media_ids is attached in the order given; get the ids by uploading each image with Upload Media, or a video with Initialize Media Upload. Supports paid partnership disclosure via the paid_partnership field. Billed by X: $0.015 per post, $0.20 for a post that contains a URL. Quote posts (quote_tweet_id): X removed this from the self-serve pay-per-use tiers on 2026-04-20, so it may answer 403 unless the app has an enterprise or legacy tier. Needs a user (OAuth 2.0) token.',
	},
	'posts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a specific Post by its ID, if owned by the authenticated user. Needs a user (OAuth 2.0) token.',
	},
	'posts.drafts.create': {
		riskLevel: 'write',
		description:
			"Saves a Post draft to the authenticated user's X account without publishing it. Takes the body of Create or Edit Post, of which a draft stores text, media with tagged users, a reply and the AI and paid partnership disclosures. Any other field that is set is a 400 that names it. Needs a user (OAuth 2.0) token.",
	},
	'posts.drafts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes one of the authenticated user's Post drafts by its ID. The whole draft is deleted, including any part Get Post Drafts does not list, and cannot be restored. An ID that is not one of the user's drafts also returns deleted: true. Needs a user (OAuth 2.0) token.",
	},
	'posts.drafts.list': {
		riskLevel: 'read',
		description:
			"Returns the authenticated user's Post drafts, newest first, in the fields of the Create or Edit Post body. thread holds the Posts after the first. A draft with unsupported_content is not listed in full: do not publish it from this list or delete it unless the user asks. Needs the tweet.write scope. Needs a user (OAuth 2.0) token.",
	},
	'posts.get': {
		riskLevel: 'read',
		description: 'Retrieves details of a specific Post by its ID.',
	},
	'posts.getMany': {
		riskLevel: 'read',
		description: 'Retrieves details of multiple Posts by their IDs.',
	},
	'posts.hideReply': {
		riskLevel: 'write',
		description:
			'Hides or unhides a reply to a conversation owned by the authenticated user. Needs a user (OAuth 2.0) token.',
	},
	'posts.likingUsers': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Users who liked a specific Post by its ID. Needs a user (OAuth 2.0) token.',
	},
	'posts.quotes': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Posts that quote a specific Post by its ID.',
	},
	'posts.repostedBy': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Users who reposted a specific Post by its ID.',
	},
	'posts.reposts': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Posts that repost a specific Post by its ID.',
	},
	'posts.search.all': {
		riskLevel: 'read',
		description:
			'Retrieves Posts from the full archive matching a search query. At most one of `start_time`, `since_id` may be provided. At most one of `end_time`, `until_id` may be provided. At most one of `pagination_token`, `next_token` may be provided. Billed by X per post returned ($0.005 each); keep max_results low.',
	},
	'posts.search.recent': {
		riskLevel: 'read',
		description:
			'Retrieves Posts from the last 7 days matching a search query. At most one of `start_time`, `since_id` may be provided. At most one of `end_time`, `until_id` may be provided. At most one of `pagination_token`, `next_token` may be provided. Billed by X per post returned ($0.005 each); keep max_results low.',
	},
	'posts.streamLinks.create': {
		riskLevel: 'write',
		description:
			"Creates a link to deliver FilteredStream events to the given webhook. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'posts.streamLinks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes the link delivering FilteredStream events to the given webhook. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'posts.streamLinks.list': {
		riskLevel: 'read',
		description:
			"Get a list of webhook links associated with a filtered stream ruleset. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'posts.streamRules.counts': {
		riskLevel: 'read',
		description:
			"Retrieves the count of rules in the active rule set for the filtered stream. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'posts.streamRules.list': {
		riskLevel: 'read',
		description:
			"Returns the active filtered-stream rules for the authenticated app. Provide `ids` to fetch specific rules; omit it to list all rules. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'posts.streamRules.update': {
		riskLevel: 'destructive',
		description:
			"Adds or deletes rules from the active rule set for the filtered stream. Exactly one of `add`, `delete`, or `?delete_all=true` must be specified. Use `?dry_run=true` to validate without committing. Send exactly one of add, delete or delete_all: true; dry_run checks the change without applying it. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'sources.create': {
		riskLevel: 'write',
		description:
			'Creates a persistent RTMP/RTMPS ingest point for the authenticated user. Push an encoder to `rtmps_url` with the returned `stream_key`. This is the only response that includes the stream key; read it later with GET /2/sources/:id/stream_key. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).',
	},
	'sources.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes one of the authenticated user's stream sources. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).",
	},
	'sources.get': {
		riskLevel: 'read',
		description:
			"Returns one of the authenticated user's stream sources. Poll it after starting an encoder and wait for `is_stream_active` before going live. The stream key is not included; read it with GET /2/sources/:id/stream_key. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read (pass scopes to the plugin).",
	},
	'sources.getIngestRegion': {
		riskLevel: 'read',
		description:
			'Returns the ingest region nearest the server handling the request. Pass it as `region` when creating a stream source to ingest there. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read (pass scopes to the plugin).',
	},
	'sources.getStreamKey': {
		riskLevel: 'read',
		description:
			"Returns the stream key of one of the authenticated user's stream sources. The stream key is a credential: anyone with it can stream to the source, so keep it out of logs, URLs and client-side code. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).",
	},
	'sources.list': {
		riskLevel: 'read',
		description:
			"Returns the authenticated user's RTMP/RTMPS stream sources. A source's `id` is the `source_id` that POST /2/broadcasts and scheduled broadcasts take. Stream keys are not included; read one with GET /2/sources/:id/stream_key. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read (pass scopes to the plugin).",
	},
	'sources.rename': {
		riskLevel: 'write',
		description:
			"Renames one of the authenticated user's stream sources. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).",
	},
	'spaces.get': {
		riskLevel: 'read',
		description: 'Retrieves details of a specific Space by its ID.',
	},
	'spaces.getByCreators': {
		riskLevel: 'read',
		description: 'Retrieves details of Spaces created by specified User IDs.',
	},
	'spaces.getMany': {
		riskLevel: 'read',
		description: 'Retrieves details of multiple Spaces by their IDs.',
	},
	'spaces.listBuyers': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Users who purchased tickets to a specific Space by its ID. Needs a user (OAuth 2.0) token.',
	},
	'spaces.listPosts': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Posts shared in a specific Space by its ID.',
	},
	'spaces.search': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Spaces matching the specified search query.',
	},
	'trends.byWoeid': {
		riskLevel: 'read',
		description:
			'Retrieves trending topics for a specific location identified by its WOEID. `meta.location` describes that location: its `woeid` and `name`, and when they are known its `country`, `country_code`, `place_type` (`town`, `country` or `supername`) and `parent_id`, the WOEID of the place that contains it.',
	},
	'trends.locations': {
		riskLevel: 'read',
		description:
			'Retrieves every location that has trends. Each location has a WOEID to pass to `GET /2/trends/by/woeid/{woeid}`. The list is short and is returned whole, so the route takes no paging parameters.',
	},
	'trends.personalized': {
		riskLevel: 'read',
		description:
			'Retrieves personalized trending topics for the authenticated user. Needs a user (OAuth 2.0) token.',
	},
	'usage.credits': {
		riskLevel: 'read',
		description:
			"Returns the payer's developer-platform credit balance in USD. total_balance is max(0, prepaid_balance + free_balance); prepaid_balance may be negative.",
	},
	'usage.get': {
		riskLevel: 'read',
		description:
			"Retrieves usage statistics for Posts over a specified number of days. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'users.affiliates': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Users who are affiliated with a specific organization User by their ID.',
	},
	'users.blockDms': {
		riskLevel: 'write',
		description:
			'Blocks direct messages to or from a specific User by their ID for the authenticated user. Needs a user (OAuth 2.0) token.',
	},
	'users.blocking.block': {
		riskLevel: 'destructive',
		description:
			'Causes the source User to block the target User. A block also removes any follow between the two Users, in both directions, and unblocking does not restore it. Each call blocks one account: block only accounts the authenticated User named or approved, because finding or reviewing accounts is not approval to block them. Needs a user (OAuth 2.0) token.',
	},
	'users.blocking.list': {
		riskLevel: 'read',
		description:
			'Returns the Users that the given User is blocking. Needs a user (OAuth 2.0) token.',
	},
	'users.blocking.unblock': {
		riskLevel: 'write',
		description:
			'Causes the source User to unblock the target User. Unblocking does not restore any follow the block removed, so blocking and then unblocking a follower removes them as a follower: do that only for followers the authenticated User approved removing. Needs a user (OAuth 2.0) token.',
	},
	'users.bookmarks.create': {
		riskLevel: 'write',
		description:
			"Adds one or more Posts to the authenticated user's Bookmarks. Supply `tweet_id` for a single Post, or `tweet_ids` (at most 25) to bookmark several in one request. Optional `folder_id` applies to every Post in the request. Billing and rate limits still apply per HTTP request. Send tweet_id or tweet_ids, not both. Needs a user (OAuth 2.0) token.",
	},
	'users.bookmarks.delete': {
		riskLevel: 'write',
		description:
			"Removes a Post from the authenticated user's Bookmarks by its ID. Needs a user (OAuth 2.0) token.",
	},
	'users.bookmarks.folders.create': {
		riskLevel: 'write',
		description:
			'Creates a new Bookmark folder for the authenticated user. Needs a user (OAuth 2.0) token.',
	},
	'users.bookmarks.folders.list': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Bookmark folders created by the authenticated user. Needs a user (OAuth 2.0) token.',
	},
	'users.bookmarks.folders.listPosts': {
		riskLevel: 'read',
		description:
			'Retrieves Posts in a specific Bookmark folder by its ID for the authenticated user. Needs a user (OAuth 2.0) token.',
	},
	'users.bookmarks.list': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Posts bookmarked by the authenticated user. Needs a user (OAuth 2.0) token.',
	},
	'users.broadcasts.create': {
		riskLevel: 'destructive',
		description:
			"Creates a broadcast on one of the authenticated user's sources. `id` must be the authenticated user. The broadcast is `NOT_STARTED` and posts nothing until it is published with PUT /2/users/:id/broadcasts/:broadcast_id/state; one that is never published is deleted after 7 days. When the source already has a running broadcast, that broadcast is returned. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).",
	},
	'users.broadcasts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes one of the authenticated user's broadcasts. `id` must be the authenticated user. Deprecated: use DELETE /2/broadcasts/:id. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).",
	},
	'users.broadcasts.get': {
		riskLevel: 'read',
		description:
			"Returns one of the authenticated user's broadcasts. `id` must be the authenticated user. Deprecated: use GET /2/broadcasts/:id. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read (pass scopes to the plugin).",
	},
	'users.broadcasts.list': {
		riskLevel: 'read',
		description:
			"Returns the authenticated user's broadcasts, 100 per page. `id` must be the authenticated user. Deprecated: use GET /2/broadcasts. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read (pass scopes to the plugin).",
	},
	'users.broadcasts.updateState': {
		riskLevel: 'destructive',
		description:
			"Publishes or ends one of the authenticated user's broadcasts. `id` must be the authenticated user. `PUBLISH` takes a broadcast created with POST /2/users/:id/broadcasts live once its source is receiving video, and posts it unless `should_not_tweet` is true. `END` ends the broadcast. Deprecated: use PUT /2/broadcasts/:id/state to end a broadcast. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).",
	},
	'users.followedLists.follow': {
		riskLevel: 'write',
		description:
			'Causes the authenticated user to follow a specific List by its ID. Needs a user (OAuth 2.0) token.',
	},
	'users.followedLists.list': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Lists followed by a specific User by their ID.',
	},
	'users.followedLists.unfollow': {
		riskLevel: 'write',
		description:
			'Causes the authenticated user to unfollow a List by its ID. Needs a user (OAuth 2.0) token.',
	},
	'users.followers': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Users who follow a specific User by their ID.',
	},
	'users.following.follow': {
		riskLevel: 'write',
		description:
			'Causes the authenticated user to follow a specific User by their ID. X removed this from the self-serve pay-per-use tiers on 2026-04-20, so it may answer 403 unless the app has an enterprise or legacy tier. Needs a user (OAuth 2.0) token.',
	},
	'users.following.list': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Users followed by a specific User by their ID.',
	},
	'users.following.unfollow': {
		riskLevel: 'write',
		description:
			'Causes the authenticated user to unfollow a specific user by their ID. Needs a user (OAuth 2.0) token.',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Retrieves details of a specific User by their ID.',
	},
	'users.getByUsername': {
		riskLevel: 'read',
		description:
			'Retrieves details of a specific User by their username. Billed by X as one user read ($0.010).',
	},
	'users.getMany': {
		riskLevel: 'read',
		description: 'Retrieves details of multiple Users by their IDs.',
	},
	'users.getManyByUsernames': {
		riskLevel: 'read',
		description: 'Retrieves details of multiple Users by their usernames.',
	},
	'users.likes.like': {
		riskLevel: 'write',
		description:
			'Causes the authenticated user to like a specific Post by its ID. X removed this from the self-serve pay-per-use tiers on 2026-04-20, so it may answer 403 unless the app has an enterprise or legacy tier. Needs a user (OAuth 2.0) token.',
	},
	'users.likes.list': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Posts liked by a specific User by their ID. Needs a user (OAuth 2.0) token.',
	},
	'users.likes.unlike': {
		riskLevel: 'write',
		description:
			'Causes the authenticated user to unlike a specific Post by its ID. Needs a user (OAuth 2.0) token.',
	},
	'users.listMemberships': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Lists that a specific User is a member of by their ID.',
	},
	'users.me': {
		riskLevel: 'read',
		description:
			'Get the user the access token belongs to (id, name, username). Billed by X as one user read ($0.010). Needs a user (OAuth 2.0) token.',
	},
	'users.mentions': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Posts that mention a specific User by their ID. When both are provided, `start_time` must be earlier than `end_time`. When both are provided, `since_id` must be less than `until_id`.',
	},
	'users.muting.list': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Users muted by the authenticated user. Needs a user (OAuth 2.0) token.',
	},
	'users.muting.mute': {
		riskLevel: 'write',
		description:
			'Causes the authenticated user to mute a specific User by their ID. Needs a user (OAuth 2.0) token.',
	},
	'users.muting.unmute': {
		riskLevel: 'write',
		description:
			'Causes the authenticated user to unmute the target user. Needs a user (OAuth 2.0) token.',
	},
	'users.myFollowers': {
		riskLevel: 'read',
		description:
			'Returns the Users who follow the authenticated user. Same results as `GET /2/users/{id}/followers` with your own user ID, without looking it up. Needs a user (OAuth 2.0) token.',
	},
	'users.myFollowing': {
		riskLevel: 'read',
		description:
			'Returns the Users the authenticated user follows. Same results as `GET /2/users/{id}/following` with your own user ID, without looking it up. Needs a user (OAuth 2.0) token.',
	},
	'users.ownedLists': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Lists owned by a specific User by their ID.',
	},
	'users.pinnedLists.list': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Lists pinned by the authenticated user. Needs a user (OAuth 2.0) token.',
	},
	'users.pinnedLists.pin': {
		riskLevel: 'write',
		description:
			'Causes the authenticated user to pin a specific List by its ID. Needs a user (OAuth 2.0) token.',
	},
	'users.pinnedLists.unpin': {
		riskLevel: 'write',
		description:
			'Causes the authenticated user to unpin a List by its ID. Needs a user (OAuth 2.0) token.',
	},
	'users.posts': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Posts authored by a specific User by their ID. When both are provided, `start_time` must be earlier than `end_time`. When both are provided, `since_id` must be less than `until_id`.',
	},
	'users.publicKeys.add': {
		riskLevel: 'write',
		description:
			"Registers a user's public key for X Chat encryption. Needs a user (OAuth 2.0) token.",
	},
	'users.publicKeys.get': {
		riskLevel: 'read',
		description:
			"Returns a user's registered public keys for X Chat encryption. Every key field is returned by default, so public_key.fields can be left out. It takes public_key, signing_public_key, identity_public_key_signature, public_key_version and juicebox_config. Needs a user (OAuth 2.0) token.",
	},
	'users.publicKeys.getMany': {
		riskLevel: 'read',
		description:
			'Returns the public keys that up to 100 users registered for X Chat encryption, looked up by numeric user ID. Each key carries the user_id of the user it belongs to. Every key field is returned by default, so public_key.fields can be left out. It takes public_key, signing_public_key, identity_public_key_signature, public_key_version, juicebox_config and user_id. Needs a user (OAuth 2.0) token.',
	},
	'users.reposts.create': {
		riskLevel: 'destructive',
		description:
			'Causes the authenticated user to repost a specific Post by its ID. Billed by X: $0.015 per post, $0.20 for a post that contains a URL. Needs a user (OAuth 2.0) token.',
	},
	'users.reposts.delete': {
		riskLevel: 'write',
		description:
			'Causes the authenticated user to unrepost a specific Post by its ID. Needs a user (OAuth 2.0) token.',
	},
	'users.repostsOfMe': {
		riskLevel: 'read',
		description:
			'Retrieves a list of Posts that repost content from the authenticated user. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope timeline.read (pass scopes to the plugin).',
	},
	'users.search': {
		riskLevel: 'read',
		description: 'Retrieves a list of Users matching a search query.',
	},
	'users.sources.create': {
		riskLevel: 'write',
		description:
			'Creates a persistent RTMP/RTMPS ingest point for the authenticated user. `id` must be the authenticated user. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).',
	},
	'users.sources.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes one of the authenticated user's stream sources. `id` must be the authenticated user. Success is an empty object. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).",
	},
	'users.sources.get': {
		riskLevel: 'read',
		description:
			"Returns one of the authenticated user's stream sources. `id` must be the authenticated user. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read (pass scopes to the plugin).",
	},
	'users.sources.list': {
		riskLevel: 'read',
		description:
			"Returns the authenticated user's RTMP/RTMPS stream sources (empty array if none). `id` must be the authenticated user. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read (pass scopes to the plugin).",
	},
	'users.sources.rename': {
		riskLevel: 'write',
		description:
			"Renames one of the authenticated user's stream sources. `id` must be the authenticated user. Needs a user (OAuth 2.0) token. Needs the extra OAuth scope broadcast.read, broadcast.write (pass scopes to the plugin).",
	},
	'users.timeline': {
		riskLevel: 'read',
		description:
			"Retrieves a reverse chronological list of Posts in the authenticated user's Timeline. When both are provided, `start_time` must be earlier than `end_time`. When both are provided, `since_id` must be less than `until_id`. Needs a user (OAuth 2.0) token.",
	},
	'users.unblockDms': {
		riskLevel: 'write',
		description:
			'Unblocks direct messages to or from a specific User by their ID for the authenticated user. Needs a user (OAuth 2.0) token.',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Creates a new webhook configuration.',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes an existing webhook configuration.',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'Get a list of webhook configs associated with a client app.',
	},
	'webhooks.replay': {
		riskLevel: 'destructive',
		description:
			"Creates a replay job to retrieve events from up to the past 24 hours for all events delivered or attempted to be delivered to the webhook. Needs app-only auth: X accepts only the app's Bearer token here (connect with authType 'api_key').",
	},
	'webhooks.validate': {
		riskLevel: 'write',
		description: 'Triggers a CRC check for a given webhook.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof twitterGeneratedEndpointsNested
>;
