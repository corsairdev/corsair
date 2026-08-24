import { logEventFromContext } from 'corsair/core';
import { makeBetterstackRequest } from '../client';
import type { BetterstackEndpoints } from '../index';
import { auditPayload } from './logging';
import { withPagination } from './shared';
import type { BetterstackEndpointOutputs } from './types';

export const create: BetterstackEndpoints['metadataCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['metadataCreate']
	>('/api/v3/metadata', ctx.key, {
		method: 'POST',
		body: {
			owner_id: input.owner_id,
			owner_type: input.owner_type,
			key: input.key,
			values: input.values,
			mode: input.mode,
		},
		idempotent: false,
	});

	await logEventFromContext(
		ctx,
		'betterstack.metadata.create',
		auditPayload(input, ['owner_id', 'owner_type']),
		'completed',
	);
	return result;
};

export const list: BetterstackEndpoints['metadataList'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['metadataList']
	>('/api/v3/metadata', ctx.key, {
		method: 'GET',
		query: withPagination(input, {
			team_name: input.team_name,
			owner_id: input.owner_id,
			owner_type: input.owner_type,
		}),
	});

	await logEventFromContext(
		ctx,
		'betterstack.metadata.list',
		auditPayload(input, ['owner_id', 'owner_type']),
		'completed',
	);
	return result;
};
