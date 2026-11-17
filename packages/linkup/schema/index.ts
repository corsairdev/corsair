import {
	LinkupCreditEntity,
	LinkupResponseEntity,
	LinkupSourceEntity,
} from './database';

export const LinkupSchema = {
	version: '1.0.0',
	entities: {
		credits: LinkupCreditEntity,
		sources: LinkupSourceEntity,
		responses: LinkupResponseEntity,
	},
} as const;
