import { logEventFromContext } from '../../utils/events';
import type { ResendBoundEndpoints, ResendEndpoints } from '..';
import { makeResendRequest } from '../client';
import type { ResendEndpointOutputs } from './types';

export const create: ResendEndpoints['domainsCreate'] = async (ctx, input) => {
	const body: Record<string, unknown> = {
		name: input.name,
	};
	if (input.region) body.region = input.region;

	const response = await makeResendRequest<
		ResendEndpointOutputs['domainsCreate']
	>('domains', ctx.key, {
		method: 'POST',
		body,
	});

	if (response.id) {
		const endpoints = ctx.endpoints as ResendBoundEndpoints;
		await endpoints.domainsGet({ id: response.id });
	}

	await logEventFromContext(
		ctx,
		'resend.domains.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: ResendEndpoints['domainsGet'] = async (ctx, input) => {
	const response = await makeResendRequest<ResendEndpointOutputs['domainsGet']>(
		`domains/${input.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	if (response.id && ctx.db.domains) {
		try {
			await ctx.db.domains.upsert(response.id, {
				...response,
			});
		} catch (error) {
			console.warn('Failed to save domain to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'resend.domains.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: ResendEndpoints['domainsList'] = async (ctx, input) => {
	const query: Record<string, string | number | undefined> = {};
	if (input?.limit) query.limit = input.limit;
	if (input?.cursor) query.cursor = input.cursor;

	const response = await makeResendRequest<
		ResendEndpointOutputs['domainsList']
	>('domains', ctx.key, {
		method: 'GET',
		query,
	});

	if (response.data && ctx.db.domains) {
		try {
			for (const domain of response.data) {
				await ctx.db.domains.upsert(domain.id, {
					...domain,
				});
			}
		} catch (error) {
			console.warn('Failed to save domains to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'resend.domains.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteDomain: ResendEndpoints['domainsDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeResendRequest<
		ResendEndpointOutputs['domainsDelete']
	>(`domains/${input.id}`, ctx.key, {
		method: 'DELETE',
	});

	if (response.deleted && ctx.db.domains) {
		try {
			await ctx.db.domains.deleteByEntityId(input.id);
		} catch (error) {
			console.warn('Failed to delete domain from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'resend.domains.delete',
		{ ...input },
		'completed',
	);
	return response;
};

export const verify: ResendEndpoints['domainsVerify'] = async (ctx, input) => {
	const response = await makeResendRequest<
		ResendEndpointOutputs['domainsVerify']
	>(`domains/${input.id}/verify`, ctx.key, {
		method: 'POST',
	});

	if (response.id) {
		const endpoints = ctx.endpoints as ResendBoundEndpoints;
		await endpoints.domainsGet({ id: response.id });
	}

	await logEventFromContext(
		ctx,
		'resend.domains.verify',
		{ ...input },
		'completed',
	);
	return response;
};
