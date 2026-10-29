import { TinyurlLink } from './database';

export const TinyurlSchema = {
	version: '1.0.0',
	entities: {
		links: TinyurlLink,
	},
} as const;

export * from './database';
