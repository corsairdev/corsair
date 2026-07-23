import type { DigitalOceanEndpoint } from './factory';
import { executeDigitalOceanOperation, getRoute } from './factory';

const createNewBlockStorageVolumeRoute = getRoute(
	'createNewBlockStorageVolume',
);
export const createNewBlockStorageVolume: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(
		ctx,
		input,
		createNewBlockStorageVolumeRoute,
	);
};

const deleteBlockStorageVolumeRoute = getRoute('deleteBlockStorageVolume');
export const deleteBlockStorageVolume: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(
		ctx,
		input,
		deleteBlockStorageVolumeRoute,
	);
};

const listAllVolumesRoute = getRoute('listAllVolumes');
export const listAllVolumes: DigitalOceanEndpoint = async (ctx, input = {}) => {
	return executeDigitalOceanOperation(ctx, input, listAllVolumesRoute);
};

export const VolumesEndpoints = {
	createNewBlockStorageVolume,
	deleteBlockStorageVolume,
	listAllVolumes,
} as const;
