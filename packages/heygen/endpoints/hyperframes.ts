import { logEventFromContext } from 'corsair/core';
import { makeHeygenRequest } from '../client';
import type { HeygenEndpoints } from '../index';
import type { HeygenEndpointOutputs } from './types';

// Migrated to HeyGen v3 API per developers.heygen.com. v3-only, no v1/v2 equivalent.

export const list: HeygenEndpoints['hyperframesList'] = async (ctx, input) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['hyperframesList']
	>('/v3/hyperframes/renders', ctx.key, {
		method: 'GET',
		query: { limit: input.limit, token: input.token },
	});

	await logEventFromContext(ctx, 'heygen.hyperframes.list', {}, 'completed');
	return result;
};

export const create: HeygenEndpoints['hyperframesCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['hyperframesCreate']
	>('/v3/hyperframes/renders', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(ctx, 'heygen.hyperframes.create', {}, 'completed');
	return result;
};

export const get: HeygenEndpoints['hyperframesGet'] = async (ctx, input) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['hyperframesGet']
	>(`/v3/hyperframes/renders/${input.render_id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'heygen.hyperframes.get',
		{ renderId: input.render_id },
		'completed',
	);
	return result;
};

export const deleteHyperframe: HeygenEndpoints['hyperframesDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['hyperframesDelete']
	>(`/v3/hyperframes/renders/${input.render_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'heygen.hyperframes.delete',
		{ renderId: input.render_id },
		'completed',
	);
	return result;
};
