import {
	ExistAttribute,
	ExistAttributeValue,
	ExistAverage,
	ExistCorrelation,
	ExistInsight,
	ExistProfile,
} from './database';

export const ExistSchema = {
	version: '1.0.0',
	entities: {
		profile: ExistProfile,
		attributes: ExistAttribute,
		attributeValues: ExistAttributeValue,
		averages: ExistAverage,
		correlations: ExistCorrelation,
		insights: ExistInsight,
	},
} as const;

export * from './database';
