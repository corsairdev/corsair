import { logEventFromContext } from 'corsair/core';
import type { WixMcpEndpoints } from '..';
import type { CallToolResponse } from './types';
import { callWixMcpTool } from '../client';

export const callTool: WixMcpEndpoints['callTool'] = async (ctx, input) => {
	const response = await callWixMcpTool<CallToolResponse>(
		{
			name: input.name,
			arguments: input.arguments,
		},
		ctx.key,
	);

	await logEventFromContext(
		ctx,
		'wixmcp.tool.call',
		{ name: input.name },
		'completed',
	);

	return response;
};