import {
	CodacyAccount,
	CodacyOrganization,
	CodacyPattern,
	CodacyRepository,
	CodacyTool,
} from './database';

export type {
	CodacyAccount,
	CodacyOrganization,
	CodacyPattern,
	CodacyRepository,
	CodacyTool,
} from './database';

export const CodacySchema = {
	version: '0.1.0',
	entities: {
		accounts: CodacyAccount,
		organizations: CodacyOrganization,
		repositories: CodacyRepository,
		tools: CodacyTool,
		patterns: CodacyPattern,
	},
} as const;

export type CodacySchema = typeof CodacySchema;
