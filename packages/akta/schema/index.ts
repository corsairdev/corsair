import { AktaCompany, AktaNewsArticle } from './database';

export const AktaSchema = {
	version: '1.0.0',
	entities: {
		companies: AktaCompany,
		newsArticles: AktaNewsArticle,
	},
} as const;

export type { AktaCompany, AktaNewsArticle } from './database';
