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
					body: input ?? {},
				},
			);

		if (response.session_id && ctx.db.browserSessions) {
			try {
				await ctx.db.browserSessions.upsertByEntityId(response.session_id, {
					sessionId: response.session_id,
					cdpUrl: response.cdp_url,
					baseUrl: response.base_url,
					browserUaPreset: input?.browser_ua_preset,
					browserProfile: input?.browser_profile,
					inactivityTimeoutSeconds: input?.inactivity_timeout_seconds,
					shutdownMode: input?.shutdown_mode,
					subUserId: input?.sub_user_id,
					branding: input?.branding,
					browserStartupUrl: input?.browser_startup_url,
					updatedAt: new Date(),
				});
			} catch (error) {
				console.warn(
					'[agentql] Failed to save browser session to database:',
					error,
				);
			}
		}

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
