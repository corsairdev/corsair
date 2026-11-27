import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { BinaryResponse } from 'corsair/http';
import { toFileOutput } from 'corsair/http';
import type { Crawl4aiRequest } from '../client';
import { encodeCrawl4aiPathValue, makeCrawl4aiRequest } from '../client';
import type { Crawl4aiContext } from '../index';
import {
	crawl4aiInputFields,
	crawl4aiOperationFor,
	getCrawl4aiInputSchema,
	getCrawl4aiOutputSchema,
	MASKED_KEY,
	maskedIssuePath,
} from './openapi-schema';
import type {
	Crawl4aiOperationId,
	Crawl4aiOperationInputs,
	Crawl4aiOperationOutputs,
} from './operation-types';

export type Crawl4aiOperationEndpoint<Id extends Crawl4aiOperationId> =
	CorsairEndpoint<
		Crawl4aiContext,
		Crawl4aiOperationInputs[Id],
		Crawl4aiOperationOutputs[Id]
	>;

type Issue = {
	path: readonly PropertyKey[];
	message: string;
	code?: string;
	keys?: readonly string[];
};

/**
 * Issue paths and zod's messages, which name what was expected rather than the
 * value sent. Map keys are masked, and so is every unknown key the caller
 * sent; the message lists the fields the operation takes instead.
 */
export function describeIssues(
	id: string,
	issues: readonly Issue[],
	mode: 'input' | 'output',
	limit: number,
): string {
	return issues
		.slice(0, limit)
		.map((issue) => {
			const where =
				maskedIssuePath(id, issue.path, mode) ||
				(mode === 'input' ? 'input' : 'response');
			const unknown = issue.keys?.length ?? 0;
			const message =
				issue.code === 'unrecognized_keys'
					? `${unknown} unknown field${unknown === 1 ? '' : 's'} (${Array(
							unknown,
						)
							.fill(MASKED_KEY)
							.join(', ')})${
							issue.path.length === 0 && mode === 'input'
								? `; this operation takes ${
										crawl4aiInputFields(id)
											.map((field) => field.name)
											.join(', ') || 'no fields'
									}`
								: ''
						}`
					: issue.message;
			return `${where}: ${message}`;
		})
		.join('; ');
}

// `unknown` because the value came from core's binary transport.
function isBinaryResponse(value: unknown): value is BinaryResponse {
	return (
		typeof value === 'object' &&
		value !== null &&
		'bytes' in value &&
		value.bytes instanceof Uint8Array
	);
}

/**
 * NDJSON (one JSON value per line, as the server's /crawl/stream and the
 * Cloud's job results answer) as a list. A line that isn't JSON is an error,
 * never skipped.
 */
export function parseNdjson(id: string, text: string): unknown[] {
	const items: unknown[] = [];
	for (const line of text.split('\n')) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		try {
			items.push(JSON.parse(trimmed));
		} catch {
			throw new Error(`Crawl4AI ${id} answered a line that is not JSON`);
		}
	}
	return items;
}

const EXTENSIONS: Record<string, string> = {
	'image/png': 'png',
	'application/pdf': 'pdf',
};

/**
 * One endpoint per manifest operation. The caller passes one flat object;
 * each named field goes to the path or query string as the route says, and
 * everything else is the JSON body.
 */
export function createCrawl4aiOperation<Id extends Crawl4aiOperationId>(
	id: Id,
): Crawl4aiOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = crawl4aiOperationFor(id);
		const parsedInput = getCrawl4aiInputSchema(id).safeParse(input ?? {});
		if (!parsedInput.success) {
			// Paths and messages only: zod's messages name what was expected, not the value sent.
			throw new Error(
				`Invalid input for crawl4ai ${id}: ${describeIssues(id, parsedInput.error.issues, 'input', 5)}`,
			);
		}
		// `server.crawl` with crawler_config.stream answers NDJSON, which is
		// what server.crawlStream reads; a watch made through the generic tool
		// runner would be a write filed as a read.
		const config = (
			input as { crawler_config?: { stream?: unknown } } | undefined
		)?.crawler_config;
		if (id === 'server.crawl' && config?.stream === true) {
			throw new Error(
				'Invalid input for crawl4ai server.crawl: crawler_config.stream: use server.crawlStream for a streamed crawl',
			);
		}
		if (
			id === 'cloud.tools.run' &&
			(input as { id?: unknown } | undefined)?.id === 'watch'
		) {
			throw new Error(
				'Invalid input for crawl4ai cloud.tools.run: id: use cloud.watch to create a watch',
			);
		}
		// Send what was validated, not the caller's object.
		// `unknown` is necessary because the fields differ per operation; each was just validated.
		const valid: Record<string, unknown> = { ...parsedInput.data };

		const pathParameters: Record<string, string> = {};
		// `unknown` because query values are validated scalars.
		const query: Record<string, unknown> = {};
		const headers: Record<string, string> = {};
		// `unknown` because body values are validated per operation.
		const body: Record<string, unknown> = {};
		const named = new Set<string>();
		for (const field of crawl4aiInputFields(id)) {
			named.add(field.name);
			const value = valid[field.name];
			if (value === undefined) continue;
			if (value === null && field.in !== 'body') continue;
			switch (field.in) {
				case 'path':
					pathParameters[field.wire] = encodeCrawl4aiPathValue(String(value));
					break;
				case 'query':
					query[field.wire] = value;
					break;
				case 'header':
					headers[field.wire] = String(value);
					break;
				case 'body-object':
					Object.assign(body, value);
					break;
				default:
					body[field.wire] = value;
			}
		}
		// Keys the schema let through (objects keep unknown keys, such as an
		// option the server adds) go in the body.
		for (const [name, value] of Object.entries(valid)) {
			if (!named.has(name) && value !== undefined) body[name] = value;
		}

		const request: Crawl4aiRequest = {
			host: operation.host,
			method: operation.method,
			path: operation.path,
			pathParameters,
			query,
			headers,
		};
		if (operation.request === 'json') request.body = body;

		// `unknown` because the response is untrusted until the output schema parses it.
		let response: unknown;
		const kind = operation.response;
		if (kind === 'json') {
			const raw = await makeCrawl4aiRequest(ctx, request);
			// The Cloud's streamed batch (stream: true) answers NDJSON as well.
			response =
				id === 'cloud.batch' && typeof raw === 'string'
					? { lines: parseNdjson(id, raw) }
					: raw;
		} else {
			request.responseType = 'binary';
			const binary = await makeCrawl4aiRequest(ctx, request);
			if (!isBinaryResponse(binary)) {
				throw new Error(`Crawl4AI ${id} answered without a body`);
			}
			const text = () => new TextDecoder().decode(binary.bytes);
			if (kind === 'ndjson') {
				response = { items: parseNdjson(id, text()) };
			} else if (kind === 'text') {
				response = { text: text() };
			} else if (kind === 'file') {
				if (binary.bytes.byteLength === 0) {
					throw new Error(`Crawl4AI ${id} answered without a file`);
				}
				response = toFileOutput(binary.bytes, binary.contentType, {
					filename: `crawl4ai-${String(parsedInput.data.artifact_id ?? 'artifact').replace(/[^\w.-]/g, '_')}`,
				});
			} else {
				// base64:<field>:<content type>
				const [, field = '', contentType = 'application/octet-stream'] =
					kind.split(':');
				let parsed: unknown;
				try {
					parsed = JSON.parse(text());
				} catch {
					throw new Error(
						`Crawl4AI ${id} answered with a body that is not JSON`,
					);
				}
				const encoded =
					typeof parsed === 'object' && parsed !== null
						? (parsed as Record<string, unknown>)[field]
						: undefined;
				if (typeof encoded !== 'string' || encoded.length === 0) {
					// The server answers success false and an error when the page
					// failed; its text can quote the page URL, so it stays out.
					throw new Error(`Crawl4AI ${id} answered without a ${field}`);
				}
				const artifactId =
					typeof parsed === 'object' && parsed !== null
						? (parsed as Record<string, unknown>).artifact_id
						: undefined;
				response = {
					...toFileOutput(Buffer.from(encoded, 'base64'), contentType, {
						filename: `crawl4ai-${field}.${EXTENSIONS[contentType] ?? 'bin'}`,
					}),
					// server.artifacts.get reads the same file back later.
					...(typeof artifactId === 'string'
						? { artifact_id: artifactId }
						: {}),
				};
			}
		}

		// The output schema is built from the route's own schema; a body that
		// doesn't match it is an error, never replaced with a default.
		const parsedOutput = getCrawl4aiOutputSchema(id).safeParse(response);
		if (!parsedOutput.success) {
			throw new Error(
				`Crawl4AI ${id} response did not match its documented schema: ${describeIssues(id, parsedOutput.error.issues, 'output', 3)}`,
			);
		}

		// Inputs and results hold page content, prompts and email addresses:
		// log only which operation ran.
		await logEventFromContext(
			ctx,
			'crawl4ai.operation',
			{ operationId: id },
			'completed',
		);
		return parsedOutput.data as Crawl4aiOperationOutputs[Id];
	};
}
