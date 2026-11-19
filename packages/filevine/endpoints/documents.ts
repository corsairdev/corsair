import { logEventFromContext } from 'corsair/core';
import { resolveFileInput } from 'corsair/http';
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

// A string is a link only when no fileEncoding says it is content.
const LINK = /^https?:\/\//i;

/**
 * The document as a Blob for the multipart body. Binary values are wrapped,
 * a Blob is sent as given, a string follows fileEncoding (default 'text'),
 * and a link or `{ url }` / `{ base64 }` object is fetched or decoded by
 * core's resolveFileInput. Filevine documents no size limit for this route
 * (its app takes files under 50 GB), so a link is held to core's 25 MB default.
 */
async function documentBlob(
	file: NonNullable<UploadProjectDocumentInput['file']>,
	fileEncoding: UploadProjectDocumentInput['fileEncoding'],
): Promise<Blob> {
	if (typeof file === 'string') {
		if (fileEncoding === undefined && LINK.test(file)) {
			return (await resolveFileInput(file, { fallbackName: 'document' })).file;
		}
		return stringToBlob(file, fileEncoding ?? 'text');
	}
	if (typeof Buffer !== 'undefined' && Buffer.isBuffer(file))
		return new Blob([file]);
	if (file instanceof Uint8Array) return new Blob([file]);
	if (file instanceof Blob) return file;
	if (file instanceof ArrayBuffer) return new Blob([file]);
	// unknown: the endpoint takes its input unparsed, so the object is checked here.
	const given: unknown = file;
	if (
		typeof given === 'object' &&
		given !== null &&
		('url' in given || 'base64' in given)
	) {
		return (await resolveFileInput(file, { fallbackName: 'document' })).file;
	}
	throw new FilevineAPIError(
		'documents.upload file must be a link, {url}, {base64}, Blob, Buffer, Uint8Array, ArrayBuffer, or base64/text string',
		'INVALID_FILE',
	);
}

import type { FilevineEndpoints } from '../index';
import type {
	FilevineEndpointOutputs,
	UploadProjectDocumentInput,
} from './types';
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
	const {
		projectId,
		file,
		fileEncoding,
		orgId: _org,
		userId: _user,
		...rest
	} = input;
	// Normalize the file to a Blob before any Filevine request — the shared
	// multipart layer only recognizes real Blob/File values (isBlob checks
	// .type/.stream), and a bad link or base64 fails here, not after a call.
	const blob = file != null ? await documentBlob(file, fileEncoding) : null;
	const { orgId: resolvedOrgId, userId: resolvedUserId } =
		await resolveFilevineOrgContext(ctx.key, input.orgId, input.userId);
	if (blob !== null) {
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
