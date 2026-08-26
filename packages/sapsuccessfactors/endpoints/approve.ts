import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Approve Calibration Session
// Finalize a calibration session that is In Progress or Approving.
export const approveCalibrationSession: SapsuccessfactorsEndpoints['approveCalibrationSession'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.approveCalibrationSession.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['approveCalibrationSession']
		>('odata/v4/CalSession.svc/Approve', ctx.key, {
			method: 'POST',
			body: (validatedInput ?? {}) as Record<string, unknown>,
			apiBaseUrl,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.approveCalibrationSession.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.approve.approveCalibrationSession',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
