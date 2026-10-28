import { defineUnipileWebhook } from './define';
import {
	AccountAddEventSchema,
	AccountLockedEventSchema,
	AccountReconnectEventSchema,
	AccountRemoveEventSchema,
	AccountStatusDegradedEventSchema,
	AccountStatusDisconnectedEventSchema,
	AccountStatusErroredEventSchema,
	AccountStatusPartialEventSchema,
	AccountStatusRunningEventSchema,
	AccountUnlockedEventSchema,
} from './types';

// Status lifecycle: https://developer.unipile.com/v2.0/docs/status-lifecycle

export const accountStatusRunning = defineUnipileWebhook(
	'accountStatusRunning',
	'account.status.running',
	AccountStatusRunningEventSchema,
);

export const accountStatusPartial = defineUnipileWebhook(
	'accountStatusPartial',
	'account.status.partial',
	AccountStatusPartialEventSchema,
);

export const accountStatusDegraded = defineUnipileWebhook(
	'accountStatusDegraded',
	'account.status.degraded',
	AccountStatusDegradedEventSchema,
);

export const accountStatusErrored = defineUnipileWebhook(
	'accountStatusErrored',
	'account.status.errored',
	AccountStatusErroredEventSchema,
);

// The account needs signing in again: send the user a reconnect link
// (accounts.createAuthLink with account_id) and pause sends until it runs.
export const accountStatusDisconnected = defineUnipileWebhook(
	'accountStatusDisconnected',
	'account.status.disconnected',
	AccountStatusDisconnectedEventSchema,
);

// The account is ready as soon as this arrives; payload.state is the state
// given to accounts.createAuthLink.
export const accountAdd = defineUnipileWebhook(
	'accountAdd',
	'account.add',
	AccountAddEventSchema,
);

export const accountReconnect = defineUnipileWebhook(
	'accountReconnect',
	'account.reconnect',
	AccountReconnectEventSchema,
);

export const accountRemove = defineUnipileWebhook(
	'accountRemove',
	'account.remove',
	AccountRemoveEventSchema,
);

export const accountLocked = defineUnipileWebhook(
	'accountLocked',
	'account.locked',
	AccountLockedEventSchema,
);

export const accountUnlocked = defineUnipileWebhook(
	'accountUnlocked',
	'account.unlocked',
	AccountUnlockedEventSchema,
);
