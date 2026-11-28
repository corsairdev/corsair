import type { NtfyEndpoints } from '..';
import { call } from './call';
import {
	NtfyEndpointInputSchemas as Inputs,
	NtfyEndpointOutputSchemas as Outputs,
} from './types';

export const health: NtfyEndpoints['serverHealth'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'server.health',
			input: Inputs.serverHealth,
			output: Outputs.serverHealth,
		},
		input,
		() => ({
			method: 'GET',
			path: '/v1/health',
		}),
		{
			log: (_, result) => ({ healthy: result.healthy, role: result.role }),
		},
	);

export const stats: NtfyEndpoints['serverStats'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'server.stats',
			input: Inputs.serverStats,
			output: Outputs.serverStats,
		},
		input,
		() => ({
			method: 'GET',
			path: '/v1/stats',
		}),
		{
			log: (_, result) => ({ messages: result.messages }),
		},
	);
