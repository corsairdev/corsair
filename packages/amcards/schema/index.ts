import {
	AmcardsCard,
	AmcardsCategory,
	AmcardsContact,
	AmcardsGift,
	AmcardsPublicTemplate,
} from './database';

export const AmcardsSchema = {
	version: '1.0.0',
	entities: {
		cards: AmcardsCard,
		contacts: AmcardsContact,
		categories: AmcardsCategory,
		gifts: AmcardsGift,
		templates: AmcardsPublicTemplate,
	},
} as const;

export * from './database';
