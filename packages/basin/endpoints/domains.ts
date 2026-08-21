import { logEventFromContext } from 'corsair/core';
import type { BasinEndpoints } from '..';
import { makeBasinRequest } from '../client';
import { safeDbUpsert, toDomainRecord } from '../utils';
import type { BasinEndpointOutputs } from './types';

export const list: BasinEndpoints['domainsList'] = async (ctx, input = {}) => {
	const query: Record<string, string | number | undefined> = {};
	if (input?.page !== undefined) query.page = input.page;
	if (input?.query !== undefined) query.query = input.query;

	const result = await makeBasinRequest<BasinEndpointOutputs['domainsList']>(
		'domains',
		ctx.key,
		{ method: 'GET', query },
	);

	const domainsList = Array.isArray(result)
		? result
		: (result as { domains?: unknown[] }).domains;

	if (Array.isArray(domainsList)) {
		for (const dom of domainsList) {
			if (dom && typeof dom === 'object' && ('id' in dom || 'domain' in dom)) {
				const id =
					(dom as { id?: string | number; domain?: string }).id ??
					(dom as { domain?: string }).domain ??
					'unknown';
				await safeDbUpsert(
					ctx.db.domains,
					id,
					toDomainRecord(dom as Parameters<typeof toDomainRecord>[0]),
					'domain',
				);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'basin.domains.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const Domains = {
	list,
};
