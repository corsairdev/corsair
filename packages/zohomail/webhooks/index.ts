import { handshake } from './challenge';
import { messageReceived } from './messages';

export const ChallengeWebhooks = {
	handshake,
};

export const MessageWebhooks = {
	messageReceived,
};

export * from './types';
