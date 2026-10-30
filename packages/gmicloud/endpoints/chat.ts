import { logEventFromContext } from 'corsair/core';
import type { GmicloudEndpoints } from '..';
import { makeGmicloudRequest } from '../client';
import {
	GmicloudEndpointInputSchemas,
	GmicloudEndpointOutputSchemas,
} from './types';

export const createCompletion: GmicloudEndpoints['chatCreateCompletion'] =
	async (ctx, input) => {
		const body = GmicloudEndpointInputSchemas.chatCreateCompletion.parse(input);
		// Endpoints return one JSON result, so streaming is always off.
		const result = GmicloudEndpointOutputSchemas.chatCreateCompletion.parse(
			await makeGmicloudRequest(ctx, {
				api: 'inference',
				method: 'POST',
				url: 'v1/chat/completions',
				body: { ...body, stream: false },
			}),
		);
		await logEventFromContext(
			ctx,
			'gmicloud.chat.createCompletion',
			{ model: result.model, totalTokens: result.usage?.total_tokens },
			'completed',
		);
		return result;
	};
