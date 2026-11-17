import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { asRecord, paperformRequest, seg } from '../client';
import type { PaperformContext } from '../context';
import { parseWebhook, productOf } from './read';
import type {
	CouponCreateInput,
	CouponInput,
	CouponResponse,
	CouponUpdateInput,
	DeletedResponse,
	ProductResponse,
	ProductUpdateInput,
	SubmissionInput,
	WebhookCreateInput,
	WebhookIdInput,
	WebhookResponse,
} from './types';
import {
	CouponCreateInputSchema,
	CouponInputSchema,
	CouponSchema,
	CouponUpdateInputSchema,
	ProductUpdateInputSchema,
	SubmissionInputSchema,
	WebhookCreateInputSchema,
	WebhookIdInputSchema,
} from './types';

// body is the raw JSON response.
function item(body: unknown, key: string) {
	const row = asRecord(asRecord(asRecord(body)?.results)?.[key]);
	if (!row) throw new Error(`Paperform ${key} response was missing`);
	return row;
}

/** Keep only the fields the caller set, so an update never blanks the rest. */
// fields are the already-validated optional inputs.
function defined(fields: Record<string, unknown>) {
	return Object.fromEntries(
		Object.entries(fields).filter(([, value]) => value !== undefined),
	);
}

/** Paperform answers a delete with { status: 'ok' }; anything else is not a delete. */
// body is the raw JSON response.
function confirmDeleted(body: unknown, what: string) {
	if (asRecord(body)?.status !== 'ok')
		throw new Error(`Paperform did not confirm the ${what} delete`);
}

async function done(ctx: PaperformContext, event: string) {
	await logEventFromContext(ctx, event, { count: 1 }, 'completed');
}

export const deleteSubmission: CorsairEndpoint<
	PaperformContext,
	SubmissionInput,
	DeletedResponse
> = async (ctx, input) => {
	const parsed = SubmissionInputSchema.parse(input ?? {});
	try {
		confirmDeleted(
			await paperformRequest<unknown>(
				ctx.key,
				'DELETE',
				`/v1/forms/${seg(parsed.form)}/submissions/${seg(parsed.id)}`,
			),
			'submission',
		);
	} catch (error) {
		if (!(error instanceof ApiError && error.status === 404)) throw error;
		// A 404 can also mean the wrong form was given. Look the id up without
		// the form: only if Paperform has no such submission at all is it gone.
		const stillThere = await paperformRequest<unknown>(
			ctx.key,
			'GET',
			`/v1/submissions/${seg(parsed.id)}`,
		).then(
			() => true,
			(lookup: unknown) => {
				if (lookup instanceof ApiError && lookup.status === 404) return false;
				throw lookup;
			},
		);
		if (stillThere) throw error;
	}
	// Drop the local row only after Paperform confirmed the delete.
	if (ctx.database) {
		try {
			await ctx.db?.submissions?.deleteByEntityId(parsed.id);
		} catch {
			console.warn('Failed to remove the local Paperform submission');
		}
	}
	await done(ctx, 'paperform.submissions.delete');
	return { deleted: true };
};

export const updateProduct: CorsairEndpoint<
	PaperformContext,
	ProductUpdateInput,
	ProductResponse
> = async (ctx, input) => {
	const { form, sku, ...fields } = ProductUpdateInputSchema.parse(input ?? {});
	const body = defined(fields);
	if (Object.keys(body).length === 0)
		throw new Error('Pass at least one product field to change');
	const response = await paperformRequest<unknown>(
		ctx.key,
		'PUT',
		`/v1/forms/${seg(form)}/products/${seg(sku)}`,
		{ body },
	);
	const product = productOf(response);
	await done(ctx, 'paperform.products.update');
	return { product };
};

export const createCoupon: CorsairEndpoint<
	PaperformContext,
	CouponCreateInput,
	CouponResponse
> = async (ctx, input) => {
	const { form, ...fields } = CouponCreateInputSchema.parse(input ?? {});
	const response = await paperformRequest<unknown>(
		ctx.key,
		'POST',
		`/v1/forms/${seg(form)}/coupons`,
		{ body: defined(fields) },
	);
	const coupon = CouponSchema.parse(item(response, 'coupon'));
	await done(ctx, 'paperform.coupons.create');
	return { coupon };
};

export const updateCoupon: CorsairEndpoint<
	PaperformContext,
	CouponUpdateInput,
	CouponResponse
> = async (ctx, input) => {
	const { form, code, ...fields } = CouponUpdateInputSchema.parse(input ?? {});
	const body = defined(fields);
	if (Object.keys(body).length === 0)
		throw new Error('Pass at least one coupon field to change');
	const response = await paperformRequest<unknown>(
		ctx.key,
		'PUT',
		`/v1/forms/${seg(form)}/coupons/${seg(code)}`,
		{ body },
	);
	const coupon = CouponSchema.parse(item(response, 'coupon'));
	await done(ctx, 'paperform.coupons.update');
	return { coupon };
};

export const deleteCoupon: CorsairEndpoint<
	PaperformContext,
	CouponInput,
	DeletedResponse
> = async (ctx, input) => {
	const parsed = CouponInputSchema.parse(input ?? {});
	confirmDeleted(
		await paperformRequest<unknown>(
			ctx.key,
			'DELETE',
			`/v1/forms/${seg(parsed.form)}/coupons/${seg(parsed.code)}`,
		),
		'coupon',
	);
	await done(ctx, 'paperform.coupons.delete');
	return { deleted: true };
};

export const createWebhook: CorsairEndpoint<
	PaperformContext,
	WebhookCreateInput,
	WebhookResponse
> = async (ctx, input) => {
	const parsed = WebhookCreateInputSchema.parse(input ?? {});
	const response = await paperformRequest<unknown>(
		ctx.key,
		'POST',
		`/v1/forms/${seg(parsed.form)}/webhooks`,
		{ body: { target_url: parsed.targetUrl, triggers: parsed.triggers } },
	);
	const webhook = parseWebhook(item(response, 'webhook'));
	if (!webhook.success)
		throw new Error('Paperform webhook response was missing an id');
	// The target URL stays out of the event.
	await done(ctx, 'paperform.webhooks.create');
	return { webhook: webhook.data };
};

export const deleteWebhook: CorsairEndpoint<
	PaperformContext,
	WebhookIdInput,
	DeletedResponse
> = async (ctx, input) => {
	const parsed = WebhookIdInputSchema.parse(input ?? {});
	confirmDeleted(
		await paperformRequest<unknown>(
			ctx.key,
			'DELETE',
			`/v1/webhooks/${seg(parsed.id)}`,
		),
		'webhook',
	);
	await done(ctx, 'paperform.webhooks.delete');
	return { deleted: true };
};
