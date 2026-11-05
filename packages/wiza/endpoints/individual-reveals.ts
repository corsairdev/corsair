import { logEventFromContext } from 'corsair/core';
import { makeWizaRequest } from '../client';
import type { WizaEndpoints } from '../index';
import type {
	GetIndividualRevealResponse,
	StartIndividualRevealResponse,
} from './types';

export const start: WizaEndpoints['individualRevealsStart'] = async (
	ctx,
	input,
) => {
	const response = await makeWizaRequest<StartIndividualRevealResponse>(
		'/api/individual_reveals',
		ctx.key,
		{ method: 'POST', body: input },
	);

	await ctx.db.reveals.upsertByEntityId(String(response.data.id), {
		id: response.data.id,
		status: response.data.status,
		is_complete: response.data.is_complete,
		enrichment_level: input.enrichment_level,
		updatedAt: new Date(),
	});

	await logEventFromContext(
		ctx,
		'wiza.individualReveals.start',
		{ id: response.data.id, status: response.data.status },
		'completed',
	);

	return response;
};

export const get: WizaEndpoints['individualRevealsGet'] = async (
	ctx,
	input,
) => {
	const response = await makeWizaRequest<GetIndividualRevealResponse>(
		`/api/individual_reveals/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await ctx.db.reveals.upsertByEntityId(String(response.data.id), {
		...response.data,
		updatedAt: new Date(),
	});

	await logEventFromContext(
		ctx,
		'wiza.individualReveals.get',
		{ id: response.data.id, status: response.data.status },
		'completed',
	);

	return response;
};

export const IndividualReveals = { start, get };
