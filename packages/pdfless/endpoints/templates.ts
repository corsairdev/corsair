import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { pdflessGet } from '../client';
import type { PdfLessContext } from '../context';
import { PdfLessTemplateEntity } from '../schema/database';
import type { ListTemplatesInput, ListTemplatesResponse } from './types';
import { ListTemplatesInputSchema, ListTemplatesResponseSchema } from './types';

export const listTemplates: CorsairEndpoint<
	PdfLessContext,
	ListTemplatesInput,
	ListTemplatesResponse
> = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('pdfless', 'api_key');
	}
	const parsed = ListTemplatesInputSchema.parse(input ?? {});
	const body = await pdflessGet<unknown>(ctx.key, '/v1/document-templates', {
		Page: parsed.page,
		PageSize: parsed.pageSize,
	});
	const templates = ListTemplatesResponseSchema.parse({
		templates: body,
	}).templates;
	const result = { templates };
	await storeTemplates(ctx, templates);
	await logEventFromContext(
		ctx,
		'pdfless.templates.list',
		{
			...(parsed.page === undefined ? {} : { page: parsed.page }),
			...(parsed.pageSize === undefined ? {} : { pageSize: parsed.pageSize }),
		},
		'completed',
	);
	return result;
};

async function storeTemplates(
	ctx: PdfLessContext,
	templates: ListTemplatesResponse['templates'],
): Promise<void> {
	if (!ctx.db?.templates) return;
	for (const item of templates) {
		const row = PdfLessTemplateEntity.safeParse(item);
		if (!row.success) continue;
		try {
			await ctx.db.templates.upsertByEntityId(row.data.id, row.data);
		} catch {
			console.warn('Failed to save PDFLess template');
		}
	}
}
