import {
	AgentQLAccountUsage,
	AgentQLBrowserSession,
	AgentQLDocumentQueryResult,
	AgentQLQueryResult,
} from './database';

export const AgentQLSchema = {
	version: '1.0.0',
	entities: {
		queryResults: AgentQLQueryResult,
		documentQueryResults: AgentQLDocumentQueryResult,
		browserSessions: AgentQLBrowserSession,
		accountUsage: AgentQLAccountUsage,
	},
} as const;
