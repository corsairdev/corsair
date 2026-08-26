import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Get Calibration Session By ID
// Get a specific calibration session by session ID.
export const getCalibrationSessionById: SapsuccessfactorsEndpoints['getCalibrationSessionById'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getCalibrationSessionById.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const { session_id, ...query } = (validatedInput ?? {}) as {
			session_id?: string;
		};
		const resourcePath = session_id
			? `odata/v4/CalSession.svc/CalibrationSession('${session_id}')`
			: 'odata/v4/CalSession.svc/CalibrationSession';
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getCalibrationSessionById']
		>(resourcePath, ctx.key, {
			method: 'GET',
			query: query as Record<string, string | number | boolean | undefined>,
			apiBaseUrl,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getCalibrationSessionById.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.calibration.getCalibrationSessionById',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};

// Get Calibration Sessions
// Query all calibration sessions the current user can access.
export const getCalibrationSessions: SapsuccessfactorsEndpoints['getCalibrationSessions'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getCalibrationSessions.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const query = validatedInput as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getCalibrationSessions']
		>('odata/v4/CalSession.svc/CalibrationSession', ctx.key, {
			method: 'GET',
			query,
			apiBaseUrl,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getCalibrationSessions.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.calibration.getCalibrationSessions',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};

// Get Calibration Subject By ID
// Query a subject's competency ratings within a calibration session.
export const getCalibrationSubjectById: SapsuccessfactorsEndpoints['getCalibrationSubjectById'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getCalibrationSubjectById.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const { subject_id, ...query } = (validatedInput ?? {}) as {
			subject_id?: string;
		};
		const resourcePath = subject_id
			? `odata/v4/CalSession.svc/CalibrationSubject('${subject_id}')`
			: 'odata/v4/CalSession.svc/CalibrationSubject';
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getCalibrationSubjectById']
		>(resourcePath, ctx.key, {
			method: 'GET',
			query: query as Record<string, string | number | boolean | undefined>,
			apiBaseUrl,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getCalibrationSubjectById.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.calibration.getCalibrationSubjectById',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};

// Get Calibration Subject Ratings
// Query a subject's ratings/competency ratings/comments by session ID.
export const getCalibrationSubjectRatings: SapsuccessfactorsEndpoints['getCalibrationSubjectRatings'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getCalibrationSubjectRatings.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const query = validatedInput as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getCalibrationSubjectRatings']
		>('odata/v4/CalSession.svc/CalibrationSubject', ctx.key, {
			method: 'GET',
			query,
			apiBaseUrl,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getCalibrationSubjectRatings.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.calibration.getCalibrationSubjectRatings',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};

// Update Calibration Subject Ratings
// Update a subject's competency ratings in a calibration session.
export const updateCalibrationSubjectRatings: SapsuccessfactorsEndpoints['updateCalibrationSubjectRatings'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.updateCalibrationSubjectRatings.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const { subject_id, body, ...rest } = (validatedInput ?? {}) as {
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
			apiBaseUrl,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.updateCalibrationSubjectRatings.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.calibration.updateCalibrationSubjectRatings',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
