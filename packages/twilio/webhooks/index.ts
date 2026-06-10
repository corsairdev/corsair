import { statusUpdate as callStatusUpdate } from './calls';
import {
	received as messageReceived,
	statusUpdate as messageStatusUpdate,
} from './messages';

export const MessageWebhooks = {
	received: messageReceived,
	statusUpdate: messageStatusUpdate,
};

export const CallWebhooks = {
	statusUpdate: callStatusUpdate,
};

export * from './types';
