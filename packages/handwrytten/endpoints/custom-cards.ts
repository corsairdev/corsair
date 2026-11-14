import { logEventFromContext } from 'corsair/core';
import type { HandwryttenEndpoints } from '..';
import { makeHandwryttenRequest } from '../client';
import type {
	CustomCardsCheckImageResponse,
	CustomCardsCreateResponse,
	CustomCardsDeleteImageResponse,
	CustomCardsDeleteResponse,
	CustomCardsDimensionsResponse,
	CustomCardsListImagesResponse,
	CustomCardsPresetImagesResponse,
	CustomCardsUploadImageResponse,
} from './types';
import {
	HandwryttenEndpointInputSchemas,
	HandwryttenEndpointOutputSchemas,
} from './types';

export const dimensions: HandwryttenEndpoints['customCards.dimensions'] =
	async (ctx, input) => {
		const parsedInput =
			HandwryttenEndpointInputSchemas['customCards.dimensions'].parse(input);
		const response =
			await makeHandwryttenRequest<CustomCardsDimensionsResponse>(
				'/design/dimensions',
				ctx.key,
				{
					method: 'GET',
					query: parsedInput,
					baseUrl: ctx.options?.baseUrl,
				},
			);
		const parsed =
			HandwryttenEndpointOutputSchemas['customCards.dimensions'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'handwrytten.customCards.dimensions',
			{ count: parsed.dimensions?.length ?? 0 },
			'completed',
		);
		return parsed;
	};

export const presetImages: HandwryttenEndpoints['customCards.presetImages'] =
	async (ctx, input) => {
		const parsedInput =
			HandwryttenEndpointInputSchemas['customCards.presetImages'].parse(input);
		const response =
			await makeHandwryttenRequest<CustomCardsPresetImagesResponse>(
				'/design/presetImages',
				ctx.key,
				{
					method: 'GET',
					query: parsedInput,
					baseUrl: ctx.options?.baseUrl,
				},
			);
		const parsed =
			HandwryttenEndpointOutputSchemas['customCards.presetImages'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'handwrytten.customCards.presetImages',
			{ count: parsed.images?.length ?? 0 },
			'completed',
		);
		return parsed;
	};

export const listImages: HandwryttenEndpoints['customCards.listImages'] =
	async (ctx, input) => {
		const parsedInput =
			HandwryttenEndpointInputSchemas['customCards.listImages'].parse(input);
		const response =
			await makeHandwryttenRequest<CustomCardsListImagesResponse>(
				'/cards/listCustomUserImages',
				ctx.key,
				{
					method: 'GET',
					query: parsedInput,
					baseUrl: ctx.options?.baseUrl,
				},
			);
		const parsed =
			HandwryttenEndpointOutputSchemas['customCards.listImages'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'handwrytten.customCards.listImages',
			{ count: parsed.images?.length ?? 0 },
			'completed',
		);
		return parsed;
	};

export const uploadImage: HandwryttenEndpoints['customCards.uploadImage'] =
	async (ctx, input) => {
		const parsedInput =
			HandwryttenEndpointInputSchemas['customCards.uploadImage'].parse(input);
		const response =
			await makeHandwryttenRequest<CustomCardsUploadImageResponse>(
				'/cards/uploadCustomLogo',
				ctx.key,
				{
					method: 'POST',
					body: parsedInput,
					baseUrl: ctx.options?.baseUrl,
				},
			);
		const parsed =
			HandwryttenEndpointOutputSchemas['customCards.uploadImage'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'handwrytten.customCards.uploadImage',
			{ imageId: parsed.image_id },
			'completed',
		);
		return parsed;
	};

export const checkImage: HandwryttenEndpoints['customCards.checkImage'] =
	async (ctx, input) => {
		const parsedInput =
			HandwryttenEndpointInputSchemas['customCards.checkImage'].parse(input);
		const response =
			await makeHandwryttenRequest<CustomCardsCheckImageResponse>(
				'/cards/checkUploadedCustomLogo',
				ctx.key,
				{
					method: 'POST',
					body: parsedInput,
					baseUrl: ctx.options?.baseUrl,
				},
			);
		const parsed =
			HandwryttenEndpointOutputSchemas['customCards.checkImage'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'handwrytten.customCards.checkImage',
			{ imageId: parsedInput.image_id },
			'completed',
		);
		return parsed;
	};

export const deleteImage: HandwryttenEndpoints['customCards.deleteImage'] =
	async (ctx, input) => {
		const parsedInput =
			HandwryttenEndpointInputSchemas['customCards.deleteImage'].parse(input);
		const response =
			await makeHandwryttenRequest<CustomCardsDeleteImageResponse>(
				'/cards/deleteCustomLogo',
				ctx.key,
				{
					method: 'POST',
					body: parsedInput,
					baseUrl: ctx.options?.baseUrl,
				},
			);
		const parsed =
			HandwryttenEndpointOutputSchemas['customCards.deleteImage'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'handwrytten.customCards.deleteImage',
			{ imageId: parsedInput.image_id },
			'completed',
		);
		return parsed;
	};

export const create: HandwryttenEndpoints['customCards.create'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HandwryttenEndpointInputSchemas['customCards.create'].parse(input);
	const response = await makeHandwryttenRequest<CustomCardsCreateResponse>(
		'/cards/createCustomCard',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['customCards.create'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.customCards.create',
		{ cardId: parsed.card_id ?? parsed.id },
		'completed',
	);
	return parsed;
};

export const deleteCustomCard: HandwryttenEndpoints['customCards.delete'] =
	async (ctx, input) => {
		const parsedInput =
			HandwryttenEndpointInputSchemas['customCards.delete'].parse(input);
		const response = await makeHandwryttenRequest<CustomCardsDeleteResponse>(
			'/design/delete',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
				baseUrl: ctx.options?.baseUrl,
			},
		);
		const parsed =
			HandwryttenEndpointOutputSchemas['customCards.delete'].parse(response);
		await logEventFromContext(
			ctx,
			'handwrytten.customCards.delete',
			{ cardId: parsedInput.id },
			'completed',
		);
		return parsed;
	};
