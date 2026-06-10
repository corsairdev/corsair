import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedZohoRequest, resolveAccountId } from '../client';
import type { ZohoMailEndpoints } from '../index';
import type { ZohoFolder, ZohoResponse } from '../types';
import { zohoEntityId } from '../webhooks/types';

async function syncFolder(
	ctx: Parameters<ZohoMailEndpoints['foldersGet']>[0],
	folder: ZohoFolder,
) {
	const folderId = zohoEntityId(folder.folderId);
	if (!folderId || !ctx.db.folders) return;
	try {
		await ctx.db.folders.upsertByEntityId(folderId, {
			id: folderId,
			folderId,
			folderName: folder.folderName,
			path: folder.path,
			parentFolderId: zohoEntityId(folder.parentFolderId),
			folderType: folder.folderType,
			unreadCount: folder.unreadCount,
			messageCount: folder.messageCount,
			createdAt: new Date(),
		});
	} catch (error) {
		console.warn('Failed to save folder to database:', error);
	}
}

export const list: ZohoMailEndpoints['foldersList'] = async (ctx, input) => {
	const region = ctx.options.region;
	const accountId = await resolveAccountId(ctx, region, input.accountId);

	const res = await makeAuthenticatedZohoRequest<ZohoResponse<ZohoFolder[]>>(
		`/accounts/${accountId}/folders`,
		ctx,
		{ method: 'GET', region },
	);

	const folders = res.data ?? [];

	for (const folder of folders) {
		await syncFolder(ctx, folder);
	}

	await logEventFromContext(
		ctx,
		'zohomail.folders.list',
		{ ...input },
		'completed',
	);
	return { folders };
};

export const get: ZohoMailEndpoints['foldersGet'] = async (ctx, input) => {
	const region = ctx.options.region;
	const accountId = await resolveAccountId(ctx, region, input.accountId);

	const res = await makeAuthenticatedZohoRequest<ZohoResponse<ZohoFolder>>(
		`/accounts/${accountId}/folders/${input.folderId}`,
		ctx,
		{ method: 'GET', region },
	);

	const folder = res.data ?? {};
	await syncFolder(ctx, folder);

	await logEventFromContext(
		ctx,
		'zohomail.folders.get',
		{ ...input },
		'completed',
	);
	return folder;
};

export const create: ZohoMailEndpoints['foldersCreate'] = async (
	ctx,
	input,
) => {
	const region = ctx.options.region;
	const accountId = await resolveAccountId(ctx, region, input.accountId);

	const res = await makeAuthenticatedZohoRequest<ZohoResponse<ZohoFolder>>(
		`/accounts/${accountId}/folders`,
		ctx,
		{
			method: 'POST',
			region,
			body: {
				folderName: input.folderName,
				parentFolderId: input.parentFolderId,
			},
		},
	);

	const folder = res.data ?? {};
	await syncFolder(ctx, folder);

	await logEventFromContext(
		ctx,
		'zohomail.folders.create',
		{ ...input },
		'completed',
	);
	return folder;
};

export const update: ZohoMailEndpoints['foldersUpdate'] = async (
	ctx,
	input,
) => {
	const region = ctx.options.region;
	const accountId = await resolveAccountId(ctx, region, input.accountId);

	// Zoho folder updates take a lowercase-verb `mode`; `rename` also needs the
	// new `folderName`. The endpoint returns only a status (no folder body).
	const body: Record<string, unknown> = { mode: input.mode };
	if (input.folderName) {
		body.folderName = input.folderName;
	}

	await makeAuthenticatedZohoRequest<ZohoResponse<unknown>>(
		`/accounts/${accountId}/folders/${input.folderId}`,
		ctx,
		{ method: 'PUT', region, body },
	);

	await logEventFromContext(
		ctx,
		'zohomail.folders.update',
		{ ...input },
		'completed',
	);
};

export const deleteFolder: ZohoMailEndpoints['foldersDelete'] = async (
	ctx,
	input,
) => {
	const region = ctx.options.region;
	const accountId = await resolveAccountId(ctx, region, input.accountId);

	await makeAuthenticatedZohoRequest<ZohoResponse<unknown>>(
		`/accounts/${accountId}/folders/${input.folderId}`,
		ctx,
		{ method: 'DELETE', region },
	);

	if (ctx.db.folders) {
		try {
			await ctx.db.folders.deleteByEntityId(input.folderId);
		} catch (error) {
			console.warn('Failed to delete folder from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'zohomail.folders.delete',
		{ ...input },
		'completed',
	);
};
