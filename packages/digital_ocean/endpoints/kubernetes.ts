import { digitalOceanRoutes } from './routes';
import type { DigitalOceanEndpoint } from './factory';
import { logDigitalOceanOperation, requestDigitalOceanOperation } from './factory';

function getRoute(name: string) {
	const route = digitalOceanRoutes.find((candidate) => candidate.name === name);
	if (!route) {
		throw new Error(`[digital_ocean] missing route: ${name}`);
	}
	return route;
}

const createNewKubernetesClusterRoute = getRoute('createNewKubernetesCluster');
export const createNewKubernetesCluster: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, createNewKubernetesClusterRoute);
	await logDigitalOceanOperation(ctx, input, createNewKubernetesClusterRoute);
	return result;
};

const listAllKubernetesClustersRoute = getRoute('listAllKubernetesClusters');
export const listAllKubernetesClusters: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, listAllKubernetesClustersRoute);
	await logDigitalOceanOperation(ctx, input, listAllKubernetesClustersRoute);
	return result;
};

export const KubernetesEndpoints = {
	createNewKubernetesCluster,
	listAllKubernetesClusters
} as const;
