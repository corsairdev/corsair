import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { CustomDomainsEndpoints } from './custom-domains';
import { DeployKeysEndpoints } from './deploy-keys';
import { DeploymentScopedEndpoints } from './deployment-scoped';
import { DeploymentsEndpoints } from './deployments';
import { PlatformEndpoints } from './platform';
import { ProjectsEndpoints } from './projects';
import {
	ConvexEndpointInputSchemas,
	ConvexEndpointOutputSchemas,
} from './types';

export const convexEndpointsNested = {
	projects: ProjectsEndpoints,
	deployments: DeploymentsEndpoints,
	deployKeys: DeployKeysEndpoints,
	customDomains: CustomDomainsEndpoints,
	platform: PlatformEndpoints,
	deployment: DeploymentScopedEndpoints,
} as const;

export const convexEndpointMeta = {
	'projects.list': {
		riskLevel: 'read',
		description: 'List projects in a Convex team',
	},
	'projects.getById': {
		riskLevel: 'read',
		description: 'Get a Convex project by its ID',
	},
	'projects.getBySlug': {
		riskLevel: 'read',
		description: 'Get a Convex project by team identifier and project slug',
	},
	'projects.create': {
		riskLevel: 'write',
		description:
			'Create a new Convex project, optionally provisioning a deployment',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a Convex project and all of its deployments',
	},
	'deployments.list': {
		riskLevel: 'read',
		description: 'List deployments for a Convex project',
	},
	'deployments.get': {
		riskLevel: 'read',
		description: 'Get details about a Convex cloud deployment',
	},
	'deployments.create': {
		riskLevel: 'write',
		description: 'Create a new deployment for a Convex project',
	},
	'deployments.update': {
		riskLevel: 'write',
		description: 'Update properties of an existing Convex deployment',
	},
	'deployments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a Convex deployment and all of its data and files',
	},
	'deployKeys.create': {
		riskLevel: 'write',
		description: 'Create a deploy key for a Convex deployment',
	},
	'deployKeys.list': {
		riskLevel: 'read',
		description: 'List deploy keys for a Convex deployment',
	},
	'customDomains.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a custom domain from a Convex deployment',
	},
	'platform.getTokenDetails': {
		riskLevel: 'read',
		description: 'Get details about the token used to authenticate',
	},
	'platform.listDeploymentClasses': {
		riskLevel: 'read',
		description: 'List the deployment classes available to a Convex team',
	},
	'platform.listDeploymentRegions': {
		riskLevel: 'read',
		description: 'List the deployment regions available to a Convex team',
	},
	'deployment.executeQueryBatch': {
		riskLevel: 'read',
		description: 'Execute a batch of Convex queries against a deployment',
	},
	'deployment.getQueryTimestamp': {
		riskLevel: 'read',
		description: 'Get the current query timestamp for a Convex deployment',
	},
	'deployment.listLogStreams': {
		riskLevel: 'read',
		description: 'List log streams configured for a Convex deployment',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof convexEndpointsNested>;

export const convexEndpointSchemas = {
	'projects.list': {
		input: ConvexEndpointInputSchemas.projectsList,
		output: ConvexEndpointOutputSchemas.projectsList,
	},
	'projects.getById': {
		input: ConvexEndpointInputSchemas.projectGetById,
		output: ConvexEndpointOutputSchemas.projectGetById,
	},
	'projects.getBySlug': {
		input: ConvexEndpointInputSchemas.projectGetBySlug,
		output: ConvexEndpointOutputSchemas.projectGetBySlug,
	},
	'projects.create': {
		input: ConvexEndpointInputSchemas.projectCreate,
		output: ConvexEndpointOutputSchemas.projectCreate,
	},
	'projects.delete': {
		input: ConvexEndpointInputSchemas.projectDelete,
		output: ConvexEndpointOutputSchemas.projectDelete,
	},
	'deployments.list': {
		input: ConvexEndpointInputSchemas.deploymentsList,
		output: ConvexEndpointOutputSchemas.deploymentsList,
	},
	'deployments.get': {
		input: ConvexEndpointInputSchemas.deploymentGet,
		output: ConvexEndpointOutputSchemas.deploymentGet,
	},
	'deployments.create': {
		input: ConvexEndpointInputSchemas.deploymentCreate,
		output: ConvexEndpointOutputSchemas.deploymentCreate,
	},
	'deployments.update': {
		input: ConvexEndpointInputSchemas.deploymentUpdate,
		output: ConvexEndpointOutputSchemas.deploymentUpdate,
	},
	'deployments.delete': {
		input: ConvexEndpointInputSchemas.deploymentDelete,
		output: ConvexEndpointOutputSchemas.deploymentDelete,
	},
	'deployKeys.create': {
		input: ConvexEndpointInputSchemas.deployKeyCreate,
		output: ConvexEndpointOutputSchemas.deployKeyCreate,
	},
	'deployKeys.list': {
		input: ConvexEndpointInputSchemas.deployKeysList,
		output: ConvexEndpointOutputSchemas.deployKeysList,
	},
	'customDomains.delete': {
		input: ConvexEndpointInputSchemas.customDomainDelete,
		output: ConvexEndpointOutputSchemas.customDomainDelete,
	},
	'platform.getTokenDetails': {
		input: ConvexEndpointInputSchemas.tokenDetails,
		output: ConvexEndpointOutputSchemas.tokenDetails,
	},
	'platform.listDeploymentClasses': {
		input: ConvexEndpointInputSchemas.deploymentClassesList,
		output: ConvexEndpointOutputSchemas.deploymentClassesList,
	},
	'platform.listDeploymentRegions': {
		input: ConvexEndpointInputSchemas.deploymentRegionsList,
		output: ConvexEndpointOutputSchemas.deploymentRegionsList,
	},
	'deployment.executeQueryBatch': {
		input: ConvexEndpointInputSchemas.executeQueryBatch,
		output: ConvexEndpointOutputSchemas.executeQueryBatch,
	},
	'deployment.getQueryTimestamp': {
		input: ConvexEndpointInputSchemas.queryTimestamp,
		output: ConvexEndpointOutputSchemas.queryTimestamp,
	},
	'deployment.listLogStreams': {
		input: ConvexEndpointInputSchemas.logStreamsList,
		output: ConvexEndpointOutputSchemas.logStreamsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof convexEndpointsNested
>;

export { ConvexEndpointInputSchemas, ConvexEndpointOutputSchemas };

export * from './types';
