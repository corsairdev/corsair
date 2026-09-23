import { logEventFromContext } from 'corsair/core';
import {
	FilevineAPIError,
	makeFilevineRequest,
	resolveFilevineOrgContext,
} from '../client';

function stringToBlob(input: string, encoding: 'base64' | 'text'): Blob {
	// Explicit encoding only — never guess. 'base64' is strictly validated
	// (alphabet, padding, length, round-trip) so malformed or truncated input
	// throws instead of uploading empty or partial bytes as a corrupt document.
	// 'text' uploads literally so plain text like "test" can never corrupt.
	if (encoding === 'base64') {
		const sanitized = input.replace(/\s+/g, '');
		if (sanitized.length === 0 || sanitized.length % 4 !== 0) {
			throw new FilevineAPIError(
				'Invalid base64 file content: length must be a non-zero multiple of 4',
				'INVALID_BASE64',
			);
		}
		if (!/^[A-Za-z0-9+/]*={0,2}$/.test(sanitized)) {
			throw new FilevineAPIError(
				'Invalid base64 file content: illegal characters or padding',
				'INVALID_BASE64',
			);
		}
		const buf = Buffer.from(sanitized, 'base64');
		if (buf.length === 0) {
			throw new FilevineAPIError(
				'Invalid base64 file content: decoded to empty bytes',
				'INVALID_BASE64',
			);
		}
		const roundTrip = buf.toString('base64');
		const norm = (s: string) => s.replace(/=+$/, '');
		if (norm(roundTrip) !== norm(sanitized)) {
			throw new FilevineAPIError(
				'Invalid base64 file content: malformed encoding',
				'INVALID_BASE64',
			);
		}
		return new Blob([buf]);
	}
	return new Blob([input]);
}

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
	const { orgId: resolvedOrgId, userId: resolvedUserId } =
		await resolveFilevineOrgContext(ctx.key, input.orgId, input.userId);
	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['listProjectDocuments']
	>('/fv-app/v2/Documents', ctx.key, {
		orgId: resolvedOrgId,
		userId: resolvedUserId,
		method: 'GET',
		query: {
			folderId: input.folderId,
			tag: input.tag,
			projectId: input.projectId,
			offset: input.offset,
			limit: input.limit,
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
	const { orgId: resolvedOrgId, userId: resolvedUserId } =
		await resolveFilevineOrgContext(ctx.key, input.orgId, input.userId);
	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['getDocument']
	>(`/fv-app/v2/Documents/${input.documentId}`, ctx.key, {
		orgId: resolvedOrgId,
		userId: resolvedUserId,
		method: 'GET',
	});
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
	const { orgId: resolvedOrgId, userId: resolvedUserId } =
		await resolveFilevineOrgContext(ctx.key, input.orgId, input.userId);
	const {
		projectId,
		file,
		fileEncoding,
		orgId: _org,
		userId: _user,
		...rest
	} = input;
	if (file != null) {
		// Normalize binary inputs to Blob — the shared multipart layer only
		// recognizes real Blob/File values (isBlob checks .type/.stream).
		// String handling is explicit via fileEncoding (default 'text'):
		// 'base64' decodes to bytes, 'text' uploads literally — never guessed,
		// so plain text like "test" can never be mis-decoded as base64.
		let blob: Blob;
		if (typeof file === 'string')
			blob = stringToBlob(file, fileEncoding ?? 'text');
		else if (typeof Buffer !== 'undefined' && Buffer.isBuffer(file))
			blob = new Blob([file]);
		else if (file instanceof Uint8Array) blob = new Blob([file]);
		else if (file instanceof Blob) blob = file;
		else if (file instanceof ArrayBuffer) blob = new Blob([file]);
		else
			throw new FilevineAPIError(
				'documents.upload file must be a Blob, Buffer, Uint8Array, ArrayBuffer, or base64/text string',
				'INVALID_FILE',
			);
		const formData: Record<string, unknown> = {
			file: blob,
			projectId: String(projectId),
		};
		if (rest.filename) formData.filename = rest.filename;
		if (rest.folderId) formData.folderId = String(rest.folderId);
		if (rest.tags) formData.tags = JSON.stringify(rest.tags);
		if (rest.sharedToPortal !== undefined)
			formData.sharedToPortal = String(rest.sharedToPortal);

		const result = await makeFilevineRequest<
			FilevineEndpointOutputs['uploadProjectDocument']
		>('/fv-app/v2/Documents', ctx.key, {
			orgId: resolvedOrgId,
			userId: resolvedUserId,
			method: 'POST',
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
	}

	const result = await makeFilevineRequest<
		FilevineEndpointOutputs['uploadProjectDocument']
	>('/fv-app/v2/Documents', ctx.key, {
		orgId: resolvedOrgId,
		userId: resolvedUserId,
		method: 'POST',
		body: { projectId, ...rest } as Record<string, unknown>,
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
