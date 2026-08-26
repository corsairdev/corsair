import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Delete Nomination
// Remove a nominee from a position or talent pool nomination.
export const deleteNominationPositionTalentPool: SapsuccessfactorsEndpoints['deleteNominationPositionTalentPool'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.deleteNominationPositionTalentPool.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const { nomination_id } = (validatedInput ?? {}) as {
			nomination_id?: string;
		};
		const resourcePath = nomination_id
			? `odata/v4/NominationService.svc/Nomination(${nomination_id})`
			: 'odata/v4/NominationService.svc/Nomination';
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['deleteNominationPositionTalentPool']
		>(resourcePath, ctx.key, { method: 'DELETE', apiBaseUrl });
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.deleteNominationPositionTalentPool.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.nomination.deleteNominationPositionTalentPool',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
