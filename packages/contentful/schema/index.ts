import { ContentfulSpace } from './database';

export const ContentfulSchema = {
	version: '1.0.0',
	entities: {
		space: ContentfulSpace,
	},
} as const;
