import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedVercelRequest } from '../client';
import type { VercelEndpoints } from '../index';
import type { VercelEndpointOutputs } from './types';

export const getDeployments: VercelEndpoints['deploymentsGetDeployments'] =
	async (ctx, input) => {
		const query: Record<string, string | number | boolean | undefined> = {};
		if (input.projectId) query.projectId = input.projectId;
		if (input.limit) query.limit = input.limit;
		if (input.until) query.until = input.until;

		const result = await makeAuthenticatedVercelRequest<
			VercelEndpointOutputs['deploymentsGetDeployments']
		>('/v6/deployments', ctx, { query, teamId: input.teamId });

		if (result && result.deployments && ctx.db.deployments) {
			for (const deployment of result.deployments) {
				await ctx.db.deployments.upsertByEntityId(deployment.uid, {
					...deployment,
					type: String(deployment.type),
				});
			}
		}

		await logEventFromContext(
			ctx,
			'vercel.deployments.getDeployments',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getDeployment: VercelEndpoints['deploymentsGetDeployment'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedVercelRequest<
			VercelEndpointOutputs['deploymentsGetDeployment']
		>(`/v13/deployments/${encodeURIComponent(input.idOrUrl)}`, ctx, {
			teamId: input.teamId,
		});

		if (result && ctx.db.deployments) {
			await ctx.db.deployments.upsertByEntityId(result.uid, {
				...result,
				type: String(result.type),
			});
		}

		await logEventFromContext(
			ctx,
			'vercel.deployments.getDeployment',
			{ ...input },
			'completed',
		);
		return result;
	};

export const createDeployment: VercelEndpoints['deploymentsCreateDeployment'] =
	async (ctx, input) => {
		const { teamId, ...body } = input;
		const result = await makeAuthenticatedVercelRequest<
			VercelEndpointOutputs['deploymentsCreateDeployment']
		>('/v13/deployments', ctx, { method: 'POST', body, teamId });

		if (result && ctx.db.deployments) {
			await ctx.db.deployments.upsertByEntityId(result.uid, {
				...result,
				type: String(result.type),
			});
		}

		// Exclude env from the event log to avoid persisting credentials
		const { env: _env, ...loggableInput } = input;
		await logEventFromContext(
			ctx,
			'vercel.deployments.createDeployment',
			loggableInput,
			'completed',
		);
		return result;
	};
