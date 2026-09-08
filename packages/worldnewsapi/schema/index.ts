import {
	WorldNewsArticle,
	WorldNewsExtractedArticle,
	WorldNewsGeoCoordinate,
	WorldNewsSource,
} from './database';

export const WorldNewsApiSchema = {
	version: '1.0.0',
	entities: {
		articles: WorldNewsArticle,
		extractedArticles: WorldNewsExtractedArticle,
		geoCoordinates: WorldNewsGeoCoordinate,
		sources: WorldNewsSource,
	},
} as const;

export * from './database';
