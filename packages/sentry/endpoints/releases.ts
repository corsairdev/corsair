import { logEventFromContext } from 'corsair/core';
import { makeSentryRequest } from '../client';
import type { SentryEndpoints } from '../index';
import type { SentryEndpointOutputs } from './types';

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
				firstEvent: response.firstEvent ? new Date(response.firstEvent) : null,
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

	if (response && ctx.db.releases) {
		try {
			for (const release of response) {
				await ctx.db.releases.upsertByEntityId(String(release.id), {
					...release,
					dateCreated: release.dateCreated
						? new Date(release.dateCreated)
						: null,
					dateReleased: release.dateReleased
						? new Date(release.dateReleased)
						: null,
					firstEvent: release.firstEvent ? new Date(release.firstEvent) : null,
					lastEvent: release.lastEvent ? new Date(release.lastEvent) : null,
				});
			}
		} catch (error) {
			console.warn('Failed to save releases to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sentry.releases.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: SentryEndpoints['releasesCreate'] = async (ctx, input) => {
	const { organizationSlug, ...createData } = input;
	const response = await makeSentryRequest<
		SentryEndpointOutputs['releasesCreate']
	>(`organizations/${organizationSlug}/releases/`, ctx.key, {
		method: 'POST',
		body: createData,
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
				firstEvent: response.firstEvent ? new Date(response.firstEvent) : null,
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

export const update: SentryEndpoints['releasesUpdate'] = async (ctx, input) => {
	const { organizationSlug, version, ...updateData } = input;
	const response = await makeSentryRequest<
		SentryEndpointOutputs['releasesUpdate']
	>(
		`organizations/${organizationSlug}/releases/${encodeURIComponent(version)}/`,
		ctx.key,
		{
			method: 'PUT',
			body: updateData,
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
				firstEvent: response.firstEvent ? new Date(response.firstEvent) : null,
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

	if (ctx.db.releases) {
		try {
			const entities = await ctx.db.releases.search({
				data: { version: input.version },
			});
			for (const entity of entities) {
				await ctx.db.releases.deleteByEntityId(entity.entity_id);
			}
		} catch (error) {
			console.warn('Failed to delete release from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sentry.releases.delete',
		{ ...input },
		'completed',
	);
	return true;
};
