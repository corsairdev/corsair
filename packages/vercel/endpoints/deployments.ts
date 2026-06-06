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
		if (input.teamId) query.teamId = input.teamId;

		const result = await makeAuthenticatedVercelRequest<
			VercelEndpointOutputs['deploymentsGetDeployments']
		>('/v6/deployments', ctx, { query });

		if (result && result.deployments && ctx.db.deployments) {
			for (const deployment of result.deployments) {
				await ctx.db.deployments.upsertByEntityId(deployment.uid, {
					uid: deployment.uid,
					name: deployment.name,
					url: deployment.url,
					created: deployment.created,
					readyState: deployment.readyState,
					type: deployment.type as string,
					target: deployment.target,
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
				uid: result.uid,
				name: result.name,
				url: result.url,
				created: result.created,
				readyState: result.readyState,
				type: result.type as string,
				target: result.target,
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
				uid: result.uid,
				name: result.name,
				url: result.url,
				created: result.created,
				readyState: result.readyState,
				type: result.type as string,
				target: result.target,
			});
		}

		await logEventFromContext(
			ctx,
			'vercel.deployments.createDeployment',
			{ ...input },
			'completed',
		);
		return result;
	};
