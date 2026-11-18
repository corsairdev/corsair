import { logEventFromContext } from 'corsair/core';
import type { FidelEndpoints } from '..';
import { makeFidelRequest } from '../client';
import { fidelPathParameter } from './path';
import type { FidelEndpointOutputs } from './types';

export const createOffer: FidelEndpoints['createOffer'] = async (
	ctx,
	input,
) => {
	const response = await makeFidelRequest<FidelEndpointOutputs['createOffer']>(
		ctx,
		'/v1/offers',
		{ method: 'POST', body: input },
	);
	await logEventFromContext(
		ctx,
		'fidel.offers.createOffer',
		input,
		'completed',
	);
	return response;
};

export const updateOffer: FidelEndpoints['updateOffer'] = async (
	ctx,
	input,
) => {
	const { offerId, ...rest } = input;
	const response = await makeFidelRequest<FidelEndpointOutputs['updateOffer']>(
		ctx,
		fidelPathParameter('/v1/offers/{offerId}', 'offerId', input.offerId),
		{ method: 'PATCH', body: rest },
	);
	await logEventFromContext(
		ctx,
		'fidel.offers.updateOffer',
		input,
		'completed',
	);
	return response;
};

export const retrieveOffer: FidelEndpoints['retrieveOffer'] = async (
	ctx,
	input,
) => {
	const response = await makeFidelRequest<
		FidelEndpointOutputs['retrieveOffer']
	>(ctx, fidelPathParameter('/v1/offers/{offerId}', 'offerId', input.offerId), {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'fidel.offers.retrieveOffer',
		input,
		'completed',
	);
	return response;
};

export const listOffers: FidelEndpoints['listOffers'] = async (ctx, input) => {
	const response = await makeFidelRequest<FidelEndpointOutputs['listOffers']>(
		ctx,
		'/v1/offers',
		{ method: 'GET', query: input },
	);
	await logEventFromContext(ctx, 'fidel.offers.listOffers', input, 'completed');
	return response;
};

export const deleteOffer: FidelEndpoints['deleteOffer'] = async (
	ctx,
	input,
) => {
	const response = await makeFidelRequest<FidelEndpointOutputs['deleteOffer']>(
		ctx,
		fidelPathParameter('/v1/offers/{offerId}', 'offerId', input.offerId),
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'fidel.offers.deleteOffer',
		input,
		'completed',
	);
	return response;
};

export const linkLocationToOffer: FidelEndpoints['linkLocationToOffer'] =
	async (ctx, input) => {
		const { offerId, locationId, ...rest } = input;
		const response = await makeFidelRequest<
			FidelEndpointOutputs['linkLocationToOffer']
		>(
			ctx,
			fidelPathParameter(
				fidelPathParameter(
					'/v1/offers/{offerId}/locations/{locationId}',
					'offerId',
					input.offerId,
				),
				'locationId',
				input.locationId,
			),
			{ method: 'POST', body: rest },
		);
		await logEventFromContext(
			ctx,
			'fidel.offers.linkLocationToOffer',
			input,
			'completed',
		);
		return response;
	};

export const linkAllBrandLocationsToOffer: FidelEndpoints['linkAllBrandLocationsToOffer'] =
	async (ctx, input) => {
		const { offerId, programId, ...rest } = input;
		const response = await makeFidelRequest<
			FidelEndpointOutputs['linkAllBrandLocationsToOffer']
		>(
			ctx,
			fidelPathParameter(
				fidelPathParameter(
					'/v1/offers/{offerId}/programs/{programId}/locations',
					'offerId',
					input.offerId,
				),
				'programId',
				input.programId,
			),
			{ method: 'POST', body: rest },
		);
		await logEventFromContext(
			ctx,
			'fidel.offers.linkAllBrandLocationsToOffer',
			input,
			'completed',
		);
		return response;
	};

export const unlinkLocationToOffer: FidelEndpoints['unlinkLocationToOffer'] =
	async (ctx, input) => {
		const response = await makeFidelRequest<
			FidelEndpointOutputs['unlinkLocationToOffer']
		>(
			ctx,
			fidelPathParameter(
				fidelPathParameter(
					'/v1/offers/{offerId}/locations/{locationId}',
					'offerId',
					input.offerId,
				),
				'locationId',
				input.locationId,
			),
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'fidel.offers.unlinkLocationToOffer',
			input,
			'completed',
		);
		return response;
	};

export const sendOfferToBrand: FidelEndpoints['sendOfferToBrand'] = async (
	ctx,
	input,
) => {
	const { offerId, ...rest } = input;
	const response = await makeFidelRequest<
		FidelEndpointOutputs['sendOfferToBrand']
	>(
		ctx,
		fidelPathParameter('/v1/offers/{offerId}/notify', 'offerId', input.offerId),
		{ method: 'POST', body: rest },
	);
	await logEventFromContext(
		ctx,
		'fidel.offers.sendOfferToBrand',
		input,
		'completed',
	);
	return response;
};

export const activateOfferOnCard: FidelEndpoints['activateOfferOnCard'] =
	async (ctx, input) => {
		const { offerId, cardId, ...rest } = input;
		const response = await makeFidelRequest<
			FidelEndpointOutputs['activateOfferOnCard']
		>(
			ctx,
			fidelPathParameter(
				fidelPathParameter(
					'/v1/offers/{offerId}/cards/{cardId}',
					'offerId',
					input.offerId,
				),
				'cardId',
				input.cardId,
			),
			{ method: 'POST', body: rest },
		);
		await logEventFromContext(
			ctx,
			'fidel.offers.activateOfferOnCard',
			input,
			'completed',
		);
		return response;
	};

export const unlinkCardFromOffer: FidelEndpoints['unlinkCardFromOffer'] =
	async (ctx, input) => {
		const response = await makeFidelRequest<
			FidelEndpointOutputs['unlinkCardFromOffer']
		>(
			ctx,
			fidelPathParameter(
				fidelPathParameter(
					'/v1/offers/{offerId}/cards/{cardId}',
					'offerId',
					input.offerId,
				),
				'cardId',
				input.cardId,
			),
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'fidel.offers.unlinkCardFromOffer',
			input,
			'completed',
		);
		return response;
	};

export const retrieveActiveOfferOnCard: FidelEndpoints['retrieveActiveOfferOnCard'] =
	async (ctx, input) => {
		const response = await makeFidelRequest<
			FidelEndpointOutputs['retrieveActiveOfferOnCard']
		>(
			ctx,
			fidelPathParameter(
				fidelPathParameter(
					'/v1/offers/{offerId}/cards/{cardId}',
					'offerId',
					input.offerId,
				),
				'cardId',
				input.cardId,
			),
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'fidel.offers.retrieveActiveOfferOnCard',
			input,
			'completed',
		);
		return response;
	};

export const listCardsWithActiveOffer: FidelEndpoints['listCardsWithActiveOffer'] =
	async (ctx, input) => {
		const { offerId, ...rest } = input;
		const response = await makeFidelRequest<
			FidelEndpointOutputs['listCardsWithActiveOffer']
		>(
			ctx,
			fidelPathParameter(
				'/v1/offers/{offerId}/cards',
				'offerId',
				input.offerId,
			),
			{ method: 'GET', query: rest },
		);
		await logEventFromContext(
			ctx,
			'fidel.offers.listCardsWithActiveOffer',
			input,
			'completed',
		);
		return response;
	};
