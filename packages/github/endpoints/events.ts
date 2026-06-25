import { logEventFromContext } from 'corsair/core';
import { makeGithubRequest } from '../client';
import type { GithubEndpoints } from '../index';
import type { GithubEvent } from '../schema/database';
import { convertKeysToCamelCase } from '../utils';
import type { EventsListResponse } from './types';

type EventMetadata = {
	source: GithubEvent['source'];
	repositoryFullName?: string;
	organization?: string;
	username?: string;
	networkRepositoryFullName?: string;
};

function normalizeEvent(
	event: EventsListResponse[number],
	metadata: EventMetadata,
): GithubEvent {
	const normalized = convertKeysToCamelCase(event) as GithubEvent;

	return {
		...normalized,
		id: String(normalized.id),
		source: metadata.source,
		repositoryFullName:
			metadata.repositoryFullName ?? normalized.repo?.name ?? undefined,
		organization: metadata.organization,
		username: metadata.username,
		networkRepositoryFullName: metadata.networkRepositoryFullName,
		createdAt: normalized.createdAt ? new Date(normalized.createdAt) : null,
	};
}

async function saveEvents(
	ctx: Parameters<GithubEndpoints['eventsList']>[0],
	result: EventsListResponse | undefined,
	metadata: EventMetadata,
) {
	if (!result || !ctx.db.events) {
		return;
	}

	try {
		for (const event of result) {
			await ctx.db.events.upsertByEntityId(
				event.id,
				normalizeEvent(event, metadata),
			);
		}
	} catch (error) {
		console.warn('Failed to save events to database:', error);
	}
}

export const list: GithubEndpoints['eventsList'] = async (ctx, input) => {
	const result = await makeGithubRequest<EventsListResponse>('/events', ctx, {
		query: input,
	});

	await saveEvents(ctx, result, { source: 'public' });

	await logEventFromContext(ctx, 'github.events.list', { ...input }, 'completed');
	return result;
};

export const listForNetwork: GithubEndpoints['eventsListForNetwork'] = async (
	ctx,
	input,
) => {
	const { owner, repo, ...queryParams } = input;
	const endpoint = `/networks/${owner}/${repo}/events`;
	const result = await makeGithubRequest<EventsListResponse>(endpoint, ctx, {
		query: queryParams,
	});

	await saveEvents(ctx, result, {
		source: 'network',
		networkRepositoryFullName: `${owner}/${repo}`,
	});

	await logEventFromContext(
		ctx,
		'github.events.listForNetwork',
		{ ...input },
		'completed',
	);
	return result;
};

export const listForOrg: GithubEndpoints['eventsListForOrg'] = async (
	ctx,
	input,
) => {
	const { org, ...queryParams } = input;
	const endpoint = `/orgs/${org}/events`;
	const result = await makeGithubRequest<EventsListResponse>(endpoint, ctx, {
		query: queryParams,
	});

	await saveEvents(ctx, result, {
		source: 'organization',
		organization: org,
	});

	await logEventFromContext(
		ctx,
		'github.events.listForOrg',
		{ ...input },
		'completed',
	);
	return result;
};

export const listForRepository: GithubEndpoints['eventsListForRepository'] =
	async (ctx, input) => {
		const { owner, repo, ...queryParams } = input;
		const endpoint = `/repos/${owner}/${repo}/events`;
		const result = await makeGithubRequest<EventsListResponse>(
			endpoint,
			ctx,
			{ query: queryParams },
		);

		await saveEvents(ctx, result, {
			source: 'repository',
			repositoryFullName: `${owner}/${repo}`,
		});

		await logEventFromContext(
			ctx,
			'github.events.listForRepository',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listForUser: GithubEndpoints['eventsListForUser'] = async (
	ctx,
	input,
) => {
	const { username, ...queryParams } = input;
	const endpoint = `/users/${username}/events`;
	const result = await makeGithubRequest<EventsListResponse>(endpoint, ctx, {
		query: queryParams,
	});

	await saveEvents(ctx, result, {
		source: 'user',
		username,
	});

	await logEventFromContext(
		ctx,
		'github.events.listForUser',
		{ ...input },
		'completed',
	);
	return result;
};

export const listForUserOrg: GithubEndpoints['eventsListForUserOrg'] = async (
	ctx,
	input,
) => {
	const { username, org, ...queryParams } = input;
	const endpoint = `/users/${username}/events/orgs/${org}`;
	const result = await makeGithubRequest<EventsListResponse>(endpoint, ctx, {
		query: queryParams,
	});

	await saveEvents(ctx, result, {
		source: 'userOrganization',
		username,
		organization: org,
	});

	await logEventFromContext(
		ctx,
		'github.events.listForUserOrg',
		{ ...input },
		'completed',
	);
	return result;
};

export const listPublicForUser: GithubEndpoints['eventsListPublicForUser'] =
	async (ctx, input) => {
		const { username, ...queryParams } = input;
		const endpoint = `/users/${username}/events/public`;
		const result = await makeGithubRequest<EventsListResponse>(
			endpoint,
			ctx,
			{ query: queryParams },
		);

		await saveEvents(ctx, result, {
			source: 'userPublic',
			username,
		});

		await logEventFromContext(
			ctx,
			'github.events.listPublicForUser',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listReceivedForUser: GithubEndpoints['eventsListReceivedForUser'] =
	async (ctx, input) => {
		const { username, ...queryParams } = input;
		const endpoint = `/users/${username}/received_events`;
		const result = await makeGithubRequest<EventsListResponse>(
			endpoint,
			ctx,
			{ query: queryParams },
		);

		await saveEvents(ctx, result, {
			source: 'received',
			username,
		});

		await logEventFromContext(
			ctx,
			'github.events.listReceivedForUser',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listPublicReceivedForUser: GithubEndpoints['eventsListPublicReceivedForUser'] =
	async (ctx, input) => {
		const { username, ...queryParams } = input;
		const endpoint = `/users/${username}/received_events/public`;
		const result = await makeGithubRequest<EventsListResponse>(
			endpoint,
			ctx,
			{ query: queryParams },
		);

		await saveEvents(ctx, result, {
			source: 'receivedPublic',
			username,
		});

		await logEventFromContext(
			ctx,
			'github.events.listPublicReceivedForUser',
			{ ...input },
			'completed',
		);
		return result;
	};
