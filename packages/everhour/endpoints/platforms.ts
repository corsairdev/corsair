import { makeEverhourRequest } from '../client';
import type { EverhourPlatform } from '../schema/database';

export const listPlatforms = async (apiKey: string) => {
	return makeEverhourRequest<EverhourPlatform[]>('/platforms', apiKey);
};
