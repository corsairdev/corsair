import { logEventFromContext } from 'corsair/core';
import type { OllamaEndpoints } from '..';
import { makeOllamaRequest } from '../client';
import type {
	ListModelsResponse,
	ShowModelResponse,
	VersionResponse,
} from './types';
import {
	ListModelsInputSchema,
	ListModelsResponseSchema,
	ShowModelInputSchema,
	ShowModelResponseSchema,
	VersionInputSchema,
	VersionResponseSchema,
} from './types';

export const version: OllamaEndpoints['version'] = async (ctx, input) => {
	const validatedInput = VersionInputSchema.parse(input);

	const rawResponse = await makeOllamaRequest<VersionResponse>(
		'/api/version',
		ctx,
		{ method: 'GET' },
	);

	const response = VersionResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'ollama.models.version',
		validatedInput,
		'completed',
	);
	return response;
};

export const listModels: OllamaEndpoints['listModels'] = async (ctx, input) => {
	const validatedInput = ListModelsInputSchema.parse(input);

	const rawResponse = await makeOllamaRequest<ListModelsResponse>(
		'/api/tags',
		ctx,
		{ method: 'GET' },
	);

	const response = ListModelsResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'ollama.models.list_models',
		validatedInput,
		'completed',
	);
	return response;
};

export const showModel: OllamaEndpoints['showModel'] = async (ctx, input) => {
	const validatedInput = ShowModelInputSchema.parse(input);

	const rawResponse = await makeOllamaRequest<ShowModelResponse>(
		'/api/show',
		ctx,
		{
			method: 'POST',
			body: validatedInput,
		},
	);

	const response = ShowModelResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'ollama.models.show_model',
		validatedInput,
		'completed',
	);
	return response;
};
