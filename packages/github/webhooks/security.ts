import type { GithubWebhooks } from '../index';
import { createGithubEventMatch, verifyGithubWebhookSignature } from './types';

export const dependabotAlertCreated: GithubWebhooks['dependabotAlertCreated'] =
	{
		match: createGithubEventMatch('dependabot_alert', 'created'),
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
			console.log('GitHub Dependabot Alert Created:', {
				package: event.alert.security_advisory.summary,
				severity: event.alert.security_vulnerability.severity,
				repository: event.repository.full_name,
			});
			return { success: true, data: event };
		},
	};

export const dependabotAlertDismissed: GithubWebhooks['dependabotAlertDismissed'] =
	{
		match: createGithubEventMatch('dependabot_alert', 'dismissed'),
		handler: async (ctx, request) => {
			const v = verifyGithubWebhookSignature(request, ctx.key);
			if (!v.valid)
				return {
					success: false,
					statusCode: 401,
					error: v.error || 'Signature verification failed',
				};
			const event = request.payload;
			if (event.action !== 'dismissed')
				return { success: false, data: undefined };
			console.log('GitHub Dependabot Alert Dismissed:', {
				reason: event.alert.dismissed_reason,
				repository: event.repository.full_name,
			});
			return { success: true, data: event };
		},
	};

export const dependabotAlertFixed: GithubWebhooks['dependabotAlertFixed'] = {
	match: createGithubEventMatch('dependabot_alert', 'fixed'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'fixed') return { success: false, data: undefined };
		console.log('GitHub Dependabot Alert Fixed:', {
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};

export const dependabotAlertReopened: GithubWebhooks['dependabotAlertReopened'] =
	{
		match: createGithubEventMatch('dependabot_alert', 'reopened'),
		handler: async (ctx, request) => {
			const v = verifyGithubWebhookSignature(request, ctx.key);
			if (!v.valid)
				return {
					success: false,
					statusCode: 401,
					error: v.error || 'Signature verification failed',
				};
			const event = request.payload;
			if (event.action !== 'reopened')
				return { success: false, data: undefined };
			console.log('GitHub Dependabot Alert Reopened:', {
				repository: event.repository.full_name,
			});
			return { success: true, data: event };
		},
	};

export const dependabotAlertAutoDismissed: GithubWebhooks['dependabotAlertAutoDismissed'] =
	{
		match: createGithubEventMatch('dependabot_alert', 'auto_dismissed'),
		handler: async (ctx, request) => {
			const v = verifyGithubWebhookSignature(request, ctx.key);
			if (!v.valid)
				return {
					success: false,
					statusCode: 401,
					error: v.error || 'Signature verification failed',
				};
			const event = request.payload;
			if (event.action !== 'auto_dismissed')
				return { success: false, data: undefined };
			console.log('GitHub Dependabot Alert Auto-dismissed:', {
				repository: event.repository.full_name,
			});
			return { success: true, data: event };
		},
	};

export const dependabotAlertAutoReopened: GithubWebhooks['dependabotAlertAutoReopened'] =
	{
		match: createGithubEventMatch('dependabot_alert', 'auto_reopened'),
		handler: async (ctx, request) => {
			const v = verifyGithubWebhookSignature(request, ctx.key);
			if (!v.valid)
				return {
					success: false,
					statusCode: 401,
					error: v.error || 'Signature verification failed',
				};
			const event = request.payload;
			if (event.action !== 'auto_reopened')
				return { success: false, data: undefined };
			console.log('GitHub Dependabot Alert Auto-reopened:', {
				repository: event.repository.full_name,
			});
			return { success: true, data: event };
		},
	};
