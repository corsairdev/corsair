import { logEventFromContext } from 'corsair/core';
import { makeFilevineRequest } from '../client';
import type { FilevineEndpoints } from '../index';
import type { FilevineEndpointOutputs } from './types';
import {
	GetDocumentResponseSchema,
	ListProjectDocumentsResponseSchema,
	UploadProjectDocumentResponseSchema,
} from './types';

export const list: FilevineEndpoints['listProjectDocuments'] = async (
	ctx,
	input,
) => {
	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['listProjectDocuments']
	>('/fv-app/v2/Documents', ctx.key, {
		method: 'GET',
		query: {
			folderId: input.folderId,
			tag: input.tag,
			// Project filtering via query if API supports, else list all filtered client-side
			projectId: input.projectId as unknown as string,
		},
	});
	const parsed = ListProjectDocumentsResponseSchema.parse(result);
	if (parsed.items && ctx.db.documents) {
		for (const item of parsed.items) {
			try {
				await ctx.db.documents.upsertByEntityId(String(item.documentId), {
					id: item.documentId,
					documentId: item.documentId,
					projectId: item.projectId,
					folderId: item.folderId,
					filename: item.filename,
					size: item.size,
					contentType: item.contentType,
					tags: item.tags,
					sharedToPortal: item.sharedToPortal,
					version: item.version,
					uploadedBy: item.uploadedBy,
					createdDate: item.createdDate,
					modifiedDate: item.modifiedDate,
				});
			} catch {}
		}
	}
	await logEventFromContext(
		ctx,
		'filevine.documents.list',
		{ ...input },
		'completed',
	);
	return parsed;
};

export const get: FilevineEndpoints['getDocument'] = async (ctx, input) => {
	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['getDocument']
	>(`/fv-app/v2/Documents/${input.documentId}`, ctx.key, { method: 'GET' });
	const parsed = GetDocumentResponseSchema.parse(result);
	if (ctx.db.documents) {
		try {
			await ctx.db.documents.upsertByEntityId(String(parsed.documentId), {
				id: parsed.documentId,
				documentId: parsed.documentId,
				projectId: parsed.projectId,
				folderId: parsed.folderId,
				filename: parsed.filename,
				size: parsed.size,
				contentType: parsed.contentType,
				tags: parsed.tags,
				sharedToPortal: parsed.sharedToPortal,
				version: parsed.version,
				uploadedBy: parsed.uploadedBy,
				createdDate: parsed.createdDate,
				modifiedDate: parsed.modifiedDate,
			});
		} catch {}
	}
	await logEventFromContext(
		ctx,
		'filevine.documents.get',
		{ ...input },
		'completed',
	);
	return parsed;
};

export const upload: FilevineEndpoints['uploadProjectDocument'] = async (
	ctx,
	input,
) => {
	const { projectId, file, ...rest } = input;
	let formData: FormData | undefined;
	if (file) {
		formData = new FormData();
		if (typeof file === 'string') {
			formData.append('file', new Blob([file]), rest.filename ?? 'file.txt');
		} else if (file instanceof Blob) {
			formData.append('file', file, rest.filename ?? 'file');
		}
		if (rest.folderId) formData.append('folderId', String(rest.folderId));
		if (rest.tags) formData.append('tags', JSON.stringify(rest.tags));
		if (rest.sharedToPortal !== undefined)
			formData.append('sharedToPortal', String(rest.sharedToPortal));
	}
	// Official Filevine commits pending docs via POST /fv-app/v2/Projects/{projectId}/Documents/{documentId}
	// For generic upload we use POST /fv-app/v2/Documents with project linkage via query/body
	const endpoint =
		rest.filename && !file
			? `/fv-app/v2/Projects/${projectId}/Documents/${rest.filename}`
			: '/fv-app/v2/Documents';
	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['uploadProjectDocument']
	>(endpoint, ctx.key, {
		method: 'POST',
		body: formData ? undefined : (rest as Record<string, unknown>),
		formData,
	});
	const parsed = UploadProjectDocumentResponseSchema.parse(result);
	if (ctx.db.documents) {
		try {
			await ctx.db.documents.upsertByEntityId(String(parsed.documentId), {
				id: parsed.documentId,
				documentId: parsed.documentId,
				projectId: parsed.projectId,
				folderId: parsed.folderId,
				filename: parsed.filename,
				size: parsed.size,
				contentType: parsed.contentType,
				tags: parsed.tags,
				sharedToPortal: parsed.sharedToPortal,
				version: parsed.version,
				uploadedBy: parsed.uploadedBy,
				createdDate: parsed.createdDate,
				modifiedDate: parsed.modifiedDate,
			});
		} catch {}
	}
	await logEventFromContext(
		ctx,
		'filevine.documents.upload',
		{ projectId, ...rest },
		'completed',
	);
	return parsed;
};
