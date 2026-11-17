import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { echtpostGet } from '../client';
import type { EchtpostContext } from '../context';
import { EchtpostFont, EchtpostTemplateEntity } from '../schema/database';
import type { ListTemplatesInput, ListTemplatesResponse } from './types';
import { ListTemplatesInputSchema } from './types';

// unknown: a field of an untrusted response row, checked here.
function optionalString(value: unknown): string | undefined {
	return typeof value === 'string' ? value : undefined;
}

// unknown: a field of an untrusted response row, checked here.
function optionalNumber(value: unknown): number | undefined {
	return typeof value === 'number' && Number.isFinite(value)
		? value
		: undefined;
}

// unknown: the `font` field of a response row, checked field by field.
export function fontOf(value: unknown) {
	if (!value || typeof value !== 'object') return undefined;
	const font = value as Record<string, unknown>;
	const parsed = EchtpostFont.safeParse({
		family: optionalString(font.family),
		size: optionalNumber(font.size),
		color: optionalString(font.color),
		line_height: optionalNumber(font.line_height),
	});
	if (!parsed.success) return undefined;
	const data = parsed.data;
	if (
		data.family === undefined &&
		data.size === undefined &&
		data.color === undefined &&
		data.line_height === undefined
	) {
		return undefined;
	}
	return data;
}

export const listTemplates: CorsairEndpoint<
	EchtpostContext,
	ListTemplatesInput,
	ListTemplatesResponse
> = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('echtpost', 'api_key');
	}
	const parsed = ListTemplatesInputSchema.parse(input ?? {});
	// unknown: the body must be an array of rows; checked below.
	const body = await echtpostGet<unknown>(ctx.key, '/templates', {
		page: parsed.page === undefined ? undefined : String(parsed.page),
		per_page:
			parsed.per_page === undefined ? undefined : String(parsed.per_page),
	});
	if (!Array.isArray(body)) {
		throw new Error('Echtpost templates response was not an array');
	}
	const templates = body.flatMap((item) => {
		if (!item || typeof item !== 'object') return [];
		const row = item as Record<string, unknown>;
		const id = optionalNumber(row.id);
		if (id === undefined) return [];
		const parsedRow = EchtpostTemplateEntity.safeParse({
			id: String(id),
			motive_id: optionalNumber(row.motive_id),
			content: optionalString(row.content),
			content_ps: optionalString(row.content_ps),
			content_vertical: optionalString(row.content_vertical),
			font: fontOf(row.font),
			qr_code_url: optionalString(row.qr_code_url),
			preview_url: optionalString(row.preview_url),
			source: optionalString(row.source),
			created_at: optionalString(row.created_at),
			updated_at: optionalString(row.updated_at),
		});
		return parsedRow.success ? [parsedRow.data] : [];
	});
	if (ctx.db?.templates) {
		for (const row of templates) {
			try {
				await ctx.db.templates.upsertByEntityId(row.id, row);
			} catch {
				console.warn('Failed to save Echtpost template');
			}
		}
	}
	await logEventFromContext(
		ctx,
		'echtpost.templates.list',
		{
			count: templates.length,
			...(parsed.page === undefined ? {} : { page: parsed.page }),
		},
		'completed',
	);
	return { templates };
};
