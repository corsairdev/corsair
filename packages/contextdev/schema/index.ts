import { ContextDevBrand, ContextDevNewsArticle } from './database';

export const ContextDevSchema = {
	version: '1.0.0',
	entities: {
		brands: ContextDevBrand,
		newsArticles: ContextDevNewsArticle,
	},
} as const;

export type { ContextDevBrand, ContextDevNewsArticle } from './database';
