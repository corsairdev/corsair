// Generated from X's OpenAPI spec (https://api.x.com/2/openapi.json,
// fetched 2026-11-25); twitter-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

import type { FileInput, FileOutput } from 'corsair/http';

export type TwitterJsonValue =
	| null
	| boolean
	| number
	| string
	| TwitterJsonValue[]
	| { [key: string]: TwitterJsonValue | undefined };

export const TWITTER_OPERATION_IDS = [
	'account.ensure',
	'account.get',
	'accountActivity.subscriptions.count',
	'accountActivity.subscriptions.create',
	'accountActivity.subscriptions.delete',
	'accountActivity.subscriptions.list',
	'accountActivity.subscriptions.validate',
	'activity.subscriptions.create',
	'activity.subscriptions.delete',
	'activity.subscriptions.deleteMany',
	'activity.subscriptions.list',
	'activity.subscriptions.update',
	'articles.createDraft',
	'articles.publish',
	'bots.create',
	'bots.delete',
	'bots.list',
	'bots.token.revoke',
	'bots.token.rotate',
	'bots.update',
	'broadcasts.chat.deleteMessage',
	'broadcasts.chat.list',
	'broadcasts.chat.muteUser',
	'broadcasts.chat.send',
	'broadcasts.chat.unmuteUser',
	'broadcasts.chatModerators.add',
	'broadcasts.chatModerators.list',
	'broadcasts.chatModerators.remove',
	'broadcasts.chatMutes.create',
	'broadcasts.chatMutes.delete',
	'broadcasts.chatMutes.list',
	'broadcasts.create',
	'broadcasts.delete',
	'broadcasts.end',
	'broadcasts.get',
	'broadcasts.list',
	'broadcasts.listCategories',
	'broadcasts.scheduled.create',
	'broadcasts.scheduled.delete',
	'broadcasts.scheduled.get',
	'broadcasts.scheduled.goLive',
	'broadcasts.scheduled.list',
	'broadcasts.scheduled.update',
	'broadcasts.update',
	'calls.create',
	'calls.get',
	'calls.join',
	'calls.leave',
	'calls.scheduled.cancel',
	'calls.scheduled.create',
	'calls.scheduled.get',
	'calls.scheduled.list',
	'calls.scheduled.respond',
	'calls.scheduled.update',
	'chat.conversations.addKeys',
	'chat.conversations.archive',
	'chat.conversations.delete',
	'chat.conversations.disableMessageTtl',
	'chat.conversations.enableMessageTtl',
	'chat.conversations.get',
	'chat.conversations.list',
	'chat.conversations.listEvents',
	'chat.conversations.listPinnedMessages',
	'chat.conversations.markRead',
	'chat.conversations.markUnread',
	'chat.conversations.mute',
	'chat.conversations.sendTyping',
	'chat.conversations.unarchive',
	'chat.conversations.unmute',
	'chat.conversations.updateScreenCapture',
	'chat.groups.adminRequests.approve',
	'chat.groups.adminRequests.create',
	'chat.groups.adminRequests.list',
	'chat.groups.adminRequests.reject',
	'chat.groups.admins.add',
	'chat.groups.admins.remove',
	'chat.groups.create',
	'chat.groups.initialize',
	'chat.groups.inviteLink.disable',
	'chat.groups.inviteLink.enable',
	'chat.groups.inviteLink.get',
	'chat.groups.joinRequests.create',
	'chat.groups.joinRequests.reject',
	'chat.groups.members.add',
	'chat.groups.members.remove',
	'chat.groups.update',
	'chat.groups.updateAdminSettings',
	'chat.media.appendUpload',
	'chat.media.download',
	'chat.media.finalizeUpload',
	'chat.media.initializeUpload',
	'chat.messageRequests.accept',
	'chat.messageRequests.get',
	'chat.messageRequests.list',
	'chat.messages.delete',
	'chat.messages.send',
	'chat.settings.get',
	'chat.settings.update',
	'communities.get',
	'communities.search',
	'communityNotes.create',
	'communityNotes.delete',
	'communityNotes.evaluate',
	'communityNotes.searchEligiblePosts',
	'communityNotes.searchWritten',
	'compliance.jobs.cancel',
	'compliance.jobs.create',
	'compliance.jobs.downloadResults',
	'compliance.jobs.get',
	'compliance.jobs.list',
	'compliance.jobs.upload',
	'connections.history',
	'connections.terminateAll',
	'connections.terminateByEndpoint',
	'connections.terminateMany',
	'directMessages.conversations.create',
	'directMessages.events.delete',
	'directMessages.events.get',
	'directMessages.events.list',
	'directMessages.events.listByConversation',
	'directMessages.events.listWithParticipant',
	'directMessages.media.download',
	'directMessages.sendToConversation',
	'directMessages.sendToParticipant',
	'lists.create',
	'lists.delete',
	'lists.followers.list',
	'lists.get',
	'lists.members.add',
	'lists.members.list',
	'lists.members.remove',
	'lists.posts.list',
	'lists.update',
	'media.amplify.addPost',
	'media.amplify.programs.get',
	'media.amplify.programs.list',
	'media.amplify.programs.listPosts',
	'media.analytics',
	'media.get',
	'media.getMany',
	'media.library.add',
	'media.library.listCategories',
	'media.library.remove',
	'media.library.update',
	'media.metadata.create',
	'media.subtitles.create',
	'media.subtitles.delete',
	'media.upload.append',
	'media.upload.finalize',
	'media.upload.getStatus',
	'media.upload.initialize',
	'media.upload.single',
	'news.get',
	'news.search',
	'posts.analytics',
	'posts.counts.all',
	'posts.counts.recent',
	'posts.create',
	'posts.delete',
	'posts.drafts.create',
	'posts.drafts.delete',
	'posts.drafts.list',
	'posts.get',
	'posts.getMany',
	'posts.hideReply',
	'posts.likingUsers',
	'posts.quotes',
	'posts.repostedBy',
	'posts.reposts',
	'posts.search.all',
	'posts.search.recent',
	'posts.streamLinks.create',
	'posts.streamLinks.delete',
	'posts.streamLinks.list',
	'posts.streamRules.counts',
	'posts.streamRules.list',
	'posts.streamRules.update',
	'sources.create',
	'sources.delete',
	'sources.get',
	'sources.getIngestRegion',
	'sources.getStreamKey',
	'sources.list',
	'sources.rename',
	'spaces.get',
	'spaces.getByCreators',
	'spaces.getMany',
	'spaces.listBuyers',
	'spaces.listPosts',
	'spaces.search',
	'trends.byWoeid',
	'trends.locations',
	'trends.personalized',
	'usage.credits',
	'usage.get',
	'users.affiliates',
	'users.blockDms',
	'users.blocking.block',
	'users.blocking.list',
	'users.blocking.unblock',
	'users.bookmarks.create',
	'users.bookmarks.delete',
	'users.bookmarks.folders.create',
	'users.bookmarks.folders.list',
	'users.bookmarks.folders.listPosts',
	'users.bookmarks.list',
	'users.broadcasts.create',
	'users.broadcasts.delete',
	'users.broadcasts.get',
	'users.broadcasts.list',
	'users.broadcasts.updateState',
	'users.followedLists.follow',
	'users.followedLists.list',
	'users.followedLists.unfollow',
	'users.followers',
	'users.following.follow',
	'users.following.list',
	'users.following.unfollow',
	'users.get',
	'users.getByUsername',
	'users.getMany',
	'users.getManyByUsernames',
	'users.likes.like',
	'users.likes.list',
	'users.likes.unlike',
	'users.listMemberships',
	'users.me',
	'users.mentions',
	'users.muting.list',
	'users.muting.mute',
	'users.muting.unmute',
	'users.myFollowers',
	'users.myFollowing',
	'users.ownedLists',
	'users.pinnedLists.list',
	'users.pinnedLists.pin',
	'users.pinnedLists.unpin',
	'users.posts',
	'users.publicKeys.add',
	'users.publicKeys.get',
	'users.publicKeys.getMany',
	'users.reposts.create',
	'users.reposts.delete',
	'users.repostsOfMe',
	'users.search',
	'users.sources.create',
	'users.sources.delete',
	'users.sources.get',
	'users.sources.list',
	'users.sources.rename',
	'users.timeline',
	'users.unblockDms',
	'webhooks.create',
	'webhooks.delete',
	'webhooks.list',
	'webhooks.replay',
	'webhooks.validate',
] as const;

export type TwitterOperationId = (typeof TWITTER_OPERATION_IDS)[number];

export type TwitterAddChatGroupAdminsActionSignaturesInput = {
	/** Base64-encoded Thrift MessageEventDetail for the signed action. */
	encoded_message_event_detail: string;
	/** Message event signature supplied with an action signature. */
	message_event_signature: TwitterAddChatGroupAdminsActionSignaturesMessageEventSignatureInput;
	/** Client-generated ID of the message being signed. */
	message_id: string;
	/** Payload string the client signed; used only in server-side failure logs. */
	signature_payload?: string;
};

export type TwitterAddChatGroupAdminsActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterAddChatGroupAdminsActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterAddChatGroupAdminsActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

export type TwitterAddChatGroupMembersActionSignaturesInput = {
	/** Base64-encoded Thrift MessageEventDetail for the signed action. */
	encoded_message_event_detail: string;
	/** Message event signature supplied with an action signature. */
	message_event_signature: TwitterAddChatGroupMembersActionSignaturesMessageEventSignatureInput;
	/** Client-generated ID of the message being signed. */
	message_id: string;
	/** Payload string the client signed; used only in server-side failure logs. */
	signature_payload?: string;
};

export type TwitterAddChatGroupMembersActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterAddChatGroupMembersActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterAddChatGroupMembersActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

export type TwitterAddChatGroupMembersConversationParticipantKeysInput = {
	/** Conversation key encrypted with this participant's public key. */
	encrypted_conversation_key: string;
	/** Version of the participant's public key used for encryption. */
	public_key_version: string;
	/** Participant user ID. */
	user_id: string;
};

export type TwitterAddConversationKeysActionSignaturesInput = {
	/** Base64-encoded Thrift MessageEventDetail for the signed action. */
	encoded_message_event_detail: string;
	/** Message event signature supplied with an action signature. */
	message_event_signature: TwitterAddConversationKeysActionSignaturesMessageEventSignatureInput;
	/** Client-generated ID of the message being signed. */
	message_id: string;
	/** Payload string the client signed; used only in server-side failure logs. */
	signature_payload?: string;
};

export type TwitterAddConversationKeysActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterAddConversationKeysActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterAddConversationKeysActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

export type TwitterAddConversationKeysConversationParticipantKeysInput = {
	/** Conversation key encrypted with this participant's public key. */
	encrypted_conversation_key: string;
	/** Version of the participant's public key used for encryption. */
	public_key_version: string;
	/** Participant user ID. */
	user_id: string;
};

export type TwitterAddMediaToLibraryMonetizationInput = {
	/** ISO 3166-1 alpha-2 codes of the only countries the video is monetized in. Omit to monetize everywhere. */
	allowed_countries?: Array<string>;
	/** Advertiser categories (from the categories endpoint) whose ads may not run against the video. */
	blocked_advertiser_category_ids?: Array<number>;
	/** Advertiser account ids whose ads may not run against the video. */
	blocked_advertiser_ids?: Array<string>;
	/** Whether ads may run against the video. Requires the account to be enrolled in video monetization. */
	enabled?: boolean;
	/** Amplify program to monetize the video through, instead of `video_category_ids`. */
	program_id?: string;
	/** Video category ids (from the categories endpoint) describing the content; at most one when creating. Required when enabled, unless `program_id` is set. */
	video_category_ids?: Array<number>;
};

export type TwitterAddUserPublicKeyPublicKeyInput = {
	/** Signature over the identity public key. */
	identity_public_key_signature?: string;
	/** Identity public key (base64 encoded). */
	public_key?: string;
	/** Fingerprint of the identity public key. */
	public_key_fingerprint?: string;
	/** Registration method for the public key. */
	registration_method?: string;
	/** Signing public key (base64 encoded). */
	signing_public_key?: string;
	/** Signature over the signing public key. */
	signing_public_key_signature?: string;
};

/** Unique identifier of a Analytics */
export type TwitterAnalyticsIdInput = string;

export type TwitterApproveChatGroupAdminRequestActionSignaturesInput = {
	/** Base64-encoded Thrift MessageEventDetail for the signed action. */
	encoded_message_event_detail: string;
	/** Message event signature supplied with an action signature. */
	message_event_signature: TwitterApproveChatGroupAdminRequestActionSignaturesMessageEventSignatureInput;
	/** Client-generated ID of the message being signed. */
	message_id: string;
	/** Payload string the client signed; used only in server-side failure logs. */
	signature_payload?: string;
};

export type TwitterApproveChatGroupAdminRequestActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterApproveChatGroupAdminRequestActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterApproveChatGroupAdminRequestActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

export type TwitterArchiveChatConversationActionSignaturesInput = {
	/** Base64-encoded Thrift MessageEventDetail for the signed action. */
	encoded_message_event_detail: string;
	/** Message event signature supplied with an action signature. */
	message_event_signature: TwitterArchiveChatConversationActionSignaturesMessageEventSignatureInput;
	/** Client-generated ID of the message being signed. */
	message_id: string;
	/** Payload string the client signed; used only in server-side failure logs. */
	signature_payload?: string;
};

export type TwitterArchiveChatConversationActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterArchiveChatConversationActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterArchiveChatConversationActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

export type TwitterArticleCreateDraftContentStateInput = {
	/** The text blocks that make up the article body. */
	blocks: Array<TwitterArticleCreateDraftContentStateBlocksInput>;
	/** Non-text entities referenced by blocks (links, embedded posts, images, emoji, markdown/code/tables, dividers, LaTeX). Full set matches article storage. */
	entities: Array<TwitterArticleCreateDraftContentStateEntitiesInput>;
};

export type TwitterArticleCreateDraftContentStateBlocksInput = {
	/** Block-level metadata for mentions, hashtags, cashtags, and URLs. */
	data?: TwitterArticleCreateDraftContentStateBlocksDataInput;
	/** Entity references. Each item has offset, length and key, the entity's key as an integer (0 for "0"). */
	entity_ranges?: Array<TwitterArticleCreateDraftContentStateBlocksEntityRangesInput>;
	/** Inline styles. Each item has offset, length and style: bold, italic or strikethrough, in lowercase. */
	inline_style_ranges?: Array<TwitterArticleCreateDraftContentStateBlocksInlineStyleRangesInput>;
	/** Optional block key. */
	key?: string;
	/** The text content of this block. For latex entities, this holds the LaTeX source; for divider/markdown/image/post atomic placeholders, typically a single space. */
	text: string;
	/** The block type. Articles have two heading levels, header-one and header-two. Use atomic for non-text embeds (image, post, markdown, divider, latex). */
	type:
		| 'unstyled'
		| 'header-one'
		| 'header-two'
		| 'unordered-list-item'
		| 'ordered-list-item'
		| 'blockquote'
		| 'atomic';
};

export type TwitterArticleCreateDraftContentStateBlocksDataInput = {
	/** Cashtag spans in this block. */
	cashtags?: Array<TwitterArticleCreateDraftContentStateBlocksDataCashtagsInput>;
	/** Hashtag spans in this block. */
	hashtags?: Array<TwitterArticleCreateDraftContentStateBlocksDataHashtagsInput>;
	/** Mention spans in this block. */
	mentions?: Array<TwitterArticleCreateDraftContentStateBlocksDataMentionsInput>;
	/** URL spans in this block. */
	urls?: Array<TwitterArticleCreateDraftContentStateBlocksDataUrlsInput>;
};

export type TwitterArticleCreateDraftContentStateBlocksDataCashtagsInput = {
	/** Start index of the tagged span. */
	from_index: number;
	/** The tagged text. */
	text: string;
	/** End index of the tagged span. */
	to_index: number;
};

export type TwitterArticleCreateDraftContentStateBlocksDataHashtagsInput = {
	/** Start index of the tagged span. */
	from_index: number;
	/** The tagged text. */
	text: string;
	/** End index of the tagged span. */
	to_index: number;
};

export type TwitterArticleCreateDraftContentStateBlocksDataMentionsInput = {
	/** Start index of the tagged span. */
	from_index: number;
	/** The tagged text. */
	text: string;
	/** End index of the tagged span. */
	to_index: number;
};

export type TwitterArticleCreateDraftContentStateBlocksDataUrlsInput = {
	/** Start index of the tagged span. */
	from_index: number;
	/** The tagged text. */
	text: string;
	/** End index of the tagged span. */
	to_index: number;
};

export type TwitterArticleCreateDraftContentStateBlocksEntityRangesInput = {
	/** The key of the referenced entity, as an integer. */
	key: number;
	/** Length of the entity range. */
	length: number;
	/** Start offset in the text. */
	offset: number;
};

export type TwitterArticleCreateDraftContentStateBlocksInlineStyleRangesInput =
	{
		/** Length of the styled range. */
		length: number;
		/** Start offset in the text. */
		offset: number;
		/** The inline style. */
		style: 'bold' | 'italic' | 'strikethrough';
	};

export type TwitterArticleCreateDraftContentStateEntitiesInput = {
	/** The entity's key, a string such as "0". entity_ranges refer to it as an integer. */
	key: string;
	value: TwitterArticleCreateDraftContentStateEntitiesValueInput;
};

export type TwitterArticleCreateDraftContentStateEntitiesValueInput = {
	/** Fields: post_id (post), url (link), media_items (image), markdown (markdown), entity_key (emoji). divider and latex use an empty data object; latex source is the block text, and emoji uses the block text for the character(s). Tables are markdown; article storage has no table entity type. */
	data: TwitterArticleCreateDraftContentStateEntitiesValueDataInput;
	/** Whether the entity can be edited. Recommended: immutable for post, image, divider, latex; mutable for link and markdown (matches the in-app Articles composer). */
	mutability: 'immutable' | 'mutable' | 'segmented';
	/** The entity type. markdown carries code blocks, GFM tables, and other Markdown; emoji maps to backend TWEMOJI (Twemoji is internal); divider is a horizontal rule; latex renders TeX from the block text. Tables are not a separate enum value — use type markdown with a pipe table in data.markdown. */
	type: 'post' | 'link' | 'image' | 'emoji' | 'markdown' | 'divider' | 'latex';
};

export type TwitterArticleCreateDraftContentStateEntitiesValueDataInput = {
	/** Caption text. */
	caption?: string;
	/** Opaque entity key. Used with type emoji (and reserved for other keyed embeds) to match in-app Articles composer payloads. */
	entity_key?: string;
	/** Markdown body for type markdown. Use fenced code blocks (```lang ... ```) for code. Max weighted length is enforced by the Articles backend (10,000 per article). */
	markdown?: string;
	/** Media keys. Used with type image. */
	media_items?: Array<TwitterArticleCreateDraftContentStateEntitiesValueDataMediaItemsInput>;
	/** The ID of the post to embed. Used with type post. */
	post_id?: string;
	/** The URL. Used with type link. */
	url?: string;
};

export type TwitterArticleCreateDraftContentStateEntitiesValueDataMediaItemsInput =
	{
		media_category: string;
		media_id: string;
	};

export type TwitterArticleCreateDraftCoverMediaInput = {
	/** The media category (e.g. tweet_image). */
	media_category: string;
	/** The media ID from the media upload endpoint. */
	media_id: string;
};

/** Unique identifier of a Community */
export type TwitterCommunityIdInput = string;

export type TwitterCreateActivitySubscriptionFilterInput = {
	/** Optional direction filter for directional events. Not supported for mute.* or block.* events. */
	direction?: 'inbound' | 'outbound';
	/** Optional keyword filter. */
	keyword?: string;
	/** Optional event-specific string predicates. */
	qualifiers?: Record<string, TwitterJsonValue>;
	/** User the subscription is scoped to. For mute.* and block.* events, this must be the authenticated source user. */
	user_id?: string;
};

export type TwitterCreateChatConversationActionSignaturesInput = {
	/** Base64-encoded Thrift MessageEventDetail for the signed action. */
	encoded_message_event_detail: string;
	/** Message event signature supplied with an action signature. */
	message_event_signature: TwitterCreateChatConversationActionSignaturesMessageEventSignatureInput;
	/** Client-generated ID of the message being signed. */
	message_id: string;
	/** Payload string the client signed; used only in server-side failure logs. */
	signature_payload?: string;
};

export type TwitterCreateChatConversationActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterCreateChatConversationActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterCreateChatConversationActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

export type TwitterCreateChatConversationConversationParticipantKeysInput = {
	/** Conversation key encrypted with this participant's public key. */
	encrypted_conversation_key: string;
	/** Version of the participant's public key used for encryption. */
	public_key_version: string;
	/** Participant user ID. */
	user_id: string;
};

export type TwitterCreateChatGroupAdminRequestActionSignaturesInput = {
	/** Base64-encoded Thrift MessageEventDetail for the signed action. */
	encoded_message_event_detail: string;
	/** Message event signature supplied with an action signature. */
	message_event_signature: TwitterCreateChatGroupAdminRequestActionSignaturesMessageEventSignatureInput;
	/** Client-generated ID of the message being signed. */
	message_id: string;
	/** Payload string the client signed; used only in server-side failure logs. */
	signature_payload?: string;
};

export type TwitterCreateChatGroupAdminRequestActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterCreateChatGroupAdminRequestActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterCreateChatGroupAdminRequestActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

export type TwitterCreateChatGroupJoinRequestActionSignaturesInput = {
	/** Base64-encoded Thrift MessageEventDetail for the signed action. */
	encoded_message_event_detail: string;
	/** Message event signature supplied with an action signature. */
	message_event_signature: TwitterCreateChatGroupJoinRequestActionSignaturesMessageEventSignatureInput;
	/** Client-generated ID of the message being signed. */
	message_id: string;
	/** Payload string the client signed; used only in server-side failure logs. */
	signature_payload?: string;
};

export type TwitterCreateChatGroupJoinRequestActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterCreateChatGroupJoinRequestActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterCreateChatGroupJoinRequestActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

export type TwitterCreateCommunityNotesInfoInput = {
	/** Community Note classification. */
	classification: 'misinformed_or_potentially_misleading' | 'not_misleading';
	/** Whether the note is a media note. */
	is_media_note?: boolean;
	/** Tags describing why the Post is misleading. */
	misleading_tags: Array<
		| 'disputed_claim_as_fact'
		| 'factual_error'
		| 'manipulated_media'
		| 'misinterpreted_satire'
		| 'missing_important_context'
		| 'other'
		| 'outdated_information'
	>;
	/** The text summary of the Community Note (must contain a URL). */
	text: string;
	/** Whether the note cites trustworthy sources. */
	trustworthy_sources: boolean;
};

export type TwitterCreateDirectMessagesByConversationIdAttachmentsInput = {
	/** A media id to attach to the message. */
	media_id: string;
};

export type TwitterCreateDirectMessagesByParticipantIdAttachmentsInput = {
	/** A media id to attach to the message. */
	media_id: string;
};

export type TwitterCreateDirectMessagesConversationMessageInput = {
	/** Attachments to include with the message. */
	attachments?: Array<TwitterCreateDirectMessagesConversationMessageAttachmentsInput>;
	/** Text of the Direct Message. */
	text?: string;
};

export type TwitterCreateDirectMessagesConversationMessageAttachmentsInput = {
	/** A media id to attach to the message. */
	media_id: string;
};

export type TwitterCreateMediaMetadataMetadataInput = {
	allow_download_status?: TwitterCreateMediaMetadataMetadataAllowDownloadStatusInput;
	alt_text?: TwitterCreateMediaMetadataMetadataAltTextInput;
	audience_policy?: Record<string, TwitterJsonValue>;
	content_expiration?: TwitterCreateMediaMetadataMetadataContentExpirationInput;
	domain_restrictions?: TwitterCreateMediaMetadataMetadataDomainRestrictionsInput;
	found_media_origin?: TwitterCreateMediaMetadataMetadataFoundMediaOriginInput;
	geo_restrictions?: Record<string, TwitterJsonValue>;
	management_info?: TwitterCreateMediaMetadataMetadataManagementInfoInput;
	preview_image?: TwitterCreateMediaMetadataMetadataPreviewImageInput;
	sensitive_media_warning?: Record<string, TwitterJsonValue>;
	shared_info?: TwitterCreateMediaMetadataMetadataSharedInfoInput;
	sticker_info?: TwitterCreateMediaMetadataMetadataStickerInfoInput;
	upload_source?: TwitterCreateMediaMetadataMetadataUploadSourceInput;
};

export type TwitterCreateMediaMetadataMetadataAllowDownloadStatusInput = {
	allow_download?: boolean;
};

export type TwitterCreateMediaMetadataMetadataAltTextInput = {
	text: string;
};

export type TwitterCreateMediaMetadataMetadataContentExpirationInput = {
	timestamp_sec: number;
};

export type TwitterCreateMediaMetadataMetadataDomainRestrictionsInput = {
	whitelist: Array<string>;
};

export type TwitterCreateMediaMetadataMetadataFoundMediaOriginInput = {
	id: string;
	provider: string;
};

export type TwitterCreateMediaMetadataMetadataManagementInfoInput = {
	managed: boolean;
};

export type TwitterCreateMediaMetadataMetadataPreviewImageInput = {
	media_key: Record<string, TwitterJsonValue>;
};

export type TwitterCreateMediaMetadataMetadataSharedInfoInput = {
	shared: boolean;
};

export type TwitterCreateMediaMetadataMetadataStickerInfoInput = {
	stickers: Array<TwitterCreateMediaMetadataMetadataStickerInfoStickersInput>;
};

export type TwitterCreateMediaMetadataMetadataStickerInfoStickersInput = Record<
	string,
	TwitterJsonValue
>;

export type TwitterCreateMediaMetadataMetadataUploadSourceInput = {
	upload_source: string;
};

export type TwitterCreateMediaSubtitlesSubtitlesInput = {
	/** Language name in a human readable form. */
	display_name?: string;
	/** The media id of the subtitle track. */
	id?: string;
	/** BCP47 language code of the subtitle track. */
	language_code?: string;
};

export type TwitterCreatePostDraftClipInput = {
	/** Second of the video at which the clip ends. A clip is 5 to 60 seconds long and at most 30% of the video. */
	end_seconds: number;
	/** The ID of the Post whose video is clipped. The Post must have exactly one video, longer than 2 minutes. */
	post_id: string;
	/** Second of the video at which the clip starts. */
	start_seconds: number;
};

export type TwitterCreatePostDraftEditOptionsInput = {
	/** The ID of the Post being edited. */
	previous_post_id: string;
};

export type TwitterCreatePostDraftGeoInput = {
	/** Place ID for geo tagging. */
	place_id: string;
};

export type TwitterCreatePostDraftMediaInput = {
	/** Call-to-action button rendered on the media entity. */
	call_to_actions?: TwitterCreatePostDraftMediaCallToActionsInput;
	/** Description for the media, rendered on the Post card for video and Amplify content. */
	description?: string;
	/** When true, the media's asset URLs do not expire and external syndicated playback is allowed. */
	embeddable?: boolean;
	/** Media IDs to attach to the Post, in the order given. */
	media_ids: Array<string>;
	/** Media id whose asset is used as the preview image. */
	preview_media_id?: string;
	/** User IDs tagged in the media. */
	tagged_user_ids?: Array<string>;
	/** Title for the media, rendered on the Post card for video and Amplify content. */
	title?: string;
};

export type TwitterCreatePostDraftMediaCallToActionsInput = {
	/** App Install CTA. At least one store id should be provided. */
	app_install?: TwitterCreatePostDraftMediaCallToActionsAppInstallInput;
	/** Visit Site CTA. */
	visit_site?: TwitterCreatePostDraftMediaCallToActionsVisitSiteInput;
	/** Watch Now CTA. */
	watch_now?: TwitterCreatePostDraftMediaCallToActionsWatchNowInput;
};

export type TwitterCreatePostDraftMediaCallToActionsAppInstallInput = {
	/** Apple App Store iPhone app id. */
	app_store_id?: string;
	/** Apple App Store iPad app id. */
	ipad_app_store_id?: string;
	/** Google Play Store app id. */
	play_store_id?: string;
};

export type TwitterCreatePostDraftMediaCallToActionsVisitSiteInput = {
	/** HTTPS URL the CTA links to. */
	url: string;
};

export type TwitterCreatePostDraftMediaCallToActionsWatchNowInput = {
	/** HTTPS URL the CTA links to. */
	url: string;
};

export type TwitterCreatePostDraftPollInput = {
	/** Duration of the poll in minutes. */
	duration_minutes: number;
	/** Poll options (2-4 choices, 1-25 characters each). */
	options: Array<string>;
	/** Who can reply to the poll Tweet. Accepted for compatibility; it carries no backend argument and is dropped before the mutation is issued (see `translate_body`). */
	reply_settings?: 'following' | 'mentionedUsers' | 'subscribers' | 'verified';
};

export type TwitterCreatePostDraftReplyInput = {
	/** If true, reply metadata is automatically populated. Accepted for compatibility; it carries no backend argument and is dropped before the mutation is issued (see `translate_body`). */
	auto_populate_reply_metadata?: boolean;
	/** User IDs to exclude from the reply thread. */
	exclude_reply_user_ids?: Array<string>;
	/** The ID of the tweet being replied to. */
	in_reply_to_tweet_id: string;
};

export type TwitterCreatePostsClipInput = {
	/** Second of the video at which the clip ends. A clip is 5 to 60 seconds long and at most 30% of the video. */
	end_seconds: number;
	/** The ID of the Post whose video is clipped. The Post must have exactly one video, longer than 2 minutes. */
	post_id: string;
	/** Second of the video at which the clip starts. */
	start_seconds: number;
};

export type TwitterCreatePostsEditOptionsInput = {
	/** The ID of the Post being edited. */
	previous_post_id: string;
};

export type TwitterCreatePostsGeoInput = {
	/** Place ID for geo tagging. */
	place_id: string;
};

export type TwitterCreatePostsMediaInput = {
	/** Call-to-action button rendered on the media entity. */
	call_to_actions?: TwitterCreatePostsMediaCallToActionsInput;
	/** Description for the media, rendered on the Post card for video and Amplify content. */
	description?: string;
	/** When true, the media's asset URLs do not expire and external syndicated playback is allowed. */
	embeddable?: boolean;
	/** Media IDs to attach to the Post, in the order given. */
	media_ids: Array<string>;
	/** Media id whose asset is used as the preview image. */
	preview_media_id?: string;
	/** User IDs tagged in the media. */
	tagged_user_ids?: Array<string>;
	/** Title for the media, rendered on the Post card for video and Amplify content. */
	title?: string;
};

export type TwitterCreatePostsMediaCallToActionsInput = {
	/** App Install CTA. At least one store id should be provided. */
	app_install?: TwitterCreatePostsMediaCallToActionsAppInstallInput;
	/** Visit Site CTA. */
	visit_site?: TwitterCreatePostsMediaCallToActionsVisitSiteInput;
	/** Watch Now CTA. */
	watch_now?: TwitterCreatePostsMediaCallToActionsWatchNowInput;
};

export type TwitterCreatePostsMediaCallToActionsAppInstallInput = {
	/** Apple App Store iPhone app id. */
	app_store_id?: string;
	/** Apple App Store iPad app id. */
	ipad_app_store_id?: string;
	/** Google Play Store app id. */
	play_store_id?: string;
};

export type TwitterCreatePostsMediaCallToActionsVisitSiteInput = {
	/** HTTPS URL the CTA links to. */
	url: string;
};

export type TwitterCreatePostsMediaCallToActionsWatchNowInput = {
	/** HTTPS URL the CTA links to. */
	url: string;
};

export type TwitterCreatePostsPollInput = {
	/** Duration of the poll in minutes. */
	duration_minutes: number;
	/** Poll options (2-4 choices, 1-25 characters each). */
	options: Array<string>;
	/** Who can reply to the poll Tweet. Accepted for compatibility; it carries no backend argument and is dropped before the mutation is issued (see `translate_body`). */
	reply_settings?: 'following' | 'mentionedUsers' | 'subscribers' | 'verified';
};

export type TwitterCreatePostsReplyInput = {
	/** If true, reply metadata is automatically populated. Accepted for compatibility; it carries no backend argument and is dropped before the mutation is issued (see `translate_body`). */
	auto_populate_reply_metadata?: boolean;
	/** User IDs to exclude from the reply thread. */
	exclude_reply_user_ids?: Array<string>;
	/** The ID of the tweet being replied to. */
	in_reply_to_tweet_id: string;
};

export type TwitterCreateScheduledBroadcastRecurrenceInput = {
	/** Recurrence frequency. */
	frequency: 'Daily' | 'Weekly';
	/** Number of repeats (numeric string). */
	repeats: string;
};

export type TwitterDeleteChatConversationActionSignaturesInput = {
	/** Base64-encoded Thrift MessageEventDetail for the signed action. */
	encoded_message_event_detail: string;
	/** Message event signature supplied with an action signature. */
	message_event_signature: TwitterDeleteChatConversationActionSignaturesMessageEventSignatureInput;
	/** Client-generated ID of the message being signed. */
	message_id: string;
	/** Payload string the client signed; used only in server-side failure logs. */
	signature_payload?: string;
};

export type TwitterDeleteChatConversationActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterDeleteChatConversationActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterDeleteChatConversationActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

export type TwitterDeleteChatConversationMessageTtlActionSignaturesInput = {
	/** Base64-encoded Thrift MessageEventDetail for the signed action. */
	encoded_message_event_detail: string;
	/** Message event signature supplied with an action signature. */
	message_event_signature: TwitterDeleteChatConversationMessageTtlActionSignaturesMessageEventSignatureInput;
	/** Client-generated ID of the message being signed. */
	message_id: string;
	/** Payload string the client signed; used only in server-side failure logs. */
	signature_payload?: string;
};

export type TwitterDeleteChatConversationMessageTtlActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterDeleteChatConversationMessageTtlActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterDeleteChatConversationMessageTtlActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

export type TwitterDeleteChatMessagesActionSignaturesInput = {
	/** Base64-encoded Thrift MessageEventDetail for the signed action. */
	encoded_message_event_detail: string;
	/** Message event signature supplied with an action signature. */
	message_event_signature: TwitterDeleteChatMessagesActionSignaturesMessageEventSignatureInput;
	/** Client-generated ID of the message being signed. */
	message_id: string;
	/** Payload string the client signed; used only in server-side failure logs. */
	signature_payload?: string;
};

export type TwitterDeleteChatMessagesActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterDeleteChatMessagesActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterDeleteChatMessagesActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

export type TwitterDisableChatGroupInviteActionSignaturesInput = {
	/** Base64-encoded Thrift MessageEventDetail for the signed action. */
	encoded_message_event_detail: string;
	/** Message event signature supplied with an action signature. */
	message_event_signature: TwitterDisableChatGroupInviteActionSignaturesMessageEventSignatureInput;
	/** Client-generated ID of the message being signed. */
	message_id: string;
	/** Payload string the client signed; used only in server-side failure logs. */
	signature_payload?: string;
};

export type TwitterDisableChatGroupInviteActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterDisableChatGroupInviteActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterDisableChatGroupInviteActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

export type TwitterEnableChatGroupInviteActionSignaturesInput = {
	/** Base64-encoded Thrift MessageEventDetail for the signed action. */
	encoded_message_event_detail: string;
	/** Message event signature supplied with an action signature. */
	message_event_signature: TwitterEnableChatGroupInviteActionSignaturesMessageEventSignatureInput;
	/** Client-generated ID of the message being signed. */
	message_id: string;
	/** Payload string the client signed; used only in server-side failure logs. */
	signature_payload?: string;
};

export type TwitterEnableChatGroupInviteActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterEnableChatGroupInviteActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterEnableChatGroupInviteActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

export type TwitterJoinCallMediaInput = {
	/** The audio format your agent sends and receives. */
	audio?: TwitterJoinCallMediaAudioInput;
	/** websocket (default): your agent over the media WebSocket. */
	type?: 'websocket';
};

export type TwitterJoinCallMediaAudioInput = {
	/** Audio encoding on the media WebSocket (PCM16 little-endian mono). */
	encoding?: 'pcm16';
	/** 8000, 16000, 24000 (default) or 48000. */
	sample_rate?: number;
};

/** Unique identifier of a List */
export type TwitterListIdInput = string;

export type TwitterMarkChatConversationReadActionSignaturesInput = {
	/** Base64-encoded Thrift MessageEventDetail for the signed action. */
	encoded_message_event_detail: string;
	/** Message event signature supplied with an action signature. */
	message_event_signature: TwitterMarkChatConversationReadActionSignaturesMessageEventSignatureInput;
	/** Client-generated ID of the message being signed. */
	message_id: string;
	/** Payload string the client signed; used only in server-side failure logs. */
	signature_payload?: string;
};

export type TwitterMarkChatConversationReadActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterMarkChatConversationReadActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterMarkChatConversationReadActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

/** Unique identifier of a Media */
export type TwitterMediaIdInput = string;

export type TwitterMuteChatConversationActionSignaturesInput = {
	/** Base64-encoded Thrift MessageEventDetail for the signed action. */
	encoded_message_event_detail: string;
	/** Message event signature supplied with an action signature. */
	message_event_signature: TwitterMuteChatConversationActionSignaturesMessageEventSignatureInput;
	/** Client-generated ID of the message being signed. */
	message_id: string;
	/** Payload string the client signed; used only in server-side failure logs. */
	signature_payload?: string;
};

export type TwitterMuteChatConversationActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterMuteChatConversationActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterMuteChatConversationActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

/** Unique identifier of a Note */
export type TwitterNoteIdInput = string;

/** Unique identifier of a Post */
export type TwitterPostIdInput = string;

/** Unique identifier of a PublicKey */
export type TwitterPublicKeyIdInput = string;

export type TwitterRejectChatGroupAdminRequestActionSignaturesInput = {
	/** Base64-encoded Thrift MessageEventDetail for the signed action. */
	encoded_message_event_detail: string;
	/** Message event signature supplied with an action signature. */
	message_event_signature: TwitterRejectChatGroupAdminRequestActionSignaturesMessageEventSignatureInput;
	/** Client-generated ID of the message being signed. */
	message_id: string;
	/** Payload string the client signed; used only in server-side failure logs. */
	signature_payload?: string;
};

export type TwitterRejectChatGroupAdminRequestActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterRejectChatGroupAdminRequestActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterRejectChatGroupAdminRequestActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

export type TwitterRejectChatGroupJoinRequestsActionSignaturesInput = {
	/** Base64-encoded Thrift MessageEventDetail for the signed action. */
	encoded_message_event_detail: string;
	/** Message event signature supplied with an action signature. */
	message_event_signature: TwitterRejectChatGroupJoinRequestsActionSignaturesMessageEventSignatureInput;
	/** Client-generated ID of the message being signed. */
	message_id: string;
	/** Payload string the client signed; used only in server-side failure logs. */
	signature_payload?: string;
};

export type TwitterRejectChatGroupJoinRequestsActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterRejectChatGroupJoinRequestsActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterRejectChatGroupJoinRequestsActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

export type TwitterRemoveChatGroupAdminsActionSignaturesInput = {
	/** Base64-encoded Thrift MessageEventDetail for the signed action. */
	encoded_message_event_detail: string;
	/** Message event signature supplied with an action signature. */
	message_event_signature: TwitterRemoveChatGroupAdminsActionSignaturesMessageEventSignatureInput;
	/** Client-generated ID of the message being signed. */
	message_id: string;
	/** Payload string the client signed; used only in server-side failure logs. */
	signature_payload?: string;
};

export type TwitterRemoveChatGroupAdminsActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterRemoveChatGroupAdminsActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterRemoveChatGroupAdminsActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

export type TwitterRemoveChatGroupMembersActionSignaturesInput = {
	/** Base64-encoded Thrift MessageEventDetail for the signed action. */
	encoded_message_event_detail: string;
	/** Message event signature supplied with an action signature. */
	message_event_signature: TwitterRemoveChatGroupMembersActionSignaturesMessageEventSignatureInput;
	/** Client-generated ID of the message being signed. */
	message_id: string;
	/** Payload string the client signed; used only in server-side failure logs. */
	signature_payload?: string;
};

export type TwitterRemoveChatGroupMembersActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterRemoveChatGroupMembersActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterRemoveChatGroupMembersActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

export type TwitterRemoveChatGroupMembersGroupKeyRotationDataInput = {
	/** Base64-encoded key rotation payload. */
	base64_encoded_key_rotation?: string;
	/** Version of the new rotated conversation key. */
	conversation_key_version?: string;
	/** Encrypted conversation keys for each participant. */
	conversation_participant_keys?: Array<TwitterRemoveChatGroupMembersGroupKeyRotationDataConversationParticipantKeysInput>;
	/** Re-encrypted group avatar with new conversation key. */
	encrypted_avatar?: string;
	/** Re-encrypted group description with new conversation key. */
	encrypted_description?: string;
	/** Re-encrypted group title with new conversation key. */
	encrypted_title?: string;
	/** Message keys re-encrypted with the rotated conversation key. */
	rotated_pmk_bundle?: Array<TwitterRemoveChatGroupMembersGroupKeyRotationDataRotatedPmkBundleInput>;
};

export type TwitterRemoveChatGroupMembersGroupKeyRotationDataConversationParticipantKeysInput =
	{
		/** Conversation key encrypted with this participant's public key. */
		encrypted_conversation_key: string;
		/** Version of the participant's public key used for encryption. */
		public_key_version: string;
		/** Participant user ID. */
		user_id: string;
	};

export type TwitterRemoveChatGroupMembersGroupKeyRotationDataRotatedPmkBundleInput =
	{
		/** Base64-encoded message key, encrypted with the new conversation key. */
		base64_encoded_encrypted_pmk: string;
		/** Sequence ID of the message the key belongs to. */
		message_sequence_id: string;
		/** Sequence ID of the key's origin event. */
		pme_sequence_id?: string;
	};

export type TwitterSendChatMessageContentInput = {
	/** A text message. */
	message?: TwitterSendChatMessageContentMessageInput;
	/** Adds a reaction to a message. */
	reaction_add?: TwitterSendChatMessageContentReactionAddInput;
	/** Removes a reaction from a message. */
	reaction_remove?: TwitterSendChatMessageContentReactionRemoveInput;
};

export type TwitterSendChatMessageContentMessageInput = {
	/** Text of the message. */
	text: string;
};

export type TwitterSendChatMessageContentReactionAddInput = {
	/** Emoji of the reaction. */
	emoji: string;
	/** ID of the message event the reaction is on. */
	event_id: string;
};

export type TwitterSendChatMessageContentReactionRemoveInput = {
	/** Emoji of the reaction. */
	emoji: string;
	/** ID of the message event the reaction is on. */
	event_id: string;
};

export type TwitterUnarchiveChatConversationActionSignaturesInput = {
	/** Base64-encoded Thrift MessageEventDetail for the signed action. */
	encoded_message_event_detail: string;
	/** Message event signature supplied with an action signature. */
	message_event_signature: TwitterUnarchiveChatConversationActionSignaturesMessageEventSignatureInput;
	/** Client-generated ID of the message being signed. */
	message_id: string;
	/** Payload string the client signed; used only in server-side failure logs. */
	signature_payload?: string;
};

export type TwitterUnarchiveChatConversationActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterUnarchiveChatConversationActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterUnarchiveChatConversationActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

export type TwitterUnmuteChatConversationActionSignaturesInput = {
	/** Base64-encoded Thrift MessageEventDetail for the signed action. */
	encoded_message_event_detail: string;
	/** Message event signature supplied with an action signature. */
	message_event_signature: TwitterUnmuteChatConversationActionSignaturesMessageEventSignatureInput;
	/** Client-generated ID of the message being signed. */
	message_id: string;
	/** Payload string the client signed; used only in server-side failure logs. */
	signature_payload?: string;
};

export type TwitterUnmuteChatConversationActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterUnmuteChatConversationActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterUnmuteChatConversationActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

export type TwitterUpdateChatConversationMessageTtlActionSignaturesInput = {
	/** Base64-encoded Thrift MessageEventDetail for the signed action. */
	encoded_message_event_detail: string;
	/** Message event signature supplied with an action signature. */
	message_event_signature: TwitterUpdateChatConversationMessageTtlActionSignaturesMessageEventSignatureInput;
	/** Client-generated ID of the message being signed. */
	message_id: string;
	/** Payload string the client signed; used only in server-side failure logs. */
	signature_payload?: string;
};

export type TwitterUpdateChatConversationMessageTtlActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterUpdateChatConversationMessageTtlActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterUpdateChatConversationMessageTtlActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

export type TwitterUpdateChatConversationScreenCaptureBlockingActionSignaturesInput =
	{
		/** Base64-encoded Thrift MessageEventDetail for the signed action. */
		encoded_message_event_detail: string;
		/** Message event signature supplied with an action signature. */
		message_event_signature: TwitterUpdateChatConversationScreenCaptureBlockingActionSignaturesMessageEventSignatureInput;
		/** Client-generated ID of the message being signed. */
		message_id: string;
		/** Payload string the client signed; used only in server-side failure logs. */
		signature_payload?: string;
	};

export type TwitterUpdateChatConversationScreenCaptureBlockingActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterUpdateChatConversationScreenCaptureBlockingActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterUpdateChatConversationScreenCaptureBlockingActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

export type TwitterUpdateChatConversationScreenCaptureDetectionActionSignaturesInput =
	{
		/** Base64-encoded Thrift MessageEventDetail for the signed action. */
		encoded_message_event_detail: string;
		/** Message event signature supplied with an action signature. */
		message_event_signature: TwitterUpdateChatConversationScreenCaptureDetectionActionSignaturesMessageEventSignatureInput;
		/** Client-generated ID of the message being signed. */
		message_id: string;
		/** Payload string the client signed; used only in server-side failure logs. */
		signature_payload?: string;
	};

export type TwitterUpdateChatConversationScreenCaptureDetectionActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterUpdateChatConversationScreenCaptureDetectionActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterUpdateChatConversationScreenCaptureDetectionActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

export type TwitterUpdateChatGroupActionSignaturesInput = {
	/** Base64-encoded Thrift MessageEventDetail for the signed action. */
	encoded_message_event_detail: string;
	/** Message event signature supplied with an action signature. */
	message_event_signature: TwitterUpdateChatGroupActionSignaturesMessageEventSignatureInput;
	/** Client-generated ID of the message being signed. */
	message_id: string;
	/** Payload string the client signed; used only in server-side failure logs. */
	signature_payload?: string;
};

export type TwitterUpdateChatGroupActionSignaturesMessageEventSignatureInput = {
	/** List of signing key information for message verification. */
	message_signing_key_info_list?: Array<TwitterUpdateChatGroupActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
	/** The version of the public key used for signing. */
	public_key_version: string;
	/** The signature of the message event. */
	signature: string;
	/** The version of the signature algorithm. */
	signature_version: string;
	/** The public key used for signing. */
	signing_public_key?: string;
};

export type TwitterUpdateChatGroupActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

export type TwitterUpdateChatGroupAdminSettingsActionSignaturesInput = {
	/** Base64-encoded Thrift MessageEventDetail for the signed action. */
	encoded_message_event_detail: string;
	/** Message event signature supplied with an action signature. */
	message_event_signature: TwitterUpdateChatGroupAdminSettingsActionSignaturesMessageEventSignatureInput;
	/** Client-generated ID of the message being signed. */
	message_id: string;
	/** Payload string the client signed; used only in server-side failure logs. */
	signature_payload?: string;
};

export type TwitterUpdateChatGroupAdminSettingsActionSignaturesMessageEventSignatureInput =
	{
		/** List of signing key information for message verification. */
		message_signing_key_info_list?: Array<TwitterUpdateChatGroupAdminSettingsActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput>;
		/** The version of the public key used for signing. */
		public_key_version: string;
		/** The signature of the message event. */
		signature: string;
		/** The version of the signature algorithm. */
		signature_version: string;
		/** The public key used for signing. */
		signing_public_key?: string;
	};

export type TwitterUpdateChatGroupAdminSettingsActionSignaturesMessageEventSignatureMessageSigningKeyInfoListInput =
	{
		/** The member ID associated with this signing key. */
		member_id?: string;
		/** The version of the public key. */
		public_key_version?: string;
		/** The signing public key. */
		signing_public_key?: string;
	};

export type TwitterUpdateChatGroupConversationParticipantKeysInput = {
	/** Conversation key encrypted with this participant's public key. */
	encrypted_conversation_key: string;
	/** Version of the participant's public key used for encryption. */
	public_key_version: string;
	/** Participant user ID. */
	user_id: string;
};

export type TwitterUpdateChatGroupRotatedPmkBundleInput = {
	/** Base64-encoded message key, encrypted with the new conversation key. */
	base64_encoded_encrypted_pmk: string;
	/** Sequence ID of the message the key belongs to. */
	message_sequence_id: string;
	/** Sequence ID of the key's origin event. */
	pme_sequence_id?: string;
};

export type TwitterUpdateChatSettingsAvSettingsInput = {
	/** Who may place audio or video calls to the user. */
	av_call_permissions?: TwitterUpdateChatSettingsAvSettingsAvCallPermissionsInput;
	/** Whether audio and video calls are enabled. */
	has_av_calls_enabled?: boolean;
	/** Whether enhanced call privacy is enabled. */
	has_enhanced_call_privacy_enabled?: boolean;
};

export type TwitterUpdateChatSettingsAvSettingsAvCallPermissionsInput = {
	/** Whether the user accepts calls from address-book contacts. */
	accept_calls_from_addressbook?: boolean;
	/** Whether the user accepts calls from anyone. */
	accept_calls_from_everyone?: boolean;
	/** Whether the user accepts calls from accounts they follow. */
	accept_calls_from_following?: boolean;
	/** Whether the user accepts calls from verified accounts. */
	accept_calls_from_verified?: boolean;
};

export type TwitterUpdateMediaInLibraryMonetizationInput = {
	/** ISO 3166-1 alpha-2 codes of the only countries the video is monetized in. Omit to monetize everywhere. */
	allowed_countries?: Array<string>;
	/** Advertiser categories (from the categories endpoint) whose ads may not run against the video. */
	blocked_advertiser_category_ids?: Array<number>;
	/** Advertiser account ids whose ads may not run against the video. */
	blocked_advertiser_ids?: Array<string>;
	/** Whether ads may run against the video. Requires the account to be enrolled in video monetization. */
	enabled?: boolean;
	/** Amplify program to monetize the video through, instead of `video_category_ids`. */
	program_id?: string;
	/** Video category ids (from the categories endpoint) describing the content; at most one when creating. Required when enabled, unless `program_id` is set. */
	video_category_ids?: Array<number>;
};

export type TwitterUpdateRulesAddInput = {
	/** Optional caller-defined label for the rule. */
	tag?: string;
	/** Rule filter expression. */
	value: string;
};

export type TwitterUpdateRulesDeleteInput = {
	/** Rule ids (Snowflake external ids) to delete. */
	ids?: Array<string | number>;
	/** Rule values to delete. */
	values?: Array<string>;
};

/** Unique identifier of a User */
export type TwitterUserIdInput = string;

/** Unique identifier of a WebhookConfig */
export type TwitterWebhookConfigIdInput = string;

export type TwitterAcceptChatMessageRequestResponse = {
	data?: TwitterAcceptChatMessageRequestResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterAcceptChatMessageRequestResponseData = {
	/** Whether the message request was accepted. */
	accepted?: boolean | null;
};

export type TwitterAddChatGroupAdminsResponse = {
	data?: TwitterAddChatGroupAdminsResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterAddChatGroupAdminsResponseData = {
	/** Whether the admins were added. */
	added?: boolean | null;
};

export type TwitterAddChatGroupMembersResponse = {
	data?: TwitterPost | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterAddChatModeratorResponse = {
	data?: TwitterAddChatModeratorResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterAddChatModeratorResponseData = {
	/** The user IDs currently appointed as chat moderators. */
	moderator_user_ids?: Array<string> | null;
};

export type TwitterAddConversationKeysResponse = {
	data?: TwitterAddConversationKeysResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterAddConversationKeysResponseData = {
	/** Canonical ID of the conversation. */
	conversation_id?: string | null;
	/** Sequence ID of the key change. */
	sequence_id?: string | null;
};

export type TwitterAddListsMemberResponse = {
	data?: TwitterAddListsMemberResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterAddListsMemberResponseData = {
	/** Indicates whether the user is a member of the List. */
	is_member?: boolean | null;
};

export type TwitterAddMediaToLibraryResponse = {
	data?: TwitterAddMediaToLibraryResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterAddMediaToLibraryResponseData = {
	/** The media key of the library item. */
	media_key?: string | null;
};

export type TwitterAddPostToAmplifyProgramsResponse = {
	data?: TwitterAddPostToAmplifyProgramsResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterAddPostToAmplifyProgramsResponseData = {
	/** Whether the post was published into the programs. */
	added?: boolean | null;
};

export type TwitterAddUserPublicKeyResponse = {
	data?: TwitterAddUserPublicKeyResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterAddUserPublicKeyResponseData = {
	/** Juicebox recovery-service configuration for this key. */
	juicebox_config?: Record<string, TwitterJsonValue> | null;
	/** Version assigned to the registered public key. */
	public_key_version?: string | null;
};

export type TwitterAnalytics = {
	app_install_attempts?: number | null;
	app_opens?: number | null;
	bookmarks?: number | null;
	detail_expands?: number | null;
	email_tweet?: number | null;
	engagements?: number | null;
	follows?: number | null;
	hashtag_clicks?: number | null;
	id?: string | null;
	impressions?: number | null;
	likes?: number | null;
	media_views?: number | null;
	permalink_clicks?: number | null;
	quote_tweets?: number | null;
	replies?: number | null;
	retweets?: number | null;
	shares?: number | null;
	timestamp?: string | null;
	timestamped_metrics?: TwitterAnalyticsTimestampedMetrics | null;
	unfollows?: number | null;
	unlikes?: number | null;
	url_clicks?: number | null;
	user_profile_clicks?: number | null;
};

/** Time-bucketed engagement metrics for the Post, one entry per granularity bucket. */
export type TwitterAnalyticsTimestampedMetrics = Array<{
	/** Engagement metric counts for this bucket. */
	metrics?: {
		app_install_attempts?: number | null;
		app_opens?: number | null;
		bookmarks?: number | null;
		detail_expands?: number | null;
		email_tweet?: number | null;
		engagements?: number | null;
		follows?: number | null;
		hashtag_clicks?: number | null;
		impressions?: number | null;
		likes?: number | null;
		media_views?: number | null;
		permalink_clicks?: number | null;
		quote_tweets?: number | null;
		replies?: number | null;
		retweets?: number | null;
		shares?: number | null;
		unfollows?: number | null;
		unlikes?: number | null;
		url_clicks?: number | null;
		user_profile_clicks?: number | null;
	} | null;
	/** Start of the metrics bucket, as an ISO 8601 date-time. */
	timestamp?: string | null;
}>;

export type TwitterAppendMediaUploadResponse = {
	data?: TwitterAppendMediaUploadResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterAppendMediaUploadResponseData = {
	/** Epoch seconds when the upload session expires. */
	expires_at?: number | null;
};

export type TwitterApproveChatGroupAdminRequestResponse = {
	data?: TwitterApproveChatGroupAdminRequestResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterApproveChatGroupAdminRequestResponseData = {
	/** Whether the admin request was approved. */
	approved?: boolean | null;
};

export type TwitterArchiveChatConversationResponse = {
	data?: TwitterArchiveChatConversationResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterArchiveChatConversationResponseData = {
	/** Whether the conversation is archived for the authenticated user. */
	archived?: boolean | null;
};

export type TwitterArticleCreateDraftResponse = {
	data?: TwitterArticleCreateDraftResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterArticleCreateDraftResponseData = {
	/** Unique identifier of the created draft Article. */
	id?: string | null;
	/** The title of the draft Article. */
	title?: string | null;
};

export type TwitterArticlePublishResponse = {
	data?: TwitterArticlePublishResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterArticlePublishResponseData = {
	/** The ID of the post created for the published Article. */
	post_id?: string | null;
};

export type TwitterBlockUsersDmsResponse = {
	data?: TwitterBlockUsersDmsResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterBlockUsersDmsResponseData = {
	/** Indicates whether the target user is DM-blocked. */
	blocked?: boolean | null;
};

export type TwitterBroadcast = {
	available_for_replay?: boolean | null;
	broadcast_id?: string | null;
	/** Who can chat: 0 default, 1 chat off, 2 everyone, 3 verified accounts, 4 accounts the host follows, 5 the host's subscribers, 6 accounts followed by an account the host follows. */
	chat_option?: number | null;
	created_at_ms?: string | null;
	end_ms?: string | null;
	height?: number | null;
	id?: string | null;
	image_url?: string | null;
	image_url_medium?: string | null;
	image_url_small?: string | null;
	is_high_latency?: boolean | null;
	language?: string | null;
	/** Id of the live category the host picked for the broadcast, as listed by GET /2/broadcasts/categories. Omitted when the broadcast has none. */
	live_category_id?: string | null;
	media_key?: string | null;
	scheduled_end_ms?: string | null;
	scheduled_start_ms?: string | null;
	share_url?: string | null;
	/** Id of the source the broadcast streams from, as returned by GET /2/sources. */
	source_id?: string | null;
	start_ms?: string | null;
	state?: string | null;
	title?: string | null;
	total_watched?: string | null;
	total_watching?: string | null;
	tweet_id?: string | null;
	twitter_user_id?: string | null;
	updated_at_ms?: string | null;
	width?: number | null;
};

export type TwitterBroadcastChatMessage = {
	author_id?: string | null;
	author_name?: string | null;
	author_username?: string | null;
	broadcast_id?: string | null;
	created_at_ms?: string | null;
	id?: string | null;
	relay_source?: string | null;
	relay_user?: string | null;
	reply_to?: string | null;
	text?: string | null;
};

export type TwitterBroadcastChatMute = {
	/** The Unix timestamp in milliseconds when the mute expires. Absent for indefinite mutes. */
	end_at_ms?: string | null;
	/** The muted user's ID. */
	user_id?: string | null;
};

export type TwitterCall = {
	/** XChat conversation the call belongs to, if any. */
	conversation_id?: string | null;
	/** Creation time (RFC 3339). */
	created_at?: string | null;
	/** X user id of the call's host. */
	host_id?: string | null;
	/** Unique identifier of the call; also its join secret. */
	id?: string | null;
	/** Who may join: open (anyone with the link), closed (the host admits people), or trusted (the host's Verified Organization). */
	join_policy?: string | null;
	/** Link people open to join the call on X. */
	join_url?: string | null;
	/** People in the call right now. */
	participant_count?: number | null;
	/** Title of the call. */
	title?: string | null;
	/** Whether the authenticated user may join without asking the host. */
	viewer_may_join?: boolean | null;
};

export type TwitterCancelScheduledCallResponse = {
	data?: TwitterCancelScheduledCallResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCancelScheduledCallResponseData = {
	/** Whether the occurrences are cancelled. */
	cancelled?: boolean | null;
};

export type TwitterChatConversation = {
	admin_ids?: Array<string> | null;
	admin_settings?: TwitterChatConversationAdminSettings | null;
	created_at?: string | null;
	group_avatar_url?: string | null;
	/** The group description, encrypted with the conversation key like group_name. */
	group_description?: string | null;
	/** The conversation key version that group_description is encrypted with. */
	group_description_key_version?: string | null;
	group_name?: string | null;
	id?: string | null;
	invite?: TwitterChatConversationInvite | null;
	/** Whether the authenticated user archived this conversation. */
	is_archived?: boolean | null;
	is_muted?: boolean | null;
	/** The event ID you have read up to: the seen_until_sequence_id of your latest read receipt. Absent when you have no read receipt. */
	last_read_event_id?: string | null;
	member_ids?: Array<string> | null;
	message_ttl_ms?: number | null;
	/** The ID of the latest notifying message in the conversation. */
	newest_event_id?: string | null;
	participant_ids?: Array<string> | null;
	pending_member_ids?: TwitterChatConversationPendingMemberIds | null;
	screen_capture_blocking_enabled?: boolean | null;
	screen_capture_detection_enabled?: boolean | null;
	type?: string | null;
	/** Whether the conversation is unread for you: its latest notifying message was sent by someone else after last_read_event_id, or you have no read receipt. Marking the conversation unread does not set it. */
	unread?: boolean | null;
	updated_at?: string | null;
};

/** Group actions restricted to admins. true means only admins can perform the action. */
export type TwitterChatConversationAdminSettings = {
	/** Whether only admins may add members. */
	add_member?: boolean | null;
	/** Whether only admins may block screen capture. Through the API, only admins can change screen capture in a group, whatever this setting says. */
	block_screen_capture?: boolean | null;
	/** Whether only admins may edit group info. */
	edit_group_info?: boolean | null;
	/** Whether only admins may edit the message TTL. */
	edit_message_ttl?: boolean | null;
	/** Whether only admins may send messages. */
	send_message?: boolean | null;
	/** Whether only admins may start a call. */
	start_call?: boolean | null;
};

/** An active invite link for a group Chat conversation. */
export type TwitterChatConversationInvite = {
	/** Unique identifier of the admin who turned on the invite link. */
	admin_user_id?: string | null;
	/** When the invite link stops working. */
	expires_at?: string | null;
	/** The shareable invite link. */
	invite_url?: string | null;
	/** Token identifying this invite link. */
	token?: string | null;
	/** Message shown to Users who join through the invite link. */
	welcome_message?: string | null;
};

/** Unique identifiers of Users who asked to join this group and are awaiting approval. Returned only to callers who can add members. */
export type TwitterChatConversationPendingMemberIds = Array<string>;

export type TwitterChatGroupInvite = {
	/** ID of the group conversation the link joins. */
	conversation_id?: string | null;
	/** When the link expires (ISO 8601). Absent when the link does not expire. */
	expires_at?: string | null;
	/** Group avatar URL shown on the invite preview, stored unencrypted. Absent when the backend flags the avatar as NSFW. */
	group_avatar_url?: string | null;
	/** Group name shown on the invite preview, stored unencrypted. */
	group_name?: string | null;
	/** Shareable invite link. */
	invite_url?: string | null;
	/** The authenticated user's relationship to the group: `member`, `not_member`, `removed`, or `requested`. */
	join_state?: string | null;
	/** Number of members in the group. */
	member_count?: number | null;
	/** Invite token. Together with the conversation ID it identifies the link. */
	token?: string | null;
	/** Message shown to people who open the link. */
	welcome_message?: string | null;
};

export type TwitterChatMediaUploadAppendResponse = {
	data?: TwitterChatMediaUploadAppendResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterChatMediaUploadAppendResponseData = {
	/** Epoch seconds when the upload session expires. */
	expires_at?: number | null;
};

export type TwitterChatMediaUploadFinalizeResponse = {
	data?: TwitterChatMediaUploadFinalizeResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterChatMediaUploadFinalizeResponseData = {
	/** Whether the upload was finalized. */
	success?: boolean | null;
};

export type TwitterChatMediaUploadInitializeResponse = {
	data?: TwitterChatMediaUploadInitializeResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterChatMediaUploadInitializeResponseData = {
	/** Canonical ID of the conversation. */
	conversation_id?: string | null;
	/** Hash key addressing the uploaded media. */
	media_hash_key?: string | null;
	/** Upload session ID. */
	session_id?: string | null;
};

export type TwitterChatMessageEvent = {
	conversation_id?: string | null;
	/** The version of the conversation key that encrypts the event's contents. Absent when the event is not encrypted, such as a message sent before the conversation was encrypted. */
	conversation_key_version?: string | null;
	/** Usually present on encrypted events; unencrypted events have none. */
	conversation_token?: string | null;
	created_at?: string | null;
	encoded_event?: string | null;
	id?: string | null;
	is_trusted?: boolean | null;
	/** Usually present on encrypted events; unencrypted events have none. Treat an encrypted event without one as unverified. */
	message_event_signature?: Record<string, TwitterJsonValue> | null;
	previous_id?: string | null;
	sender_id?: string | null;
};

export type TwitterChatMessageRequest = {
	/** The 1:1 conversation ID: both user IDs joined by a hyphen. */
	conversation_id?: string | null;
	conversation_key_events?: TwitterChatMessageRequestConversationKeyEvents | null;
	/** The message that previews the request, as an encoded message event. Its contents are end-to-end encrypted unless the conversation is unencrypted. */
	encoded_message_create_event?: string | null;
	/** Whether the conversation has older message events than `message_events`. */
	has_more_events?: boolean | null;
	message_events?: TwitterChatMessageRequestMessageEvents | null;
	/** The user ID of the user who sent the request. */
	sender_id?: string | null;
	/** Whether the sender recently changed their name or avatar, a possible sign of impersonation. */
	sender_recently_modified_profile?: boolean | null;
	social_proof_user_ids?: TwitterChatMessageRequestSocialProofUserIds | null;
};

/** The conversation key change events needed to decrypt `message_events`. */
export type TwitterChatMessageRequestConversationKeyEvents = Array<string>;

export type TwitterChatMessageRequestDetail = {
	/** The 1:1 conversation ID: both user IDs joined by a hyphen. */
	conversation_id?: string | null;
	conversation_key_events?: TwitterChatMessageRequestDetailConversationKeyEvents | null;
	/** Whether older message events may exist. Always `true` when `message_events` isn't empty. */
	has_more_events?: boolean | null;
	message_events?: TwitterChatMessageRequestDetailMessageEvents | null;
	/** `received` while the other user's request is pending, `sent` while the authenticated user's request is pending, `none` otherwise. */
	message_request_state?: string | null;
	/** The other user in the conversation: the sender when `message_request_state` is `received`. */
	participant_id?: string | null;
};

/** The conversation key change events needed to decrypt `message_events`. */
export type TwitterChatMessageRequestDetailConversationKeyEvents =
	Array<string>;

/** The newest message events, newest first, as encoded message events. Their contents are end-to-end encrypted unless the conversation is unencrypted. */
export type TwitterChatMessageRequestDetailMessageEvents = Array<string>;

/** The conversation's latest message events, newest first, as encoded message events. Their contents are end-to-end encrypted unless the conversation is unencrypted. */
export type TwitterChatMessageRequestMessageEvents = Array<string>;

/** IDs of users the authenticated user follows who also follow the sender. */
export type TwitterChatMessageRequestSocialProofUserIds = Array<string>;

export type TwitterChatPermissionsUnavailableProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterChatPinnedMessage = {
	/** Base64-encoded Thrift pin event with end-to-end encrypted contents. */
	encoded_event?: string | null;
};

export type TwitterChatSettings = {
	/** Who can send the user messages: `all` (anyone), `verified` (verified accounts only), or `following` (accounts the user follows). */
	allow_dms_from?: string | null;
	/** Whether the user's subscribers can always message them regardless of allow_dms_from. */
	always_allow_dms_from_subscribers?: boolean | null;
	av_settings?: TwitterChatSettingsAvSettings | null;
	/** Low-quality message request filter: `enabled` (low-quality requests go to a separate folder) or `disabled` (all requests stay in the main inbox). */
	dm_quality_filter?: string | null;
	/** Read receipts: `all_enabled` (send and receive read receipts) or `all_disabled` (neither). */
	dm_receipt_settings?: string | null;
};

/** Audio and video call settings. */
export type TwitterChatSettingsAvSettings = {
	/** Who may place audio or video calls to the user. */
	av_call_permissions?: {
		/** Whether the user accepts calls from address-book contacts. */
		accept_calls_from_addressbook?: boolean | null;
		/** Whether the user accepts calls from anyone. */
		accept_calls_from_everyone?: boolean | null;
		/** Whether the user accepts calls from accounts they follow. */
		accept_calls_from_following?: boolean | null;
		/** Whether the user accepts calls from verified accounts. */
		accept_calls_from_verified?: boolean | null;
	} | null;
	/** Whether audio and video calls are enabled. */
	has_av_calls_enabled?: boolean | null;
	/** Whether enhanced call privacy is enabled. */
	has_enhanced_call_privacy_enabled?: boolean | null;
};

export type TwitterCommunity = {
	access?: string | null;
	created_at?: string | null;
	description?: string | null;
	id?: string | null;
	join_policy?: string | null;
	member_count?: number | null;
	name?: string | null;
};

export type TwitterComplianceJob = {
	created_at?: string | null;
	download_expires_at?: string | null;
	download_url?: string | null;
	id?: string | null;
	name?: string | null;
	resumable?: boolean | null;
	status?: string | null;
	type?: string | null;
	upload_expires_at?: string | null;
	upload_url?: string | null;
};

export type TwitterConnection = {
	client_ip?: string | null;
	connected_at?: string | null;
	disconnect_reason?: string | null;
	disconnected_at?: string | null;
	endpoint_name?: string | null;
	id?: string | null;
};

export type TwitterCreateAccountActivitySubscriptionResponse = {
	data?: TwitterCreateAccountActivitySubscriptionResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreateAccountActivitySubscriptionResponseData = {
	/** Whether the subscription is active. */
	subscribed?: boolean | null;
};

export type TwitterCreateActivitySubscriptionResponse = {
	data?: TwitterCreateActivitySubscriptionResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreateActivitySubscriptionResponseData = {
	subscription?: TwitterCreateActivitySubscriptionResponseDataSubscription | null;
};

export type TwitterCreateActivitySubscriptionResponseDataSubscription = {
	/** Subscription creation time. */
	created_at?: string | null;
	/** Activity event type in dot notation. */
	event_type?: string | null;
	/** Subscription expiration time. */
	expires_at?: string | null;
	/** Subscription filter. */
	filter?: TwitterCreateActivitySubscriptionResponseDataSubscriptionFilter | null;
	/** Unique identifier of the subscription. */
	subscription_id?: string | null;
	/** Optional caller-defined tag. */
	tag?: string | null;
	/** Subscription last-update time. */
	updated_at?: string | null;
	/** Webhook receiving the subscription events. */
	webhook_id?: string | null;
};

export type TwitterCreateActivitySubscriptionResponseDataSubscriptionFilter = {
	/** Optional direction filter for directional events. Not present for mute.* or block.* events. */
	direction?: string | null;
	/** Optional keyword filter. */
	keyword?: string | null;
	/** Event-specific string predicates applied to the subscription. */
	qualifiers?: Record<string, TwitterJsonValue> | null;
	/** User the subscription is scoped to. */
	user_id?: string | null;
};

export type TwitterCreateBotResponse = {
	data?: TwitterCreateBotResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreateBotResponseData = {
	/** Unique identifier of the bot's User account. */
	id?: string | null;
	/** The bot's display name. */
	name?: string | null;
	/** Whether the bot is org only. For a handle that already names one of the project's bots, this is that bot's current setting. Absent when X couldn't read the setting back. */
	org_only?: boolean | null;
	/** Scopes granted to the bot's bearer token. */
	scopes?: Array<string> | null;
	/** The bot's bearer token. Returned exactly once; store it securely. */
	token?: string | null;
	/** Expiry of the bot's bearer token, in epoch milliseconds. */
	token_expires_at_ms?: number | null;
	/** The bot's X handle (screen name). */
	username?: string | null;
};

export type TwitterCreateBroadcastResponse = {
	data?: TwitterCreateBroadcastResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreateBroadcastResponseData = {
	/** Broadcast id; the same as `id`. */
	broadcast_id?: string | null;
	/** Who can chat: 0 default, 1 chat off, 2 everyone, 3 verified accounts, 4 accounts the host follows, 5 the host's subscribers, 6 accounts followed by an account the host follows. */
	chat_option?: number | null;
	/** Broadcast id. */
	id?: string | null;
	/** Broadcast language. */
	language?: string | null;
	/** The broadcast's live category. Missing when it has none. */
	live_category_id?: string | null;
	/** Media key of the broadcast. */
	media_key?: string | null;
	/** The broadcast's watch page. */
	share_url?: string | null;
	/** Start time, milliseconds since Unix epoch (decimal string). */
	start_ms?: string | null;
	/** Broadcast state, `RUNNING` once live. */
	state?: string | null;
	/** Broadcast title. */
	title?: string | null;
	/** Id of the Post announcing the broadcast. Missing when the Post hasn't been created yet, was suppressed with `should_not_tweet`, or could not be created. */
	tweet_id?: string | null;
};

export type TwitterCreateCallResponse = {
	data?: TwitterCreateCallResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreateCallResponseData = {
	/** XChat conversation the call belongs to, if any. */
	conversation_id?: string | null;
	/** Creation time (RFC 3339). */
	created_at?: string | null;
	/** X user id of the call's host. */
	host_id?: string | null;
	/** Unique identifier of the call; also its join secret. */
	id?: string | null;
	/** Who may join: open (anyone with the link), closed (the host admits people), or trusted (the host's Verified Organization). */
	join_policy?: string | null;
	/** Link people open to join the call on X. */
	join_url?: string | null;
	/** People in the call right now. */
	participant_count?: number | null;
	/** Title of the call. */
	title?: string | null;
	/** Whether the authenticated user may join without asking the host. */
	viewer_may_join?: boolean | null;
};

export type TwitterCreateChatConversationResponse = {
	data?: TwitterCreateChatConversationResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreateChatConversationResponseData = {
	/** Canonical ID of the created conversation. */
	conversation_id?: string | null;
	/** Sequence ID of the conversation key change. */
	conversation_key_change_sequence_id?: string | null;
};

export type TwitterCreateChatGroupAdminRequestResponse = {
	data?: TwitterCreateChatGroupAdminRequestResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreateChatGroupAdminRequestResponseData = {
	/** Whether the admin request was created. */
	requested?: boolean | null;
};

export type TwitterCreateChatGroupJoinRequestResponse = {
	data?: TwitterCreateChatGroupJoinRequestResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreateChatGroupJoinRequestResponseData = {
	/** Whether the join request was created. */
	requested?: boolean | null;
};

export type TwitterCreateCommunityNotesResponse = {
	data?: TwitterCreateCommunityNotesResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreateCommunityNotesResponseData = {
	/** Unique identifier of the created Community Note. */
	id?: string | null;
};

export type TwitterCreateComplianceJobsResponse = {
	data?: TwitterComplianceJob | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreateDirectMessagesByConversationIdResponse = {
	data?: TwitterCreateDirectMessagesByConversationIdResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreateDirectMessagesByConversationIdResponseData = {
	/** The conversation the message was sent to. */
	dm_conversation_id?: string | null;
	/** The id of the created DM event. */
	dm_event_id?: string | null;
};

export type TwitterCreateDirectMessagesByParticipantIdResponse = {
	data?: TwitterCreateDirectMessagesByParticipantIdResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreateDirectMessagesByParticipantIdResponseData = {
	/** The conversation the message was sent to. */
	dm_conversation_id?: string | null;
	/** The id of the created DM event. */
	dm_event_id?: string | null;
};

export type TwitterCreateDirectMessagesConversationResponse = {
	data?: TwitterCreateDirectMessagesConversationResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreateDirectMessagesConversationResponseData = {
	/** The id of the created conversation. */
	dm_conversation_id?: string | null;
	/** The id of the created DM event. */
	dm_event_id?: string | null;
};

export type TwitterCreateListsResponse = {
	data?: TwitterCreateListsResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreateListsResponseData = {
	/** Unique identifier of the created List. */
	id?: string | null;
	/** The name of the created List. */
	name?: string | null;
};

export type TwitterCreateMediaMetadataResponse = {
	data?: TwitterCreateMediaMetadataResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreateMediaMetadataResponseData = {
	/** The metadata now associated with the media. */
	associated_metadata?: Record<string, TwitterJsonValue> | null;
	/** The media id the metadata was attached to. */
	id?: string | null;
};

export type TwitterCreateMediaSubtitlesResponse = {
	data?: TwitterCreateMediaSubtitlesResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreateMediaSubtitlesResponseData = {
	/** The subtitles now associated with the media. */
	associated_subtitles?: Record<string, TwitterJsonValue> | null;
	/** The media id. */
	id?: string | null;
	/** The media category. */
	media_category?: string | null;
};

export type TwitterCreatePostDraftResponse = {
	data?: TwitterCreatePostDraftResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreatePostDraftResponseData = {
	/** Unique identifier of the saved draft. */
	id?: string | null;
	/** The text of the saved draft. */
	text?: string | null;
};

export type TwitterCreatePostsResponse = {
	data?: TwitterCreatePostsResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreatePostsResponseData = {
	/** Post IDs in this Post's edit history chain. */
	edit_history_post_ids?: Array<string> | null;
	/** Unique identifier of the created Post. */
	id?: string | null;
	/** The content of the created Post. */
	text?: string | null;
};

export type TwitterCreateScheduledBroadcastResponse = {
	data?: TwitterCreateScheduledBroadcastResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreateScheduledBroadcastResponseData = {
	/** Whether replay is enabled. */
	available_for_replay?: boolean | null;
	/** Alphanumeric broadcast id (path `:id` for get/update/delete/live). */
	broadcast_id?: string | null;
	/** Who can chat (numeric string): `0` default, `1` chat off, `2` everyone, `3` verified accounts, `4` accounts the host follows, `5` the host's subscribers, `6` accounts followed by an account the host follows. */
	chat_option?: string | null;
	/** Optional description. */
	description?: string | null;
	/** Optional locale. */
	locale?: string | null;
	/** When true, coordinator will not auto-publish; call POST .../live when ready. */
	manual_publish?: boolean | null;
	/** Deprecated: always null for new schedules. */
	recurring_schedule_id?: string | null;
	/** Numeric scheduler id. Required in the update request body. */
	scheduled_broadcast_id?: string | null;
	/** Scheduled end, milliseconds since Unix epoch (decimal string). */
	scheduled_end_ms?: string | null;
	/** Scheduled start, milliseconds since Unix epoch (decimal string). */
	scheduled_start_ms?: string | null;
	/** Id of the bound source, as returned by GET /2/sources. Omitted when unknown. */
	source_id?: string | null;
	/** Scheduler state: `Created` or `Scheduled` before start, then `Running`, `Ended`, or `Error`. */
	state?: string | null;
	/** Deprecated: always null for new schedules. */
	telecast_id?: string | null;
	/** Optional pre-live slate media id. */
	thumbnail_media_id?: string | null;
	/** Broadcast title / status text. */
	title?: string | null;
};

export type TwitterCreateSourceResponse = {
	data?: TwitterCreateSourceResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreateSourceResponseData = {
	/** Creation time, milliseconds since Unix epoch (decimal string). */
	created_at_ms?: string | null;
	/** Source id, 19 decimal digits; the `source_id` that POST /2/broadcasts and scheduled broadcasts take. Not a credential: read the stream key with GET /2/sources/:id/stream_key. */
	id?: string | null;
	/** Whether an encoder is currently sending video to the source. */
	is_stream_active?: boolean | null;
	/** Label for the source. */
	name?: string | null;
	/** Region of the ingest location serving the source: `us-east-1` or `us-west-2`. Sources created before October 31, 2026 keep the AWS region they were created in. */
	region?: string | null;
	/** Ingest URL. */
	rtmp_url?: string | null;
	/** RTMPS ingest URL (port 443). Configure your encoder with this URL and the source's stream key. */
	rtmps_url?: string | null;
	/** Stream key. A credential: anyone with it can stream to the source. */
	stream_key?: string | null;
};

export type TwitterCreateUserBroadcastResponse = {
	data?: TwitterCreateUserBroadcastResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreateUserBroadcastResponseData = {
	broadcast?: TwitterCreateUserBroadcastResponseDataBroadcast | null;
	/** The broadcast's watch page. */
	share_url?: string | null;
	/** Always empty. */
	video_access?: TwitterCreateUserBroadcastResponseDataVideoAccess | null;
};

export type TwitterCreateUserBroadcastResponseDataBroadcast = {
	/** Whether a replay is available. */
	available_for_replay?: boolean | null;
	/** Broadcast id. */
	broadcast_id?: string | null;
	/** Who can chat: 0 default, 1 chat off, 2 everyone, 3 verified accounts, 4 accounts the host follows, 5 the host's subscribers, 6 accounts followed by an account the host follows. */
	chat_option?: number | null;
	/** Creation time, milliseconds since Unix epoch (decimal string). */
	created_at_ms?: string | null;
	/** End time, milliseconds since Unix epoch (decimal string). */
	end_ms?: string | null;
	/** Video height in pixels. */
	height?: number | null;
	/** Broadcast id; equal to `broadcast_id`. */
	id?: string | null;
	/** Thumbnail URL. */
	image_url?: string | null;
	/** Medium thumbnail URL. */
	image_url_medium?: string | null;
	/** Small thumbnail URL. */
	image_url_small?: string | null;
	/** Whether the broadcast is high latency. */
	is_high_latency?: boolean | null;
	/** Broadcast language. */
	language?: string | null;
	/** Numeric media id from `media_key`. */
	media_id?: string | null;
	/** Media key of the broadcast's video. */
	media_key?: string | null;
	/** Scheduled end time, milliseconds since Unix epoch (decimal string). */
	scheduled_end_ms?: string | null;
	/** Scheduled start time, milliseconds since Unix epoch (decimal string). */
	scheduled_start_ms?: string | null;
	/** Start time, milliseconds since Unix epoch (decimal string). */
	start_ms?: string | null;
	/** `NOT_STARTED`, `RUNNING`, `TIMED_OUT`, `ENDED`, `PRE_PUBLISHED` or `CANCELED`. */
	state?: string | null;
	/** Broadcast title. */
	status?: string | null;
	/** Total viewers (decimal string). */
	total_watched?: string | null;
	/** Current viewers (decimal string). */
	total_watching?: string | null;
	/** Id of the Post announcing the broadcast. */
	tweet_id?: string | null;
	/** Owner's user id. */
	twitter_user_id?: string | null;
	/** Last update time, milliseconds since Unix epoch (decimal string). */
	updated_at_ms?: string | null;
	/** Video width in pixels. */
	width?: number | null;
};

export type TwitterCreateUserBroadcastResponseDataVideoAccess = Record<
	string,
	TwitterJsonValue
>;

export type TwitterCreateUserSourceResponse = {
	data?: TwitterCreateUserSourceResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreateUserSourceResponseData = {
	source?: TwitterCreateUserSourceResponseDataSource | null;
};

export type TwitterCreateUserSourceResponseDataSource = {
	/** Where a source created before the move to on-prem was created, e.g. `{"value": 2, "name": "MediaStudio", "original_name": "MEDIA_STUDIO"}`; omitted for on-prem sources. */
	creation_origin?: TwitterCreateUserSourceResponseDataSourceCreationOrigin | null;
	/** Creation time, ms since Unix epoch. */
	creation_time?: number | null;
	/** Source id; also the RTMP stream key. */
	id?: string | null;
	/** Whether the source streams 360° video. */
	is360?: boolean | null;
	/** Whether an encoder is currently sending video to the source. */
	is_stream_active?: boolean | null;
	/** Label for the source. */
	name?: string | null;
	/** Owner's numeric user id. Exceeds the exact integer range of many JSON parsers. Returned as a decimal string. */
	owner_id?: string | null;
	/** Ingest region as an AWS region name, e.g. `us-east-1` or `us-west-2`. Accepted as `region` when creating a source. */
	rtmp_region?: string | null;
	/** Stream key; equal to `id`. */
	rtmp_stream_key?: string | null;
	/** RTMP ingest URL. */
	rtmp_url?: string | null;
	/** RTMPS ingest URL (port 443). */
	rtmps_url?: string | null;
	/** Video service of a source created before the move to on-prem, e.g. `{"value": 0, "name": "Vidman", "original_name": "VIDMAN"}`; omitted for on-prem sources. */
	video_service?: TwitterCreateUserSourceResponseDataSourceVideoService | null;
};

export type TwitterCreateUserSourceResponseDataSourceCreationOrigin = {
	/** Name, e.g. `PublicApi`. */
	name?: string | null;
	/** Upper-case name, e.g. `PUBLIC_API`. */
	original_name?: string | null;
	/** Numeric value. */
	value?: number | null;
};

export type TwitterCreateUserSourceResponseDataSourceVideoService = {
	/** Name, e.g. `PublicApi`. */
	name?: string | null;
	/** Upper-case name, e.g. `PUBLIC_API`. */
	original_name?: string | null;
	/** Numeric value. */
	value?: number | null;
};

export type TwitterCreateUsersBookmarkFolderResponse = {
	data?: TwitterCreateUsersBookmarkFolderResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreateUsersBookmarkFolderResponseData = {
	/** Unique identifier of the created Bookmark folder. */
	id?: string | null;
	/** The name of the created Bookmark folder. */
	name?: string | null;
};

export type TwitterCreateUsersBookmarkResponse =
	| {
			data?: {
				/** Indicates whether the Post is bookmarked by the user. */
				bookmarked?: boolean | null;
			} | null;
	  }
	| {
			/** Successfully bookmarked Posts, in request order. */
			data?: Array<{
				/** Indicates whether the Post is bookmarked by the user. */
				bookmarked?: boolean | null;
				/** The Post ID that was bookmarked. */
				tweet_id?: string | null;
			}> | null;
			/** Per-id failures; remaining IDs are still bookmarked. */
			errors?: Array<{
				detail?: string | null;
				title?: string | null;
				/** Post ID the failure applies to. */
				tweet_id?: string | null;
			}> | null;
	  };

export type TwitterCreateWebhookReplayJobResponse = {
	data?: TwitterCreateWebhookReplayJobResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreateWebhookReplayJobResponseData = {
	/** The UTC timestamp when the replay job was created. */
	created_at?: string | null;
	/** The unique identifier for the initiated replay job. */
	job_id?: string | null;
};

export type TwitterCreateWebhooksResponse = {
	data?: TwitterCreateWebhooksResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreateWebhooksResponseData = {
	/** Creation time of the webhook configuration. */
	created_at?: string | null;
	/** Unique identifier of the webhook configuration. */
	id?: string | null;
	/** The URL the webhook delivers events to. */
	url?: string | null;
	/** Indicates whether the webhook URL passed validation. */
	valid?: boolean | null;
};

export type TwitterCreateWebhooksStreamLinkResponse = {
	data?: TwitterCreateWebhooksStreamLinkResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterCreateWebhooksStreamLinkResponseData = {
	/** Indicates whether the stream link was provisioned. */
	provisioned?: boolean | null;
};

export type TwitterDeleteAccountActivitySubscriptionResponse = {
	data?: TwitterDeleteAccountActivitySubscriptionResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeleteAccountActivitySubscriptionResponseData = {
	/** Whether the user has an active subscription. */
	subscribed?: boolean | null;
};

export type TwitterDeleteActivitySubscriptionResponse = {
	data?: TwitterDeleteActivitySubscriptionResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeleteActivitySubscriptionResponseData = {
	/** Whether the subscription was deleted. */
	deleted?: boolean | null;
};

export type TwitterDeleteActivitySubscriptionsByIdsResponse = {
	data?: Array<{
		/** Whether the subscription was deleted. */
		deleted?: boolean | null;
		/** Id of the deleted subscription. */
		subscription_id?: string | null;
	}> | null;
	/** Per-id failures; deletion continues for the remaining ids. */
	errors?: Array<{
		/** Human-readable failure detail. */
		message?: string | null;
		/** Machine-readable failure reason. */
		reason?: string | null;
		/** Id the failure applies to. */
		subscription_id?: string | null;
	}> | null;
	meta?: {
		/** Subscriptions remaining after deletion. */
		total_subscriptions?: number | null;
	} | null;
};

export type TwitterDeleteAllConnectionsResponse = {
	data?: TwitterDeleteAllConnectionsResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeleteAllConnectionsResponseData = {
	/** Number of connections that could not be terminated. */
	failed_kills?: number | null;
	results?: Array<TwitterDeleteAllConnectionsResponseDataResults> | null;
	/** Number of connections successfully terminated. */
	successful_kills?: number | null;
};

export type TwitterDeleteAllConnectionsResponseDataResults = {
	error_message?: string | null;
	success?: boolean | null;
	uuid?: string | null;
};

export type TwitterDeleteBotResponse = {
	data?: TwitterDeleteBotResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeleteBotResponseData = {
	/** Whether the bot was deleted. */
	deleted?: boolean | null;
};

export type TwitterDeleteBroadcastChatMessageResponse = {
	data?: TwitterDeleteBroadcastChatMessageResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeleteBroadcastChatMessageResponseData = {
	/** Whether the chat message was removed. */
	deleted?: boolean | null;
};

export type TwitterDeleteBroadcastResponse = {
	data?: TwitterDeleteBroadcastResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeleteBroadcastResponseData = {
	/** Whether the broadcast was deleted. */
	deleted?: boolean | null;
};

export type TwitterDeleteChatConversationMessageTtlResponse = {
	data?: TwitterDeleteChatConversationMessageTtlResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeleteChatConversationMessageTtlResponseData = {
	/** Whether the message lifetime was removed. */
	deleted?: boolean | null;
};

export type TwitterDeleteChatConversationResponse = {
	data?: TwitterDeleteChatConversationResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeleteChatConversationResponseData = {
	/** Whether the conversation was deleted. */
	deleted?: boolean | null;
};

export type TwitterDeleteChatMessagesResponse = {
	data?: TwitterDeleteChatMessagesResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeleteChatMessagesResponseData = {
	/** Whether the messages were deleted. */
	deleted?: boolean | null;
};

export type TwitterDeleteCommunityNotesResponse = {
	data?: TwitterDeleteCommunityNotesResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeleteCommunityNotesResponseData = {
	/** Indicates whether the Community Note was deleted. */
	deleted?: boolean | null;
};

export type TwitterDeleteComplianceJobsByIdResponse = {
	data?: TwitterComplianceJob | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeleteConnectionsByEndpointResponse = {
	data?: TwitterDeleteConnectionsByEndpointResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeleteConnectionsByEndpointResponseData = {
	/** Number of connections that could not be terminated. */
	failed_kills?: number | null;
	results?: Array<TwitterDeleteConnectionsByEndpointResponseDataResults> | null;
	/** Number of connections successfully terminated. */
	successful_kills?: number | null;
};

export type TwitterDeleteConnectionsByEndpointResponseDataResults = {
	error_message?: string | null;
	success?: boolean | null;
	uuid?: string | null;
};

export type TwitterDeleteConnectionsByUuidsResponse = {
	data?: TwitterDeleteConnectionsByUuidsResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeleteConnectionsByUuidsResponseData = {
	/** Number of connections that could not be terminated. */
	failed_kills?: number | null;
	results?: Array<TwitterDeleteConnectionsByUuidsResponseDataResults> | null;
	/** Number of connections successfully terminated. */
	successful_kills?: number | null;
};

export type TwitterDeleteConnectionsByUuidsResponseDataResults = {
	error_message?: string | null;
	success?: boolean | null;
	uuid?: string | null;
};

export type TwitterDeleteDirectMessagesEventsResponse = {
	data?: TwitterDeleteDirectMessagesEventsResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeleteDirectMessagesEventsResponseData = {
	/** Whether the event was deleted. */
	deleted?: boolean | null;
};

export type TwitterDeleteListsResponse = {
	data?: TwitterDeleteListsResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeleteListsResponseData = {
	/** Indicates whether the List was deleted. */
	deleted?: boolean | null;
};

export type TwitterDeleteMediaSubtitlesResponse = {
	data?: TwitterDeleteMediaSubtitlesResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeleteMediaSubtitlesResponseData = {
	/** Indicates whether the subtitles were deleted. */
	deleted?: boolean | null;
};

export type TwitterDeletePostDraftResponse = {
	data?: TwitterDeletePostDraftResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeletePostDraftResponseData = {
	/** Whether the draft is gone from the user's drafts. */
	deleted?: boolean | null;
};

export type TwitterDeletePostsResponse = {
	data?: TwitterDeletePostsResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeletePostsResponseData = {
	/** Whether the Post was deleted. */
	deleted?: boolean | null;
};

export type TwitterDeleteScheduledBroadcastResponse = {
	data?: TwitterDeleteScheduledBroadcastResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeleteScheduledBroadcastResponseData = {
	/** Whether the scheduled broadcast was deleted. */
	deleted?: boolean | null;
};

export type TwitterDeleteSourceResponse = {
	data?: TwitterDeleteSourceResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeleteSourceResponseData = {
	/** Whether the source was deleted. */
	deleted?: boolean | null;
};

export type TwitterDeleteUserBroadcastResponse = {
	data?: TwitterDeleteUserBroadcastResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeleteUserBroadcastResponseData = {
	/** Always `true` on success. */
	success?: boolean | null;
};

export type TwitterDeleteUserSourceResponse = {
	data?: TwitterDeleteUserSourceResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeleteUserSourceResponseData = Record<
	string,
	TwitterJsonValue
>;

export type TwitterDeleteUsersBookmarkResponse = {
	data?: TwitterDeleteUsersBookmarkResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeleteUsersBookmarkResponseData = {
	/** Whether the Post is bookmarked. */
	bookmarked?: boolean | null;
};

export type TwitterDeleteWebhooksResponse = {
	data?: TwitterDeleteWebhooksResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeleteWebhooksResponseData = {
	/** Indicates whether the webhook configuration was deleted. */
	deleted?: boolean | null;
};

export type TwitterDeleteWebhooksStreamLinkResponse = {
	data?: TwitterDeleteWebhooksStreamLinkResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDeleteWebhooksStreamLinkResponseData = {
	/** Indicates whether the stream link was deleted. */
	deleted?: boolean | null;
};

export type TwitterDisableChatGroupInviteResponse = {
	data?: TwitterDisableChatGroupInviteResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterDisableChatGroupInviteResponseData = {
	/** Whether the invite link was turned off. */
	disabled?: boolean | null;
};

export type TwitterDisallowedResourceProblem = {
	detail?: string | null;
	resource_id?: string | null;
	resource_type?: string | null;
	section?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmBadAttachmentProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmBadCtaProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmBadCustomProfileProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmBadMediaProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmBadQuickReplyProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmBadUrlProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmConversationNameTooLongProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmConversationNotFoundProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmDuplicateProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmEvent = {
	attachments?: TwitterDmEventAttachments | null;
	created_at?: string | null;
	dm_conversation_id?: string | null;
	entities?: TwitterDmEventEntities | null;
	event_type?: string | null;
	id?: string | null;
	participant_ids?: Array<string> | null;
	referenced_posts?: TwitterDmEventReferencedPosts | null;
	sender_id?: string | null;
	text?: string | null;
};

/** Media and card attachments present in this Direct Message event. */
export type TwitterDmEventAttachments = {
	/** IDs of cards attached to this Direct Message. */
	card_ids?: Array<string> | null;
	/** Media keys of media (including audio) attached to this Direct Message. */
	media_keys?: Array<string> | null;
};

/** A list of metadata entities (hashtags, cashtags, mentions, URLs) found in the Direct Message text. */
export type TwitterDmEventEntities = {
	cashtags?: Array<{
		/** End index in the text (exclusive). */
		end?: number | null;
		/** Start index in the text (inclusive). */
		start?: number | null;
		tag?: string | null;
	}> | null;
	hashtags?: Array<{
		/** End index in the text (exclusive). */
		end?: number | null;
		/** Start index in the text (inclusive). */
		start?: number | null;
		tag?: string | null;
	}> | null;
	mentions?: Array<{
		end?: number | null;
		id?: string | null;
		start?: number | null;
		username?: string | null;
	}> | null;
	urls?: Array<{
		/** The URL as displayed in the Direct Message text. */
		display_url?: string | null;
		end?: number | null;
		/** The fully resolved URL. */
		expanded_url?: string | null;
		start?: number | null;
		/** The t.co shortened URL. */
		url?: string | null;
	}> | null;
};

export type TwitterDmEventReferencedPosts = Array<{
	/** Unique identifier of the referenced Post. */
	id?: string | null;
}>;

export type TwitterDmInactiveDeviceProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmNotDeliveredProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmNotFoundProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmNotOwnerProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmParticipantNotAddedProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmParticipantNotFoundProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmParticipantRestrictedProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmParticipantUnavailableProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmRateLimitedProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmRecipientBlocksSenderProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmRecipientCannotReceiveProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmRecipientEncryptedUnavailableProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmRecipientNotAcceptingProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmRecipientNotFoundProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmRecipientRestrictsGroupsProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmRecipientUnavailableProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmRequestInProgressProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmSafetyLimitedProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmSafetyRejectedProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmSenderBlocksRecipientProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmSenderDeclinedDmsProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmSenderDmsClosedProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmSenderEncryptedUnavailableProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmSenderNotInConversationProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmSenderNotPermittedProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmSenderNotVerifiedProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmSenderPhoneRequiredProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmSenderReadOnlyProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmSenderUnavailableProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmTextEmptyProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmTextTooLongProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmTooFewParticipantsProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmTooManyParticipantsProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDmUnsupportedMessageProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterDuplicateRuleProblem = {
	detail?: string | null;
	id?: string | null;
	title?: string | null;
	type?: string | null;
	value?: string | null;
};

export type TwitterEnableChatGroupInviteResponse = {
	data?: TwitterEnableChatGroupInviteResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterEnableChatGroupInviteResponseData = {
	/** ID of the group conversation the link joins. */
	conversation_id?: string | null;
	/** When the link expires (ISO 8601). Absent when the link does not expire. */
	expires_at?: string | null;
	/** Group avatar URL shown on the invite preview, stored unencrypted. Absent when the backend flags the avatar as NSFW. */
	group_avatar_url?: string | null;
	/** Group name shown on the invite preview, stored unencrypted. */
	group_name?: string | null;
	/** Shareable invite link. */
	invite_url?: string | null;
	/** Invite token. Together with the conversation ID it identifies the link. */
	token?: string | null;
	/** Message shown to people who open the link. */
	welcome_message?: string | null;
};

export type TwitterEncryptionRequiredProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterEnsureAccountResponse = {
	data?: TwitterEnsureAccountResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterEnsureAccountResponseData = {
	/** Unique identifier of the developer account. */
	account_id?: string | null;
	/** Whether this request created the account. */
	created?: boolean | null;
};

export type TwitterEvaluateCommunityNotesResponse = {
	data?: TwitterEvaluateCommunityNotesResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterEvaluateCommunityNotesResponseData = {
	/** The evaluated claim-opinion score for the note. */
	claim_opinion_score?: number | null;
};

export type TwitterExpansions = {
	calls?: Array<TwitterCall> | null;
	media?: Array<TwitterMedia> | null;
	places?: Array<TwitterPlace> | null;
	polls?: Array<TwitterPoll> | null;
	posts?: Array<TwitterPost> | null;
	topics?: Array<TwitterTopic> | null;
	users?: Array<TwitterUser> | null;
};

export type TwitterFieldHydrationFailureProblem = {
	detail?: string | null;
	field?: string | null;
	resource_type?: string | null;
	section?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterFieldUnauthorizedProblem = {
	detail?: string | null;
	field?: string | null;
	resource_type?: string | null;
	section?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterFinalizeMediaUploadResponse = {
	data?: TwitterFinalizeMediaUploadResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterFinalizeMediaUploadResponseData = {
	/** Seconds until the upload session expires. */
	expires_after_secs?: number | null;
	/** Unique identifier of the media. */
	id?: string | null;
	image?: TwitterFinalizeMediaUploadResponseDataImage | null;
	/** The media key for the uploaded media. */
	media_key?: string | null;
	processing_info?: TwitterFinalizeMediaUploadResponseDataProcessingInfo | null;
	/** Total size of the media in bytes. */
	size?: number | null;
	video?: TwitterFinalizeMediaUploadResponseDataVideo | null;
};

export type TwitterFinalizeMediaUploadResponseDataImage = {
	/** Height in pixels. */
	h?: number | null;
	/** MIME type of the uploaded image. */
	image_type?: string | null;
	/** Width in pixels. */
	w?: number | null;
};

export type TwitterFinalizeMediaUploadResponseDataProcessingInfo = {
	/** Seconds to wait before polling status again. */
	check_after_secs?: number | null;
	/** Processing completion percentage. */
	progress_percent?: number | null;
	/** Processing state (pending, in_progress, failed, succeeded). */
	state?: string | null;
};

export type TwitterFinalizeMediaUploadResponseDataVideo = {
	/** MIME type of the processed video. */
	video_type?: string | null;
};

export type TwitterFollowListResponse = {
	data?: TwitterFollowListResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterFollowListResponseData = {
	/** Whether the user is following the List. */
	following?: boolean | null;
};

export type TwitterFollowUserResponse = {
	data?: TwitterFollowUserResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterFollowUserResponseData = {
	/** Whether the source User is following the target User. */
	following?: boolean | null;
	/** Whether the follow request is pending the target User's approval. */
	pending_follow?: boolean | null;
};

export type TwitterGetAccountActivitySubscriptionCountResponse = {
	data?: TwitterGetAccountActivitySubscriptionCountResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetAccountActivitySubscriptionCountResponseData = {
	/** Name of the subscribing account. */
	account_name?: string | null;
	/** Number of subscriptions provisioned for the app. */
	provisioned_count?: string | null;
	/** Number of active subscriptions across all event types. */
	subscriptions_count_all?: string | null;
	/** Number of active Direct Message subscriptions. */
	subscriptions_count_direct_messages?: string | null;
};

export type TwitterGetAccountActivitySubscriptionsResponse = {
	data?: TwitterGetAccountActivitySubscriptionsResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetAccountActivitySubscriptionsResponseData = {
	/** App the subscriptions belong to. */
	application_id?: string | null;
	subscriptions?: Array<TwitterGetAccountActivitySubscriptionsResponseDataSubscriptions> | null;
	/** Webhook receiving the subscription events. */
	webhook_id?: string | null;
	/** URL the webhook delivers events to. */
	webhook_url?: string | null;
};

export type TwitterGetAccountActivitySubscriptionsResponseDataSubscriptions = {
	/** Subscribed user. */
	user_id?: string | null;
};

export type TwitterGetActivitySubscriptionsResponse = {
	data?: Array<TwitterGetActivitySubscriptionsResponseData> | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetActivitySubscriptionsResponseData = {
	/** Subscription creation time. */
	created_at?: string | null;
	/** Activity event type in dot notation. */
	event_type?: string | null;
	/** Subscription expiration time. */
	expires_at?: string | null;
	filter?: TwitterGetActivitySubscriptionsResponseDataFilter | null;
	/** Unique identifier of the subscription. */
	subscription_id?: string | null;
	/** Optional caller-defined tag. */
	tag?: string | null;
	/** Subscription last-update time. */
	updated_at?: string | null;
	/** Webhook receiving the subscription events. */
	webhook_id?: string | null;
};

export type TwitterGetActivitySubscriptionsResponseDataFilter = {
	/** Optional direction filter for directional events. Not present for mute.* or block.* events. */
	direction?: string | null;
	/** Optional keyword filter. */
	keyword?: string | null;
	/** Event-specific string predicates applied to the subscription. */
	qualifiers?: Record<string, TwitterJsonValue> | null;
	/** User the subscription is scoped to. */
	user_id?: string | null;
};

export type TwitterGetAmplifyProgramPostsResponse = {
	data?: Array<TwitterGetAmplifyProgramPostsResponseData> | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetAmplifyProgramPostsResponseData = {
	/** When the post was published into the program (ISO 8601). */
	added_at?: string | null;
	/** Identifier of the post. */
	post_id?: string | null;
	/** When promotion of the post ends (ISO 8601), when one was set. */
	promotion_ends_at?: string | null;
};

export type TwitterGetAmplifyProgramResponse = {
	data?: TwitterGetAmplifyProgramResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetAmplifyProgramResponseData = {
	/** Advertiser account ids sponsoring the program. */
	advertiser_ids?: Array<string> | null;
	/** Identifier of the program. */
	id?: string | null;
	/** Display name of the program. */
	name?: string | null;
	/** User ids of the publishers enrolled in the program. */
	publisher_ids?: Array<string> | null;
	/** Lifecycle state of the program. Only `active` programs accept posts. */
	state?: string | null;
};

export type TwitterGetAmplifyProgramsResponse = {
	data?: Array<TwitterGetAmplifyProgramsResponseData> | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetAmplifyProgramsResponseData = {
	/** Advertiser account ids sponsoring the program. */
	advertiser_ids?: Array<string> | null;
	/** Identifier of the program. */
	id?: string | null;
	/** Display name of the program. */
	name?: string | null;
	/** User ids of the publishers enrolled in the program. */
	publisher_ids?: Array<string> | null;
	/** Lifecycle state of the program. Only `active` programs accept posts. */
	state?: string | null;
};

export type TwitterGetBotsResponse = {
	data?: Array<TwitterUser> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		max_bots?: number | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetBroadcastChatResponse = {
	data?: Array<TwitterBroadcastChatMessage> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetBroadcastResponse = {
	data?: TwitterBroadcast | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetCallResponse = {
	data?: TwitterCall | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
};

export type TwitterGetChatConversationEventsResponse = {
	data?: Array<TwitterChatMessageEvent> | null;
	errors?: Array<TwitterProblem> | null;
	meta?: {
		conversation_key_events?: Array<string> | null;
		has_more?: boolean | null;
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetChatConversationPinnedMessagesResponse = {
	data?: Array<TwitterChatPinnedMessage> | null;
	errors?: Array<TwitterProblem> | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetChatConversationResponse = {
	data?: TwitterChatConversation | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
};

export type TwitterGetChatConversationsResponse = {
	data?: Array<TwitterChatConversation> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		has_message_requests?: boolean | null;
		has_more?: boolean | null;
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetChatGroupAdminRequestsResponse = {
	data?: Array<TwitterUser> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
		total_count?: number | null;
	} | null;
};

export type TwitterGetChatGroupInviteResponse = {
	data?: TwitterChatGroupInvite | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetChatMessageRequestResponse = {
	data?: TwitterChatMessageRequestDetail | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetChatMessageRequestsResponse = {
	data?: Array<TwitterChatMessageRequest> | null;
	errors?: Array<TwitterProblem> | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
		total_count?: number | null;
	} | null;
};

export type TwitterGetChatModeratorsResponse = {
	data?: Array<TwitterUser> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetChatMutedUsersResponse = {
	data?: Array<TwitterBroadcastChatMute> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetChatSettingsResponse = {
	data?: TwitterChatSettings | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetCommunitiesByIdResponse = {
	data?: TwitterCommunity | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetComplianceJobsByIdResponse = {
	data?: TwitterComplianceJob | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetComplianceJobsResponse = {
	data?: Array<TwitterComplianceJob> | null;
	errors?: Array<TwitterProblem> | null;
	meta?: {
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetConnectionHistoryResponse = {
	data?: Array<TwitterConnection> | null;
	errors?: Array<TwitterProblem> | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetDeveloperAccountResponse = {
	data?: TwitterGetDeveloperAccountResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetDeveloperAccountResponseData = {
	/** Unique identifier of the developer account. */
	account_id?: string | null;
	/** Creation time of the account (ISO 8601). */
	created_at?: string | null;
	/** Display name of the developer account. */
	name?: string | null;
};

export type TwitterGetDirectMessagesEventsByConversationIdResponse = {
	data?: Array<TwitterDmEvent> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetDirectMessagesEventsByIdResponse = {
	data?: TwitterDmEvent | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
};

export type TwitterGetDirectMessagesEventsByParticipantIdResponse = {
	data?: Array<TwitterDmEvent> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetDirectMessagesEventsResponse = {
	data?: Array<TwitterDmEvent> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetListsByIdResponse = {
	data?: TwitterList | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
};

export type TwitterGetListsFollowersResponse = {
	data?: Array<TwitterUser> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetListsMembersResponse = {
	data?: Array<TwitterUser> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetListsPostsResponse = {
	data?: Array<TwitterPost> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetMediaAnalyticsResponse = {
	data?: Array<TwitterMediaAnalytics> | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetMediaByMediaKeyResponse = {
	data?: TwitterMedia | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetMediaByMediaKeysResponse = {
	data?: Array<TwitterMedia> | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetMediaLibraryCategoriesResponse = {
	data?: TwitterGetMediaLibraryCategoriesResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetMediaLibraryCategoriesResponseData = {
	/** Advertiser categories that can be blocked. */
	advertiser_categories?: Array<TwitterGetMediaLibraryCategoriesResponseDataAdvertiserCategories> | null;
	/** Video categories a library item can be assigned. */
	video_categories?: Array<TwitterGetMediaLibraryCategoriesResponseDataVideoCategories> | null;
};

export type TwitterGetMediaLibraryCategoriesResponseDataAdvertiserCategories = {
	/** Human readable name, localized to `lang` when a translation exists. */
	description?: string | null;
	/** Identifier used in `monetization.video_category_ids` / `monetization.blocked_advertiser_category_ids`. */
	id?: number | null;
};

export type TwitterGetMediaLibraryCategoriesResponseDataVideoCategories = {
	/** Human readable name, localized to `lang` when a translation exists. */
	description?: string | null;
	/** Identifier used in `monetization.video_category_ids` / `monetization.blocked_advertiser_category_ids`. */
	id?: number | null;
};

export type TwitterGetMediaUploadStatusResponse = {
	data?: TwitterGetMediaUploadStatusResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetMediaUploadStatusResponseData = {
	/** Seconds until the upload session expires. */
	expires_after_secs?: number | null;
	/** Unique identifier of the media. */
	id?: string | null;
	image?: TwitterGetMediaUploadStatusResponseDataImage | null;
	/** The media key for the uploaded media. */
	media_key?: string | null;
	processing_info?: TwitterGetMediaUploadStatusResponseDataProcessingInfo | null;
	/** Total size of the media in bytes. */
	size?: number | null;
	video?: TwitterGetMediaUploadStatusResponseDataVideo | null;
};

export type TwitterGetMediaUploadStatusResponseDataImage = {
	/** Height in pixels. */
	h?: number | null;
	/** MIME type of the uploaded image. */
	image_type?: string | null;
	/** Width in pixels. */
	w?: number | null;
};

export type TwitterGetMediaUploadStatusResponseDataProcessingInfo = {
	/** Seconds to wait before polling status again. */
	check_after_secs?: number | null;
	/** Processing completion percentage. */
	progress_percent?: number | null;
	/** Processing state (pending, in_progress, failed, succeeded). */
	state?: string | null;
};

export type TwitterGetMediaUploadStatusResponseDataVideo = {
	/** MIME type of the processed video. */
	video_type?: string | null;
};

export type TwitterGetNewsResponse = {
	data?: TwitterNews | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetPostDraftsResponse = {
	data?: Array<TwitterGetPostDraftsResponseData> | null;
	errors?: Array<TwitterProblem> | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetPostDraftsResponseData = {
	/** When the draft was saved (RFC 3339). */
	created_at?: string | null;
	/** Unique identifier of the draft. */
	id?: string | null;
	/** Whether the draft discloses AI-generated media. */
	made_with_ai?: boolean | null;
	/** Media attached to the Post. */
	media?: TwitterGetPostDraftsResponseDataMedia | null;
	/** Whether the draft discloses a paid partnership. */
	paid_partnership?: boolean | null;
	/** The ID of the Post this Post quotes. */
	quote_tweet_id?: string | null;
	/** Present when the draft is a reply. */
	reply?: TwitterGetPostDraftsResponseDataReply | null;
	/** The text of the draft. Empty for a draft that only has media. */
	text?: string | null;
	/** For a draft that is a thread, the Posts after the first one, in order. Each replies to the Post before it. */
	thread?: Array<TwitterGetPostDraftsResponseDataThread> | null;
	/** Parts of the draft that the other fields do not carry. Present only when the draft holds more than is listed. */
	unsupported_content?: Array<string> | null;
	/** When the draft last changed (RFC 3339). */
	updated_at?: string | null;
};

export type TwitterGetPostDraftsResponseDataMedia = {
	/** Media IDs attached to the Post, in order. */
	media_ids?: Array<string> | null;
	/** IDs of the users tagged in any of the media. */
	tagged_user_ids?: Array<string> | null;
};

export type TwitterGetPostDraftsResponseDataReply = {
	/** IDs of the users the reply does not mention. */
	exclude_reply_user_ids?: Array<string> | null;
	/** The ID of the Post the draft replies to. */
	in_reply_to_tweet_id?: string | null;
};

export type TwitterGetPostDraftsResponseDataThread = {
	/** Media attached to the Post. */
	media?: TwitterGetPostDraftsResponseDataThreadMedia | null;
	/** The ID of the Post this Post quotes. */
	quote_tweet_id?: string | null;
	/** The text of the Post. Empty when it only has media. */
	text?: string | null;
};

export type TwitterGetPostDraftsResponseDataThreadMedia = {
	/** Media IDs attached to the Post, in order. */
	media_ids?: Array<string> | null;
	/** IDs of the users tagged in any of the media. */
	tagged_user_ids?: Array<string> | null;
};

export type TwitterGetPostsAnalyticsResponse = {
	data?: Array<TwitterAnalytics> | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetPostsByIdResponse = {
	data?: TwitterPost | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
};

export type TwitterGetPostsByIdsResponse = {
	data?: Array<TwitterPost> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetPostsCountsAllResponse = {
	data?: Array<TwitterGetPostsCountsAllResponseData> | null;
	errors?: Array<TwitterProblem> | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		total_post_count?: number | null;
	} | null;
};

export type TwitterGetPostsCountsAllResponseData = {
	/** End of the count bucket (exclusive), RFC 3339. */
	end?: string | null;
	/** Number of Posts in the bucket. */
	post_count?: number | null;
	/** Start of the count bucket (inclusive), RFC 3339. */
	start?: string | null;
};

export type TwitterGetPostsCountsRecentResponse = {
	data?: Array<TwitterGetPostsCountsRecentResponseData> | null;
	errors?: Array<TwitterProblem> | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		total_post_count?: number | null;
	} | null;
};

export type TwitterGetPostsCountsRecentResponseData = {
	/** End of the count bucket (exclusive), RFC 3339. */
	end?: string | null;
	/** Number of Posts in the bucket. */
	post_count?: number | null;
	/** Start of the count bucket (inclusive), RFC 3339. */
	start?: string | null;
};

export type TwitterGetPostsLikingUsersResponse = {
	data?: Array<TwitterUser> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetPostsQuotedPostsResponse = {
	data?: Array<TwitterPost> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetPostsRepostedByResponse = {
	data?: Array<TwitterUser> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetPostsRepostsResponse = {
	data?: Array<TwitterPost> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetRegionResponse = {
	/** Ingest region. Pass it as `region` when creating a stream source. */
	region?: string | null;
};

export type TwitterGetRuleCountsResponse = {
	data?: TwitterGetRuleCountsResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetRuleCountsResponseData = {
	/** Per-client-app rule counts across the project. */
	all_project_client_apps?: Array<TwitterGetRuleCountsResponseDataAllProjectClientApps> | null;
	/** Maximum number of rules allowed per client application. */
	cap_per_client_app?: string | null;
	/** Maximum number of rules allowed across the project. */
	cap_per_project?: string | null;
	/** The calling client application's own rule count. */
	client_app_rules_count?: TwitterGetRuleCountsResponseDataClientAppRulesCount | null;
	/** Number of rules across every client application in the project. */
	project_rules_count?: string | null;
};

export type TwitterGetRuleCountsResponseDataAllProjectClientApps = {
	/** Unique identifier of the client application. */
	client_app_id?: string | null;
	/** Number of rules configured for the client application. */
	rule_count?: number | null;
};

export type TwitterGetRuleCountsResponseDataClientAppRulesCount = {
	/** Unique identifier of the client application. */
	client_app_id?: string | null;
	/** Number of rules configured for the client application. */
	rule_count?: number | null;
};

export type TwitterGetRulesResponse = {
	data?: Array<TwitterGetRulesResponseData> | null;
	errors?: Array<TwitterProblem> | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetRulesResponseData = {
	/** Unique identifier of the rule. */
	id?: string | null;
	/** Optional caller-defined label for the rule. */
	tag?: string | null;
	/** The rule's filter expression. */
	value?: string | null;
};

export type TwitterGetScheduledBroadcastResponse = {
	data?: TwitterGetScheduledBroadcastResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetScheduledBroadcastResponseData = {
	/** Whether replay is enabled. */
	available_for_replay?: boolean | null;
	/** Alphanumeric broadcast id (path `:id` for get/update/delete/live). */
	broadcast_id?: string | null;
	/** Who can chat (numeric string): `0` default, `1` chat off, `2` everyone, `3` verified accounts, `4` accounts the host follows, `5` the host's subscribers, `6` accounts followed by an account the host follows. */
	chat_option?: string | null;
	/** Optional description. */
	description?: string | null;
	/** Optional locale. */
	locale?: string | null;
	/** When true, coordinator will not auto-publish; call POST .../live when ready. */
	manual_publish?: boolean | null;
	/** Deprecated: always null for new schedules. */
	recurring_schedule_id?: string | null;
	/** Numeric scheduler id. Required in the update request body. */
	scheduled_broadcast_id?: string | null;
	/** Scheduled end, milliseconds since Unix epoch (decimal string). */
	scheduled_end_ms?: string | null;
	/** Scheduled start, milliseconds since Unix epoch (decimal string). */
	scheduled_start_ms?: string | null;
	/** Id of the bound source, as returned by GET /2/sources. Omitted when unknown. */
	source_id?: string | null;
	/** Scheduler state: `Created` or `Scheduled` before start, then `Running`, `Ended`, or `Error`. */
	state?: string | null;
	/** Deprecated: always null for new schedules. */
	telecast_id?: string | null;
	/** Optional pre-live slate media id. */
	thumbnail_media_id?: string | null;
	/** Broadcast title / status text. */
	title?: string | null;
};

export type TwitterGetScheduledCallResponse = {
	data?: TwitterScheduledCall | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
};

export type TwitterGetSourceResponse = {
	data?: TwitterGetSourceResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetSourceResponseData = {
	/** Creation time, milliseconds since Unix epoch (decimal string). */
	created_at_ms?: string | null;
	/** Source id, 19 decimal digits; the `source_id` that POST /2/broadcasts and scheduled broadcasts take. Not a credential: read the stream key with GET /2/sources/:id/stream_key. */
	id?: string | null;
	/** Whether an encoder is currently sending video to the source. */
	is_stream_active?: boolean | null;
	/** Label for the source. */
	name?: string | null;
	/** Region of the ingest location serving the source: `us-east-1` or `us-west-2`. Sources created before October 31, 2026 keep the AWS region they were created in. */
	region?: string | null;
	/** Ingest URL. */
	rtmp_url?: string | null;
	/** RTMPS ingest URL (port 443). Configure your encoder with this URL and the source's stream key. */
	rtmps_url?: string | null;
};

export type TwitterGetSourceStreamKeyResponse = {
	data?: TwitterGetSourceStreamKeyResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetSourceStreamKeyResponseData = {
	/** Source id. */
	id?: string | null;
	/** Stream key. A credential: anyone with it can stream to the source. */
	stream_key?: string | null;
};

export type TwitterGetSpacesBuyersResponse = {
	data?: Array<TwitterUser> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetSpacesByCreatorIdsResponse = {
	data?: Array<TwitterSpace> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetSpacesByIdResponse = {
	data?: TwitterSpace | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
};

export type TwitterGetSpacesByIdsResponse = {
	data?: Array<TwitterSpace> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
};

export type TwitterGetSpacesPostsResponse = {
	data?: Array<TwitterPost> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetTrendsByWoeidResponse = {
	data?: Array<TwitterTrend> | null;
	errors?: Array<TwitterProblem> | null;
	meta?: {
		location?: Record<string, TwitterJsonValue> | null;
	} | null;
};

export type TwitterGetTrendsLocationsResponse = {
	data?: Array<TwitterTrendLocation> | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetTrendsPersonalizedTrendsResponse = {
	data?: Array<TwitterPersonalizedTrend> | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetUsageCreditsResponse = {
	data?: TwitterGetUsageCreditsResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetUsageCreditsResponseData = {
	/** USD remaining across unexpired free grants. */
	free_balance?: number | null;
	/** Unexpired free grants, soonest expiry first. */
	free_grants?: Array<TwitterGetUsageCreditsResponseDataFreeGrants> | null;
	/** Purchased (prepaid) USD balance. May be negative when paid usage has overdrawn this bucket. */
	prepaid_balance?: number | null;
	/** Spendable USD remaining, clamped at 0.00: total_balance = max(0, prepaid_balance + free_balance). */
	total_balance?: number | null;
};

export type TwitterGetUsageCreditsResponseDataFreeGrants = {
	/** USD remaining in this free grant. */
	amount?: number | null;
	/** When this grant expires (RFC 3339). Omitted if the grant never expires or the expiry is unknown. */
	expires_at?: string | null;
};

export type TwitterGetUsageResponse = {
	data?: TwitterUsage | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetUserBroadcastResponse = {
	data?: TwitterGetUserBroadcastResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetUserBroadcastResponseData = {
	broadcast?: TwitterGetUserBroadcastResponseDataBroadcast | null;
};

export type TwitterGetUserBroadcastResponseDataBroadcast = {
	/** Whether a replay is available. */
	available_for_replay?: boolean | null;
	/** Broadcast id. */
	broadcast_id?: string | null;
	/** Who can chat: 0 default, 1 chat off, 2 everyone, 3 verified accounts, 4 accounts the host follows, 5 the host's subscribers, 6 accounts followed by an account the host follows. */
	chat_option?: number | null;
	/** Creation time, milliseconds since Unix epoch (decimal string). */
	created_at_ms?: string | null;
	/** End time, milliseconds since Unix epoch (decimal string). */
	end_ms?: string | null;
	/** Video height in pixels. */
	height?: number | null;
	/** Broadcast id; equal to `broadcast_id`. */
	id?: string | null;
	/** Thumbnail URL. */
	image_url?: string | null;
	/** Medium thumbnail URL. */
	image_url_medium?: string | null;
	/** Small thumbnail URL. */
	image_url_small?: string | null;
	/** Whether the broadcast is high latency. */
	is_high_latency?: boolean | null;
	/** Broadcast language. */
	language?: string | null;
	/** Numeric media id from `media_key`. */
	media_id?: string | null;
	/** Media key of the broadcast's video. */
	media_key?: string | null;
	/** Scheduled end time, milliseconds since Unix epoch (decimal string). */
	scheduled_end_ms?: string | null;
	/** Scheduled start time, milliseconds since Unix epoch (decimal string). */
	scheduled_start_ms?: string | null;
	/** Start time, milliseconds since Unix epoch (decimal string). */
	start_ms?: string | null;
	/** `NOT_STARTED`, `RUNNING`, `TIMED_OUT`, `ENDED`, `PRE_PUBLISHED` or `CANCELED`. */
	state?: string | null;
	/** Broadcast title. */
	status?: string | null;
	/** Total viewers (decimal string). */
	total_watched?: string | null;
	/** Current viewers (decimal string). */
	total_watching?: string | null;
	/** Id of the Post announcing the broadcast. */
	tweet_id?: string | null;
	/** Owner's user id. */
	twitter_user_id?: string | null;
	/** Last update time, milliseconds since Unix epoch (decimal string). */
	updated_at_ms?: string | null;
	/** Video width in pixels. */
	width?: number | null;
};

export type TwitterGetUserSourceResponse = {
	data?: TwitterGetUserSourceResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetUserSourceResponseData = {
	source?: TwitterGetUserSourceResponseDataSource | null;
};

export type TwitterGetUserSourceResponseDataSource = {
	/** Where a source created before the move to on-prem was created, e.g. `{"value": 2, "name": "MediaStudio", "original_name": "MEDIA_STUDIO"}`; omitted for on-prem sources. */
	creation_origin?: TwitterGetUserSourceResponseDataSourceCreationOrigin | null;
	/** Creation time, ms since Unix epoch. */
	creation_time?: number | null;
	/** Source id; also the RTMP stream key. */
	id?: string | null;
	/** Whether the source streams 360° video. */
	is360?: boolean | null;
	/** Whether an encoder is currently sending video to the source. */
	is_stream_active?: boolean | null;
	/** Label for the source. */
	name?: string | null;
	/** Owner's numeric user id. Exceeds the exact integer range of many JSON parsers. Returned as a decimal string. */
	owner_id?: string | null;
	/** Ingest region as an AWS region name, e.g. `us-east-1` or `us-west-2`. Accepted as `region` when creating a source. */
	rtmp_region?: string | null;
	/** Stream key; equal to `id`. */
	rtmp_stream_key?: string | null;
	/** RTMP ingest URL. */
	rtmp_url?: string | null;
	/** RTMPS ingest URL (port 443). */
	rtmps_url?: string | null;
	/** Video service of a source created before the move to on-prem, e.g. `{"value": 0, "name": "Vidman", "original_name": "VIDMAN"}`; omitted for on-prem sources. */
	video_service?: TwitterGetUserSourceResponseDataSourceVideoService | null;
};

export type TwitterGetUserSourceResponseDataSourceCreationOrigin = {
	/** Name, e.g. `PublicApi`. */
	name?: string | null;
	/** Upper-case name, e.g. `PUBLIC_API`. */
	original_name?: string | null;
	/** Numeric value. */
	value?: number | null;
};

export type TwitterGetUserSourceResponseDataSourceVideoService = {
	/** Name, e.g. `PublicApi`. */
	name?: string | null;
	/** Upper-case name, e.g. `PUBLIC_API`. */
	original_name?: string | null;
	/** Numeric value. */
	value?: number | null;
};

export type TwitterGetUsersAffiliatesResponse = {
	data?: Array<TwitterUser> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetUsersBlockingResponse = {
	data?: Array<TwitterUser> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetUsersBookmarkFoldersResponse = {
	data?: Array<TwitterGetUsersBookmarkFoldersResponseData> | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetUsersBookmarkFoldersResponseData = {
	/** Unique identifier of the bookmark folder. */
	id?: string | null;
	/** Display name of the bookmark folder. */
	name?: string | null;
};

export type TwitterGetUsersBookmarksByFolderIdResponse = {
	/** The Posts in this bookmark folder, by ID. */
	data?: Array<{
		id?: TwitterPostId | null;
	}> | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetUsersBookmarksResponse = {
	data?: Array<TwitterPost> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetUsersByIdResponse = {
	data?: TwitterUser | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
};

export type TwitterGetUsersByIdsResponse = {
	data?: Array<TwitterUser> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
};

export type TwitterGetUsersByUsernameResponse = {
	data?: TwitterUser | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
};

export type TwitterGetUsersByUsernamesResponse = {
	data?: Array<TwitterUser> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
};

export type TwitterGetUsersFollowedListsResponse = {
	data?: Array<TwitterList> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetUsersFollowersResponse = {
	data?: Array<TwitterUser> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetUsersFollowingResponse = {
	data?: Array<TwitterUser> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetUsersLikedPostsResponse = {
	data?: Array<TwitterPost> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetUsersListMembershipsResponse = {
	data?: Array<TwitterList> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetUsersMeFollowersResponse = {
	data?: Array<TwitterUser> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetUsersMeFollowingResponse = {
	data?: Array<TwitterUser> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetUsersMeResponse = {
	data?: TwitterUser | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
};

export type TwitterGetUsersMentionsResponse = {
	data?: Array<TwitterPost> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Most recent ID in the data array. */
		newest_id?: string | null;
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Oldest ID in the data array. */
		oldest_id?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetUsersMutingResponse = {
	data?: Array<TwitterUser> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetUsersOwnedListsResponse = {
	data?: Array<TwitterList> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetUsersPinnedListsResponse = {
	data?: Array<TwitterList> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetUsersPostsResponse = {
	data?: Array<TwitterPost> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Most recent ID in the data array. */
		newest_id?: string | null;
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Oldest ID in the data array. */
		oldest_id?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetUsersPublicKeyResponse = {
	data?: Array<TwitterPublicKey> | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetUsersPublicKeysResponse = {
	data?: Array<TwitterPublicKey> | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetUsersRepostsOfMeResponse = {
	data?: Array<TwitterPost> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetUsersTimelineResponse = {
	data?: Array<TwitterPost> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Most recent ID in the data array. */
		newest_id?: string | null;
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Oldest ID in the data array. */
		oldest_id?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetWebhooksResponse = {
	data?: Array<TwitterWebhookConfig> | null;
	errors?: Array<TwitterProblem> | null;
	meta?: {
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterGetWebhooksStreamLinksResponse = {
	data?: Array<TwitterGetWebhooksStreamLinksResponseData> | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGetWebhooksStreamLinksResponseData = {
	/** The application ID */
	application_id?: string | null;
	/** The user ID */
	business_user_id?: string | null;
	/** The datetime the webhook was linked to the stream */
	created_at?: string | null;
	/** Requested fields to be rendered */
	fields?: Array<string> | null;
	/** The stream ID associated with the FilteredStream instance */
	instance_id?: string | null;
	/** The unique identifier for the webhook */
	webhook_id?: string | null;
};

export type TwitterGoLiveScheduledBroadcastResponse = {
	data?: TwitterGoLiveScheduledBroadcastResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterGoLiveScheduledBroadcastResponseData = {
	/** Whether replay is enabled. */
	available_for_replay?: boolean | null;
	/** Alphanumeric broadcast id (path `:id` for get/update/delete/live). */
	broadcast_id?: string | null;
	/** Who can chat (numeric string): `0` default, `1` chat off, `2` everyone, `3` verified accounts, `4` accounts the host follows, `5` the host's subscribers, `6` accounts followed by an account the host follows. */
	chat_option?: string | null;
	/** Optional description. */
	description?: string | null;
	/** Optional locale. */
	locale?: string | null;
	/** When true, coordinator will not auto-publish; call POST .../live when ready. */
	manual_publish?: boolean | null;
	/** Deprecated: always null for new schedules. */
	recurring_schedule_id?: string | null;
	/** Numeric scheduler id. Required in the update request body. */
	scheduled_broadcast_id?: string | null;
	/** Scheduled end, milliseconds since Unix epoch (decimal string). */
	scheduled_end_ms?: string | null;
	/** Scheduled start, milliseconds since Unix epoch (decimal string). */
	scheduled_start_ms?: string | null;
	/** Id of the bound source, as returned by GET /2/sources. Omitted when unknown. */
	source_id?: string | null;
	/** Scheduler state: `Created` or `Scheduled` before start, then `Running`, `Ended`, or `Error`. */
	state?: string | null;
	/** Deprecated: always null for new schedules. */
	telecast_id?: string | null;
	/** Optional pre-live slate media id. */
	thumbnail_media_id?: string | null;
	/** Broadcast title / status text. */
	title?: string | null;
};

export type TwitterHidePostsReplyResponse = {
	data?: TwitterHidePostsReplyResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterHidePostsReplyResponseData = {
	/** Whether the reply is hidden. */
	hidden?: boolean | null;
};

export type TwitterInitializeChatGroupResponse = {
	data?: TwitterInitializeChatGroupResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterInitializeChatGroupResponseData = {
	/** Unique ID for the new group conversation. */
	conversation_id?: string | null;
};

export type TwitterInitializeMediaUploadResponse = {
	data?: TwitterInitializeMediaUploadResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterInitializeMediaUploadResponseData = {
	/** Seconds until the upload session expires. */
	expires_after_secs?: number | null;
	/** Unique identifier of the upload session. */
	id?: string | null;
	/** The media key for the uploaded media. */
	media_key?: string | null;
};

export type TwitterInternalErrorProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterInvalidRequestProblem = {
	detail?: string | null;
	parameter?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
	value?: string | null;
};

export type TwitterInvalidRuleProblem = {
	detail?: string | null;
	details?: Array<string> | null;
	title?: string | null;
	type?: string | null;
	value?: string | null;
};

export type TwitterJoinCallResponse = {
	data?: TwitterJoinCallResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterJoinCallResponseData = {
	/** immediate, or requires_approval when the host must admit the session. */
	admission?: string | null;
	/** The call. */
	call?: TwitterJoinCallResponseDataCall | null;
	/** When media_token expires (RFC 3339). */
	expires_at?: string | null;
	/** Bearer token for media_url; single use, short-lived. */
	media_token?: string | null;
	/** websocket. */
	media_type?: string | null;
	/** Where to open the media WebSocket. */
	media_url?: string | null;
	/** Media session id. */
	session_id?: string | null;
};

export type TwitterJoinCallResponseDataCall = {
	/** XChat conversation the call belongs to, if any. */
	conversation_id?: string | null;
	/** Creation time (RFC 3339). */
	created_at?: string | null;
	/** X user id of the call's host. */
	host_id?: string | null;
	/** Unique identifier of the call; also its join secret. */
	id?: string | null;
	/** Who may join: open (anyone with the link), closed (the host admits people), or trusted (the host's Verified Organization). */
	join_policy?: string | null;
	/** Link people open to join the call on X. */
	join_url?: string | null;
	/** People in the call right now. */
	participant_count?: number | null;
	/** Title of the call. */
	title?: string | null;
	/** Whether the authenticated user may join without asking the host. */
	viewer_may_join?: boolean | null;
};

export type TwitterLeaveCallResponse = {
	data?: TwitterLeaveCallResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterLeaveCallResponseData = {
	/** Whether the user left the call. */
	left?: boolean | null;
};

export type TwitterLikePostResponse = {
	data?: TwitterLikePostResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterLikePostResponseData = {
	/** Whether the User likes the Post. */
	liked?: boolean | null;
};

export type TwitterList = {
	created_at?: string | null;
	description?: string | null;
	follower_count?: TwitterListFollowerCount | null;
	id?: string | null;
	member_count?: TwitterListMemberCount | null;
	name?: string | null;
	owner_id?: string | null;
	private?: boolean | null;
};

export type TwitterListBroadcastsResponse = {
	data?: Array<TwitterBroadcast> | null;
	errors?: Array<TwitterProblem> | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

/** The number of users who follow this List. */
export type TwitterListFollowerCount = number;

export type TwitterListLiveCategoriesResponse = {
	data?: Array<TwitterListLiveCategoriesResponseData> | null;
	errors?: Array<TwitterProblem> | null;
	meta?: {
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterListLiveCategoriesResponseData = {
	/** Category id, e.g. `gaming`. Permanent. Pass it as `live_category_id` on POST /2/broadcasts. */
	id?: string | null;
	/** Display name, e.g. `Gaming`. Can change. */
	name?: string | null;
};

/** The number of members in this List. */
export type TwitterListMemberCount = number;

export type TwitterListScheduledBroadcastsResponse = {
	data?: Array<TwitterListScheduledBroadcastsResponseData> | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterListScheduledBroadcastsResponseData = {
	/** Whether replay is enabled. */
	available_for_replay?: boolean | null;
	/** Alphanumeric broadcast id (path `:id` for get/update/delete/live). */
	broadcast_id?: string | null;
	/** Who can chat (numeric string): `0` default, `1` chat off, `2` everyone, `3` verified accounts, `4` accounts the host follows, `5` the host's subscribers, `6` accounts followed by an account the host follows. */
	chat_option?: string | null;
	/** Optional description. */
	description?: string | null;
	/** Optional locale. */
	locale?: string | null;
	/** When true, coordinator will not auto-publish; call POST .../live when ready. */
	manual_publish?: boolean | null;
	/** Deprecated: always null for new schedules. */
	recurring_schedule_id?: string | null;
	/** Numeric scheduler id. Required in the update request body. */
	scheduled_broadcast_id?: string | null;
	/** Scheduled end, milliseconds since Unix epoch (decimal string). */
	scheduled_end_ms?: string | null;
	/** Scheduled start, milliseconds since Unix epoch (decimal string). */
	scheduled_start_ms?: string | null;
	/** Id of the bound source, as returned by GET /2/sources. Omitted when unknown. */
	source_id?: string | null;
	/** Scheduler state: `Created` or `Scheduled` before start, then `Running`, `Ended`, or `Error`. */
	state?: string | null;
	/** Deprecated: always null for new schedules. */
	telecast_id?: string | null;
	/** Optional pre-live slate media id. */
	thumbnail_media_id?: string | null;
	/** Broadcast title / status text. */
	title?: string | null;
};

export type TwitterListScheduledCallsResponse = {
	data?: Array<TwitterScheduledCall> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterListSourcesResponse = {
	data?: Array<TwitterListSourcesResponseData> | null;
	errors?: Array<TwitterProblem> | null;
	meta?: {
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterListSourcesResponseData = {
	/** Creation time, milliseconds since Unix epoch (decimal string). */
	created_at_ms?: string | null;
	/** Source id, 19 decimal digits; the `source_id` that POST /2/broadcasts and scheduled broadcasts take. Not a credential: read the stream key with GET /2/sources/:id/stream_key. */
	id?: string | null;
	/** Whether an encoder is currently sending video to the source. */
	is_stream_active?: boolean | null;
	/** Label for the source. */
	name?: string | null;
	/** Region of the ingest location serving the source: `us-east-1` or `us-west-2`. Sources created before October 31, 2026 keep the AWS region they were created in. */
	region?: string | null;
	/** Ingest URL. */
	rtmp_url?: string | null;
	/** RTMPS ingest URL (port 443). Configure your encoder with this URL and the source's stream key. */
	rtmps_url?: string | null;
};

export type TwitterListUserBroadcastsResponse = {
	data?: TwitterListUserBroadcastsResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterListUserBroadcastsResponseData = {
	broadcasts?: Array<TwitterListUserBroadcastsResponseDataBroadcasts> | null;
	next_token?: TwitterListUserBroadcastsResponseDataNextToken | null;
};

export type TwitterListUserBroadcastsResponseDataBroadcasts = {
	/** Whether a replay is available. */
	available_for_replay?: boolean | null;
	/** Broadcast id. */
	broadcast_id?: string | null;
	/** Who can chat: 0 default, 1 chat off, 2 everyone, 3 verified accounts, 4 accounts the host follows, 5 the host's subscribers, 6 accounts followed by an account the host follows. */
	chat_option?: number | null;
	/** Creation time, milliseconds since Unix epoch (decimal string). */
	created_at_ms?: string | null;
	/** End time, milliseconds since Unix epoch (decimal string). */
	end_ms?: string | null;
	/** Video height in pixels. */
	height?: number | null;
	/** Broadcast id; equal to `broadcast_id`. */
	id?: string | null;
	/** Thumbnail URL. */
	image_url?: string | null;
	/** Medium thumbnail URL. */
	image_url_medium?: string | null;
	/** Small thumbnail URL. */
	image_url_small?: string | null;
	/** Whether the broadcast is high latency. */
	is_high_latency?: boolean | null;
	/** Broadcast language. */
	language?: string | null;
	/** Numeric media id from `media_key`. */
	media_id?: string | null;
	/** Media key of the broadcast's video. */
	media_key?: string | null;
	/** Scheduled end time, milliseconds since Unix epoch (decimal string). */
	scheduled_end_ms?: string | null;
	/** Scheduled start time, milliseconds since Unix epoch (decimal string). */
	scheduled_start_ms?: string | null;
	/** Start time, milliseconds since Unix epoch (decimal string). */
	start_ms?: string | null;
	/** `NOT_STARTED`, `RUNNING`, `TIMED_OUT`, `ENDED`, `PRE_PUBLISHED` or `CANCELED`. */
	state?: string | null;
	/** Broadcast title. */
	status?: string | null;
	/** Total viewers (decimal string). */
	total_watched?: string | null;
	/** Current viewers (decimal string). */
	total_watching?: string | null;
	/** Id of the Post announcing the broadcast. */
	tweet_id?: string | null;
	/** Owner's user id. */
	twitter_user_id?: string | null;
	/** Last update time, milliseconds since Unix epoch (decimal string). */
	updated_at_ms?: string | null;
	/** Video width in pixels. */
	width?: number | null;
};

export type TwitterListUserBroadcastsResponseDataNextToken = {
	/** Pass as `pagination_token` to read the next page. */
	offset?: string | null;
};

export type TwitterListUserSourcesResponse = {
	data?: TwitterListUserSourcesResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterListUserSourcesResponseData = {
	sources?: Array<TwitterListUserSourcesResponseDataSources> | null;
};

export type TwitterListUserSourcesResponseDataSources = {
	/** Where a source created before the move to on-prem was created, e.g. `{"value": 2, "name": "MediaStudio", "original_name": "MEDIA_STUDIO"}`; omitted for on-prem sources. */
	creation_origin?: TwitterListUserSourcesResponseDataSourcesCreationOrigin | null;
	/** Creation time, ms since Unix epoch. */
	creation_time?: number | null;
	/** Source id; also the RTMP stream key. */
	id?: string | null;
	/** Whether the source streams 360° video. */
	is360?: boolean | null;
	/** Whether an encoder is currently sending video to the source. */
	is_stream_active?: boolean | null;
	/** Label for the source. */
	name?: string | null;
	/** Owner's numeric user id. Exceeds the exact integer range of many JSON parsers. Returned as a decimal string. */
	owner_id?: string | null;
	/** Ingest region as an AWS region name, e.g. `us-east-1` or `us-west-2`. Accepted as `region` when creating a source. */
	rtmp_region?: string | null;
	/** Stream key; equal to `id`. */
	rtmp_stream_key?: string | null;
	/** RTMP ingest URL. */
	rtmp_url?: string | null;
	/** RTMPS ingest URL (port 443). */
	rtmps_url?: string | null;
	/** Video service of a source created before the move to on-prem, e.g. `{"value": 0, "name": "Vidman", "original_name": "VIDMAN"}`; omitted for on-prem sources. */
	video_service?: TwitterListUserSourcesResponseDataSourcesVideoService | null;
};

export type TwitterListUserSourcesResponseDataSourcesCreationOrigin = {
	/** Name, e.g. `PublicApi`. */
	name?: string | null;
	/** Upper-case name, e.g. `PUBLIC_API`. */
	original_name?: string | null;
	/** Numeric value. */
	value?: number | null;
};

export type TwitterListUserSourcesResponseDataSourcesVideoService = {
	/** Name, e.g. `PublicApi`. */
	name?: string | null;
	/** Upper-case name, e.g. `PUBLIC_API`. */
	original_name?: string | null;
	/** Numeric value. */
	value?: number | null;
};

export type TwitterMarkChatConversationReadResponse = {
	data?: TwitterMarkChatConversationReadResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterMarkChatConversationReadResponseData = {
	/** Whether the conversation was marked read. */
	success?: boolean | null;
};

export type TwitterMarkChatConversationUnreadResponse = {
	data?: TwitterMarkChatConversationUnreadResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterMarkChatConversationUnreadResponseData = {
	/** Whether the conversation was marked unread. */
	success?: boolean | null;
};

export type TwitterMedia = {
	alt_text?: string | null;
	duration_ms?: number | null;
	height?: number | null;
	media_key?: string | null;
	non_public_metrics?: TwitterMediaNonPublicMetrics | null;
	organic_metrics?: TwitterMediaOrganicMetrics | null;
	preview_image_url?: string | null;
	promoted_metrics?: TwitterMediaPromotedMetrics | null;
	public_metrics?: TwitterMediaPublicMetrics | null;
	revenue?: TwitterMediaRevenue | null;
	type?: string | null;
	url?: string | null;
	variants?: TwitterMediaVariants | null;
	width?: number | null;
};

export type TwitterMediaAnalytics = {
	cta_url_clicks?: number | null;
	cta_watch_clicks?: number | null;
	media_key?: string | null;
	play_from_tap?: number | null;
	playback25?: number | null;
	playback50?: number | null;
	playback75?: number | null;
	playback_complete?: number | null;
	playback_start?: number | null;
	timestamp?: string | null;
	timestamped_metrics?: TwitterMediaAnalyticsTimestampedMetrics | null;
	video_views?: number | null;
	watch_time_ms?: number | null;
};

/** Time-bucketed video metrics for the media, one entry per granularity bucket. */
export type TwitterMediaAnalyticsTimestampedMetrics = Array<{
	/** Video metric counts for this bucket. Counters are integers when the backend value parses as a number, otherwise the original string is preserved. */
	metrics?: {
		/** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
		cta_url_clicks?: (number | string) | null;
		/** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
		cta_watch_clicks?: (number | string) | null;
		/** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
		play_from_tap?: (number | string) | null;
		/** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
		playback25?: (number | string) | null;
		/** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
		playback50?: (number | string) | null;
		/** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
		playback75?: (number | string) | null;
		/** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
		playback_complete?: (number | string) | null;
		/** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
		playback_start?: (number | string) | null;
		/** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
		video_views?: (number | string) | null;
		/** A video metric counter: an integer when the backend value parses as a number, otherwise the original string. */
		watch_time_ms?: (number | string) | null;
	} | null;
	/** Start of the metrics bucket, as an ISO 8601 date-time. */
	timestamp?: string | null;
}>;

/** Nonpublic engagement metrics for the media at the time of the request. */
export type TwitterMediaNonPublicMetrics = {
	/** Number of users who started playback (0% quartile) of this video. */
	playback_0_count?: number | null;
	/** Number of users who completed playback (100% quartile) of this video. */
	playback_100_count?: number | null;
	/** Number of users who watched at least 25% of this video. */
	playback_25_count?: number | null;
	/** Number of users who watched at least 50% of this video. */
	playback_50_count?: number | null;
	/** Number of users who watched at least 75% of this video. */
	playback_75_count?: number | null;
};

/** Lifetime organic engagement metrics for the media at the time of the request. Only available to the user who uploaded the video. */
export type TwitterMediaOrganicMetrics = {
	/** Number of clicks on the video's call-to-action URL. */
	cta_url_click_count?: number | null;
	/** Number of clicks on the video's "watch" call to action. */
	cta_watch_click_count?: number | null;
	/** Number of users who started playback (0% quartile) of this video. */
	playback_0_count?: number | null;
	/** Number of users who completed playback (100% quartile) of this video. */
	playback_100_count?: number | null;
	/** Number of users who watched at least 25% of this video. */
	playback_25_count?: number | null;
	/** Number of users who watched at least 50% of this video. */
	playback_50_count?: number | null;
	/** Number of users who watched at least 75% of this video. */
	playback_75_count?: number | null;
	/** The number of organic views of this video. */
	view_count?: number | null;
	/** Total time this video has been watched, in milliseconds. */
	watch_time_ms?: number | null;
};

/** Promoted nonpublic engagement metrics for the media at the time of the request. */
export type TwitterMediaPromotedMetrics = {
	/** Number of users who started playback (0% quartile) of this video. */
	playback_0_count?: number | null;
	/** Number of users who completed playback (100% quartile) of this video. */
	playback_100_count?: number | null;
	/** Number of users who watched at least 25% of this video. */
	playback_25_count?: number | null;
	/** Number of users who watched at least 50% of this video. */
	playback_50_count?: number | null;
	/** Number of users who watched at least 75% of this video. */
	playback_75_count?: number | null;
	/** The number of promoted views of this video. Null when the backend returns quartile data without a view count. */
	view_count?: number | null;
};

/** Public engagement metrics for the media at the time of the request. */
export type TwitterMediaPublicMetrics = {
	/** The number of times this video has been viewed. */
	view_count?: number | null;
};

/** Lifetime revenue earned by the media. Only available to the user who uploaded the video, and only to apps holding the `media.library.read` scope. */
export type TwitterMediaRevenue = {
	/** Revenue earned by this video, in micro-units (1/1,000,000) of `currency_code`. */
	amount_micros?: number | null;
	/** ISO 4217 code of the currency `amount_micros` is denominated in. */
	currency_code?: string | null;
};

export type TwitterMediaUploadResponse = {
	data?: TwitterMediaUploadResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterMediaUploadResponseData = {
	/** Seconds until the upload session expires. */
	expires_after_secs?: number | null;
	/** Unique identifier of the media. */
	id?: string | null;
	image?: TwitterMediaUploadResponseDataImage | null;
	/** The media key for the uploaded media. */
	media_key?: string | null;
	processing_info?: TwitterMediaUploadResponseDataProcessingInfo | null;
	/** Total size of the media in bytes. */
	size?: number | null;
	video?: TwitterMediaUploadResponseDataVideo | null;
};

export type TwitterMediaUploadResponseDataImage = {
	/** Height in pixels. */
	h?: number | null;
	/** MIME type of the uploaded image. */
	image_type?: string | null;
	/** Width in pixels. */
	w?: number | null;
};

export type TwitterMediaUploadResponseDataProcessingInfo = {
	/** Seconds to wait before polling status again. */
	check_after_secs?: number | null;
	/** Processing completion percentage. */
	progress_percent?: number | null;
	/** Processing state (pending, in_progress, failed, succeeded). */
	state?: string | null;
};

export type TwitterMediaUploadResponseDataVideo = {
	/** MIME type of the processed video. */
	video_type?: string | null;
};

/** Each media object may have multiple display or playback variants, with different resolutions or formats. */
export type TwitterMediaVariants = Array<{
	/** The bit rate of this variant, in bits per second. Absent for playlist variants. */
	bit_rate?: number | null;
	/** The MIME type of this variant, for example "video/mp4" or "application/x-mpegURL". */
	content_type?: string | null;
	/** The URL to this media variant. */
	url?: string | null;
}>;

export type TwitterMessageRequestNotSupportedProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterMuteBroadcastChatUserResponse = {
	data?: TwitterMuteBroadcastChatUserResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterMuteBroadcastChatUserResponseData = {
	/** Whether the user is muted in this broadcast chat. */
	muted?: boolean | null;
};

export type TwitterMuteChatConversationResponse = {
	data?: TwitterMuteChatConversationResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterMuteChatConversationResponseData = {
	/** Whether the conversation is muted for the authenticated user. */
	muted?: boolean | null;
};

export type TwitterMuteChatUserResponse = {
	data?: TwitterMuteChatUserResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterMuteChatUserResponseData = {
	/** Whether the user is muted in this broadcast chat. */
	muted?: boolean | null;
};

export type TwitterMuteUserResponse = {
	data?: TwitterMuteUserResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterMuteUserResponseData = {
	/** Whether the source User is muting the target User. */
	muting?: boolean | null;
};

export type TwitterNews = {
	category?: string | null;
	cluster_posts_results?: TwitterNewsClusterPostsResults | null;
	contexts?: Record<string, TwitterJsonValue> | null;
	disclaimer?: string | null;
	hook?: string | null;
	id?: string | null;
	keywords?: Record<string, TwitterJsonValue> | null;
	name?: string | null;
	summary?: string | null;
	updated_at?: string | null;
};

export type TwitterNewsClusterPostsResults = Array<{
	/** Unique identifier of the Post. */
	post_id?: string | null;
}>;

export type TwitterNotAuthorizedForFieldProblem = {
	detail?: string | null;
	field?: string | null;
	parameter?: string | null;
	resource_id?: string | null;
	resource_type?: string | null;
	section?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
	value?: string | null;
};

export type TwitterNotAuthorizedForResourceProblem = {
	detail?: string | null;
	parameter?: string | null;
	resource_id?: string | null;
	resource_type?: string | null;
	section?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
	value?: string | null;
};

export type TwitterNote = {
	id?: string | null;
	info?: TwitterNoteInfo | null;
	scoring_status?: TwitterNoteScoringStatus | null;
	status?: string | null;
	test_result?: TwitterNoteTestResult | null;
};

/** Details about the Community Note's content, classification and source. */
export type TwitterNoteInfo = {
	/** How the noted Post was classified (snake_case). */
	classification?: string | null;
	/** Reasons the noted Post may be misleading (snake_case). */
	misleading_tags?: Array<string> | null;
	/** Unique identifier of the Post this note is about. */
	post_id?: string | null;
	/** Current rating status of the note. */
	rating_status?: string | null;
	/** The text of the Community Note. */
	text?: string | null;
	/** Whether the note cites trustworthy sources. */
	trustworthy_sources?: boolean | null;
};

/** Per-model scoring breakdown for the Community Note. */
export type TwitterNoteScoringStatus = {
	/** Whether the caller has access to the scoring details. */
	has_access?: boolean | null;
	/** Rating counts broken down per scoring model. */
	rating_counts_per_model?: Array<{
		/** Name of the scoring model. */
		model_name?: string | null;
		/** Per-factor bucket counts for a scoring model. */
		value?: {
			/** Helpfulness counts for one rating factor bucket. */
			negative_factor_bucket_counts?: {
				helpful_count?: number | null;
				helpful_tag_counts?: Array<{
					tag_count?: number | null;
					tag_name?: string | null;
				}> | null;
				not_helpful_count?: number | null;
				not_helpful_tag_counts?: Array<{
					tag_count?: number | null;
					tag_name?: string | null;
				}> | null;
				somewhat_helpful_count?: number | null;
			} | null;
			/** Helpfulness counts for one rating factor bucket. */
			neutral_factor_bucket_counts?: {
				helpful_count?: number | null;
				helpful_tag_counts?: Array<{
					tag_count?: number | null;
					tag_name?: string | null;
				}> | null;
				not_helpful_count?: number | null;
				not_helpful_tag_counts?: Array<{
					tag_count?: number | null;
					tag_name?: string | null;
				}> | null;
				somewhat_helpful_count?: number | null;
			} | null;
			/** Helpfulness counts for one rating factor bucket. */
			positive_factor_bucket_counts?: {
				helpful_count?: number | null;
				helpful_tag_counts?: Array<{
					tag_count?: number | null;
					tag_name?: string | null;
				}> | null;
				not_helpful_count?: number | null;
				not_helpful_tag_counts?: Array<{
					tag_count?: number | null;
					tag_name?: string | null;
				}> | null;
				somewhat_helpful_count?: number | null;
			} | null;
		} | null;
	}> | null;
};

/** AI evaluation results for the Community Note (returned in test mode). */
export type TwitterNoteTestResult = {
	/** Per-evaluator outcomes for the note. */
	evaluation_outcome?: Array<{
		/** The score bucket the evaluator assigned. */
		evaluator_score_bucket?: string | null;
		/** The type of evaluator that produced this outcome. */
		evaluator_type?: string | null;
	}> | null;
};

export type TwitterPersonalizedTrend = {
	category?: string | null;
	post_count?: string | null;
	trend_name?: string | null;
	trending_since?: string | null;
};

export type TwitterPinListResponse = {
	data?: TwitterPinListResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterPinListResponseData = {
	/** Indicates whether the List is pinned by the authenticated user. */
	pinned?: boolean | null;
};

export type TwitterPlace = {
	contained_within?: TwitterPlaceContainedWithin | null;
	country?: string | null;
	country_code?: string | null;
	full_name?: string | null;
	geo?: TwitterPlaceGeo | null;
	id?: string | null;
	name?: string | null;
	place_type?: string | null;
};

/** A list of unique identifiers of the Places that contain this place. */
export type TwitterPlaceContainedWithin = Array<string>;

/** The geographic location of this place, expressed as a GeoJSON Feature. */
export type TwitterPlaceGeo = {
	/** The bounding box as [southwest_longitude, southwest_latitude, northeast_longitude, northeast_latitude]. */
	bbox?: Array<number> | null;
	/** Additional GeoJSON feature properties. */
	properties?: Record<string, TwitterJsonValue> | null;
	/** The GeoJSON feature type. */
	type?: string | null;
};

export type TwitterPoll = {
	duration_minutes?: number | null;
	end_datetime?: string | null;
	id?: string | null;
	options?: TwitterPollOptions | null;
	voting_status?: string | null;
};

/** The list of options (choices) available in this poll. */
export type TwitterPollOptions = Array<{
	/** The text label of this poll option. */
	label?: string | null;
	/** The 1-based position of this option within the poll. */
	position?: number | null;
	/** The number of votes this option has received. */
	votes?: number | null;
}>;

export type TwitterPost = {
	article?: Record<string, TwitterJsonValue> | null;
	/** Metadata about the long-form Article attached to this Post, if any. */
	article_title?: Record<string, TwitterJsonValue> | null;
	attachments?: TwitterPostAttachments | null;
	/** Unique identifier of the author of this Post. */
	author_id?: string | null;
	card_uri?: string | null;
	/** The unique identifier of the Community this Post belongs to, if any. */
	community_id?: string | null;
	context_annotations?: TwitterPostContextAnnotations | null;
	/** The ID of the conversation this Post belongs to (matches the root Post's ID). */
	conversation_id?: string | null;
	/** Creation time of the Post. */
	created_at?: string | null;
	display_text_range?: TwitterPostDisplayTextRange | null;
	edit_controls?: TwitterPostEditControls | null;
	/** A list of Post IDs in this Post's edit history chain. */
	edit_history_post_ids?: Array<string> | null;
	entities?: TwitterPostEntities | null;
	geo?: TwitterPostGeo | null;
	/** Unique identifier of this Post. */
	id?: string | null;
	/** Unique identifier of the User this Post is replying to. */
	in_reply_to_user_id?: string | null;
	/** Language of the Post, if detected by X. Returned as a BCP47 language tag. */
	lang?: string | null;
	matched_media_notes?: TwitterPostMatchedMediaNotes | null;
	media_metadata?: TwitterPostMediaMetadata | null;
	/** Nonpublic engagement metrics for the Post at the time of the request. */
	non_public_metrics?: Record<string, TwitterJsonValue> | null;
	note_post?: TwitterPostNotePost | null;
	note_request_suggestions?: TwitterPostNoteRequestSuggestions | null;
	/** Organic nonpublic engagement metrics for the Post at the time of the request. */
	organic_metrics?: Record<string, TwitterJsonValue> | null;
	/** Indicates if this Post is a paid partnership, i.e. it has been disclosed by the author as containing paid promotion. */
	paid_partnership?: boolean | null;
	/** Indicates if this Post contains URLs marked as sensitive, for example content suitable for mature audiences. */
	possibly_sensitive?: boolean | null;
	/** Promoted nonpublic engagement metrics for the Post at the time of the request. */
	promoted_metrics?: Record<string, TwitterJsonValue> | null;
	public_metrics?: TwitterPostPublicMetrics | null;
	referenced_posts?: TwitterPostReferencedPosts | null;
	/** Shows who can reply to this Post. */
	reply_settings?: string | null;
	scopes?: TwitterPostScopes | null;
	/** The name of the app the user posted from. This is deprecated. */
	source?: string | null;
	suggested_source_links?: TwitterPostSuggestedSourceLinks | null;
	suggested_source_links_with_counts?: TwitterPostSuggestedSourceLinksWithCounts | null;
	/** The content of the Post. */
	text?: string | null;
	username?: string | null;
	withheld?: TwitterPostWithheld | null;
};

/** Specifies the type of attachments (if any) present in this Post. */
export type TwitterPostAttachments = {
	/** Media keys of media attached to this Post. */
	media_keys?: Array<string> | null;
	/** IDs of the source Posts the attached media originated from. */
	media_source_tweet_id?: Array<string> | null;
	/** IDs of polls attached to this Post. */
	poll_ids?: Array<string> | null;
};

/** Annotations inferred about the Post (domain and entity context). */
export type TwitterPostContextAnnotations = Array<{
	/** The domain (broad category) this annotation belongs to. */
	domain?: {
		description?: string | null;
		id?: string | null;
		name?: string | null;
	} | null;
	/** The specific entity recognized within the domain. */
	entity?: {
		description?: string | null;
		id?: string | null;
		name?: string | null;
	} | null;
}>;

/** The inclusive start and exclusive end indices of the displayable content of the Post. */
export type TwitterPostDisplayTextRange = Array<number>;

/** Indicates how much longer (if at all) this Post can be edited. */
export type TwitterPostEditControls = {
	/** The time until which this Post can be edited. */
	editable_until?: string | null;
	/** Number of edits still allowed for this Post. */
	edits_remaining?: number | null;
	/** Indicates whether this Post is eligible to be edited. */
	is_edit_eligible?: boolean | null;
};

/** A list of metadata entities (hashtags, mentions, URLs) found in the Post text. */
export type TwitterPostEntities = {
	cashtags?: Array<{
		/** End index in the text (exclusive). */
		end?: number | null;
		/** Start index in the text (inclusive). */
		start?: number | null;
		tag?: string | null;
	}> | null;
	hashtags?: Array<{
		/** End index in the text (exclusive). */
		end?: number | null;
		/** Start index in the text (inclusive). */
		start?: number | null;
		tag?: string | null;
	}> | null;
	mentions?: Array<{
		end?: number | null;
		id?: string | null;
		start?: number | null;
		username?: string | null;
	}> | null;
	urls?: Array<{
		/** Description of the linked page, when available. */
		description?: string | null;
		/** The URL as displayed in the Post text. */
		display_url?: string | null;
		end?: number | null;
		/** The fully resolved URL. */
		expanded_url?: string | null;
		images?: Array<{
			height?: number | null;
			url?: string | null;
			width?: number | null;
		}> | null;
		media_key?: string | null;
		start?: number | null;
		/** HTTP status from resolving the URL. */
		status?: number | null;
		/** Title of the linked page, when available. */
		title?: string | null;
		/** The final destination after following redirects. */
		unwound_url?: string | null;
		/** The t.co shortened URL. */
		url?: string | null;
	}> | null;
};

/** The location tagged on the Post, if the user provided one. */
export type TwitterPostGeo = {
	/** A GeoJSON Point geometry. */
	coordinates?: {
		/** [longitude, latitude]. */
		coordinates?: Array<number> | null;
		/** The GeoJSON geometry type. */
		type?: string | null;
	} | null;
	/** The unique identifier of the tagged place. */
	place_id?: string | null;
};

/** Unique identifier of a Post */
export type TwitterPostId = string;

/** Community-Notes media matches for this Post. */
export type TwitterPostMatchedMediaNotes = Array<{
	/** The status of the media note match. */
	match_status?: string | null;
	/** The matched note's unique identifier. */
	note_id?: string | null;
}>;

/** Metadata for media attached to this Post. */
export type TwitterPostMediaMetadata = Array<{
	/** Alternative text describing the media for accessibility. */
	alt_text?: string | null;
	/** Description of the media. */
	description?: string | null;
	/** The unique identifier of the media. */
	media_key?: string | null;
	/** Title of the media. */
	title?: string | null;
}>;

/** The full content of the Post, including text beyond 280 characters. */
export type TwitterPostNotePost = {
	/** Metadata entities (hashtags, cashtags, mentions, URLs) found in the note Post text. */
	entities?: {
		cashtags?: Array<{
			/** End index in the text (exclusive). */
			end?: number | null;
			/** Start index in the text (inclusive). */
			start?: number | null;
			tag?: string | null;
		}> | null;
		hashtags?: Array<{
			/** End index in the text (exclusive). */
			end?: number | null;
			/** Start index in the text (inclusive). */
			start?: number | null;
			tag?: string | null;
		}> | null;
		mentions?: Array<{
			end?: number | null;
			id?: string | null;
			start?: number | null;
			username?: string | null;
		}> | null;
		urls?: Array<{
			display_url?: string | null;
			end?: number | null;
			expanded_url?: string | null;
			start?: number | null;
			url?: string | null;
		}> | null;
	} | null;
	/** The full note text of the Post. */
	text?: string | null;
};

/** Community-Notes request suggestions for this Post. */
export type TwitterPostNoteRequestSuggestions = Array<{
	/** A suggested source link supporting the note request. */
	source_link?: string | null;
	/** The text of the note request suggestion. */
	suggestion?: string | null;
	/** The unique identifier of the note request suggestion. */
	suggestion_id?: string | null;
}>;

/** Engagement metrics for the Post at the time of the request. */
export type TwitterPostPublicMetrics = {
	/** Number of times this Post has been bookmarked. */
	bookmark_count?: number | null;
	/** Number of times this Post has been viewed. */
	impression_count?: number | null;
	/** Number of likes on this Post. */
	like_count?: number | null;
	/** Number of quote Posts of this Post. */
	quote_count?: number | null;
	/** Number of replies to this Post. */
	reply_count?: number | null;
	/** Number of times this Post has been reposted. */
	repost_count?: number | null;
};

/** A list of Posts this Post refers to. If the Post is a Retweet, Quote or Reply, it includes the referenced Post's type and ID. */
export type TwitterPostReferencedPosts = Array<{
	/** Unique identifier of the referenced Post. */
	id?: string | null;
	/** How this Post references the other Post. */
	type?: string | null;
}>;

/** The scopes for this Post. */
export type TwitterPostScopes = {
	/** Indicates whether visibility of this Post is limited to the author's followers. */
	followers?: boolean | null;
};

/** URLs suggested as sources for this Post. */
export type TwitterPostSuggestedSourceLinks = Array<string>;

/** Suggested source URLs for this Post, each with the number of times it was suggested. */
export type TwitterPostSuggestedSourceLinksWithCounts = Array<{
	/** Number of times this source link was suggested. */
	count?: number | null;
	/** The suggested source URL. */
	url?: string | null;
}>;

/** Withholding details for withheld content. */
export type TwitterPostWithheld = {
	/** Indicates whether this content is withheld due to a copyright claim. */
	copyright?: boolean | null;
	/** Uppercase ISO 3166-1 alpha-2 country codes where this content is withheld. */
	country_codes?: Array<string> | null;
	/** Whether the withholding applies to a Post or a User. */
	scope?: string | null;
};

export type TwitterProblem =
	| TwitterResourceNotFoundProblem
	| TwitterInvalidRequestProblem
	| TwitterNotAuthorizedForResourceProblem
	| TwitterNotAuthorizedForFieldProblem
	| TwitterFieldUnauthorizedProblem
	| TwitterFieldHydrationFailureProblem
	| TwitterResourceUnavailableProblem
	| TwitterDisallowedResourceProblem
	| TwitterRecipientNotMessageableProblem
	| TwitterInternalErrorProblem
	| TwitterChatPermissionsUnavailableProblem
	| TwitterEncryptionRequiredProblem
	| TwitterMessageRequestNotSupportedProblem
	| TwitterRecipientXchatSetupRequiredProblem
	| TwitterUnencryptedSendNotAllowedProblem
	| TwitterXchatSetupRequiredProblem
	| TwitterDmBadAttachmentProblem
	| TwitterDmBadCtaProblem
	| TwitterDmBadCustomProfileProblem
	| TwitterDmBadMediaProblem
	| TwitterDmBadQuickReplyProblem
	| TwitterDmBadUrlProblem
	| TwitterDmConversationNameTooLongProblem
	| TwitterDmConversationNotFoundProblem
	| TwitterDmDuplicateProblem
	| TwitterDmInactiveDeviceProblem
	| TwitterDmNotDeliveredProblem
	| TwitterDmNotFoundProblem
	| TwitterDmNotOwnerProblem
	| TwitterDmParticipantNotAddedProblem
	| TwitterDmParticipantNotFoundProblem
	| TwitterDmParticipantRestrictedProblem
	| TwitterDmParticipantUnavailableProblem
	| TwitterDmRateLimitedProblem
	| TwitterDmRecipientBlocksSenderProblem
	| TwitterDmRecipientCannotReceiveProblem
	| TwitterDmRecipientEncryptedUnavailableProblem
	| TwitterDmRecipientNotAcceptingProblem
	| TwitterDmRecipientNotFoundProblem
	| TwitterDmRecipientRestrictsGroupsProblem
	| TwitterDmRecipientUnavailableProblem
	| TwitterDmRequestInProgressProblem
	| TwitterDmSafetyLimitedProblem
	| TwitterDmSafetyRejectedProblem
	| TwitterDmSenderBlocksRecipientProblem
	| TwitterDmSenderDeclinedDmsProblem
	| TwitterDmSenderDmsClosedProblem
	| TwitterDmSenderEncryptedUnavailableProblem
	| TwitterDmSenderNotInConversationProblem
	| TwitterDmSenderNotPermittedProblem
	| TwitterDmSenderNotVerifiedProblem
	| TwitterDmSenderPhoneRequiredProblem
	| TwitterDmSenderReadOnlyProblem
	| TwitterDmSenderUnavailableProblem
	| TwitterDmTextEmptyProblem
	| TwitterDmTextTooLongProblem
	| TwitterDmTooFewParticipantsProblem
	| TwitterDmTooManyParticipantsProblem
	| TwitterDmUnsupportedMessageProblem
	| TwitterDuplicateRuleProblem
	| TwitterInvalidRuleProblem;

export type TwitterPublicKey = {
	identity_public_key_signature?: string | null;
	juicebox_config?: Record<string, TwitterJsonValue> | null;
	public_key?: string | null;
	public_key_version?: string | null;
	signing_public_key?: string | null;
	/** ID of the user the key belongs to. Returned by Get Public Keys for Multiple Users. */
	user_id?: string | null;
};

export type TwitterRecipientNotMessageableProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterRecipientXchatSetupRequiredProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterRejectChatGroupAdminRequestResponse = {
	data?: TwitterRejectChatGroupAdminRequestResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterRejectChatGroupAdminRequestResponseData = {
	/** Whether the admin request was rejected. */
	rejected?: boolean | null;
};

export type TwitterRejectChatGroupJoinRequestsResponse = {
	data?: TwitterRejectChatGroupJoinRequestsResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterRejectChatGroupJoinRequestsResponseData = {
	/** Whether the join requests were rejected. */
	rejected?: boolean | null;
};

export type TwitterRemoveChatGroupAdminsResponse = {
	data?: TwitterRemoveChatGroupAdminsResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterRemoveChatGroupAdminsResponseData = {
	/** Whether the admins were removed. */
	removed?: boolean | null;
};

export type TwitterRemoveChatGroupMembersResponse = {
	data?: TwitterRemoveChatGroupMembersResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterRemoveChatGroupMembersResponseData = {
	/** Whether the members were removed. */
	removed?: boolean | null;
};

export type TwitterRemoveChatModeratorResponse = {
	data?: TwitterRemoveChatModeratorResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterRemoveChatModeratorResponseData = {
	/** The user IDs currently appointed as chat moderators. */
	moderator_user_ids?: Array<string> | null;
};

export type TwitterRemoveListsMemberByUserIdResponse = {
	data?: TwitterRemoveListsMemberByUserIdResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterRemoveListsMemberByUserIdResponseData = {
	/** Indicates whether the user is a member of the List. */
	is_member?: boolean | null;
};

export type TwitterRemoveMediaFromLibraryResponse = {
	data?: TwitterRemoveMediaFromLibraryResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterRemoveMediaFromLibraryResponseData = {
	/** Whether the library item was removed. */
	deleted?: boolean | null;
};

export type TwitterRepostPostResponse = {
	data?: TwitterRepostPostResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterRepostPostResponseData = {
	/** The ID of the reposted Post. */
	rest_id?: string | null;
	/** Indicates whether the user reposted the Post. */
	retweeted?: boolean | null;
};

export type TwitterResourceNotFoundProblem = {
	detail?: string | null;
	parameter?: string | null;
	resource_id?: string | null;
	resource_type?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
	value?: string | null;
};

export type TwitterResourceUnavailableProblem = {
	detail?: string | null;
	resource_id?: string | null;
	resource_type?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterRespondToScheduledCallResponse = {
	data?: TwitterRespondToScheduledCallResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterRespondToScheduledCallResponseData = {
	/** The answer now on the invitation. */
	response?: string | null;
};

export type TwitterRevokeBotTokenResponse = {
	data?: TwitterRevokeBotTokenResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterRevokeBotTokenResponseData = {
	/** Whether the bot's token was revoked. */
	revoked?: boolean | null;
};

export type TwitterRotateBotTokenResponse = {
	data?: TwitterRotateBotTokenResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterRotateBotTokenResponseData = {
	/** Unique identifier of the bot's User account. */
	id?: string | null;
	/** The bot's display name. May be absent for an org-only bot. */
	name?: string | null;
	/** Scopes granted to the new bearer token. */
	scopes?: Array<string> | null;
	/** The bot's new bearer token. Returned exactly once; store it securely. Every previously issued token for this bot is invalidated. */
	token?: string | null;
	/** Expiry of the new bearer token, in epoch milliseconds. */
	token_expires_at_ms?: number | null;
	/** The bot's X handle (screen name). May be absent for an org-only bot. */
	username?: string | null;
};

export type TwitterScheduleCallResponse = {
	data?: TwitterScheduleCallResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterScheduleCallResponseData = {
	/** Where the call lives: x (X Calls), or outlook for a Microsoft Outlook calendar the user linked to X, whose calls are changed there. */
	calendar?: string | null;
	/** The X call people join; also its join secret. */
	call_id?: string | null;
	/** What the call is about. */
	description?: string | null;
	/** End of this occurrence (RFC 3339). */
	end_time?: string | null;
	/** Unique identifier of the scheduled call: what PUT, DELETE and rsvp take. Calls on linked calendars have none. */
	id?: string | null;
	/** Everyone invited, except the organizer. Not set for linked calendars. */
	invitees?: Array<TwitterScheduleCallResponseDataInvitees> | null;
	/** Link people open to join the call on X. */
	join_url?: string | null;
	/** For a recurring call, this occurrence's original start (RFC 3339): pass it as occurrence_start_time to change, cancel or answer just this occurrence. */
	occurrence_start_time?: string | null;
	/** X user id of the call's organizer. */
	organizer_id?: string | null;
	/** RFC 5545 RRULE the call repeats by, such as FREQ=WEEKLY;BYDAY=MO. */
	recurrence?: string | null;
	/** Start of this occurrence (RFC 3339). */
	start_time?: string | null;
	/** scheduled, or cancelled for a cancelled occurrence. */
	status?: string | null;
	/** IANA time zone the recurrence follows. */
	time_zone?: string | null;
	/** Title of the call. */
	title?: string | null;
};

export type TwitterScheduleCallResponseDataInvitees = {
	/** X user id of the invitee. */
	id?: string | null;
	/** accepted, declined, tentative, or none for no answer yet. */
	response?: string | null;
};

export type TwitterScheduledCall = {
	/** Where the call lives: x (X Calls), or outlook for a Microsoft Outlook calendar the user linked to X, whose calls are changed there. */
	calendar?: string | null;
	/** The X call people join; also its join secret. */
	call_id?: string | null;
	/** What the call is about. */
	description?: string | null;
	/** End of this occurrence (RFC 3339). */
	end_time?: string | null;
	/** Unique identifier of the scheduled call: what PUT, DELETE and rsvp take. Calls on linked calendars have none. */
	id?: string | null;
	invitees?: TwitterScheduledCallInvitees | null;
	/** Link people open to join the call on X. */
	join_url?: string | null;
	/** For a recurring call, this occurrence's original start (RFC 3339): pass it as occurrence_start_time to change, cancel or answer just this occurrence. */
	occurrence_start_time?: string | null;
	/** X user id of the call's organizer. */
	organizer_id?: string | null;
	/** RFC 5545 RRULE the call repeats by, such as FREQ=WEEKLY;BYDAY=MO. */
	recurrence?: string | null;
	/** Start of this occurrence (RFC 3339). */
	start_time?: string | null;
	/** scheduled, or cancelled for a cancelled occurrence. */
	status?: string | null;
	/** IANA time zone the recurrence follows. */
	time_zone?: string | null;
	/** Title of the call. */
	title?: string | null;
};

/** Everyone invited, except the organizer. Not set for linked calendars. */
export type TwitterScheduledCallInvitees = Array<{
	/** X user id of the invitee. */
	id?: string | null;
	/** accepted, declined, tentative, or none for no answer yet. */
	response?: string | null;
}>;

export type TwitterSearchCommunitiesResponse = {
	data?: Array<TwitterCommunity> | null;
	errors?: Array<TwitterProblem> | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
	} | null;
};

export type TwitterSearchCommunityNotesWrittenResponse = {
	data?: Array<TwitterNote> | null;
	errors?: Array<TwitterProblem> | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterSearchEligiblePostsResponse = {
	data?: Array<TwitterPost> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterSearchNewsResponse = {
	data?: Array<TwitterNews> | null;
	errors?: Array<TwitterProblem> | null;
	meta?: {
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterSearchPostsAllResponse = {
	data?: Array<TwitterPost> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Most recent ID in the data array. */
		newest_id?: string | null;
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Oldest ID in the data array. */
		oldest_id?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterSearchPostsRecentResponse = {
	data?: Array<TwitterPost> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Most recent ID in the data array. */
		newest_id?: string | null;
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Oldest ID in the data array. */
		oldest_id?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterSearchSpacesResponse = {
	data?: Array<TwitterSpace> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Number of items in the data array. */
		result_count?: number | null;
	} | null;
};

export type TwitterSearchUsersResponse = {
	data?: Array<TwitterUser> | null;
	errors?: Array<TwitterProblem> | null;
	includes?: TwitterExpansions | null;
	meta?: {
		/** Pagination token for the next page of results. */
		next_token?: string | null;
		/** Pagination token for the previous page of results. */
		previous_token?: string | null;
	} | null;
};

export type TwitterSendBroadcastChatResponse = {
	data?: TwitterSendBroadcastChatResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterSendBroadcastChatResponseData = {
	/** Whether the chat message was sent. */
	success?: boolean | null;
	/** Server timestamp of the message, in nanoseconds. */
	timestamp?: string | null;
};

export type TwitterSendChatMessageResponse = {
	data?: TwitterSendChatMessageResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterSendChatMessageResponseData = {
	/** Base64-encoded Thrift message event for the sent message. */
	encoded_message_event?: string | null;
};

export type TwitterSendChatTypingIndicatorResponse = {
	data?: TwitterSendChatTypingIndicatorResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterSendChatTypingIndicatorResponseData = {
	/** Whether the typing indicator was sent. */
	success?: boolean | null;
};

export type TwitterSpace = {
	created_at?: string | null;
	creator_id?: string | null;
	ended_at?: string | null;
	host_ids?: TwitterSpaceHostIds | null;
	id?: string | null;
	invited_user_ids?: TwitterSpaceInvitedUserIds | null;
	is_ticketed?: boolean | null;
	lang?: string | null;
	participant_count?: number | null;
	scheduled_start?: string | null;
	speaker_ids?: TwitterSpaceSpeakerIds | null;
	started_at?: string | null;
	state?: string | null;
	subscriber_count?: number | null;
	title?: string | null;
	topic_ids?: TwitterSpaceTopicIds | null;
	updated_at?: string | null;
};

/** A list of unique identifiers of the Users who host this Space. */
export type TwitterSpaceHostIds = Array<string>;

/** A list of unique identifiers of the Users invited to this Space. */
export type TwitterSpaceInvitedUserIds = Array<string>;

/** A list of unique identifiers of the Users who are speakers in this Space. */
export type TwitterSpaceSpeakerIds = Array<string>;

/** A list of unique identifiers of the Topics associated with this Space. */
export type TwitterSpaceTopicIds = Array<string>;

export type TwitterTopic = {
	description?: string | null;
	id?: string | null;
	name?: string | null;
};

export type TwitterTrend = {
	trend_name?: string | null;
	tweet_count?: number | null;
};

export type TwitterTrendLocation = {
	/** The country the location is in. Omitted for a location that is not in one country, such as Worldwide. */
	country?: string | null;
	/** The two-letter code of the location's country, such as `US`. Omitted when `country` is. */
	country_code?: string | null;
	/** The location's name. */
	name?: string | null;
	/** The WOEID of the location that contains this one, such as a town's country. Omitted for a location with no parent. */
	parent_id?: number | null;
	/** The kind of place: `town`, `country`, or `supername` (Worldwide). Omitted for a location whose kind is not known. */
	place_type?: string | null;
	/** The location's WOEID. Pass it to `GET /2/trends/by/woeid/{woeid}`. */
	woeid?: number | null;
};

export type TwitterUnarchiveChatConversationResponse = {
	data?: TwitterUnarchiveChatConversationResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUnarchiveChatConversationResponseData = {
	/** Whether the conversation is archived for the authenticated user. */
	archived?: boolean | null;
};

export type TwitterUnblockUsersDmsResponse = {
	data?: TwitterUnblockUsersDmsResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUnblockUsersDmsResponseData = {
	/** Indicates whether the target user is DM-blocked. */
	blocked?: boolean | null;
};

export type TwitterUnencryptedSendNotAllowedProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterUnfollowListResponse = {
	data?: TwitterUnfollowListResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUnfollowListResponseData = {
	/** Indicates whether the user is following the List. */
	following?: boolean | null;
};

export type TwitterUnfollowUserResponse = {
	data?: TwitterUnfollowUserResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUnfollowUserResponseData = {
	/** Whether the user is followed. */
	following?: boolean | null;
};

export type TwitterUnlikePostResponse = {
	data?: TwitterUnlikePostResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUnlikePostResponseData = {
	/** Whether the Post is liked. */
	liked?: boolean | null;
};

export type TwitterUnmuteBroadcastChatUserResponse = {
	data?: TwitterUnmuteBroadcastChatUserResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUnmuteBroadcastChatUserResponseData = {
	/** Whether the user is muted in this broadcast chat. */
	muted?: boolean | null;
};

export type TwitterUnmuteChatConversationResponse = {
	data?: TwitterUnmuteChatConversationResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUnmuteChatConversationResponseData = {
	/** Whether the conversation is muted for the authenticated user. */
	muted?: boolean | null;
};

export type TwitterUnmuteChatUserResponse = {
	data?: TwitterUnmuteChatUserResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUnmuteChatUserResponseData = {
	/** Whether the user is muted in this broadcast chat. */
	muted?: boolean | null;
};

export type TwitterUnmuteUserResponse = {
	data?: TwitterUnmuteUserResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUnmuteUserResponseData = {
	/** Whether the user is muted. */
	muting?: boolean | null;
};

export type TwitterUnpinListResponse = {
	data?: TwitterUnpinListResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUnpinListResponseData = {
	/** Indicates whether the List is pinned by the authenticated user. */
	pinned?: boolean | null;
};

export type TwitterUnrepostPostResponse = {
	data?: TwitterUnrepostPostResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUnrepostPostResponseData = {
	/** Whether the Post is reposted. */
	retweeted?: boolean | null;
};

export type TwitterUpdateActivitySubscriptionResponse = {
	data?: TwitterUpdateActivitySubscriptionResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUpdateActivitySubscriptionResponseData = {
	subscription?: TwitterUpdateActivitySubscriptionResponseDataSubscription | null;
	/** Total active subscriptions for the instance. */
	total_subscriptions?: number | null;
};

export type TwitterUpdateActivitySubscriptionResponseDataSubscription = {
	/** Subscription creation time. */
	created_at?: string | null;
	/** Activity event type in dot notation. */
	event_type?: string | null;
	/** Subscription expiration time. */
	expires_at?: string | null;
	/** Subscription filter. */
	filter?: TwitterUpdateActivitySubscriptionResponseDataSubscriptionFilter | null;
	/** Unique identifier of the subscription. */
	subscription_id?: string | null;
	/** Optional caller-defined tag. */
	tag?: string | null;
	/** Subscription last-update time. */
	updated_at?: string | null;
	/** Webhook receiving the subscription events. */
	webhook_id?: string | null;
};

export type TwitterUpdateActivitySubscriptionResponseDataSubscriptionFilter = {
	/** Optional direction filter for directional events. Not present for mute.* or block.* events. */
	direction?: string | null;
	/** Optional keyword filter. */
	keyword?: string | null;
	/** Event-specific string predicates applied to the subscription. */
	qualifiers?: Record<string, TwitterJsonValue> | null;
	/** User the subscription is scoped to. */
	user_id?: string | null;
};

export type TwitterUpdateBotResponse = {
	data?: TwitterUpdateBotResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUpdateBotResponseData = {
	/** Whether the bot was updated. */
	updated?: boolean | null;
};

export type TwitterUpdateBroadcastResponse = {
	data?: TwitterUpdateBroadcastResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUpdateBroadcastResponseData = {
	/** Broadcast id; the same as `id`. */
	broadcast_id?: string | null;
	/** Who can chat: 0 default, 1 chat off, 2 everyone, 3 verified accounts, 4 accounts the host follows, 5 the host's subscribers, 6 accounts followed by an account the host follows. */
	chat_option?: number | null;
	/** Broadcast id. */
	id?: string | null;
	/** Broadcast language. */
	language?: string | null;
	/** The broadcast's live category. Missing when it has none. */
	live_category_id?: string | null;
	/** Media key of the broadcast. */
	media_key?: string | null;
	/** The broadcast's watch page. */
	share_url?: string | null;
	/** Start time, milliseconds since Unix epoch (decimal string). */
	start_ms?: string | null;
	/** Broadcast state, `RUNNING` once live. */
	state?: string | null;
	/** Broadcast title. */
	title?: string | null;
	/** Id of the Post announcing the broadcast. Missing when the Post hasn't been created yet, was suppressed with `should_not_tweet`, or could not be created. */
	tweet_id?: string | null;
};

export type TwitterUpdateBroadcastStateResponse = {
	data?: TwitterUpdateBroadcastStateResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUpdateBroadcastStateResponseData = {
	/** Broadcast id. */
	id?: string | null;
	/** Always `ENDED`. */
	state?: string | null;
};

export type TwitterUpdateChatConversationMessageTtlResponse = {
	data?: TwitterUpdateChatConversationMessageTtlResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUpdateChatConversationMessageTtlResponseData = {
	/** Whether the message lifetime was set. */
	updated?: boolean | null;
};

export type TwitterUpdateChatConversationScreenCaptureResponse = {
	data?: TwitterUpdateChatConversationScreenCaptureResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUpdateChatConversationScreenCaptureResponseData = {
	/** The screenshot blocking setting, when changed. */
	blocking?: boolean | null;
	/** The screenshot detection setting, when changed. */
	detection?: boolean | null;
};

export type TwitterUpdateChatGroupAdminSettingsResponse = {
	data?: TwitterUpdateChatGroupAdminSettingsResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUpdateChatGroupAdminSettingsResponseData = {
	/** Whether the admin settings were updated. */
	updated?: boolean | null;
};

export type TwitterUpdateChatGroupResponse = {
	data?: TwitterUpdateChatGroupResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUpdateChatGroupResponseData = {
	/** Sequence ID of the key change, when the edit rotated the key. */
	conversation_key_change_sequence_id?: string | null;
	/** Whether the group was updated. */
	updated?: boolean | null;
};

export type TwitterUpdateChatSettingsResponse = {
	data?: TwitterUpdateChatSettingsResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUpdateChatSettingsResponseData = {
	/** Who can send the user messages: `all` (anyone), `verified` (verified accounts only), or `following` (accounts the user follows). A bot may get a 400 for choosing `following` when it doesn't already have it, and an org-only bot for choosing `verified`. */
	allow_dms_from?: string | null;
	/** Whether the user's subscribers can always message them regardless of allow_dms_from. */
	always_allow_dms_from_subscribers?: boolean | null;
	/** Audio and video call settings. */
	av_settings?: TwitterUpdateChatSettingsResponseDataAvSettings | null;
	/** Low-quality message request filter: `enabled` (low-quality requests go to a separate folder) or `disabled` (all requests stay in the main inbox). */
	dm_quality_filter?: string | null;
	/** Read receipts: `all_enabled` (send and receive read receipts) or `all_disabled` (neither). */
	dm_receipt_settings?: string | null;
};

export type TwitterUpdateChatSettingsResponseDataAvSettings = {
	/** Who may place audio or video calls to the user. */
	av_call_permissions?: TwitterUpdateChatSettingsResponseDataAvSettingsAvCallPermissions | null;
	/** Whether audio and video calls are enabled. */
	has_av_calls_enabled?: boolean | null;
	/** Whether enhanced call privacy is enabled. */
	has_enhanced_call_privacy_enabled?: boolean | null;
};

export type TwitterUpdateChatSettingsResponseDataAvSettingsAvCallPermissions = {
	/** Whether the user accepts calls from address-book contacts. */
	accept_calls_from_addressbook?: boolean | null;
	/** Whether the user accepts calls from anyone. */
	accept_calls_from_everyone?: boolean | null;
	/** Whether the user accepts calls from accounts they follow. */
	accept_calls_from_following?: boolean | null;
	/** Whether the user accepts calls from verified accounts. */
	accept_calls_from_verified?: boolean | null;
};

export type TwitterUpdateListsResponse = {
	data?: TwitterUpdateListsResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUpdateListsResponseData = {
	/** Indicates whether the List was updated. */
	updated?: boolean | null;
};

export type TwitterUpdateMediaInLibraryResponse = {
	data?: TwitterUpdateMediaInLibraryResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUpdateMediaInLibraryResponseData = {
	/** Whether the library item was updated. */
	updated?: boolean | null;
};

export type TwitterUpdateRulesResponse = {
	data?: Array<TwitterUpdateRulesResponseData> | null;
	errors?: Array<TwitterProblem> | null;
	meta?: {
		sent?: string | null;
		summary?: Record<string, TwitterJsonValue> | null;
	} | null;
};

export type TwitterUpdateRulesResponseData = {
	/** Unique identifier of the rule. */
	id?: string | null;
	/** Optional caller-defined label for the rule. */
	tag?: string | null;
	/** The rule's filter expression. */
	value?: string | null;
};

export type TwitterUpdateScheduledBroadcastResponse = {
	data?: TwitterUpdateScheduledBroadcastResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUpdateScheduledBroadcastResponseData = {
	/** Whether replay is enabled. */
	available_for_replay?: boolean | null;
	/** Alphanumeric broadcast id (path `:id` for get/update/delete/live). */
	broadcast_id?: string | null;
	/** Who can chat (numeric string): `0` default, `1` chat off, `2` everyone, `3` verified accounts, `4` accounts the host follows, `5` the host's subscribers, `6` accounts followed by an account the host follows. */
	chat_option?: string | null;
	/** Optional description. */
	description?: string | null;
	/** Optional locale. */
	locale?: string | null;
	/** When true, coordinator will not auto-publish; call POST .../live when ready. */
	manual_publish?: boolean | null;
	/** Deprecated: always null for new schedules. */
	recurring_schedule_id?: string | null;
	/** Numeric scheduler id. Required in the update request body. */
	scheduled_broadcast_id?: string | null;
	/** Scheduled end, milliseconds since Unix epoch (decimal string). */
	scheduled_end_ms?: string | null;
	/** Scheduled start, milliseconds since Unix epoch (decimal string). */
	scheduled_start_ms?: string | null;
	/** Id of the bound source, as returned by GET /2/sources. Omitted when unknown. */
	source_id?: string | null;
	/** Scheduler state: `Created` or `Scheduled` before start, then `Running`, `Ended`, or `Error`. */
	state?: string | null;
	/** Deprecated: always null for new schedules. */
	telecast_id?: string | null;
	/** Optional pre-live slate media id. */
	thumbnail_media_id?: string | null;
	/** Broadcast title / status text. */
	title?: string | null;
};

export type TwitterUpdateScheduledCallResponse = {
	data?: TwitterUpdateScheduledCallResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUpdateScheduledCallResponseData = {
	/** Whether the scheduled call was changed. */
	updated?: boolean | null;
};

export type TwitterUpdateSourceResponse = {
	data?: TwitterUpdateSourceResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUpdateSourceResponseData = {
	/** Creation time, milliseconds since Unix epoch (decimal string). */
	created_at_ms?: string | null;
	/** Source id, 19 decimal digits; the `source_id` that POST /2/broadcasts and scheduled broadcasts take. Not a credential: read the stream key with GET /2/sources/:id/stream_key. */
	id?: string | null;
	/** Whether an encoder is currently sending video to the source. */
	is_stream_active?: boolean | null;
	/** Label for the source. */
	name?: string | null;
	/** Region of the ingest location serving the source: `us-east-1` or `us-west-2`. Sources created before October 31, 2026 keep the AWS region they were created in. */
	region?: string | null;
	/** Ingest URL. */
	rtmp_url?: string | null;
	/** RTMPS ingest URL (port 443). Configure your encoder with this URL and the source's stream key. */
	rtmps_url?: string | null;
};

export type TwitterUpdateUserBroadcastStateResponse = {
	data?: TwitterUpdateUserBroadcastStateResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUpdateUserBroadcastStateResponseData = {
	/** The published broadcast, on `PUBLISH`. */
	broadcast?: TwitterUpdateUserBroadcastStateResponseDataBroadcast | null;
	/** `true` once `END` succeeds. */
	success?: boolean | null;
	/** Why the announcing Post failed, on `PUBLISH`. Omitted when the Post went out or `should_not_tweet` was true. */
	tweet_error?: string | null;
};

export type TwitterUpdateUserBroadcastStateResponseDataBroadcast = {
	/** Whether a replay is available. */
	available_for_replay?: boolean | null;
	/** Broadcast id. */
	broadcast_id?: string | null;
	/** Who can chat: 0 default, 1 chat off, 2 everyone, 3 verified accounts, 4 accounts the host follows, 5 the host's subscribers, 6 accounts followed by an account the host follows. */
	chat_option?: number | null;
	/** Creation time, milliseconds since Unix epoch (decimal string). */
	created_at_ms?: string | null;
	/** End time, milliseconds since Unix epoch (decimal string). */
	end_ms?: string | null;
	/** Video height in pixels. */
	height?: number | null;
	/** Broadcast id; equal to `broadcast_id`. */
	id?: string | null;
	/** Thumbnail URL. */
	image_url?: string | null;
	/** Medium thumbnail URL. */
	image_url_medium?: string | null;
	/** Small thumbnail URL. */
	image_url_small?: string | null;
	/** Whether the broadcast is high latency. */
	is_high_latency?: boolean | null;
	/** Broadcast language. */
	language?: string | null;
	/** Numeric media id from `media_key`. */
	media_id?: string | null;
	/** Media key of the broadcast's video. */
	media_key?: string | null;
	/** Scheduled end time, milliseconds since Unix epoch (decimal string). */
	scheduled_end_ms?: string | null;
	/** Scheduled start time, milliseconds since Unix epoch (decimal string). */
	scheduled_start_ms?: string | null;
	/** Start time, milliseconds since Unix epoch (decimal string). */
	start_ms?: string | null;
	/** `NOT_STARTED`, `RUNNING`, `TIMED_OUT`, `ENDED`, `PRE_PUBLISHED` or `CANCELED`. */
	state?: string | null;
	/** Broadcast title. */
	status?: string | null;
	/** Total viewers (decimal string). */
	total_watched?: string | null;
	/** Current viewers (decimal string). */
	total_watching?: string | null;
	/** Id of the Post announcing the broadcast. */
	tweet_id?: string | null;
	/** Owner's user id. */
	twitter_user_id?: string | null;
	/** Last update time, milliseconds since Unix epoch (decimal string). */
	updated_at_ms?: string | null;
	/** Video width in pixels. */
	width?: number | null;
};

export type TwitterUpdateUserSourceResponse = {
	data?: TwitterUpdateUserSourceResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUpdateUserSourceResponseData = {
	source?: TwitterUpdateUserSourceResponseDataSource | null;
};

export type TwitterUpdateUserSourceResponseDataSource = {
	/** Where a source created before the move to on-prem was created, e.g. `{"value": 2, "name": "MediaStudio", "original_name": "MEDIA_STUDIO"}`; omitted for on-prem sources. */
	creation_origin?: TwitterUpdateUserSourceResponseDataSourceCreationOrigin | null;
	/** Creation time, ms since Unix epoch. */
	creation_time?: number | null;
	/** Source id; also the RTMP stream key. */
	id?: string | null;
	/** Whether the source streams 360° video. */
	is360?: boolean | null;
	/** Whether an encoder is currently sending video to the source. */
	is_stream_active?: boolean | null;
	/** Label for the source. */
	name?: string | null;
	/** Owner's numeric user id. Exceeds the exact integer range of many JSON parsers. Returned as a decimal string. */
	owner_id?: string | null;
	/** Ingest region as an AWS region name, e.g. `us-east-1` or `us-west-2`. Accepted as `region` when creating a source. */
	rtmp_region?: string | null;
	/** Stream key; equal to `id`. */
	rtmp_stream_key?: string | null;
	/** RTMP ingest URL. */
	rtmp_url?: string | null;
	/** RTMPS ingest URL (port 443). */
	rtmps_url?: string | null;
	/** Video service of a source created before the move to on-prem, e.g. `{"value": 0, "name": "Vidman", "original_name": "VIDMAN"}`; omitted for on-prem sources. */
	video_service?: TwitterUpdateUserSourceResponseDataSourceVideoService | null;
};

export type TwitterUpdateUserSourceResponseDataSourceCreationOrigin = {
	/** Name, e.g. `PublicApi`. */
	name?: string | null;
	/** Upper-case name, e.g. `PUBLIC_API`. */
	original_name?: string | null;
	/** Numeric value. */
	value?: number | null;
};

export type TwitterUpdateUserSourceResponseDataSourceVideoService = {
	/** Name, e.g. `PublicApi`. */
	name?: string | null;
	/** Upper-case name, e.g. `PUBLIC_API`. */
	original_name?: string | null;
	/** Numeric value. */
	value?: number | null;
};

export type TwitterUploadComplianceJobSubmissionResponse = {
	data?: TwitterComplianceJob | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUsage = {
	cap_reset_day?: number | null;
	daily_client_app_usage?: TwitterUsageDailyClientAppUsage | null;
	daily_project_usage?: TwitterUsageDailyProjectUsage | null;
	project_cap?: string | null;
	project_id?: string | null;
	project_usage?: string | null;
};

/** Per-client-app daily Post usage for the caller's project. */
export type TwitterUsageDailyClientAppUsage = Array<{
	/** Unique identifier of the client app. */
	client_app_id?: string | null;
	/** Daily usage entries for this client app. */
	usage?: Array<{
		/** The day of the usage entry, as an ISO 8601 date-time. */
		date?: string | null;
		/** Number of Posts used on this day. */
		usage?: string | null;
	}> | null;
	/** Number of daily usage entries returned for this client app. */
	usage_result_count?: number | null;
}>;

/** Project-level daily Post usage for the caller's project. */
export type TwitterUsageDailyProjectUsage = {
	/** Unique identifier of the project. */
	project_id?: string | null;
	/** Daily usage entries for the project. */
	usage?: Array<{
		/** The day of the usage entry, as an ISO 8601 date-time. */
		date?: string | null;
		/** Number of Posts used on this day. */
		usage?: string | null;
	}> | null;
};

export type TwitterUser = {
	/** The number of followers who were active on X in the last 24 hours. Returned only for the authenticated user when account analytics is enabled. Omitted for accounts with 50 or fewer followers. An estimate for accounts with at least 20,000 followers. */
	active_follower_count?: number | null;
	affiliation?: TwitterUserAffiliation | null;
	confirmed_email?: string | null;
	connection_status?: TwitterUserConnectionStatus | null;
	/** Creation time of this User. */
	created_at?: string | null;
	/** The text of this User's profile description (also known as bio), if the User provided one. */
	description?: string | null;
	entities?: TwitterUserEntities | null;
	/** Unique identifier of this User. */
	id?: string | null;
	/** Indicates if this User has completed identity verification. */
	is_identity_verified?: boolean | null;
	/** The location specified in the User's profile, if the User provided one. As this is a freeform value, it may not indicate a valid location. */
	location?: string | null;
	/** Unique identifier of this User's most recent Post. */
	most_recent_post_id?: string | null;
	/** The friendly name of this User, as shown on their profile. */
	name?: string | null;
	/** Indicates if this User is an org-only bot, which only members of its developer account can add to group chats. Omitted when it can't be determined for you, so it is never reported as false in that case. A bot can read its own value with its own token. */
	org_only?: boolean | null;
	/** Indicates if this User is a parody account. */
	parody?: boolean | null;
	/** Unique identifier of this User's pinned Post. */
	pinned_post_id?: string | null;
	/** The URL to the profile banner for this User. */
	profile_banner_url?: string | null;
	/** The URL to the profile image for this User. */
	profile_image_url?: string | null;
	/** Indicates if this User has chosen to protect their Posts (in other words, if this User's Posts are private). */
	protected?: boolean | null;
	public_metrics?: TwitterUserPublicMetrics | null;
	/** How you can send a Chat message to this User: encrypted (end-to-end, the default), unencrypted (X Chat can't encrypt your 1:1 chat, so send plaintext `content` instead), or none (you can't message them). */
	receives_your_chat?: string | null;
	/** Indicates if you can send a DM to this User. Omitted when the DM permission can't be determined, so it is never reported as false in that case. */
	receives_your_dm?: boolean | null;
	/** The number of Premium subscribers of this User. */
	subscriber_count?: number | null;
	/** Indicates if this User subscribes to you. */
	subscribes_to_you?: boolean | null;
	subscription?: TwitterUserSubscription | null;
	/** The X Blue subscription type of the user, e.g.: Basic, Premium, PremiumPlus or None. */
	subscription_type?: string | null;
	/** The URL specified in the User's profile. */
	url?: string | null;
	/** The X handle (screen name) of this User. */
	username?: string | null;
	/** Indicates if this User is a verified X User. */
	verified?: boolean | null;
	/** The number of verified followers of this User. */
	verified_followers_count?: number | null;
	/** The X Blue verified type of the user, e.g.: blue, government, business or none. */
	verified_type?: string | null;
	withheld?: TwitterUserWithheld | null;
};

/** Metadata about a user's affiliation. */
export type TwitterUserAffiliation = {
	/** URL of the affiliation badge image shown on the User's profile. */
	badge_url?: string | null;
	/** Description of the affiliation. */
	description?: string | null;
	/** URL associated with the affiliation. */
	url?: string | null;
	/** A list of unique identifiers of the accounts this User is affiliated with. */
	user_id?: Array<string> | null;
};

/** Returns detailed information about the relationship between two users. */
export type TwitterUserConnectionStatus = Array<string>;

/** A list of metadata found in the User's profile description. */
export type TwitterUserEntities = {
	/** Entities found in the User's bio. */
	description?: {
		cashtags?: Array<{
			/** End index in the text (exclusive). */
			end?: number | null;
			/** Start index in the text (inclusive). */
			start?: number | null;
			tag?: string | null;
		}> | null;
		hashtags?: Array<{
			/** End index in the text (exclusive). */
			end?: number | null;
			/** Start index in the text (inclusive). */
			start?: number | null;
			tag?: string | null;
		}> | null;
		mentions?: Array<{
			end?: number | null;
			id?: string | null;
			start?: number | null;
			username?: string | null;
		}> | null;
		urls?: Array<{
			/** Description of the linked page, when available. */
			description?: string | null;
			/** The URL as displayed in the Post text. */
			display_url?: string | null;
			end?: number | null;
			/** The fully resolved URL. */
			expanded_url?: string | null;
			images?: Array<{
				height?: number | null;
				url?: string | null;
				width?: number | null;
			}> | null;
			media_key?: string | null;
			start?: number | null;
			/** HTTP status from resolving the URL. */
			status?: number | null;
			/** Title of the linked page, when available. */
			title?: string | null;
			/** The final destination after following redirects. */
			unwound_url?: string | null;
			/** The t.co shortened URL. */
			url?: string | null;
		}> | null;
	} | null;
	/** Entities for the User's profile website URL. */
	url?: {
		urls?: Array<{
			/** Description of the linked page, when available. */
			description?: string | null;
			/** The URL as displayed in the Post text. */
			display_url?: string | null;
			end?: number | null;
			/** The fully resolved URL. */
			expanded_url?: string | null;
			images?: Array<{
				height?: number | null;
				url?: string | null;
				width?: number | null;
			}> | null;
			media_key?: string | null;
			start?: number | null;
			/** HTTP status from resolving the URL. */
			status?: number | null;
			/** Title of the linked page, when available. */
			title?: string | null;
			/** The final destination after following redirects. */
			unwound_url?: string | null;
			/** The t.co shortened URL. */
			url?: string | null;
		}> | null;
	} | null;
};

/** A list of metrics for this User. */
export type TwitterUserPublicMetrics = {
	/** Number of Users who follow this User. */
	followers_count?: number | null;
	/** Number of Users this User follows. */
	following_count?: number | null;
	/** Number of Posts this User has liked. */
	like_count?: number | null;
	/** Number of Lists that include this User. */
	listed_count?: number | null;
	/** Number of media items posted by this User. */
	media_count?: number | null;
	/** Number of Posts (including Reposts) created by this User. */
	post_count?: number | null;
};

/** The subscription relationship between this User and you. */
export type TwitterUserSubscription = {
	/** Indicates if this User subscribes to you. */
	subscribes_to_you?: boolean | null;
};

/** Withholding details for withheld content. */
export type TwitterUserWithheld = {
	/** A list of countries (as ISO 3166-1 alpha-2 codes) where this content is withheld. */
	country_codes?: Array<string> | null;
	/** The scope of the withholding. Only present, with the value "user", when the entire User is withheld. */
	scope?: string | null;
};

export type TwitterUsersIdBlockResponse = {
	data?: TwitterUsersIdBlockResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUsersIdBlockResponseData = {
	/** Indicates whether the user is blocked by the source user. */
	blocking?: boolean | null;
};

export type TwitterUsersIdUnblockResponse = {
	data?: TwitterUsersIdUnblockResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterUsersIdUnblockResponseData = {
	/** Indicates whether the source User is blocking the target User. */
	blocking?: boolean | null;
};

export type TwitterValidateAccountActivitySubscriptionResponse = {
	data?: TwitterValidateAccountActivitySubscriptionResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterValidateAccountActivitySubscriptionResponseData = {
	/** Whether the user has an active subscription. */
	subscribed?: boolean | null;
};

export type TwitterValidateWebhooksResponse = {
	data?: TwitterValidateWebhooksResponseData | null;
	errors?: Array<TwitterProblem> | null;
};

export type TwitterValidateWebhooksResponseData = {
	/** Indicates whether the CRC validation check was triggered. */
	valid?: boolean | null;
};

export type TwitterWebhookConfig = {
	created_at?: string | null;
	id?: string | null;
	url?: string | null;
	valid?: boolean | null;
};

export type TwitterXchatSetupRequiredProblem = {
	detail?: string | null;
	status?: number | null;
	title?: string | null;
	type?: string | null;
};

export type TwitterOperationInputs = {
	'account.ensure': {
		/** Optional provisioning-credit metadata (an opaque string, e.g. a subscription tier) to claim for the account, attributed to the calling app. Omit to just ensure the account. */
		metadata?: string;
	};
	'account.get': Record<string, never>;
	'accountActivity.subscriptions.count': Record<string, never>;
	'accountActivity.subscriptions.create': {
		webhook_id: TwitterWebhookConfigIdInput;
	};
	'accountActivity.subscriptions.delete': {
		webhook_id: TwitterWebhookConfigIdInput;
		user_id: TwitterUserIdInput;
	};
	'accountActivity.subscriptions.list': {
		webhook_id: TwitterWebhookConfigIdInput;
	};
	'accountActivity.subscriptions.validate': {
		webhook_id: TwitterWebhookConfigIdInput;
	};
	'activity.subscriptions.create': {
		/** Activity event type in dot notation. `chat.conversation_join` is a deprecated alias of `chat.conversation.join`; responses always use the canonical name. */
		event_type:
			| 'profile.update.bio'
			| 'profile.update.profile_picture'
			| 'profile.update.banner_picture'
			| 'profile.update.screenname'
			| 'profile.update.geo'
			| 'profile.update.url'
			| 'profile.update.verified_badge'
			| 'profile.update.affiliate_badge'
			| 'profile.update.handle'
			| 'trends.new'
			| 'news.new'
			| 'follow.follow'
			| 'follow.unfollow'
			| 'subscriptions.subscribe'
			| 'subscriptions.unsubscribe'
			| 'spaces.start'
			| 'spaces.end'
			| 'broadcast.start'
			| 'broadcast.end'
			| 'broadcast.chat'
			| 'broadcast.chat.remove'
			| 'chat.received'
			| 'chat.sent'
			| 'chat.conversation.join'
			| 'chat.conversation_join'
			| 'chat.conversation.member_added'
			| 'chat.conversation.member_removed'
			| 'chat.conversation.admin_added'
			| 'chat.conversation.admin_removed'
			| 'chat.update.group_name'
			| 'chat.update.restrictions'
			| 'dm.sent'
			| 'dm.received'
			| 'dm.indicate_typing'
			| 'dm.read'
			| 'post.create'
			| 'post.delete'
			| 'post.mention.create'
			| 'post.reply.create'
			| 'post.quote.create'
			| 'post.repost.create'
			| 'like.create'
			| 'mute.mute'
			| 'mute.unmute'
			| 'block.block'
			| 'block.unblock';
		/** Optional RFC 3339 expiration time. Re-creating the same subscription refreshes this value; omitting it makes the subscription permanent. */
		expires_at?: string;
		/** Subscription filter. */
		filter: TwitterCreateActivitySubscriptionFilterInput;
		/** Optional caller-defined tag. */
		tag?: string;
		/** Webhook to deliver the subscription events to. */
		webhook_id?: string;
	};
	'activity.subscriptions.delete': {
		subscription_id: string;
	};
	'activity.subscriptions.deleteMany': {
		ids: Array<string>;
	};
	'activity.subscriptions.list': {
		max_results?: number;
		/** A base32hex-encoded pagination token that decodes to 9 bytes. */
		pagination_token?: string;
		/** Only return subscriptions whose filter.user_id matches. */
		user_id?: TwitterUserIdInput;
	};
	'activity.subscriptions.update': {
		subscription_id: string;
		/** Optional caller-defined tag. */
		tag?: string;
		/** Webhook to deliver the subscription events to. */
		webhook_id?: string;
	};
	'articles.createDraft': {
		/** DraftJS content state representing the article body. Special formatting (markdown/code/tables, dividers, LaTeX, emoji, images, embedded posts) uses atomic blocks with entity_ranges pointing into entities. */
		content_state: TwitterArticleCreateDraftContentStateInput;
		/** Optional cover media for the Article. */
		cover_media?: TwitterArticleCreateDraftCoverMediaInput;
		/** The title of the Article. */
		title: string;
	};
	'articles.publish': {
		article_id: string;
	};
	'bots.create': {
		/** The bot's display name; defaults to the handle. */
		display_name?: string;
		/** The bot's handle (X screen name): 5-15 characters, letters, numbers, or underscores. */
		handle: string;
		/** Whether only members of the bot's developer account can add it to group chats. An org-only bot has no public profile and doesn't appear in public search. Everyone in its developer account should be able to message it, so leave its Direct Messages open to everyone rather than premium senders… */
		org_only?: boolean;
		/** Scopes for the bot's bearer token. Broadcast moderation additionally supports broadcast.read and broadcast.write. Defaults to the XChat scope set (dm.read, dm.write, tweet.read, users.read, media.write). */
		scopes?: Array<string>;
	};
	'bots.delete': {
		id: string;
	};
	'bots.list': {
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			'affiliation' | 'most_recent_post_id' | 'pinned_post_id'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
	};
	'bots.token.revoke': {
		id: string;
	};
	'bots.token.rotate': {
		id: string;
		/** Scopes for the new bearer token. Broadcast moderation additionally supports broadcast.read and broadcast.write. Defaults to the XChat scope set (dm.read, dm.write, tweet.read, users.read, media.write). */
		scopes?: Array<string>;
	};
	'bots.update': {
		id: string;
		/** New display name. */
		display_name?: string;
		/** Who may send the bot Direct Messages: everyone, or premium for verified senders only. Premium isn't meant for org-only bots, since everyone in an org-only bot's developer account should be able to message it, verified or not; requesting premium for one may be refused with a 400. The no_one value… */
		dm_permission?: 'everyone' | 'premium' | 'no_one';
		/** New handle (X screen name): 5-15 characters, letters, numbers, or underscores. */
		handle?: string;
	};
	'broadcasts.chat.deleteMessage': {
		id: string;
		message_id: string;
	};
	'broadcasts.chat.list': {
		id: string;
		max_results?: number;
		/** A 64-bit signed integer. */
		pagination_token?: string;
		/** A comma separated list of BroadcastChatMessage fields to display. */
		'broadcast_chat_message.fields'?: Array<
			| 'author_name'
			| 'author_username'
			| 'broadcast_id'
			| 'created_at_ms'
			| 'id'
			| 'relay_source'
			| 'relay_user'
			| 'reply_to'
			| 'text'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<'author_id'>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
	};
	'broadcasts.chat.muteUser': {
		id: string;
		/** The Unix timestamp in milliseconds when the mute expires. Omit this field to mute indefinitely. */
		end_at_ms?: string;
		/** A chat message to remove while muting the user. */
		message_id?: string;
		/** The user to mute. */
		user_id: string;
	};
	'broadcasts.chat.send': {
		id: string;
		/** The platform this message was relayed from, shown as that platform's icon next to the message: `youtube`, `twitch`, `kick`, `facebook`, `rumble`, `tiktok` or `instagram`. Only apps approved for chat relay may set it. */
		relay_source?: string;
		/** The name of the person who wrote this message on the platform it was relayed from, shown next to that platform's icon. Display text only, not an X account. Requires `relay_source`. Links are not allowed. */
		relay_user?: string;
		/** Message id to reply to, returned as timestamp when sent. */
		reply_to?: string;
		/** The chat message text. */
		text: string;
	};
	'broadcasts.chat.unmuteUser': {
		id: string;
		/** A 64-bit signed integer. */
		user_id: string;
	};
	'broadcasts.chatModerators.add': {
		/** The user to appoint as a moderator. */
		user_id: string;
	};
	'broadcasts.chatModerators.list': {
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			'affiliation' | 'most_recent_post_id' | 'pinned_post_id'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
	};
	'broadcasts.chatModerators.remove': {
		/** A 64-bit signed integer. */
		user_id: string;
	};
	'broadcasts.chatMutes.create': {
		/** A broadcast whose host's chats the user is muted in. Required with `message_id`. */
		broadcast_id?: string;
		/** The Unix timestamp in milliseconds when the mute expires. Omit this field to mute indefinitely. */
		end_at_ms?: string;
		/** A chat message in `broadcast_id` to remove while muting the user. */
		message_id?: string;
		/** The user to mute. */
		user_id: string;
	};
	'broadcasts.chatMutes.delete': {
		/** A 64-bit signed integer. */
		user_id: string;
		/** A broadcast whose host's chats the user is unmuted in. */
		broadcast_id?: string;
	};
	'broadcasts.chatMutes.list': {
		max_results?: number;
		pagination_token?: string;
		/** A comma separated list of BroadcastChatMute fields to display. */
		'broadcast_chat_mute.fields'?: Array<'end_at_ms'>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<'user_id'>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
	};
	'broadcasts.create': {
		/** Ids of further sources to go live on together with `source_id`, one per video format, at most 2, each a source's `id` from GET /2/sources. `source_id` comes first; duplicates are ignored. */
		additional_source_ids?: Array<string>;
		/** Who can chat: 0 default, 1 chat off, 2 everyone, 3 verified accounts, 4 accounts the host follows, 5 the host's subscribers, 6 accounts followed by an account the host follows. */
		chat_option?: number;
		/** The live category the host picked, e.g. `gaming`. Ids come from GET /2/broadcasts/categories; an unknown id is a 400. Ignored when the source already has a live broadcast. */
		live_category_id?: string;
		/** Broadcast language, e.g. `en`. */
		locale?: string;
		/** Skip the Post announcing the broadcast. Defaults to false. */
		should_not_tweet?: boolean;
		/** Id of the source to go live on: a source's `id` (19 digits) from GET /2/sources. */
		source_id: string;
		/** Broadcast title. Defaults to the user's display name. */
		title?: string;
	};
	'broadcasts.delete': {
		id: string;
	};
	'broadcasts.end': {
		id: string;
		/** Not allowed with `END`. */
		chat_option?: number;
		/** Not allowed with `END`. */
		locale?: string;
		/** Not allowed with `END`. */
		should_not_tweet?: boolean;
		/** `END`. `PUBLISH` is not supported. */
		state: string;
		/** Not allowed with `END`. */
		title?: string;
	};
	'broadcasts.get': {
		id: string;
		/** A comma separated list of Broadcast fields to display. */
		'broadcast.fields'?: Array<
			| 'available_for_replay'
			| 'broadcast_id'
			| 'chat_option'
			| 'created_at_ms'
			| 'end_ms'
			| 'height'
			| 'id'
			| 'image_url'
			| 'image_url_medium'
			| 'image_url_small'
			| 'is_high_latency'
			| 'language'
			| 'live_category_id'
			| 'media_key'
			| 'scheduled_end_ms'
			| 'scheduled_start_ms'
			| 'share_url'
			| 'source_id'
			| 'start_ms'
			| 'state'
			| 'title'
			| 'total_watched'
			| 'total_watching'
			| 'tweet_id'
			| 'twitter_user_id'
			| 'updated_at_ms'
			| 'width'
		>;
	};
	'broadcasts.list': {
		/** Comma-separated broadcast IDs to retrieve instead of listing broadcasts. */
		ids?: Array<string>;
		max_results?: number;
		pagination_token?: string;
		/** A comma separated list of Broadcast fields to display. */
		'broadcast.fields'?: Array<
			| 'available_for_replay'
			| 'broadcast_id'
			| 'chat_option'
			| 'created_at_ms'
			| 'end_ms'
			| 'height'
			| 'id'
			| 'image_url'
			| 'image_url_medium'
			| 'image_url_small'
			| 'is_high_latency'
			| 'language'
			| 'live_category_id'
			| 'media_key'
			| 'scheduled_end_ms'
			| 'scheduled_start_ms'
			| 'share_url'
			| 'source_id'
			| 'start_ms'
			| 'state'
			| 'title'
			| 'total_watched'
			| 'total_watching'
			| 'tweet_id'
			| 'twitter_user_id'
			| 'updated_at_ms'
			| 'width'
		>;
	};
	'broadcasts.listCategories': Record<string, never>;
	'broadcasts.scheduled.create': {
		/** Enable replay. */
		available_for_replay?: boolean;
		/** Who can chat (numeric string): `0` default, `1` chat off, `2` everyone, `3` verified accounts, `4` accounts the host follows, `5` the host's subscribers, `6` accounts followed by an account the host follows. */
		chat_option?: string;
		/** Description. */
		description?: string;
		/** Lock the broadcast. */
		is_locked?: boolean;
		/** Locale. */
		locale?: string;
		/** If true, do not auto-publish at start; call POST .../live when ready. */
		manual_publish?: boolean;
		/** Deprecated: recurring schedules are being retired and requests that include `recurrence` will be rejected. Create each occurrence as its own scheduled broadcast. */
		recurrence?: TwitterCreateScheduledBroadcastRecurrenceInput;
		/** Optional end time, ms since Unix epoch (decimal string). Omit for an open-ended broadcast. */
		scheduled_end_ms?: string;
		/** Start time, ms since Unix epoch (decimal string). */
		scheduled_start_ms: string;
		/** Source to bind: a source's `id` from GET /2/sources. A stream key is also accepted but deprecated; stream keys stop being accepted when the /2/users/:id/sources and /2/users/:id/broadcasts routes reach end of life on January 1, 2027. */
		source_id: string;
		/** Deprecated: telecast associations are being retired and this field will be ignored. */
		telecast_id?: string;
		/** Pre-live slate media id (numeric string). */
		thumbnail_media_id?: string;
		/** Title / status text. */
		title?: string;
	};
	'broadcasts.scheduled.delete': {
		id: string;
		/** Deprecated: recurring schedules are being retired and `true` will be rejected. */
		roll_forward?: boolean;
	};
	'broadcasts.scheduled.get': {
		id: string;
	};
	'broadcasts.scheduled.goLive': {
		id: string;
	};
	'broadcasts.scheduled.list': {
		max_results?: number;
		oldest_start_time?: string;
		newest_start_time?: string;
		pagination_token?: string;
	};
	'broadcasts.scheduled.update': {
		id: string;
		/** Enable replay. */
		available_for_replay?: boolean;
		/** Who can chat (numeric string): `0` default, `1` chat off, `2` everyone, `3` verified accounts, `4` accounts the host follows, `5` the host's subscribers, `6` accounts followed by an account the host follows. */
		chat_option?: string;
		/** Description. */
		description?: string;
		/** Lock the broadcast. */
		is_locked?: boolean;
		/** Locale. */
		locale?: string;
		/** If true, do not auto-publish at start; call POST .../live when ready. */
		manual_publish?: boolean;
		/** Deprecated: recurring schedules are being retired and `true` will be rejected. */
		roll_forward?: boolean;
		/** Numeric scheduler id from create/list/get. */
		scheduled_broadcast_id: string;
		/** End time, ms since Unix epoch (decimal string). */
		scheduled_end_ms: string;
		/** Start time, ms since Unix epoch (decimal string). */
		scheduled_start_ms: string;
		/** Source to bind: a source's `id` from GET /2/sources. A stream key is also accepted but deprecated; stream keys stop being accepted when the /2/users/:id/sources and /2/users/:id/broadcasts routes reach end of life on January 1, 2027. */
		source_id?: string;
		/** Pre-live slate media id (numeric string). */
		thumbnail_media_id?: string;
		/** Title / status text. */
		title?: string;
	};
	'broadcasts.update': {
		id: string;
		/** Who can chat: 0 default, 1 chat off, 2 everyone, 3 verified accounts, 4 accounts the host follows, 5 the host's subscribers, 6 accounts followed by an account the host follows. */
		chat_option?: number;
		/** New live category, e.g. `gaming`. Ids come from GET /2/broadcasts/categories; an unknown id is a 400. An empty string removes the broadcast's category. */
		live_category_id?: string;
		/** New broadcast title. */
		title?: string;
	};
	'calls.create': {
		/** Start the call without video. */
		audio_only?: boolean;
		/** XChat conversation to start the call in. */
		conversation_id?: string;
		/** open (default): anyone with the link joins; closed: the host admits each person; trusted: members of the host's Verified Organization join, others ask. */
		join_policy?: 'open' | 'closed' | 'trusted';
		/** Title shown to participants. */
		title?: string;
	};
	'calls.get': {
		id: string;
		/** A comma separated list of Call fields to display. */
		'call.fields'?: Array<
			| 'conversation_id'
			| 'created_at'
			| 'id'
			| 'join_policy'
			| 'join_url'
			| 'participant_count'
			| 'title'
			| 'viewer_may_join'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<'host_id'>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
	};
	'calls.join': {
		id: string;
		/** The media session to start. */
		media?: TwitterJoinCallMediaInput;
	};
	'calls.leave': {
		id: string;
	};
	'calls.scheduled.cancel': {
		id: string;
		/** Which occurrences: all (the default without occurrence_start_time), this (the default with it), or this_and_following. */
		scope?: 'all' | 'this' | 'this_and_following';
		/** Start of the occurrence that scope this or this_and_following refers to (RFC 3339). */
		occurrence_start_time?: string;
		/** Whether invitees get an email about it. Defaults to true. */
		notify_invitees?: boolean;
	};
	'calls.scheduled.create': {
		/** What the call is about. */
		description?: string;
		/** How long the call lasts, in minutes. Defaults to 30; at most 31 days. */
		duration_minutes?: number;
		/** X user ids of the people to invite. */
		invitee_ids?: Array<string>;
		/** Whether invitees get an email about the call. Defaults to true. */
		notify_invitees?: boolean;
		/** RFC 5545 RRULE to repeat the call by, such as FREQ=WEEKLY;BYDAY=MO; the RRULE: prefix is optional. */
		recurrence?: string;
		/** When the call starts (RFC 3339); not in the past. */
		start_time: string;
		/** IANA time zone the recurrence follows, such as America/Los_Angeles. */
		time_zone?: string;
		/** Title invitees see. */
		title?: string;
	};
	'calls.scheduled.get': {
		id: string;
		/** A comma separated list of ScheduledCall fields to display. */
		'scheduled_call.fields'?: Array<
			| 'calendar'
			| 'call_id'
			| 'description'
			| 'end_time'
			| 'id'
			| 'join_url'
			| 'occurrence_start_time'
			| 'recurrence'
			| 'start_time'
			| 'status'
			| 'time_zone'
			| 'title'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<'call_id' | 'invitees' | 'organizer_id'>;
		/** A comma separated list of Call fields to display. */
		'call.fields'?: Array<
			| 'conversation_id'
			| 'created_at'
			| 'id'
			| 'join_policy'
			| 'join_url'
			| 'participant_count'
			| 'title'
			| 'viewer_may_join'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
	};
	'calls.scheduled.list': {
		/** Calls still running at this time or starting after it (RFC 3339). Defaults to now. */
		start_time?: string;
		/** Calls starting before this time (RFC 3339). Defaults to 24 hours after start_time. */
		end_time?: string;
		/** The most calls to return. Defaults to 20. */
		max_results?: number;
		/** A comma separated list of ScheduledCall fields to display. */
		'scheduled_call.fields'?: Array<
			| 'calendar'
			| 'call_id'
			| 'description'
			| 'end_time'
			| 'id'
			| 'join_url'
			| 'occurrence_start_time'
			| 'recurrence'
			| 'start_time'
			| 'status'
			| 'time_zone'
			| 'title'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<'call_id' | 'invitees' | 'organizer_id'>;
		/** A comma separated list of Call fields to display. */
		'call.fields'?: Array<
			| 'conversation_id'
			| 'created_at'
			| 'id'
			| 'join_policy'
			| 'join_url'
			| 'participant_count'
			| 'title'
			| 'viewer_may_join'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
	};
	'calls.scheduled.respond': {
		id: string;
		/** Start of the occurrence that scope this or this_and_following refers to (RFC 3339). */
		occurrence_start_time?: string;
		/** The answer to the invitation. */
		response: 'accepted' | 'declined' | 'tentative';
		/** Which occurrences of a recurring call: all (the default without occurrence_start_time), this (the default with it), or this_and_following. */
		scope?: 'all' | 'this' | 'this_and_following';
	};
	'calls.scheduled.update': {
		id: string;
		/** What the call is about. */
		description?: string;
		/** How long the call lasts, in minutes. */
		duration_minutes?: number;
		/** Everyone to invite: replaces the invite list. At most 25 of them may be people not invited yet. */
		invitee_ids?: Array<string>;
		/** Whether invitees get an email about the change. Defaults to true. */
		notify_invitees?: boolean;
		/** Start of the occurrence that scope this or this_and_following refers to (RFC 3339). */
		occurrence_start_time?: string;
		/** RFC 5545 RRULE to repeat the call by, such as FREQ=WEEKLY;BYDAY=MO. */
		recurrence?: string;
		/** Which occurrences of a recurring call: all (the default without occurrence_start_time), this (the default with it), or this_and_following. */
		scope?: 'all' | 'this' | 'this_and_following';
		/** When the call (or the chosen occurrence) starts now (RFC 3339). */
		start_time?: string;
		/** IANA time zone the recurrence follows. */
		time_zone?: string;
		/** Title invitees see. */
		title?: string;
	};
	'chat.conversations.addKeys': {
		id: string;
		/** Signatures for this action, forwarded in the order they are sent. */
		action_signatures?: Array<TwitterAddConversationKeysActionSignaturesInput>;
		/** Base64-encoded key rotation payload for ratchet tree key management. */
		base64_encoded_key_rotation?: string;
		/** Version of the conversation encryption key (typically a timestamp in milliseconds). */
		conversation_key_version: string;
		/** Encrypted conversation keys for each participant. */
		conversation_participant_keys: Array<TwitterAddConversationKeysConversationParticipantKeysInput>;
	};
	'chat.conversations.archive': {
		/** The ID of the conversation: a group ID starting with `g`, the other user's ID for a 1:1 conversation, or both user IDs of a 1:1 conversation joined by a hyphen. */
		id: string;
		/** Signatures for this action, forwarded in the order they are sent. */
		action_signatures?: Array<TwitterArchiveChatConversationActionSignaturesInput>;
	};
	'chat.conversations.delete': {
		/** The ID of the conversation: a group ID starting with `g`, the other user's ID for a 1:1 conversation, or both user IDs of a 1:1 conversation joined by a hyphen. */
		id: string;
		/** Signatures for this action, forwarded in the order they are sent. */
		action_signatures?: Array<TwitterDeleteChatConversationActionSignaturesInput>;
	};
	'chat.conversations.disableMessageTtl': {
		/** The ID of the conversation: a group ID starting with `g`, the other user's ID for a 1:1 conversation, or both user IDs of a 1:1 conversation joined by a hyphen. */
		id: string;
		/** Signatures for this action, forwarded in the order they are sent. */
		action_signatures?: Array<TwitterDeleteChatConversationMessageTtlActionSignaturesInput>;
	};
	'chat.conversations.enableMessageTtl': {
		/** The ID of the conversation: a group ID starting with `g`, the other user's ID for a 1:1 conversation, or both user IDs of a 1:1 conversation joined by a hyphen. */
		id: string;
		/** Signatures for this action, forwarded in the order they are sent. */
		action_signatures?: Array<TwitterUpdateChatConversationMessageTtlActionSignaturesInput>;
		/** How long new messages last, in milliseconds. */
		message_ttl_ms: string;
	};
	'chat.conversations.get': {
		id: string;
		/** A comma separated list of ChatConversation fields to display. */
		'chat_conversation.fields'?: Array<
			| 'admin_settings'
			| 'created_at'
			| 'group_avatar_url'
			| 'group_description'
			| 'group_description_key_version'
			| 'group_name'
			| 'id'
			| 'invite'
			| 'is_archived'
			| 'is_muted'
			| 'last_read_event_id'
			| 'message_ttl_ms'
			| 'newest_event_id'
			| 'pending_member_ids'
			| 'screen_capture_blocking_enabled'
			| 'screen_capture_detection_enabled'
			| 'type'
			| 'unread'
			| 'updated_at'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<'admin_ids' | 'member_ids' | 'participant_ids'>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
	};
	'chat.conversations.list': {
		/** Conversations covered per page (1-1000, default 200). Filtered pages can return fewer. */
		max_results?: number;
		/** meta.next_token from the previous page. Send the same filters with it, or the request fails. */
		pagination_token?: string;
		/** Return only unread conversations. A page can be short; keep paging while has_more. */
		unread_only?: boolean;
		/** Only direct (1:1) or only group conversations. Omit for both. */
		type?: 'direct' | 'group';
		/** true: only archived; false: only not archived. Omit for both. */
		is_archived?: boolean;
		/** true: only muted; false: only not muted. Omit for both. */
		is_muted?: boolean;
		/** Comma-separated numeric user IDs (1-10), all in the chat. Names or @handles: use participant_query. */
		participant_ids?: Array<string>;
		/** Start here to find someone's chat: their @username or a word of their name (1-50 chars). */
		participant_query?: string;
		/** ISO 8601, e.g. 2026-10-16T00:00:00Z. Chats whose latest message is at or after this time. */
		start_time?: string;
		/** ISO 8601, e.g. 2026-10-17T00:00:00Z. Chats whose latest message is before this time. */
		end_time?: string;
		/** A comma separated list of ChatConversation fields to display. */
		'chat_conversation.fields'?: Array<
			| 'admin_settings'
			| 'created_at'
			| 'group_avatar_url'
			| 'group_description'
			| 'group_description_key_version'
			| 'group_name'
			| 'id'
			| 'invite'
			| 'is_archived'
			| 'is_muted'
			| 'last_read_event_id'
			| 'message_ttl_ms'
			| 'newest_event_id'
			| 'pending_member_ids'
			| 'screen_capture_blocking_enabled'
			| 'screen_capture_detection_enabled'
			| 'type'
			| 'unread'
			| 'updated_at'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<'admin_ids' | 'member_ids' | 'participant_ids'>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
	};
	'chat.conversations.listEvents': {
		id: string;
		/** The maximum number of events to return. */
		max_results?: number;
		/** The next_token from a previous response, to fetch the next page. */
		pagination_token?: string;
		/** A comma separated list of ChatMessageEvent fields to display. */
		'chat_message_event.fields'?: Array<
			| 'conversation_id'
			| 'conversation_key_version'
			| 'conversation_token'
			| 'created_at'
			| 'encoded_event'
			| 'id'
			| 'is_trusted'
			| 'message_event_signature'
			| 'previous_id'
			| 'sender_id'
		>;
	};
	'chat.conversations.listPinnedMessages': {
		/** The ID of the conversation: a group ID starting with `g`, the other user's ID for a 1:1 conversation, or both user IDs of a 1:1 conversation joined by a hyphen. */
		id: string;
		/** The next_token from a previous response, to fetch the next page. */
		pagination_token?: string;
		/** A comma separated list of ChatPinnedMessage fields to display. */
		'chat_pinned_message.fields'?: Array<'encoded_event'>;
	};
	'chat.conversations.markRead': {
		id: string;
		/** Signature over the read receipt (a MarkConversationReadEvent). Omit to send it unsigned. */
		action_signatures?: Array<TwitterMarkChatConversationReadActionSignaturesInput>;
	};
	'chat.conversations.markUnread': {
		id: string;
	};
	'chat.conversations.mute': {
		/** The ID of the conversation: a group ID starting with `g`, the other user's ID for a 1:1 conversation, or both user IDs of a 1:1 conversation joined by a hyphen. */
		id: string;
		/** Signatures for this action, forwarded in the order they are sent. */
		action_signatures?: Array<TwitterMuteChatConversationActionSignaturesInput>;
	};
	'chat.conversations.sendTyping': {
		id: string;
	};
	'chat.conversations.unarchive': {
		/** The ID of the conversation: a group ID starting with `g`, the other user's ID for a 1:1 conversation, or both user IDs of a 1:1 conversation joined by a hyphen. */
		id: string;
		/** Signatures for this action, forwarded in the order they are sent. */
		action_signatures?: Array<TwitterUnarchiveChatConversationActionSignaturesInput>;
	};
	'chat.conversations.unmute': {
		/** The ID of the conversation: a group ID starting with `g`, the other user's ID for a 1:1 conversation, or both user IDs of a 1:1 conversation joined by a hyphen. */
		id: string;
		/** Signatures for this action, forwarded in the order they are sent. */
		action_signatures?: Array<TwitterUnmuteChatConversationActionSignaturesInput>;
	};
	'chat.conversations.updateScreenCapture': {
		/** The ID of the conversation: a group ID starting with `g`, the other user's ID for a 1:1 conversation, or both user IDs of a 1:1 conversation joined by a hyphen. */
		id: string;
		/** Whether participants are prevented from taking screenshots. */
		blocking?: boolean;
		/** Signatures for the screenshot blocking change, forwarded in the order they are sent. */
		blocking_action_signatures?: Array<TwitterUpdateChatConversationScreenCaptureBlockingActionSignaturesInput>;
		/** Whether participants are notified when someone takes a screenshot. */
		detection?: boolean;
		/** Signatures for the screenshot detection change, forwarded in the order they are sent. */
		detection_action_signatures?: Array<TwitterUpdateChatConversationScreenCaptureDetectionActionSignaturesInput>;
	};
	'chat.groups.adminRequests.approve': {
		/** The ID of the group conversation, starting with `g`. */
		id: string;
		/** The ID of the user who requested admin permissions. */
		user_id: string;
		/** Signatures for this action, forwarded in the order they are sent. */
		action_signatures?: Array<TwitterApproveChatGroupAdminRequestActionSignaturesInput>;
	};
	'chat.groups.adminRequests.create': {
		/** The ID of the group conversation, starting with `g`. */
		id: string;
		/** Signatures for this action, forwarded in the order they are sent. */
		action_signatures?: Array<TwitterCreateChatGroupAdminRequestActionSignaturesInput>;
	};
	'chat.groups.adminRequests.list': {
		/** The ID of the group conversation, starting with `g`. */
		id: string;
		/** The next_token from a previous response, to fetch the next page. */
		pagination_token?: string;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			'affiliation' | 'most_recent_post_id' | 'pinned_post_id'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
	};
	'chat.groups.adminRequests.reject': {
		/** The ID of the group conversation, starting with `g`. */
		id: string;
		/** The ID of the user who requested admin permissions. */
		user_id: string;
		/** Signatures for this action, forwarded in the order they are sent. */
		action_signatures?: Array<TwitterRejectChatGroupAdminRequestActionSignaturesInput>;
	};
	'chat.groups.admins.add': {
		/** The ID of the group conversation, starting with `g`. */
		id: string;
		/** Signatures for this action, forwarded in the order they are sent. */
		action_signatures?: Array<TwitterAddChatGroupAdminsActionSignaturesInput>;
		/** List of member user IDs to make admins. */
		user_ids: Array<string>;
	};
	'chat.groups.admins.remove': {
		/** The ID of the group conversation, starting with `g`. */
		id: string;
		/** Signatures for this action, forwarded in the order they are sent. */
		action_signatures?: Array<TwitterRemoveChatGroupAdminsActionSignaturesInput>;
		/** List of admin user IDs to revoke admin rights from. */
		user_ids: Array<string>;
	};
	'chat.groups.create': {
		/** Signatures for this action, forwarded in the order they are sent. */
		action_signatures?: Array<TwitterCreateChatConversationActionSignaturesInput>;
		/** Base64-encoded key rotation payload. */
		base64_encoded_key_rotation?: string;
		/** Client-generated conversation ID. */
		conversation_id: string;
		/** Version of the conversation encryption key. */
		conversation_key_version: string;
		/** Encrypted conversation keys for each participant. */
		conversation_participant_keys: Array<TwitterCreateChatConversationConversationParticipantKeysInput>;
		/** User IDs of group admins. Defaults to the creator if omitted. */
		group_admins?: Array<string>;
		/** URL of the avatar image for the group conversation. */
		group_avatar_url?: string;
		/** Description for the group conversation. */
		group_description?: string;
		/** User IDs of group members to include in the conversation. */
		group_members: Array<string>;
		/** Display name for the group conversation. */
		group_name?: string;
		/** Message time-to-live in milliseconds. Messages expire after this duration. */
		ttl_msec?: string;
	};
	'chat.groups.initialize': Record<string, never>;
	'chat.groups.inviteLink.disable': {
		/** The ID of the group conversation, starting with `g`. */
		id: string;
		/** Signatures for this action, forwarded in the order they are sent. */
		action_signatures?: Array<TwitterDisableChatGroupInviteActionSignaturesInput>;
	};
	'chat.groups.inviteLink.enable': {
		/** The ID of the group conversation, starting with `g`. */
		id: string;
		/** Signatures for this action, forwarded in the order they are sent. */
		action_signatures?: Array<TwitterEnableChatGroupInviteActionSignaturesInput>;
		/** ID of the affiliate account to associate with the link. */
		affiliate_user_id?: string;
		/** Group avatar URL (https) to show on the invite preview. */
		decrypted_avatar_url?: string;
		/** Group name to show on the invite preview. */
		decrypted_title?: string;
		/** Invite link built by the client, in the form https://x.com/i/chat/group_join/<conversation_id>/<token>, where the token is exactly 10 letters, digits, '-' or '_'. The conversation segment must match the path ID. It is part of the signed payload, so it is required when action_signatures is sent. */
		invite_url?: string;
		/** How long the link stays valid, in milliseconds, from the time of the request. With action_signatures, send validity_expiry_timestamp_msec instead. */
		validity_duration_msec?: string;
		/** When the link expires, in epoch milliseconds. Must be in the future. If validity_duration_msec is also sent, the two must agree within a minute. */
		validity_expiry_timestamp_msec?: string;
		/** Message shown to people who open the link. */
		welcome_message?: string;
	};
	'chat.groups.inviteLink.get': {
		/** The ID of the group conversation, starting with `g`. */
		id: string;
		/** The 10-character invite token from the group's invite link. */
		token: string;
		/** A comma separated list of ChatGroupInvite fields to display. */
		'chat_group_invite.fields'?: Array<
			| 'conversation_id'
			| 'expires_at'
			| 'group_avatar_url'
			| 'group_name'
			| 'invite_url'
			| 'join_state'
			| 'member_count'
			| 'token'
			| 'welcome_message'
		>;
	};
	'chat.groups.joinRequests.create': {
		/** The ID of the group conversation, starting with `g`. */
		id: string;
		/** Signatures for this action, forwarded in the order they are sent. */
		action_signatures?: Array<TwitterCreateChatGroupJoinRequestActionSignaturesInput>;
		/** The 10-character invite token from the group's invite link. */
		token: string;
	};
	'chat.groups.joinRequests.reject': {
		/** The ID of the group conversation, starting with `g`. */
		id: string;
		/** Signatures for this action, forwarded in the order they are sent. */
		action_signatures?: Array<TwitterRejectChatGroupJoinRequestsActionSignaturesInput>;
		/** List of user IDs whose join requests to reject. */
		user_ids: Array<string>;
	};
	'chat.groups.members.add': {
		id: string;
		/** Signatures for this action, forwarded in the order they are sent. */
		action_signatures?: Array<TwitterAddChatGroupMembersActionSignaturesInput>;
		/** Version of the new rotated conversation key. */
		conversation_key_version?: string;
		/** Encrypted conversation keys for each participant. */
		conversation_participant_keys?: Array<TwitterAddChatGroupMembersConversationParticipantKeysInput>;
		/** Re-encrypted group avatar URL with new conversation key. */
		encrypted_avatar_url?: string;
		/** Re-encrypted group title with new conversation key. */
		encrypted_title?: string;
		/** List of user IDs to add to the group conversation. */
		user_ids: Array<string>;
	};
	'chat.groups.members.remove': {
		id: string;
		/** Signatures for this action, forwarded in the order they are sent. */
		action_signatures?: Array<TwitterRemoveChatGroupMembersActionSignaturesInput>;
		/** Conversation key rotated as part of this removal. Omit it when the removal does not change the key. */
		group_key_rotation_data?: TwitterRemoveChatGroupMembersGroupKeyRotationDataInput;
		/** List of user IDs to remove from the group conversation. */
		user_ids: Array<string>;
	};
	'chat.groups.update': {
		/** The ID of the group conversation, starting with `g`. */
		id: string;
		/** Signatures for this action, forwarded in the order they are sent. */
		action_signatures?: Array<TwitterUpdateChatGroupActionSignaturesInput>;
		/** Base64-encoded key rotation payload. */
		base64_encoded_key_rotation?: string;
		/** Version of the conversation key the values are encrypted with. */
		conversation_key_version: string;
		/** Encrypted conversation keys for each participant. */
		conversation_participant_keys?: Array<TwitterUpdateChatGroupConversationParticipantKeysInput>;
		/** Encrypted group avatar URL. */
		group_avatar_url?: string;
		/** Encrypted group description. */
		group_description?: string;
		/** Encrypted group name. */
		group_name?: string;
		/** The group values this request changes. */
		modified_fields: Array<
			'group_name' | 'group_avatar_url' | 'group_description'
		>;
		/** Message keys re-encrypted with the rotated conversation key. */
		rotated_pmk_bundle?: Array<TwitterUpdateChatGroupRotatedPmkBundleInput>;
	};
	'chat.groups.updateAdminSettings': {
		/** The ID of the group conversation, starting with `g`. */
		id: string;
		/** Signatures for this action, forwarded in the order they are sent. */
		action_signatures?: Array<TwitterUpdateChatGroupAdminSettingsActionSignaturesInput>;
		/** When true, only admins can add members. */
		add_member?: boolean;
		/** When true, only admins can change screen capture blocking. Through the API, only admins can change screen capture in a group, whatever this setting says. */
		block_screen_capture?: boolean;
		/** When true, only admins can edit the group name, avatar, and description. */
		edit_group_info?: boolean;
		/** When true, only admins can change the disappearing-message timer. */
		edit_message_ttl?: boolean;
		/** When true, only admins can send messages. */
		send_message?: boolean;
		/** When true, only admins can start calls. */
		start_call?: boolean;
	};
	'chat.media.appendUpload': {
		id: string;
		/** The XChat conversation the upload belongs to. */
		conversation_id: string;
		/** The media segment bytes: base64-encoded in JSON bodies, raw bytes in multipart bodies. */
		media: FileInput;
		/** The media hash key returned by the initialize step. */
		media_hash_key: string;
		/** The index of this segment in the upload sequence. */
		segment_index: number;
	};
	'chat.media.download': {
		id: string;
		media_hash_key: string;
	};
	'chat.media.finalizeUpload': {
		id: string;
		/** The XChat conversation the upload belongs to. */
		conversation_id: string;
		/** The media hash key returned by the initialize step. */
		media_hash_key: string;
		/** Optional message identifier associated with the upload. */
		message_id?: string;
		/** Total number of uploaded parts, as a numeric string. */
		num_parts: string;
		/** Optional TTL for the media in milliseconds, as a numeric string. */
		ttl_msec?: string;
	};
	'chat.media.initializeUpload': {
		/** The XChat conversation the upload belongs to. */
		conversation_id: string;
		/** Total size of the media upload in bytes. */
		total_bytes: number;
	};
	'chat.messageRequests.accept': {
		/** The other user's ID, or both user IDs joined by a hyphen. */
		id: string;
	};
	'chat.messageRequests.get': {
		/** The other user's ID, or both user IDs joined by a hyphen. */
		id: string;
		/** A comma separated list of ChatMessageRequestDetail fields to display. */
		'chat_message_request_detail.fields'?: Array<
			| 'conversation_id'
			| 'conversation_key_events'
			| 'has_more_events'
			| 'message_events'
			| 'message_request_state'
			| 'participant_id'
		>;
	};
	'chat.messageRequests.list': {
		/** Which message request inbox to list: `you_may_know` (the apps' Priority tab) or `low_quality` (the apps' Hidden tab). */
		inbox_type?: 'you_may_know' | 'low_quality';
		/** The maximum number of message requests to return. */
		max_results?: number;
		/** The next_token from a previous response, to fetch the next page. */
		pagination_token?: string;
		/** A comma separated list of ChatMessageRequest fields to display. */
		'chat_message_request.fields'?: Array<
			| 'conversation_id'
			| 'conversation_key_events'
			| 'encoded_message_create_event'
			| 'has_more_events'
			| 'message_events'
			| 'sender_id'
			| 'sender_recently_modified_profile'
			| 'social_proof_user_ids'
		>;
	};
	'chat.messages.delete': {
		id: string;
		/** Signatures for this action, forwarded in the order they are sent. */
		action_signatures: Array<TwitterDeleteChatMessagesActionSignaturesInput>;
		/** delete_for_all removes the messages for every participant; delete_for_self removes them only from the authenticated user's view. */
		delete_message_action: 'delete_for_all' | 'delete_for_self';
		/** Hash keys of encrypted media blobs to delete alongside the messages (delete_for_all only). */
		media_hash_keys?: Array<string>;
		/** Sequence IDs of the messages to delete. */
		sequence_ids: Array<string>;
	};
	'chat.messages.send': {
		/** A conversation's id from Get Chat Conversations, or the recipient's user ID for a 1:1 chat. */
		id: string;
		/** Unencrypted fallback: use only when the recipient's `receives_your_chat` is `unencrypted`. */
		content?: TwitterSendChatMessageContentInput;
		/** Optional conversation token. */
		conversation_token?: string;
		/** Default. The end-to-end encrypted message: a base64 Thrift MessageCreateEvent from the Chat XDK. */
		encoded_message_create_event?: string;
		/** Base64-encoded Thrift MessageEventSignature for message verification. */
		encoded_message_event_signature?: string;
		/** Unique identifier for this message. */
		message_id: string;
		/** Version of the Chat XDK that produced the payload. */
		xdk_version?: string;
	};
	'chat.settings.get': {
		/** A comma separated list of ChatSettings fields to display. */
		'chat_settings.fields'?: Array<
			| 'allow_dms_from'
			| 'always_allow_dms_from_subscribers'
			| 'av_settings'
			| 'dm_quality_filter'
			| 'dm_receipt_settings'
		>;
	};
	'chat.settings.update': {
		/** Who can send the user messages: `all` (anyone), `verified` (verified accounts only), or `following` (accounts the user follows). A bot may get a 400 for choosing `following` when it doesn't already have it, and an org-only bot for choosing `verified`. */
		allow_dms_from?: 'all' | 'verified' | 'following';
		/** Whether the user's subscribers can always message them regardless of allow_dms_from. */
		always_allow_dms_from_subscribers?: boolean;
		/** Audio and video call settings. */
		av_settings?: TwitterUpdateChatSettingsAvSettingsInput;
		/** Low-quality message request filter: `enabled` (low-quality requests go to a separate folder) or `disabled` (all requests stay in the main inbox). */
		dm_quality_filter?: 'enabled' | 'disabled';
		/** Read receipts: `all_enabled` (send and receive read receipts) or `all_disabled` (neither). */
		dm_receipt_settings?: 'all_enabled' | 'all_disabled';
	};
	'communities.get': {
		id: TwitterCommunityIdInput;
		/** A comma separated list of Community fields to display. */
		'community.fields'?: Array<
			| 'access'
			| 'created_at'
			| 'description'
			| 'id'
			| 'join_policy'
			| 'member_count'
			| 'name'
		>;
	};
	'communities.search': {
		query: string;
		max_results?: number;
		next_token?: string;
		pagination_token?: string;
		/** A comma separated list of Community fields to display. */
		'community.fields'?: Array<
			| 'access'
			| 'created_at'
			| 'description'
			| 'id'
			| 'join_policy'
			| 'member_count'
			| 'name'
		>;
	};
	'communityNotes.create': {
		/** The Community Note contents. */
		info: TwitterCreateCommunityNotesInfoInput;
		/** ID of the Post the note is about. */
		post_id: string;
		/** If true, the note is only for testing and is not publicly visible. */
		test_mode: boolean;
	};
	'communityNotes.delete': {
		id: TwitterNoteIdInput;
	};
	'communityNotes.evaluate': {
		/** Text of the community note to evaluate. */
		note_text: string;
		/** ID of the Post the note evaluates. */
		post_id: string;
	};
	'communityNotes.searchEligiblePosts': {
		test_mode: boolean;
		max_results?: number;
		pagination_token?: string;
		post_selection?: string;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			| 'article.cover_media'
			| 'article.media_entities'
			| 'attachments.media_keys'
			| 'attachments.media_source_tweet'
			| 'attachments.poll_ids'
			| 'author_id'
			| 'edit_history_post_ids'
			| 'entities.mentions.username'
			| 'geo.place_id'
			| 'in_reply_to_user_id'
			| 'referenced_posts'
			| 'username'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of Media fields to display. */
		'media.fields'?: Array<
			| 'alt_text'
			| 'duration_ms'
			| 'height'
			| 'media_key'
			| 'non_public_metrics'
			| 'organic_metrics'
			| 'preview_image_url'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'revenue'
			| 'type'
			| 'url'
			| 'variants'
			| 'width'
		>;
		/** A comma separated list of Poll fields to display. */
		'poll.fields'?: Array<
			'duration_minutes' | 'end_datetime' | 'id' | 'options' | 'voting_status'
		>;
		/** A comma separated list of Place fields to display. */
		'place.fields'?: Array<
			| 'contained_within'
			| 'country'
			| 'country_code'
			| 'full_name'
			| 'geo'
			| 'id'
			| 'name'
			| 'place_type'
		>;
	};
	'communityNotes.searchWritten': {
		test_mode: boolean;
		max_results?: number;
		pagination_token?: string;
		/** A comma separated list of Note fields to display. */
		'note.fields'?: Array<
			'id' | 'info' | 'scoring_status' | 'status' | 'test_result'
		>;
	};
	'compliance.jobs.cancel': {
		id: string;
		/** A comma separated list of ComplianceJob fields to display. */
		'compliance_job.fields'?: Array<
			| 'created_at'
			| 'download_expires_at'
			| 'download_url'
			| 'id'
			| 'name'
			| 'resumable'
			| 'status'
			| 'type'
			| 'upload_expires_at'
			| 'upload_url'
		>;
	};
	'compliance.jobs.create': {
		/** A comma separated list of ComplianceJob fields to display. */
		'compliance_job.fields'?: Array<
			| 'created_at'
			| 'download_expires_at'
			| 'download_url'
			| 'id'
			| 'name'
			| 'resumable'
			| 'status'
			| 'type'
			| 'upload_expires_at'
			| 'upload_url'
		>;
		/** A user-provided name for this job. */
		name?: string;
		/** Whether to enable the upload URL with support for resumable uploads. */
		resumable?: boolean;
		/** Type of compliance job to list. */
		type: 'tweets' | 'users';
	};
	'compliance.jobs.downloadResults': {
		id: string;
		/** Signed download token from the job's download_url. */
		token: string;
		/** A comma separated list of ComplianceJob fields to display. */
		'compliance_job.fields'?: Array<
			| 'created_at'
			| 'download_expires_at'
			| 'download_url'
			| 'id'
			| 'name'
			| 'resumable'
			| 'status'
			| 'type'
			| 'upload_expires_at'
			| 'upload_url'
		>;
	};
	'compliance.jobs.get': {
		id: string;
		/** A comma separated list of ComplianceJob fields to display. */
		'compliance_job.fields'?: Array<
			| 'created_at'
			| 'download_expires_at'
			| 'download_url'
			| 'id'
			| 'name'
			| 'resumable'
			| 'status'
			| 'type'
			| 'upload_expires_at'
			| 'upload_url'
		>;
	};
	'compliance.jobs.list': {
		type: 'tweets' | 'users';
		status?: 'created' | 'in_progress' | 'failed' | 'complete';
		/** A comma separated list of ComplianceJob fields to display. */
		'compliance_job.fields'?: Array<
			| 'created_at'
			| 'download_expires_at'
			| 'download_url'
			| 'id'
			| 'name'
			| 'resumable'
			| 'status'
			| 'type'
			| 'upload_expires_at'
			| 'upload_url'
		>;
	};
	'compliance.jobs.upload': {
		id: string;
		/** Signed upload token from the job's upload_url. */
		token: string;
		/** A comma separated list of ComplianceJob fields to display. */
		'compliance_job.fields'?: Array<
			| 'created_at'
			| 'download_expires_at'
			| 'download_url'
			| 'id'
			| 'name'
			| 'resumable'
			| 'status'
			| 'type'
			| 'upload_expires_at'
			| 'upload_url'
		>;
		/** The file to upload: a public URL, { url }, { base64 }, or a Blob. For a compliance job, a text file with one post or user ID per line. */
		file: FileInput;
	};
	'connections.history': {
		status?: 'active' | 'inactive' | 'all';
		endpoints?: Array<
			| 'filtered_stream'
			| 'sample_stream'
			| 'sample10_stream'
			| 'firehose_stream'
			| 'tweets_compliance_stream'
			| 'users_compliance_stream'
			| 'tweet_label_stream'
			| 'firehose_stream_lang_en'
			| 'firehose_stream_lang_ja'
			| 'firehose_stream_lang_ko'
			| 'firehose_stream_lang_pt'
			| 'likes_firehose_stream'
			| 'likes_sample10_stream'
			| 'likes_compliance_stream'
		>;
		max_results?: number;
		pagination_token?: string;
		/** A comma separated list of Connection fields to display. */
		'connection.fields'?: Array<
			| 'client_ip'
			| 'connected_at'
			| 'disconnect_reason'
			| 'disconnected_at'
			| 'endpoint_name'
			| 'id'
		>;
	};
	'connections.terminateAll': Record<string, never>;
	'connections.terminateByEndpoint': {
		endpoint_id:
			| 'filtered_stream'
			| 'sample_stream'
			| 'sample10_stream'
			| 'firehose_stream'
			| 'tweets_compliance_stream'
			| 'users_compliance_stream'
			| 'tweet_label_stream'
			| 'firehose_stream_lang_en'
			| 'firehose_stream_lang_ja'
			| 'firehose_stream_lang_ko'
			| 'firehose_stream_lang_pt'
			| 'likes_firehose_stream'
			| 'likes_sample10_stream'
			| 'likes_compliance_stream';
	};
	'connections.terminateMany': {
		/** Connection UUIDs to terminate (1-100). */
		uuids: Array<string>;
	};
	'directMessages.conversations.create': {
		/** The conversation type to create. Supports `Group` only. */
		conversation_type: 'Group';
		/** The initial Direct Message to send to the conversation. */
		message: TwitterCreateDirectMessagesConversationMessageInput;
		/** Participants for the conversation. */
		participant_ids: Array<string>;
	};
	'directMessages.events.delete': {
		event_id: string;
	};
	'directMessages.events.get': {
		event_id: string;
		/** A comma separated list of DmEvent fields to display. */
		'dm_event.fields'?: Array<
			| 'attachments'
			| 'created_at'
			| 'dm_conversation_id'
			| 'entities'
			| 'event_type'
			| 'id'
			| 'text'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			| 'attachments.media_keys'
			| 'attachments.media_keys'
			| 'participant_ids'
			| 'referenced_posts'
			| 'sender_id'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
		/** A comma separated list of Media fields to display. */
		'media.fields'?: Array<
			| 'alt_text'
			| 'duration_ms'
			| 'height'
			| 'media_key'
			| 'non_public_metrics'
			| 'organic_metrics'
			| 'preview_image_url'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'revenue'
			| 'type'
			| 'url'
			| 'variants'
			| 'width'
		>;
	};
	'directMessages.events.list': {
		max_results?: number;
		/** A base32hex-encoded pagination token. */
		pagination_token?: string;
		event_types?: Array<
			'MessageCreate' | 'ParticipantsJoin' | 'ParticipantsLeave'
		>;
		/** A comma separated list of DmEvent fields to display. */
		'dm_event.fields'?: Array<
			| 'attachments'
			| 'created_at'
			| 'dm_conversation_id'
			| 'entities'
			| 'event_type'
			| 'id'
			| 'text'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			| 'attachments.media_keys'
			| 'attachments.media_keys'
			| 'participant_ids'
			| 'referenced_posts'
			| 'sender_id'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
		/** A comma separated list of Media fields to display. */
		'media.fields'?: Array<
			| 'alt_text'
			| 'duration_ms'
			| 'height'
			| 'media_key'
			| 'non_public_metrics'
			| 'organic_metrics'
			| 'preview_image_url'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'revenue'
			| 'type'
			| 'url'
			| 'variants'
			| 'width'
		>;
	};
	'directMessages.events.listByConversation': {
		id: string;
		max_results?: number;
		/** A base32hex-encoded pagination token. */
		pagination_token?: string;
		event_types?: Array<
			'MessageCreate' | 'ParticipantsJoin' | 'ParticipantsLeave'
		>;
		/** A comma separated list of DmEvent fields to display. */
		'dm_event.fields'?: Array<
			| 'attachments'
			| 'created_at'
			| 'dm_conversation_id'
			| 'entities'
			| 'event_type'
			| 'id'
			| 'text'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			| 'attachments.media_keys'
			| 'attachments.media_keys'
			| 'participant_ids'
			| 'referenced_posts'
			| 'sender_id'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
		/** A comma separated list of Media fields to display. */
		'media.fields'?: Array<
			| 'alt_text'
			| 'duration_ms'
			| 'height'
			| 'media_key'
			| 'non_public_metrics'
			| 'organic_metrics'
			| 'preview_image_url'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'revenue'
			| 'type'
			| 'url'
			| 'variants'
			| 'width'
		>;
	};
	'directMessages.events.listWithParticipant': {
		participant_id: string;
		max_results?: number;
		/** A base32hex-encoded pagination token. */
		pagination_token?: string;
		event_types?: Array<
			'MessageCreate' | 'ParticipantsJoin' | 'ParticipantsLeave'
		>;
		/** A comma separated list of DmEvent fields to display. */
		'dm_event.fields'?: Array<
			| 'attachments'
			| 'created_at'
			| 'dm_conversation_id'
			| 'entities'
			| 'event_type'
			| 'id'
			| 'text'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			| 'attachments.media_keys'
			| 'attachments.media_keys'
			| 'participant_ids'
			| 'referenced_posts'
			| 'sender_id'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
		/** A comma separated list of Media fields to display. */
		'media.fields'?: Array<
			| 'alt_text'
			| 'duration_ms'
			| 'height'
			| 'media_key'
			| 'non_public_metrics'
			| 'organic_metrics'
			| 'preview_image_url'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'revenue'
			| 'type'
			| 'url'
			| 'variants'
			| 'width'
		>;
	};
	'directMessages.media.download': {
		dm_id: string;
		media_id: string;
		resource_id: string;
	};
	'directMessages.sendToConversation': {
		dm_conversation_id: string;
		/** Attachments to include with the message. */
		attachments?: Array<TwitterCreateDirectMessagesByConversationIdAttachmentsInput>;
		/** Text of the Direct Message. */
		text?: string;
	};
	'directMessages.sendToParticipant': {
		participant_id: string;
		/** Attachments to include with the message. */
		attachments?: Array<TwitterCreateDirectMessagesByParticipantIdAttachmentsInput>;
		/** Text of the Direct Message. */
		text?: string;
	};
	'lists.create': {
		/** Description of the List (up to 100 characters). */
		description?: string;
		/** Name of the List (1-25 characters). */
		name: string;
		/** Whether the List is private. */
		private?: boolean;
	};
	'lists.delete': {
		id: TwitterListIdInput;
	};
	'lists.followers.list': {
		id: TwitterListIdInput;
		max_results?: number;
		/** A 64-bit signed integer. */
		pagination_token?: string;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			'affiliation' | 'most_recent_post_id' | 'pinned_post_id'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
	};
	'lists.get': {
		id: TwitterListIdInput;
		/** A comma separated list of List fields to display. */
		'list.fields'?: Array<
			| 'created_at'
			| 'description'
			| 'follower_count'
			| 'id'
			| 'member_count'
			| 'name'
			| 'private'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<'owner_id'>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
	};
	'lists.members.add': {
		id: TwitterListIdInput;
		user_id: string;
	};
	'lists.members.list': {
		id: TwitterListIdInput;
		max_results?: number;
		/** A 64-bit signed integer. */
		pagination_token?: string;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			'affiliation' | 'most_recent_post_id' | 'pinned_post_id'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
	};
	'lists.members.remove': {
		id: TwitterListIdInput;
		user_id: TwitterUserIdInput;
	};
	'lists.posts.list': {
		id: TwitterListIdInput;
		max_results?: number;
		/** A base32hex-encoded pagination token. */
		pagination_token?: string;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			| 'article.cover_media'
			| 'article.media_entities'
			| 'attachments.media_keys'
			| 'attachments.media_source_tweet'
			| 'attachments.poll_ids'
			| 'author_id'
			| 'edit_history_post_ids'
			| 'entities.mentions.username'
			| 'geo.place_id'
			| 'in_reply_to_user_id'
			| 'referenced_posts'
			| 'username'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of Media fields to display. */
		'media.fields'?: Array<
			| 'alt_text'
			| 'duration_ms'
			| 'height'
			| 'media_key'
			| 'non_public_metrics'
			| 'organic_metrics'
			| 'preview_image_url'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'revenue'
			| 'type'
			| 'url'
			| 'variants'
			| 'width'
		>;
		/** A comma separated list of Poll fields to display. */
		'poll.fields'?: Array<
			'duration_minutes' | 'end_datetime' | 'id' | 'options' | 'voting_status'
		>;
		/** A comma separated list of Place fields to display. */
		'place.fields'?: Array<
			| 'contained_within'
			| 'country'
			| 'country_code'
			| 'full_name'
			| 'geo'
			| 'id'
			| 'name'
			| 'place_type'
		>;
	};
	'lists.update': {
		id: TwitterListIdInput;
		/** New description for the List (up to 100 characters). */
		description?: string;
		/** New name for the List (1-25 characters). */
		name?: string;
		/** Whether the List is private. */
		private?: boolean;
	};
	'media.amplify.addPost': {
		/** Advertiser account ids whose pre-rolls may not run on this post. */
		blocked_advertiser_ids?: Array<string>;
		/** The post to publish. It must belong to the user. */
		post_id: string;
		/** The programs to publish the post into. */
		program_ids: Array<string>;
		/** When promotion of the post ends (ISO 8601). */
		promotion_ends_at?: string;
	};
	'media.amplify.programs.get': {
		/** Identifier of the program. */
		program_id: string;
	};
	'media.amplify.programs.list': Record<string, never>;
	'media.amplify.programs.listPosts': {
		/** Identifier of the program. */
		program_id: string;
	};
	'media.analytics': {
		media_keys: Array<string>;
		start_time: string;
		end_time: string;
		granularity?: 'hourly' | 'daily' | 'total';
		/** A comma separated list of MediaAnalytics fields to display. */
		'media_analytics.fields'?: Array<
			| 'cta_url_clicks'
			| 'cta_watch_clicks'
			| 'media_key'
			| 'play_from_tap'
			| 'playback25'
			| 'playback50'
			| 'playback75'
			| 'playback_complete'
			| 'playback_start'
			| 'timestamp'
			| 'timestamped_metrics'
			| 'video_views'
			| 'watch_time_ms'
		>;
	};
	'media.get': {
		media_key: string;
		/** A comma separated list of Media fields to display. */
		'media.fields'?: Array<
			| 'alt_text'
			| 'duration_ms'
			| 'height'
			| 'media_key'
			| 'non_public_metrics'
			| 'organic_metrics'
			| 'preview_image_url'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'revenue'
			| 'type'
			| 'url'
			| 'variants'
			| 'width'
		>;
	};
	'media.getMany': {
		media_keys: Array<string>;
		/** A comma separated list of Media fields to display. */
		'media.fields'?: Array<
			| 'alt_text'
			| 'duration_ms'
			| 'height'
			| 'media_key'
			| 'non_public_metrics'
			| 'organic_metrics'
			| 'preview_image_url'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'revenue'
			| 'type'
			| 'url'
			| 'variants'
			| 'width'
		>;
	};
	'media.library.add': {
		/** Description shown with the video in the player card. */
		description?: string;
		/** Label of the item in the library. */
		label?: string;
		/** The media key of the uploaded image, GIF or video to add. */
		media_key: string;
		/** Monetization settings. Videos only. */
		monetization?: TwitterAddMediaToLibraryMonetizationInput;
		/** Name of the item in the library. */
		name?: string;
		/** Title shown with the video in the player card. */
		title?: string;
	};
	'media.library.listCategories': {
		/** Language tag for category descriptions, e.g. `en` or `pt-BR`. */
		lang?: string;
	};
	'media.library.remove': {
		/** The media key of the library item to remove. */
		media_key: string;
	};
	'media.library.update': {
		/** The media key of the library item to update. */
		media_key: string;
		/** Description shown with the video in the player card. */
		description?: string;
		/** Label of the item in the library. */
		label?: string;
		/** Monetization settings. Videos only. */
		monetization?: TwitterUpdateMediaInLibraryMonetizationInput;
		/** Name of the item in the library. */
		name?: string;
		/** Title shown with the video in the player card. */
		title?: string;
	};
	'media.metadata.create': {
		/** The media id the metadata is attached to. */
		id: string;
		/** User-defined metadata to associate with the media. */
		metadata: TwitterCreateMediaMetadataMetadataInput;
	};
	'media.subtitles.create': {
		/** The media id of the video the subtitles belong to. */
		id: string;
		/** The media category of the target media. */
		media_category: 'AmplifyVideo' | 'TweetVideo';
		/** The subtitle tracks to associate with the media. */
		subtitles: TwitterCreateMediaSubtitlesSubtitlesInput;
	};
	'media.subtitles.delete': {
		/** The media id of the video the subtitles belong to. */
		id: string;
		/** The language code of the subtitles to delete. */
		language_code: string;
		/** The media category of the target media. */
		media_category: string;
	};
	'media.upload.append': {
		/** The upload id from Initialize Media Upload. */
		id: string;
		/** One segment of the file: base64-encoded in JSON bodies, raw bytes in multipart bodies. */
		media: FileInput;
		/** The segment's position in the file, counting from 0. */
		segment_index: number;
	};
	'media.upload.finalize': {
		/** The upload id from Initialize Media Upload. */
		id: string;
	};
	'media.upload.getStatus': {
		/** The media id from Initialize Media Upload. */
		media_id: TwitterMediaIdInput;
		/** Always STATUS; can be left out. */
		command?: 'STATUS';
	};
	'media.upload.initialize': {
		/** User ids granted access to the uploaded media. */
		additional_owners?: Array<string>;
		/** The media category of the upload. */
		media_category?:
			| 'amplify_video'
			| 'tweet_gif'
			| 'tweet_image'
			| 'tweet_video'
			| 'dm_gif'
			| 'dm_image'
			| 'dm_video'
			| 'subtitles';
		/** The type of media. */
		media_type?:
			| 'video/mp4'
			| 'video/webm'
			| 'video/mp2t'
			| 'video/quicktime'
			| 'text/srt'
			| 'text/vtt'
			| 'image/jpeg'
			| 'image/gif'
			| 'image/bmp'
			| 'image/png'
			| 'image/webp'
			| 'image/pjpeg'
			| 'image/tiff'
			| 'model/gltf-binary'
			| 'model/vnd.usdz+zip';
		/** Whether this media is shared or not. */
		shared?: boolean;
		/** The total size of the media upload in bytes. */
		total_bytes?: number;
	};
	'media.upload.single': {
		/** Comma-separated list of user IDs who can use this media. */
		additional_owners?: string;
		/** The media file to upload: base64-encoded in JSON bodies, raw bytes in multipart bodies. */
		media: FileInput;
		/** The category of the media being uploaded. */
		media_category:
			| 'tweet_image'
			| 'tweet_video'
			| 'tweet_gif'
			| 'dm_image'
			| 'dm_video'
			| 'dm_gif'
			| 'subtitles';
	};
	'news.get': {
		id: string;
		/** A comma separated list of News fields to display. */
		'news.fields'?: Array<
			| 'category'
			| 'cluster_posts_results'
			| 'contexts'
			| 'contexts'
			| 'contexts'
			| 'contexts'
			| 'disclaimer'
			| 'hook'
			| 'id'
			| 'keywords'
			| 'name'
			| 'summary'
			| 'updated_at'
		>;
	};
	'news.search': {
		query: string;
		max_results?: number;
		max_age_hours?: number;
		/** A comma separated list of News fields to display. */
		'news.fields'?: Array<
			| 'category'
			| 'cluster_posts_results'
			| 'contexts'
			| 'contexts'
			| 'contexts'
			| 'contexts'
			| 'disclaimer'
			| 'hook'
			| 'id'
			| 'keywords'
			| 'name'
			| 'summary'
			| 'updated_at'
		>;
	};
	'posts.analytics': {
		ids: Array<TwitterAnalyticsIdInput>;
		start_time: string;
		end_time: string;
		granularity?: 'hourly' | 'weekly' | 'daily' | 'total';
		/** A comma separated list of Analytics fields to display. */
		'analytics.fields'?: Array<
			| 'app_install_attempts'
			| 'app_opens'
			| 'bookmarks'
			| 'detail_expands'
			| 'email_tweet'
			| 'engagements'
			| 'follows'
			| 'hashtag_clicks'
			| 'id'
			| 'impressions'
			| 'likes'
			| 'media_views'
			| 'permalink_clicks'
			| 'quote_tweets'
			| 'replies'
			| 'retweets'
			| 'shares'
			| 'timestamp'
			| 'timestamped_metrics'
			| 'unfollows'
			| 'unlikes'
			| 'url_clicks'
			| 'user_profile_clicks'
		>;
	};
	'posts.counts.all': {
		query: string;
		start_time?: string;
		end_time?: string;
		since_id?: string;
		until_id?: string;
		/** A base32hex-encoded pagination token. */
		next_token?: string;
		/** A base32hex-encoded pagination token. */
		pagination_token?: string;
		granularity?: 'minute' | 'hour' | 'day';
		'search_count.fields'?: string;
	};
	'posts.counts.recent': {
		query: string;
		/** Must be within the last 7 days. */
		start_time?: string;
		end_time?: string;
		since_id?: string;
		until_id?: string;
		/** A base32hex-encoded pagination token. */
		next_token?: string;
		/** A base32hex-encoded pagination token. */
		pagination_token?: string;
		granularity?: 'minute' | 'hour' | 'day';
		'search_count.fields'?: string;
	};
	'posts.create': {
		/** Card URI parameter. */
		card_uri?: string;
		/** Clip of another Post's video to share. Cannot be combined with media, a poll, a card, a quoted Post or a direct message deep link. */
		clip?: TwitterCreatePostsClipInput;
		/** Community to post the tweet to. */
		community_id?: string;
		/** Direct message deep link. */
		direct_message_deep_link?: string;
		/** Edit an existing tweet rather than creating a new one. */
		edit_options?: TwitterCreatePostsEditOptionsInput;
		/** Restrict tweet to super followers. */
		for_super_followers_only?: boolean;
		/** Geo location for the tweet. */
		geo?: TwitterCreatePostsGeoInput;
		/** Disclose that the tweet contains AI-generated media. */
		made_with_ai?: boolean;
		/** Media attachments. */
		media?: TwitterCreatePostsMediaInput;
		/** If true, the tweet is not shown in the public timeline. */
		nullcast?: boolean;
		/** Disclose that the tweet is a paid partnership. */
		paid_partnership?: boolean;
		/** Poll configuration. */
		poll?: TwitterCreatePostsPollInput;
		/** Tweet ID to quote. */
		quote_tweet_id?: string;
		/** Tweet reply configuration. */
		reply?: TwitterCreatePostsReplyInput;
		/** Who can reply to this tweet. */
		reply_settings?:
			| 'following'
			| 'mentionedUsers'
			| 'subscribers'
			| 'verified';
		/** Share an exclusive (super-follower) tweet with all followers. */
		share_with_followers?: boolean;
		/** Text of the Post. Required unless media is provided. At most 280 characters unless the account has X Premium. */
		text?: string;
	};
	'posts.delete': {
		id: TwitterPostIdInput;
	};
	'posts.drafts.create': {
		/** Card URI parameter. */
		card_uri?: string;
		/** Clip of another Post's video to share. Cannot be combined with media, a poll, a card, a quoted Post or a direct message deep link. */
		clip?: TwitterCreatePostDraftClipInput;
		/** Community to post the tweet to. */
		community_id?: string;
		/** Direct message deep link. */
		direct_message_deep_link?: string;
		/** Edit an existing tweet rather than creating a new one. */
		edit_options?: TwitterCreatePostDraftEditOptionsInput;
		/** Restrict tweet to super followers. */
		for_super_followers_only?: boolean;
		/** Geo location for the tweet. */
		geo?: TwitterCreatePostDraftGeoInput;
		/** Disclose that the tweet contains AI-generated media. */
		made_with_ai?: boolean;
		/** Media attachments. */
		media?: TwitterCreatePostDraftMediaInput;
		/** If true, the tweet is not shown in the public timeline. */
		nullcast?: boolean;
		/** Disclose that the tweet is a paid partnership. */
		paid_partnership?: boolean;
		/** Poll configuration. */
		poll?: TwitterCreatePostDraftPollInput;
		/** Tweet ID to quote. */
		quote_tweet_id?: string;
		/** Tweet reply configuration. */
		reply?: TwitterCreatePostDraftReplyInput;
		/** Who can reply to this tweet. */
		reply_settings?:
			| 'following'
			| 'mentionedUsers'
			| 'subscribers'
			| 'verified';
		/** Share an exclusive (super-follower) tweet with all followers. */
		share_with_followers?: boolean;
		/** Text of the Post. Required unless media is provided. At most 280 characters unless the account has X Premium. */
		text?: string;
	};
	'posts.drafts.delete': {
		/** The ID of the draft to delete. */
		id: string;
	};
	'posts.drafts.list': {
		/** The maximum number of drafts to return. */
		max_results?: number;
		/** The meta.next_token of the previous page. */
		pagination_token?: string;
	};
	'posts.get': {
		id: TwitterPostIdInput;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			| 'article.cover_media'
			| 'article.media_entities'
			| 'attachments.media_keys'
			| 'attachments.media_source_tweet'
			| 'attachments.poll_ids'
			| 'author_id'
			| 'edit_history_post_ids'
			| 'entities.mentions.username'
			| 'geo.place_id'
			| 'in_reply_to_user_id'
			| 'referenced_posts'
			| 'username'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of Media fields to display. */
		'media.fields'?: Array<
			| 'alt_text'
			| 'duration_ms'
			| 'height'
			| 'media_key'
			| 'non_public_metrics'
			| 'organic_metrics'
			| 'preview_image_url'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'revenue'
			| 'type'
			| 'url'
			| 'variants'
			| 'width'
		>;
		/** A comma separated list of Poll fields to display. */
		'poll.fields'?: Array<
			'duration_minutes' | 'end_datetime' | 'id' | 'options' | 'voting_status'
		>;
		/** A comma separated list of Place fields to display. */
		'place.fields'?: Array<
			| 'contained_within'
			| 'country'
			| 'country_code'
			| 'full_name'
			| 'geo'
			| 'id'
			| 'name'
			| 'place_type'
		>;
	};
	'posts.getMany': {
		ids: Array<TwitterPostIdInput>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			| 'article.cover_media'
			| 'article.media_entities'
			| 'attachments.media_keys'
			| 'attachments.media_source_tweet'
			| 'attachments.poll_ids'
			| 'author_id'
			| 'edit_history_post_ids'
			| 'entities.mentions.username'
			| 'geo.place_id'
			| 'in_reply_to_user_id'
			| 'referenced_posts'
			| 'username'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of Media fields to display. */
		'media.fields'?: Array<
			| 'alt_text'
			| 'duration_ms'
			| 'height'
			| 'media_key'
			| 'non_public_metrics'
			| 'organic_metrics'
			| 'preview_image_url'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'revenue'
			| 'type'
			| 'url'
			| 'variants'
			| 'width'
		>;
		/** A comma separated list of Poll fields to display. */
		'poll.fields'?: Array<
			'duration_minutes' | 'end_datetime' | 'id' | 'options' | 'voting_status'
		>;
		/** A comma separated list of Place fields to display. */
		'place.fields'?: Array<
			| 'contained_within'
			| 'country'
			| 'country_code'
			| 'full_name'
			| 'geo'
			| 'id'
			| 'name'
			| 'place_type'
		>;
	};
	'posts.hideReply': {
		tweet_id: TwitterPostIdInput;
		/** Whether the reply should be hidden. */
		hidden: boolean;
	};
	'posts.likingUsers': {
		id: TwitterPostIdInput;
		max_results?: number;
		/** A base32hex-encoded pagination token. */
		pagination_token?: string;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			'affiliation' | 'most_recent_post_id' | 'pinned_post_id'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
	};
	'posts.quotes': {
		id: TwitterPostIdInput;
		max_results?: number;
		/** A base32hex-encoded pagination token. */
		pagination_token?: string;
		exclude?: Array<'replies' | 'retweets'>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			| 'article.cover_media'
			| 'article.media_entities'
			| 'attachments.media_keys'
			| 'attachments.media_source_tweet'
			| 'attachments.poll_ids'
			| 'author_id'
			| 'edit_history_post_ids'
			| 'entities.mentions.username'
			| 'geo.place_id'
			| 'in_reply_to_user_id'
			| 'referenced_posts'
			| 'username'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of Media fields to display. */
		'media.fields'?: Array<
			| 'alt_text'
			| 'duration_ms'
			| 'height'
			| 'media_key'
			| 'non_public_metrics'
			| 'organic_metrics'
			| 'preview_image_url'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'revenue'
			| 'type'
			| 'url'
			| 'variants'
			| 'width'
		>;
		/** A comma separated list of Poll fields to display. */
		'poll.fields'?: Array<
			'duration_minutes' | 'end_datetime' | 'id' | 'options' | 'voting_status'
		>;
		/** A comma separated list of Place fields to display. */
		'place.fields'?: Array<
			| 'contained_within'
			| 'country'
			| 'country_code'
			| 'full_name'
			| 'geo'
			| 'id'
			| 'name'
			| 'place_type'
		>;
	};
	'posts.repostedBy': {
		id: TwitterPostIdInput;
		max_results?: number;
		/** A base32hex-encoded pagination token. */
		pagination_token?: string;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			'affiliation' | 'most_recent_post_id' | 'pinned_post_id'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
	};
	'posts.reposts': {
		id: TwitterPostIdInput;
		max_results?: number;
		/** A base32hex-encoded pagination token. */
		pagination_token?: string;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			| 'article.cover_media'
			| 'article.media_entities'
			| 'attachments.media_keys'
			| 'attachments.media_source_tweet'
			| 'attachments.poll_ids'
			| 'author_id'
			| 'edit_history_post_ids'
			| 'entities.mentions.username'
			| 'geo.place_id'
			| 'in_reply_to_user_id'
			| 'referenced_posts'
			| 'username'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of Media fields to display. */
		'media.fields'?: Array<
			| 'alt_text'
			| 'duration_ms'
			| 'height'
			| 'media_key'
			| 'non_public_metrics'
			| 'organic_metrics'
			| 'preview_image_url'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'revenue'
			| 'type'
			| 'url'
			| 'variants'
			| 'width'
		>;
		/** A comma separated list of Poll fields to display. */
		'poll.fields'?: Array<
			'duration_minutes' | 'end_datetime' | 'id' | 'options' | 'voting_status'
		>;
		/** A comma separated list of Place fields to display. */
		'place.fields'?: Array<
			| 'contained_within'
			| 'country'
			| 'country_code'
			| 'full_name'
			| 'geo'
			| 'id'
			| 'name'
			| 'place_type'
		>;
	};
	'posts.search.all': {
		query: string;
		start_time?: string;
		end_time?: string;
		since_id?: string;
		until_id?: string;
		max_results?: number;
		/** A base32hex-encoded pagination token. */
		next_token?: string;
		/** A base32hex-encoded pagination token. */
		pagination_token?: string;
		sort_order?: 'recency' | 'relevancy';
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			| 'article.cover_media'
			| 'article.media_entities'
			| 'attachments.media_keys'
			| 'attachments.media_source_tweet'
			| 'attachments.poll_ids'
			| 'author_id'
			| 'edit_history_post_ids'
			| 'entities.mentions.username'
			| 'geo.place_id'
			| 'in_reply_to_user_id'
			| 'referenced_posts'
			| 'username'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of Media fields to display. */
		'media.fields'?: Array<
			| 'alt_text'
			| 'duration_ms'
			| 'height'
			| 'media_key'
			| 'non_public_metrics'
			| 'organic_metrics'
			| 'preview_image_url'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'revenue'
			| 'type'
			| 'url'
			| 'variants'
			| 'width'
		>;
		/** A comma separated list of Poll fields to display. */
		'poll.fields'?: Array<
			'duration_minutes' | 'end_datetime' | 'id' | 'options' | 'voting_status'
		>;
		/** A comma separated list of Place fields to display. */
		'place.fields'?: Array<
			| 'contained_within'
			| 'country'
			| 'country_code'
			| 'full_name'
			| 'geo'
			| 'id'
			| 'name'
			| 'place_type'
		>;
	};
	'posts.search.recent': {
		query: string;
		max_results?: number;
		/** A base32hex-encoded pagination token. */
		next_token?: string;
		/** A base32hex-encoded pagination token. */
		pagination_token?: string;
		/** Must be within the last 7 days. */
		start_time?: string;
		end_time?: string;
		since_id?: string;
		until_id?: string;
		sort_order?: 'recency' | 'relevancy';
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			| 'article.cover_media'
			| 'article.media_entities'
			| 'attachments.media_keys'
			| 'attachments.media_source_tweet'
			| 'attachments.poll_ids'
			| 'author_id'
			| 'edit_history_post_ids'
			| 'entities.mentions.username'
			| 'geo.place_id'
			| 'in_reply_to_user_id'
			| 'referenced_posts'
			| 'username'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of Media fields to display. */
		'media.fields'?: Array<
			| 'alt_text'
			| 'duration_ms'
			| 'height'
			| 'media_key'
			| 'non_public_metrics'
			| 'organic_metrics'
			| 'preview_image_url'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'revenue'
			| 'type'
			| 'url'
			| 'variants'
			| 'width'
		>;
		/** A comma separated list of Poll fields to display. */
		'poll.fields'?: Array<
			'duration_minutes' | 'end_datetime' | 'id' | 'options' | 'voting_status'
		>;
		/** A comma separated list of Place fields to display. */
		'place.fields'?: Array<
			| 'contained_within'
			| 'country'
			| 'country_code'
			| 'full_name'
			| 'geo'
			| 'id'
			| 'name'
			| 'place_type'
		>;
	};
	'posts.streamLinks.create': {
		webhook_id: string;
	};
	'posts.streamLinks.delete': {
		webhook_id: string;
	};
	'posts.streamLinks.list': Record<string, never>;
	'posts.streamRules.counts': {
		'rules_count.fields'?: string;
	};
	'posts.streamRules.list': {
		ids?: Array<string>;
		max_results?: number;
		/** A base32hex-encoded pagination token that decodes to 8 bytes. */
		pagination_token?: string;
	};
	'posts.streamRules.update': {
		dry_run?: boolean;
		delete_all?: boolean;
		/** Rules to add. */
		add?: Array<TwitterUpdateRulesAddInput>;
		/** Rules to delete by id or by value. */
		delete?: TwitterUpdateRulesDeleteInput;
	};
	'sources.create': {
		/** Label for the source. */
		name: string;
		/** Ingest region, as returned by GET /2/region. us-west-1 and us-west-2 ingest in US West; us-east-1, us-east-2, ca-central-1, sa-east-1, eu-west-1, eu-west-2, eu-west-3, eu-central-1, eu-north-1, ap-south-1, ap-northeast-1, ap-northeast-2, ap-southeast-1 and ap-southeast-2 ingest in US East. The… */
		region: string;
	};
	'sources.delete': {
		/** Source id (19 digits), from GET /2/sources. */
		id: string;
	};
	'sources.get': {
		/** Source id (19 digits), from GET /2/sources. */
		id: string;
	};
	'sources.getIngestRegion': Record<string, never>;
	'sources.getStreamKey': {
		/** Source id (19 digits), from GET /2/sources. */
		id: string;
	};
	'sources.list': Record<string, never>;
	'sources.rename': {
		/** Source id (19 digits), from GET /2/sources. */
		id: string;
		/** New label for the source. */
		name: string;
	};
	'spaces.get': {
		id: string;
		/** A comma separated list of Space fields to display. */
		'space.fields'?: Array<
			| 'created_at'
			| 'ended_at'
			| 'id'
			| 'is_ticketed'
			| 'lang'
			| 'participant_count'
			| 'scheduled_start'
			| 'started_at'
			| 'state'
			| 'subscriber_count'
			| 'title'
			| 'updated_at'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			| 'creator_id'
			| 'host_ids'
			| 'invited_user_ids'
			| 'speaker_ids'
			| 'topic_ids'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of Topic fields to display. */
		'topic.fields'?: Array<'description' | 'id' | 'name'>;
	};
	'spaces.getByCreators': {
		user_ids: Array<string>;
		/** A comma separated list of Space fields to display. */
		'space.fields'?: Array<
			| 'created_at'
			| 'ended_at'
			| 'id'
			| 'is_ticketed'
			| 'lang'
			| 'participant_count'
			| 'scheduled_start'
			| 'started_at'
			| 'state'
			| 'subscriber_count'
			| 'title'
			| 'updated_at'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			| 'creator_id'
			| 'host_ids'
			| 'invited_user_ids'
			| 'speaker_ids'
			| 'topic_ids'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of Topic fields to display. */
		'topic.fields'?: Array<'description' | 'id' | 'name'>;
	};
	'spaces.getMany': {
		ids: Array<string>;
		/** A comma separated list of Space fields to display. */
		'space.fields'?: Array<
			| 'created_at'
			| 'ended_at'
			| 'id'
			| 'is_ticketed'
			| 'lang'
			| 'participant_count'
			| 'scheduled_start'
			| 'started_at'
			| 'state'
			| 'subscriber_count'
			| 'title'
			| 'updated_at'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			| 'creator_id'
			| 'host_ids'
			| 'invited_user_ids'
			| 'speaker_ids'
			| 'topic_ids'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of Topic fields to display. */
		'topic.fields'?: Array<'description' | 'id' | 'name'>;
	};
	'spaces.listBuyers': {
		id: string;
		max_results?: number;
		/** A base32hex-encoded pagination token. */
		pagination_token?: string;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			'affiliation' | 'most_recent_post_id' | 'pinned_post_id'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
	};
	'spaces.listPosts': {
		id: string;
		max_results?: number;
		/** A base32hex-encoded pagination token. */
		pagination_token?: string;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			| 'article.cover_media'
			| 'article.media_entities'
			| 'attachments.media_keys'
			| 'attachments.media_source_tweet'
			| 'attachments.poll_ids'
			| 'author_id'
			| 'edit_history_post_ids'
			| 'entities.mentions.username'
			| 'geo.place_id'
			| 'in_reply_to_user_id'
			| 'referenced_posts'
			| 'username'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of Media fields to display. */
		'media.fields'?: Array<
			| 'alt_text'
			| 'duration_ms'
			| 'height'
			| 'media_key'
			| 'non_public_metrics'
			| 'organic_metrics'
			| 'preview_image_url'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'revenue'
			| 'type'
			| 'url'
			| 'variants'
			| 'width'
		>;
		/** A comma separated list of Poll fields to display. */
		'poll.fields'?: Array<
			'duration_minutes' | 'end_datetime' | 'id' | 'options' | 'voting_status'
		>;
		/** A comma separated list of Place fields to display. */
		'place.fields'?: Array<
			| 'contained_within'
			| 'country'
			| 'country_code'
			| 'full_name'
			| 'geo'
			| 'id'
			| 'name'
			| 'place_type'
		>;
	};
	'spaces.search': {
		query: string;
		state?: 'live' | 'scheduled' | 'all';
		max_results?: number;
		/** A comma separated list of Space fields to display. */
		'space.fields'?: Array<
			| 'created_at'
			| 'ended_at'
			| 'id'
			| 'is_ticketed'
			| 'lang'
			| 'participant_count'
			| 'scheduled_start'
			| 'started_at'
			| 'state'
			| 'subscriber_count'
			| 'title'
			| 'updated_at'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			| 'creator_id'
			| 'host_ids'
			| 'invited_user_ids'
			| 'speaker_ids'
			| 'topic_ids'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of Topic fields to display. */
		'topic.fields'?: Array<'description' | 'id' | 'name'>;
	};
	'trends.byWoeid': {
		woeid: number;
		max_trends?: number;
		/** A comma separated list of Trend fields to display. */
		'trend.fields'?: Array<'trend_name' | 'tweet_count'>;
	};
	'trends.locations': {
		/** A comma separated list of TrendLocation fields to display. */
		'trend_location.fields'?: Array<
			'country' | 'country_code' | 'name' | 'parent_id' | 'place_type' | 'woeid'
		>;
	};
	'trends.personalized': {
		/** A comma separated list of PersonalizedTrend fields to display. */
		'personalized_trend.fields'?: Array<
			'category' | 'post_count' | 'trend_name' | 'trending_since'
		>;
	};
	'usage.credits': Record<string, never>;
	'usage.get': {
		days?: number;
		/** A comma separated list of Usage fields to display. */
		'usage.fields'?: Array<
			| 'cap_reset_day'
			| 'daily_client_app_usage'
			| 'daily_project_usage'
			| 'project_cap'
			| 'project_id'
			| 'project_usage'
		>;
	};
	'users.affiliates': {
		id: TwitterUserIdInput;
		max_results?: number;
		/** A 64-bit signed integer. */
		pagination_token?: string;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			'affiliation' | 'most_recent_post_id' | 'pinned_post_id'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
	};
	'users.blockDms': {
		id: TwitterUserIdInput;
	};
	'users.blocking.block': {
		id: TwitterUserIdInput;
		target_user_id: string;
	};
	'users.blocking.list': {
		id: TwitterUserIdInput;
		max_results?: number;
		pagination_token?: string;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			'affiliation' | 'most_recent_post_id' | 'pinned_post_id'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
	};
	'users.blocking.unblock': {
		source_user_id: TwitterUserIdInput;
		target_user_id: TwitterUserIdInput;
	};
	'users.bookmarks.create': {
		/** The authenticated user's numeric ID, not `me`: the `id` from Get My User (`GET /2/users/me`). */
		id: TwitterUserIdInput;
		/** Optional ID of the Bookmark folder to add the Post(s) to. When omitted, Posts are added to the user's top-level Bookmarks only. A bulk request uses this one folder for every ID. */
		folder_id?: string;
		/** The ID of the Post to add to the user's Bookmarks. Mutually exclusive with `tweet_ids`. */
		tweet_id?: string;
		/** Post IDs to add to the user's Bookmarks. At most 25. Mutually exclusive with `tweet_id`. */
		tweet_ids?: Array<string>;
	};
	'users.bookmarks.delete': {
		/** The authenticated user's numeric ID, not `me`: the `id` from Get My User (`GET /2/users/me`). */
		id: TwitterUserIdInput;
		tweet_id: TwitterPostIdInput;
	};
	'users.bookmarks.folders.create': {
		/** The authenticated user's numeric ID, not `me`: the `id` from Get My User (`GET /2/users/me`). */
		id: TwitterUserIdInput;
		/** Name of the Bookmark folder (1-25 characters). */
		name: string;
	};
	'users.bookmarks.folders.list': {
		/** The authenticated user's numeric ID, not `me`: the `id` from Get My User (`GET /2/users/me`). */
		id: TwitterUserIdInput;
		max_results?: number;
		/** A base32hex-encoded pagination token. */
		pagination_token?: string;
	};
	'users.bookmarks.folders.listPosts': {
		/** The authenticated user's numeric ID, not `me`: the `id` from Get My User (`GET /2/users/me`). */
		id: TwitterUserIdInput;
		folder_id: string;
		max_results?: number;
		/** A base32hex-encoded pagination token. */
		pagination_token?: string;
	};
	'users.bookmarks.list': {
		/** The authenticated user's numeric ID, not `me`: the `id` from Get My User (`GET /2/users/me`). */
		id: TwitterUserIdInput;
		max_results?: number;
		/** A base32hex-encoded pagination token. */
		pagination_token?: string;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			| 'article.cover_media'
			| 'article.media_entities'
			| 'attachments.media_keys'
			| 'attachments.media_source_tweet'
			| 'attachments.poll_ids'
			| 'author_id'
			| 'edit_history_post_ids'
			| 'entities.mentions.username'
			| 'geo.place_id'
			| 'in_reply_to_user_id'
			| 'referenced_posts'
			| 'username'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of Media fields to display. */
		'media.fields'?: Array<
			| 'alt_text'
			| 'duration_ms'
			| 'height'
			| 'media_key'
			| 'non_public_metrics'
			| 'organic_metrics'
			| 'preview_image_url'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'revenue'
			| 'type'
			| 'url'
			| 'variants'
			| 'width'
		>;
		/** A comma separated list of Poll fields to display. */
		'poll.fields'?: Array<
			'duration_minutes' | 'end_datetime' | 'id' | 'options' | 'voting_status'
		>;
		/** A comma separated list of Place fields to display. */
		'place.fields'?: Array<
			| 'contained_within'
			| 'country'
			| 'country_code'
			| 'full_name'
			| 'geo'
			| 'id'
			| 'name'
			| 'place_type'
		>;
	};
	'users.broadcasts.create': {
		id: TwitterUserIdInput;
		/** Ignored. */
		is_low_latency?: boolean | string | number;
		/** Ignored: the source sets the region. */
		region?: string;
		/** The source's `rtmp_stream_key`. */
		source_id: string;
	};
	'users.broadcasts.delete': {
		id: TwitterUserIdInput;
		broadcast_id: string;
	};
	'users.broadcasts.get': {
		id: TwitterUserIdInput;
		broadcast_id: string;
	};
	'users.broadcasts.list': {
		id: TwitterUserIdInput;
		/** `next_token.offset` from the previous page. Empty reads the first page. */
		pagination_token?: string;
	};
	'users.broadcasts.updateState': {
		id: TwitterUserIdInput;
		broadcast_id: string;
		/** Who can chat: 0 default, 1 chat off, 2 everyone, 3 verified accounts, 4 accounts the host follows, 5 the host's subscribers, 6 accounts followed by an account the host follows. A numeric string is also accepted. `PUBLISH` only. */
		chat_option?: number | string;
		/** Broadcast language. `PUBLISH` only. */
		locale?: string;
		/** Skip the announcing Post. Unset keeps the broadcast's setting, which defaults to posting. `"true"`, `"false"`, `1` and `0` are also accepted. `PUBLISH` only. */
		should_not_tweet?: boolean | string | number;
		/** `PUBLISH` or `END`. */
		state: string;
		/** Broadcast title. `PUBLISH` only. */
		title?: string;
	};
	'users.followedLists.follow': {
		id: TwitterUserIdInput;
		list_id: string;
	};
	'users.followedLists.list': {
		id: TwitterUserIdInput;
		max_results?: number;
		/** A 64-bit signed integer. */
		pagination_token?: string;
		/** A comma separated list of List fields to display. */
		'list.fields'?: Array<
			| 'created_at'
			| 'description'
			| 'follower_count'
			| 'id'
			| 'member_count'
			| 'name'
			| 'private'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<'owner_id'>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
	};
	'users.followedLists.unfollow': {
		id: TwitterUserIdInput;
		list_id: TwitterListIdInput;
	};
	'users.followers': {
		id: TwitterUserIdInput;
		/** The maximum number of users to return. */
		max_results?: number;
		/** The next_token or previous_token from a previous response, to fetch that page. A base32hex-encoded pagination token. */
		pagination_token?: string;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			'affiliation' | 'most_recent_post_id' | 'pinned_post_id'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
	};
	'users.following.follow': {
		id: TwitterUserIdInput;
		target_user_id: string;
	};
	'users.following.list': {
		id: TwitterUserIdInput;
		/** The maximum number of users to return. */
		max_results?: number;
		/** The next_token or previous_token from a previous response, to fetch that page. A base32hex-encoded pagination token. */
		pagination_token?: string;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			'affiliation' | 'most_recent_post_id' | 'pinned_post_id'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
	};
	'users.following.unfollow': {
		source_user_id: TwitterUserIdInput;
		target_user_id: TwitterUserIdInput;
	};
	'users.get': {
		id: TwitterUserIdInput;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			'affiliation' | 'most_recent_post_id' | 'pinned_post_id'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
	};
	'users.getByUsername': {
		username: string;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			'affiliation' | 'most_recent_post_id' | 'pinned_post_id'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
	};
	'users.getMany': {
		ids: Array<TwitterUserIdInput>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			'affiliation' | 'most_recent_post_id' | 'pinned_post_id'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
	};
	'users.getManyByUsernames': {
		usernames: Array<string>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			'affiliation' | 'most_recent_post_id' | 'pinned_post_id'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
	};
	'users.likes.like': {
		id: TwitterUserIdInput;
		tweet_id: string;
	};
	'users.likes.list': {
		id: TwitterUserIdInput;
		max_results?: number;
		/** A base32hex-encoded pagination token. */
		pagination_token?: string;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			| 'article.cover_media'
			| 'article.media_entities'
			| 'attachments.media_keys'
			| 'attachments.media_source_tweet'
			| 'attachments.poll_ids'
			| 'author_id'
			| 'edit_history_post_ids'
			| 'entities.mentions.username'
			| 'geo.place_id'
			| 'in_reply_to_user_id'
			| 'referenced_posts'
			| 'username'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of Media fields to display. */
		'media.fields'?: Array<
			| 'alt_text'
			| 'duration_ms'
			| 'height'
			| 'media_key'
			| 'non_public_metrics'
			| 'organic_metrics'
			| 'preview_image_url'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'revenue'
			| 'type'
			| 'url'
			| 'variants'
			| 'width'
		>;
		/** A comma separated list of Poll fields to display. */
		'poll.fields'?: Array<
			'duration_minutes' | 'end_datetime' | 'id' | 'options' | 'voting_status'
		>;
		/** A comma separated list of Place fields to display. */
		'place.fields'?: Array<
			| 'contained_within'
			| 'country'
			| 'country_code'
			| 'full_name'
			| 'geo'
			| 'id'
			| 'name'
			| 'place_type'
		>;
	};
	'users.likes.unlike': {
		id: TwitterUserIdInput;
		tweet_id: TwitterPostIdInput;
	};
	'users.listMemberships': {
		id: TwitterUserIdInput;
		max_results?: number;
		pagination_token?: string;
		/** A comma separated list of List fields to display. */
		'list.fields'?: Array<
			| 'created_at'
			| 'description'
			| 'follower_count'
			| 'id'
			| 'member_count'
			| 'name'
			| 'private'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<'owner_id'>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
	};
	'users.me': {
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			'affiliation' | 'most_recent_post_id' | 'pinned_post_id'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
	};
	'users.mentions': {
		id: TwitterUserIdInput;
		max_results?: number;
		/** A base32hex-encoded pagination token. */
		pagination_token?: string;
		/** Must be on or after 2010-11-06. */
		start_time?: string;
		/** Must be on or after 2010-11-06. */
		end_time?: string;
		since_id?: string;
		until_id?: string;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			| 'article.cover_media'
			| 'article.media_entities'
			| 'attachments.media_keys'
			| 'attachments.media_source_tweet'
			| 'attachments.poll_ids'
			| 'author_id'
			| 'edit_history_post_ids'
			| 'entities.mentions.username'
			| 'geo.place_id'
			| 'in_reply_to_user_id'
			| 'referenced_posts'
			| 'username'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of Media fields to display. */
		'media.fields'?: Array<
			| 'alt_text'
			| 'duration_ms'
			| 'height'
			| 'media_key'
			| 'non_public_metrics'
			| 'organic_metrics'
			| 'preview_image_url'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'revenue'
			| 'type'
			| 'url'
			| 'variants'
			| 'width'
		>;
		/** A comma separated list of Poll fields to display. */
		'poll.fields'?: Array<
			'duration_minutes' | 'end_datetime' | 'id' | 'options' | 'voting_status'
		>;
		/** A comma separated list of Place fields to display. */
		'place.fields'?: Array<
			| 'contained_within'
			| 'country'
			| 'country_code'
			| 'full_name'
			| 'geo'
			| 'id'
			| 'name'
			| 'place_type'
		>;
	};
	'users.muting.list': {
		id: TwitterUserIdInput;
		max_results?: number;
		pagination_token?: string;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			'affiliation' | 'most_recent_post_id' | 'pinned_post_id'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
	};
	'users.muting.mute': {
		id: TwitterUserIdInput;
		target_user_id: string;
	};
	'users.muting.unmute': {
		source_user_id: TwitterUserIdInput;
		target_user_id: TwitterUserIdInput;
	};
	'users.myFollowers': {
		/** The maximum number of users to return. */
		max_results?: number;
		/** The next_token or previous_token from a previous response, to fetch that page. A base32hex-encoded pagination token. */
		pagination_token?: string;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			'affiliation' | 'most_recent_post_id' | 'pinned_post_id'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
	};
	'users.myFollowing': {
		/** The maximum number of users to return. */
		max_results?: number;
		/** The next_token or previous_token from a previous response, to fetch that page. A base32hex-encoded pagination token. */
		pagination_token?: string;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			'affiliation' | 'most_recent_post_id' | 'pinned_post_id'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
	};
	'users.ownedLists': {
		id: TwitterUserIdInput;
		max_results?: number;
		/** A 64-bit signed integer. */
		pagination_token?: string;
		/** A comma separated list of List fields to display. */
		'list.fields'?: Array<
			| 'created_at'
			| 'description'
			| 'follower_count'
			| 'id'
			| 'member_count'
			| 'name'
			| 'private'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<'owner_id'>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
	};
	'users.pinnedLists.list': {
		id: TwitterUserIdInput;
		/** A comma separated list of List fields to display. */
		'list.fields'?: Array<
			| 'created_at'
			| 'description'
			| 'follower_count'
			| 'id'
			| 'member_count'
			| 'name'
			| 'private'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<'owner_id'>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
	};
	'users.pinnedLists.pin': {
		id: TwitterUserIdInput;
		list_id: string;
	};
	'users.pinnedLists.unpin': {
		id: TwitterUserIdInput;
		list_id: TwitterListIdInput;
	};
	'users.posts': {
		id: TwitterUserIdInput;
		max_results?: number;
		/** A base32hex-encoded pagination token. */
		pagination_token?: string;
		/** Must be on or after 2010-11-06. */
		start_time?: string;
		/** Must be on or after 2010-11-06. */
		end_time?: string;
		since_id?: string;
		until_id?: string;
		exclude?: Array<'replies' | 'retweets'>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			| 'article.cover_media'
			| 'article.media_entities'
			| 'attachments.media_keys'
			| 'attachments.media_source_tweet'
			| 'attachments.poll_ids'
			| 'author_id'
			| 'edit_history_post_ids'
			| 'entities.mentions.username'
			| 'geo.place_id'
			| 'in_reply_to_user_id'
			| 'referenced_posts'
			| 'username'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of Media fields to display. */
		'media.fields'?: Array<
			| 'alt_text'
			| 'duration_ms'
			| 'height'
			| 'media_key'
			| 'non_public_metrics'
			| 'organic_metrics'
			| 'preview_image_url'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'revenue'
			| 'type'
			| 'url'
			| 'variants'
			| 'width'
		>;
		/** A comma separated list of Poll fields to display. */
		'poll.fields'?: Array<
			'duration_minutes' | 'end_datetime' | 'id' | 'options' | 'voting_status'
		>;
		/** A comma separated list of Place fields to display. */
		'place.fields'?: Array<
			| 'contained_within'
			| 'country'
			| 'country_code'
			| 'full_name'
			| 'geo'
			| 'id'
			| 'name'
			| 'place_type'
		>;
	};
	'users.publicKeys.add': {
		id: TwitterUserIdInput;
		/** Public key registration payload. */
		public_key: TwitterAddUserPublicKeyPublicKeyInput;
	};
	'users.publicKeys.get': {
		/** Numeric user ID, not `me`. For your own keys, use the `id` from Get My User (`GET /2/users/me`). */
		id: TwitterUserIdInput;
		/** A comma separated list of PublicKey fields to display. */
		'public_key.fields'?: Array<
			| 'identity_public_key_signature'
			| 'juicebox_config'
			| 'public_key'
			| 'public_key_version'
			| 'signing_public_key'
			| 'user_id'
		>;
	};
	'users.publicKeys.getMany': {
		/** Comma-separated numeric user IDs (1-100), not @usernames. */
		ids: Array<TwitterPublicKeyIdInput>;
		/** A comma separated list of PublicKey fields to display. */
		'public_key.fields'?: Array<
			| 'identity_public_key_signature'
			| 'juicebox_config'
			| 'public_key'
			| 'public_key_version'
			| 'signing_public_key'
			| 'user_id'
		>;
	};
	'users.reposts.create': {
		id: TwitterUserIdInput;
		tweet_id: string;
	};
	'users.reposts.delete': {
		id: TwitterUserIdInput;
		source_tweet_id: string;
	};
	'users.repostsOfMe': {
		max_results?: number;
		/** A base32hex-encoded pagination token. */
		pagination_token?: string;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			| 'article.cover_media'
			| 'article.media_entities'
			| 'attachments.media_keys'
			| 'attachments.media_source_tweet'
			| 'attachments.poll_ids'
			| 'author_id'
			| 'edit_history_post_ids'
			| 'entities.mentions.username'
			| 'geo.place_id'
			| 'in_reply_to_user_id'
			| 'referenced_posts'
			| 'username'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of Media fields to display. */
		'media.fields'?: Array<
			| 'alt_text'
			| 'duration_ms'
			| 'height'
			| 'media_key'
			| 'non_public_metrics'
			| 'organic_metrics'
			| 'preview_image_url'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'revenue'
			| 'type'
			| 'url'
			| 'variants'
			| 'width'
		>;
		/** A comma separated list of Poll fields to display. */
		'poll.fields'?: Array<
			'duration_minutes' | 'end_datetime' | 'id' | 'options' | 'voting_status'
		>;
		/** A comma separated list of Place fields to display. */
		'place.fields'?: Array<
			| 'contained_within'
			| 'country'
			| 'country_code'
			| 'full_name'
			| 'geo'
			| 'id'
			| 'name'
			| 'place_type'
		>;
	};
	'users.search': {
		/** A name or @username (1-50 chars): letters and digits in any language, spaces, and _ ' . - @ & " */
		query: string;
		max_results?: number;
		next_token?: string;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			'affiliation' | 'most_recent_post_id' | 'pinned_post_id'
		>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
	};
	'users.sources.create': {
		id: TwitterUserIdInput;
		/** Label for the source. */
		name: string;
		/** Ingest data center, `atla` or `pdxa` (default). The AWS regions us-west-1 and us-west-2 map to `pdxa`; us-east-1, us-east-2, ca-central-1, sa-east-1, eu-west-1, eu-west-2, eu-west-3, eu-central-1, eu-north-1, ap-south-1, ap-northeast-1, ap-northeast-2, ap-southeast-1 and ap-southeast-2 map to… */
		region?: string;
	};
	'users.sources.delete': {
		id: TwitterUserIdInput;
		source_id: string;
	};
	'users.sources.get': {
		id: TwitterUserIdInput;
		source_id: string;
	};
	'users.sources.list': {
		id: TwitterUserIdInput;
	};
	'users.sources.rename': {
		id: TwitterUserIdInput;
		source_id: string;
		/** New label for the source. */
		name: string;
	};
	'users.timeline': {
		id: TwitterUserIdInput;
		max_results?: number;
		/** A base32hex-encoded pagination token. */
		pagination_token?: string;
		/** Must be on or after 2010-11-06. */
		start_time?: string;
		/** Must be on or after 2010-11-06. */
		end_time?: string;
		since_id?: string;
		until_id?: string;
		exclude?: Array<'replies' | 'retweets'>;
		/** A comma separated list of Post fields to display. */
		'post.fields'?: Array<
			| 'article'
			| 'article_title'
			| 'attachments'
			| 'card_uri'
			| 'community_id'
			| 'context_annotations'
			| 'conversation_id'
			| 'created_at'
			| 'display_text_range'
			| 'edit_controls'
			| 'entities'
			| 'geo'
			| 'id'
			| 'lang'
			| 'matched_media_notes'
			| 'media_metadata'
			| 'non_public_metrics'
			| 'note_post'
			| 'note_request_suggestions'
			| 'organic_metrics'
			| 'paid_partnership'
			| 'possibly_sensitive'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'reply_settings'
			| 'scopes'
			| 'source'
			| 'suggested_source_links'
			| 'suggested_source_links_with_counts'
			| 'text'
			| 'withheld'
		>;
		/** A comma separated list of fields to expand. */
		expansions?: Array<
			| 'article.cover_media'
			| 'article.media_entities'
			| 'attachments.media_keys'
			| 'attachments.media_source_tweet'
			| 'attachments.poll_ids'
			| 'author_id'
			| 'edit_history_post_ids'
			| 'entities.mentions.username'
			| 'geo.place_id'
			| 'in_reply_to_user_id'
			| 'referenced_posts'
			| 'username'
		>;
		/** A comma separated list of User fields to display. */
		'user.fields'?: Array<
			| 'active_follower_count'
			| 'confirmed_email'
			| 'connection_status'
			| 'created_at'
			| 'description'
			| 'entities'
			| 'id'
			| 'is_identity_verified'
			| 'location'
			| 'name'
			| 'org_only'
			| 'parody'
			| 'profile_banner_url'
			| 'profile_image_url'
			| 'protected'
			| 'public_metrics'
			| 'receives_your_chat'
			| 'receives_your_dm'
			| 'subscriber_count'
			| 'subscribes_to_you'
			| 'subscription'
			| 'subscription_type'
			| 'url'
			| 'username'
			| 'verified'
			| 'verified_followers_count'
			| 'verified_type'
			| 'withheld'
		>;
		/** A comma separated list of Media fields to display. */
		'media.fields'?: Array<
			| 'alt_text'
			| 'duration_ms'
			| 'height'
			| 'media_key'
			| 'non_public_metrics'
			| 'organic_metrics'
			| 'preview_image_url'
			| 'promoted_metrics'
			| 'public_metrics'
			| 'revenue'
			| 'type'
			| 'url'
			| 'variants'
			| 'width'
		>;
		/** A comma separated list of Poll fields to display. */
		'poll.fields'?: Array<
			'duration_minutes' | 'end_datetime' | 'id' | 'options' | 'voting_status'
		>;
		/** A comma separated list of Place fields to display. */
		'place.fields'?: Array<
			| 'contained_within'
			| 'country'
			| 'country_code'
			| 'full_name'
			| 'geo'
			| 'id'
			| 'name'
			| 'place_type'
		>;
	};
	'users.unblockDms': {
		id: TwitterUserIdInput;
	};
	'webhooks.create': {
		/** The URL the webhook delivers events to. */
		url: string;
	};
	'webhooks.delete': {
		webhook_id: string;
	};
	'webhooks.list': {
		/** A comma separated list of WebhookConfig fields to display. */
		'webhook_config.fields'?: Array<'created_at' | 'id' | 'url' | 'valid'>;
	};
	'webhooks.replay': {
		/** The oldest (inclusive) UTC timestamp from which events are replayed, in yyyymmddhhmm format. */
		from_date: string;
		/** The newest (inclusive) UTC timestamp up to which events are replayed, in yyyymmddhhmm format. */
		to_date: string;
		/** The ID of the webhook to replay events to. */
		webhook_id: string;
	};
	'webhooks.validate': {
		webhook_id: string;
	};
};

export type TwitterOperationOutputs = {
	'account.ensure': TwitterEnsureAccountResponse;
	'account.get': TwitterGetDeveloperAccountResponse;
	'accountActivity.subscriptions.count': TwitterGetAccountActivitySubscriptionCountResponse;
	'accountActivity.subscriptions.create': TwitterCreateAccountActivitySubscriptionResponse;
	'accountActivity.subscriptions.delete': TwitterDeleteAccountActivitySubscriptionResponse;
	'accountActivity.subscriptions.list': TwitterGetAccountActivitySubscriptionsResponse;
	'accountActivity.subscriptions.validate': TwitterValidateAccountActivitySubscriptionResponse;
	'activity.subscriptions.create': TwitterCreateActivitySubscriptionResponse;
	'activity.subscriptions.delete': TwitterDeleteActivitySubscriptionResponse;
	'activity.subscriptions.deleteMany': TwitterDeleteActivitySubscriptionsByIdsResponse;
	'activity.subscriptions.list': TwitterGetActivitySubscriptionsResponse;
	'activity.subscriptions.update': TwitterUpdateActivitySubscriptionResponse;
	'articles.createDraft': TwitterArticleCreateDraftResponse;
	'articles.publish': TwitterArticlePublishResponse;
	'bots.create': TwitterCreateBotResponse;
	'bots.delete': TwitterDeleteBotResponse;
	'bots.list': TwitterGetBotsResponse;
	'bots.token.revoke': TwitterRevokeBotTokenResponse;
	'bots.token.rotate': TwitterRotateBotTokenResponse;
	'bots.update': TwitterUpdateBotResponse;
	'broadcasts.chat.deleteMessage': TwitterDeleteBroadcastChatMessageResponse;
	'broadcasts.chat.list': TwitterGetBroadcastChatResponse;
	'broadcasts.chat.muteUser': TwitterMuteBroadcastChatUserResponse;
	'broadcasts.chat.send': TwitterSendBroadcastChatResponse;
	'broadcasts.chat.unmuteUser': TwitterUnmuteBroadcastChatUserResponse;
	'broadcasts.chatModerators.add': TwitterAddChatModeratorResponse;
	'broadcasts.chatModerators.list': TwitterGetChatModeratorsResponse;
	'broadcasts.chatModerators.remove': TwitterRemoveChatModeratorResponse;
	'broadcasts.chatMutes.create': TwitterMuteChatUserResponse;
	'broadcasts.chatMutes.delete': TwitterUnmuteChatUserResponse;
	'broadcasts.chatMutes.list': TwitterGetChatMutedUsersResponse;
	'broadcasts.create': TwitterCreateBroadcastResponse;
	'broadcasts.delete': TwitterDeleteBroadcastResponse;
	'broadcasts.end': TwitterUpdateBroadcastStateResponse;
	'broadcasts.get': TwitterGetBroadcastResponse;
	'broadcasts.list': TwitterListBroadcastsResponse;
	'broadcasts.listCategories': TwitterListLiveCategoriesResponse;
	'broadcasts.scheduled.create': TwitterCreateScheduledBroadcastResponse;
	'broadcasts.scheduled.delete': TwitterDeleteScheduledBroadcastResponse;
	'broadcasts.scheduled.get': TwitterGetScheduledBroadcastResponse;
	'broadcasts.scheduled.goLive': TwitterGoLiveScheduledBroadcastResponse;
	'broadcasts.scheduled.list': TwitterListScheduledBroadcastsResponse;
	'broadcasts.scheduled.update': TwitterUpdateScheduledBroadcastResponse;
	'broadcasts.update': TwitterUpdateBroadcastResponse;
	'calls.create': TwitterCreateCallResponse;
	'calls.get': TwitterGetCallResponse;
	'calls.join': TwitterJoinCallResponse;
	'calls.leave': TwitterLeaveCallResponse;
	'calls.scheduled.cancel': TwitterCancelScheduledCallResponse;
	'calls.scheduled.create': TwitterScheduleCallResponse;
	'calls.scheduled.get': TwitterGetScheduledCallResponse;
	'calls.scheduled.list': TwitterListScheduledCallsResponse;
	'calls.scheduled.respond': TwitterRespondToScheduledCallResponse;
	'calls.scheduled.update': TwitterUpdateScheduledCallResponse;
	'chat.conversations.addKeys': TwitterAddConversationKeysResponse;
	'chat.conversations.archive': TwitterArchiveChatConversationResponse;
	'chat.conversations.delete': TwitterDeleteChatConversationResponse;
	'chat.conversations.disableMessageTtl': TwitterDeleteChatConversationMessageTtlResponse;
	'chat.conversations.enableMessageTtl': TwitterUpdateChatConversationMessageTtlResponse;
	'chat.conversations.get': TwitterGetChatConversationResponse;
	'chat.conversations.list': TwitterGetChatConversationsResponse;
	'chat.conversations.listEvents': TwitterGetChatConversationEventsResponse;
	'chat.conversations.listPinnedMessages': TwitterGetChatConversationPinnedMessagesResponse;
	'chat.conversations.markRead': TwitterMarkChatConversationReadResponse;
	'chat.conversations.markUnread': TwitterMarkChatConversationUnreadResponse;
	'chat.conversations.mute': TwitterMuteChatConversationResponse;
	'chat.conversations.sendTyping': TwitterSendChatTypingIndicatorResponse;
	'chat.conversations.unarchive': TwitterUnarchiveChatConversationResponse;
	'chat.conversations.unmute': TwitterUnmuteChatConversationResponse;
	'chat.conversations.updateScreenCapture': TwitterUpdateChatConversationScreenCaptureResponse;
	'chat.groups.adminRequests.approve': TwitterApproveChatGroupAdminRequestResponse;
	'chat.groups.adminRequests.create': TwitterCreateChatGroupAdminRequestResponse;
	'chat.groups.adminRequests.list': TwitterGetChatGroupAdminRequestsResponse;
	'chat.groups.adminRequests.reject': TwitterRejectChatGroupAdminRequestResponse;
	'chat.groups.admins.add': TwitterAddChatGroupAdminsResponse;
	'chat.groups.admins.remove': TwitterRemoveChatGroupAdminsResponse;
	'chat.groups.create': TwitterCreateChatConversationResponse;
	'chat.groups.initialize': TwitterInitializeChatGroupResponse;
	'chat.groups.inviteLink.disable': TwitterDisableChatGroupInviteResponse;
	'chat.groups.inviteLink.enable': TwitterEnableChatGroupInviteResponse;
	'chat.groups.inviteLink.get': TwitterGetChatGroupInviteResponse;
	'chat.groups.joinRequests.create': TwitterCreateChatGroupJoinRequestResponse;
	'chat.groups.joinRequests.reject': TwitterRejectChatGroupJoinRequestsResponse;
	'chat.groups.members.add': TwitterAddChatGroupMembersResponse;
	'chat.groups.members.remove': TwitterRemoveChatGroupMembersResponse;
	'chat.groups.update': TwitterUpdateChatGroupResponse;
	'chat.groups.updateAdminSettings': TwitterUpdateChatGroupAdminSettingsResponse;
	'chat.media.appendUpload': TwitterChatMediaUploadAppendResponse;
	'chat.media.download': FileOutput;
	'chat.media.finalizeUpload': TwitterChatMediaUploadFinalizeResponse;
	'chat.media.initializeUpload': TwitterChatMediaUploadInitializeResponse;
	'chat.messageRequests.accept': TwitterAcceptChatMessageRequestResponse;
	'chat.messageRequests.get': TwitterGetChatMessageRequestResponse;
	'chat.messageRequests.list': TwitterGetChatMessageRequestsResponse;
	'chat.messages.delete': TwitterDeleteChatMessagesResponse;
	'chat.messages.send': TwitterSendChatMessageResponse;
	'chat.settings.get': TwitterGetChatSettingsResponse;
	'chat.settings.update': TwitterUpdateChatSettingsResponse;
	'communities.get': TwitterGetCommunitiesByIdResponse;
	'communities.search': TwitterSearchCommunitiesResponse;
	'communityNotes.create': TwitterCreateCommunityNotesResponse;
	'communityNotes.delete': TwitterDeleteCommunityNotesResponse;
	'communityNotes.evaluate': TwitterEvaluateCommunityNotesResponse;
	'communityNotes.searchEligiblePosts': TwitterSearchEligiblePostsResponse;
	'communityNotes.searchWritten': TwitterSearchCommunityNotesWrittenResponse;
	'compliance.jobs.cancel': TwitterDeleteComplianceJobsByIdResponse;
	'compliance.jobs.create': TwitterCreateComplianceJobsResponse;
	'compliance.jobs.downloadResults': FileOutput;
	'compliance.jobs.get': TwitterGetComplianceJobsByIdResponse;
	'compliance.jobs.list': TwitterGetComplianceJobsResponse;
	'compliance.jobs.upload': TwitterUploadComplianceJobSubmissionResponse;
	'connections.history': TwitterGetConnectionHistoryResponse;
	'connections.terminateAll': TwitterDeleteAllConnectionsResponse;
	'connections.terminateByEndpoint': TwitterDeleteConnectionsByEndpointResponse;
	'connections.terminateMany': TwitterDeleteConnectionsByUuidsResponse;
	'directMessages.conversations.create': TwitterCreateDirectMessagesConversationResponse;
	'directMessages.events.delete': TwitterDeleteDirectMessagesEventsResponse;
	'directMessages.events.get': TwitterGetDirectMessagesEventsByIdResponse;
	'directMessages.events.list': TwitterGetDirectMessagesEventsResponse;
	'directMessages.events.listByConversation': TwitterGetDirectMessagesEventsByConversationIdResponse;
	'directMessages.events.listWithParticipant': TwitterGetDirectMessagesEventsByParticipantIdResponse;
	'directMessages.media.download': FileOutput;
	'directMessages.sendToConversation': TwitterCreateDirectMessagesByConversationIdResponse;
	'directMessages.sendToParticipant': TwitterCreateDirectMessagesByParticipantIdResponse;
	'lists.create': TwitterCreateListsResponse;
	'lists.delete': TwitterDeleteListsResponse;
	'lists.followers.list': TwitterGetListsFollowersResponse;
	'lists.get': TwitterGetListsByIdResponse;
	'lists.members.add': TwitterAddListsMemberResponse;
	'lists.members.list': TwitterGetListsMembersResponse;
	'lists.members.remove': TwitterRemoveListsMemberByUserIdResponse;
	'lists.posts.list': TwitterGetListsPostsResponse;
	'lists.update': TwitterUpdateListsResponse;
	'media.amplify.addPost': TwitterAddPostToAmplifyProgramsResponse;
	'media.amplify.programs.get': TwitterGetAmplifyProgramResponse;
	'media.amplify.programs.list': TwitterGetAmplifyProgramsResponse;
	'media.amplify.programs.listPosts': TwitterGetAmplifyProgramPostsResponse;
	'media.analytics': TwitterGetMediaAnalyticsResponse;
	'media.get': TwitterGetMediaByMediaKeyResponse;
	'media.getMany': TwitterGetMediaByMediaKeysResponse;
	'media.library.add': TwitterAddMediaToLibraryResponse;
	'media.library.listCategories': TwitterGetMediaLibraryCategoriesResponse;
	'media.library.remove': TwitterRemoveMediaFromLibraryResponse;
	'media.library.update': TwitterUpdateMediaInLibraryResponse;
	'media.metadata.create': TwitterCreateMediaMetadataResponse;
	'media.subtitles.create': TwitterCreateMediaSubtitlesResponse;
	'media.subtitles.delete': TwitterDeleteMediaSubtitlesResponse;
	'media.upload.append': TwitterAppendMediaUploadResponse;
	'media.upload.finalize': TwitterFinalizeMediaUploadResponse;
	'media.upload.getStatus': TwitterGetMediaUploadStatusResponse;
	'media.upload.initialize': TwitterInitializeMediaUploadResponse;
	'media.upload.single': TwitterMediaUploadResponse;
	'news.get': TwitterGetNewsResponse;
	'news.search': TwitterSearchNewsResponse;
	'posts.analytics': TwitterGetPostsAnalyticsResponse;
	'posts.counts.all': TwitterGetPostsCountsAllResponse;
	'posts.counts.recent': TwitterGetPostsCountsRecentResponse;
	'posts.create': TwitterCreatePostsResponse;
	'posts.delete': TwitterDeletePostsResponse;
	'posts.drafts.create': TwitterCreatePostDraftResponse;
	'posts.drafts.delete': TwitterDeletePostDraftResponse;
	'posts.drafts.list': TwitterGetPostDraftsResponse;
	'posts.get': TwitterGetPostsByIdResponse;
	'posts.getMany': TwitterGetPostsByIdsResponse;
	'posts.hideReply': TwitterHidePostsReplyResponse;
	'posts.likingUsers': TwitterGetPostsLikingUsersResponse;
	'posts.quotes': TwitterGetPostsQuotedPostsResponse;
	'posts.repostedBy': TwitterGetPostsRepostedByResponse;
	'posts.reposts': TwitterGetPostsRepostsResponse;
	'posts.search.all': TwitterSearchPostsAllResponse;
	'posts.search.recent': TwitterSearchPostsRecentResponse;
	'posts.streamLinks.create': TwitterCreateWebhooksStreamLinkResponse;
	'posts.streamLinks.delete': TwitterDeleteWebhooksStreamLinkResponse;
	'posts.streamLinks.list': TwitterGetWebhooksStreamLinksResponse;
	'posts.streamRules.counts': TwitterGetRuleCountsResponse;
	'posts.streamRules.list': TwitterGetRulesResponse;
	'posts.streamRules.update': TwitterUpdateRulesResponse;
	'sources.create': TwitterCreateSourceResponse;
	'sources.delete': TwitterDeleteSourceResponse;
	'sources.get': TwitterGetSourceResponse;
	'sources.getIngestRegion': TwitterGetRegionResponse;
	'sources.getStreamKey': TwitterGetSourceStreamKeyResponse;
	'sources.list': TwitterListSourcesResponse;
	'sources.rename': TwitterUpdateSourceResponse;
	'spaces.get': TwitterGetSpacesByIdResponse;
	'spaces.getByCreators': TwitterGetSpacesByCreatorIdsResponse;
	'spaces.getMany': TwitterGetSpacesByIdsResponse;
	'spaces.listBuyers': TwitterGetSpacesBuyersResponse;
	'spaces.listPosts': TwitterGetSpacesPostsResponse;
	'spaces.search': TwitterSearchSpacesResponse;
	'trends.byWoeid': TwitterGetTrendsByWoeidResponse;
	'trends.locations': TwitterGetTrendsLocationsResponse;
	'trends.personalized': TwitterGetTrendsPersonalizedTrendsResponse;
	'usage.credits': TwitterGetUsageCreditsResponse;
	'usage.get': TwitterGetUsageResponse;
	'users.affiliates': TwitterGetUsersAffiliatesResponse;
	'users.blockDms': TwitterBlockUsersDmsResponse;
	'users.blocking.block': TwitterUsersIdBlockResponse;
	'users.blocking.list': TwitterGetUsersBlockingResponse;
	'users.blocking.unblock': TwitterUsersIdUnblockResponse;
	'users.bookmarks.create': TwitterCreateUsersBookmarkResponse;
	'users.bookmarks.delete': TwitterDeleteUsersBookmarkResponse;
	'users.bookmarks.folders.create': TwitterCreateUsersBookmarkFolderResponse;
	'users.bookmarks.folders.list': TwitterGetUsersBookmarkFoldersResponse;
	'users.bookmarks.folders.listPosts': TwitterGetUsersBookmarksByFolderIdResponse;
	'users.bookmarks.list': TwitterGetUsersBookmarksResponse;
	'users.broadcasts.create': TwitterCreateUserBroadcastResponse;
	'users.broadcasts.delete': TwitterDeleteUserBroadcastResponse;
	'users.broadcasts.get': TwitterGetUserBroadcastResponse;
	'users.broadcasts.list': TwitterListUserBroadcastsResponse;
	'users.broadcasts.updateState': TwitterUpdateUserBroadcastStateResponse;
	'users.followedLists.follow': TwitterFollowListResponse;
	'users.followedLists.list': TwitterGetUsersFollowedListsResponse;
	'users.followedLists.unfollow': TwitterUnfollowListResponse;
	'users.followers': TwitterGetUsersFollowersResponse;
	'users.following.follow': TwitterFollowUserResponse;
	'users.following.list': TwitterGetUsersFollowingResponse;
	'users.following.unfollow': TwitterUnfollowUserResponse;
	'users.get': TwitterGetUsersByIdResponse;
	'users.getByUsername': TwitterGetUsersByUsernameResponse;
	'users.getMany': TwitterGetUsersByIdsResponse;
	'users.getManyByUsernames': TwitterGetUsersByUsernamesResponse;
	'users.likes.like': TwitterLikePostResponse;
	'users.likes.list': TwitterGetUsersLikedPostsResponse;
	'users.likes.unlike': TwitterUnlikePostResponse;
	'users.listMemberships': TwitterGetUsersListMembershipsResponse;
	'users.me': TwitterGetUsersMeResponse;
	'users.mentions': TwitterGetUsersMentionsResponse;
	'users.muting.list': TwitterGetUsersMutingResponse;
	'users.muting.mute': TwitterMuteUserResponse;
	'users.muting.unmute': TwitterUnmuteUserResponse;
	'users.myFollowers': TwitterGetUsersMeFollowersResponse;
	'users.myFollowing': TwitterGetUsersMeFollowingResponse;
	'users.ownedLists': TwitterGetUsersOwnedListsResponse;
	'users.pinnedLists.list': TwitterGetUsersPinnedListsResponse;
	'users.pinnedLists.pin': TwitterPinListResponse;
	'users.pinnedLists.unpin': TwitterUnpinListResponse;
	'users.posts': TwitterGetUsersPostsResponse;
	'users.publicKeys.add': TwitterAddUserPublicKeyResponse;
	'users.publicKeys.get': TwitterGetUsersPublicKeyResponse;
	'users.publicKeys.getMany': TwitterGetUsersPublicKeysResponse;
	'users.reposts.create': TwitterRepostPostResponse;
	'users.reposts.delete': TwitterUnrepostPostResponse;
	'users.repostsOfMe': TwitterGetUsersRepostsOfMeResponse;
	'users.search': TwitterSearchUsersResponse;
	'users.sources.create': TwitterCreateUserSourceResponse;
	'users.sources.delete': TwitterDeleteUserSourceResponse;
	'users.sources.get': TwitterGetUserSourceResponse;
	'users.sources.list': TwitterListUserSourcesResponse;
	'users.sources.rename': TwitterUpdateUserSourceResponse;
	'users.timeline': TwitterGetUsersTimelineResponse;
	'users.unblockDms': TwitterUnblockUsersDmsResponse;
	'webhooks.create': TwitterCreateWebhooksResponse;
	'webhooks.delete': TwitterDeleteWebhooksResponse;
	'webhooks.list': TwitterGetWebhooksResponse;
	'webhooks.replay': TwitterCreateWebhookReplayJobResponse;
	'webhooks.validate': TwitterValidateWebhooksResponse;
};
