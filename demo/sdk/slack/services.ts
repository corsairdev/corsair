import type {
    ConversationsArchiveArgs,
    ConversationsArchiveResponse,
    ConversationsCloseArgs,
    ConversationsCloseResponse,
    ConversationsCreateArgs,
    ConversationsCreateResponse,
    ConversationsHistoryArgs,
    ConversationsHistoryResponse,
    ConversationsInfoArgs,
    ConversationsInfoResponse,
    ConversationsInviteArgs,
    ConversationsInviteResponse,
    ConversationsJoinArgs,
    ConversationsJoinResponse,
    ConversationsKickArgs,
    ConversationsKickResponse,
    ConversationsLeaveArgs,
    ConversationsLeaveResponse,
    ConversationsListArgs,
    ConversationsListResponse,
    ConversationsMembersArgs,
    ConversationsMembersResponse,
    ConversationsOpenArgs,
    ConversationsOpenResponse,
    ConversationsRenameArgs,
    ConversationsRenameResponse,
    ConversationsRepliesArgs,
    ConversationsRepliesResponse,
    ConversationsSetPurposeArgs,
    ConversationsSetPurposeResponse,
    ConversationsSetTopicArgs,
    ConversationsSetTopicResponse,
    ConversationsUnarchiveArgs,
    ConversationsUnarchiveResponse,
    UsersInfoArgs,
    UsersInfoResponse,
    UsersListArgs,
    UsersListResponse,
    UsersProfileGetArgs,
    UsersProfileGetResponse,
    UsersGetPresenceArgs,
    UsersGetPresenceResponse,
    UsersProfileSetArgs,
    UsersProfileSetResponse,
    UsergroupsCreateArgs,
    UsergroupsCreateResponse,
    UsergroupsDisableArgs,
    UsergroupsDisableResponse,
    UsergroupsEnableArgs,
    UsergroupsEnableResponse,
    UsergroupsListArgs,
    UsergroupsListResponse,
    UsergroupsUpdateArgs,
    UsergroupsUpdateResponse,
    FilesInfoArgs,
    FilesInfoResponse,
    FilesListArgs,
    FilesListResponse,
    FilesUploadArgs,
    FilesUploadResponse,
    ChatDeleteArgs,
    ChatDeleteResponse,
    ChatGetPermalinkArgs,
    ChatGetPermalinkResponse,
    SearchMessagesArgs,
    SearchMessagesResponse,
    ChatPostMessageArgs,
    ChatPostMessageResponse,
    ChatUpdateArgs,
    ChatUpdateResponse,
    ReactionsAddArgs,
    ReactionsAddResponse,
    ReactionsGetArgs,
    ReactionsGetResponse,
    ReactionsRemoveArgs,
    ReactionsRemoveResponse,
    StarsAddArgs,
    StarsAddResponse,
    StarsRemoveArgs,
    StarsRemoveResponse,
    StarsListArgs,
    StarsListResponse,
} from './models';
import type { CancelablePromise } from './core/CancelablePromise';
import { OpenAPI } from './core/OpenAPI';
import { request as __request } from './core/request';

export class ChannelsService {
    public static conversationsArchive(
        args: ConversationsArchiveArgs,
    ): CancelablePromise<ConversationsArchiveResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'conversations.archive',
            body: args,
            mediaType: 'application/json; charset=utf-8',
        });
    }

    public static conversationsClose(
        args: ConversationsCloseArgs,
    ): CancelablePromise<ConversationsCloseResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'conversations.close',
            body: args,
            mediaType: 'application/json; charset=utf-8',
        });
    }

    public static conversationsCreate(
        args: ConversationsCreateArgs,
    ): CancelablePromise<ConversationsCreateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'conversations.create',
            body: args,
            mediaType: 'application/json; charset=utf-8',
        });
    }

    public static conversationsInfo(
        args: ConversationsInfoArgs,
    ): CancelablePromise<ConversationsInfoResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: 'conversations.info',
            query: args,
        });
    }

    public static conversationsList(
        args?: ConversationsListArgs,
    ): CancelablePromise<ConversationsListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: 'conversations.list',
            query: args,
        });
    }

    public static conversationsHistory(
        args: ConversationsHistoryArgs,
    ): CancelablePromise<ConversationsHistoryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: 'conversations.history',
            query: args,
        });
    }

    public static conversationsInvite(
        args: ConversationsInviteArgs,
    ): CancelablePromise<ConversationsInviteResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'conversations.invite',
            body: args,
            mediaType: 'application/json; charset=utf-8',
        });
    }

    public static conversationsJoin(
        args: ConversationsJoinArgs,
    ): CancelablePromise<ConversationsJoinResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'conversations.join',
            body: args,
            mediaType: 'application/json; charset=utf-8',
        });
    }

    public static conversationsKick(
        args: ConversationsKickArgs,
    ): CancelablePromise<ConversationsKickResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'conversations.kick',
            body: args,
            mediaType: 'application/json; charset=utf-8',
        });
    }

    public static conversationsLeave(
        args: ConversationsLeaveArgs,
    ): CancelablePromise<ConversationsLeaveResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'conversations.leave',
            body: args,
            mediaType: 'application/json; charset=utf-8',
        });
    }

    public static conversationsMembers(
        args: ConversationsMembersArgs,
    ): CancelablePromise<ConversationsMembersResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: 'conversations.members',
            query: args,
        });
    }

    public static conversationsOpen(
        args?: ConversationsOpenArgs,
    ): CancelablePromise<ConversationsOpenResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'conversations.open',
            body: args,
            mediaType: 'application/json; charset=utf-8',
        });
    }

    public static conversationsRename(
        args: ConversationsRenameArgs,
    ): CancelablePromise<ConversationsRenameResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'conversations.rename',
            body: args,
            mediaType: 'application/json; charset=utf-8',
        });
    }

    public static conversationsReplies(
        args: ConversationsRepliesArgs,
    ): CancelablePromise<ConversationsRepliesResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: 'conversations.replies',
            query: args,
        });
    }

    public static conversationsSetPurpose(
        args: ConversationsSetPurposeArgs,
    ): CancelablePromise<ConversationsSetPurposeResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'conversations.setPurpose',
            body: args,
            mediaType: 'application/json; charset=utf-8',
        });
    }

    public static conversationsSetTopic(
        args: ConversationsSetTopicArgs,
    ): CancelablePromise<ConversationsSetTopicResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'conversations.setTopic',
            body: args,
            mediaType: 'application/json; charset=utf-8',
        });
    }

    public static conversationsUnarchive(
        args: ConversationsUnarchiveArgs,
    ): CancelablePromise<ConversationsUnarchiveResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'conversations.unarchive',
            body: args,
            mediaType: 'application/json; charset=utf-8',
        });
    }
}

export class UsersService {
    public static usersInfo(
        args: UsersInfoArgs,
    ): CancelablePromise<UsersInfoResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: 'users.info',
            query: args,
        });
    }

    public static usersList(
        args?: UsersListArgs,
    ): CancelablePromise<UsersListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: 'users.list',
            query: args,
        });
    }

    public static usersProfileGet(
        args?: UsersProfileGetArgs,
    ): CancelablePromise<UsersProfileGetResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: 'users.profile.get',
            query: args,
        });
    }

    public static usersGetPresence(
        args?: UsersGetPresenceArgs,
    ): CancelablePromise<UsersGetPresenceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: 'users.getPresence',
            query: args,
        });
    }

    public static usersProfileSet(
        args: UsersProfileSetArgs,
    ): CancelablePromise<UsersProfileSetResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'users.profile.set',
            body: args,
            mediaType: 'application/json; charset=utf-8',
        });
    }
}

export class UsergroupsService {
    public static usergroupsCreate(
        args: UsergroupsCreateArgs,
    ): CancelablePromise<UsergroupsCreateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'usergroups.create',
            body: args,
            mediaType: 'application/json; charset=utf-8',
        });
    }

    public static usergroupsDisable(
        args: UsergroupsDisableArgs,
    ): CancelablePromise<UsergroupsDisableResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'usergroups.disable',
            body: args,
            mediaType: 'application/json; charset=utf-8',
        });
    }

    public static usergroupsEnable(
        args: UsergroupsEnableArgs,
    ): CancelablePromise<UsergroupsEnableResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'usergroups.enable',
            body: args,
            mediaType: 'application/json; charset=utf-8',
        });
    }

    public static usergroupsList(
        args?: UsergroupsListArgs,
    ): CancelablePromise<UsergroupsListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: 'usergroups.list',
            query: args,
        });
    }

    public static usergroupsUpdate(
        args: UsergroupsUpdateArgs,
    ): CancelablePromise<UsergroupsUpdateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'usergroups.update',
            body: args,
            mediaType: 'application/json; charset=utf-8',
        });
    }
}

export class FilesService {
    public static filesInfo(
        args: FilesInfoArgs,
    ): CancelablePromise<FilesInfoResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: 'files.info',
            query: args,
        });
    }

    public static filesList(
        args?: FilesListArgs,
    ): CancelablePromise<FilesListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: 'files.list',
            query: args,
        });
    }

    public static filesUpload(
        args: FilesUploadArgs,
    ): CancelablePromise<FilesUploadResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'files.upload',
            formData: args,
        });
    }
}

export class ChatService {
    public static chatDelete(
        args: ChatDeleteArgs,
    ): CancelablePromise<ChatDeleteResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'chat.delete',
            body: args,
            mediaType: 'application/json; charset=utf-8',
        });
    }

    public static chatGetPermalink(
        args: ChatGetPermalinkArgs,
    ): CancelablePromise<ChatGetPermalinkResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: 'chat.getPermalink',
            query: args,
        });
    }

    public static chatPostMessage(
        args: ChatPostMessageArgs,
    ): CancelablePromise<ChatPostMessageResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'chat.postMessage',
            body: args,
            mediaType: 'application/json; charset=utf-8',
        });
    }

    public static chatUpdate(
        args: ChatUpdateArgs,
    ): CancelablePromise<ChatUpdateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'chat.update',
            body: args,
            mediaType: 'application/json; charset=utf-8',
        });
    }
}

export class SearchService {
    public static searchMessages(
        args: SearchMessagesArgs,
    ): CancelablePromise<SearchMessagesResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: 'search.messages',
            query: args,
        });
    }
}

export class ReactionsService {
    public static reactionsAdd(
        args: ReactionsAddArgs,
    ): CancelablePromise<ReactionsAddResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'reactions.add',
            body: args,
            mediaType: 'application/json; charset=utf-8',
        });
    }

    public static reactionsGet(
        args: ReactionsGetArgs,
    ): CancelablePromise<ReactionsGetResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: 'reactions.get',
            query: args,
        });
    }

    public static reactionsRemove(
        args: ReactionsRemoveArgs,
    ): CancelablePromise<ReactionsRemoveResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'reactions.remove',
            body: args,
            mediaType: 'application/json; charset=utf-8',
        });
    }
}

export class StarsService {
    public static starsAdd(
        args: StarsAddArgs,
    ): CancelablePromise<StarsAddResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'stars.add',
            body: args,
            mediaType: 'application/json; charset=utf-8',
        });
    }

    public static starsRemove(
        args: StarsRemoveArgs,
    ): CancelablePromise<StarsRemoveResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: 'stars.remove',
            body: args,
            mediaType: 'application/json; charset=utf-8',
        });
    }

    public static starsList(
        args?: StarsListArgs,
    ): CancelablePromise<StarsListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: 'stars.list',
            query: args,
        });
    }
}

