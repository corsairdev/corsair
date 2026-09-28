import {
	SendGridBounce,
	SendGridContact,
	SendGridList,
	SendGridVerifiedSender,
} from './database';

export const SendGridSchema = {
	version: '1.0.0',
	entities: {
		contacts: SendGridContact,
		lists: SendGridList,
		bounces: SendGridBounce,
		senders: SendGridVerifiedSender,
	},
} as const;

export {
	SendGridBounce,
	SendGridContact,
	SendGridList,
	SendGridVerifiedSender,
} from './database';
