import { logEventFromContext } from 'corsair/core';
import { makeWizaRequest } from '../client';
import type { WizaEndpoints } from '../index';
import type { GetListResponse } from './types';

export const get: WizaEndpoints['listsGet'] = async (ctx, input) => {
	const response = await makeWizaRequest<GetListResponse>(
		`/api/lists/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await ctx.db.lists.upsertByEntityId(String(response.data.id), {
		id: response.data.id,
		name: response.data.name,
		status: response.data.status,
		enrichment_level: response.data.enrichment_level,
		report_type: response.data.report_type,
		created_at: response.data.created_at,
		finished_at: response.data.finished_at,
		updatedAt: new Date(),
	});

	await logEventFromContext(
		ctx,
		'wiza.lists.get',
		{ id: response.data.id, status: response.data.status },
		'completed',
	);

	return response;
};

export const Lists = { get };
