import { logEventFromContext } from 'corsair/core';
import { makeComposioRequest } from '../client';
import type { ComposioContext, ComposioEndpoints } from '../index';
import type { MetaToolName } from './types';
import { ComposioEndpointOutputSchemas, META_TOOL_SLUGS } from './types';

// COMPOSIO_WAIT_FOR_CONNECTION blocks for up to 600 s and the remote sandbox
// tools run for minutes, so meta tools get more than the 20 s default.
const META_TOOL_TIMEOUT_MS = 660_000;

const { checkActiveConnection: DirectResult, searchTools: SessionResult } =
	ComposioEndpointOutputSchemas;

async function runDirect(
	ctx: ComposioContext,
	name: MetaToolName,
	input: { arguments: object; user_id?: string; version?: string },
) {
	const slug = META_TOOL_SLUGS[name];
	const response = await makeComposioRequest(
		`/tools/execute/${slug}`,
		ctx.key,
		DirectResult,
		{
			method: 'POST',
			body: {
				arguments: input.arguments,
				user_id: input.user_id,
				version: input.version,
			},
			timeoutMs: META_TOOL_TIMEOUT_MS,
		},
	);
	await logEventFromContext(
		ctx,
		`composio.meta.${name}`,
		{ slug },
		'completed',
	);
	return response;
}

async function runSession(
	ctx: ComposioContext,
	name: MetaToolName,
	input: { session_id: string; arguments: object },
) {
	const slug = META_TOOL_SLUGS[name];
	const response = await makeComposioRequest(
		`/tool_router/session/${encodeURIComponent(input.session_id)}/execute_meta`,
		ctx.key,
		SessionResult,
		{
			method: 'POST',
			body: { slug, arguments: input.arguments },
			timeoutMs: META_TOOL_TIMEOUT_MS,
		},
	);
	await logEventFromContext(
		ctx,
		`composio.meta.${name}`,
		{ slug },
		'completed',
	);
	return response;
}

export const checkActiveConnection: ComposioEndpoints['checkActiveConnection'] =
	(ctx, input) => runDirect(ctx, 'checkActiveConnection', input);
export const checkActiveConnections: ComposioEndpoints['checkActiveConnections'] =
	(ctx, input) => runDirect(ctx, 'checkActiveConnections', input);
export const createPlan: ComposioEndpoints['createPlan'] = (ctx, input) =>
	runDirect(ctx, 'createPlan', input);
export const enableTrigger: ComposioEndpoints['enableTrigger'] = (ctx, input) =>
	runDirect(ctx, 'enableTrigger', input);
export const executeTool: ComposioEndpoints['executeTool'] = (ctx, input) =>
	runDirect(ctx, 'executeTool', input);
export const getDependencyGraph: ComposioEndpoints['getDependencyGraph'] = (
	ctx,
	input,
) => runDirect(ctx, 'getDependencyGraph', input);
export const getRequiredParameters: ComposioEndpoints['getRequiredParameters'] =
	(ctx, input) => runDirect(ctx, 'getRequiredParameters', input);
export const getResponseSchema: ComposioEndpoints['getResponseSchema'] = (
	ctx,
	input,
) => runDirect(ctx, 'getResponseSchema', input);
export const initiateConnection: ComposioEndpoints['initiateConnection'] = (
	ctx,
	input,
) => runDirect(ctx, 'initiateConnection', input);
export const listToolkits: ComposioEndpoints['listToolkits'] = (ctx, input) =>
	runDirect(ctx, 'listToolkits', input);
export const listTriggers: ComposioEndpoints['listTriggers'] = (ctx, input) =>
	runDirect(ctx, 'listTriggers', input);
export const waitForConnection: ComposioEndpoints['waitForConnection'] = (
	ctx,
	input,
) => runDirect(ctx, 'waitForConnection', input);

export const getToolSchemas: ComposioEndpoints['getToolSchemas'] = (
	ctx,
	input,
) => runSession(ctx, 'getToolSchemas', input);
export const manageConnections: ComposioEndpoints['manageConnections'] = (
	ctx,
	input,
) => runSession(ctx, 'manageConnections', input);
export const multiExecuteTool: ComposioEndpoints['multiExecuteTool'] = (
	ctx,
	input,
) => runSession(ctx, 'multiExecuteTool', input);
export const remoteBashTool: ComposioEndpoints['remoteBashTool'] = (
	ctx,
	input,
) => runSession(ctx, 'remoteBashTool', input);
export const remoteWorkbench: ComposioEndpoints['remoteWorkbench'] = (
	ctx,
	input,
) => runSession(ctx, 'remoteWorkbench', input);
export const searchTools: ComposioEndpoints['searchTools'] = (ctx, input) =>
	runSession(ctx, 'searchTools', input);
export const waitForConnections: ComposioEndpoints['waitForConnections'] = (
	ctx,
	input,
) => runSession(ctx, 'waitForConnections', input);
