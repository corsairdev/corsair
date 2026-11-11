import type { LemonSqueezyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	LemonSqueezyEndpointInputSchemas as Inputs,
	LemonSqueezyEndpointOutputSchemas as Outputs,
} from './types';

/** Paging and include, shared by every list here. */
type ListInput = {
	pageNumber?: number;
	pageSize?: number;
	sort?: string;
	include?: readonly string[];
};

function pageQuery(
	parsed: ListInput,
	filters: Record<string, string | number | boolean | undefined> = {},
): Record<string, string | number | boolean | undefined> {
	const query: Record<string, string | number | boolean | undefined> = {
		'page[number]': parsed.pageNumber,
		'page[size]': parsed.pageSize,
		sort: parsed.sort,
		include: parsed.include?.join(','),
	};
	for (const [key, value] of Object.entries(filters)) {
		if (value !== undefined) query[`filter[${key}]`] = value;
	}
	return query;
}

// ── customers ─────────────────────────────────────────────────────────────

export const customersList: LemonSqueezyEndpoints['customersList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'customers.list',
			input: Inputs.customersList,
			output: Outputs.customersList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1/customers',
			query: pageQuery(parsed, {
				store_id: parsed.storeId,
				email: parsed.email,
			}),
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const customersGet: LemonSqueezyEndpoints['customersGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'customers.get',
			input: Inputs.customersGet,
			output: Outputs.customersGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/v1/customers/${segment(parsed.customerId)}`,
		}),
		{ log: (parsed) => ({ customerId: parsed.customerId }) },
	);

/**
 * Creates a customer record. This does not send an invite or an email; it makes
 * the row a later order can point at.
 */
export const customersCreate: LemonSqueezyEndpoints['customersCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'customers.create',
			input: Inputs.customersCreate,
			output: Outputs.customersCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/v1/customers',
			body: {
				data: {
					type: 'customers',
					attributes: { name: parsed.name, email: parsed.email },
					relationships: {
						store: {
							data: { type: 'stores', id: String(parsed.storeId) },
						},
					},
				},
			},
		}),
		{
			log: (parsed, result) => ({
				customerId: result.data.id,
				storeId: parsed.storeId,
			}),
		},
	);

export const customersUpdate: LemonSqueezyEndpoints['customersUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'customers.update',
			input: Inputs.customersUpdate,
			output: Outputs.customersUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `/v1/customers/${segment(parsed.customerId)}`,
			body: {
				data: {
					type: 'customers',
					id: parsed.customerId,
					attributes: {
						name: parsed.name,
						email: parsed.email,
					},
				},
			},
		}),
		{ log: (parsed) => ({ customerId: parsed.customerId }) },
	);

// ── discounts ─────────────────────────────────────────────────────────────

export const discountsList: LemonSqueezyEndpoints['discountsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'discounts.list',
			input: Inputs.discountsList,
			output: Outputs.discountsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1/discounts',
			query: pageQuery(parsed, { store_id: parsed.storeId }),
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const discountsGet: LemonSqueezyEndpoints['discountsGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'discounts.get',
			input: Inputs.discountsGet,
			output: Outputs.discountsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/v1/discounts/${segment(parsed.discountId)}`,
		}),
		{ log: (parsed) => ({ discountId: parsed.discountId }) },
	);

/**
 * Creates a discount code. A `percent` amount is a percentage; a `fixed` amount
 * is in cents. A code Lemon Squeezy already holds answers 422 rather than
 * creating a second one.
 */
export const discountsCreate: LemonSqueezyEndpoints['discountsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'discounts.create',
			input: Inputs.discountsCreate,
			output: Outputs.discountsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/v1/discounts',
			body: {
				data: {
					type: 'discounts',
					attributes: {
						name: parsed.name,
						code: parsed.code,
						amount: parsed.amount,
						amount_type: parsed.amountType,
						duration: parsed.duration,
						duration_in_months: parsed.durationInMonths,
						is_limited_redemptions: parsed.isLimitedRedemptions,
						max_redemptions: parsed.maxRedemptions,
						starts_at: parsed.startsAt,
						expires_at: parsed.expiresAt,
					},
					relationships: {
						store: { data: { type: 'stores', id: String(parsed.storeId) } },
					},
				},
			},
		}),
		{
			log: (parsed, result) => ({
				discountId: result.data.id,
				code: parsed.code,
				amountType: parsed.amountType,
			}),
		},
	);

/** Deletes a discount code. In-flight discounts keep working. */
export const discountsDelete: LemonSqueezyEndpoints['discountsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'discounts.delete',
			input: Inputs.discountsDelete,
			output: Outputs.discountsDelete,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/v1/discounts/${segment(parsed.discountId)}`,
		}),
		{
			// A delete answers 204 with no body, so the result is built here.
			shape: (_raw, parsed) => ({
				deleted: true,
				discountId: parsed.discountId,
			}),
			log: (parsed) => ({ discountId: parsed.discountId }),
		},
	);

// ── discount redemptions ──────────────────────────────────────────────────

export const discountRedemptionsList: LemonSqueezyEndpoints['discountRedemptionsList'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'discountRedemptions.list',
				input: Inputs.discountRedemptionsList,
				output: Outputs.discountRedemptionsList,
			},
			input,
			(parsed) => ({
				method: 'GET',
				path: '/v1/discount-redemptions',
				query: pageQuery(parsed, {
					discount_id: parsed.discountId,
					order_id: parsed.orderId,
				}),
			}),
			{ log: (_, result) => ({ count: result.data.length }) },
		);

export const discountRedemptionsGet: LemonSqueezyEndpoints['discountRedemptionsGet'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'discountRedemptions.get',
				input: Inputs.discountRedemptionsGet,
				output: Outputs.discountRedemptionsGet,
			},
			input,
			(parsed) => ({
				method: 'GET',
				path: `/v1/discount-redemptions/${segment(parsed.discountRedemptionId)}`,
			}),
			{
				log: (parsed) => ({
					discountRedemptionId: parsed.discountRedemptionId,
				}),
			},
		);

// ── license keys ──────────────────────────────────────────────────────────

export const licenseKeysList: LemonSqueezyEndpoints['licenseKeysList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'licenseKeys.list',
			input: Inputs.licenseKeysList,
			output: Outputs.licenseKeysList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1/license-keys',
			query: pageQuery(parsed, {
				store_id: parsed.storeId,
				order_id: parsed.orderId,
				order_item_id: parsed.orderItemId,
				product_id: parsed.productId,
				status: parsed.status,
			}),
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

/**
 * Reads one license key. The answer carries the full `key`, so a caller that
 * only needs metadata should list instead and read `key_short`.
 */
export const licenseKeysGet: LemonSqueezyEndpoints['licenseKeysGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'licenseKeys.get',
			input: Inputs.licenseKeysGet,
			output: Outputs.licenseKeysGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/v1/license-keys/${segment(parsed.licenseKeyId)}`,
		}),
		{ log: (parsed) => ({ licenseKeyId: parsed.licenseKeyId }) },
	);

export const licenseKeysUpdate: LemonSqueezyEndpoints['licenseKeysUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'licenseKeys.update',
			input: Inputs.licenseKeysUpdate,
			output: Outputs.licenseKeysUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `/v1/license-keys/${segment(parsed.licenseKeyId)}`,
			body: {
				data: {
					type: 'license-keys',
					id: parsed.licenseKeyId,
					attributes: {
						activation_limit: parsed.activationLimit,
						expires_at: parsed.expiresAt,
						disabled: parsed.disabled,
					},
				},
			},
		}),
		{
			log: (parsed, result) => ({
				licenseKeyId: parsed.licenseKeyId,
				status: result.data.attributes.status ?? undefined,
			}),
		},
	);

// ── license key instances ─────────────────────────────────────────────────

export const licenseKeyInstancesList: LemonSqueezyEndpoints['licenseKeyInstancesList'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'licenseKeyInstances.list',
				input: Inputs.licenseKeyInstancesList,
				output: Outputs.licenseKeyInstancesList,
			},
			input,
			(parsed) => ({
				method: 'GET',
				path: '/v1/license-key-instances',
				query: pageQuery(parsed, { license_key_id: parsed.licenseKeyId }),
			}),
			{ log: (_, result) => ({ count: result.data.length }) },
		);

export const licenseKeyInstancesGet: LemonSqueezyEndpoints['licenseKeyInstancesGet'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'licenseKeyInstances.get',
				input: Inputs.licenseKeyInstancesGet,
				output: Outputs.licenseKeyInstancesGet,
			},
			input,
			(parsed) => ({
				method: 'GET',
				path: `/v1/license-key-instances/${segment(parsed.licenseKeyInstanceId)}`,
			}),
			{
				log: (parsed) => ({
					licenseKeyInstanceId: parsed.licenseKeyInstanceId,
				}),
			},
		);

// ── checkouts ─────────────────────────────────────────────────────────────

export const checkoutsList: LemonSqueezyEndpoints['checkoutsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'checkouts.list',
			input: Inputs.checkoutsList,
			output: Outputs.checkoutsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1/checkouts',
			query: pageQuery(parsed, {
				store_id: parsed.storeId,
				variant_id: parsed.variantId,
			}),
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const checkoutsGet: LemonSqueezyEndpoints['checkoutsGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'checkouts.get',
			input: Inputs.checkoutsGet,
			output: Outputs.checkoutsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/v1/checkouts/${segment(parsed.checkoutId)}`,
		}),
		{ log: (parsed) => ({ checkoutId: parsed.checkoutId }) },
	);

/**
 * Creates a checkout link. The point of the call is `data.attributes.url` in
 * the answer, which is the page to send a buyer to.
 */
export const checkoutsCreate: LemonSqueezyEndpoints['checkoutsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'checkouts.create',
			input: Inputs.checkoutsCreate,
			output: Outputs.checkoutsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/v1/checkouts',
			body: {
				data: {
					type: 'checkouts',
					attributes: {
						custom_price: parsed.customPrice,
						product_options: parsed.productOptions,
						checkout_options: parsed.checkoutOptions,
						checkout_data: parsed.checkoutData,
						expires_at: parsed.expiresAt,
						preview: parsed.preview,
						test_mode: parsed.testMode,
					},
					relationships: {
						store: { data: { type: 'stores', id: String(parsed.storeId) } },
						variant: {
							data: { type: 'variants', id: String(parsed.variantId) },
						},
					},
				},
			},
		}),
		{
			log: (parsed, result) => ({
				checkoutId: result.data.id,
				variantId: parsed.variantId,
				url: result.data.attributes.url ?? undefined,
			}),
		},
	);

// ── webhooks ──────────────────────────────────────────────────────────────

export const webhooksList: LemonSqueezyEndpoints['webhooksList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1/webhooks',
			query: pageQuery(parsed, { store_id: parsed.storeId }),
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const webhooksGet: LemonSqueezyEndpoints['webhooksGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.get',
			input: Inputs.webhooksGet,
			output: Outputs.webhooksGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/v1/webhooks/${segment(parsed.webhookId)}`,
		}),
		{ log: (parsed) => ({ webhookId: parsed.webhookId }) },
	);

/**
 * Registers a webhook. `secret` is required; Lemon Squeezy signs every delivery
 * with it and sends the digest in the `X-Signature` header.
 */
export const webhooksCreate: LemonSqueezyEndpoints['webhooksCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.create',
			input: Inputs.webhooksCreate,
			output: Outputs.webhooksCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/v1/webhooks',
			body: {
				data: {
					type: 'webhooks',
					attributes: {
						url: parsed.url,
						events: parsed.events,
						secret: parsed.secret,
					},
					relationships: {
						store: { data: { type: 'stores', id: String(parsed.storeId) } },
					},
				},
			},
		}),
		{
			// The secret is never logged: it is the value that signs deliveries.
			log: (parsed, result) => ({
				webhookId: result.data.id,
				url: parsed.url,
				events: parsed.events.length,
			}),
		},
	);

export const webhooksUpdate: LemonSqueezyEndpoints['webhooksUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.update',
			input: Inputs.webhooksUpdate,
			output: Outputs.webhooksUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `/v1/webhooks/${segment(parsed.webhookId)}`,
			body: {
				data: {
					type: 'webhooks',
					id: parsed.webhookId,
					attributes: {
						url: parsed.url,
						events: parsed.events,
						secret: parsed.secret,
					},
				},
			},
		}),
		{
			// The secret is never logged: it is the value that signs deliveries.
			log: (parsed, result) => ({
				webhookId: parsed.webhookId,
				url: result.data.attributes.url ?? undefined,
			}),
		},
	);

export const webhooksDelete: LemonSqueezyEndpoints['webhooksDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.delete',
			input: Inputs.webhooksDelete,
			output: Outputs.webhooksDelete,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/v1/webhooks/${segment(parsed.webhookId)}`,
		}),
		{
			// A delete answers 204 with no body, so the result is built here.
			shape: (_raw, parsed) => ({ deleted: true, webhookId: parsed.webhookId }),
			log: (parsed) => ({ webhookId: parsed.webhookId }),
		},
	);
