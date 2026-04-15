import type { GithubWebhooks } from '..';
import type { Issue } from './types';
import { createGithubEventMatch, verifyGithubWebhookSignature } from './types';

async function upsertIssue(
	ctx: Parameters<GithubWebhooks['issueOpened']['handler']>[0],
	issue: Issue,
	deletedAt?: Date | null,
) {
	if (!ctx.db.issues) return;
	await ctx.db.issues.upsertByEntityId(issue.id.toString(), {
		id: issue.id,
		nodeId: issue.node_id,
		url: issue.url,
		repositoryUrl: issue.repository_url,
		htmlUrl: issue.html_url,
		number: issue.number,
		state: issue.state,
		title: issue.title,
		body: issue.body,
		locked: issue.locked,
		comments: issue.comments,
		createdAt: issue.created_at ? new Date(issue.created_at) : null,
		updatedAt: issue.updated_at ? new Date(issue.updated_at) : null,
		closedAt: issue.closed_at ? new Date(issue.closed_at) : null,
		deletedAt: deletedAt ?? null,
	});
}

export const issueOpened: GithubWebhooks['issueOpened'] = {
	match: createGithubEventMatch('issues', 'opened'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'opened') return { success: false, data: undefined };
		console.log('GitHub Issue Opened:', {
			number: event.issue.number,
			title: event.issue.title,
			repository: event.repository.full_name,
		});
		try {
			await upsertIssue(ctx, event.issue);
		} catch (error) {
			console.warn('Failed to save issue to database:', error);
		}
		return { success: true, data: event };
	},
};

export const issueClosed: GithubWebhooks['issueClosed'] = {
	match: createGithubEventMatch('issues', 'closed'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'closed') return { success: false, data: undefined };
		console.log('GitHub Issue Closed:', {
			number: event.issue.number,
			repository: event.repository.full_name,
		});
		try {
			await upsertIssue(ctx, event.issue);
		} catch (error) {
			console.warn('Failed to update issue in database:', error);
		}
		return { success: true, data: event };
	},
};

export const issueReopened: GithubWebhooks['issueReopened'] = {
	match: createGithubEventMatch('issues', 'reopened'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'reopened') return { success: false, data: undefined };
		console.log('GitHub Issue Reopened:', {
			number: event.issue.number,
			repository: event.repository.full_name,
		});
		try {
			await upsertIssue(ctx, event.issue);
		} catch (error) {
			console.warn('Failed to update issue in database:', error);
		}
		return { success: true, data: event };
	},
};

export const issueLabeled: GithubWebhooks['issueLabeled'] = {
	match: createGithubEventMatch('issues', 'labeled'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'labeled') return { success: false, data: undefined };
		console.log('GitHub Issue Labeled:', {
			number: event.issue.number,
			label: event.label?.name,
			repository: event.repository.full_name,
		});
		try {
			await upsertIssue(ctx, event.issue);
		} catch (error) {
			console.warn('Failed to update issue in database:', error);
		}
		return { success: true, data: event };
	},
};

export const issueUnlabeled: GithubWebhooks['issueUnlabeled'] = {
	match: createGithubEventMatch('issues', 'unlabeled'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'unlabeled')
			return { success: false, data: undefined };
		console.log('GitHub Issue Unlabeled:', {
			number: event.issue.number,
			label: event.label?.name,
			repository: event.repository.full_name,
		});
		try {
			await upsertIssue(ctx, event.issue);
		} catch (error) {
			console.warn('Failed to update issue in database:', error);
		}
		return { success: true, data: event };
	},
};

export const issueAssigned: GithubWebhooks['issueAssigned'] = {
	match: createGithubEventMatch('issues', 'assigned'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'assigned') return { success: false, data: undefined };
		console.log('GitHub Issue Assigned:', {
			number: event.issue.number,
			assignee: event.assignee?.login,
			repository: event.repository.full_name,
		});
		try {
			await upsertIssue(ctx, event.issue);
		} catch (error) {
			console.warn('Failed to update issue in database:', error);
		}
		return { success: true, data: event };
	},
};

export const issueUnassigned: GithubWebhooks['issueUnassigned'] = {
	match: createGithubEventMatch('issues', 'unassigned'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'unassigned')
			return { success: false, data: undefined };
		console.log('GitHub Issue Unassigned:', {
			number: event.issue.number,
			repository: event.repository.full_name,
		});
		try {
			await upsertIssue(ctx, event.issue);
		} catch (error) {
			console.warn('Failed to update issue in database:', error);
		}
		return { success: true, data: event };
	},
};

export const issueEdited: GithubWebhooks['issueEdited'] = {
	match: createGithubEventMatch('issues', 'edited'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'edited') return { success: false, data: undefined };
		console.log('GitHub Issue Edited:', {
			number: event.issue.number,
			repository: event.repository.full_name,
		});
		try {
			await upsertIssue(ctx, event.issue);
		} catch (error) {
			console.warn('Failed to update issue in database:', error);
		}
		return { success: true, data: event };
	},
};

export const issueDeleted: GithubWebhooks['issueDeleted'] = {
	match: createGithubEventMatch('issues', 'deleted'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'deleted') return { success: false, data: undefined };
		console.log('GitHub Issue Deleted:', {
			number: event.issue.number,
			repository: event.repository.full_name,
		});
		try {
			await upsertIssue(ctx, event.issue, new Date());
		} catch (error) {
			console.warn('Failed to update issue in database:', error);
		}
		return { success: true, data: event };
	},
};

export const issueTransferred: GithubWebhooks['issueTransferred'] = {
	match: createGithubEventMatch('issues', 'transferred'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'transferred')
			return { success: false, data: undefined };
		console.log('GitHub Issue Transferred:', {
			number: event.issue.number,
			repository: event.repository.full_name,
		});
		try {
			await upsertIssue(ctx, event.issue);
		} catch (error) {
			console.warn('Failed to update issue in database:', error);
		}
		return { success: true, data: event };
	},
};

export const issueLocked: GithubWebhooks['issueLocked'] = {
	match: createGithubEventMatch('issues', 'locked'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'locked') return { success: false, data: undefined };
		console.log('GitHub Issue Locked:', {
			number: event.issue.number,
			repository: event.repository.full_name,
		});
		try {
			await upsertIssue(ctx, event.issue);
		} catch (error) {
			console.warn('Failed to update issue in database:', error);
		}
		return { success: true, data: event };
	},
};

export const issueUnlocked: GithubWebhooks['issueUnlocked'] = {
	match: createGithubEventMatch('issues', 'unlocked'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'unlocked') return { success: false, data: undefined };
		console.log('GitHub Issue Unlocked:', {
			number: event.issue.number,
			repository: event.repository.full_name,
		});
		try {
			await upsertIssue(ctx, event.issue);
		} catch (error) {
			console.warn('Failed to update issue in database:', error);
		}
		return { success: true, data: event };
	},
};

export const issuePinned: GithubWebhooks['issuePinned'] = {
	match: createGithubEventMatch('issues', 'pinned'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'pinned') return { success: false, data: undefined };
		console.log('GitHub Issue Pinned:', {
			number: event.issue.number,
			repository: event.repository.full_name,
		});
		try {
			await upsertIssue(ctx, event.issue);
		} catch (error) {
			console.warn('Failed to update issue in database:', error);
		}
		return { success: true, data: event };
	},
};

export const issueUnpinned: GithubWebhooks['issueUnpinned'] = {
	match: createGithubEventMatch('issues', 'unpinned'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'unpinned') return { success: false, data: undefined };
		console.log('GitHub Issue Unpinned:', {
			number: event.issue.number,
			repository: event.repository.full_name,
		});
		try {
			await upsertIssue(ctx, event.issue);
		} catch (error) {
			console.warn('Failed to update issue in database:', error);
		}
		return { success: true, data: event };
	},
};
