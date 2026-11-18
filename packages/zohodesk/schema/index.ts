import { ZohoDeskContact, ZohoDeskTicket } from './database';

export const ZohoDeskSchema = {
	version: '1.0.0',
	entities: {
		tickets: ZohoDeskTicket,
		contacts: ZohoDeskContact,
	},
} as const;

export type { ZohoDeskContact, ZohoDeskTicket } from './database';
