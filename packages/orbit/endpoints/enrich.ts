import type { OrbitContext } from '../index';
import { readBilling } from '../schema/database';
import { callOrbit, omitUndefined } from './call';
import { rememberOperation } from './persist';
import type { OrbitEndpointInputs } from './types';
import {
	BatchEnrichInput,
	BatchEnrichSnapshot,
	EnrichProfileInput,
	EnrichSnapshot,
	GetEnrichInput,
	ProfileRead,
	ReadProfileInput,
} from './types';

async function rememberEnrich(
	ctx: OrbitContext,
	response: {
		request_id: string;
		profile_id?: string;
		status: 'running' | 'completed' | 'failed';
		// Snapshot billing is an open object until readBilling keeps the credit fields.
		billing?: unknown;
	},
) {
	await rememberOperation(ctx, 'enrichments', {
		requestId: response.request_id,
		profileId: response.profile_id,
		status: response.status,
		billing: readBilling(response.billing),
	});
}

export const Enrich = {
	read: (ctx: OrbitContext, input: OrbitEndpointInputs['readProfile']) =>
		callOrbit(
			ctx,
			'enrich.read',
			ReadProfileInput,
			ProfileRead,
			input,
			(validated) => ({
				method: 'GET',
				url: '/v3/enrich/{profile_id}',
				path: { profile_id: validated.profile_id },
				query: { format: validated.format },
				idempotencyKey: validated.idempotencyKey,
			}),
			(validated) => ({ profileId: validated.profile_id }),
		),
	start: async (
		ctx: OrbitContext,
		input: OrbitEndpointInputs['enrichProfile'],
	) => {
		const response = await callOrbit(
			ctx,
			'enrich.start',
			EnrichProfileInput,
			EnrichSnapshot,
			input,
			(validated) => ({
				method: 'POST',
				url: '/v3/enrich/{profile_id}',
				path: { profile_id: validated.profile_id },
				body: omitUndefined({
					operation: validated.operation,
					request_id: validated.request_id,
					include_profile: validated.include_profile,
				}),
				idempotencyKey: validated.idempotencyKey ?? validated.request_id,
			}),
			(validated, result) => ({
				profileId: validated.profile_id,
				requestId: result.request_id,
			}),
		);
		await rememberEnrich(ctx, response);
		return response;
	},
	get: async (
		ctx: OrbitContext,
		input: OrbitEndpointInputs['getEnrichment'],
	) => {
		const response = await callOrbit(
			ctx,
			'enrich.get',
			GetEnrichInput,
			EnrichSnapshot,
			input,
			(validated) => ({
				method: 'GET',
				url: '/v3/enrich/requests/{request_id}',
				path: { request_id: validated.request_id },
			}),
			(validated) => ({ requestId: validated.request_id }),
		);
		await rememberEnrich(ctx, response);
		return response;
	},
	batch: (ctx: OrbitContext, input: OrbitEndpointInputs['batchEnrich']) =>
		callOrbit(
			ctx,
			'enrich.batch',
			BatchEnrichInput,
			BatchEnrichSnapshot,
			input,
			(validated) => ({
				method: 'POST',
				url: '/v3/enrich',
				body: omitUndefined(validated),
				idempotencyKey: validated.request_id,
			}),
			(validated) => ({ count: String(validated.profile_ids.length) }),
		),
};
