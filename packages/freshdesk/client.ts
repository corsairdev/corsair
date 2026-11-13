import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type {
	FreshdeskRouteDefinition,
	FreshdeskRouteInput,
	FreshdeskRouteOutput,
} from './endpoints/types';
import {
	createFreshdeskRouteInputSchema,
	FreshdeskRouteOutputSchema,
} from './endpoints/types';
import type { FreshdeskContext } from './index';

export class FreshdeskAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
		public readonly retryable = false,
	) {
		super(message);
		this.name = 'FreshdeskAPIError';
	}
}

const FRESHDESK_API_PATH = '/api/v2';

// Let the plugin handler own retries so non-idempotent writes are never
// replayed automatically. Keep extraction enabled so Freshdesk's Retry-After
// value remains available to the handler.
export const FRESHDESK_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

function normalizedParamName(name: string): string {
	return name.replace(/[-_]([a-z])/g, (_match, letter: string) =>
		letter.toUpperCase(),
	);
}

async function resolveDomain(ctx: FreshdeskContext): Promise<string> {
	const configured = ctx.options.domain;
	if (configured) return validateDomain(configured);
	throw new FreshdeskAPIError(
		'Freshdesk domain is not configured. Set the account-specific domain option.',
	);
}

function validateDomain(domain: string): string {
	const hostname = domain
		.trim()
		.toLowerCase()
		.replace(/^https?:\/\//, '')
		.replace(/\/$/, '');
	if (
		!hostname ||
		hostname.includes('/') ||
		hostname.includes('?') ||
		hostname.includes('#') ||
		!/^([a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(freshdesk\.com|myfreshworks\.com)$/.test(
			hostname,
		)
	) {
		throw new FreshdeskAPIError(
			'Freshdesk domain must be the account hostname provided by Freshdesk; custom CNAMEs are not supported.',
		);
	}
	return hostname;
}

function makeFormData(
	body: FreshdeskRouteInput['body'],
	attachments: FreshdeskRouteInput['attachments'],
): FormData {
	const formData = new FormData();
	for (const [key, value] of Object.entries(body ?? {})) {
		if (Array.isArray(value)) {
			for (const item of value) {
				formData.append(
					`${key}[]`,
					typeof item === 'string' ? item : JSON.stringify(item),
				);
			}
		} else if (
			typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'boolean'
		) {
			formData.append(key, String(value));
		} else if (value !== null && value !== undefined) {
			formData.append(key, JSON.stringify(value));
		}
	}
	for (const attachment of attachments ?? []) {
		const bytes = Uint8Array.from(atob(attachment.base64), (character) =>
			character.charCodeAt(0),
		);
		formData.append(
			'attachments[]',
			new Blob([bytes], { type: attachment.contentType }),
			attachment.filename,
		);
	}
	return formData;
}

export async function makeFreshdeskRequest(
	ctx: FreshdeskContext,
	apiKey: string,
	definition: FreshdeskRouteDefinition,
	input: FreshdeskRouteInput,
): Promise<FreshdeskRouteOutput> {
	if (!apiKey) throw new AuthMissingError('freshdesk', 'api_key');
	const parsedInput = createFreshdeskRouteInputSchema(definition).parse(input);
	const suppliedQuery = parsedInput.query ?? {};

	const path = definition.path.replace(
		/\[([^\]]+)\]/g,
		(_match, rawName: string) => {
			const value = parsedInput.pathParams?.[normalizedParamName(rawName)];
			if (!value)
				throw new Error(
					`Missing Freshdesk path parameter: ${normalizedParamName(rawName)}`,
				);
			return encodeURIComponent(value);
		},
	);
	const hostname = await resolveDomain(ctx);
	const config: OpenAPIConfig = {
		BASE: `https://${hostname}`,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		USERNAME: apiKey,
		PASSWORD: 'X',
		HEADERS: { Accept: 'application/json' },
	};
	const hasAttachments = (parsedInput.attachments?.length ?? 0) > 0;
	const isMultipart = definition.multipart && hasAttachments;
	const requestOptions: ApiRequestOptions = {
		method: definition.method,
		url: `${FRESHDESK_API_PATH}${path.replace('/api/v2', '')}`,
		query: { ...definition.queryDefaults, ...suppliedQuery },
		body:
			definition.method === 'POST' ||
			definition.method === 'PUT' ||
			definition.method === 'PATCH'
				? isMultipart
					? makeFormData(parsedInput.body, parsedInput.attachments)
					: parsedInput.body
				: undefined,
		mediaType: isMultipart ? undefined : 'application/json; charset=utf-8',
	};

	try {
		// unknown because provider JSON is untrusted until parsed by the output schema.
		const response = await request<unknown>(config, requestOptions, {
			rateLimitConfig: FRESHDESK_RATE_LIMIT_CONFIG,
		});
		return FreshdeskRouteOutputSchema.parse(response);
		// unknown because transport and fetch may reject with arbitrary values.
	} catch (error: unknown) {
		if (error instanceof FreshdeskAPIError) throw error;
		if (error instanceof ApiError) {
			// Freshdesk validation errors can echo request fields and customer PII.
			// Keep only status and Retry-After; never propagate the raw API body.
			throw new FreshdeskAPIError(
				`Freshdesk API request failed with status ${error.status}`,
				error.status,
				error.retryAfter,
				definition.method === 'GET',
			);
		}
		// unknown because network and fetch implementations can reject with non-Error values.
		throw new FreshdeskAPIError('Freshdesk API request failed');
	}
}

export async function invokeFreshdeskOperation(
	ctx: FreshdeskContext,
	input: FreshdeskRouteInput,
	definition: FreshdeskRouteDefinition,
): Promise<FreshdeskRouteOutput> {
	const response = await makeFreshdeskRequest(ctx, ctx.key, definition, input);
	// Freshdesk ticket/contact payloads contain PII; only route names and a
	// completion marker are emitted, never request inputs or response data.
	await logEventFromContext(
		ctx,
		'freshdesk.api',
		{
			method: definition.method,
			title: definition.title,
		},
		'completed',
	);
	return FreshdeskRouteOutputSchema.parse(response);
}
