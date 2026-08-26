import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Get Calibration Session By ID
// Get a specific calibration session by session ID.
export const getCalibrationSessionById: SapsuccessfactorsEndpoints['getCalibrationSessionById'] =
	async (ctx, input) => {
		const { session_id, ...query } = (input ?? {}) as { session_id?: string };
		const resourcePath = session_id
			? `odata/v4/CalSession.svc/CalibrationSession('${session_id}')`
			: 'odata/v4/CalSession.svc/CalibrationSession';
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getCalibrationSessionById']
		>(resourcePath, ctx.key, {
			method: 'GET',
			query: query as Record<string, string | number | boolean | undefined>,
		});
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.calibration.getCalibrationSessionById',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get Calibration Sessions
// Query all calibration sessions the current user can access.
export const getCalibrationSessions: SapsuccessfactorsEndpoints['getCalibrationSessions'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getCalibrationSessions']
		>('odata/v4/CalSession.svc/CalibrationSession', ctx.key, {
			method: 'GET',
			query,
		});
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.calibration.getCalibrationSessions',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get Calibration Subject By ID
// Query a subject's competency ratings within a calibration session.
export const getCalibrationSubjectById: SapsuccessfactorsEndpoints['getCalibrationSubjectById'] =
	async (ctx, input) => {
		const { subject_id, ...query } = (input ?? {}) as { subject_id?: string };
		const resourcePath = subject_id
			? `odata/v4/CalSession.svc/CalibrationSubject('${subject_id}')`
			: 'odata/v4/CalSession.svc/CalibrationSubject';
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getCalibrationSubjectById']
		>(resourcePath, ctx.key, {
			method: 'GET',
			query: query as Record<string, string | number | boolean | undefined>,
		});
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.calibration.getCalibrationSubjectById',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get Calibration Subject Ratings
// Query a subject's ratings/competency ratings/comments by session ID.
export const getCalibrationSubjectRatings: SapsuccessfactorsEndpoints['getCalibrationSubjectRatings'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getCalibrationSubjectRatings']
		>('odata/v4/CalSession.svc/CalibrationSubject', ctx.key, {
			method: 'GET',
			query,
		});
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.calibration.getCalibrationSubjectRatings',
			input ?? {},
			'completed',
		);
		return response;
	};

// Update Calibration Subject Ratings
// Update a subject's competency ratings in a calibration session.
export const updateCalibrationSubjectRatings: SapsuccessfactorsEndpoints['updateCalibrationSubjectRatings'] =
	async (ctx, input) => {
		const { subject_id, body, ...rest } = (input ?? {}) as {
			subject_id?: string;
			body?: Record<string, unknown>;
		};
		const resourcePath = subject_id
			? `odata/v4/CalSession.svc/CalibrationSubject(${subject_id})`
			: 'odata/v4/CalSession.svc/CalibrationSubject';
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['updateCalibrationSubjectRatings']
		>(resourcePath, ctx.key, {
			method: 'PATCH',
			body: (body ?? rest) as Record<string, unknown>,
		});
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.calibration.updateCalibrationSubjectRatings',
			input ?? {},
			'completed',
		);
		return response;
	};
