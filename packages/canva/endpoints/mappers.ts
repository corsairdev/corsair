import type { FileInput } from 'corsair/http';
import { resolveFileInput } from 'corsair/http';
import { decodeBase64ToBytes } from '../base64';
import type { Asset, BrandTemplate } from './types';

export type DesignLike = {
	id: string;
	title?: string;
	owner?: { user_id?: string; team_id?: string };
	created_at?: number;
	updated_at?: number;
	page_count?: number;
	urls?: { edit_url?: string; view_url?: string };
	url?: string;
};

export function toDesignEntity(design: DesignLike) {
	return {
		id: design.id,
		title: design.title,
		owner_user_id: design.owner?.user_id,
		owner_team_id: design.owner?.team_id,
		created_at: design.created_at ? new Date(design.created_at * 1000) : null,
		updated_at: design.updated_at ? new Date(design.updated_at * 1000) : null,
		page_count: design.page_count,
		edit_url: design.urls?.edit_url,
		view_url: design.urls?.view_url,
		url: design.url,
	};
}

export function toAssetEntity(asset: Asset) {
	return {
		id: asset.id,
		type: asset.type,
		name: asset.name,
		tags: asset.tags,
		created_at: asset.created_at ? new Date(asset.created_at * 1000) : null,
		updated_at: asset.updated_at ? new Date(asset.updated_at * 1000) : null,
	};
}

export function toBrandTemplateEntity(brandTemplate: BrandTemplate) {
	return {
		id: brandTemplate.id,
		title: brandTemplate.title,
		view_url: brandTemplate.view_url,
		create_url: brandTemplate.create_url,
		created_at: brandTemplate.created_at
			? new Date(brandTemplate.created_at * 1000)
			: null,
		updated_at: brandTemplate.updated_at
			? new Date(brandTemplate.updated_at * 1000)
			: null,
	};
}

/** The input as logged: no file bytes, and a file given by URL only as its URL. */
export function withoutFileContent<T extends Record<string, unknown>>(
	input: T,
) {
	const { contentBase64: _contentBase64, file, ...rest } = input;
	if (file === undefined) return rest;
	const url =
		typeof file === 'string'
			? file
			: typeof file === 'object' && file !== null && 'url' in file
				? (file as { url: unknown }).url
				: undefined;
	return { ...rest, file: typeof url === 'string' ? url : '[file]' };
}

/**
 * Most bytes read into memory for one upload. Bigger files go through
 * createFromUrl, where Canva fetches the file itself.
 */
export const UPLOAD_MAX_BYTES = 100 * 1024 * 1024;

/** The raw request body for an upload, from a file input or base64. */
export async function bodyFrom(
	input: { file?: FileInput; contentBase64?: string },
	fallbackName: string,
): Promise<Blob> {
	if (input.file !== undefined) {
		const resolved = await resolveFileInput(input.file, {
			fallbackName,
			maxBytes: UPLOAD_MAX_BYTES,
		});
		return new Blob([resolved.bytes], { type: 'application/octet-stream' });
	}
	return new Blob([decodeBase64ToBytes(input.contentBase64 ?? '')], {
		type: 'application/octet-stream',
	});
}
