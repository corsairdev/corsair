import { apiKeysOperations } from '../operations/api-keys';
import { authOperations } from '../operations/auth';
import { branchesOperations } from '../operations/branches';
import { computeEndpointsOperations } from '../operations/compute-endpoints';
import { consumptionOperations } from '../operations/consumption';
import { dataApiOperations } from '../operations/data-api';
import { databasesOperations } from '../operations/databases';
import { organizationsOperations } from '../operations/organizations';
import { projectsOperations } from '../operations/projects';
import { regionsOperations } from '../operations/regions';
import { rolesOperations } from '../operations/roles';
import { snapshotsOperations } from '../operations/snapshots';
import { usersOperations } from '../operations/users';
import { vpcOperations } from '../operations/vpc';

export type { NeonMethod, NeonOperation } from './operation-types';

export const neonOperations = [
	...apiKeysOperations,
	...projectsOperations,
	...branchesOperations,
	...databasesOperations,
	...rolesOperations,
	...computeEndpointsOperations,
	...dataApiOperations,
	...authOperations,
	...organizationsOperations,
	...vpcOperations,
	...snapshotsOperations,
	...consumptionOperations,
	...usersOperations,
	...regionsOperations,
] as const;
