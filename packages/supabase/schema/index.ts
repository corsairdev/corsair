import {
	SupabaseApiKey,
	SupabaseBranch,
	SupabaseBucket,
	SupabaseFunction,
	SupabaseMigration,
	SupabaseOrganization,
	SupabaseProject,
} from './database';

export const SupabaseSchema = {
	version: '1.0.0',
	entities: {
		projects: SupabaseProject,
		organizations: SupabaseOrganization,
		functions: SupabaseFunction,
		branches: SupabaseBranch,
		buckets: SupabaseBucket,
		apiKeys: SupabaseApiKey,
		migrations: SupabaseMigration,
	},
} as const;
