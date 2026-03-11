import { logEventFromContext } from '../../utils/events';
import type { SentryEndpoints } from '..';
import type { SentryEndpointOutputs } from './types';
import { makeSentryRequest } from '../client';

export const get: SentryEndpoints['organizationsGet'] = async (ctx, input) => {
	const response = await makeSentryRequest<
		SentryEndpointOutputs['organizationsGet']
	>(`organizations/${input.organizationSlug}/`, ctx.key, {
		method: 'GET',
	});

	if (response && ctx.db.organizations) {
		try {
			await ctx.db.organizations.upsertByEntityId(response.id, {
				...response,
				status:
					response.status && typeof response.status === 'object'
						? response.status.name
						: null,
				dateCreated: response.dateCreated
					? new Date(response.dateCreated)
					: null,
			});
		} catch (error) {
			console.warn('Failed to save organization to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sentry.organizations.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: SentryEndpoints['organizationsList'] = async (
	ctx,
	input,
) => {
	const response = await makeSentryRequest<
		SentryEndpointOutputs['organizationsList']
	>('organizations/', ctx.key, {
		method: 'GET',
		query: {
			cursor: input.cursor,
		},
	});

	await logEventFromContext(
		ctx,
		'sentry.organizations.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: SentryEndpoints['organizationsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeSentryRequest<
		SentryEndpointOutputs['organizationsCreate']
	>('organizations/', ctx.key, {
		method: 'POST',
		body: input as Record<string, unknown>,
	});

	if (response && ctx.db.organizations) {
		try {
			await ctx.db.organizations.upsertByEntityId(response.id, {
				...response,
				status:
					response.status && typeof response.status === 'object'
						? response.status.name
						: null,
				dateCreated: response.dateCreated
					? new Date(response.dateCreated)
					: null,
			});
		} catch (error) {
			console.warn('Failed to save organization to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sentry.organizations.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: SentryEndpoints['organizationsUpdate'] = async (
	ctx,
	input,
) => {
	const { organizationSlug, ...updateData } = input;
	const response = await makeSentryRequest<
		SentryEndpointOutputs['organizationsUpdate']
	>(`organizations/${organizationSlug}/`, ctx.key, {
		method: 'PUT',
		body: updateData as Record<string, unknown>,
	});

	if (response && ctx.db.organizations) {
		try {
			await ctx.db.organizations.upsertByEntityId(response.id, {
				...response,
				status:
					response.status && typeof response.status === 'object'
						? response.status.name
						: null,
				dateCreated: response.dateCreated
					? new Date(response.dateCreated)
					: null,
			});
		} catch (error) {
			console.warn('Failed to update organization in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sentry.organizations.update',
		{ ...input },
		'completed',
	);
	return response;
};
