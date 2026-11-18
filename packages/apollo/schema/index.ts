import {
	ApolloNewsArticle,
	ApolloOrganization,
	ApolloPerson,
} from './database';

export const ApolloSchema = {
	version: '1.0.0',
	entities: {
		organizations: ApolloOrganization,
		people: ApolloPerson,
		newsArticles: ApolloNewsArticle,
	},
} as const;

export type {
	ApolloNewsArticle,
	ApolloOrganization,
	ApolloPerson,
} from './database';
