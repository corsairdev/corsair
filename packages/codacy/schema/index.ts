import {
	CodacyAccount,
	CodacyCommit,
	CodacyIssue,
	CodacyOrganization,
	CodacyRepository,
	CodacyTool,
} from './database';

export type {
	CodacyAccount,
	CodacyCommit,
	CodacyIssue,
	CodacyOrganization,
	CodacyRepository,
	CodacyTool,
} from './database';

export const CodacySchema = {
	version: '0.1.0',
	entities: {
		account: CodacyAccount,
		organization: CodacyOrganization,
		repository: CodacyRepository,
		tool: CodacyTool,
		commit: CodacyCommit,
		issue: CodacyIssue,
	},
} as const;

export type CodacySchema = typeof CodacySchema;
