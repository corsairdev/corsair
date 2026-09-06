import { logEventFromContext } from 'corsair/core';
import { makeWriterRequest } from '../client';
import type {
	WriterEndpointInputs,
	WriterEndpointOutputs,
	WriterEndpoints,
} from './types';

export const listModels = async (
	ctx: any,
	_input?: any,
): Promise<WriterEndpointOutputs['listModels']> => {
	const response = await makeWriterRequest<WriterEndpointOutputs['listModels']>(
		'/models',
		ctx.key,
		'GET',
	);
	await logEventFromContext(ctx, 'writer.models.list', {}, 'completed');
	return response;
};

export const createCompletion = async (
	ctx: any,
	_input?: any,
): Promise<WriterEndpointOutputs['createCompletion']> => {
	const input = ctx.input as WriterEndpointInputs['createCompletion'];
	const response = await makeWriterRequest<
		WriterEndpointOutputs['createCompletion']
	>('/completions', ctx.key, 'POST', input);
	await logEventFromContext(
		ctx,
		'writer.completions.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const createChat = async (
	ctx: any,
	_input?: any,
): Promise<WriterEndpointOutputs['createChat']> => {
	const input = ctx.input as WriterEndpointInputs['createChat'];
	const response = await makeWriterRequest<WriterEndpointOutputs['createChat']>(
		'/chat',
		ctx.key,
		'POST',
		input,
	);
	await logEventFromContext(
		ctx,
		'writer.chat.create',
		{ ...input },
		'completed',
	);
	return response;
};
