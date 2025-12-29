import { OpenAPI } from './core/OpenAPI';
import { request as __request } from './core/request';
import type {
    Message,
    MessageListResponse,
    ModifyMessageRequest,
    BatchModifyMessagesRequest,
    Label,
    LabelListResponse,
    Draft,
    DraftListResponse,
    Thread,
    ThreadListResponse,
    ModifyThreadRequest,
    HistoryListResponse,
    WatchRequest,
    WatchResponse,
    Profile,
} from './models';

export class MessagesService {
    public static messagesList(
        userId: string = 'me',
        q?: string,
        maxResults?: number,
        pageToken?: string,
        labelIds?: string[],
        includeSpamTrash?: boolean
    ) {
        return __request<MessageListResponse>(OpenAPI, {
            method: 'GET',
            url: '/gmail/v1/users/{userId}/messages',
            path: {
                userId,
            },
            query: {
                q,
                maxResults,
                pageToken,
                labelIds,
                includeSpamTrash,
            },
        });
    }

    public static messagesGet(
        userId: string = 'me',
        id: string,
        format?: 'minimal' | 'full' | 'raw' | 'metadata',
        metadataHeaders?: string[]
    ) {
        return __request<Message>(OpenAPI, {
            method: 'GET',
            url: '/gmail/v1/users/{userId}/messages/{id}',
            path: {
                userId,
                id,
            },
            query: {
                format,
                metadataHeaders,
            },
        });
    }

    public static messagesSend(
        userId: string = 'me',
        body: { raw: string; threadId?: string }
    ) {
        return __request<Message>(OpenAPI, {
            method: 'POST',
            url: '/gmail/v1/users/{userId}/messages/send',
            path: {
                userId,
            },
            body,
            mediaType: 'application/json',
        });
    }

    public static messagesDelete(
        userId: string = 'me',
        id: string
    ) {
        return __request<void>(OpenAPI, {
            method: 'DELETE',
            url: '/gmail/v1/users/{userId}/messages/{id}',
            path: {
                userId,
                id,
            },
        });
    }

    public static messagesModify(
        userId: string = 'me',
        id: string,
        body: ModifyMessageRequest
    ) {
        return __request<Message>(OpenAPI, {
            method: 'POST',
            url: '/gmail/v1/users/{userId}/messages/{id}/modify',
            path: {
                userId,
                id,
            },
            body,
            mediaType: 'application/json',
        });
    }

    public static messagesBatchModify(
        userId: string = 'me',
        body: BatchModifyMessagesRequest
    ) {
        return __request<void>(OpenAPI, {
            method: 'POST',
            url: '/gmail/v1/users/{userId}/messages/batchModify',
            path: {
                userId,
            },
            body,
            mediaType: 'application/json',
        });
    }

    public static messagesTrash(
        userId: string = 'me',
        id: string
    ) {
        return __request<Message>(OpenAPI, {
            method: 'POST',
            url: '/gmail/v1/users/{userId}/messages/{id}/trash',
            path: {
                userId,
                id,
            },
        });
    }

    public static messagesUntrash(
        userId: string = 'me',
        id: string
    ) {
        return __request<Message>(OpenAPI, {
            method: 'POST',
            url: '/gmail/v1/users/{userId}/messages/{id}/untrash',
            path: {
                userId,
                id,
            },
        });
    }

    public static messagesInsert(
        userId: string = 'me',
        body: Message,
        internalDateSource?: 'receivedTime' | 'dateHeader'
    ) {
        return __request<Message>(OpenAPI, {
            method: 'POST',
            url: '/gmail/v1/users/{userId}/messages',
            path: {
                userId,
            },
            query: {
                internalDateSource,
            },
            body,
            mediaType: 'application/json',
        });
    }

    public static messagesImport(
        userId: string = 'me',
        body: Message,
        internalDateSource?: 'receivedTime' | 'dateHeader',
        neverMarkSpam?: boolean,
        processForCalendar?: boolean
    ) {
        return __request<Message>(OpenAPI, {
            method: 'POST',
            url: '/gmail/v1/users/{userId}/messages/import',
            path: {
                userId,
            },
            query: {
                internalDateSource,
                neverMarkSpam,
                processForCalendar,
            },
            body,
            mediaType: 'application/json',
        });
    }
}

export class LabelsService {
    public static labelsList(userId: string = 'me') {
        return __request<LabelListResponse>(OpenAPI, {
            method: 'GET',
            url: '/gmail/v1/users/{userId}/labels',
            path: {
                userId,
            },
        });
    }

    public static labelsGet(
        userId: string = 'me',
        id: string
    ) {
        return __request<Label>(OpenAPI, {
            method: 'GET',
            url: '/gmail/v1/users/{userId}/labels/{id}',
            path: {
                userId,
                id,
            },
        });
    }

    public static labelsCreate(
        userId: string = 'me',
        body: Label
    ) {
        return __request<Label>(OpenAPI, {
            method: 'POST',
            url: '/gmail/v1/users/{userId}/labels',
            path: {
                userId,
            },
            body,
            mediaType: 'application/json',
        });
    }

    public static labelsUpdate(
        userId: string = 'me',
        id: string,
        body: Label
    ) {
        return __request<Label>(OpenAPI, {
            method: 'PUT',
            url: '/gmail/v1/users/{userId}/labels/{id}',
            path: {
                userId,
                id,
            },
            body,
            mediaType: 'application/json',
        });
    }

    public static labelsPatch(
        userId: string = 'me',
        id: string,
        body: Partial<Label>
    ) {
        return __request<Label>(OpenAPI, {
            method: 'PATCH',
            url: '/gmail/v1/users/{userId}/labels/{id}',
            path: {
                userId,
                id,
            },
            body,
            mediaType: 'application/json',
        });
    }

    public static labelsDelete(
        userId: string = 'me',
        id: string
    ) {
        return __request<void>(OpenAPI, {
            method: 'DELETE',
            url: '/gmail/v1/users/{userId}/labels/{id}',
            path: {
                userId,
                id,
            },
        });
    }
}

export class DraftsService {
    public static draftsList(
        userId: string = 'me',
        maxResults?: number,
        pageToken?: string,
        q?: string
    ) {
        return __request<DraftListResponse>(OpenAPI, {
            method: 'GET',
            url: '/gmail/v1/users/{userId}/drafts',
            path: {
                userId,
            },
            query: {
                maxResults,
                pageToken,
                q,
            },
        });
    }

    public static draftsGet(
        userId: string = 'me',
        id: string,
        format?: 'minimal' | 'full' | 'raw' | 'metadata'
    ) {
        return __request<Draft>(OpenAPI, {
            method: 'GET',
            url: '/gmail/v1/users/{userId}/drafts/{id}',
            path: {
                userId,
                id,
            },
            query: {
                format,
            },
        });
    }

    public static draftsCreate(
        userId: string = 'me',
        body: Draft
    ) {
        return __request<Draft>(OpenAPI, {
            method: 'POST',
            url: '/gmail/v1/users/{userId}/drafts',
            path: {
                userId,
            },
            body,
            mediaType: 'application/json',
        });
    }

    public static draftsUpdate(
        userId: string = 'me',
        id: string,
        body: Draft
    ) {
        return __request<Draft>(OpenAPI, {
            method: 'PUT',
            url: '/gmail/v1/users/{userId}/drafts/{id}',
            path: {
                userId,
                id,
            },
            body,
            mediaType: 'application/json',
        });
    }

    public static draftsDelete(
        userId: string = 'me',
        id: string
    ) {
        return __request<void>(OpenAPI, {
            method: 'DELETE',
            url: '/gmail/v1/users/{userId}/drafts/{id}',
            path: {
                userId,
                id,
            },
        });
    }

    public static draftsSend(
        userId: string = 'me',
        body: { id?: string; message?: Message }
    ) {
        return __request<Message>(OpenAPI, {
            method: 'POST',
            url: '/gmail/v1/users/{userId}/drafts/send',
            path: {
                userId,
            },
            body,
            mediaType: 'application/json',
        });
    }
}

export class ThreadsService {
    public static threadsList(
        userId: string = 'me',
        q?: string,
        maxResults?: number,
        pageToken?: string,
        labelIds?: string[],
        includeSpamTrash?: boolean
    ) {
        return __request<ThreadListResponse>(OpenAPI, {
            method: 'GET',
            url: '/gmail/v1/users/{userId}/threads',
            path: {
                userId,
            },
            query: {
                q,
                maxResults,
                pageToken,
                labelIds,
                includeSpamTrash,
            },
        });
    }

    public static threadsGet(
        userId: string = 'me',
        id: string,
        format?: 'minimal' | 'full' | 'metadata',
        metadataHeaders?: string[]
    ) {
        return __request<Thread>(OpenAPI, {
            method: 'GET',
            url: '/gmail/v1/users/{userId}/threads/{id}',
            path: {
                userId,
                id,
            },
            query: {
                format,
                metadataHeaders,
            },
        });
    }

    public static threadsModify(
        userId: string = 'me',
        id: string,
        body: ModifyThreadRequest
    ) {
        return __request<Thread>(OpenAPI, {
            method: 'POST',
            url: '/gmail/v1/users/{userId}/threads/{id}/modify',
            path: {
                userId,
                id,
            },
            body,
            mediaType: 'application/json',
        });
    }

    public static threadsDelete(
        userId: string = 'me',
        id: string
    ) {
        return __request<void>(OpenAPI, {
            method: 'DELETE',
            url: '/gmail/v1/users/{userId}/threads/{id}',
            path: {
                userId,
                id,
            },
        });
    }

    public static threadsTrash(
        userId: string = 'me',
        id: string
    ) {
        return __request<Thread>(OpenAPI, {
            method: 'POST',
            url: '/gmail/v1/users/{userId}/threads/{id}/trash',
            path: {
                userId,
                id,
            },
        });
    }

    public static threadsUntrash(
        userId: string = 'me',
        id: string
    ) {
        return __request<Thread>(OpenAPI, {
            method: 'POST',
            url: '/gmail/v1/users/{userId}/threads/{id}/untrash',
            path: {
                userId,
                id,
            },
        });
    }
}

export class HistoryService {
    public static historyList(
        userId: string = 'me',
        startHistoryId: string,
        maxResults?: number,
        pageToken?: string,
        labelId?: string,
        historyTypes?: ('messageAdded' | 'messageDeleted' | 'labelAdded' | 'labelRemoved')[]
    ) {
        return __request<HistoryListResponse>(OpenAPI, {
            method: 'GET',
            url: '/gmail/v1/users/{userId}/history',
            path: {
                userId,
            },
            query: {
                startHistoryId,
                maxResults,
                pageToken,
                labelId,
                historyTypes,
            },
        });
    }
}

export class UsersService {
    public static usersGetProfile(userId: string = 'me') {
        return __request<Profile>(OpenAPI, {
            method: 'GET',
            url: '/gmail/v1/users/{userId}/profile',
            path: {
                userId,
            },
        });
    }

    public static usersWatch(
        userId: string = 'me',
        body: WatchRequest
    ) {
        return __request<WatchResponse>(OpenAPI, {
            method: 'POST',
            url: '/gmail/v1/users/{userId}/watch',
            path: {
                userId,
            },
            body,
            mediaType: 'application/json',
        });
    }

    public static usersStop(userId: string = 'me') {
        return __request<void>(OpenAPI, {
            method: 'POST',
            url: '/gmail/v1/users/{userId}/stop',
            path: {
                userId,
            },
        });
    }
}

