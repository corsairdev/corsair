import { timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { getHeader, logEventFromContext } from 'corsair/core';
import { getCrawl4aiWebhookPayloadSchema } from '../endpoints/openapi-schema';
import type { Crawl4aiWebhookPayloads } from '../endpoints/operation-types';
import type { Crawl4aiContext } from '../index';

/**
 * The self-hosted server POSTs to a job's `webhook_config.webhook_url` when a
 * crawl or LLM job completes or fails. It doesn't sign the delivery; it sends
 * the `webhook_headers` the job was created with. Create jobs with
 * `webhook_headers: { "X-Webhook-Secret": "<secret>" }` and give the plugin the
 * same secret: a delivery without it is refused.
 */
export const CRAWL4AI_WEBHOOK_SECRET_HEADER = 'x-webhook-secret';

function safeEqual(left: string, right: string): boolean {
	const a = Buffer.from(left);
	const b = Buffer.from(right);
	return a.length === b.length && timingSafeEqual(a, b);
}

export type Crawl4aiWebhookVerification =
	| { valid: true }
	| { valid: false; error: string };

export function verifyCrawl4aiWebhook(
	// `unknown` payload: only the header is checked.
	request: WebhookRequest<unknown>,
	secret: string | undefined,
): Crawl4aiWebhookVerification {
	if (request.hubVerified) return { valid: true };
	if (!secret) {
		return {
			valid: false,
			error:
				'No Crawl4AI webhook secret is set (plugin option webhookSecret or keys.set_webhook_signature)',
		};
	}
	const sent = getHeader(request.headers, CRAWL4AI_WEBHOOK_SECRET_HEADER);
	if (!sent) return { valid: false, error: 'Missing X-Webhook-Secret header' };
	return safeEqual(sent, secret)
		? { valid: true }
		: { valid: false, error: 'Invalid Crawl4AI webhook secret' };
}

/** The delivery's body, parsed when it came as text. */
// `unknown` because the body is untrusted until parsed.
function bodyOf(request: Pick<RawWebhookRequest, 'body'>): unknown {
	if (typeof request.body !== 'string') return request.body;
	try {
		return JSON.parse(request.body);
	} catch {
		return undefined;
	}
}

/** A job notification: `{ task_id, task_type: crawl | llm, status, ... }`. */
export function isCrawl4aiDelivery(request: RawWebhookRequest): boolean {
	const body = bodyOf(request);
	if (typeof body !== 'object' || body === null) return false;
	// `unknown` because the fields are narrowed one by one.
	const fields = body as Record<string, unknown>;
	return (
		typeof fields.task_id === 'string' &&
		(fields.task_type === 'crawl' || fields.task_type === 'llm') &&
		typeof fields.status === 'string'
	);
}

export type Crawl4aiWebhookId = keyof Crawl4aiWebhookPayloads;

export const crawl4aiWebhooksNested = {
	jobFinished: {
		match: (request) => isCrawl4aiDelivery(request),
		handler: async (ctx, request) => {
			const verification = verifyCrawl4aiWebhook(request, ctx.key);
			if (!verification.valid) {
				return { success: false, statusCode: 401, error: verification.error };
			}
			const parsed = getCrawl4aiWebhookPayloadSchema('jobFinished').safeParse(
				request.payload,
			);
			if (!parsed.success) {
				const where = parsed.error.issues
					.slice(0, 3)
					.map((issue) => issue.path.join('.') || 'payload')
					.join(', ');
				return {
					success: false,
					statusCode: 400,
					error: `Crawl4AI jobFinished payload did not match its documented schema (${where})`,
				};
			}
			const event = parsed.data as Crawl4aiWebhookPayloads['jobFinished'];
			await logEventFromContext(
				ctx,
				'crawl4ai.webhook.jobFinished',
				// The job id and outcome only: the payload can hold crawled pages.
				{ taskId: event.task_id, status: event.status },
				'completed',
			);
			return { success: true, data: event };
		},
	} satisfies CorsairWebhook<
		Crawl4aiContext,
		Crawl4aiWebhookPayloads['jobFinished'],
		Crawl4aiWebhookPayloads['jobFinished']
	>,
} as const;

export const crawl4aiWebhookSchemas = {
	jobFinished: {
		description:
			'A crawl or LLM job on the self-hosted server completed or failed (checked by the X-Webhook-Secret header)',
		get payload() {
			return getCrawl4aiWebhookPayloadSchema('jobFinished');
		},
		get response() {
			return getCrawl4aiWebhookPayloadSchema('jobFinished');
		},
	},
};
