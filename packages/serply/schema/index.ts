import {
	SerplyArticleEntity,
	SerplyImageEntity,
	SerplyPlaceEntity,
} from './database';

export const SerplySchema = {
	version: '1.0.0',
	entities: {
		images: SerplyImageEntity,
		places: SerplyPlaceEntity,
		articles: SerplyArticleEntity,
	},
} as const;
