import { DatabasesEndpoints } from './databases';
import { DomainRecordsEndpoints } from './domainRecords';
import { DomainsEndpoints } from './domains';
import { DropletsEndpoints } from './droplets';
import { FirewallsEndpoints } from './firewalls';
import { ImagesEndpoints } from './images';
import { KubernetesEndpoints } from './kubernetes';
import { LoadBalancersEndpoints } from './loadBalancers';
import { SnapshotsEndpoints } from './snapshots';
import { SshKeysEndpoints } from './sshKeys';
import { TagsEndpoints } from './tags';
import { VolumesEndpoints } from './volumes';
import { VpcsEndpoints } from './vpcs';
import type { RequiredPluginEndpointMeta } from 'corsair/core';
import { digitalOceanRoutes } from './routes';
import { DigitalOceanEndpointInputSchemas, DigitalOceanEndpointOutputSchemas } from './types';

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
	vpcs: VpcsEndpoints
} as const;

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
