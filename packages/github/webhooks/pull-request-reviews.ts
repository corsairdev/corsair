import type { GithubWebhooks } from '..';
import { createGithubEventMatch, verifyGithubWebhookSignature } from './types';

export const pullRequestReviewSubmitted: GithubWebhooks['pullRequestReviewSubmitted'] =
	{
		match: createGithubEventMatch('pull_request_review', 'submitted'),

		handler: async (ctx, request) => {
			const verification = verifyGithubWebhookSignature(request, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error || 'Signature verification failed',
				};
			}
			const event = request.payload;
			if (event.action !== 'submitted') {
				return { success: false, data: undefined };
			}
			console.log('GitHub PR Review Submitted:', {
				pr: event.pull_request.number,
				state: event.review.state,
				reviewer: event.review.user.login,
				repository: event.repository.full_name,
			});
			return { success: true, data: event };
		},
	};

export const pullRequestReviewDismissed: GithubWebhooks['pullRequestReviewDismissed'] =
	{
		match: createGithubEventMatch('pull_request_review', 'dismissed'),

		handler: async (ctx, request) => {
			const verification = verifyGithubWebhookSignature(request, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error || 'Signature verification failed',
				};
			}
			const event = request.payload;
			if (event.action !== 'dismissed') {
				return { success: false, data: undefined };
			}
			console.log('GitHub PR Review Dismissed:', {
				pr: event.pull_request.number,
				reviewer: event.review.user.login,
				repository: event.repository.full_name,
			});
			return { success: true, data: event };
		},
	};

export const pullRequestReviewEdited: GithubWebhooks['pullRequestReviewEdited'] =
	{
		match: createGithubEventMatch('pull_request_review', 'edited'),

		handler: async (ctx, request) => {
			const verification = verifyGithubWebhookSignature(request, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error || 'Signature verification failed',
				};
			}
			const event = request.payload;
			if (event.action !== 'edited') {
				return { success: false, data: undefined };
			}
			console.log('GitHub PR Review Edited:', {
				pr: event.pull_request.number,
				reviewer: event.review.user.login,
				repository: event.repository.full_name,
			});
			return { success: true, data: event };
		},
	};

export const pullRequestReviewCommentCreated: GithubWebhooks['pullRequestReviewCommentCreated'] =
	{
		match: createGithubEventMatch('pull_request_review_comment', 'created'),

		handler: async (ctx, request) => {
			const verification = verifyGithubWebhookSignature(request, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error || 'Signature verification failed',
				};
			}
			const event = request.payload;
			if (event.action !== 'created') {
				return { success: false, data: undefined };
			}
			console.log('GitHub PR Review Comment Created:', {
				pr: event.pull_request.number,
				commenter: event.comment.user.login,
				path: event.comment.path,
				repository: event.repository.full_name,
			});
			return { success: true, data: event };
		},
	};

export const pullRequestReviewCommentEdited: GithubWebhooks['pullRequestReviewCommentEdited'] =
	{
		match: createGithubEventMatch('pull_request_review_comment', 'edited'),

		handler: async (ctx, request) => {
			const verification = verifyGithubWebhookSignature(request, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error || 'Signature verification failed',
				};
			}
			const event = request.payload;
			if (event.action !== 'edited') {
				return { success: false, data: undefined };
			}
			console.log('GitHub PR Review Comment Edited:', {
				pr: event.pull_request.number,
				repository: event.repository.full_name,
			});
			return { success: true, data: event };
		},
	};

export const pullRequestReviewCommentDeleted: GithubWebhooks['pullRequestReviewCommentDeleted'] =
	{
		match: createGithubEventMatch('pull_request_review_comment', 'deleted'),

		handler: async (ctx, request) => {
			const verification = verifyGithubWebhookSignature(request, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error || 'Signature verification failed',
				};
			}
			const event = request.payload;
			if (event.action !== 'deleted') {
				return { success: false, data: undefined };
			}
			console.log('GitHub PR Review Comment Deleted:', {
				pr: event.pull_request.number,
				repository: event.repository.full_name,
			});
			return { success: true, data: event };
		},
	};

export const pullRequestReviewThreadResolved: GithubWebhooks['pullRequestReviewThreadResolved'] =
	{
		match: createGithubEventMatch('pull_request_review_thread', 'resolved'),

		handler: async (ctx, request) => {
			const verification = verifyGithubWebhookSignature(request, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error || 'Signature verification failed',
				};
			}
			const event = request.payload;
			if (event.action !== 'resolved') {
				return { success: false, data: undefined };
			}
			console.log('GitHub PR Review Thread Resolved:', {
				pr: event.pull_request.number,
				repository: event.repository.full_name,
			});
			return { success: true, data: event };
		},
	};

export const pullRequestReviewThreadUnresolved: GithubWebhooks['pullRequestReviewThreadUnresolved'] =
	{
		match: createGithubEventMatch('pull_request_review_thread', 'unresolved'),

		handler: async (ctx, request) => {
			const verification = verifyGithubWebhookSignature(request, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error || 'Signature verification failed',
				};
			}
			const event = request.payload;
			if (event.action !== 'unresolved') {
				return { success: false, data: undefined };
			}
			console.log('GitHub PR Review Thread Unresolved:', {
				pr: event.pull_request.number,
				repository: event.repository.full_name,
			});
			return { success: true, data: event };
		},
	};
