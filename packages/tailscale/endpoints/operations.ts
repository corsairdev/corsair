import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import type { TailscaleRequest } from '../client';
import {
	forgetTailscaleToken,
	makeTailscaleRawRequest,
	makeTailscaleRequest,
	tailscaleBearer,
} from '../client';
import type { TailscaleContext } from '../index';
import {
	getTailscaleInputSchema,
	getTailscaleOutputSchema,
	tailscaleInputFields,
	tailscaleOperationFor,
} from './openapi-schema';
import type {
	TailscaleOperationId,
	TailscaleOperationInputs,
	TailscaleOperationOutputs,
} from './operation-types';

export type TailscaleOperationEndpoint<Id extends TailscaleOperationId> =
	CorsairEndpoint<
		TailscaleContext,
		TailscaleOperationInputs[Id],
		TailscaleOperationOutputs[Id]
	>;

const SECOND = 1000;

/** Log reads can cover days of events; everything else answers in about a second. */
export function timeoutFor(id: string): number {
	return id.startsWith('logging.') ? 90 * SECOND : 30 * SECOND;
}

/** The ETag goes back quoted, as Tailscale sent it: `"e0b2816b418"`. */
export function quoteEtag(value: string): string {
	const trimmed = value.trim();
	return /^(W\/)?".*"$/.test(trimmed) ? trimmed : `"${trimmed}"`;
}

/** `details=true` answers `{ acl: <base64 HuJSON>, warnings, errors }`. */
function decodeBase64(text: string): string {
	try {
		return new TextDecoder().decode(
			Uint8Array.from(atob(text), (char) => char.charCodeAt(0)),
		);
	} catch {
		// Already text (Tailscale sends the file itself when it isn't encoded).
		return text;
	}
}

/**
 * The policy file as the caller asked for it: HuJSON text (comments kept),
 * a JSON object, or the detailed form, with the version from the ETag header.
 */
// `unknown` because the result is checked by the operation's output schema.
export function policyFileResult(
	text: string,
	etag: string | null,
	format: 'hujson' | 'json',
	details: boolean,
): unknown {
	if (details) {
		const body = JSON.parse(text) as {
			acl?: unknown;
			warnings?: unknown;
			errors?: unknown;
		};
		return {
			policy: typeof body.acl === 'string' ? decodeBase64(body.acl) : body.acl,
			etag,
			// Tailscale sends null, not [], when there are none.
			warnings: body.warnings,
			errors: body.errors,
		};
	}
	return { policy: format === 'json' ? JSON.parse(text) : text, etag };
}

function describeIssues(
	issues: readonly { path: readonly PropertyKey[]; message: string }[],
	fallback: string,
	limit: number,
): string {
	return issues
		.slice(0, limit)
		.map(
			(issue) =>
				`${issue.path.map(String).join('.') || fallback}: ${issue.message}`,
		)
		.join('; ');
}

/**
 * One endpoint per manifest operation. The caller passes one flat object;
 * each named field goes to the path, query string or a header as the spec
 * says, and everything else is the request body.
 */
export function createTailscaleOperation<Id extends TailscaleOperationId>(
	id: Id,
): TailscaleOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = tailscaleOperationFor(id);
		const parsedInput = getTailscaleInputSchema(id).safeParse(input ?? {});
		if (!parsedInput.success) {
			// Paths and messages only: zod's messages name what was expected, not the value sent.
			throw new Error(
				`Invalid input for tailscale ${id}: ${describeIssues(parsedInput.error.issues, 'input', 5)}`,
			);
		}
		// Send what was validated, not the caller's object.
		// `unknown` is necessary because the fields differ per operation; each was just validated.
		const valid: Record<string, unknown> = { ...parsedInput.data };

		const pathParameters: Record<string, string> = {};
		// `unknown` because query values are validated scalars or arrays.
		const query: Record<string, unknown> = {};
		const headers: Record<string, string> = {};
		// `unknown` because a whole body is a validated list, map, object or HuJSON text.
		let wholeBody: unknown;
		let format: 'hujson' | 'json' = 'hujson';
		for (const field of tailscaleInputFields(id)) {
			if (field.in === 'body') continue;
			let value = valid[field.name];
			delete valid[field.name];
			if (field.defaultsTo && (value === undefined || value === '')) {
				value =
					field.defaultsTo === 'tailnet' ? ctx.options?.tailnet || '-' : '-';
			}
			if (value === undefined || value === null) continue;
			switch (field.in) {
				case 'path':
					pathParameters[field.name] = String(value);
					break;
				case 'header':
					headers[field.header ?? field.name] =
						field.header === 'If-Match'
							? quoteEtag(String(value))
							: String(value);
					break;
				case 'query':
					query[field.name] =
						field.commaSeparated && Array.isArray(value)
							? value.join(',')
							: value;
					break;
				case 'filters':
					for (const [key, filter] of Object.entries(
						value as Record<string, unknown>,
					)) {
						query[key] = filter;
					}
					break;
				case 'body-whole':
					if (wholeBody !== undefined) {
						throw new Error(
							`Invalid input for tailscale ${id}: give either policy or tests, not both`,
						);
					}
					wholeBody = value;
					break;
				case 'format':
					format = value === 'json' ? 'json' : 'hujson';
					break;
			}
		}
		if (id === 'policyFile.validate' && wholeBody === undefined) {
			throw new Error(
				'Invalid input for tailscale policyFile.validate: give policy (a draft policy file) or tests (ACL tests to run against the current one)',
			);
		}

		const token = await tailscaleBearer(ctx.key);
		const request: TailscaleRequest = {
			token,
			method: operation.method,
			path: operation.path,
			pathParameters,
			query,
			headers,
			timeoutMs: timeoutFor(id),
		};
		if (id === 'services.update' && valid.name === undefined) {
			// The body repeats the Service's name, and Tailscale refuses it without
			// ("" is not a valid service name).
			valid.name = pathParameters.serviceName;
		}
		if (operation.request === 'json') {
			request.body = wholeBody !== undefined ? wholeBody : valid;
		}

		// `unknown` because the response is untrusted until the output schema parses it.
		let response: unknown;
		try {
			if (operation.response === 'policy') {
				const details = query.details === true;
				if (!details) {
					headers.Accept =
						format === 'json' ? 'application/json' : 'application/hujson';
				}
				const raw = await makeTailscaleRawRequest(request);
				response = policyFileResult(
					raw.text,
					raw.headers.get('etag'),
					format,
					details,
				);
			} else {
				const body = await makeTailscaleRequest(request);
				response =
					operation.response === 'empty'
						? { success: true }
						: operation.emptyMeansNone && (body === undefined || body === '')
							? null
							: body;
			}
		} catch (error) {
			// A revoked or rescoped OAuth client: the next call exchanges the secret again.
			if (error instanceof ApiError && error.status === 401) {
				await forgetTailscaleToken(ctx.key);
			}
			throw error;
		}

		// The output schema is built from the documented response; a body that
		// doesn't match it is an error, never replaced with a default.
		const parsedOutput = getTailscaleOutputSchema(id).safeParse(response);
		if (!parsedOutput.success) {
			throw new Error(
				`Tailscale ${id} response did not match its documented schema: ${describeIssues(parsedOutput.error.issues, 'response', 3)}`,
			);
		}

		// Inputs and results hold policy files, emails, keys and IP addresses: log only which operation ran.
		await logEventFromContext(
			ctx,
			'tailscale.operation',
			{ operationId: id },
			'completed',
		);
		return parsedOutput.data as TailscaleOperationOutputs[Id];
	};
}
