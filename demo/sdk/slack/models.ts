import { z } from 'zod';

export const TokenOverridableSchema = z.object({
    token: z.string().optional(),
});

export const CursorPaginationSchema = z.object({
    cursor: z.string().optional(),
    limit: z.number().optional(),
});

export const TraditionalPaginationSchema = z.object({
    page: z.number().optional(),
    count: z.number().optional(),
});

export const ConversationsArchiveArgsSchema = z.object({
    channel: z.string(),
}).merge(TokenOverridableSchema);
export type ConversationsArchiveArgs = z.infer<typeof ConversationsArchiveArgsSchema>;

export const ConversationsCloseArgsSchema = z.object({
    channel: z.string(),
}).merge(TokenOverridableSchema);
export type ConversationsCloseArgs = z.infer<typeof ConversationsCloseArgsSchema>;

export const ConversationsCreateArgsSchema = z.object({
    name: z.string(),
    is_private: z.boolean().optional(),
    team_id: z.string().optional(),
}).merge(TokenOverridableSchema);
export type ConversationsCreateArgs = z.infer<typeof ConversationsCreateArgsSchema>;

export const ConversationsInfoArgsSchema = z.object({
    channel: z.string(),
    include_locale: z.boolean().optional(),
    include_num_members: z.boolean().optional(),
}).merge(TokenOverridableSchema);
export type ConversationsInfoArgs = z.infer<typeof ConversationsInfoArgsSchema>;

export const ConversationsListArgsSchema = z.object({
    exclude_archived: z.boolean().optional(),
    types: z.string().optional(),
    team_id: z.string().optional(),
}).merge(TokenOverridableSchema).merge(CursorPaginationSchema);
export type ConversationsListArgs = z.infer<typeof ConversationsListArgsSchema>;

export const ConversationsHistoryArgsSchema = z.object({
    channel: z.string(),
    latest: z.string().optional(),
    oldest: z.string().optional(),
    inclusive: z.boolean().optional(),
    include_all_metadata: z.boolean().optional(),
}).merge(TokenOverridableSchema).merge(CursorPaginationSchema);
export type ConversationsHistoryArgs = z.infer<typeof ConversationsHistoryArgsSchema>;

export const ConversationsInviteArgsSchema = z.object({
    channel: z.string(),
    users: z.string(),
    force: z.boolean().optional(),
}).merge(TokenOverridableSchema);
export type ConversationsInviteArgs = z.infer<typeof ConversationsInviteArgsSchema>;

export const ConversationsJoinArgsSchema = z.object({
    channel: z.string(),
}).merge(TokenOverridableSchema);
export type ConversationsJoinArgs = z.infer<typeof ConversationsJoinArgsSchema>;

export const ConversationsKickArgsSchema = z.object({
    channel: z.string(),
    user: z.string(),
}).merge(TokenOverridableSchema);
export type ConversationsKickArgs = z.infer<typeof ConversationsKickArgsSchema>;

export const ConversationsLeaveArgsSchema = z.object({
    channel: z.string(),
}).merge(TokenOverridableSchema);
export type ConversationsLeaveArgs = z.infer<typeof ConversationsLeaveArgsSchema>;

export const ConversationsMembersArgsSchema = z.object({
    channel: z.string(),
}).merge(TokenOverridableSchema).merge(CursorPaginationSchema);
export type ConversationsMembersArgs = z.infer<typeof ConversationsMembersArgsSchema>;

export const ConversationsOpenArgsSchema = z.object({
    channel: z.string().optional(),
    users: z.string().optional(),
    prevent_creation: z.boolean().optional(),
    return_im: z.boolean().optional(),
}).merge(TokenOverridableSchema);
export type ConversationsOpenArgs = z.infer<typeof ConversationsOpenArgsSchema>;

export const ConversationsRenameArgsSchema = z.object({
    channel: z.string(),
    name: z.string(),
}).merge(TokenOverridableSchema);
export type ConversationsRenameArgs = z.infer<typeof ConversationsRenameArgsSchema>;

export const ConversationsRepliesArgsSchema = z.object({
    channel: z.string(),
    ts: z.string(),
    latest: z.string().optional(),
    oldest: z.string().optional(),
    inclusive: z.boolean().optional(),
    include_all_metadata: z.boolean().optional(),
}).merge(TokenOverridableSchema).merge(CursorPaginationSchema);
export type ConversationsRepliesArgs = z.infer<typeof ConversationsRepliesArgsSchema>;

export const ConversationsSetPurposeArgsSchema = z.object({
    channel: z.string(),
    purpose: z.string(),
}).merge(TokenOverridableSchema);
export type ConversationsSetPurposeArgs = z.infer<typeof ConversationsSetPurposeArgsSchema>;

export const ConversationsSetTopicArgsSchema = z.object({
    channel: z.string(),
    topic: z.string(),
}).merge(TokenOverridableSchema);
export type ConversationsSetTopicArgs = z.infer<typeof ConversationsSetTopicArgsSchema>;

export const ConversationsUnarchiveArgsSchema = z.object({
    channel: z.string(),
}).merge(TokenOverridableSchema);
export type ConversationsUnarchiveArgs = z.infer<typeof ConversationsUnarchiveArgsSchema>;

export const UsersInfoArgsSchema = z.object({
    user: z.string(),
    include_locale: z.boolean().optional(),
}).merge(TokenOverridableSchema);
export type UsersInfoArgs = z.infer<typeof UsersInfoArgsSchema>;

export const UsersListArgsSchema = z.object({
    include_locale: z.boolean().optional(),
    team_id: z.string().optional(),
}).merge(TokenOverridableSchema).merge(CursorPaginationSchema);
export type UsersListArgs = z.infer<typeof UsersListArgsSchema>;

export const UsersProfileGetArgsSchema = z.object({
    user: z.string().optional(),
    include_labels: z.boolean().optional(),
}).merge(TokenOverridableSchema);
export type UsersProfileGetArgs = z.infer<typeof UsersProfileGetArgsSchema>;

export const UsersGetPresenceArgsSchema = z.object({
    user: z.string().optional(),
}).merge(TokenOverridableSchema);
export type UsersGetPresenceArgs = z.infer<typeof UsersGetPresenceArgsSchema>;

export const UsersProfileSetArgsSchema = z.object({
    profile: z.record(z.unknown()).optional(),
    user: z.string().optional(),
    name: z.string().optional(),
    value: z.string().optional(),
}).merge(TokenOverridableSchema);
export type UsersProfileSetArgs = z.infer<typeof UsersProfileSetArgsSchema>;

export const UsergroupsCreateArgsSchema = z.object({
    name: z.string(),
    channels: z.string().optional(),
    description: z.string().optional(),
    handle: z.string().optional(),
    include_count: z.boolean().optional(),
    team_id: z.string().optional(),
}).merge(TokenOverridableSchema);
export type UsergroupsCreateArgs = z.infer<typeof UsergroupsCreateArgsSchema>;

export const UsergroupsDisableArgsSchema = z.object({
    usergroup: z.string(),
    include_count: z.boolean().optional(),
    team_id: z.string().optional(),
}).merge(TokenOverridableSchema);
export type UsergroupsDisableArgs = z.infer<typeof UsergroupsDisableArgsSchema>;

export const UsergroupsEnableArgsSchema = z.object({
    usergroup: z.string(),
    include_count: z.boolean().optional(),
    team_id: z.string().optional(),
}).merge(TokenOverridableSchema);
export type UsergroupsEnableArgs = z.infer<typeof UsergroupsEnableArgsSchema>;

export const UsergroupsListArgsSchema = z.object({
    include_count: z.boolean().optional(),
    include_disabled: z.boolean().optional(),
    include_users: z.boolean().optional(),
    team_id: z.string().optional(),
}).merge(TokenOverridableSchema);
export type UsergroupsListArgs = z.infer<typeof UsergroupsListArgsSchema>;

export const UsergroupsUpdateArgsSchema = z.object({
    usergroup: z.string(),
    name: z.string().optional(),
    channels: z.string().optional(),
    description: z.string().optional(),
    handle: z.string().optional(),
    include_count: z.boolean().optional(),
    team_id: z.string().optional(),
}).merge(TokenOverridableSchema);
export type UsergroupsUpdateArgs = z.infer<typeof UsergroupsUpdateArgsSchema>;

export const FilesInfoArgsSchema = z.object({
    file: z.string(),
}).merge(TokenOverridableSchema).merge(CursorPaginationSchema).merge(TraditionalPaginationSchema);
export type FilesInfoArgs = z.infer<typeof FilesInfoArgsSchema>;

export const FilesListArgsSchema = z.object({
    channel: z.string().optional(),
    user: z.string().optional(),
    types: z.string().optional(),
    ts_from: z.string().optional(),
    ts_to: z.string().optional(),
    show_files_hidden_by_limit: z.boolean().optional(),
    team_id: z.string().optional(),
}).merge(TokenOverridableSchema).merge(TraditionalPaginationSchema);
export type FilesListArgs = z.infer<typeof FilesListArgsSchema>;

export const FilesUploadArgsSchema = z.object({
    channels: z.string().optional(),
    content: z.string().optional(),
    file: z.any().optional(),
    filename: z.string().optional(),
    filetype: z.string().optional(),
    initial_comment: z.string().optional(),
    thread_ts: z.string().optional(),
    title: z.string().optional(),
}).merge(TokenOverridableSchema);
export type FilesUploadArgs = z.infer<typeof FilesUploadArgsSchema>;

export const BlockSchema: z.ZodType<any> = z.lazy(() => z.object({
    type: z.string(),
    block_id: z.string().optional(),
}).passthrough());

export const AttachmentSchema = z.object({
    fallback: z.string().optional(),
    color: z.string().optional(),
    pretext: z.string().optional(),
    author_name: z.string().optional(),
    author_link: z.string().optional(),
    author_icon: z.string().optional(),
    title: z.string().optional(),
    title_link: z.string().optional(),
    text: z.string().optional(),
    fields: z.array(z.object({
        title: z.string().optional(),
        value: z.string().optional(),
        short: z.boolean().optional(),
    })).optional(),
    image_url: z.string().optional(),
    thumb_url: z.string().optional(),
    footer: z.string().optional(),
    footer_icon: z.string().optional(),
    ts: z.union([z.string(), z.number()]).optional(),
}).passthrough();

export const ChatDeleteArgsSchema = z.object({
    channel: z.string(),
    ts: z.string(),
    as_user: z.boolean().optional(),
}).merge(TokenOverridableSchema);
export type ChatDeleteArgs = z.infer<typeof ChatDeleteArgsSchema>;

export const ChatGetPermalinkArgsSchema = z.object({
    channel: z.string(),
    message_ts: z.string(),
}).merge(TokenOverridableSchema);
export type ChatGetPermalinkArgs = z.infer<typeof ChatGetPermalinkArgsSchema>;

export const SearchMessagesArgsSchema = z.object({
    query: z.string(),
    sort: z.enum(['score', 'timestamp']).optional(),
    sort_dir: z.enum(['asc', 'desc']).optional(),
    highlight: z.boolean().optional(),
    team_id: z.string().optional(),
}).merge(TokenOverridableSchema).merge(CursorPaginationSchema).merge(TraditionalPaginationSchema);
export type SearchMessagesArgs = z.infer<typeof SearchMessagesArgsSchema>;

export const ChatPostMessageArgsSchema = z.object({
    channel: z.string(),
    text: z.string().optional(),
    blocks: z.array(BlockSchema).optional(),
    attachments: z.array(AttachmentSchema).optional(),
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
    metadata: z.object({
        event_type: z.string(),
        event_payload: z.record(z.unknown()),
    }).optional(),
}).merge(TokenOverridableSchema);
export type ChatPostMessageArgs = z.infer<typeof ChatPostMessageArgsSchema>;

export const ChatUpdateArgsSchema = z.object({
    channel: z.string(),
    ts: z.string(),
    text: z.string().optional(),
    blocks: z.array(BlockSchema).optional(),
    attachments: z.array(AttachmentSchema).optional(),
    parse: z.enum(['full', 'none']).optional(),
    link_names: z.boolean().optional(),
    as_user: z.boolean().optional(),
    file_ids: z.array(z.string()).optional(),
    reply_broadcast: z.boolean().optional(),
    metadata: z.object({
        event_type: z.string(),
        event_payload: z.record(z.unknown()),
    }).optional(),
}).merge(TokenOverridableSchema);
export type ChatUpdateArgs = z.infer<typeof ChatUpdateArgsSchema>;

export const ReactionsAddArgsSchema = z.object({
    channel: z.string(),
    timestamp: z.string(),
    name: z.string(),
}).merge(TokenOverridableSchema);
export type ReactionsAddArgs = z.infer<typeof ReactionsAddArgsSchema>;

export const ReactionsGetArgsSchema = z.object({
    channel: z.string().optional(),
    timestamp: z.string().optional(),
    file: z.string().optional(),
    file_comment: z.string().optional(),
    full: z.boolean().optional(),
}).merge(TokenOverridableSchema);
export type ReactionsGetArgs = z.infer<typeof ReactionsGetArgsSchema>;

export const ReactionsRemoveArgsSchema = z.object({
    name: z.string(),
    channel: z.string().optional(),
    timestamp: z.string().optional(),
    file: z.string().optional(),
    file_comment: z.string().optional(),
}).merge(TokenOverridableSchema);
export type ReactionsRemoveArgs = z.infer<typeof ReactionsRemoveArgsSchema>;

export const StarsAddArgsSchema = z.object({
    channel: z.string().optional(),
    timestamp: z.string().optional(),
    file: z.string().optional(),
    file_comment: z.string().optional(),
}).merge(TokenOverridableSchema);
export type StarsAddArgs = z.infer<typeof StarsAddArgsSchema>;

export const StarsRemoveArgsSchema = z.object({
    channel: z.string().optional(),
    timestamp: z.string().optional(),
    file: z.string().optional(),
    file_comment: z.string().optional(),
}).merge(TokenOverridableSchema);
export type StarsRemoveArgs = z.infer<typeof StarsRemoveArgsSchema>;

export const StarsListArgsSchema = z.object({
    team_id: z.string().optional(),
}).merge(TokenOverridableSchema).merge(CursorPaginationSchema).merge(TraditionalPaginationSchema);
export type StarsListArgs = z.infer<typeof StarsListArgsSchema>;

export const ResponseMetadataSchema = z.object({
    next_cursor: z.string().optional(),
    messages: z.array(z.string()).optional(),
});

export const SlackResponseSchema = z.object({
    ok: z.boolean(),
    error: z.string().optional(),
    needed: z.string().optional(),
    provided: z.string().optional(),
    response_metadata: ResponseMetadataSchema.optional(),
});

export const ChannelSchema = z.object({
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
    topic: z.object({
        value: z.string(),
        creator: z.string(),
        last_set: z.number(),
    }).optional(),
    purpose: z.object({
        value: z.string(),
        creator: z.string(),
        last_set: z.number(),
    }).optional(),
}).passthrough();

export const UserProfileSchema = z.object({
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
}).passthrough();

export const UserSchema = z.object({
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
}).passthrough();

export const UsergroupSchema = z.object({
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
    prefs: z.object({
        channels: z.array(z.string()).optional(),
        groups: z.array(z.string()).optional(),
    }).optional(),
    users: z.array(z.string()).optional(),
    user_count: z.number().optional(),
    channel_count: z.number().optional(),
}).passthrough();

export const FileSchema = z.object({
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
}).passthrough();

export const MessageSchema = z.object({
    type: z.string().optional(),
    subtype: z.string().optional(),
    text: z.string().optional(),
    ts: z.string().optional(),
    user: z.string().optional(),
    bot_id: z.string().optional(),
    app_id: z.string().optional(),
    team: z.string().optional(),
    username: z.string().optional(),
    icons: z.object({
        emoji: z.string().optional(),
        image_36: z.string().optional(),
        image_48: z.string().optional(),
        image_72: z.string().optional(),
    }).optional(),
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
    reactions: z.array(z.object({
        name: z.string(),
        count: z.number(),
        users: z.array(z.string()),
    })).optional(),
    edited: z.object({
        user: z.string(),
        ts: z.string(),
    }).optional(),
}).passthrough();

export const ConversationsArchiveResponseSchema = SlackResponseSchema;
export type ConversationsArchiveResponse = z.infer<typeof ConversationsArchiveResponseSchema>;

export const ConversationsCloseResponseSchema = SlackResponseSchema.extend({
    no_op: z.boolean().optional(),
    already_closed: z.boolean().optional(),
});
export type ConversationsCloseResponse = z.infer<typeof ConversationsCloseResponseSchema>;

export const ConversationsCreateResponseSchema = SlackResponseSchema.extend({
    channel: ChannelSchema.optional(),
});
export type ConversationsCreateResponse = z.infer<typeof ConversationsCreateResponseSchema>;

export const ConversationsInfoResponseSchema = SlackResponseSchema.extend({
    channel: ChannelSchema.optional(),
});
export type ConversationsInfoResponse = z.infer<typeof ConversationsInfoResponseSchema>;

export const ConversationsListResponseSchema = SlackResponseSchema.extend({
    channels: z.array(ChannelSchema).optional(),
});
export type ConversationsListResponse = z.infer<typeof ConversationsListResponseSchema>;

export const ConversationsHistoryResponseSchema = SlackResponseSchema.extend({
    messages: z.array(MessageSchema).optional(),
    has_more: z.boolean().optional(),
    pin_count: z.number().optional(),
    channel_actions_count: z.number().optional(),
    channel_actions_ts: z.number().optional(),
});
export type ConversationsHistoryResponse = z.infer<typeof ConversationsHistoryResponseSchema>;

export const ConversationsInviteResponseSchema = SlackResponseSchema.extend({
    channel: ChannelSchema.optional(),
});
export type ConversationsInviteResponse = z.infer<typeof ConversationsInviteResponseSchema>;

export const ConversationsJoinResponseSchema = SlackResponseSchema.extend({
    channel: ChannelSchema.optional(),
    warning: z.string().optional(),
});
export type ConversationsJoinResponse = z.infer<typeof ConversationsJoinResponseSchema>;

export const ConversationsKickResponseSchema = SlackResponseSchema;
export type ConversationsKickResponse = z.infer<typeof ConversationsKickResponseSchema>;

export const ConversationsLeaveResponseSchema = SlackResponseSchema.extend({
    not_in_channel: z.boolean().optional(),
});
export type ConversationsLeaveResponse = z.infer<typeof ConversationsLeaveResponseSchema>;

export const ConversationsMembersResponseSchema = SlackResponseSchema.extend({
    members: z.array(z.string()).optional(),
});
export type ConversationsMembersResponse = z.infer<typeof ConversationsMembersResponseSchema>;

export const ConversationsOpenResponseSchema = SlackResponseSchema.extend({
    channel: ChannelSchema.optional(),
    no_op: z.boolean().optional(),
    already_open: z.boolean().optional(),
});
export type ConversationsOpenResponse = z.infer<typeof ConversationsOpenResponseSchema>;

export const ConversationsRenameResponseSchema = SlackResponseSchema.extend({
    channel: ChannelSchema.optional(),
});
export type ConversationsRenameResponse = z.infer<typeof ConversationsRenameResponseSchema>;

export const ConversationsRepliesResponseSchema = SlackResponseSchema.extend({
    messages: z.array(MessageSchema).optional(),
    has_more: z.boolean().optional(),
});
export type ConversationsRepliesResponse = z.infer<typeof ConversationsRepliesResponseSchema>;

export const ConversationsSetPurposeResponseSchema = SlackResponseSchema.extend({
    channel: ChannelSchema.optional(),
    purpose: z.string().optional(),
});
export type ConversationsSetPurposeResponse = z.infer<typeof ConversationsSetPurposeResponseSchema>;

export const ConversationsSetTopicResponseSchema = SlackResponseSchema.extend({
    channel: ChannelSchema.optional(),
    topic: z.string().optional(),
});
export type ConversationsSetTopicResponse = z.infer<typeof ConversationsSetTopicResponseSchema>;

export const ConversationsUnarchiveResponseSchema = SlackResponseSchema;
export type ConversationsUnarchiveResponse = z.infer<typeof ConversationsUnarchiveResponseSchema>;

export const UsersInfoResponseSchema = SlackResponseSchema.extend({
    user: UserSchema.optional(),
});
export type UsersInfoResponse = z.infer<typeof UsersInfoResponseSchema>;

export const UsersListResponseSchema = SlackResponseSchema.extend({
    members: z.array(UserSchema).optional(),
    cache_ts: z.number().optional(),
});
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

export const UsersProfileGetResponseSchema = SlackResponseSchema.extend({
    profile: UserProfileSchema.optional(),
});
export type UsersProfileGetResponse = z.infer<typeof UsersProfileGetResponseSchema>;

export const UsersGetPresenceResponseSchema = SlackResponseSchema.extend({
    presence: z.string().optional(),
    online: z.boolean().optional(),
    auto_away: z.boolean().optional(),
    manual_away: z.boolean().optional(),
    connection_count: z.number().optional(),
    last_activity: z.number().optional(),
});
export type UsersGetPresenceResponse = z.infer<typeof UsersGetPresenceResponseSchema>;

export const UsersProfileSetResponseSchema = SlackResponseSchema.extend({
    profile: UserProfileSchema.optional(),
});
export type UsersProfileSetResponse = z.infer<typeof UsersProfileSetResponseSchema>;

export const UsergroupsCreateResponseSchema = SlackResponseSchema.extend({
    usergroup: UsergroupSchema.optional(),
});
export type UsergroupsCreateResponse = z.infer<typeof UsergroupsCreateResponseSchema>;

export const UsergroupsDisableResponseSchema = SlackResponseSchema.extend({
    usergroup: UsergroupSchema.optional(),
});
export type UsergroupsDisableResponse = z.infer<typeof UsergroupsDisableResponseSchema>;

export const UsergroupsEnableResponseSchema = SlackResponseSchema.extend({
    usergroup: UsergroupSchema.optional(),
});
export type UsergroupsEnableResponse = z.infer<typeof UsergroupsEnableResponseSchema>;

export const UsergroupsListResponseSchema = SlackResponseSchema.extend({
    usergroups: z.array(UsergroupSchema).optional(),
});
export type UsergroupsListResponse = z.infer<typeof UsergroupsListResponseSchema>;

export const UsergroupsUpdateResponseSchema = SlackResponseSchema.extend({
    usergroup: UsergroupSchema.optional(),
});
export type UsergroupsUpdateResponse = z.infer<typeof UsergroupsUpdateResponseSchema>;

export const FilesInfoResponseSchema = SlackResponseSchema.extend({
    file: FileSchema.optional(),
    comments: z.array(z.object({
        id: z.string(),
        timestamp: z.number(),
        user: z.string(),
        comment: z.string(),
    })).optional(),
    paging: z.object({
        count: z.number(),
        total: z.number(),
        page: z.number(),
        pages: z.number(),
    }).optional(),
});
export type FilesInfoResponse = z.infer<typeof FilesInfoResponseSchema>;

export const FilesListResponseSchema = SlackResponseSchema.extend({
    files: z.array(FileSchema).optional(),
    paging: z.object({
        count: z.number(),
        total: z.number(),
        page: z.number(),
        pages: z.number(),
    }).optional(),
});
export type FilesListResponse = z.infer<typeof FilesListResponseSchema>;

export const FilesUploadResponseSchema = SlackResponseSchema.extend({
    file: FileSchema.optional(),
});
export type FilesUploadResponse = z.infer<typeof FilesUploadResponseSchema>;

export const ChatDeleteResponseSchema = SlackResponseSchema.extend({
    channel: z.string().optional(),
    ts: z.string().optional(),
});
export type ChatDeleteResponse = z.infer<typeof ChatDeleteResponseSchema>;

export const ChatGetPermalinkResponseSchema = SlackResponseSchema.extend({
    channel: z.string().optional(),
    permalink: z.string().optional(),
});
export type ChatGetPermalinkResponse = z.infer<typeof ChatGetPermalinkResponseSchema>;

export const SearchMessagesResponseSchema = SlackResponseSchema.extend({
    query: z.string().optional(),
    messages: z.object({
        total: z.number().optional(),
        pagination: z.object({
            total_count: z.number().optional(),
            page: z.number().optional(),
            per_page: z.number().optional(),
            page_count: z.number().optional(),
            first: z.number().optional(),
            last: z.number().optional(),
        }).optional(),
        paging: z.object({
            count: z.number(),
            total: z.number(),
            page: z.number(),
            pages: z.number(),
        }).optional(),
        matches: z.array(MessageSchema.extend({
            channel: z.object({
                id: z.string(),
                name: z.string().optional(),
            }).optional(),
            permalink: z.string().optional(),
        })).optional(),
    }).optional(),
});
export type SearchMessagesResponse = z.infer<typeof SearchMessagesResponseSchema>;

export const ChatPostMessageResponseSchema = SlackResponseSchema.extend({
    channel: z.string().optional(),
    ts: z.string().optional(),
    message: MessageSchema.optional(),
});
export type ChatPostMessageResponse = z.infer<typeof ChatPostMessageResponseSchema>;

export const ChatUpdateResponseSchema = SlackResponseSchema.extend({
    channel: z.string().optional(),
    ts: z.string().optional(),
    text: z.string().optional(),
    message: MessageSchema.optional(),
});
export type ChatUpdateResponse = z.infer<typeof ChatUpdateResponseSchema>;

export const ReactionsAddResponseSchema = SlackResponseSchema;
export type ReactionsAddResponse = z.infer<typeof ReactionsAddResponseSchema>;

export const ReactionsGetResponseSchema = SlackResponseSchema.extend({
    type: z.string().optional(),
    channel: z.string().optional(),
    message: MessageSchema.optional(),
    file: FileSchema.optional(),
    comment: z.object({
        id: z.string(),
        comment: z.string(),
        reactions: z.array(z.object({
            name: z.string(),
            count: z.number(),
            users: z.array(z.string()),
        })).optional(),
    }).optional(),
});
export type ReactionsGetResponse = z.infer<typeof ReactionsGetResponseSchema>;

export const ReactionsRemoveResponseSchema = SlackResponseSchema;
export type ReactionsRemoveResponse = z.infer<typeof ReactionsRemoveResponseSchema>;

export const StarsAddResponseSchema = SlackResponseSchema;
export type StarsAddResponse = z.infer<typeof StarsAddResponseSchema>;

export const StarsRemoveResponseSchema = SlackResponseSchema;
export type StarsRemoveResponse = z.infer<typeof StarsRemoveResponseSchema>;

export const StarsListResponseSchema = SlackResponseSchema.extend({
    items: z.array(z.object({
        type: z.string(),
        channel: z.string().optional(),
        message: MessageSchema.optional(),
        file: FileSchema.optional(),
        comment: z.object({
            id: z.string(),
            comment: z.string(),
        }).optional(),
        date_create: z.number().optional(),
    })).optional(),
    paging: z.object({
        count: z.number(),
        total: z.number(),
        page: z.number(),
        pages: z.number(),
    }).optional(),
});
export type StarsListResponse = z.infer<typeof StarsListResponseSchema>;

