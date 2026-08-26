import {
	ZoominfoCompany,
	ZoominfoContact,
	ZoominfoIntentSignal,
	ZoominfoLocation,
	ZoominfoNewsArticle,
	ZoominfoScoop,
	ZoominfoTechnology,
} from './database';

export const ZoominfoSchema = {
	version: '1.0.0',
	entities: {
		companies: ZoominfoCompany,
		contacts: ZoominfoContact,
		intentSignals: ZoominfoIntentSignal,
		newsArticles: ZoominfoNewsArticle,
		scoops: ZoominfoScoop,
		technologies: ZoominfoTechnology,
		locations: ZoominfoLocation,
	},
} as const;

export * from './database';
