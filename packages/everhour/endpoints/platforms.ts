import { makeEverhourRequest } from '../client';
import type { EverhourPlatform } from '../schema/database';

export const listPlatforms = async (ctx: any) => {
	return makeEverhourRequest<EverhourPlatform[]>('/platforms', ctx.key);
};
