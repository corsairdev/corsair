import { logEventFromContext } from 'corsair/core';
import { makeComposioRequest } from '../client';
import type { ComposioContext, ComposioEndpoints } from '../index';
import type { Tool } from './types';
import {
	ComposioEndpointInputSchemas,
	ComposioEndpointOutputSchemas,
} from './types';

async function saveTool(ctx: ComposioContext, tool: Tool) {
	if (!ctx.db.tools) return;
	try {
		await ctx.db.tools.upsertByEntityId(tool.slug, { ...tool, id: tool.slug });
	} catch (error) {
		console.warn(`[composio] failed to save tool ${tool.slug}:`, error);
	}
}

export const list: ComposioEndpoints['toolsList'] = async (ctx, raw) => {
	const input = ComposioEndpointInputSchemas.toolsList.parse(raw);
	const response = await makeComposioRequest(
		'/tools',
		ctx.key,
		ComposioEndpointOutputSchemas.toolsList,
		{ query: input },
	);
	for (const tool of response.items) {
		await saveTool(ctx, tool);
	}
	await logEventFromContext(ctx, 'composio.tools.list', input, 'completed');
	return response;
};

export const get: ComposioEndpoints['toolGet'] = async (ctx, raw) => {
	const input = ComposioEndpointInputSchemas.toolGet.parse(raw);
	const response = await makeComposioRequest(
		`/tools/${encodeURIComponent(input.tool_slug)}`,
		ctx.key,
		ComposioEndpointOutputSchemas.toolGet,
		{ query: { version: input.version } },
	);
	await saveTool(ctx, response);
	await logEventFromContext(
		ctx,
		'composio.tools.get',
		{ tool_slug: input.tool_slug },
		'completed',
	);
	return response;
};

export const execute: ComposioEndpoints['toolExecute'] = async (ctx, raw) => {
	const input = ComposioEndpointInputSchemas.toolExecute.parse(raw);
	const { tool_slug, ...body } = input;
	const response = await makeComposioRequest(
		`/tools/execute/${encodeURIComponent(tool_slug)}`,
		ctx.key,
		ComposioEndpointOutputSchemas.toolExecute,
		{ method: 'POST', body },
	);
	await logEventFromContext(
		ctx,
		'composio.tools.execute',
		{ tool_slug, successful: response.successful },
		'completed',
	);
	return response;
};
