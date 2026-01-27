import { logEventFromContext } from '../../utils/events';
import type { ResendEndpoints } from '..';
import { makeResendRequest } from '../client';
import type { ResendEndpointOutputs } from './types';

export const create: ResendEndpoints['domainsCreate'] = async (ctx, input) => {
	const body: Record<string, unknown> = {
		name: input.name,
	};
	if (input.region) body.region = input.region;

	const response = await makeResendRequest<
		ResendEndpointOutputs['domainsCreate']
	>('domains', ctx.options.credentials.apiKey, {
		method: 'POST',
		body,
	});

	if (ctx.db.domains && response.id) {
		try {
			await ctx.db.domains.upsert(response.id, {
				id: response.id,
				name: response.name,
				status: response.status,
				created_at: response.created_at,
				region: response.region,
			});
		} catch (error) {
			console.warn('Failed to save domain to database:', error);
		}
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
		ctx.options.credentials.apiKey,
		{
			method: 'GET',
		},
	);

	if (ctx.db.domains && response.id) {
		try {
			await ctx.db.domains.upsert(response.id, {
				id: response.id,
				name: response.name,
				status: response.status,
				created_at: response.created_at,
				region: response.region,
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
	>('domains', ctx.options.credentials.apiKey, {
		method: 'GET',
		query,
	});

	if (ctx.db.domains && response.data) {
		try {
			for (const domain of response.data) {
				await ctx.db.domains.upsert(domain.id, {
					id: domain.id,
					name: domain.name,
					status: domain.status,
					created_at: domain.created_at,
					region: domain.region,
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
	>(`domains/${input.id}`, ctx.options.credentials.apiKey, {
		method: 'DELETE',
	});

	if (ctx.db.domains && response.deleted) {
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
	>(`domains/${input.id}/verify`, ctx.options.credentials.apiKey, {
		method: 'POST',
	});

	if (ctx.db.domains && response.id) {
		try {
			await ctx.db.domains.upsert(response.id, {
				id: response.id,
				name: response.name,
				status: response.status,
				created_at: response.created_at,
				region: response.region,
			});
		} catch (error) {
			console.warn('Failed to update domain in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'resend.domains.verify',
		{ ...input },
		'completed',
	);
	return response;
};
