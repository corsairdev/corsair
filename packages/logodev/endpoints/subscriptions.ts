import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { logoDevRequest } from '../client';
import type { LogoDevContext } from '../context';
import { requireKey } from './shared';
import type {
	BrandIdInput,
	SubscriptionResponse,
	UnsubscribeResponse,
} from './types';
import {
	BrandIdInputSchema,
	SubscriptionResponseSchema,
	UnsubscribeResponseSchema,
} from './types';

function subscriptionPath(brandId: string): string {
	return `/v2/brands/${encodeURIComponent(brandId)}/subscription`;
}

/** Whether the account follows a brand's update events (404 when it does not). */
export const getSubscription: CorsairEndpoint<
	LogoDevContext,
	BrandIdInput,
	SubscriptionResponse
> = async (ctx, input) => {
	const key = requireKey(ctx);
	const parsed = BrandIdInputSchema.parse(input);
	// `unknown` until SubscriptionResponseSchema parses it: untrusted provider JSON.
	const body = await logoDevRequest<unknown>(key, {
		path: subscriptionPath(parsed.brandId),
	});
	const result = SubscriptionResponseSchema.parse(body);
	await logEventFromContext(ctx, 'logodev.subscriptions.get', {}, 'completed');
	return result;
};

/** Follow a brand's update events. Idempotent: 200 if already subscribed, 201 if new. */
export const subscribe: CorsairEndpoint<
	LogoDevContext,
	BrandIdInput,
	SubscriptionResponse
> = async (ctx, input) => {
	const key = requireKey(ctx);
	const parsed = BrandIdInputSchema.parse(input);
	// `unknown` until SubscriptionResponseSchema parses it: untrusted provider JSON.
	const body = await logoDevRequest<unknown>(key, {
		method: 'PUT',
		path: subscriptionPath(parsed.brandId),
	});
	const result = SubscriptionResponseSchema.parse(body);
	await logEventFromContext(
		ctx,
		'logodev.subscriptions.subscribe',
		{},
		'completed',
	);
	return result;
};

/** Stop a brand's update events. The API answers 204 with no body. */
export const unsubscribe: CorsairEndpoint<
	LogoDevContext,
	BrandIdInput,
	UnsubscribeResponse
> = async (ctx, input) => {
	const key = requireKey(ctx);
	const parsed = BrandIdInputSchema.parse(input);
	await logoDevRequest<unknown>(key, {
		method: 'DELETE',
		path: subscriptionPath(parsed.brandId),
	});
	await logEventFromContext(
		ctx,
		'logodev.subscriptions.unsubscribe',
		{},
		'completed',
	);
	return UnsubscribeResponseSchema.parse({
		brandId: parsed.brandId,
		unsubscribed: true,
	});
};
