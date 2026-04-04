import { logEventFromContext } from 'corsair/core';
import type { ExaEndpoints } from '..';
import { makeExaRequest } from '../client';
import type { ExaEndpointOutputs } from './types';

export const createMonitor: ExaEndpoints['monitorsCreate'] = async (
	ctx,
	input,
) => {
	const { websetId, ...body } = input;
	const result = await makeExaRequest<ExaEndpointOutputs['monitorsCreate']>(
		`websets/v0/websets/${websetId}/monitors`,
		ctx.key,
		{
			method: 'POST',
			body: body as Record<string, unknown>,
		},
	);

	if (ctx.db.monitors) {
		try {
			await ctx.db.monitors.upsertByEntityId(result.id, {
				...result,
				createdAt: new Date(result.createdAt),
				updatedAt: result.updatedAt ? new Date(result.updatedAt) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save monitor to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'exa.monitors.create',
		{ websetId, cadenceType: input.cadence.type },
		'completed',
	);
	return result;
};
