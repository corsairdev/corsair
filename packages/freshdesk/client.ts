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
	const configured = ctx.options.domain || (await ctx.keys.get_domain());
	if (configured) return validateDomain(configured);
	throw new AuthMissingError(
		'freshdesk',
		'api_key',
		'Freshdesk domain is not set: connect the account with its helpdesk hostname or set the domain option.',
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

const JSON_PART_FIELDS = new Set(['structured_body']);

const SAFE_ERROR_TOKEN = /^[A-Za-z0-9_.[\]-]{1,64}$/;

// Freshdesk error bodies list { field, message, code }; messages can echo
// request values, so only the field names and machine codes are kept.
function describeFreshdeskErrors(body: unknown): string {
	if (typeof body !== 'object' || body === null || !('errors' in body))
		return '';
	const errors = (body as { errors: unknown }).errors;
	if (!Array.isArray(errors)) return '';
	const parts = errors
		.map((entry: unknown) => {
			if (typeof entry !== 'object' || entry === null) return null;
			const { field, code } = entry as { field?: unknown; code?: unknown };
			const safeCode =
				typeof code === 'string' && SAFE_ERROR_TOKEN.test(code) ? code : null;
			if (!safeCode) return null;
			return typeof field === 'string' && SAFE_ERROR_TOKEN.test(field)
				? `${field}: ${safeCode}`
				: safeCode;
		})
		.filter((part): part is string => part !== null)
		.slice(0, 10);
	return parts.length > 0 ? ` (${parts.join(', ')})` : '';
}

function stripQuery(url: string): string {
	const index = url.indexOf('?');
	return index === -1 ? url : url.slice(0, index);
}

// Rebuild core's ApiError so status, Retry-After and the rate-limit fields
// (what error handlers and core read) survive, while the provider body, the
// request body and query values (search filters hold emails) are dropped.
function sanitizeApiError(error: ApiError): ApiError {
	return new ApiError(
		{ method: error.request.method, url: stripQuery(error.request.url) },
		{
			url: stripQuery(error.url),
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: undefined,
		},
		`Freshdesk API request failed with status ${error.status}${describeFreshdeskErrors(error.body)}`,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

function makeFormData(
	body: FreshdeskRouteInput['body'],
	attachments: FreshdeskRouteInput['attachments'],
	attachmentField: string,
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
		} else if (JSON_PART_FIELDS.has(key) && value !== null) {
			// The reference's multipart samples send structured_body as one JSON
			// part: -F 'structured_body={"body_contents":[...]}'.
			formData.append(key, JSON.stringify(value));
		} else if (value !== null && value !== undefined) {
			// Freshdesk reads multipart objects as bracketed parts, e.g.
			// fields[name]=0 for imports and custom_fields[cf_x]=y for tickets.
			for (const [nestedKey, nestedValue] of Object.entries(value)) {
				if (nestedValue === null || nestedValue === undefined) continue;
				formData.append(
					`${key}[${nestedKey}]`,
					typeof nestedValue === 'object'
						? JSON.stringify(nestedValue)
						: String(nestedValue),
				);
			}
		}
	}
	for (const attachment of attachments ?? []) {
		const bytes = Uint8Array.from(atob(attachment.base64), (character) =>
			character.charCodeAt(0),
		);
		formData.append(
			attachmentField,
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
					? makeFormData(
							parsedInput.body,
							parsedInput.attachments,
							definition.multipartField ?? 'attachments[]',
						)
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
			// Freshdesk validation errors can echo request fields and customer PII,
			// so the ApiError is rebuilt without the raw API body or request data.
			throw sanitizeApiError(error);
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
