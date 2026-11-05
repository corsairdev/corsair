import type { AffindaEndpoint } from './factory';
import { executeAffindaOperation, getRoute } from './factory';

const listOccupationGroupsRoute = getRoute('listOccupationGroups');
export const listOccupationGroups: AffindaEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAffindaOperation(ctx, input, listOccupationGroupsRoute);
};

export const OccupationGroupsEndpoints = {
	listOccupationGroups,
} as const;
