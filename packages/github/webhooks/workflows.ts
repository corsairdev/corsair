import type { GithubWebhooks } from '../index';
import { createGithubEventMatch, verifyGithubWebhookSignature } from './types';

export const workflowRunCompleted: GithubWebhooks['workflowRunCompleted'] = {
	match: createGithubEventMatch('workflow_run', 'completed'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'completed')
			return { success: false, data: undefined };
		console.log('GitHub Workflow Run Completed:', {
			name: event.workflow_run.name,
			conclusion: event.workflow_run.conclusion,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};

export const workflowRunInProgress: GithubWebhooks['workflowRunInProgress'] = {
	match: createGithubEventMatch('workflow_run', 'in_progress'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'in_progress')
			return { success: false, data: undefined };
		console.log('GitHub Workflow Run In Progress:', {
			name: event.workflow_run.name,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};

export const workflowRunRequested: GithubWebhooks['workflowRunRequested'] = {
	match: createGithubEventMatch('workflow_run', 'requested'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'requested')
			return { success: false, data: undefined };
		console.log('GitHub Workflow Run Requested:', {
			name: event.workflow_run.name,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};

export const workflowJobCompleted: GithubWebhooks['workflowJobCompleted'] = {
	match: createGithubEventMatch('workflow_job', 'completed'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'completed')
			return { success: false, data: undefined };
		console.log('GitHub Workflow Job Completed:', {
			name: event.workflow_job.name,
			conclusion: event.workflow_job.conclusion,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};

export const workflowJobQueued: GithubWebhooks['workflowJobQueued'] = {
	match: createGithubEventMatch('workflow_job', 'queued'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'queued') return { success: false, data: undefined };
		console.log('GitHub Workflow Job Queued:', {
			name: event.workflow_job.name,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};

export const workflowJobInProgress: GithubWebhooks['workflowJobInProgress'] = {
	match: createGithubEventMatch('workflow_job', 'in_progress'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'in_progress')
			return { success: false, data: undefined };
		console.log('GitHub Workflow Job In Progress:', {
			name: event.workflow_job.name,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};

export const workflowJobWaiting: GithubWebhooks['workflowJobWaiting'] = {
	match: createGithubEventMatch('workflow_job', 'waiting'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'waiting') return { success: false, data: undefined };
		console.log('GitHub Workflow Job Waiting:', {
			name: event.workflow_job.name,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};

export const workflowDispatched: GithubWebhooks['workflowDispatched'] = {
	match: createGithubEventMatch('workflow_dispatch'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		console.log('GitHub Workflow Dispatched:', {
			workflow: event.workflow,
			ref: event.ref,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};
