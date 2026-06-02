import type { GithubWebhooks } from '../index';
import type { PullRequest } from './types';
import { createGithubEventMatch, verifyGithubWebhookSignature } from './types';

async function upsertPR(
	ctx: Parameters<GithubWebhooks['pullRequestOpened']['handler']>[0],
	pr: PullRequest,
) {
	if (!ctx.db.pullRequests) return;
	await ctx.db.pullRequests.upsertByEntityId(pr.id.toString(), {
		id: pr.id,
		nodeId: pr.node_id,
		url: pr.url,
		htmlUrl: pr.html_url,
		diffUrl: pr.diff_url,
		patchUrl: pr.patch_url,
		issueUrl: pr.issue_url,
		number: pr.number,
		state: pr.state,
		locked: pr.locked,
		title: pr.title,
		body: pr.body,
		createdAt: new Date(pr.created_at),
		updatedAt: new Date(pr.updated_at),
		closedAt: pr.closed_at ? new Date(pr.closed_at) : null,
		mergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
		mergeCommitSha: pr.merge_commit_sha,
		draft: pr.draft,
		merged: pr.merged ?? false,
		mergeable: pr.mergeable,
		comments: pr.comments,
		reviewComments: pr.review_comments,
		commits: pr.commits,
		additions: pr.additions,
		deletions: pr.deletions,
		changedFiles: pr.changed_files,
	});
}

export const pullRequestOpened: GithubWebhooks['pullRequestOpened'] = {
	match: createGithubEventMatch('pull_request', 'opened'),

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
		if (event.action !== 'opened') return { success: false, data: undefined };

		console.log('GitHub Pull Request Opened:', {
			number: event.number,
			title: event.pull_request.title,
			repository: event.repository.full_name,
		});

		try {
			await upsertPR(ctx, event.pull_request);
		} catch (error) {
			console.warn('Failed to save pull request to database:', error);
		}

		return { success: true, data: event };
	},
};

export const pullRequestClosed: GithubWebhooks['pullRequestClosed'] = {
	match: createGithubEventMatch('pull_request', 'closed'),

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
		if (event.action !== 'closed') return { success: false, data: undefined };

		console.log('GitHub Pull Request Closed:', {
			number: event.number,
			merged: event.pull_request.merged,
			repository: event.repository.full_name,
		});

		try {
			await upsertPR(ctx, event.pull_request);
		} catch (error) {
			console.warn('Failed to update pull request in database:', error);
		}

		return { success: true, data: event };
	},
};

export const pullRequestSynchronize: GithubWebhooks['pullRequestSynchronize'] =
	{
		match: createGithubEventMatch('pull_request', 'synchronize'),

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
			if (event.action !== 'synchronize')
				return { success: false, data: undefined };

			console.log('GitHub Pull Request Synchronized:', {
				number: event.number,
				before: event.before,
				after: event.after,
				repository: event.repository.full_name,
			});

			try {
				await upsertPR(ctx, event.pull_request);
			} catch (error) {
				console.warn('Failed to update pull request in database:', error);
			}

			return { success: true, data: event };
		},
	};

export const pullRequestReopened: GithubWebhooks['pullRequestReopened'] = {
	match: createGithubEventMatch('pull_request', 'reopened'),

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
		if (event.action !== 'reopened') return { success: false, data: undefined };

		console.log('GitHub Pull Request Reopened:', {
			number: event.number,
			repository: event.repository.full_name,
		});

		try {
			await upsertPR(ctx, event.pull_request);
		} catch (error) {
			console.warn('Failed to update pull request in database:', error);
		}

		return { success: true, data: event };
	},
};

export const pullRequestLabeled: GithubWebhooks['pullRequestLabeled'] = {
	match: createGithubEventMatch('pull_request', 'labeled'),

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
		if (event.action !== 'labeled') return { success: false, data: undefined };

		console.log('GitHub Pull Request Labeled:', {
			number: event.number,
			label: event.label?.name,
			repository: event.repository.full_name,
		});

		try {
			await upsertPR(ctx, event.pull_request);
		} catch (error) {
			console.warn('Failed to update pull request in database:', error);
		}

		return { success: true, data: event };
	},
};

export const pullRequestUnlabeled: GithubWebhooks['pullRequestUnlabeled'] = {
	match: createGithubEventMatch('pull_request', 'unlabeled'),

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
		if (event.action !== 'unlabeled')
			return { success: false, data: undefined };

		console.log('GitHub Pull Request Unlabeled:', {
			number: event.number,
			label: event.label?.name,
			repository: event.repository.full_name,
		});

		try {
			await upsertPR(ctx, event.pull_request);
		} catch (error) {
			console.warn('Failed to update pull request in database:', error);
		}

		return { success: true, data: event };
	},
};

export const pullRequestReviewRequested: GithubWebhooks['pullRequestReviewRequested'] =
	{
		match: createGithubEventMatch('pull_request', 'review_requested'),

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
			if (event.action !== 'review_requested')
				return { success: false, data: undefined };

			console.log('GitHub Pull Request Review Requested:', {
				number: event.number,
				reviewer: event.requested_reviewer?.login,
				repository: event.repository.full_name,
			});

			try {
				await upsertPR(ctx, event.pull_request);
			} catch (error) {
				console.warn('Failed to update pull request in database:', error);
			}

			return { success: true, data: event };
		},
	};

export const pullRequestReadyForReview: GithubWebhooks['pullRequestReadyForReview'] =
	{
		match: createGithubEventMatch('pull_request', 'ready_for_review'),

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
			if (event.action !== 'ready_for_review')
				return { success: false, data: undefined };

			console.log('GitHub Pull Request Ready for Review:', {
				number: event.number,
				repository: event.repository.full_name,
			});

			try {
				await upsertPR(ctx, event.pull_request);
			} catch (error) {
				console.warn('Failed to update pull request in database:', error);
			}

			return { success: true, data: event };
		},
	};

export const pullRequestConvertedToDraft: GithubWebhooks['pullRequestConvertedToDraft'] =
	{
		match: createGithubEventMatch('pull_request', 'converted_to_draft'),

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
			if (event.action !== 'converted_to_draft')
				return { success: false, data: undefined };

			console.log('GitHub Pull Request Converted to Draft:', {
				number: event.number,
				repository: event.repository.full_name,
			});

			try {
				await upsertPR(ctx, event.pull_request);
			} catch (error) {
				console.warn('Failed to update pull request in database:', error);
			}

			return { success: true, data: event };
		},
	};
