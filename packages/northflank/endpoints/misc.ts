import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeNorthflankRequest } from '../client';
import type { NorthflankContext } from '../index';
import type { MiscGetDnsIdInput, MiscGetDnsIdOutput } from './types';
import { MiscGetDnsIdInputSchema, MiscGetDnsIdOutputSchema } from './types';

export type NorthflankEndpoint<TInput, TOutput> = CorsairEndpoint<
	NorthflankContext,
	TInput,
	TOutput
>;

// GET /v1/dns-id — DNS identifier for the authenticated account, used for
// generating DNS entries for services and domains.
// Docs: /docs/v1/api/team/miscellaneous/get-dns-id
export const getDnsId: NorthflankEndpoint<
	MiscGetDnsIdInput,
	MiscGetDnsIdOutput
> = async (ctx, input = {}) => {
	MiscGetDnsIdInputSchema.parse(input);
	const res = await makeNorthflankRequest<MiscGetDnsIdOutput>(
		'dns-id',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'northflank.misc.getDnsId', {}, 'completed');
	return MiscGetDnsIdOutputSchema.parse(res);
};

export const MiscEndpoints = {
	getDnsId,
} as const;
