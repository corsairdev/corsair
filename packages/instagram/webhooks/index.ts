import { url_verification } from './challenge';
import { comments } from './comments';
import { messageReceived } from './messages';

export const InstagramWebhooks = {
	messageReceived,
	url_verification,
	comments,
};

export * from './types';
