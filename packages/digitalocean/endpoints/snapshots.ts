import type { DigitalOceanEndpoint } from './factory';
import { executeDigitalOceanOperation, getRoute } from './factory';

const listAllSnapshotsRoute = getRoute('listAllSnapshots');
export const listAllSnapshots: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(ctx, input, listAllSnapshotsRoute);
};

export const SnapshotsEndpoints = {
	listAllSnapshots,
} as const;
