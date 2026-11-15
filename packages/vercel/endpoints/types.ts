import type { z } from 'zod';
import {
	VercelAliasesInputSchemas,
	VercelAliasesOutputSchemas,
} from './aliases-types';
import {
	VercelDeploymentsInputSchemas,
	VercelDeploymentsOutputSchemas,
} from './deployments-types';
import { VercelDnsInputSchemas, VercelDnsOutputSchemas } from './dns-types';
import {
	VercelDomainsInputSchemas,
	VercelDomainsOutputSchemas,
} from './domains-types';
import {
	VercelEdgeConfigInputSchemas,
	VercelEdgeConfigOutputSchemas,
} from './edge-config-types';
import { VercelEnvsInputSchemas, VercelEnvsOutputSchemas } from './envs-types';
import {
	VercelProjectsInputSchemas,
	VercelProjectsOutputSchemas,
} from './projects-types';
import {
	VercelTeamsInputSchemas,
	VercelTeamsOutputSchemas,
} from './teams-types';
import { VercelUserInputSchemas, VercelUserOutputSchemas } from './user-types';
import {
	VercelWebhooksInputSchemas,
	VercelWebhooksOutputSchemas,
} from './webhooks-types';

type Prefixed<G extends string, T> = {
	[K in keyof T & string as `${G}.${K}`]: T[K];
};

/** Re-keys one group's schemas by their operation path (`group.name`). */
function prefixed<G extends string, T extends Record<string, unknown>>(
	group: G,
	schemas: T,
): Prefixed<G, T> {
	return Object.fromEntries(
		Object.entries(schemas).map(([name, schema]) => [
			`${group}.${name}`,
			schema,
		]),
	) as Prefixed<G, T>;
}

/** Every operation's input schema, keyed by operation path. */
export const VercelEndpointInputSchemas = {
	...prefixed('projects', VercelProjectsInputSchemas),
	...prefixed('deployments', VercelDeploymentsInputSchemas),
	...prefixed('envs', VercelEnvsInputSchemas),
	...prefixed('domains', VercelDomainsInputSchemas),
	...prefixed('dns', VercelDnsInputSchemas),
	...prefixed('aliases', VercelAliasesInputSchemas),
	...prefixed('teams', VercelTeamsInputSchemas),
	...prefixed('user', VercelUserInputSchemas),
	...prefixed('webhooks', VercelWebhooksInputSchemas),
	...prefixed('edgeConfig', VercelEdgeConfigInputSchemas),
};

/** Every operation's output schema, keyed by operation path. */
export const VercelEndpointOutputSchemas = {
	...prefixed('projects', VercelProjectsOutputSchemas),
	...prefixed('deployments', VercelDeploymentsOutputSchemas),
	...prefixed('envs', VercelEnvsOutputSchemas),
	...prefixed('domains', VercelDomainsOutputSchemas),
	...prefixed('dns', VercelDnsOutputSchemas),
	...prefixed('aliases', VercelAliasesOutputSchemas),
	...prefixed('teams', VercelTeamsOutputSchemas),
	...prefixed('user', VercelUserOutputSchemas),
	...prefixed('webhooks', VercelWebhooksOutputSchemas),
	...prefixed('edgeConfig', VercelEdgeConfigOutputSchemas),
};

export type VercelEndpointInputs = {
	[K in keyof typeof VercelEndpointInputSchemas]: z.input<
		(typeof VercelEndpointInputSchemas)[K]
	>;
};
export type VercelEndpointOutputs = {
	[K in keyof typeof VercelEndpointOutputSchemas]: z.infer<
		(typeof VercelEndpointOutputSchemas)[K]
	>;
};
