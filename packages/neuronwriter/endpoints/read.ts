import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { asRecord, neuronwriterPost } from '../client';
import type { NeuronwriterContext } from '../context';
import { NeuronwriterImportEntity } from '../schema/database';
import type { ImportInput, ImportResponse } from './types';
import { ImportInputSchema } from './types';

function text(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export const importContent: CorsairEndpoint<
	NeuronwriterContext,
	ImportInput,
	ImportResponse
> = async (ctx, input) => {
	const parsed = ImportInputSchema.parse(input);
	const body = asRecord(
		await neuronwriterPost<unknown>(
			ctx.key,
			'/neuron-api/0.5/writer/import-content',
			{
				query: parsed.query,
				...(parsed.html ? { html: parsed.html } : {}),
				...(parsed.url ? { url: parsed.url } : {}),
			},
		),
	);
	const imported = NeuronwriterImportEntity.parse({
		id: parsed.query,
		status: text(body?.status),
		contentScore:
			typeof body?.content_score === 'number' ? body.content_score : undefined,
	});
	if (ctx.db?.imports) {
		try {
			await ctx.db.imports.upsertByEntityId(imported.id, imported);
		} catch {
			console.warn('Failed to save NeuronWriter import');
		}
	}
	await logEventFromContext(
		ctx,
		'neuronwriter.content.import',
		{ count: 1 },
		'completed',
	);
	return { imported };
};
