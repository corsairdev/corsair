import { logEventFromContext } from '../../utils/events';
import type { OnedriveEndpoints } from '..';
import { makeOnedriveRequest } from '../client';
import type { OnedriveEndpointOutputs } from './types';

export const createFolder: OnedriveEndpoints['filesCreateFolder'] = async (ctx, input) => {
	const { name, user_id, description, parent_folder } = input;

	const body: Record<string, unknown> = {
		name,
		folder: {},
		'@microsoft.graph.conflictBehavior': 'rename',
	};
	if (description) body.description = description;

	let url: string;
	if (parent_folder) {
		url = user_id
			? `users/${user_id}/drive/items/${parent_folder}/children`
			: `me/drive/items/${parent_folder}/children`;
	} else {
		url = user_id
			? `users/${user_id}/drive/root/children`
			: 'me/drive/root/children';
	}

	const result = await makeOnedriveRequest<OnedriveEndpointOutputs['filesCreateFolder']>(
		url,
		ctx.key,
		{ method: 'POST', body },
	);

	if (result.id && ctx.db.driveItems) {
		try {
			// any/unknown cast: upsert requires the full DB schema shape; response may have optional required fields
			await ctx.db.driveItems.upsertByEntityId(result.id, result as Parameters<typeof ctx.db.driveItems.upsertByEntityId>[1]);
		} catch (error) {
			console.warn('Failed to save created folder to database:', error);
		}
	}

	await logEventFromContext(ctx, 'onedrive.files.createFolder', { name }, 'completed');
	return result;
};

export const createTextFile: OnedriveEndpoints['filesCreateTextFile'] = async (ctx, input) => {
	const { name, content, folder, user_id, conflict_behavior } = input;

	let url: string;
	if (folder) {
		url = user_id
			? `users/${user_id}/drive/root:/${folder}/${name}:/content`
			: `me/drive/root:/${folder}/${name}:/content`;
	} else {
		url = user_id
			? `users/${user_id}/drive/root:/${name}:/content`
			: `me/drive/root:/${name}:/content`;
	}

	const query: Record<string, string | undefined> = {};
	if (conflict_behavior) query['@microsoft.graph.conflictBehavior'] = conflict_behavior;

	// Content is sent as raw string body for text files
	const result = await makeOnedriveRequest<OnedriveEndpointOutputs['filesCreateTextFile']>(
		url,
		ctx.key,
		{ method: 'PUT', body: content as unknown as Record<string, unknown>, query },
	);

	if (result.id && ctx.db.driveItems) {
		try {
			// any/unknown cast: upsert requires the full DB schema shape; response may have optional required fields
			await ctx.db.driveItems.upsertByEntityId(result.id, result as Parameters<typeof ctx.db.driveItems.upsertByEntityId>[1]);
		} catch (error) {
			console.warn('Failed to save created text file to database:', error);
		}
	}

	await logEventFromContext(ctx, 'onedrive.files.createTextFile', { name }, 'completed');
	return result;
};

export const findFile: OnedriveEndpoints['filesFindFile'] = async (ctx, input) => {
	const { name, user_id } = input;

	const query: Record<string, string | undefined> = {
		'$filter': 'file ne null',
	};

	const searchUrl = user_id
		? `users/${user_id}/drive/root/search(q='${encodeURIComponent(name)}')`
		: `me/drive/root/search(q='${encodeURIComponent(name)}')`;

	const result = await makeOnedriveRequest<{ value: Array<Record<string, unknown>>; '@odata.context'?: string }>(
		searchUrl,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(ctx, 'onedrive.files.findFile', { name }, 'completed');
	return {
		value: result.value ?? [],
		odata_context: result['@odata.context'],
	};
};

export const findFolder: OnedriveEndpoints['filesFindFolder'] = async (ctx, input) => {
	const { name, top, expand, folder, select, orderby, user_id, skip_token } = input;

	const query: Record<string, string | number | undefined> = {
		'$filter': 'folder ne null',
	};
	if (top !== undefined) query['$top'] = top;
	if (expand) query['$expand'] = expand;
	if (select?.length) query['$select'] = select.join(',');
	if (orderby) query['$orderby'] = orderby;
	if (skip_token) query['$skiptoken'] = skip_token;

	let url: string;
	if (name) {
		url = user_id
			? `users/${user_id}/drive/root/search(q='${encodeURIComponent(name)}')`
			: `me/drive/root/search(q='${encodeURIComponent(name)}')`;
	} else if (folder) {
		url = user_id
			? `users/${user_id}/drive/items/${folder}/children`
			: `me/drive/items/${folder}/children`;
	} else {
		url = user_id
			? `users/${user_id}/drive/root/children`
			: 'me/drive/root/children';
	}

	const result = await makeOnedriveRequest<OnedriveEndpointOutputs['filesFindFolder']>(
		url,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(ctx, 'onedrive.files.findFolder', { name }, 'completed');
	return result;
};

export const list: OnedriveEndpoints['filesList'] = async (ctx, input) => {
	const { top, select, user_id } = input;

	const query: Record<string, string | number | undefined> = {};
	if (top !== undefined) query['$top'] = top;
	if (select?.length) query['$select'] = select.join(',');

	const url = user_id
		? `users/${user_id}/drive/root/children`
		: 'me/drive/root/children';

	const result = await makeOnedriveRequest<OnedriveEndpointOutputs['filesList']>(
		url,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(ctx, 'onedrive.files.list', {}, 'completed');
	return result;
};

export const upload: OnedriveEndpoints['filesUpload'] = async (ctx, input) => {
	const {
		file,
		folder,
		user_id,
		conflict_behavior,
		file_system_info,
	} = input;

	// Build the OneDrive upload path
	let url: string;
	if (folder) {
		url = user_id
			? `users/${user_id}/drive/root:/${folder}/${file.name}:/content`
			: `me/drive/root:/${folder}/${file.name}:/content`;
	} else {
		url = user_id
			? `users/${user_id}/drive/root:/${file.name}:/content`
			: `me/drive/root:/${file.name}:/content`;
	}

	const query: Record<string, string | undefined> = {};
	if (conflict_behavior) query['@microsoft.graph.conflictBehavior'] = conflict_behavior;

	// Fetch the file content from the S3 presigned URL using the s3key
	const s3Response = await fetch(file.s3key);
	// any/unknown for s3 response body since it's raw binary data from presigned URL
	const fileContent = await s3Response.arrayBuffer();

	// Upload the file content to OneDrive
	const result = await makeOnedriveRequest<OnedriveEndpointOutputs['filesUpload']>(
		url,
		ctx.key,
		{
			method: 'PUT',
			// any/unknown for fileContent cast since binary data needs to be treated as body
			body: fileContent as unknown as Record<string, unknown>,
			query,
		},
	);

	if (result.id && ctx.db.driveItems) {
		try {
			const itemData: Record<string, unknown> = { ...result };
			if (file_system_info) itemData.fileSystemInfo = file_system_info;
			// any/unknown cast: upsert requires the full DB schema shape; upload result may have optional required fields
			await ctx.db.driveItems.upsertByEntityId(result.id, itemData as Parameters<typeof ctx.db.driveItems.upsertByEntityId>[1]);
		} catch (error) {
			console.warn('Failed to save uploaded file to database:', error);
		}
	}

	await logEventFromContext(ctx, 'onedrive.files.upload', { name: file.name }, 'completed');
	return result;
};
