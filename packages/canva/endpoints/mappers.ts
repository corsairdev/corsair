import type { FileInput } from 'corsair/http';
import { resolveFileInput } from 'corsair/http';
import type { CanvaContext } from '../index';
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

// Input fields that carry the customer's own words or files. Event payloads
// keep ids, types and options, which is what a log needs to explain a call.
const CUSTOMER_FIELDS = new Set([
	'title',
	'name',
	'message_plaintext',
	'brief',
	'prompt',
	'outline',
	'tags',
	'query',
	'asset_name',
	'data',
]);

/**
 * An operation's input as it may go into an event log: customer text becomes
 * `[omitted]`, a file `[file]` and a URL `[url]` (its path and query can name
 * a customer or carry a presigned signature).
 */
// unknown: one helper for every operation's input, whatever its fields.
export function loggable(
	input: Record<string, unknown>,
): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(input)) {
		if (value === undefined) continue;
		if (key === 'file' || key === 'contentBase64') out[key] = '[file]';
		else if (key === 'url') out[key] = '[url]';
		else if (CUSTOMER_FIELDS.has(key)) out[key] = '[omitted]';
		else out[key] = value;
	}
	return out;
}

/**
 * Stores a design a job returned. A job's design summary leaves fields out
 * (owner, sometimes timestamps), so it fills in the stored record instead of
 * replacing it.
 */
export async function saveDesign(
	ctx: CanvaContext,
	design: DesignLike | undefined,
): Promise<void> {
	if (!design || !ctx.db.designs) return;
	try {
		const fresh = Object.fromEntries(
			Object.entries(toDesignEntity(design)).filter(
				([, value]) => value !== undefined && value !== null,
			),
		);
		const existing = await ctx.db.designs.findByEntityId(design.id);
		await ctx.db.designs.upsertByEntityId(design.id, {
			...(existing?.data ?? {}),
			...fresh,
		} as ReturnType<typeof toDesignEntity>);
	} catch (error) {
		console.warn('Failed to save design to database:', error);
	}
}

/**
 * Most bytes read into memory for one upload. Bigger files go through
 * createFromUrl, where Canva fetches the file itself (videos only up to the
 * 100 MB Canva allows from a URL).
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
	// The same capped decoder as a file input, so base64 can't bypass the limit.
	const resolved = await resolveFileInput(
		{ base64: input.contentBase64 ?? '' },
		{ fallbackName, maxBytes: UPLOAD_MAX_BYTES },
	);
	return new Blob([resolved.bytes], { type: 'application/octet-stream' });
}
