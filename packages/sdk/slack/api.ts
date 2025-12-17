import {
	ChannelsService,
	ChatService,
	FilesService,
	ReactionsService,
	SearchService,
	StarsService,
	UsergroupsService,
	UsersService,
} from './services';

export const Slack = {
	Channels: {
		archive: ChannelsService.conversationsArchive,
		close: ChannelsService.conversationsClose,
		create: ChannelsService.conversationsCreate,
		get: ChannelsService.conversationsInfo,
		list: ChannelsService.conversationsList,
		getHistory: ChannelsService.conversationsHistory,
		invite: ChannelsService.conversationsInvite,
		join: ChannelsService.conversationsJoin,
		kick: ChannelsService.conversationsKick,
		leave: ChannelsService.conversationsLeave,
		getMembers: ChannelsService.conversationsMembers,
		open: ChannelsService.conversationsOpen,
		rename: ChannelsService.conversationsRename,
		getReplies: ChannelsService.conversationsReplies,
		setPurpose: ChannelsService.conversationsSetPurpose,
		setTopic: ChannelsService.conversationsSetTopic,
		unarchive: ChannelsService.conversationsUnarchive,
	},

	Users: {
		get: UsersService.usersInfo,
		list: UsersService.usersList,
		getProfile: UsersService.usersProfileGet,
		getPresence: UsersService.usersGetPresence,
		updateProfile: UsersService.usersProfileSet,
	},

	Usergroups: {
		create: UsergroupsService.usergroupsCreate,
		disable: UsergroupsService.usergroupsDisable,
		enable: UsergroupsService.usergroupsEnable,
		list: UsergroupsService.usergroupsList,
		update: UsergroupsService.usergroupsUpdate,
	},

	Files: {
		get: FilesService.filesInfo,
		list: FilesService.filesList,
		upload: FilesService.filesUpload,
	},

	Messages: {
		delete: ChatService.chatDelete,
		getPermalink: ChatService.chatGetPermalink,
		search: SearchService.searchMessages,
		send: ChatService.chatPostMessage,
		update: ChatService.chatUpdate,
	},

	Reactions: {
		add: ReactionsService.reactionsAdd,
		get: ReactionsService.reactionsGet,
		remove: ReactionsService.reactionsRemove,
	},

	Stars: {
		add: StarsService.starsAdd,
		remove: StarsService.starsRemove,
		list: StarsService.starsList,
	},
};
