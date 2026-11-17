import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { PaperformQuery } from '../client';
import { asRecord, paperformGet, paperformRequest, seg } from '../client';
import type { PaperformContext } from '../context';
import {
	PaperformFormEntity,
	PaperformSpaceEntity,
	PaperformSubmissionEntity,
	PaperformTranslationEntity,
} from '../schema/database';
import type {
	CouponInput,
	CouponListResponse,
	CouponResponse,
	FieldListResponse,
	FileSignInput,
	FileSignResponse,
	FormInput,
	FormListResponse,
	FormPageInput,
	FormResponse,
	FormSearchInput,
	IdInput,
	PageInput,
	PartialSubmissionListResponse,
	PartialSubmissionResponse,
	ProductInput,
	ProductListResponse,
	ProductResponse,
	SearchPageInput,
	SpaceListResponse,
	SpaceResponse,
	SubmissionInput,
	SubmissionListResponse,
	SubmissionResponse,
	TranslationListResponse,
	WebhookListResponse,
} from './types';
import {
	CouponInputSchema,
	CouponSchema,
	FieldSchema,
	FileSignInputSchema,
	FormInputSchema,
	FormPageInputSchema,
	FormSchema,
	FormSearchInputSchema,
	IdInputSchema,
	PageInputSchema,
	PartialSubmissionSchema,
	ProductInputSchema,
	ProductSchema,
	SearchPageInputSchema,
	SpaceSchema,
	SubmissionInputSchema,
	SubmissionSchema,
	TranslationSchema,
	WebhookSchema,
} from './types';

export function text(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/** Paperform sends most ids as strings and some (spaces) as numbers. */
export function idText(value: unknown): string | undefined {
	if (typeof value === 'number' && Number.isFinite(value)) return String(value);
	return text(value);
}

export async function save<T extends { id: string }>(
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

function results(body: unknown) {
	return asRecord(asRecord(body)?.results);
}

function resultList(body: unknown, key: string): unknown[] {
	const list = results(body)?.[key];
	if (!Array.isArray(list))
		throw new Error(`Paperform ${key} response was not a list`);
	return list;
}

function resultItem(body: unknown, key: string): Record<string, unknown> {
	const item = asRecord(results(body)?.[key]);
	if (!item) throw new Error(`Paperform ${key} response was missing`);
	return item;
}

function pageOf(body: unknown) {
	const root = asRecord(body);
	return {
		total: typeof root?.total === 'number' ? root.total : undefined,
		hasMore: typeof root?.has_more === 'boolean' ? root.has_more : undefined,
		limit: typeof root?.limit === 'number' ? root.limit : undefined,
		skip: typeof root?.skip === 'number' ? root.skip : undefined,
	};
}

export function pageQuery(input: PageInput): PaperformQuery {
	return {
		limit: input.limit,
		skip: input.skip,
		after_id: input.afterId,
		before_id: input.beforeId,
		after_date: input.afterDate,
		before_date: input.beforeDate,
		sort: input.sort,
	};
}

/** Copy with string ids, so numeric ids from Paperform survive the schemas. */
function withIds(row: Record<string, unknown>, keys: string[]) {
	const out: Record<string, unknown> = { ...row };
	for (const key of keys) {
		const id = idText(row[key]);
		if (id === undefined) delete out[key];
		else out[key] = id;
	}
	return out;
}

/** Parse each row; rows without an id are skipped rather than failing the page. */
function rows<T>(
	list: unknown[],
	parse: (
		row: Record<string, unknown>,
	) => { success: true; data: T } | { success: false },
): T[] {
	return list.flatMap((item) => {
		const row = asRecord(item);
		if (!row) return [];
		const parsed = parse(row);
		return parsed.success ? [parsed.data] : [];
	});
}

const parseForm = (row: Record<string, unknown>) =>
	FormSchema.safeParse(withIds(row, ['id', 'space_id']));
const parseSpace = (row: Record<string, unknown>) =>
	SpaceSchema.safeParse(withIds(row, ['id']));
const parseSubmission = (row: Record<string, unknown>) =>
	SubmissionSchema.safeParse(withIds(row, ['id', 'form_id']));
const parsePartial = (row: Record<string, unknown>) =>
	PartialSubmissionSchema.safeParse(withIds(row, ['id', 'form_id']));
const parseWebhook = (row: Record<string, unknown>) =>
	WebhookSchema.safeParse(withIds(row, ['id']));

function formEntity(form: ReturnType<typeof FormSchema.parse>) {
	return PaperformFormEntity.parse({
		id: form.id,
		title: text(form.title),
		slug: text(form.slug),
		spaceId: form.space_id,
		live: form.live,
		submissionCount: form.submission_count,
	});
}

async function saveForms(
	ctx: PaperformContext,
	forms: ReturnType<typeof FormSchema.parse>[],
) {
	for (const form of forms) await save(ctx.db?.forms, formEntity(form), 'form');
}

async function saveSubmissions(
	ctx: PaperformContext,
	submissions: ReturnType<typeof SubmissionSchema.parse>[],
) {
	for (const submission of submissions) {
		await save(
			ctx.db?.submissions,
			PaperformSubmissionEntity.parse({
				id: submission.id,
				formId: text(submission.form_id),
				createdAt: text(submission.created_at_utc),
			}),
			'submission',
		);
	}
}

async function done(ctx: PaperformContext, event: string, count: number) {
	await logEventFromContext(ctx, event, { count }, 'completed');
}

// ── Forms ───────────────────────────────────────────────────────────────────

export const listForms: CorsairEndpoint<
	PaperformContext,
	SearchPageInput,
	FormListResponse
> = async (ctx, input) => {
	const parsed = SearchPageInputSchema.parse(input ?? {});
	const body = await paperformGet<unknown>(ctx.key, '/v1/forms', {
		search: parsed.search,
		...pageQuery(parsed),
	});
	const forms = rows(resultList(body, 'forms'), parseForm);
	await saveForms(ctx, forms);
	await done(ctx, 'paperform.forms.list', forms.length);
	return { forms, page: pageOf(body) };
};

export const getForm: CorsairEndpoint<
	PaperformContext,
	FormInput,
	FormResponse
> = async (ctx, input) => {
	const parsed = FormInputSchema.parse(input ?? {});
	const body = await paperformGet<unknown>(
		ctx.key,
		`/v1/forms/${seg(parsed.form)}`,
	);
	const form = FormSchema.parse(
		withIds(resultItem(body, 'form'), ['id', 'space_id']),
	);
	await saveForms(ctx, [form]);
	await done(ctx, 'paperform.forms.get', 1);
	return { form };
};

export const listFields: CorsairEndpoint<
	PaperformContext,
	FormSearchInput,
	FieldListResponse
> = async (ctx, input) => {
	const parsed = FormSearchInputSchema.parse(input ?? {});
	const body = await paperformGet<unknown>(
		ctx.key,
		`/v1/forms/${seg(parsed.form)}/fields`,
		{ search: parsed.search },
	);
	const fields = rows(resultList(body, 'fields'), (row) =>
		FieldSchema.safeParse(row),
	);
	await done(ctx, 'paperform.fields.list', fields.length);
	return { fields };
};

// ── Spaces and translations ─────────────────────────────────────────────────

export const listSpaces: CorsairEndpoint<
	PaperformContext,
	SearchPageInput,
	SpaceListResponse
> = async (ctx, input) => {
	const parsed = SearchPageInputSchema.parse(input ?? {});
	const body = await paperformGet<unknown>(ctx.key, '/v1/spaces', {
		search: parsed.search,
		...pageQuery(parsed),
	});
	const spaces = rows(resultList(body, 'spaces'), parseSpace);
	for (const space of spaces) {
		await save(
			ctx.db?.spaces,
			PaperformSpaceEntity.parse({ id: space.id, name: text(space.name) }),
			'space',
		);
	}
	await done(ctx, 'paperform.spaces.list', spaces.length);
	return { spaces, page: pageOf(body) };
};

export const getSpace: CorsairEndpoint<
	PaperformContext,
	IdInput,
	SpaceResponse
> = async (ctx, input) => {
	const parsed = IdInputSchema.parse(input ?? {});
	const body = await paperformGet<unknown>(
		ctx.key,
		`/v1/spaces/${seg(parsed.id)}`,
	);
	const space = SpaceSchema.parse(withIds(resultItem(body, 'space'), ['id']));
	await save(
		ctx.db?.spaces,
		PaperformSpaceEntity.parse({ id: space.id, name: text(space.name) }),
		'space',
	);
	await done(ctx, 'paperform.spaces.get', 1);
	return { space };
};

export const listSpaceForms: CorsairEndpoint<
	PaperformContext,
	IdInput,
	FormListResponse
> = async (ctx, input) => {
	const parsed = IdInputSchema.parse(input ?? {});
	const body = await paperformGet<unknown>(
		ctx.key,
		`/v1/spaces/${seg(parsed.id)}/forms`,
	);
	const forms = rows(resultList(body, 'forms'), parseForm);
	await saveForms(ctx, forms);
	await done(ctx, 'paperform.spaces.forms', forms.length);
	return { forms, page: pageOf(body) };
};

export const listTranslations: CorsairEndpoint<
	PaperformContext,
	PageInput,
	TranslationListResponse
> = async (ctx, input) => {
	const parsed = PageInputSchema.parse(input ?? {});
	const body = await paperformGet<unknown>(
		ctx.key,
		'/v1/translations',
		pageQuery(parsed),
	);
	const translations = rows(resultList(body, 'translations'), (row) =>
		TranslationSchema.safeParse(withIds(row, ['id'])),
	);
	for (const translation of translations) {
		await save(
			ctx.db?.translations,
			PaperformTranslationEntity.parse({
				id: translation.id,
				title: text(translation.title),
				language: text(translation.language),
			}),
			'translation',
		);
	}
	await done(ctx, 'paperform.translations.list', translations.length);
	return { translations, page: pageOf(body) };
};

// ── Submissions ─────────────────────────────────────────────────────────────

export const listSubmissions: CorsairEndpoint<
	PaperformContext,
	FormPageInput,
	SubmissionListResponse
> = async (ctx, input) => {
	const parsed = FormPageInputSchema.parse(input ?? {});
	const body = await paperformGet<unknown>(
		ctx.key,
		`/v1/forms/${seg(parsed.form)}/submissions`,
		pageQuery(parsed),
	);
	const submissions = rows(resultList(body, 'submissions'), parseSubmission);
	await saveSubmissions(ctx, submissions);
	await done(ctx, 'paperform.submissions.list', submissions.length);
	return { submissions, page: pageOf(body) };
};

export const getSubmission: CorsairEndpoint<
	PaperformContext,
	SubmissionInput,
	SubmissionResponse
> = async (ctx, input) => {
	const parsed = SubmissionInputSchema.parse(input ?? {});
	const body = await paperformGet<unknown>(
		ctx.key,
		`/v1/forms/${seg(parsed.form)}/submissions/${seg(parsed.id)}`,
	);
	const submission = SubmissionSchema.parse(
		withIds(resultItem(body, 'submission'), ['id', 'form_id']),
	);
	await saveSubmissions(ctx, [submission]);
	await done(ctx, 'paperform.submissions.get', 1);
	return { submission };
};

export const listPartialSubmissions: CorsairEndpoint<
	PaperformContext,
	FormPageInput,
	PartialSubmissionListResponse
> = async (ctx, input) => {
	const parsed = FormPageInputSchema.parse(input ?? {});
	const body = await paperformGet<unknown>(
		ctx.key,
		`/v1/forms/${seg(parsed.form)}/partial-submissions`,
		pageQuery(parsed),
	);
	const partialSubmissions = rows(
		resultList(body, 'partial-submissions'),
		parsePartial,
	);
	await done(
		ctx,
		'paperform.partialSubmissions.list',
		partialSubmissions.length,
	);
	return { partialSubmissions, page: pageOf(body) };
};

export const getPartialSubmission: CorsairEndpoint<
	PaperformContext,
	SubmissionInput,
	PartialSubmissionResponse
> = async (ctx, input) => {
	const parsed = SubmissionInputSchema.parse(input ?? {});
	const body = await paperformGet<unknown>(
		ctx.key,
		`/v1/forms/${seg(parsed.form)}/partial-submissions/${seg(parsed.id)}`,
	);
	const partialSubmission = PartialSubmissionSchema.parse(
		withIds(resultItem(body, 'partial-submission'), ['id', 'form_id']),
	);
	await done(ctx, 'paperform.partialSubmissions.get', 1);
	return { partialSubmission };
};

// ── Products and coupons ────────────────────────────────────────────────────

export const listProducts: CorsairEndpoint<
	PaperformContext,
	FormSearchInput,
	ProductListResponse
> = async (ctx, input) => {
	const parsed = FormSearchInputSchema.parse(input ?? {});
	const body = await paperformGet<unknown>(
		ctx.key,
		`/v1/forms/${seg(parsed.form)}/products`,
		{ search: parsed.search },
	);
	const products = rows(resultList(body, 'products'), (row) =>
		ProductSchema.safeParse(row),
	);
	await done(ctx, 'paperform.products.list', products.length);
	return { products };
};

/** The product read and update routes answer with `product` or a one-item `products` list. */
export function productOf(body: unknown) {
	const found = results(body);
	const single = asRecord(found?.product);
	const list = Array.isArray(found?.products) ? found.products : undefined;
	const row = single ?? asRecord(list?.[0]);
	if (!row) throw new Error('Paperform product response was missing');
	return ProductSchema.parse(row);
}

export const getProduct: CorsairEndpoint<
	PaperformContext,
	ProductInput,
	ProductResponse
> = async (ctx, input) => {
	const parsed = ProductInputSchema.parse(input ?? {});
	const body = await paperformGet<unknown>(
		ctx.key,
		`/v1/forms/${seg(parsed.form)}/products/${seg(parsed.sku)}`,
	);
	const product = productOf(body);
	await done(ctx, 'paperform.products.get', 1);
	return { product };
};

export const listCoupons: CorsairEndpoint<
	PaperformContext,
	FormInput,
	CouponListResponse
> = async (ctx, input) => {
	const parsed = FormInputSchema.parse(input ?? {});
	const body = await paperformGet<unknown>(
		ctx.key,
		`/v1/forms/${seg(parsed.form)}/coupons`,
	);
	const coupons = rows(resultList(body, 'coupons'), (row) =>
		CouponSchema.safeParse(row),
	);
	await done(ctx, 'paperform.coupons.list', coupons.length);
	return { coupons };
};

export const getCoupon: CorsairEndpoint<
	PaperformContext,
	CouponInput,
	CouponResponse
> = async (ctx, input) => {
	const parsed = CouponInputSchema.parse(input ?? {});
	const body = await paperformGet<unknown>(
		ctx.key,
		`/v1/forms/${seg(parsed.form)}/coupons/${seg(parsed.code)}`,
	);
	const coupon = CouponSchema.parse(resultItem(body, 'coupon'));
	await done(ctx, 'paperform.coupons.get', 1);
	return { coupon };
};

// ── Webhooks and files ──────────────────────────────────────────────────────

export const listWebhooks: CorsairEndpoint<
	PaperformContext,
	FormPageInput,
	WebhookListResponse
> = async (ctx, input) => {
	const parsed = FormPageInputSchema.parse(input ?? {});
	const body = await paperformGet<unknown>(
		ctx.key,
		`/v1/forms/${seg(parsed.form)}/webhooks`,
		pageQuery(parsed),
	);
	const webhooks = rows(resultList(body, 'webhooks'), parseWebhook);
	await done(ctx, 'paperform.webhooks.list', webhooks.length);
	return { webhooks, page: pageOf(body) };
};

export const signFile: CorsairEndpoint<
	PaperformContext,
	FileSignInput,
	FileSignResponse
> = async (ctx, input) => {
	const parsed = FileSignInputSchema.parse(input ?? {});
	// POST, but it only returns signed links; nothing changes in the account.
	const body = await paperformRequest<unknown>(
		ctx.key,
		'POST',
		'/v1/files/sign',
		{
			body: { url: parsed.url },
		},
	);
	const found = results(body);
	const fileUrl = text(found?.file_url);
	if (!fileUrl) throw new Error('Paperform file response was missing file_url');
	await done(ctx, 'paperform.files.sign', 1);
	return {
		fileUrl,
		storageUrl: text(found?.storage_url),
		expiresAt: text(found?.expires_at_utc) ?? null,
	};
};

export { parseWebhook };
