import { logEventFromContext } from 'corsair/core';
import { makeBorneoRequest } from '../client';
import type { BorneoEndpoints, BorneoKeyBuilderContext } from '../index';
import {
	BorneoEndpointInputSchemas,
	BorneoEndpointOutputSchemas,
} from './types';

async function resolveBorneoBaseUrl(
	ctx: Pick<BorneoKeyBuilderContext, 'options'> & {
		keys?: BorneoKeyBuilderContext['keys'];
	},
): Promise<string> {
	const fromOptions = ctx.options?.baseUrl?.trim();
	if (fromOptions) return fromOptions;

	const fromAccount = await ctx.keys?.get_base_url?.();
	if (fromAccount?.trim()) return fromAccount.trim();

	throw new Error(
		'[borneo] baseUrl is required — set plugin options.baseUrl or account base_url',
	);
}

export const postSupportChatQuery: BorneoEndpoints['postSupportChatQuery'] =
	async (ctx, rawInput) => {
		const input = BorneoEndpointInputSchemas.postSupportChatQuery.parse(
			rawInput ?? {},
		);
		const baseUrl = await resolveBorneoBaseUrl(ctx);

		const response = await makeBorneoRequest<unknown>(
			'/support/chat',
			ctx.key,
			{
				method: 'POST',
				body: input,
				baseUrl,
			},
		);

		const parsed =
			BorneoEndpointOutputSchemas.postSupportChatQuery.parse(response);

		await logEventFromContext(
			ctx,
			'borneo.support.postSupportChatQuery',
			{ method: 'POST', path: '/support/chat' },
			'completed',
		);

		return parsed;
	};
