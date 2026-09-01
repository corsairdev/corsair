import {
	SendGridBounce,
	SendGridContact,
	SendGridEmailEvent,
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
		events: SendGridEmailEvent,
	},
} as const;

export {
	SendGridBounce,
	SendGridContact,
	SendGridEmailEvent,
	SendGridList,
	SendGridVerifiedSender,
} from './database';
