import { makeGiftUpRequest } from '../client';
import type { GiftUpContext } from '../index';
import type {
	PingGetInput,
	PingGetResponse,
	PingPostInput,
	PingPostResponse,
} from './types';
import {
	PingGetInputSchema,
	PingGetResponseSchema,
	PingPostInputSchema,
	PingPostResponseSchema,
} from './types';

export const Ping = {
	get: async (
		ctx: GiftUpContext,
		input: PingGetInput,
	): Promise<PingGetResponse> => {
		PingGetInputSchema.parse(input);
		const response = await makeGiftUpRequest<string>('/ping', ctx.key, {
			method: 'GET',
			testMode: ctx.options?.testMode,
		});
		return PingGetResponseSchema.parse(response);
	},
	post: async (
		ctx: GiftUpContext,
		input: PingPostInput,
	): Promise<PingPostResponse> => {
		const parsed = PingPostInputSchema.parse(input);
		// `unknown` because POST /ping echoes whatever arbitrary payload was posted
		const response = await makeGiftUpRequest<unknown>('/ping', ctx.key, {
			method: 'POST',
			body: parsed.payload,
			testMode: ctx.options?.testMode,
		});
		return PingPostResponseSchema.parse(response);
	},
};
