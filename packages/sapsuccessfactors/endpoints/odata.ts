import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Get Calibration Session Metadata
// Get OData metadata / available entity sets for CalSession.svc.
export const getOdataMetadataCalibSessionService: SapsuccessfactorsEndpoints['getOdataMetadataCalibSessionService'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getOdataMetadataCalibSessionService.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getOdataMetadataCalibSessionService']
		>('odata/v4/CalSession.svc/$metadata', ctx.key, {
			method: 'GET',
			apiBaseUrl,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getOdataMetadataCalibSessionService.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.odata.getOdataMetadataCalibSessionService',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};

// Get Onboarding Additional Services Metadata
// Get metadata for Onboarding Additional Services (incl. username update ops).
export const getOdataMetadataOnboardingAddl: SapsuccessfactorsEndpoints['getOdataMetadataOnboardingAddl'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getOdataMetadataOnboardingAddl.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getOdataMetadataOnboardingAddl']
		>('odata/v2/$metadata', ctx.key, { method: 'GET', apiBaseUrl });
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getOdataMetadataOnboardingAddl.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.odata.getOdataMetadataOnboardingAddl',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};

// Get Nomination Service Metadata
// Get OData metadata for the Nomination service.
export const getOdataMetadataForNominationService: SapsuccessfactorsEndpoints['getOdataMetadataForNominationService'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getOdataMetadataForNominationService.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getOdataMetadataForNominationService']
		>('odata/v4/NominationService.svc/$metadata', ctx.key, {
			method: 'GET',
			apiBaseUrl,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getOdataMetadataForNominationService.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.odata.getOdataMetadataForNominationService',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};

// Get User Entity Metadata
// Retrieve OData metadata for the User entity.
export const getOdataUserMetadata: SapsuccessfactorsEndpoints['getOdataUserMetadata'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getOdataUserMetadata.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getOdataUserMetadata']
		>('odata/v2/$metadata', ctx.key, { method: 'GET', apiBaseUrl });
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getOdataUserMetadata.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.odata.getOdataUserMetadata',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};

// Get Clock In/Out Integration Metadata
// Get OData metadata for the Clock In/Clock Out Integration service.
export const getOdataMetadataClockInclockOut: SapsuccessfactorsEndpoints['getOdataMetadataClockInclockOut'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getOdataMetadataClockInclockOut.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getOdataMetadataClockInclockOut']
		>('odata/v2/$metadata', ctx.key, { method: 'GET', apiBaseUrl });
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getOdataMetadataClockInclockOut.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.odata.getOdataMetadataClockInclockOut',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
