import { logEventFromContext } from '../../utils/events';
import type { SentryEndpoints } from '..';
import type { SentryEndpointOutputs } from './types';
import { makeSentryRequest } from '../client';

export const get: SentryEndpoints['issuesGet'] = async (ctx, input) => {
	const response = await makeSentryRequest<SentryEndpointOutputs['issuesGet']>(
		`issues/${input.issueId}/`,
		ctx.key,
		{ method: 'GET' },
	);

	if (response && ctx.db.issues) {
		try {
			await ctx.db.issues.upsertByEntityId(response.id, {
				...response,
				project: response.project?.slug,
				firstSeen: response.firstSeen ? new Date(response.firstSeen) : null,
				lastSeen: response.lastSeen ? new Date(response.lastSeen) : null,
			});
		} catch (error) {
			console.warn('Failed to save issue to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sentry.issues.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: SentryEndpoints['issuesList'] = async (ctx, input) => {
	const response = await makeSentryRequest<
		SentryEndpointOutputs['issuesList']
	>(
		`projects/${input.organizationSlug}/${input.projectSlug}/issues/`,
		ctx.key,
		{
			method: 'GET',
			query: {
				query: input.query,
				cursor: input.cursor,
			},
		},
	);

	if (response && ctx.db.issues) {
		try {
			for (const issue of response) {
				await ctx.db.issues.upsertByEntityId(issue.id, {
					...issue,
					project: issue.project?.slug,
					firstSeen: issue.firstSeen ? new Date(issue.firstSeen) : null,
					lastSeen: issue.lastSeen ? new Date(issue.lastSeen) : null,
				});
			}
		} catch (error) {
			console.warn('Failed to save issues to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sentry.issues.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: SentryEndpoints['issuesUpdate'] = async (ctx, input) => {
	const { issueId, ...updateData } = input;
	const response = await makeSentryRequest<
		SentryEndpointOutputs['issuesUpdate']
	>(`issues/${issueId}/`, ctx.key, {
		method: 'PUT',
		body: updateData as Record<string, unknown>,
	});

	if (response && ctx.db.issues) {
		try {
			await ctx.db.issues.upsertByEntityId(response.id, {
				...response,
				project: response.project?.slug,
				firstSeen: response.firstSeen ? new Date(response.firstSeen) : null,
				lastSeen: response.lastSeen ? new Date(response.lastSeen) : null,
			});
		} catch (error) {
			console.warn('Failed to update issue in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sentry.issues.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteIssue: SentryEndpoints['issuesDelete'] = async (
	ctx,
	input,
) => {
	await makeSentryRequest<void>(`issues/${input.issueId}/`, ctx.key, {
		method: 'DELETE',
	});

	if (ctx.db.issues) {
		try {
			await ctx.db.issues.deleteByEntityId(input.issueId);
		} catch (error) {
			console.warn('Failed to delete issue from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sentry.issues.delete',
		{ ...input },
		'completed',
	);
	return true;
};
