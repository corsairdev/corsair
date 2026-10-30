import type { RequiredPluginEndpointMeta } from 'corsair/core';
import { AddonTypesEndpoints } from './addons';
import { CloudProvidersEndpoints } from './cloud';
import { MiscEndpoints } from './misc';
import { PipelinesEndpoints } from './pipelines';
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
	secrets: SecretsEndpoints,
	pipelines: PipelinesEndpoints,
	plans: PlansEndpoints,
	regions: RegionsEndpoints,
	addonTypes: AddonTypesEndpoints,
	cloudProviders: CloudProvidersEndpoints,
	misc: MiscEndpoints,
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
	'projects.createOrUpdate': {
		riskLevel: 'write',
		description: 'Create or update a Northflank project (upsert)',
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Update an existing Northflank project',
	},
	'projects.delete': {
		riskLevel: 'write',
		description: 'Delete a Northflank project',
	},
	'services.list': {
		riskLevel: 'read',
		description: 'List services in a Northflank project',
	},
	'secrets.list': {
		riskLevel: 'read',
		description: 'List secret groups in a Northflank project',
	},
	'secrets.get': {
		riskLevel: 'read',
		description: 'Get details of a Northflank secret group',
	},
	'secrets.create': {
		riskLevel: 'write',
		description: 'Create a new secret group in a Northflank project',
	},
	'secrets.createOrUpdate': {
		riskLevel: 'write',
		description: 'Create or update a secret group in a Northflank project',
	},
	'secrets.patch': {
		riskLevel: 'write',
		description: 'Partially update a secret group in a Northflank project',
	},
	'secrets.update': {
		riskLevel: 'write',
		description: 'Update a secret group in a Northflank project',
	},
	'secrets.getDetails': {
		riskLevel: 'read',
		description: 'Get a secret group with linked addon details',
	},
	'pipelines.list': {
		riskLevel: 'read',
		description: 'List pipelines in a Northflank project',
	},
	'plans.list': {
		riskLevel: 'read',
		description: 'List available Northflank resource plans',
	},
	'regions.list': {
		riskLevel: 'read',
		description: 'List available Northflank regions',
	},
	'addonTypes.list': {
		riskLevel: 'read',
		description: 'List available Northflank addon types',
	},
	'cloudProviders.listNodeTypes': {
		riskLevel: 'read',
		description: 'List supported cloud provider node types',
	},
	'cloudProviders.listRegions': {
		riskLevel: 'read',
		description: 'List supported cloud provider regions',
	},
	'misc.getDnsId': {
		riskLevel: 'read',
		description: 'Get the DNS identifier for the authenticated account',
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
	'projects.createOrUpdate': {
		input: NorthflankEndpointInputSchemas['projects.createOrUpdate'],
		output: NorthflankEndpointOutputSchemas['projects.createOrUpdate'],
	},
	'projects.update': {
		input: NorthflankEndpointInputSchemas['projects.update'],
		output: NorthflankEndpointOutputSchemas['projects.update'],
	},
	'projects.delete': {
		input: NorthflankEndpointInputSchemas['projects.delete'],
		output: NorthflankEndpointOutputSchemas['projects.delete'],
	},
	'services.list': {
		input: NorthflankEndpointInputSchemas['services.list'],
		output: NorthflankEndpointOutputSchemas['services.list'],
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
	'secrets.createOrUpdate': {
		input: NorthflankEndpointInputSchemas['secrets.createOrUpdate'],
		output: NorthflankEndpointOutputSchemas['secrets.createOrUpdate'],
	},
	'secrets.patch': {
		input: NorthflankEndpointInputSchemas['secrets.patch'],
		output: NorthflankEndpointOutputSchemas['secrets.patch'],
	},
	'secrets.update': {
		input: NorthflankEndpointInputSchemas['secrets.update'],
		output: NorthflankEndpointOutputSchemas['secrets.update'],
	},
	'secrets.getDetails': {
		input: NorthflankEndpointInputSchemas['secrets.getDetails'],
		output: NorthflankEndpointOutputSchemas['secrets.getDetails'],
	},
	'pipelines.list': {
		input: NorthflankEndpointInputSchemas['pipelines.list'],
		output: NorthflankEndpointOutputSchemas['pipelines.list'],
	},
	'plans.list': {
		input: NorthflankEndpointInputSchemas['plans.list'],
		output: NorthflankEndpointOutputSchemas['plans.list'],
	},
	'regions.list': {
		input: NorthflankEndpointInputSchemas['regions.list'],
		output: NorthflankEndpointOutputSchemas['regions.list'],
	},
	'addonTypes.list': {
		input: NorthflankEndpointInputSchemas['addonTypes.list'],
		output: NorthflankEndpointOutputSchemas['addonTypes.list'],
	},
	'cloudProviders.listNodeTypes': {
		input: NorthflankEndpointInputSchemas['cloudProviders.listNodeTypes'],
		output: NorthflankEndpointOutputSchemas['cloudProviders.listNodeTypes'],
	},
	'cloudProviders.listRegions': {
		input: NorthflankEndpointInputSchemas['cloudProviders.listRegions'],
		output: NorthflankEndpointOutputSchemas['cloudProviders.listRegions'],
	},
	'misc.getDnsId': {
		input: NorthflankEndpointInputSchemas['misc.getDnsId'],
		output: NorthflankEndpointOutputSchemas['misc.getDnsId'],
	},
};

export { NorthflankEndpointInputSchemas, NorthflankEndpointOutputSchemas };
export * from './types';
