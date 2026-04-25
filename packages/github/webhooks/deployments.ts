import type { GithubWebhooks } from '../index';
import { createGithubEventMatch, verifyGithubWebhookSignature } from './types';

export const deploymentCreated: GithubWebhooks['deploymentCreated'] = {
	match: createGithubEventMatch('deployment', 'created'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'created') return { success: false, data: undefined };
		console.log('GitHub Deployment Created:', {
			environment: event.deployment.environment,
			ref: event.deployment.ref,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};

export const deploymentStatusCreated: GithubWebhooks['deploymentStatusCreated'] =
	{
		match: createGithubEventMatch('deployment_status', 'created'),
		handler: async (ctx, request) => {
			const v = verifyGithubWebhookSignature(request, ctx.key);
			if (!v.valid)
				return {
					success: false,
					statusCode: 401,
					error: v.error || 'Signature verification failed',
				};
			const event = request.payload;
			if (event.action !== 'created')
				return { success: false, data: undefined };
			console.log('GitHub Deployment Status Created:', {
				state: event.deployment_status.state,
				environment: event.deployment.environment,
				repository: event.repository.full_name,
			});
			return { success: true, data: event };
		},
	};
