import { logEventFromContext } from 'corsair/core';
import { makeUpdownIORequest } from '../client';
import type { UpdownIOEndpoints } from '../index';
import {
	ListNodeIpsInputSchema,
	ListNodeIpv4InputSchema,
	ListNodeIpv6InputSchema,
	ListNodesInputSchema,
	NodeIpsResponseSchema,
	NodeIpv4ResponseSchema,
	NodeIpv6ResponseSchema,
	NodesResponseSchema,
} from './types';

export const list: UpdownIOEndpoints['nodesList'] = async (ctx, rawInput) => {
	ListNodesInputSchema.parse(rawInput);
	const response = NodesResponseSchema.parse(
		await makeUpdownIORequest<unknown>('/nodes', ctx.key),
	);
	await logEventFromContext(
		ctx,
		'updownio.nodes.list',
		{ count: Object.keys(response).length },
		'completed',
	);
	return response;
};
export const listIps: UpdownIOEndpoints['nodesListIps'] = async (
	ctx,
	rawInput,
) => {
	ListNodeIpsInputSchema.parse(rawInput);
	const response = NodeIpsResponseSchema.parse(
		await makeUpdownIORequest<unknown>('/nodes/ips', ctx.key),
	);
	await logEventFromContext(
		ctx,
		'updownio.nodes.listIps',
		{ count: response.length },
		'completed',
	);
	return response;
};
export const listIpv4: UpdownIOEndpoints['nodesListIpv4'] = async (
	ctx,
	rawInput,
) => {
	ListNodeIpv4InputSchema.parse(rawInput);
	const response = NodeIpv4ResponseSchema.parse(
		await makeUpdownIORequest<unknown>('/nodes/ipv4', ctx.key),
	);
	await logEventFromContext(
		ctx,
		'updownio.nodes.listIpv4',
		{ count: response.length },
		'completed',
	);
	return response;
};
export const listIpv6: UpdownIOEndpoints['nodesListIpv6'] = async (
	ctx,
	rawInput,
) => {
	ListNodeIpv6InputSchema.parse(rawInput);
	const response = NodeIpv6ResponseSchema.parse(
		await makeUpdownIORequest<unknown>('/nodes/ipv6', ctx.key),
	);
	await logEventFromContext(
		ctx,
		'updownio.nodes.listIpv6',
		{ count: response.length },
		'completed',
	);
	return response;
};
