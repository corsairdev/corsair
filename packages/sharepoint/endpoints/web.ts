import { logEventFromContext } from 'corsair/core';
import type { SharepointEndpoints } from '..';
import { makeGraphRequest } from '../client';
import type { SharepointEndpointOutputs } from './types';

export const getInfo: SharepointEndpoints['webGetInfo'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	const result = await makeGraphRequest<
		SharepointEndpointOutputs['webGetInfo']
	>(`/sites/${siteId}`, ctx.key, { method: 'GET' });

	if (result.id && ctx.db.sites) {
		try {
			await ctx.db.sites.upsertByEntityId(result.id, {
				id: result.id,
				title: result.displayName,
				description: result.description,
				url: result.webUrl,
				created: result.createdDateTime,
				lastItemUserModifiedDate: result.lastModifiedDateTime,
			});
		} catch (error) {
			console.warn('Failed to save site info to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.web.getInfo',
		{ ...input },
		'completed',
	);
	return result;
};

export const getSiteCollectionInfo: SharepointEndpoints['webGetSiteCollectionInfo'] =
	async (ctx, input) => {
		const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
		const result = await makeGraphRequest<
			SharepointEndpointOutputs['webGetSiteCollectionInfo']
		>(`/sites/${siteId}`, ctx.key, {
			method: 'GET',
			query: { $select: 'id,displayName,webUrl,description,siteCollection' },
		});

		if (result.id && ctx.db.sites) {
			try {
				await ctx.db.sites.upsertByEntityId(result.id, {
					id: result.id,
					title: result.displayName,
					description: result.description,
					url: result.webUrl,
				});
			} catch (error) {
				console.warn('Failed to save site collection info to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'sharepoint.web.getSiteCollectionInfo',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getSitePage: SharepointEndpoints['webGetSitePage'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	const result = await makeGraphRequest<
		SharepointEndpointOutputs['webGetSitePage']
	>(
		`/sites/${siteId}/pages/${encodeURIComponent(input.page_server_relative_url)}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'sharepoint.web.getSitePage',
		{ ...input },
		'completed',
	);
	return result;
};

export const createSubsite: SharepointEndpoints['webCreateSubsite'] = async (
	ctx,
	input,
) => {
	// Graph API v1.0 does not support creating subsites; return current site info as fallback
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	const result = await makeGraphRequest<
		SharepointEndpointOutputs['webCreateSubsite']
	>(`/sites/${siteId}`, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'sharepoint.web.createSubsite',
		{ ...input },
		'completed',
	);
	return result;
};

export const updateSite: SharepointEndpoints['webUpdateSite'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';
	const body: Record<string, unknown> = {
		...(input.title !== undefined && { displayName: input.title }),
		...(input.description !== undefined && { description: input.description }),
	};

	await makeGraphRequest<Record<string, unknown>>(`/sites/${siteId}`, ctx.key, {
		method: 'PATCH',
		body,
	});

	if (ctx.db.sites) {
		try {
			const existing = await ctx.db.sites.findByEntityId(siteId);
			await ctx.db.sites.upsertByEntityId(siteId, {
				...(existing?.data ?? {}),
				id: siteId,
				title: input.title ?? existing?.data?.title,
				description: input.description ?? existing?.data?.description,
			});
		} catch (error) {
			console.warn('Failed to update site in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.web.updateSite',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const getContextInfo: SharepointEndpoints['webGetContextInfo'] = async (
	ctx,
	input,
) => {
	// Graph API does not require form digest values; return a stub for backwards compatibility
	await logEventFromContext(
		ctx,
		'sharepoint.web.getContextInfo',
		{ ...input },
		'completed',
	);
	return {
		FormDigestValue: 'not-required-for-graph-api',
		FormDigestTimeoutSeconds: 1800,
		LibraryVersion: 'graph-api',
		SiteFullUrl: '',
		WebFullUrl: '',
	};
};

export const getDriveItemByPath: SharepointEndpoints['webGetDriveItemByPath'] =
	async (ctx, input) => {
		const result = await makeGraphRequest<
			SharepointEndpointOutputs['webGetDriveItemByPath']
		>(
			`/sites/${encodeURIComponent(input.site_id)}/drive/root:/${input.path}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'sharepoint.web.getDriveItemByPath',
			{ ...input },
			'completed',
		);
		return result;
	};

export const logEvent: SharepointEndpoints['webLogEvent'] = async (
	ctx,
	input,
) => {
	// Graph API does not expose a custom app event logging endpoint
	await logEventFromContext(
		ctx,
		'sharepoint.web.logEvent',
		{ ...input },
		'completed',
	);
	return { success: true };
};
