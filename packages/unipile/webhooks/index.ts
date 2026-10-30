import {
	accountAdd,
	accountInitialSyncCompleted,
	accountInitialSyncFailed,
	accountInitialSyncRunning,
	accountLocked,
	accountReconnect,
	accountRemove,
	accountStatusDegraded,
	accountStatusDisconnected,
	accountStatusErrored,
	accountStatusPartial,
	accountStatusRunning,
	accountUnlocked,
} from './accounts';
import {
	calendarCreate,
	calendarDelete,
	calendarEventDelete,
	calendarEventNew,
	calendarEventUpdate,
	calendarUpdate,
} from './calendars';
import { chatDelete, chatUpdate } from './chats';
import {
	emailBounce,
	emailDelete,
	emailDraftDelete,
	emailDraftNew,
	emailFolderCreate,
	emailFolderDelete,
	emailFolderUpdate,
	emailNew,
} from './emails';
import {
	messageDelete,
	messageNew,
	messageReactionDelete,
	messageReactionNew,
	messageReceiptDelivery,
	messageReceiptRead,
	messageUpdate,
} from './messages';
import { followerNew, relationNew } from './relations';
import { trackingClick, trackingOpen } from './tracking';

export const RelationWebhooks = { new: relationNew };

export const FollowerWebhooks = { new: followerNew };

export const MessageWebhooks = {
	new: messageNew,
	update: messageUpdate,
	delete: messageDelete,
	receiptRead: messageReceiptRead,
	receiptDelivery: messageReceiptDelivery,
	reactionNew: messageReactionNew,
	reactionDelete: messageReactionDelete,
};

export const ChatWebhooks = { update: chatUpdate, delete: chatDelete };

export const AccountWebhooks = {
	statusRunning: accountStatusRunning,
	statusPartial: accountStatusPartial,
	statusDegraded: accountStatusDegraded,
	statusErrored: accountStatusErrored,
	statusDisconnected: accountStatusDisconnected,
	add: accountAdd,
	reconnect: accountReconnect,
	remove: accountRemove,
	locked: accountLocked,
	unlocked: accountUnlocked,
	initialSyncRunning: accountInitialSyncRunning,
	initialSyncCompleted: accountInitialSyncCompleted,
	initialSyncFailed: accountInitialSyncFailed,
};

export const EmailWebhooks = {
	new: emailNew,
	bounce: emailBounce,
	delete: emailDelete,
};

export const EmailDraftWebhooks = {
	new: emailDraftNew,
	delete: emailDraftDelete,
};

export const EmailFolderWebhooks = {
	create: emailFolderCreate,
	update: emailFolderUpdate,
	delete: emailFolderDelete,
};

export const CalendarWebhooks = {
	create: calendarCreate,
	update: calendarUpdate,
	delete: calendarDelete,
};

export const CalendarEventWebhooks = {
	new: calendarEventNew,
	update: calendarEventUpdate,
	delete: calendarEventDelete,
};

export const TrackingWebhooks = { open: trackingOpen, click: trackingClick };

export * from './tenant-matcher';
export * from './types';
