import type { RequiredPluginEndpointMeta } from 'corsair/core';
import { ApiKeysEndpoints } from './api-keys';
import { AuthEndpoints } from './auth';
import { BranchesEndpoints } from './branches';
import { ComputeEndpointsEndpoints } from './compute-endpoints';
import { ConsumptionEndpoints } from './consumption';
import { DataApiEndpoints } from './data-api';
import { DatabasesEndpoints } from './databases';
import type { NeonOperation } from './operations';
import { neonOperations } from './operations';
import { OrganizationsEndpoints } from './organizations';
import { ProjectsEndpoints } from './projects';
import { RegionsEndpoints } from './regions';
import { RolesEndpoints } from './roles';
import { SnapshotsEndpoints } from './snapshots';
import { NeonEndpointInputSchemas, NeonEndpointOutputSchemas } from './types';
import { UsersEndpoints } from './users';
import { VpcEndpoints } from './vpc';

export const neonEndpointsNested = {
	apiKeys: ApiKeysEndpoints,
	auth: AuthEndpoints,
	branches: BranchesEndpoints,
	computeEndpoints: ComputeEndpointsEndpoints,
	consumption: ConsumptionEndpoints,
	dataApi: DataApiEndpoints,
	databases: DatabasesEndpoints,
	organizations: OrganizationsEndpoints,
	projects: ProjectsEndpoints,
	regions: RegionsEndpoints,
	roles: RolesEndpoints,
	snapshots: SnapshotsEndpoints,
	users: UsersEndpoints,
	vpc: VpcEndpoints,
} as const;

// Object.fromEntries widens keys to string; assert to the meta map keyed
// by nested endpoint paths, which the entries mirror 1:1 (every operation
// in neonOperations has a matching handler, verified by api.test.ts)
export const neonEndpointMeta = Object.fromEntries(
	neonOperations.map((operation: NeonOperation) => [
		`${operation.group}.${operation.name}`,
		{
			riskLevel: operation.riskLevel,
			irreversible: operation.irreversible,
			description: operation.description,
		},
	]),
) as RequiredPluginEndpointMeta<typeof neonEndpointsNested>;

export const neonEndpointSchemas = Object.fromEntries(
	neonOperations.map((operation: NeonOperation) => [
		`${operation.group}.${operation.name}`,
		{
			input: NeonEndpointInputSchemas[operation.key],
			output: NeonEndpointOutputSchemas[operation.key],
		},
	]),
);

export { NeonEndpointInputSchemas, NeonEndpointOutputSchemas };

export * from './operations';
export * from './types';
