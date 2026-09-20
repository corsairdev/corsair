import { logEventFromContext } from 'corsair/core';
import type { CodyEndpoints } from '..';
import { makeCodyRequest } from '../client';
import { CodyEndpointInputSchemas, CodyEndpointOutputSchemas } from './types';

export const code: CodyEndpoints['completionsCode'] = async (ctx, input) => {
	const parsed = CodyEndpointInputSchemas.completionsCode.parse(input);
	const response = await makeCodyRequest('/.api/completions/code', ctx.key, {
		method: 'POST',
		authScheme: ctx.options.authType === 'oauth_2' ? 'Bearer' : 'token',
		query: {
			'api-version': parsed.apiVersion,
			'client-name': parsed.clientName,
			'client-version': parsed.clientVersion,
		},
		body: {
			messages: parsed.messages,
			model: parsed.model,
			maxTokensToSample: parsed.maxTokensToSample,
			temperature: parsed.temperature,
			stopSequences: parsed.stopSequences,
			timeoutMs: parsed.timeoutMs,
			stream: false,
		},
	});
	const validated = CodyEndpointOutputSchemas.completionsCode.parse(response);
	await logEventFromContext(
		ctx,
		'cody.completions.code',
		{ model: parsed.model },
		'completed',
	);
	return validated;
};

export const stream: CodyEndpoints['completionsStream'] = async (
	ctx,
	input,
) => {
	const parsed = CodyEndpointInputSchemas.completionsStream.parse(input);
	const response = await makeCodyRequest('/.api/completions/stream', ctx.key, {
		method: 'POST',
		authScheme: ctx.options.authType === 'oauth_2' ? 'Bearer' : 'token',
		query: {
			'api-version': parsed.apiVersion,
			'client-name': parsed.clientName,
			'client-version': parsed.clientVersion,
		},
		body: {
			messages: parsed.messages,
			model: parsed.model,
			maxTokensToSample: parsed.maxTokensToSample,
			temperature: parsed.temperature,
			stopSequences: parsed.stopSequences,
			timeoutMs: parsed.timeoutMs,
			stream: parsed.stream ?? true,
		},
	});
	const validated = CodyEndpointOutputSchemas.completionsStream.parse(response);
	await logEventFromContext(
		ctx,
		'cody.completions.stream',
		{ model: parsed.model },
		'completed',
	);
	return validated;
};

export const listModels: CodyEndpoints['listModels'] = async (ctx, input) => {
	CodyEndpointInputSchemas.listModels.parse(input ?? {});
	const response = await makeCodyRequest(
		'/.api/modelconfig/supported-models.json',
		ctx.key,
		{
			method: 'GET',
			authScheme: ctx.options.authType === 'oauth_2' ? 'Bearer' : 'token',
		},
	);
	const validated = CodyEndpointOutputSchemas.listModels.parse(response);
	await logEventFromContext(ctx, 'cody.models.list', {}, 'completed');
	return validated;
};

export const getClientConfig: CodyEndpoints['getClientConfig'] = async (
	ctx,
	input,
) => {
	CodyEndpointInputSchemas.getClientConfig.parse(input ?? {});
	const response = await makeCodyRequest('/.api/client-config', ctx.key, {
		method: 'GET',
		authScheme: ctx.options.authType === 'oauth_2' ? 'Bearer' : 'token',
	});
	const validated = CodyEndpointOutputSchemas.getClientConfig.parse(response);
	await logEventFromContext(ctx, 'cody.clientConfig.get', {}, 'completed');
	return validated;
};
