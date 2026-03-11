import { logEventFromContext } from '../../utils/events';
import type { SentryEndpoints } from '..';
import type { SentryEndpointOutputs } from './types';
import { makeSentryRequest } from '../client';

export const get: SentryEndpoints['releasesGet'] = async (ctx, input) => {
	const response = await makeSentryRequest<
		SentryEndpointOutputs['releasesGet']
	>(
		`organizations/${input.organizationSlug}/releases/${encodeURIComponent(input.version)}/`,
		ctx.key,
		{ method: 'GET' },
	);

	if (response && ctx.db.releases) {
		try {
			await ctx.db.releases.upsertByEntityId(String(response.id), {
				...response,
				dateCreated: response.dateCreated
					? new Date(response.dateCreated)
					: null,
				dateReleased: response.dateReleased
					? new Date(response.dateReleased)
					: null,
				firstEvent: response.firstEvent
					? new Date(response.firstEvent)
					: null,
				lastEvent: response.lastEvent ? new Date(response.lastEvent) : null,
			});
		} catch (error) {
			console.warn('Failed to save release to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sentry.releases.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: SentryEndpoints['releasesList'] = async (ctx, input) => {
	const response = await makeSentryRequest<
		SentryEndpointOutputs['releasesList']
	>(`organizations/${input.organizationSlug}/releases/`, ctx.key, {
		method: 'GET',
		query: {
			query: input.query,
			cursor: input.cursor,
		},
	});

	await logEventFromContext(
		ctx,
		'sentry.releases.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: SentryEndpoints['releasesCreate'] = async (
	ctx,
	input,
) => {
	const { organizationSlug, ...createData } = input;
	const response = await makeSentryRequest<
		SentryEndpointOutputs['releasesCreate']
	>(`organizations/${organizationSlug}/releases/`, ctx.key, {
		method: 'POST',
		body: createData as Record<string, unknown>,
	});

	if (response && ctx.db.releases) {
		try {
			await ctx.db.releases.upsertByEntityId(String(response.id), {
				...response,
				dateCreated: response.dateCreated
					? new Date(response.dateCreated)
					: null,
				dateReleased: response.dateReleased
					? new Date(response.dateReleased)
					: null,
				firstEvent: response.firstEvent
					? new Date(response.firstEvent)
					: null,
				lastEvent: response.lastEvent ? new Date(response.lastEvent) : null,
			});
		} catch (error) {
			console.warn('Failed to save release to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sentry.releases.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: SentryEndpoints['releasesUpdate'] = async (
	ctx,
	input,
) => {
	const { organizationSlug, version, ...updateData } = input;
	const response = await makeSentryRequest<
		SentryEndpointOutputs['releasesUpdate']
	>(
		`organizations/${organizationSlug}/releases/${encodeURIComponent(version)}/`,
		ctx.key,
		{
			method: 'PUT',
			body: updateData as Record<string, unknown>,
		},
	);

	if (response && ctx.db.releases) {
		try {
			await ctx.db.releases.upsertByEntityId(String(response.id), {
				...response,
				dateCreated: response.dateCreated
					? new Date(response.dateCreated)
					: null,
				dateReleased: response.dateReleased
					? new Date(response.dateReleased)
					: null,
				firstEvent: response.firstEvent
					? new Date(response.firstEvent)
					: null,
				lastEvent: response.lastEvent ? new Date(response.lastEvent) : null,
			});
		} catch (error) {
			console.warn('Failed to update release in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sentry.releases.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteRelease: SentryEndpoints['releasesDelete'] = async (
	ctx,
	input,
) => {
	await makeSentryRequest<void>(
		`organizations/${input.organizationSlug}/releases/${encodeURIComponent(input.version)}/`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'sentry.releases.delete',
		{ ...input },
		'completed',
	);
	return true;
};
