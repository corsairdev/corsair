import { logEventFromContext } from 'corsair/core';
import type { FidelEndpoints } from '..';
import { makeFidelRequest } from '../client';
import { fidelPathParameter } from './path';
import type { FidelEndpointOutputs } from './types';

export const retrieveCard: FidelEndpoints['retrieveCard'] = async (
	ctx,
	input,
) => {
	const response = await makeFidelRequest<FidelEndpointOutputs['retrieveCard']>(
		ctx,
		fidelPathParameter('/v1/cards/{cardId}', 'cardId', input.cardId),
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'fidel.cards.retrieveCard',
		input,
		'completed',
	);
	return response;
};

export const listCards: FidelEndpoints['listCards'] = async (ctx, input) => {
	const { programId, ...rest } = input;
	const response = await makeFidelRequest<FidelEndpointOutputs['listCards']>(
		ctx,
		fidelPathParameter(
			'/v1/programs/{programId}/cards',
			'programId',
			input.programId,
		),
		{ method: 'GET', query: rest },
	);
	await logEventFromContext(ctx, 'fidel.cards.listCards', input, 'completed');
	return response;
};

export const listCardsFromMetadataId: FidelEndpoints['listCardsFromMetadataId'] =
	async (ctx, input) => {
		const { metadataId, ...rest } = input;
		const response = await makeFidelRequest<
			FidelEndpointOutputs['listCardsFromMetadataId']
		>(
			ctx,
			fidelPathParameter(
				'/v1/cards/metadata/{metadataId}',
				'metadataId',
				input.metadataId,
			),
			{ method: 'GET', query: rest },
		);
		await logEventFromContext(
			ctx,
			'fidel.cards.listCardsFromMetadataId',
			input,
			'completed',
		);
		return response;
	};

export const deleteCard: FidelEndpoints['deleteCard'] = async (ctx, input) => {
	const response = await makeFidelRequest<FidelEndpointOutputs['deleteCard']>(
		ctx,
		fidelPathParameter('/v1/cards/{cardId}', 'cardId', input.cardId),
		{ method: 'DELETE' },
	);
	await logEventFromContext(ctx, 'fidel.cards.deleteCard', input, 'completed');
	return response;
};

export const updateCardMetadata: FidelEndpoints['updateCardMetadata'] = async (
	ctx,
	input,
) => {
	// The provider takes the metadata object itself as the PUT body.
	const response = await makeFidelRequest<
		FidelEndpointOutputs['updateCardMetadata']
	>(
		ctx,
		fidelPathParameter('/v1/cards/{cardId}/metadata', 'cardId', input.cardId),
		{ method: 'PUT', body: input.metadata },
	);
	await logEventFromContext(
		ctx,
		'fidel.cards.updateCardMetadata',
		input,
		'completed',
	);
	return response;
};
