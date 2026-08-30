import type { CrowterminalContext } from '..';
import { callCrowterminal } from './shared';
import type {
	CrowterminalEndpointInputs,
	CrowterminalEndpointOutputs,
} from './types';
import {
	GetComponentsInputSchema,
	GetComponentsResponseSchema,
	GetIncidentsInputSchema,
	GetIncidentsResponseSchema,
	GetStatusHistoryInputSchema,
	GetStatusHistoryResponseSchema,
	GetStatusInputSchema,
	GetStatusResponseSchema,
	GetUptimeInputSchema,
	GetUptimeResponseSchema,
	PingInputSchema,
	PingResponseSchema,
} from './types';

// The status endpoints are public. They still go through the authenticated
// client so that one code path handles retries and error classification.

export const get = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['statusGet'],
): Promise<CrowterminalEndpointOutputs['statusGet']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.status.get',
			inputSchema: GetStatusInputSchema,
			outputSchema: GetStatusResponseSchema,
			path: () => '/api/agent/status',
		},
		input,
	);

export const ping = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['statusPing'],
): Promise<CrowterminalEndpointOutputs['statusPing']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.status.ping',
			inputSchema: PingInputSchema,
			outputSchema: PingResponseSchema,
			path: () => '/api/agent/status/ping',
		},
		input,
	);

export const getComponents = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['statusGetComponents'],
): Promise<CrowterminalEndpointOutputs['statusGetComponents']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.status.get_components',
			inputSchema: GetComponentsInputSchema,
			outputSchema: GetComponentsResponseSchema,
			path: () => '/api/agent/status/components',
		},
		input,
	);

export const getIncidents = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['statusGetIncidents'],
): Promise<CrowterminalEndpointOutputs['statusGetIncidents']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.status.get_incidents',
			inputSchema: GetIncidentsInputSchema,
			outputSchema: GetIncidentsResponseSchema,
			path: () => '/api/agent/status/incidents',
		},
		input,
	);

/** Seven days of daily uptime points, shaped for charting. */
export const getHistory = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['statusGetHistory'],
): Promise<CrowterminalEndpointOutputs['statusGetHistory']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.status.get_history',
			inputSchema: GetStatusHistoryInputSchema,
			outputSchema: GetStatusHistoryResponseSchema,
			path: () => '/api/agent/status/history',
		},
		input,
	);

export const getUptime = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['statusGetUptime'],
): Promise<CrowterminalEndpointOutputs['statusGetUptime']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.status.get_uptime',
			inputSchema: GetUptimeInputSchema,
			outputSchema: GetUptimeResponseSchema,
			path: () => '/api/agent/status/uptime',
		},
		input,
	);
