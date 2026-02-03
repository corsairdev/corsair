import type { GithubWebhooks } from '..';
import type {
	PullRequestClosedEvent,
	PullRequestOpenedEvent,
	PullRequestSynchronizeEvent,
} from './types';

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

function createGithubMatch(eventName: string, action?: string) {
	return (request: import('../../../core/webhooks').RawWebhookRequest) => {
		const parsedBody = parseBody(request.body) as Record<string, unknown>;
		const headers = request.headers as Record<string, string | undefined>;
		const githubEvent = headers['x-github-event'];
		return (
			githubEvent === eventName &&
			(!action || (parsedBody.action as string) === action)
		);
	};
}

export const pullRequestOpened: GithubWebhooks['pullRequestOpened'] = {
	match: createGithubMatch('pull_request', 'opened'),

	handler: async (ctx, request) => {
		const event = request.payload as PullRequestOpenedEvent;

		if (event.action !== 'opened') {
			return {
				success: true,
				data: { success: true },
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
			data: { success: true },
		};
	},
};

export const pullRequestClosed: GithubWebhooks['pullRequestClosed'] = {
	match: createGithubMatch('pull_request', 'closed'),

	handler: async (ctx, request) => {
		const event = request.payload as PullRequestClosedEvent;

		if (event.action !== 'closed') {
			return {
				success: true,
				data: { success: true },
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
			data: { success: true },
		};
	},
};

export const pullRequestSynchronize: GithubWebhooks['pullRequestSynchronize'] =
	{
		match: createGithubMatch('pull_request', 'synchronize'),

		handler: async (ctx, request) => {
			const event = request.payload as PullRequestSynchronizeEvent;

			if (event.action !== 'synchronize') {
				return {
					success: true,
					data: { success: true },
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
				data: { success: true },
			};
		},
	};
