import { makeEverhourRequest } from '../client';
import type { EverhourEndpoints } from '../index';
import type { EverhourTag } from '../schema/database';

export const listTags: EverhourEndpoints['listTags'] = async (ctx) => {
	return makeEverhourRequest<EverhourTag[]>('/tags', ctx.key);
};
