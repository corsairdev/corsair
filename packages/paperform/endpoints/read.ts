import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { asRecord, paperformGet } from '../client';
import type { PaperformContext } from '../context';
import {
	PaperformFormEntity,
	PaperformSpaceEntity,
	PaperformTranslationEntity,
} from '../schema/database';
import type {
	EmptyInput,
	FormListResponse,
	IdInput,
	SpaceListResponse,
	SpaceResponse,
	TranslationListResponse,
} from './types';
import { IdInputSchema } from './types';

function text(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

async function save<T extends { id: string }>(
	table:
		| { upsertByEntityId: (id: string, row: T) => Promise<unknown> }
		| undefined,
	row: T,
	label: string,
) {
	if (!table) return;
	try {
		await table.upsertByEntityId(row.id, row);
	} catch {
		console.warn(`Failed to save Paperform ${label}`);
	}
}

function resultList(body: unknown, key: string): unknown[] {
	const list = asRecord(asRecord(body)?.results)?.[key];
	if (!Array.isArray(list))
		throw new Error(`Paperform ${key} response was not a list`);
	return list;
}

function formsOf(body: unknown) {
	return resultList(body, 'forms').flatMap((item) => {
		const row = asRecord(item);
		const form = PaperformFormEntity.safeParse({
			id: text(row?.id),
			title: text(row?.title),
			slug: text(row?.slug),
		});
		return form.success ? [form.data] : [];
	});
}

export const listForms: CorsairEndpoint<
	PaperformContext,
	EmptyInput,
	FormListResponse
> = async (ctx) => {
	const body = await paperformGet<unknown>(ctx.key, '/v1/forms');
	const forms = formsOf(body);
	for (const form of forms) await save(ctx.db?.forms, form, 'form');
	await logEventFromContext(
		ctx,
		'paperform.forms.list',
		{ count: forms.length },
		'completed',
	);
	return { forms };
};

export const listSpaces: CorsairEndpoint<
	PaperformContext,
	EmptyInput,
	SpaceListResponse
> = async (ctx) => {
	const body = await paperformGet<unknown>(ctx.key, '/v1/spaces');
	const spaces = resultList(body, 'spaces').flatMap((item) => {
		const row = asRecord(item);
		const space = PaperformSpaceEntity.safeParse({
			id: text(row?.id),
			name: text(row?.name),
		});
		return space.success ? [space.data] : [];
	});
	for (const space of spaces) await save(ctx.db?.spaces, space, 'space');
	await logEventFromContext(
		ctx,
		'paperform.spaces.list',
		{ count: spaces.length },
		'completed',
	);
	return { spaces };
};

export const getSpace: CorsairEndpoint<
	PaperformContext,
	IdInput,
	SpaceResponse
> = async (ctx, input) => {
	const parsed = IdInputSchema.parse(input ?? {});
	const body = await paperformGet<unknown>(ctx.key, `/v1/spaces/${parsed.id}`);
	const results = asRecord(asRecord(body)?.results);
	const row = asRecord(results?.space) ?? results;
	const space = PaperformSpaceEntity.safeParse({
		id: text(row?.id),
		name: text(row?.name),
	});
	if (!space.success)
		throw new Error('Paperform space response was missing an id');
	await save(ctx.db?.spaces, space.data, 'space');
	await logEventFromContext(
		ctx,
		'paperform.spaces.get',
		{ count: 1 },
		'completed',
	);
	return { space: space.data };
};

export const listSpaceForms: CorsairEndpoint<
	PaperformContext,
	IdInput,
	FormListResponse
> = async (ctx, input) => {
	const parsed = IdInputSchema.parse(input ?? {});
	const body = await paperformGet<unknown>(
		ctx.key,
		`/v1/spaces/${parsed.id}/forms`,
	);
	const forms = formsOf(body);
	for (const form of forms) await save(ctx.db?.forms, form, 'form');
	await logEventFromContext(
		ctx,
		'paperform.spaces.forms',
		{ count: forms.length },
		'completed',
	);
	return { forms };
};

export const listTranslations: CorsairEndpoint<
	PaperformContext,
	EmptyInput,
	TranslationListResponse
> = async (ctx) => {
	const body = await paperformGet<unknown>(ctx.key, '/v1/translations');
	const translations = resultList(body, 'translations').flatMap((item) => {
		const row = asRecord(item);
		const translation = PaperformTranslationEntity.safeParse({
			id: text(row?.id),
			name: text(row?.name),
		});
		return translation.success ? [translation.data] : [];
	});
	for (const translation of translations) {
		await save(ctx.db?.translations, translation, 'translation');
	}
	await logEventFromContext(
		ctx,
		'paperform.translations.list',
		{ count: translations.length },
		'completed',
	);
	return { translations };
};
