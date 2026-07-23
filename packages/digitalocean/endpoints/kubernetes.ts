import type { DigitalOceanEndpoint } from './factory';
import { executeDigitalOceanOperation, getRoute } from './factory';

const createNewKubernetesClusterRoute = getRoute('createNewKubernetesCluster');
export const createNewKubernetesCluster: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(
		ctx,
		input,
		createNewKubernetesClusterRoute,
	);
};

const listAllKubernetesClustersRoute = getRoute('listAllKubernetesClusters');
export const listAllKubernetesClusters: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(
		ctx,
		input,
		listAllKubernetesClustersRoute,
	);
};

export const KubernetesEndpoints = {
	createNewKubernetesCluster,
	listAllKubernetesClusters,
} as const;
