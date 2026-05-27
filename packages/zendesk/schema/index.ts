import { ZendeskComment, ZendeskTicket, ZendeskUser } from './database';

export const ZendeskSchema = {
	version: '1.0.0',
	entities: {
		tickets: ZendeskTicket,
		users: ZendeskUser,
		comments: ZendeskComment,
	},
} as const;

export type {
	ZendeskComment,
	ZendeskTicket,
	ZendeskUser,
} from './database';
