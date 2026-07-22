import type { RequiredPluginEndpointMeta } from 'corsair/core';
import { DatabasesEndpoints } from './databases';
import { DomainRecordsEndpoints } from './domain-records';
import { DomainsEndpoints } from './domains';
import { DropletsEndpoints } from './droplets';
import { FirewallsEndpoints } from './firewalls';
import { ImagesEndpoints } from './images';
import { KubernetesEndpoints } from './kubernetes';
import { LoadBalancersEndpoints } from './load-balancers';
import { digitalOceanRoutes } from './routes';
import { SnapshotsEndpoints } from './snapshots';
import { SshKeysEndpoints } from './ssh-keys';
import { TagsEndpoints } from './tags';
import {
	DigitalOceanEndpointInputSchemas,
	DigitalOceanEndpointOutputSchemas,
} from './types';
import { VolumesEndpoints } from './volumes';
import { VpcsEndpoints } from './vpcs';

export const digitalOceanEndpointsNested = {
	databases: DatabasesEndpoints,
	domainRecords: DomainRecordsEndpoints,
	domains: DomainsEndpoints,
	droplets: DropletsEndpoints,
	firewalls: FirewallsEndpoints,
	images: ImagesEndpoints,
	kubernetes: KubernetesEndpoints,
	loadBalancers: LoadBalancersEndpoints,
	snapshots: SnapshotsEndpoints,
	sshKeys: SshKeysEndpoints,
	tags: TagsEndpoints,
	volumes: VolumesEndpoints,
	vpcs: VpcsEndpoints,
} as const;

// Route metadata is built dynamically from digitalOceanRoutes; cast satisfies RequiredPluginEndpointMeta shape.
export const digitalOceanEndpointMeta = Object.fromEntries(
	digitalOceanRoutes.map((route) => [
		`${route.group}.${route.name}`,
		{
			riskLevel: route.riskLevel,
			irreversible: 'irreversible' in route ? route.irreversible : undefined,
			description: route.description,
		},
	]),
) as RequiredPluginEndpointMeta<typeof digitalOceanEndpointsNested>;

export const digitalOceanEndpointSchemas = Object.fromEntries(
	digitalOceanRoutes.map((route) => [
		`${route.group}.${route.name}`,
		{
			input: DigitalOceanEndpointInputSchemas[route.key],
			output: DigitalOceanEndpointOutputSchemas[route.key],
		},
	]),
);

export { DigitalOceanEndpointInputSchemas, DigitalOceanEndpointOutputSchemas };
export * from './routes';
export * from './types';
