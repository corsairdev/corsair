import {
	accountAdd,
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
import { messageNew, messageReceiptRead } from './messages';
import { relationNew } from './relations';

export const RelationWebhooks = { new: relationNew };

export const MessageWebhooks = {
	new: messageNew,
	receiptRead: messageReceiptRead,
};

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
};

export * from './tenant-matcher';
export * from './types';
