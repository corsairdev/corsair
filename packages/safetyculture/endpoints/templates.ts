import { logEventFromContext } from 'corsair/core';
import type { SafetyCultureEndpoints } from '..';
import { makeSafetyCultureRequest } from '../client';
import { TemplatesListResponseSchema } from './types';

export const list: SafetyCultureEndpoints['templatesList'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};

	if (input.modified_after) query.modified_after = input.modified_after;
	if (input.modified_before) query.modified_before = input.modified_before;
	if (input.archived) query.archived = input.archived;
	if (input.owner) query.owner = input.owner;
	if (input.limit) query.limit = input.limit;

	const raw = await makeSafetyCultureRequest<unknown>(
		'templates/search',
		ctx.key,
		{ method: 'GET', query },
	);
	const response = TemplatesListResponseSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'safetyculture.templates.list',
		{ resultCount: response.templates?.length ?? 0 },
		'completed',
	);

	return response;
};
