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

const createNewBlockStorageVolumeRoute = getRoute('createNewBlockStorageVolume');
export const createNewBlockStorageVolume: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, createNewBlockStorageVolumeRoute);
	await logDigitalOceanOperation(ctx, input, createNewBlockStorageVolumeRoute);
	return result;
};

const deleteBlockStorageVolumeRoute = getRoute('deleteBlockStorageVolume');
export const deleteBlockStorageVolume: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, deleteBlockStorageVolumeRoute);
	await logDigitalOceanOperation(ctx, input, deleteBlockStorageVolumeRoute);
	return result;
};

const listAllVolumesRoute = getRoute('listAllVolumes');
export const listAllVolumes: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, listAllVolumesRoute);
	await logDigitalOceanOperation(ctx, input, listAllVolumesRoute);
	return result;
};

export const VolumesEndpoints = {
	createNewBlockStorageVolume,
	deleteBlockStorageVolume,
	listAllVolumes
} as const;
