import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Approve Calibration Session
// Finalize a calibration session that is In Progress or Approving.
export const approveCalibrationSession: SapsuccessfactorsEndpoints['approveCalibrationSession'] =
	async (ctx, input) => {
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['approveCalibrationSession']
		>('odata/v4/CalSession.svc/Approve', ctx.key, {
			method: 'POST',
			body: (input ?? {}) as Record<string, unknown>,
		});
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.approve.approveCalibrationSession',
			input ?? {},
			'completed',
		);
		return response;
	};
