import { advisorsOperations } from './operation-groups/advisors';
import { analyticsOperations } from './operation-groups/analytics';
import { authOperations } from './operation-groups/auth';
import { databaseOperations } from './operation-groups/database';
import { domainsOperations } from './operation-groups/domains';
import { edgeFunctionOperations } from './operation-groups/edge-functions';
import { environmentsOperations } from './operation-groups/environments';
import { oauthOperations } from './operation-groups/oauth';
import { organizationsOperations } from './operation-groups/organizations';
import { projectsOperations } from './operation-groups/projects';
import { restOperations } from './operation-groups/rest';
import { secretsOperations } from './operation-groups/secrets';
import { storageOperations } from './operation-groups/storage';

export type {
	SupabaseMethod,
	SupabaseOperation,
	SupabaseOperationKind,
} from './operation-types';

export const supabaseOperations = [
	...domainsOperations,
	...databaseOperations,
	...oauthOperations,
	...projectsOperations,
	...secretsOperations,
	...edgeFunctionOperations,
	...environmentsOperations,
	...authOperations,
	...organizationsOperations,
	...advisorsOperations,
	...storageOperations,
	...analyticsOperations,
	...restOperations,
] as const;
