import { status as callsStatus } from './calls';
import { received as messagesReceived, status as messagesStatus } from './messages';

export const Messages = {
	received: messagesReceived,
	status: messagesStatus,
};

export const Calls = {
	status: callsStatus,
};

export * from './types';
