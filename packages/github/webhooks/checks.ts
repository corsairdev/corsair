import type { GithubWebhooks } from '..';
import { createGithubEventMatch, verifyGithubWebhookSignature } from './types';

export const checkRunCompleted: GithubWebhooks['checkRunCompleted'] = {
	match: createGithubEventMatch('check_run', 'completed'),
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
		console.log('GitHub Check Run Completed:', {
			name: event.check_run.name,
			conclusion: event.check_run.conclusion,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};

export const checkRunCreated: GithubWebhooks['checkRunCreated'] = {
	match: createGithubEventMatch('check_run', 'created'),
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
		console.log('GitHub Check Run Created:', {
			name: event.check_run.name,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};

export const checkRunRerequested: GithubWebhooks['checkRunRerequested'] = {
	match: createGithubEventMatch('check_run', 'rerequested'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'rerequested')
			return { success: false, data: undefined };
		console.log('GitHub Check Run Rerequested:', {
			name: event.check_run.name,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};

export const checkSuiteCompleted: GithubWebhooks['checkSuiteCompleted'] = {
	match: createGithubEventMatch('check_suite', 'completed'),
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
		console.log('GitHub Check Suite Completed:', {
			conclusion: event.check_suite.conclusion,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};

export const checkSuiteRequested: GithubWebhooks['checkSuiteRequested'] = {
	match: createGithubEventMatch('check_suite', 'requested'),
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
		console.log('GitHub Check Suite Requested:', {
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};
