import { makeEverhourRequest } from '../client';
import type { EverhourTag } from '../schema/database';

export const listTags = async (ctx: any) => {
	return makeEverhourRequest<EverhourTag[]>('/tags', ctx.key);
};
