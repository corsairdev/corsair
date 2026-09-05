import {
	SourcegraphCommit,
	SourcegraphFile,
	SourcegraphRepository,
	SourcegraphSite,
	SourcegraphUser,
} from './database';

export const SourcegraphSchema = {
	version: '1.0.0',
	entities: {
		users: SourcegraphUser,
		repositories: SourcegraphRepository,
		commits: SourcegraphCommit,
		files: SourcegraphFile,
		sites: SourcegraphSite,
	},
} as const;

export type {
	SourcegraphCommit,
	SourcegraphFile,
	SourcegraphRepository,
	SourcegraphSite,
	SourcegraphUser,
} from './database';
