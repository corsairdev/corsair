import { makeAuthenticatedVercelRequest, seg } from '../client';
import { defineEndpoint } from './common';
import {
	VercelEdgeConfigInputSchemas as In,
	VercelEdgeConfigOutputSchemas as Out,
} from './edge-config-types';

// Vercel's REST API renamed Edge Config to Global Config: the routes live
// under /v1/global-config, the ids still start with ecfg_.

export const getEdgeConfigs = defineEndpoint({
	event: 'vercel.edgeConfig.getEdgeConfigs',
	input: In.getEdgeConfigs,
	output: Out.getEdgeConfigs,
	run: async (ctx, input) =>
		makeAuthenticatedVercelRequest('/v1/global-config', ctx, {
			teamId: input.teamId,
		}),
});

export const getEdgeConfig = defineEndpoint({
	event: 'vercel.edgeConfig.getEdgeConfig',
	input: In.getEdgeConfig,
	output: Out.getEdgeConfig,
	run: async (ctx, input) =>
		makeAuthenticatedVercelRequest(
			`/v1/global-config/${seg(input.edgeConfigId)}`,
			ctx,
			{ teamId: input.teamId },
		),
});

export const getEdgeConfigItems = defineEndpoint({
	event: 'vercel.edgeConfig.getEdgeConfigItems',
	input: In.getEdgeConfigItems,
	output: Out.getEdgeConfigItems,
	run: async (ctx, input) =>
		makeAuthenticatedVercelRequest(
			`/v1/global-config/${seg(input.edgeConfigId)}/items`,
			ctx,
			{ teamId: input.teamId },
		),
});

export const getEdgeConfigItem = defineEndpoint({
	event: 'vercel.edgeConfig.getEdgeConfigItem',
	input: In.getEdgeConfigItem,
	output: Out.getEdgeConfigItem,
	run: async (ctx, input) => {
		const item = await makeAuthenticatedVercelRequest(
			`/v1/global-config/${seg(input.edgeConfigId)}/item/${seg(input.key)}`,
			ctx,
			{ teamId: input.teamId },
		);
		// A missing key is a 204 with no body, not a 404.
		return item === undefined || item === null || item === ''
			? { found: false, item: null }
			: { found: true, item };
	},
});

export const updateEdgeConfigItems = defineEndpoint({
	event: 'vercel.edgeConfig.updateEdgeConfigItems',
	input: In.updateEdgeConfigItems,
	output: Out.updateEdgeConfigItems,
	run: async (ctx, input) =>
		makeAuthenticatedVercelRequest(
			`/v1/global-config/${seg(input.edgeConfigId)}/items`,
			ctx,
			{
				method: 'PATCH',
				teamId: input.teamId,
				body: { items: input.items },
			},
		),
	// Item values can be large or private config; the event keeps what changed.
	logInput: ({ items, ...rest }) => ({
		...rest,
		items: items.map(({ operation, key }) => ({ operation, key })),
	}),
});
