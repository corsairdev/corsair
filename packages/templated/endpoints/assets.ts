import type { TemplatedEndpoints } from '..';
import { segment } from '../client';
import { call, callDelete } from './call';
import {
	AccountInputSchema,
	AccountResponseSchema,
	DeleteResultSchema,
	FolderResponseSchema,
	FoldersCreateInputSchema,
	FoldersListInputSchema,
	FoldersListResponseSchema,
	FoldersRemoveInputSchema,
	FoldersUpdateInputSchema,
	FontsListInputSchema,
	FontsListResponseSchema,
	GalleryFontsListInputSchema,
	GalleryFontsListResponseSchema,
	UploadsCreateInputSchema,
	UploadsCreateResponseSchema,
	UploadsDeletedSchema,
	UploadsListInputSchema,
	UploadsListResponseSchema,
	UploadsRemoveInputSchema,
} from './types';

// ── uploads ───────────────────────────────────────────────────────────────

export const uploadsList: TemplatedEndpoints['uploadsList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'uploads.list',
			input: UploadsListInputSchema,
			output: UploadsListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/uploads',
			query: {
				page: parsed.page,
				limit: parsed.limit,
				query: parsed.query,
				tags: parsed.tags?.join(','),
			},
		}),
	);
};

export const uploadsCreate: TemplatedEndpoints['uploadsCreate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'uploads.create',
			input: UploadsCreateInputSchema,
			output: UploadsCreateResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/upload',
			// The route is multipart with a real file part. The caller's bytes
			// arrive base64 encoded and are rebuilt as a Blob so the boundary and
			// filename are sent correctly.
			formData: {
				// A File, not a bare Blob, so the part carries the name and its
				// extension; the media type falls back to the extension's.
				file: new File(
					[Buffer.from(parsed.fileBase64, 'base64')],
					parsed.fileName,
					{
						type:
							parsed.contentType ??
							contentTypeFor(parsed.fileName) ??
							'application/octet-stream',
					},
				),
				tags: parsed.tags,
				externalId: parsed.externalId,
			},
		}),
	);
};

export const uploadsRemove: TemplatedEndpoints['uploadsRemove'] = async (
	ctx,
	input,
) => {
	return callDelete(
		ctx,
		{
			event: 'uploads.remove',
			input: UploadsRemoveInputSchema,
			output: DeleteResultSchema,
			confirm: UploadsDeletedSchema,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: '/uploads',
			// The route takes repeated `ids` query values; corsair/http repeats an
			// array value under the same key.
			query: { ids: parsed.uploadIds },
		}),
	);
};

const CONTENT_TYPES: Record<string, string> = {
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	png: 'image/png',
	webp: 'image/webp',
	svg: 'image/svg+xml',
};

/** The media type for an upload's extension, when it is one Templated takes. */
export function contentTypeFor(fileName: string): string | undefined {
	const extension = fileName.split('.').pop()?.toLowerCase();
	return extension ? CONTENT_TYPES[extension] : undefined;
}

// ── folders ───────────────────────────────────────────────────────────────

export const foldersList: TemplatedEndpoints['foldersList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'folders.list',
			input: FoldersListInputSchema,
			output: FoldersListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/folders',
			query: { page: parsed.page, limit: parsed.limit, query: parsed.query },
		}),
	);
};

export const foldersCreate: TemplatedEndpoints['foldersCreate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'folders.create',
			input: FoldersCreateInputSchema,
			output: FolderResponseSchema,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/folder', body: parsed }),
	);
};

export const foldersUpdate: TemplatedEndpoints['foldersUpdate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'folders.update',
			input: FoldersUpdateInputSchema,
			output: FolderResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'PUT',
			path: `/folder/${segment(parsed.folderId)}`,
			body: { name: parsed.name },
		}),
	);
};

export const foldersRemove: TemplatedEndpoints['foldersRemove'] = async (
	ctx,
	input,
) => {
	return callDelete(
		ctx,
		{
			event: 'folders.remove',
			input: FoldersRemoveInputSchema,
			output: DeleteResultSchema,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/folder/${segment(parsed.folderId)}`,
		}),
	);
};

// ── fonts and account ─────────────────────────────────────────────────────

export const fontsList: TemplatedEndpoints['fontsList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'fonts.list',
			input: FontsListInputSchema,
			output: FontsListResponseSchema,
		},
		input,
		() => ({ method: 'GET', path: '/fonts' }),
	);
};

export const galleryFontsList: TemplatedEndpoints['galleryFontsList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'galleryFonts.list',
			input: GalleryFontsListInputSchema,
			output: GalleryFontsListResponseSchema,
		},
		input,
		() => ({ method: 'GET', path: '/fonts/gallery' }),
	);
};

export const accountGet: TemplatedEndpoints['accountGet'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'account.get',
			input: AccountInputSchema,
			output: AccountResponseSchema,
		},
		input,
		() => ({ method: 'GET', path: '/account' }),
	);
};
