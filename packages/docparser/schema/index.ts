import {
	DocparserModelEntity,
	DocparserParserEntity,
	DocparserPingEntity,
	DocparserResultEntity,
} from './database';

export const DocparserSchema = {
	version: '1.0.0',
	entities: {
		pings: DocparserPingEntity,
		parsers: DocparserParserEntity,
		models: DocparserModelEntity,
		results: DocparserResultEntity,
	},
} as const;
