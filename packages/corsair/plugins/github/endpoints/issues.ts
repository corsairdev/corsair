import { logEventFromContext } from '../../utils/events';
import type { GithubEndpoints } from '..';
import { makeGithubRequest } from '../client';
import type {
	IssueCommentCreateResponse,
	IssueCreateResponse,
	IssueGetResponse,
	IssuesListResponse,
	IssueUpdateResponse,
} from './types';

export const list: GithubEndpoints['issuesList'] = async (ctx, input) => {
	const { owner, repo, ...queryParams } = input;
	const endpoint = repo
		? `/repos/${owner}/${repo}/issues`
		: '/user/issues';
	const result = await makeGithubRequest<IssuesListResponse>(
		endpoint,
		ctx.options.token,
		{ query: queryParams },
	);

	if (result && ctx.db.issues) {
		try {
			for (const issue of result) {
				await ctx.db.issues.upsert(issue.id.toString(), {
					id: issue.id,
					nodeId: issue.nodeId,
					url: issue.url,
					repositoryUrl: issue.repositoryUrl,
					labelsUrl: issue.labelsUrl,
					commentsUrl: issue.commentsUrl,
					eventsUrl: issue.eventsUrl,
					htmlUrl: issue.htmlUrl,
					number: issue.number,
					state: issue.state,
					stateReason: issue.stateReason,
					title: issue.title,
					body: issue.body,
					locked: issue.locked,
					comments: issue.comments,
					createdAt: new Date(issue.createdAt),
					updatedAt: new Date(issue.updatedAt),
					closedAt: issue.closedAt ? new Date(issue.closedAt) : null,
				});
			}
		} catch (error) {
			console.warn('Failed to save issues to database:', error);
		}
	}

	await logEventFromContext(ctx, 'github.issues.list', { ...input }, 'completed');
	return result;
};

export const get: GithubEndpoints['issuesGet'] = async (ctx, input) => {
	const { owner, repo, issueNumber } = input;
	const endpoint = `/repos/${owner}/${repo}/issues/${issueNumber}`;
	const result = await makeGithubRequest<IssueGetResponse>(
		endpoint,
		ctx.options.token,
	);

	if (result && ctx.db.issues) {
		try {
			await ctx.db.issues.upsert(result.id.toString(), {
				id: result.id,
				nodeId: result.nodeId,
				url: result.url,
				repositoryUrl: result.repositoryUrl,
				labelsUrl: result.labelsUrl,
				commentsUrl: result.commentsUrl,
				eventsUrl: result.eventsUrl,
				htmlUrl: result.htmlUrl,
				number: result.number,
				state: result.state,
				stateReason: result.stateReason,
				title: result.title,
				body: result.body,
				locked: result.locked,
				comments: result.comments,
				createdAt: new Date(result.createdAt),
				updatedAt: new Date(result.updatedAt),
				closedAt: result.closedAt ? new Date(result.closedAt) : null,
			});
		} catch (error) {
			console.warn('Failed to save issue to database:', error);
		}
	}

	await logEventFromContext(ctx, 'github.issues.get', { ...input }, 'completed');
	return result;
};

export const create: GithubEndpoints['issuesCreate'] = async (ctx, input) => {
	const { owner, repo, ...body } = input;
	const endpoint = `/repos/${owner}/${repo}/issues`;
	const result = await makeGithubRequest<IssueCreateResponse>(
		endpoint,
		ctx.options.token,
		{ method: 'POST', body },
	);

	if (result && ctx.db.issues) {
		try {
			await ctx.db.issues.upsert(result.id.toString(), {
				id: result.id,
				nodeId: result.nodeId,
				url: result.url,
				repositoryUrl: result.repositoryUrl,
				labelsUrl: result.labelsUrl,
				commentsUrl: result.commentsUrl,
				eventsUrl: result.eventsUrl,
				htmlUrl: result.htmlUrl,
				number: result.number,
				state: result.state,
				stateReason: result.stateReason,
				title: result.title,
				body: result.body,
				locked: result.locked,
				comments: result.comments,
				createdAt: new Date(result.createdAt),
				updatedAt: new Date(result.updatedAt),
				closedAt: result.closedAt ? new Date(result.closedAt) : null,
			});
		} catch (error) {
			console.warn('Failed to save issue to database:', error);
		}
	}

	await logEventFromContext(ctx, 'github.issues.create', { ...input }, 'completed');
	return result;
};

export const update: GithubEndpoints['issuesUpdate'] = async (ctx, input) => {
	const { owner, repo, issueNumber, ...body } = input;
	const endpoint = `/repos/${owner}/${repo}/issues/${issueNumber}`;
	const result = await makeGithubRequest<IssueUpdateResponse>(
		endpoint,
		ctx.options.token,
		{ method: 'PATCH', body },
	);

	if (result && ctx.db.issues) {
		try {
			await ctx.db.issues.upsert(result.id.toString(), {
				id: result.id,
				nodeId: result.nodeId,
				url: result.url,
				repositoryUrl: result.repositoryUrl,
				labelsUrl: result.labelsUrl,
				commentsUrl: result.commentsUrl,
				eventsUrl: result.eventsUrl,
				htmlUrl: result.htmlUrl,
				number: result.number,
				state: result.state,
				stateReason: result.stateReason,
				title: result.title,
				body: result.body,
				locked: result.locked,
				comments: result.comments,
				createdAt: new Date(result.createdAt),
				updatedAt: new Date(result.updatedAt),
				closedAt: result.closedAt ? new Date(result.closedAt) : null,
			});
		} catch (error) {
			console.warn('Failed to update issue in database:', error);
		}
	}

	await logEventFromContext(ctx, 'github.issues.update', { ...input }, 'completed');
	return result;
};

export const createComment: GithubEndpoints['issuesCreateComment'] = async (
	ctx,
	input,
) => {
	const { owner, repo, issueNumber, body } = input;
	const endpoint = `/repos/${owner}/${repo}/issues/${issueNumber}/comments`;
	const result = await makeGithubRequest<IssueCommentCreateResponse>(
		endpoint,
		ctx.options.token,
		{ method: 'POST', body: { body } },
	);

	await logEventFromContext(
		ctx,
		'github.issues.createComment',
		{ ...input },
		'completed',
	);
	return result;
};
