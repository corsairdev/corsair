export type MessagePartHeader = {
    name?: string;
    value?: string;
};

export type MessagePartBody = {
    attachmentId?: string;
    size?: number;
    data?: string;
};

export type MessagePart = {
    partId?: string;
    mimeType?: string;
    filename?: string;
    headers?: MessagePartHeader[];
    body?: MessagePartBody;
    parts?: MessagePart[];
};

export type Message = {
    id?: string;
    threadId?: string;
    labelIds?: string[];
    snippet?: string;
    historyId?: string;
    internalDate?: string;
    payload?: MessagePart;
    sizeEstimate?: number;
    raw?: string;
};

export type MessageListResponse = {
    messages?: Message[];
    nextPageToken?: string;
    resultSizeEstimate?: number;
};

export type ModifyMessageRequest = {
    addLabelIds?: string[];
    removeLabelIds?: string[];
};

export type BatchModifyMessagesRequest = {
    ids?: string[];
    addLabelIds?: string[];
    removeLabelIds?: string[];
};

export type Label = {
    id?: string;
    name?: string;
    messageListVisibility?: 'show' | 'hide';
    labelListVisibility?: 'labelShow' | 'labelShowIfUnread' | 'labelHide';
    type?: 'system' | 'user';
    messagesTotal?: number;
    messagesUnread?: number;
    threadsTotal?: number;
    threadsUnread?: number;
    color?: {
        textColor?: string;
        backgroundColor?: string;
    };
};

export type LabelListResponse = {
    labels?: Label[];
};

export type Draft = {
    id?: string;
    message?: Message;
};

export type DraftListResponse = {
    drafts?: Draft[];
    nextPageToken?: string;
    resultSizeEstimate?: number;
};

export type Thread = {
    id?: string;
    snippet?: string;
    historyId?: string;
    messages?: Message[];
};

export type ThreadListResponse = {
    threads?: Thread[];
    nextPageToken?: string;
    resultSizeEstimate?: number;
};

export type ModifyThreadRequest = {
    addLabelIds?: string[];
    removeLabelIds?: string[];
};

export type HistoryMessageAdded = {
    message?: Message;
};

export type HistoryMessageDeleted = {
    message?: Message;
};

export type HistoryLabelAdded = {
    message?: Message;
    labelIds?: string[];
};

export type HistoryLabelRemoved = {
    message?: Message;
    labelIds?: string[];
};

export type History = {
    id?: string;
    messages?: Message[];
    messagesAdded?: HistoryMessageAdded[];
    messagesDeleted?: HistoryMessageDeleted[];
    labelsAdded?: HistoryLabelAdded[];
    labelsRemoved?: HistoryLabelRemoved[];
};

export type HistoryListResponse = {
    history?: History[];
    nextPageToken?: string;
    historyId?: string;
};

export type WatchRequest = {
    labelIds?: string[];
    labelFilterAction?: 'include' | 'exclude';
    topicName?: string;
};

export type WatchResponse = {
    historyId?: string;
    expiration?: string;
};

export type Profile = {
    emailAddress?: string;
    messagesTotal?: number;
    threadsTotal?: number;
    historyId?: string;
};

export type SendMessageRequest = {
    raw?: string;
    threadId?: string;
};

export type GmailError = {
    error?: {
        code?: number;
        message?: string;
        errors?: Array<{
            domain?: string;
            reason?: string;
            message?: string;
        }>;
    };
};

