import { logEventFromContext } from 'corsair/core';
import { makeDeepwikiMcpRequest } from '../client';
import type { DeepwikiMcpEndpoints } from '../index';
import type { DeepwikiMcpEndpointOutputs } from './types';

async function callTool<T>(
	toolName: string,
	arguments_: Record<string, unknown>,
	apiKey: string,
): Promise<T> {
	return makeDeepwikiMcpRequest<T>('mcp', apiKey, {
		method: 'POST',
		body: {
			jsonrpc: '2.0',
			id: crypto.randomUUID(),
			method: 'tools/call',
			params: { name: toolName, arguments: arguments_ },
		},
	});
}

export const askQuestion: DeepwikiMcpEndpoints['askQuestion'] = async (
	ctx,
	input,
) => {
	const response = await callTool<DeepwikiMcpEndpointOutputs['askQuestion']>(
		'ask_question',
		input,
		ctx.key,
	);
	await logEventFromContext(
		ctx,
		'deepwikimcp.ask_question',
		{ ...input },
		'completed',
	);
	return response;
};

export const readWikiContents: DeepwikiMcpEndpoints['readWikiContents'] =
	async (ctx, input) => {
		const response = await callTool<
			DeepwikiMcpEndpointOutputs['readWikiContents']
		>('read_wiki_contents', input, ctx.key);
		await logEventFromContext(
			ctx,
			'deepwikimcp.read_wiki_contents',
			{ ...input },
			'completed',
		);
		return response;
	};

export const readWikiStructure: DeepwikiMcpEndpoints['readWikiStructure'] =
	async (ctx, input) => {
		const response = await callTool<
			DeepwikiMcpEndpointOutputs['readWikiStructure']
		>('read_wiki_structure', input, ctx.key);
		await logEventFromContext(
			ctx,
			'deepwikimcp.read_wiki_structure',
			{ ...input },
			'completed',
		);
		return response;
	};
