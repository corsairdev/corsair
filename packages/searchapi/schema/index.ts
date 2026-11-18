import {
	SearchApiAccountEntity,
	SearchApiLocationEntity,
	SearchApiSearchEntity,
} from './database';

export const SearchApiSchema = {
	version: '1.0.0',
	entities: {
		accounts: SearchApiAccountEntity,
		locations: SearchApiLocationEntity,
		searches: SearchApiSearchEntity,
	},
} as const;
