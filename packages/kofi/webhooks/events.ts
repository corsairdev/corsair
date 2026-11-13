import type { CorsairWebhook, CorsairWebhookMatcher } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { KofiContext } from '..';
import type { KofiPayment } from './types';
import { KofiPaymentSchema, kofiWebhookEventNames } from './types';
import type { KofiPaymentType } from './verify';
import { looksLikeKofiPayment, readPayment, verifyKofiPayment } from './verify';

/**
 * One handler per payment type: verify the token, parse the payment, log the
 * amount and currency but never the supporter's name, address or message, and
 * return the event.
 *
 * A refused delivery returns `success: false` with a status code, which
 * `processWebhook` passes back to the route: 401 for a token that does not
 * match, 400 for a body that is not a Ko-fi payment. Ko-fi retries anything
 * that is not a 200. When Hub already verified the delivery (`hubVerified`),
 * no key is supplied and the token check is skipped.
 */
function handlerFor(
	type: KofiPaymentType,
	match: CorsairWebhookMatcher,
): CorsairWebhook<KofiContext, KofiPayment, KofiPayment> {
	return {
		match,
		handler: async (ctx, request) => {
			const payment = readPayment(request.payload);
			// Hub verified the token before forwarding and supplies no key, so
			// only a missing payment is refused then.
			const verification =
				request.hubVerified && payment
					? ({ valid: true } as const)
					: verifyKofiPayment(payment, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: verification.statusCode,
					error: verification.error,
				};
			}

			const parsed = KofiPaymentSchema.safeParse(payment);
			if (!parsed.success) {
				return {
					success: false,
					statusCode: 400,
					error: `Invalid Ko-fi ${type} payload`,
				};
			}

			const data = parsed.data;
			// No supporter name, email, address or message: a payment
			// notification is personal data, and the amounts are what a log
			// needs to reconcile.
			await logEventFromContext(ctx, `kofi.webhook.${type}`, {
				type: data.type,
				messageId: data.message_id,
				amount: data.amount ?? undefined,
				currency: data.currency ?? undefined,
				isSubscriptionPayment: data.is_subscription_payment ?? undefined,
			});

			return { success: true, data };
		},
	};
}

/** A delivery is this type when its payment says so. */
function matchType(type: KofiPaymentType): CorsairWebhookMatcher {
	return (request) => {
		if (!looksLikeKofiPayment(request.body)) return false;
		const payment = readPayment(request.body);
		return payment?.type === type;
	};
}

export const donation = handlerFor(
	kofiWebhookEventNames.donation,
	matchType('Donation'),
);

export const subscription = handlerFor(
	kofiWebhookEventNames.subscription,
	matchType('Subscription'),
);

export const shopOrder = handlerFor(
	kofiWebhookEventNames.shopOrder,
	matchType('Shop Order'),
);

export const commission = handlerFor(
	kofiWebhookEventNames.commission,
	matchType('Commission'),
);
