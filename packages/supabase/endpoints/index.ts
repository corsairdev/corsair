import { AdvisorsEndpoints } from './advisors';
import { AnalyticsEndpoints } from './analytics';
import { AuthEndpoints } from './auth';
import { DatabaseEndpoints } from './database';
import { DomainsEndpoints } from './domains';
import { EdgeFunctionsEndpoints } from './edge-functions';
import { EnvironmentsEndpoints } from './environments';
import { OAuthEndpoints } from './oauth';
import type { SupabaseOperation } from './operations';
import { supabaseOperations } from './operations';
import { OrganizationsEndpoints } from './organizations';
import { ProjectsEndpoints } from './projects';
import { RestEndpoints } from './rest';
import { SecretsEndpoints } from './secrets';
import { StorageEndpoints } from './storage';
import {
	SupabaseEndpointInputSchemas,
	SupabaseEndpointOutputSchemas,
} from './types';

export const supabaseEndpointsNested = {
	advisors: AdvisorsEndpoints,
	analytics: AnalyticsEndpoints,
	auth: AuthEndpoints,
	database: DatabaseEndpoints,
	domains: DomainsEndpoints,
	edgeFunctions: EdgeFunctionsEndpoints,
	environments: EnvironmentsEndpoints,
	oauth: OAuthEndpoints,
	organizations: OrganizationsEndpoints,
	projects: ProjectsEndpoints,
	rest: RestEndpoints,
	secrets: SecretsEndpoints,
	storage: StorageEndpoints,
} as const;

export const supabaseEndpointMeta = Object.fromEntries(
	supabaseOperations.map((operation: SupabaseOperation) => [
		`${operation.group}.${operation.name}`,
		{
			riskLevel: operation.riskLevel,
			irreversible: operation.irreversible,
			description: operation.description,
		},
	]),
);

export const supabaseEndpointSchemas = Object.fromEntries(
	supabaseOperations.map((operation: SupabaseOperation) => [
		`${operation.group}.${operation.name}`,
		{
			input: SupabaseEndpointInputSchemas[operation.key],
			output: SupabaseEndpointOutputSchemas[operation.key],
		},
	]),
);

export { SupabaseEndpointInputSchemas, SupabaseEndpointOutputSchemas };

export * from './operations';
export * from './types';
