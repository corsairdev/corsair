import {
	TisaneAbuseDetection,
	TisaneEntity,
	TisaneParseResult,
	TisaneSentimentAspect,
	TisaneTopic,
} from './database';

export const TisaneSchema = {
	version: '1.0.0',
	entities: {
		parseResult: TisaneParseResult,
		sentimentAspect: TisaneSentimentAspect,
		abuseDetection: TisaneAbuseDetection,
		entity: TisaneEntity,
		topic: TisaneTopic,
	},
} as const;

export * from './database';
