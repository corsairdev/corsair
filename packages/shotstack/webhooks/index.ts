import type {
	CorsairWebhook,
	RawWebhookRequest,
	WebhookResponse,
} from 'corsair/core';
import { asRecord, getHeader, logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { z } from 'zod';
import type { ShotstackContext } from '..';
import type { ShotstackRequest } from '../client';
import { attributesOf, segment, shotstackRequest } from '../client';

/**
 * Shotstack POSTs JSON to the `callback` URL of a render (renders.create,
 * templates.render) or a source fetch (sources.fetch) when the job ends, and
 * a `serve` callback when the hosting copy of a render is ready. Captured
 * live on the stage environment (11-28): every delivery carries
 * `User-Agent: Shotstack-Webhook/1.0`, `X-Shotstack-Event-Type: render |
 * source | serve` and `X-Shotstack-Attempt: <n>`, and a body with `type` and
 * `action` (`edit`/`render`, `ingest`/`source`, `serve`/`copy`).
 *
 * Shotstack does not sign callbacks ("We do not currently provide signed
 * payloads ... make a request to the API using your API key and the render
 * ID and ensure all data matches", shotstack.io/docs/guide webhooks). So each
 * handler looks the job up with the account's key and answers with the API's
 * own status, URL and error: a forged delivery for an id the account does not
 * have is refused, and a forged status or URL is replaced by the real one.
 */

const STATUS = z
	.string()
	.describe(
		'The job status: done or failed for a render, ready or failed for a source or hosted copy.',
	);

const baseFields = {
	id: z.string().describe('The render, source or hosted asset id.'),
	owner: z.string().describe('The Shotstack account (owner) id.'),
	status: STATUS,
	url: z
		.string()
		.nullish()
		.describe('Where the output or ingested file is, read back from the API.'),
	error: z.string().nullish().describe('Why the job failed, when it did.'),
	completed: z.string().nullish().describe('When the job ended (ISO 8601).'),
};

const RenderCallbackSchema = z
	.object({
		type: z.literal('edit'),
		action: z.literal('render'),
		...baseFields,
		poster: z.string().nullish(),
		thumbnail: z.string().nullish(),
	})
	.loose();

const SourceCallbackSchema = z
	.object({
		type: z.literal('ingest'),
		action: z.literal('source'),
		...baseFields,
	})
	.loose();

const ServeCallbackSchema = z
	.object({
		type: z.literal('serve'),
		action: z.string().describe('copy: the hosting copy of an output.'),
		...baseFields,
		render: z
			.string()
			.nullish()
			.describe('The render id the hosted asset came from.'),
	})
	.loose();

export type ShotstackRenderCallback = z.output<typeof RenderCallbackSchema>;
export type ShotstackSourceCallback = z.output<typeof SourceCallbackSchema>;
export type ShotstackServeCallback = z.output<typeof ServeCallbackSchema>;

export type ShotstackWebhookPayloads = {
	render: ShotstackRenderCallback;
	source: ShotstackSourceCallback;
	serve: ShotstackServeCallback;
};

type WebhookId = keyof ShotstackWebhookPayloads;

const PAYLOAD_SCHEMAS = {
	render: RenderCallbackSchema,
	source: SourceCallbackSchema,
	serve: ServeCallbackSchema,
} as const;

/** The `type` each callback body carries. */
const BODY_TYPES: Record<WebhookId, string> = {
	render: 'edit',
	source: 'ingest',
	serve: 'serve',
};

function bodyOf(request: RawWebhookRequest): Record<string, unknown> | null {
	if (typeof request.body === 'string') {
		try {
			return asRecord(JSON.parse(request.body));
		} catch {
			return null;
		}
	}
	return asRecord(request.body);
}

/** Which callback a delivery is: the event-type header, else the body's `type`. */
export function shotstackWebhookIdOf(
	request: RawWebhookRequest,
): WebhookId | undefined {
	const header = getHeader(request.headers, 'x-shotstack-event-type');
	if (header === 'render' || header === 'source' || header === 'serve') {
		return header;
	}
	const type = bodyOf(request)?.type;
	const agent = getHeader(request.headers, 'user-agent') ?? '';
	if (!agent.startsWith('Shotstack-Webhook')) return undefined;
	return (Object.keys(BODY_TYPES) as WebhookId[]).find(
		(id) => BODY_TYPES[id] === type,
	);
}

/** Any Shotstack callback (the plugin's webhook matcher). */
export function isShotstackDelivery(request: RawWebhookRequest): boolean {
	return shotstackWebhookIdOf(request) !== undefined;
}

type Fresh = {
	owner?: unknown;
	status?: unknown;
	url?: unknown;
	error?: unknown;
};

/** The job as the API reports it, for the id in the callback. */
async function lookUp(
	ctx: ShotstackContext,
	id: WebhookId,
	jobId: string,
): Promise<Fresh> {
	const requests: Record<WebhookId, ShotstackRequest> = {
		render: {
			method: 'GET',
			service: 'edit',
			path: `/render/${segment(jobId)}`,
			query: { data: false },
		},
		source: {
			method: 'GET',
			service: 'ingest',
			path: `/sources/${segment(jobId)}`,
		},
		serve: {
			method: 'GET',
			service: 'serve',
			path: `/assets/${segment(jobId)}`,
		},
	};
	const raw = await shotstackRequest(ctx, requests[id]);
	if (id === 'render') {
		return (asRecord(asRecord(raw)?.response) ?? {}) as Fresh;
	}
	const attributes = attributesOf(raw);
	// A source reports its file as `source`; a hosted asset as `url`.
	return id === 'source'
		? { ...attributes, url: attributes.source ?? attributes.url }
		: attributes;
}

function refuse(statusCode: number, error: string): WebhookResponse<never> {
	return { success: false, statusCode, error };
}

function shotstackWebhook<Id extends WebhookId>(
	id: Id,
): CorsairWebhook<
	ShotstackContext,
	ShotstackWebhookPayloads[Id],
	ShotstackWebhookPayloads[Id]
> {
	return {
		match: (request) => shotstackWebhookIdOf(request) === id,
		handler: async (ctx, request) => {
			const parsed = PAYLOAD_SCHEMAS[id].safeParse(request.payload);
			if (!parsed.success) {
				// Paths only: the payload holds URLs of the account's files.
				const where = parsed.error.issues
					.slice(0, 3)
					.map((issue) => issue.path.join('.') || 'payload')
					.join(', ');
				return refuse(
					400,
					`Shotstack ${id} callback did not match its documented shape (${where})`,
				);
			}
			const payload = parsed.data as ShotstackWebhookPayloads[Id];

			let event = payload;
			const verify =
				request.hubVerified !== true && ctx.options?.verifyWebhooks !== false;
			if (verify) {
				if (!ctx.key) {
					return refuse(
						401,
						'No Shotstack API key to check the callback with (Shotstack does not sign callbacks)',
					);
				}
				let fresh: Fresh;
				try {
					fresh = await lookUp(ctx, id, payload.id);
				} catch (error) {
					if (
						error instanceof ApiError &&
						(error.status === 404 || error.status === 400)
					) {
						return refuse(
							401,
							`Shotstack has no ${id} with this id for the account's key`,
						);
					}
					// Shotstack or the network failed: ask Shotstack to send it again.
					return refuse(503, `Could not check the Shotstack ${id} callback`);
				}
				if (typeof fresh.owner === 'string' && fresh.owner !== payload.owner) {
					return refuse(
						401,
						`The Shotstack ${id} callback names another account`,
					);
				}
				event = {
					...payload,
					status:
						typeof fresh.status === 'string' ? fresh.status : payload.status,
					url: typeof fresh.url === 'string' ? fresh.url : payload.url,
					error:
						typeof fresh.error === 'string' && fresh.error
							? fresh.error
							: (payload.error ?? null),
				};
			}

			await logEventFromContext(
				ctx,
				`shotstack.webhook.${id}`,
				// Ids and status only: URLs point at the account's files.
				{
					jobId: event.id,
					status: event.status,
					attempt: getHeader(request.headers, 'x-shotstack-attempt'),
					checked: verify,
				},
				'completed',
			);
			return { success: true, data: event };
		},
	};
}

export const shotstackWebhooksNested = {
	render: shotstackWebhook('render'),
	source: shotstackWebhook('source'),
	serve: shotstackWebhook('serve'),
} as const;

export const shotstackWebhookSchemas = {
	render: {
		description:
			'A render (renders.create or templates.render with a callback URL) finished: status done or failed, with the output URL. Checked against the API, since Shotstack does not sign callbacks.',
		payload: RenderCallbackSchema,
		response: RenderCallbackSchema,
	},
	source: {
		description:
			'A source fetch (sources.fetch with a callback URL) finished: status ready or failed, with the ingested file URL. Checked against the API.',
		payload: SourceCallbackSchema,
		response: SourceCallbackSchema,
	},
	serve: {
		description:
			'The hosting copy of a render output is ready on the Shotstack CDN (sent with render callbacks): the durable CDN URL and the render id. Checked against the API.',
		payload: ServeCallbackSchema,
		response: ServeCallbackSchema,
	},
} as const;
