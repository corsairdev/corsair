import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Delete Nomination
// Remove a nominee from a position or talent pool nomination.
export const deleteNominationPositionTalentPool: SapsuccessfactorsEndpoints['deleteNominationPositionTalentPool'] =
	async (ctx, input) => {
		const { nomination_id } = (input ?? {}) as { nomination_id?: string };
		const resourcePath = nomination_id
			? `odata/v4/NominationService.svc/Nomination(${nomination_id})`
			: 'odata/v4/NominationService.svc/Nomination';
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['deleteNominationPositionTalentPool']
		>(resourcePath, ctx.key, { method: 'DELETE' });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.nomination.deleteNominationPositionTalentPool',
			input ?? {},
			'completed',
		);
		return response;
	};
