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

const listAllSnapshotsRoute = getRoute('listAllSnapshots');
export const listAllSnapshots: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, listAllSnapshotsRoute);
	await logDigitalOceanOperation(ctx, input, listAllSnapshotsRoute);
	return result;
};

export const SnapshotsEndpoints = {
	listAllSnapshots
} as const;
