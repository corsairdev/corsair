import { logEventFromContext } from 'corsair/core';
import type { FidelEndpoints } from '..';
import { makeFidelRequest } from '../client';
import { fidelPathParameter } from './path';
import type { FidelEndpointOutputs } from './types';

export const createLocation: FidelEndpoints['createLocation'] = async (
	ctx,
	input,
) => {
	const { programId, ...rest } = input;
	const response = await makeFidelRequest<
		FidelEndpointOutputs['createLocation']
	>(
		ctx,
		fidelPathParameter(
			'/v1/programs/{programId}/locations',
			'programId',
			input.programId,
		),
		{ method: 'POST', body: rest },
	);
	await logEventFromContext(
		ctx,
		'fidel.locations.createLocation',
		input,
		'completed',
	);
	return response;
};

export const retrieveLocation: FidelEndpoints['retrieveLocation'] = async (
	ctx,
	input,
) => {
	const response = await makeFidelRequest<
		FidelEndpointOutputs['retrieveLocation']
	>(
		ctx,
		fidelPathParameter(
			'/v1/locations/{locationId}',
			'locationId',
			input.locationId,
		),
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'fidel.locations.retrieveLocation',
		input,
		'completed',
	);
	return response;
};

export const updateLocation: FidelEndpoints['updateLocation'] = async (
	ctx,
	input,
) => {
	const { locationId, ...rest } = input;
	const response = await makeFidelRequest<
		FidelEndpointOutputs['updateLocation']
	>(
		ctx,
		fidelPathParameter(
			'/v1/locations/{locationId}',
			'locationId',
			input.locationId,
		),
		{ method: 'PATCH', body: rest },
	);
	await logEventFromContext(
		ctx,
		'fidel.locations.updateLocation',
		input,
		'completed',
	);
	return response;
};

export const listLocations: FidelEndpoints['listLocations'] = async (
	ctx,
	input,
) => {
	const { programId, ...rest } = input;
	const response = await makeFidelRequest<
		FidelEndpointOutputs['listLocations']
	>(
		ctx,
		fidelPathParameter(
			'/v1/programs/{programId}/locations',
			'programId',
			input.programId,
		),
		{ method: 'GET', query: rest },
	);
	await logEventFromContext(
		ctx,
		'fidel.locations.listLocations',
		input,
		'completed',
	);
	return response;
};

export const listLocationsByBrand: FidelEndpoints['listLocationsByBrand'] =
	async (ctx, input) => {
		const { brandId, programId, ...rest } = input;
		const response = await makeFidelRequest<
			FidelEndpointOutputs['listLocationsByBrand']
		>(
			ctx,
			fidelPathParameter(
				fidelPathParameter(
					'/v1/brands/{brandId}/programs/{programId}/locations',
					'brandId',
					input.brandId,
				),
				'programId',
				input.programId,
			),
			{ method: 'GET', query: rest },
		);
		await logEventFromContext(
			ctx,
			'fidel.locations.listLocationsByBrand',
			input,
			'completed',
		);
		return response;
	};

export const listLocationsByOffer: FidelEndpoints['listLocationsByOffer'] =
	async (ctx, input) => {
		const { offerId, ...rest } = input;
		const response = await makeFidelRequest<
			FidelEndpointOutputs['listLocationsByOffer']
		>(
			ctx,
			fidelPathParameter(
				'/v1/offers/{offerId}/locations',
				'offerId',
				input.offerId,
			),
			{ method: 'GET', query: rest },
		);
		await logEventFromContext(
			ctx,
			'fidel.locations.listLocationsByOffer',
			input,
			'completed',
		);
		return response;
	};

export const deleteLocation: FidelEndpoints['deleteLocation'] = async (
	ctx,
	input,
) => {
	const response = await makeFidelRequest<
		FidelEndpointOutputs['deleteLocation']
	>(
		ctx,
		fidelPathParameter(
			'/v1/locations/{locationId}',
			'locationId',
			input.locationId,
		),
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'fidel.locations.deleteLocation',
		input,
		'completed',
	);
	return response;
};
