import { makeEverhourRequest } from '../client';
import type { EverhourEndpoints } from '../index';
import type { EverhourPlatform } from '../schema/database';

export const listPlatforms: EverhourEndpoints['listPlatforms'] = async (
	ctx,
) => {
	return makeEverhourRequest<EverhourPlatform[]>('/platforms', ctx.key);
};
