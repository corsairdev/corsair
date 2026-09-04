import { logEventFromContext } from 'corsair/core';
import type { TinyurlEndpoints } from '..';
import { makeTinyurlRequest } from '../client';
import type { TinyurlApiResponseEnvelope } from './types';
import {
	CreateUrlInputSchema,
	CreateUrlResponseSchema,
	TinyurlApiResponseEnvelopeSchema,
} from './types';

export const create: TinyurlEndpoints['createUrl'] = async (ctx, rawInput) => {
	const input = CreateUrlInputSchema.parse(rawInput);

	const body: Record<string, unknown> = {
		url: input.url,
	};
	if (input.domain !== undefined) body.domain = input.domain;
	if (input.alias !== undefined) body.alias = input.alias;
	if (input.tags !== undefined) {
		body.tags = Array.isArray(input.tags) ? input.tags.join(',') : input.tags;
	}
	if (input.expires_at !== undefined) body.expires_at = input.expires_at;
	if (input.description !== undefined) body.description = input.description;

	const rawResponse = await makeTinyurlRequest<TinyurlApiResponseEnvelope>(
		'/create',
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	const parsedEnvelope =
		TinyurlApiResponseEnvelopeSchema.safeParse(rawResponse);
	const data = parsedEnvelope.success ? parsedEnvelope.data.data : rawResponse;

	const response = CreateUrlResponseSchema.parse(data);

	await logEventFromContext(
		ctx,
		'tinyurl.urls.create',
		{ alias: response.alias, tiny_url: response.tiny_url },
		'completed',
	);

	return response;
};
