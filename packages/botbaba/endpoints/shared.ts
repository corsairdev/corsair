import type { BotbabaRequestOptions } from '../client';
import { makeBotbabaRequest } from '../client';

type BotbabaCallContext = {
	key: string;
};

export async function botbabaCall<T>(
	ctx: BotbabaCallContext,
	path: string,
	options: BotbabaRequestOptions = {},
): Promise<T> {
	return await makeBotbabaRequest<T>(path, ctx.key, options);
}

export function compactBody(
	body: Record<string, unknown>,
): Record<string, unknown> {
	const compacted: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(body)) {
		if (value !== undefined) compacted[key] = value;
	}
	return compacted;
}

const SHOPIFY_HEADER_ALIASES: Array<[string, string[]]> = [
	['X-Shopify-Topic', ['X-Shopify-Topic', 'x_shopify_topic']],
	['X-Shopify-Webhook-Id', ['X-Shopify-Webhook-Id', 'x_shopify_webhook_id']],
	['X-Shopify-API-Version', ['X-Shopify-API-Version', 'x_shopify_api_version']],
	['X-Shopify-Hmac-SHA256', ['X-Shopify-Hmac-SHA256', 'x_shopify_hmac_sha256']],
	['X-Shopify-Shop-Domain', ['X-Shopify-Shop-Domain', 'x_shopify_shop_domain']],
	[
		'X-Shopify-Triggered-At',
		['X-Shopify-Triggered-At', 'x_shopify_triggered_at'],
	],
	['X-Shopify-Event-Id', ['X-Shopify-Event-Id', 'x_shopify_event_id']],
];

export function shopifyHeaders(
	input: Record<string, unknown>,
): Record<string, string> | undefined {
	const headers: Record<string, string> = {};
	for (const [header, keys] of SHOPIFY_HEADER_ALIASES) {
		for (const key of keys) {
			const value = input[key];
			if (typeof value === 'string' && value.length > 0) {
				headers[header] = value;
				break;
			}
		}
	}
	return Object.keys(headers).length > 0 ? headers : undefined;
}
