import {
	DeepwikiMcpQuestion,
	DeepwikiMcpWikiContents,
	DeepwikiMcpWikiStructure,
} from './database';

export const DeepwikiMcpSchema = {
	version: '1.0.0',
	entities: {
		questions: DeepwikiMcpQuestion,
		wikiContents: DeepwikiMcpWikiContents,
		wikiStructures: DeepwikiMcpWikiStructure,
	},
} as const;
