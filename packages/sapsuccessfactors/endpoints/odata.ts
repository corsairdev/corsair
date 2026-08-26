import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Get Calibration Session Metadata
// Get OData metadata / available entity sets for CalSession.svc.
export const getOdataMetadataCalibSessionService: SapsuccessfactorsEndpoints['getOdataMetadataCalibSessionService'] =
	async (ctx, input) => {
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getOdataMetadataCalibSessionService']
		>('odata/v4/CalSession.svc/$metadata', ctx.key, { method: 'GET' });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.odata.getOdataMetadataCalibSessionService',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get Onboarding Additional Services Metadata
// Get metadata for Onboarding Additional Services (incl. username update ops).
export const getOdataMetadataOnboardingAddl: SapsuccessfactorsEndpoints['getOdataMetadataOnboardingAddl'] =
	async (ctx, input) => {
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getOdataMetadataOnboardingAddl']
		>('odata/v2/$metadata', ctx.key, { method: 'GET' });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.odata.getOdataMetadataOnboardingAddl',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get Nomination Service Metadata
// Get OData metadata for the Nomination service.
export const getOdataMetadataForNominationService: SapsuccessfactorsEndpoints['getOdataMetadataForNominationService'] =
	async (ctx, input) => {
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getOdataMetadataForNominationService']
		>('odata/v4/NominationService.svc/$metadata', ctx.key, { method: 'GET' });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.odata.getOdataMetadataForNominationService',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get User Entity Metadata
// Retrieve OData metadata for the User entity.
export const getOdataUserMetadata: SapsuccessfactorsEndpoints['getOdataUserMetadata'] =
	async (ctx, input) => {
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getOdataUserMetadata']
		>('odata/v2/$metadata', ctx.key, { method: 'GET' });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.odata.getOdataUserMetadata',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get Clock In/Out Integration Metadata
// Get OData metadata for the Clock In/Clock Out Integration service.
export const getOdataMetadataClockInclockOut: SapsuccessfactorsEndpoints['getOdataMetadataClockInclockOut'] =
	async (ctx, input) => {
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getOdataMetadataClockInclockOut']
		>('odata/v2/$metadata', ctx.key, { method: 'GET' });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.odata.getOdataMetadataClockInclockOut',
			input ?? {},
			'completed',
		);
		return response;
	};
