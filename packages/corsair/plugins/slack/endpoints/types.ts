import { z } from 'zod';

const ChannelsRandomInputSchema = z.object({});

const ChannelsArchiveInputSchema = z.object({
	channel: z.string(),
});

const ChannelsCloseInputSchema = z.object({
	channel: z.string(),
});

const ChannelsCreateInputSchema = z.object({
	name: z.string(),
	is_private: z.boolean().optional(),
	team_id: z.string().optional(),
});

const ChannelsGetInputSchema = z.object({
	channel: z.string(),
	include_locale: z.boolean().optional(),
	include_num_members: z.boolean().optional(),
});

const ChannelsListInputSchema = z.object({
	exclude_archived: z.boolean().optional(),
	types: z.string().optional(),
	team_id: z.string().optional(),
	cursor: z.string().optional(),
	limit: z.number().optional(),
});

const ChannelsGetHistoryInputSchema = z.object({
	channel: z.string(),
	latest: z.string().optional(),
	oldest: z.string().optional(),
	inclusive: z.boolean().optional(),
	include_all_metadata: z.boolean().optional(),
	cursor: z.string().optional(),
	limit: z.number().optional(),
});

const ChannelsInviteInputSchema = z.object({
	channel: z.string(),
	users: z.string(),
	force: z.boolean().optional(),
});

const ChannelsJoinInputSchema = z.object({
	channel: z.string(),
});

const ChannelsKickInputSchema = z.object({
	channel: z.string(),
	user: z.string(),
});

const ChannelsLeaveInputSchema = z.object({
	channel: z.string(),
});

const ChannelsGetMembersInputSchema = z.object({
	channel: z.string(),
	cursor: z.string().optional(),
	limit: z.number().optional(),
});

const ChannelsOpenInputSchema = z.object({
	channel: z.string().optional(),
	users: z.string().optional(),
	prevent_creation: z.boolean().optional(),
	return_im: z.boolean().optional(),
});

const ChannelsRenameInputSchema = z.object({
	channel: z.string(),
	name: z.string(),
});

const ChannelsGetRepliesInputSchema = z.object({
	channel: z.string(),
	ts: z.string(),
	latest: z.string().optional(),
	oldest: z.string().optional(),
	inclusive: z.boolean().optional(),
	include_all_metadata: z.boolean().optional(),
	cursor: z.string().optional(),
	limit: z.number().optional(),
});

const ChannelsSetPurposeInputSchema = z.object({
	channel: z.string(),
	purpose: z.string(),
});

const ChannelsSetTopicInputSchema = z.object({
	channel: z.string(),
	topic: z.string(),
});

const ChannelsUnarchiveInputSchema = z.object({
	channel: z.string(),
});

const UsersGetInputSchema = z.object({
	user: z.string(),
	include_locale: z.boolean().optional(),
});

const UsersListInputSchema = z.object({
	include_locale: z.boolean().optional(),
	team_id: z.string().optional(),
	cursor: z.string().optional(),
	limit: z.number().optional(),
});

const UsersGetProfileInputSchema = z.object({
	user: z.string().optional(),
	include_labels: z.boolean().optional(),
});

const UsersGetPresenceInputSchema = z.object({
	user: z.string().optional(),
});

const UsersUpdateProfileInputSchema = z.object({
	profile: z.record(z.unknown()).optional(),
	user: z.string().optional(),
	name: z.string().optional(),
	value: z.string().optional(),
});

const UserGroupsCreateInputSchema = z.object({
	name: z.string(),
	channels: z.string().optional(),
	description: z.string().optional(),
	handle: z.string().optional(),
	include_count: z.boolean().optional(),
	team_id: z.string().optional(),
});

const UserGroupsDisableInputSchema = z.object({
	userGroup: z.string(),
	include_count: z.boolean().optional(),
	team_id: z.string().optional(),
});

const UserGroupsEnableInputSchema = z.object({
	userGroup: z.string(),
	include_count: z.boolean().optional(),
	team_id: z.string().optional(),
});

const UserGroupsListInputSchema = z.object({
	include_count: z.boolean().optional(),
	include_disabled: z.boolean().optional(),
	include_users: z.boolean().optional(),
	team_id: z.string().optional(),
});

const UserGroupsUpdateInputSchema = z.object({
	userGroup: z.string(),
	name: z.string().optional(),
	channels: z.string().optional(),
	description: z.string().optional(),
	handle: z.string().optional(),
	include_count: z.boolean().optional(),
	team_id: z.string().optional(),
});

const FilesGetInputSchema = z.object({
	file: z.string(),
	cursor: z.string().optional(),
	limit: z.number().optional(),
	page: z.number().optional(),
	count: z.number().optional(),
});

const FilesListInputSchema = z.object({
	channel: z.string().optional(),
	user: z.string().optional(),
	types: z.string().optional(),
	ts_from: z.string().optional(),
	ts_to: z.string().optional(),
	show_files_hidden_by_limit: z.boolean().optional(),
	team_id: z.string().optional(),
	page: z.number().optional(),
	count: z.number().optional(),
});

const FilesUploadInputSchema = z.object({
	channels: z.string().optional(),
	content: z.string().optional(),
	file: z.unknown().optional(),
	filename: z.string().optional(),
	filetype: z.string().optional(),
	initial_comment: z.string().optional(),
	thread_ts: z.string().optional(),
	title: z.string().optional(),
});

const MessagesDeleteInputSchema = z.object({
	channel: z.string(),
	ts: z.string(),
	as_user: z.boolean().optional(),
});

const MessagesGetPermalinkInputSchema = z.object({
	channel: z.string(),
	message_ts: z.string(),
});

const MessagesSearchInputSchema = z.object({
	query: z.string(),
	sort: z.enum(['score', 'timestamp']).optional(),
	sort_dir: z.enum(['asc', 'desc']).optional(),
	highlight: z.boolean().optional(),
	team_id: z.string().optional(),
	cursor: z.string().optional(),
	limit: z.number().optional(),
	page: z.number().optional(),
	count: z.number().optional(),
});

const PostMessageInputSchema = z.object({
	channel: z.string(),
	text: z.string().optional(),
	blocks: z
		.array(
			z.object({
				type: z.string(),
			}).passthrough(),
		)
		.optional(),
	attachments: z.array(z.record(z.unknown())).optional(),
	thread_ts: z.string().optional(),
	reply_broadcast: z.boolean().optional(),
	parse: z.enum(['full', 'none']).optional(),
	link_names: z.boolean().optional(),
	unfurl_links: z.boolean().optional(),
	unfurl_media: z.boolean().optional(),
	mrkdwn: z.boolean().optional(),
	as_user: z.boolean().optional(),
	icon_emoji: z.string().optional(),
	icon_url: z.string().optional(),
	username: z.string().optional(),
	metadata: z
		.object({
			event_type: z.string(),
			event_payload: z.record(z.unknown()),
		})
		.optional(),
});

const MessagesUpdateInputSchema = z.object({
	channel: z.string(),
	ts: z.string(),
	text: z.string().optional(),
	blocks: z
		.array(
			z.object({
				type: z.string(),
			}).passthrough(),
		)
		.optional(),
	attachments: z.array(z.record(z.unknown())).optional(),
	parse: z.enum(['full', 'none']).optional(),
	link_names: z.boolean().optional(),
	as_user: z.boolean().optional(),
	file_ids: z.array(z.string()).optional(),
	reply_broadcast: z.boolean().optional(),
	metadata: z
		.object({
			event_type: z.string(),
			event_payload: z.record(z.unknown()),
		})
		.optional(),
});

const ReactionsAddInputSchema = z.object({
	channel: z.string(),
	timestamp: z.string(),
	name: z.string(),
});

const ReactionsGetInputSchema = z.object({
	channel: z.string().optional(),
	timestamp: z.string().optional(),
	file: z.string().optional(),
	file_comment: z.string().optional(),
	full: z.boolean().optional(),
});

const ReactionsRemoveInputSchema = z.object({
	name: z.string(),
	channel: z.string().optional(),
	timestamp: z.string().optional(),
	file: z.string().optional(),
	file_comment: z.string().optional(),
});

const StarsAddInputSchema = z.object({
	channel: z.string().optional(),
	timestamp: z.string().optional(),
	file: z.string().optional(),
	file_comment: z.string().optional(),
});

const StarsRemoveInputSchema = z.object({
	channel: z.string().optional(),
	timestamp: z.string().optional(),
	file: z.string().optional(),
	file_comment: z.string().optional(),
});

const StarsListInputSchema = z.object({
	team_id: z.string().optional(),
	cursor: z.string().optional(),
	limit: z.number().optional(),
	page: z.number().optional(),
	count: z.number().optional(),
});

export const SlackEndpointInputSchemas = {
	channelsRandom: ChannelsRandomInputSchema,
	channelsArchive: ChannelsArchiveInputSchema,
	channelsClose: ChannelsCloseInputSchema,
	channelsCreate: ChannelsCreateInputSchema,
	channelsGet: ChannelsGetInputSchema,
	channelsList: ChannelsListInputSchema,
	channelsGetHistory: ChannelsGetHistoryInputSchema,
	channelsInvite: ChannelsInviteInputSchema,
	channelsJoin: ChannelsJoinInputSchema,
	channelsKick: ChannelsKickInputSchema,
	channelsLeave: ChannelsLeaveInputSchema,
	channelsGetMembers: ChannelsGetMembersInputSchema,
	channelsOpen: ChannelsOpenInputSchema,
	channelsRename: ChannelsRenameInputSchema,
	channelsGetReplies: ChannelsGetRepliesInputSchema,
	channelsSetPurpose: ChannelsSetPurposeInputSchema,
	channelsSetTopic: ChannelsSetTopicInputSchema,
	channelsUnarchive: ChannelsUnarchiveInputSchema,
	usersGet: UsersGetInputSchema,
	usersList: UsersListInputSchema,
	usersGetProfile: UsersGetProfileInputSchema,
	usersGetPresence: UsersGetPresenceInputSchema,
	usersUpdateProfile: UsersUpdateProfileInputSchema,
	userGroupsCreate: UserGroupsCreateInputSchema,
	userGroupsDisable: UserGroupsDisableInputSchema,
	userGroupsEnable: UserGroupsEnableInputSchema,
	userGroupsList: UserGroupsListInputSchema,
	userGroupsUpdate: UserGroupsUpdateInputSchema,
	filesGet: FilesGetInputSchema,
	filesList: FilesListInputSchema,
	filesUpload: FilesUploadInputSchema,
	messagesDelete: MessagesDeleteInputSchema,
	messagesGetPermalink: MessagesGetPermalinkInputSchema,
	messagesSearch: MessagesSearchInputSchema,
	postMessage: PostMessageInputSchema,
	messagesUpdate: MessagesUpdateInputSchema,
	reactionsAdd: ReactionsAddInputSchema,
	reactionsGet: ReactionsGetInputSchema,
	reactionsRemove: ReactionsRemoveInputSchema,
	starsAdd: StarsAddInputSchema,
	starsRemove: StarsRemoveInputSchema,
	starsList: StarsListInputSchema,
} as const;

export type SlackEndpointInputs = {
	[K in keyof typeof SlackEndpointInputSchemas]: z.infer<
		(typeof SlackEndpointInputSchemas)[K]
	>;
};

const ResponseMetadataSchema = z
	.object({
		next_cursor: z.string().optional(),
		messages: z.array(z.string()).optional(),
	})
	.passthrough();

const SlackResponseSchema = z
	.object({
		ok: z.boolean(),
		error: z.string().optional(),
		needed: z.string().optional(),
		provided: z.string().optional(),
		response_metadata: ResponseMetadataSchema.optional(),
	})
	.passthrough();

const ChannelTopicSchema = z
	.object({
		value: z.string(),
		creator: z.string(),
		last_set: z.number(),
	})
	.passthrough();

const ChannelSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		is_channel: z.boolean().optional(),
		is_group: z.boolean().optional(),
		is_im: z.boolean().optional(),
		is_mpim: z.boolean().optional(),
		is_private: z.boolean().optional(),
		created: z.number().optional(),
		is_archived: z.boolean().optional(),
		is_general: z.boolean().optional(),
		unlinked: z.number().optional(),
		name_normalized: z.string().optional(),
		is_shared: z.boolean().optional(),
		is_org_shared: z.boolean().optional(),
		is_pending_ext_shared: z.boolean().optional(),
		pending_shared: z.array(z.string()).optional(),
		context_team_id: z.string().optional(),
		updated: z.number().optional(),
		creator: z.string().optional(),
		is_member: z.boolean().optional(),
		num_members: z.number().optional(),
		topic: ChannelTopicSchema.optional(),
		purpose: ChannelTopicSchema.optional(),
	})
	.passthrough();

const UserProfileSchema = z
	.object({
		avatar_hash: z.string().optional(),
		status_text: z.string().optional(),
		status_emoji: z.string().optional(),
		status_expiration: z.number().optional(),
		real_name: z.string().optional(),
		display_name: z.string().optional(),
		real_name_normalized: z.string().optional(),
		display_name_normalized: z.string().optional(),
		email: z.string().optional(),
		image_24: z.string().optional(),
		image_32: z.string().optional(),
		image_48: z.string().optional(),
		image_72: z.string().optional(),
		image_192: z.string().optional(),
		image_512: z.string().optional(),
		team: z.string().optional(),
		title: z.string().optional(),
		phone: z.string().optional(),
		skype: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
	})
	.passthrough();

const UserSchema = z
	.object({
		id: z.string(),
		team_id: z.string().optional(),
		name: z.string().optional(),
		deleted: z.boolean().optional(),
		color: z.string().optional(),
		real_name: z.string().optional(),
		tz: z.string().optional(),
		tz_label: z.string().optional(),
		tz_offset: z.number().optional(),
		profile: UserProfileSchema.optional(),
		is_admin: z.boolean().optional(),
		is_owner: z.boolean().optional(),
		is_primary_owner: z.boolean().optional(),
		is_restricted: z.boolean().optional(),
		is_ultra_restricted: z.boolean().optional(),
		is_bot: z.boolean().optional(),
		is_app_user: z.boolean().optional(),
		updated: z.number().optional(),
		is_email_confirmed: z.boolean().optional(),
		who_can_share_contact_card: z.string().optional(),
		locale: z.string().optional(),
	})
	.passthrough();

const UsergroupSchema = z
	.object({
		id: z.string(),
		team_id: z.string().optional(),
		is_usergroup: z.boolean().optional(),
		is_subteam: z.boolean().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		handle: z.string().optional(),
		is_external: z.boolean().optional(),
		date_create: z.number().optional(),
		date_update: z.number().optional(),
		date_delete: z.number().optional(),
		auto_type: z.string().nullable().optional(),
		auto_provision: z.boolean().optional(),
		enterprise_subteam_id: z.string().optional(),
		created_by: z.string().optional(),
		updated_by: z.string().optional(),
		deleted_by: z.string().nullable().optional(),
		prefs: z
			.object({
				channels: z.array(z.string()).optional(),
				groups: z.array(z.string()).optional(),
			})
			.optional(),
		users: z.array(z.string()).optional(),
		user_count: z.number().optional(),
		channel_count: z.number().optional(),
	})
	.passthrough();

const FileSchema = z
	.object({
		id: z.string(),
		created: z.number().optional(),
		timestamp: z.number().optional(),
		name: z.string().optional(),
		title: z.string().optional(),
		mimetype: z.string().optional(),
		filetype: z.string().optional(),
		pretty_type: z.string().optional(),
		user: z.string().optional(),
		user_team: z.string().optional(),
		editable: z.boolean().optional(),
		size: z.number().optional(),
		mode: z.string().optional(),
		is_external: z.boolean().optional(),
		external_type: z.string().optional(),
		is_public: z.boolean().optional(),
		public_url_shared: z.boolean().optional(),
		display_as_bot: z.boolean().optional(),
		username: z.string().optional(),
		url_private: z.string().optional(),
		url_private_download: z.string().optional(),
		permalink: z.string().optional(),
		permalink_public: z.string().optional(),
		channels: z.array(z.string()).optional(),
		groups: z.array(z.string()).optional(),
		ims: z.array(z.string()).optional(),
	})
	.passthrough();

const BlockSchema = z
	.object({
		type: z.string(),
	})
	.passthrough();

const AttachmentSchema = z.record(z.unknown());

const ReactionSchema = z
	.object({
		name: z.string(),
		count: z.number(),
		users: z.array(z.string()),
	})
	.passthrough();

const MessageSchema = z
	.object({
		type: z.string().optional(),
		subtype: z.string().optional(),
		text: z.string().optional(),
		ts: z.string().optional(),
		user: z.string().optional(),
		bot_id: z.string().optional(),
		app_id: z.string().optional(),
		team: z.string().optional(),
		username: z.string().optional(),
		icons: z
			.object({
				emoji: z.string().optional(),
				image_36: z.string().optional(),
				image_48: z.string().optional(),
				image_72: z.string().optional(),
			})
			.optional(),
		blocks: z.array(BlockSchema).optional(),
		attachments: z.array(AttachmentSchema).optional(),
		thread_ts: z.string().optional(),
		parent_user_id: z.string().optional(),
		reply_count: z.number().optional(),
		reply_users_count: z.number().optional(),
		latest_reply: z.string().optional(),
		reply_users: z.array(z.string()).optional(),
		is_locked: z.boolean().optional(),
		subscribed: z.boolean().optional(),
		reactions: z.array(ReactionSchema).optional(),
		edited: z
			.object({
				user: z.string(),
				ts: z.string(),
			})
			.optional(),
	})
	.passthrough();

const PagingSchema = z
	.object({
		count: z.number(),
		total: z.number(),
		page: z.number(),
		pages: z.number(),
	})
	.passthrough();

const PaginationSchema = z
	.object({
		total_count: z.number().optional(),
		page: z.number().optional(),
		per_page: z.number().optional(),
		page_count: z.number().optional(),
		first: z.number().optional(),
		last: z.number().optional(),
	})
	.passthrough();

const ChannelsRandomResponseSchema = z.object({
	done: z.boolean(),
});

const ConversationsArchiveResponseSchema = SlackResponseSchema;
const ConversationsCloseResponseSchema = SlackResponseSchema.extend({
	no_op: z.boolean().optional(),
	already_closed: z.boolean().optional(),
}).passthrough();
const ConversationsCreateResponseSchema = SlackResponseSchema.extend({
	channel: ChannelSchema.optional(),
}).passthrough();
const ConversationsInfoResponseSchema = SlackResponseSchema.extend({
	channel: ChannelSchema.optional(),
}).passthrough();
const ConversationsListResponseSchema = SlackResponseSchema.extend({
	channels: z.array(ChannelSchema).optional(),
}).passthrough();
const ConversationsHistoryResponseSchema = SlackResponseSchema.extend({
	messages: z.array(MessageSchema).optional(),
	has_more: z.boolean().optional(),
	pin_count: z.number().optional(),
	channel_actions_count: z.number().optional(),
	channel_actions_ts: z.number().nullable().optional(),
}).passthrough();
const ConversationsInviteResponseSchema = SlackResponseSchema.extend({
	channel: ChannelSchema.optional(),
}).passthrough();
const ConversationsJoinResponseSchema = SlackResponseSchema.extend({
	channel: ChannelSchema.optional(),
	warning: z.string().optional(),
}).passthrough();
const ConversationsKickResponseSchema = SlackResponseSchema;
const ConversationsLeaveResponseSchema = SlackResponseSchema.extend({
	not_in_channel: z.boolean().optional(),
}).passthrough();
const ConversationsMembersResponseSchema = SlackResponseSchema.extend({
	members: z.array(z.string()).optional(),
}).passthrough();
const ConversationsOpenResponseSchema = SlackResponseSchema.extend({
	channel: ChannelSchema.optional(),
	no_op: z.boolean().optional(),
	already_open: z.boolean().optional(),
}).passthrough();
const ConversationsRenameResponseSchema = SlackResponseSchema.extend({
	channel: ChannelSchema.optional(),
}).passthrough();
const ConversationsRepliesResponseSchema = SlackResponseSchema.extend({
	messages: z.array(MessageSchema).optional(),
	has_more: z.boolean().optional(),
}).passthrough();
const ConversationsSetPurposeResponseSchema = SlackResponseSchema.extend({
	channel: ChannelSchema.optional(),
	purpose: z.string().optional(),
}).passthrough();
const ConversationsSetTopicResponseSchema = SlackResponseSchema.extend({
	channel: ChannelSchema.optional(),
	topic: z.string().optional(),
}).passthrough();
const ConversationsUnarchiveResponseSchema = SlackResponseSchema;

const UsersInfoResponseSchema = SlackResponseSchema.extend({
	user: UserSchema.optional(),
}).passthrough();
const UsersListResponseSchema = SlackResponseSchema.extend({
	members: z.array(UserSchema).optional(),
	cache_ts: z.number().optional(),
}).passthrough();
const UsersProfileGetResponseSchema = SlackResponseSchema.extend({
	profile: UserProfileSchema.optional(),
}).passthrough();
const UsersGetPresenceResponseSchema = SlackResponseSchema.extend({
	presence: z.string().optional(),
	online: z.boolean().optional(),
	auto_away: z.boolean().optional(),
	manual_away: z.boolean().optional(),
	connection_count: z.number().optional(),
	last_activity: z.number().optional(),
}).passthrough();
const UsersProfileSetResponseSchema = SlackResponseSchema.extend({
	profile: UserProfileSchema.optional(),
}).passthrough();

const UsergroupsCreateResponseSchema = SlackResponseSchema.extend({
	usergroup: UsergroupSchema.optional(),
}).passthrough();
const UsergroupsDisableResponseSchema = SlackResponseSchema.extend({
	usergroup: UsergroupSchema.optional(),
}).passthrough();
const UsergroupsEnableResponseSchema = SlackResponseSchema.extend({
	usergroup: UsergroupSchema.optional(),
}).passthrough();
const UsergroupsListResponseSchema = SlackResponseSchema.extend({
	userGroups: z.array(UsergroupSchema).optional(),
}).passthrough();
const UsergroupsUpdateResponseSchema = SlackResponseSchema.extend({
	usergroup: UsergroupSchema.optional(),
}).passthrough();

const FilesInfoResponseSchema = SlackResponseSchema.extend({
	file: FileSchema.optional(),
	comments: z
		.array(
			z.object({
				id: z.string(),
				timestamp: z.number(),
				user: z.string(),
				comment: z.string(),
			}),
		)
		.optional(),
	paging: PagingSchema.optional(),
}).passthrough();
const FilesListResponseSchema = SlackResponseSchema.extend({
	files: z.array(FileSchema).optional(),
	paging: PagingSchema.optional(),
}).passthrough();
const FilesUploadResponseSchema = SlackResponseSchema.extend({
	file: FileSchema.optional(),
}).passthrough();

const ChatDeleteResponseSchema = SlackResponseSchema.extend({
	channel: z.string().optional(),
	ts: z.string().optional(),
}).passthrough();
const ChatGetPermalinkResponseSchema = SlackResponseSchema.extend({
	channel: z.string().optional(),
	permalink: z.string().optional(),
}).passthrough();
const SearchMessagesResponseSchema = SlackResponseSchema.extend({
	query: z.string().optional(),
	messages: z
		.object({
			total: z.number().optional(),
			pagination: PaginationSchema.optional(),
			paging: PagingSchema.optional(),
			matches: z
				.array(
					MessageSchema.extend({
						channel: z
							.object({
								id: z.string(),
								name: z.string().optional(),
							})
							.optional(),
						permalink: z.string().optional(),
					}),
				)
				.optional(),
		})
		.optional(),
}).passthrough();
const ChatPostMessageResponseSchema = SlackResponseSchema.extend({
	channel: z.string().optional(),
	ts: z.string().optional(),
	message: MessageSchema.optional(),
}).passthrough();
const ChatUpdateResponseSchema = SlackResponseSchema.extend({
	channel: z.string().optional(),
	ts: z.string().optional(),
	text: z.string().optional(),
	message: MessageSchema.optional(),
}).passthrough();

const ReactionsAddResponseSchema = SlackResponseSchema;
const ReactionsGetResponseSchema = SlackResponseSchema.extend({
	type: z.string().optional(),
	channel: z.string().optional(),
	message: MessageSchema.optional(),
	file: FileSchema.optional(),
	comment: z
		.object({
			id: z.string(),
			comment: z.string(),
			reactions: z.array(ReactionSchema).optional(),
		})
		.optional(),
}).passthrough();
const ReactionsRemoveResponseSchema = SlackResponseSchema;

const StarsAddResponseSchema = SlackResponseSchema;
const StarsRemoveResponseSchema = SlackResponseSchema;
const StarsListResponseSchema = SlackResponseSchema.extend({
	items: z
		.array(
			z.object({
				type: z.string(),
				channel: z.string().optional(),
				message: MessageSchema.optional(),
				file: FileSchema.optional(),
				comment: z
					.object({
						id: z.string(),
						comment: z.string(),
					})
					.optional(),
				date_create: z.number().optional(),
			}),
		)
		.optional(),
	paging: PagingSchema.optional(),
}).passthrough();

export const SlackEndpointOutputSchemas = {
	channelsRandom: ChannelsRandomResponseSchema,
	channelsArchive: ConversationsArchiveResponseSchema,
	channelsClose: ConversationsCloseResponseSchema,
	channelsCreate: ConversationsCreateResponseSchema,
	channelsGet: ConversationsInfoResponseSchema,
	channelsList: ConversationsListResponseSchema,
	channelsGetHistory: ConversationsHistoryResponseSchema,
	channelsInvite: ConversationsInviteResponseSchema,
	channelsJoin: ConversationsJoinResponseSchema,
	channelsKick: ConversationsKickResponseSchema,
	channelsLeave: ConversationsLeaveResponseSchema,
	channelsGetMembers: ConversationsMembersResponseSchema,
	channelsOpen: ConversationsOpenResponseSchema,
	channelsRename: ConversationsRenameResponseSchema,
	channelsGetReplies: ConversationsRepliesResponseSchema,
	channelsSetPurpose: ConversationsSetPurposeResponseSchema,
	channelsSetTopic: ConversationsSetTopicResponseSchema,
	channelsUnarchive: ConversationsUnarchiveResponseSchema,
	usersGet: UsersInfoResponseSchema,
	usersList: UsersListResponseSchema,
	usersGetProfile: UsersProfileGetResponseSchema,
	usersGetPresence: UsersGetPresenceResponseSchema,
	usersUpdateProfile: UsersProfileSetResponseSchema,
	userGroupsCreate: UsergroupsCreateResponseSchema,
	userGroupsDisable: UsergroupsDisableResponseSchema,
	userGroupsEnable: UsergroupsEnableResponseSchema,
	userGroupsList: UsergroupsListResponseSchema,
	userGroupsUpdate: UsergroupsUpdateResponseSchema,
	filesGet: FilesInfoResponseSchema,
	filesList: FilesListResponseSchema,
	filesUpload: FilesUploadResponseSchema,
	messagesDelete: ChatDeleteResponseSchema,
	messagesGetPermalink: ChatGetPermalinkResponseSchema,
	messagesSearch: SearchMessagesResponseSchema,
	postMessage: ChatPostMessageResponseSchema,
	messagesUpdate: ChatUpdateResponseSchema,
	reactionsAdd: ReactionsAddResponseSchema,
	reactionsGet: ReactionsGetResponseSchema,
	reactionsRemove: ReactionsRemoveResponseSchema,
	starsAdd: StarsAddResponseSchema,
	starsRemove: StarsRemoveResponseSchema,
	starsList: StarsListResponseSchema,
} as const;

export type SlackEndpointOutputs = {
	[K in keyof typeof SlackEndpointOutputSchemas]: z.infer<
		(typeof SlackEndpointOutputSchemas)[K]
	>;
};

export type ChannelsRandomResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsRandom
>;
export type ConversationsArchiveResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsArchive
>;
export type ConversationsCloseResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsClose
>;
export type ConversationsCreateResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsCreate
>;
export type ConversationsInfoResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsGet
>;
export type ConversationsListResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsList
>;
export type ConversationsHistoryResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsGetHistory
>;
export type ConversationsInviteResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsInvite
>;
export type ConversationsJoinResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsJoin
>;
export type ConversationsKickResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsKick
>;
export type ConversationsLeaveResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsLeave
>;
export type ConversationsMembersResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsGetMembers
>;
export type ConversationsOpenResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsOpen
>;
export type ConversationsRenameResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsRename
>;
export type ConversationsRepliesResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsGetReplies
>;
export type ConversationsSetPurposeResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsSetPurpose
>;
export type ConversationsSetTopicResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsSetTopic
>;
export type ConversationsUnarchiveResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsUnarchive
>;
export type UsersInfoResponse = z.infer<
	typeof SlackEndpointOutputSchemas.usersGet
>;
export type UsersListResponse = z.infer<
	typeof SlackEndpointOutputSchemas.usersList
>;
export type UsersProfileGetResponse = z.infer<
	typeof SlackEndpointOutputSchemas.usersGetProfile
>;
export type UsersGetPresenceResponse = z.infer<
	typeof SlackEndpointOutputSchemas.usersGetPresence
>;
export type UsersProfileSetResponse = z.infer<
	typeof SlackEndpointOutputSchemas.usersUpdateProfile
>;
export type UsergroupsCreateResponse = z.infer<
	typeof SlackEndpointOutputSchemas.userGroupsCreate
>;
export type UsergroupsDisableResponse = z.infer<
	typeof SlackEndpointOutputSchemas.userGroupsDisable
>;
export type UsergroupsEnableResponse = z.infer<
	typeof SlackEndpointOutputSchemas.userGroupsEnable
>;
export type UsergroupsListResponse = z.infer<
	typeof SlackEndpointOutputSchemas.userGroupsList
>;
export type UsergroupsUpdateResponse = z.infer<
	typeof SlackEndpointOutputSchemas.userGroupsUpdate
>;
export type FilesInfoResponse = z.infer<
	typeof SlackEndpointOutputSchemas.filesGet
>;
export type FilesListResponse = z.infer<
	typeof SlackEndpointOutputSchemas.filesList
>;
export type FilesUploadResponse = z.infer<
	typeof SlackEndpointOutputSchemas.filesUpload
>;
export type ChatDeleteResponse = z.infer<
	typeof SlackEndpointOutputSchemas.messagesDelete
>;
export type ChatGetPermalinkResponse = z.infer<
	typeof SlackEndpointOutputSchemas.messagesGetPermalink
>;
export type SearchMessagesResponse = z.infer<
	typeof SlackEndpointOutputSchemas.messagesSearch
>;
export type ChatPostMessageResponse = z.infer<
	typeof SlackEndpointOutputSchemas.postMessage
>;
export type ChatUpdateResponse = z.infer<
	typeof SlackEndpointOutputSchemas.messagesUpdate
>;
export type ReactionsAddResponse = z.infer<
	typeof SlackEndpointOutputSchemas.reactionsAdd
>;
export type ReactionsGetResponse = z.infer<
	typeof SlackEndpointOutputSchemas.reactionsGet
>;
export type ReactionsRemoveResponse = z.infer<
	typeof SlackEndpointOutputSchemas.reactionsRemove
>;
export type StarsAddResponse = z.infer<
	typeof SlackEndpointOutputSchemas.starsAdd
>;
export type StarsRemoveResponse = z.infer<
	typeof SlackEndpointOutputSchemas.starsRemove
>;
export type StarsListResponse = z.infer<
	typeof SlackEndpointOutputSchemas.starsList
>;
