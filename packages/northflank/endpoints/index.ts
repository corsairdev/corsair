import type { RequiredPluginEndpointMeta } from 'corsair/core';
import { EnvironmentsEndpoints } from './environments';
import { PlansEndpoints } from './plans';
import { ProjectsEndpoints } from './projects';
import { RegionsEndpoints } from './regions';
import { SecretsEndpoints } from './secrets';
import { ServicesEndpoints } from './services';
import {
	NorthflankEndpointInputSchemas,
	NorthflankEndpointOutputSchemas,
} from './types';

export const northflankEndpointsNested = {
	projects: ProjectsEndpoints,
	services: ServicesEndpoints,
	environments: EnvironmentsEndpoints,
	secrets: SecretsEndpoints,
	plans: PlansEndpoints,
	regions: RegionsEndpoints,
} as const;

export const northflankEndpointMeta = {
	'projects.list': {
		riskLevel: 'read',
		description: 'List Northflank projects',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get details of a Northflank project',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a new Northflank project',
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Update an existing Northflank project',
	},
	'services.list': {
		riskLevel: 'read',
		description: 'List services in a Northflank project',
	},
	'services.get': {
		riskLevel: 'read',
		description: 'Get details of a Northflank service',
	},
	'services.createCombined': {
		riskLevel: 'write',
		description: 'Create a new combined service in a project',
	},
	'services.updateCombined': {
		riskLevel: 'write',
		description: 'Update an existing combined service in a project',
	},
	'environments.listPreviews': {
		riskLevel: 'read',
		description: 'List preview environments for a preview blueprint',
	},
	'secrets.list': {
		riskLevel: 'read',
		description: 'List secrets in a Northflank project',
	},
	'secrets.get': {
		riskLevel: 'read',
		description: 'Get details of a Northflank secret',
	},
	'secrets.create': {
		riskLevel: 'write',
		description: 'Create a new Northflank secret',
	},
	'secrets.update': {
		riskLevel: 'write',
		description: 'Update an existing Northflank secret',
	},
	'plans.list': {
		riskLevel: 'read',
		description: 'List available Northflank resource plans',
	},
	'regions.list': {
		riskLevel: 'read',
		description: 'List available Northflank regions',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof northflankEndpointsNested
>;

export const northflankEndpointSchemas = {
	'projects.list': {
		input: NorthflankEndpointInputSchemas['projects.list'],
		output: NorthflankEndpointOutputSchemas['projects.list'],
	},
	'projects.get': {
		input: NorthflankEndpointInputSchemas['projects.get'],
		output: NorthflankEndpointOutputSchemas['projects.get'],
	},
	'projects.create': {
		input: NorthflankEndpointInputSchemas['projects.create'],
		output: NorthflankEndpointOutputSchemas['projects.create'],
	},
	'projects.update': {
		input: NorthflankEndpointInputSchemas['projects.update'],
		output: NorthflankEndpointOutputSchemas['projects.update'],
	},
	'services.list': {
		input: NorthflankEndpointInputSchemas['services.list'],
		output: NorthflankEndpointOutputSchemas['services.list'],
	},
	'services.get': {
		input: NorthflankEndpointInputSchemas['services.get'],
		output: NorthflankEndpointOutputSchemas['services.get'],
	},
	'services.createCombined': {
		input: NorthflankEndpointInputSchemas['services.createCombined'],
		output: NorthflankEndpointOutputSchemas['services.createCombined'],
	},
	'services.updateCombined': {
		input: NorthflankEndpointInputSchemas['services.updateCombined'],
		output: NorthflankEndpointOutputSchemas['services.updateCombined'],
	},
	'environments.listPreviews': {
		input: NorthflankEndpointInputSchemas['environments.listPreviews'],
		output: NorthflankEndpointOutputSchemas['environments.listPreviews'],
	},
	'secrets.list': {
		input: NorthflankEndpointInputSchemas['secrets.list'],
		output: NorthflankEndpointOutputSchemas['secrets.list'],
	},
	'secrets.get': {
		input: NorthflankEndpointInputSchemas['secrets.get'],
		output: NorthflankEndpointOutputSchemas['secrets.get'],
	},
	'secrets.create': {
		input: NorthflankEndpointInputSchemas['secrets.create'],
		output: NorthflankEndpointOutputSchemas['secrets.create'],
	},
	'secrets.update': {
		input: NorthflankEndpointInputSchemas['secrets.update'],
		output: NorthflankEndpointOutputSchemas['secrets.update'],
	},
	'plans.list': {
		input: NorthflankEndpointInputSchemas['plans.list'],
		output: NorthflankEndpointOutputSchemas['plans.list'],
	},
	'regions.list': {
		input: NorthflankEndpointInputSchemas['regions.list'],
		output: NorthflankEndpointOutputSchemas['regions.list'],
	},
};

export { NorthflankEndpointInputSchemas, NorthflankEndpointOutputSchemas };
export * from './types';
