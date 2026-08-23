import { logEventFromContext } from 'corsair/core';
import { callDeepwikiMcpTool } from '../client';
import type { DeepwikiMcpEndpoints } from '../index';
import { DeepwikiMcpEndpointOutputSchemas } from './types';

export const askQuestion: DeepwikiMcpEndpoints['askQuestion'] = async (
	ctx,
	input,
) => {
	const response = await callDeepwikiMcpTool(
		'ask_question',
		input,
		ctx.key,
		DeepwikiMcpEndpointOutputSchemas.askQuestion,
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
		const response = await callDeepwikiMcpTool(
			'read_wiki_contents',
			input,
			ctx.key,
			DeepwikiMcpEndpointOutputSchemas.readWikiContents,
		);
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
		const response = await callDeepwikiMcpTool(
			'read_wiki_structure',
			input,
			ctx.key,
			DeepwikiMcpEndpointOutputSchemas.readWikiStructure,
		);
		await logEventFromContext(
			ctx,
			'deepwikimcp.read_wiki_structure',
			{ ...input },
			'completed',
		);
		return response;
	};
