import type { GithubWebhooks } from '..';
import { createGithubEventMatch, verifyGithubWebhookSignature } from './types';
import type {
	PullRequestClosedEvent,
	PullRequestOpenedEvent,
	PullRequestSynchronizeEvent,
} from './types';

export const pullRequestOpened: GithubWebhooks['pullRequestOpened'] = {
	match: createGithubEventMatch('pull_request', 'opened'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyGithubWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload as PullRequestOpenedEvent;

		if (event.action !== 'opened') {
			return {
				success: false,
				data: undefined,
			};
		}

		console.log('🔀 GitHub Pull Request Opened:', {
			number: event.number,
			title: event.pull_request.title,
			repository: event.repository.full_name,
		});

		if (ctx.db.pullRequests && event.pull_request.id) {
			try {
				const pr = event.pull_request;
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
			} catch (error) {
				console.warn('Failed to save pull request to database:', error);
			}
		}

		return {
			success: true,
			data: event,
		};
	},
};

export const pullRequestClosed: GithubWebhooks['pullRequestClosed'] = {
	match: createGithubEventMatch('pull_request', 'closed'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyGithubWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload as PullRequestClosedEvent;

		if (event.action !== 'closed') {
			return {
				success: false,
				data: undefined,
			};
		}

		console.log('🔒 GitHub Pull Request Closed:', {
			number: event.number,
			merged: event.pull_request.merged,
			repository: event.repository.full_name,
		});

		if (ctx.db.pullRequests && event.pull_request.id) {
			try {
				const pr = event.pull_request;
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
			} catch (error) {
				console.warn('Failed to update pull request in database:', error);
			}
		}

		return {
			success: true,
			data: event,
		};
	},
};

export const pullRequestSynchronize: GithubWebhooks['pullRequestSynchronize'] =
	{
		match: createGithubEventMatch('pull_request', 'synchronize'),

		handler: async (ctx, request) => {
			const webhookSecret = ctx.key;
			const verification = verifyGithubWebhookSignature(request, webhookSecret);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error || 'Signature verification failed',
				};
			}

			const event = request.payload as PullRequestSynchronizeEvent;

			if (event.action !== 'synchronize') {
				return {
					success: false,
					data: undefined,
				};
			}

			console.log('🔄 GitHub Pull Request Synchronized:', {
				number: event.number,
				before: event.before,
				after: event.after,
				repository: event.repository.full_name,
			});

			if (ctx.db.pullRequests && event.pull_request.id) {
				try {
					const pr = event.pull_request;
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
				} catch (error) {
					console.warn('Failed to update pull request in database:', error);
				}
			}

			return {
				success: true,
				data: event,
			};
		},
	};
