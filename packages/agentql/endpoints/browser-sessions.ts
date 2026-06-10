import { logEventFromContext } from 'corsair/core';
import { makeAgentQLRequest } from '../client';
import type { AgentQLEndpoints } from '../index';
import type { AgentQLCreateRemoteBrowserSessionResponse } from './types';

export const createRemoteBrowserSession: AgentQLEndpoints['createRemoteBrowserSession'] =
	async (ctx, input) => {
		const response =
			await makeAgentQLRequest<AgentQLCreateRemoteBrowserSessionResponse>(
				'/v1/tetra/sessions',
				ctx.key,
				{
					method: 'POST',
					body: input,
				},
			);

		await logEventFromContext(
			ctx,
			'agentql.browserSessions.createRemoteBrowserSession',
			{
				browserProfile: input?.browser_profile,
				browserUaPreset: input?.browser_ua_preset,
				shutdownMode: input?.shutdown_mode,
				hasProxy: Boolean(input?.proxy),
				hasStartupUrl: Boolean(input?.browser_startup_url),
			},
			'completed',
		);

		return response;
	};
