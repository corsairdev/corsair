import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Get FOBusinessUnit
// Retrieve business unit records for org structure hierarchy.
export const getFoBusinessUnit: SapsuccessfactorsEndpoints['getFoBusinessUnit'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getFoBusinessUnit']
		>('odata/v2/FOBusinessUnit', ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.fo.getFoBusinessUnit',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get FOCompany Records
// Retrieve company records (display_name, legal_name, entityOID).
export const getFoCompany: SapsuccessfactorsEndpoints['getFoCompany'] = async (
	ctx,
	input,
) => {
	const query = input as Record<string, string | number | boolean | undefined>;
	const response = await makeSapsuccessfactorsRequest<
		SapsuccessfactorsEndpointOutputs['getFoCompany']
	>('odata/v2/FOCompany', ctx.key, { method: 'GET', query });
	await logEventFromContext(
		ctx,
		'sapsuccessfactors.fo.getFoCompany',
		input ?? {},
		'completed',
	);
	return response;
};

// Get Foundation Object Cost Centers
// Retrieve cost center records for org structure.
export const getFoCostCenter: SapsuccessfactorsEndpoints['getFoCostCenter'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getFoCostCenter']
		>('odata/v2/FOCostCenter', ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.fo.getFoCostCenter',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get FODepartment Records
// Retrieve department records (team/group org structure).
export const getFoDepartment: SapsuccessfactorsEndpoints['getFoDepartment'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getFoDepartment']
		>('odata/v2/FODepartment', ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.fo.getFoDepartment',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get Foundation Object Job Codes
// Retrieve job code records with associated position metadata.
export const getFoJobCode: SapsuccessfactorsEndpoints['getFoJobCode'] = async (
	ctx,
	input,
) => {
	const query = input as Record<string, string | number | boolean | undefined>;
	const response = await makeSapsuccessfactorsRequest<
		SapsuccessfactorsEndpointOutputs['getFoJobCode']
	>('odata/v2/FOJobCode', ctx.key, { method: 'GET', query });
	await logEventFromContext(
		ctx,
		'sapsuccessfactors.fo.getFoJobCode',
		input ?? {},
		'completed',
	);
	return response;
};

// Get Job Functions
// Retrieve job function records for categorizing job roles.
export const getFoJobFunction: SapsuccessfactorsEndpoints['getFoJobFunction'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getFoJobFunction']
		>('odata/v2/FOJobFunction', ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.fo.getFoJobFunction',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get Foundation Object Location
// Retrieve work location records (names, status, timezones, address).
export const getFoLocation: SapsuccessfactorsEndpoints['getFoLocation'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getFoLocation']
		>('odata/v2/FOLocation', ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.fo.getFoLocation',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get FOPayGroup
// Retrieve pay group records for compensation/payroll groupings.
export const getFoPayGroup: SapsuccessfactorsEndpoints['getFoPayGroup'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getFoPayGroup']
		>('odata/v2/FOPayGroup', ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.fo.getFoPayGroup',
			input ?? {},
			'completed',
		);
		return response;
	};
