import { advisorsOperations } from '../operations/advisors';
import { analyticsOperations } from '../operations/analytics';
import { authOperations } from '../operations/auth';
import { databaseOperations } from '../operations/database';
import { domainsOperations } from '../operations/domains';
import { edgeFunctionOperations } from '../operations/edge-functions';
import { environmentsOperations } from '../operations/environments';
import { oauthOperations } from '../operations/oauth';
import { organizationsOperations } from '../operations/organizations';
import { projectsOperations } from '../operations/projects';
import { restOperations } from '../operations/rest';
import { secretsOperations } from '../operations/secrets';
import { storageOperations } from '../operations/storage';

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
