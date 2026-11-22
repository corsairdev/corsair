import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { AmikaRequest } from '../client';
import { makeAmikaRequest } from '../client';
import type { AmikaContext } from '../index';
import {
	amikaInputFields,
	amikaOperationFor,
	getAmikaInputSchema,
	getAmikaOutputSchema,
	MASKED_KEY,
	maskedIssuePath,
} from './openapi-schema';
import type {
	AmikaOperationId,
	AmikaOperationInputs,
	AmikaOperationOutputs,
} from './operation-types';

export type AmikaOperationEndpoint<Id extends AmikaOperationId> =
	CorsairEndpoint<
		AmikaContext,
		AmikaOperationInputs[Id],
		AmikaOperationOutputs[Id]
	>;

const SECOND = 1000;

/**
 * agentSessions.send waits for a whole agent turn (Amika's own SDK allows 10
 * minutes); a command run's output read can long-poll (max_ms). Everything
 * else answers in about a second.
 */
export function timeoutFor(id: string): number {
	if (id === 'agentSessions.send') return 600 * SECOND;
	if (id === 'commandRuns.listEvents') return 120 * SECOND;
	return 30 * SECOND;
}

type Issue = {
	path: readonly PropertyKey[];
	message: string;
	code?: string;
	keys?: readonly string[];
};

/**
 * Issue paths and zod's messages, which name what was expected rather than the
 * value sent. Map keys (env var and secret names) are masked, and so is every
 * unknown key the caller sent; the message lists the fields the operation
 * takes instead.
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
										amikaInputFields(id)
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

/**
 * One endpoint per manifest operation. The caller passes one flat object;
 * each named field goes to the path, query string or a header as the spec
 * says, and everything else is the JSON body.
 */
export function createAmikaOperation<Id extends AmikaOperationId>(
	id: Id,
): AmikaOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = amikaOperationFor(id);
		const parsedInput = getAmikaInputSchema(id).safeParse(input ?? {});
		if (!parsedInput.success) {
			// Paths and messages only: zod's messages name what was expected, not the value sent.
			throw new Error(
				`Invalid input for amika ${id}: ${describeIssues(id, parsedInput.error.issues, 'input', 5)}`,
			);
		}
		// Send what was validated, not the caller's object.
		// `unknown` is necessary because the fields differ per operation; each was just validated.
		const valid: Record<string, unknown> = { ...parsedInput.data };

		const pathParameters: Record<string, string> = {};
		// `unknown` because query values are validated scalars.
		const query: Record<string, unknown> = {};
		const headers: Record<string, string> = {};
		for (const field of amikaInputFields(id)) {
			if (field.in === 'body') continue;
			let value = valid[field.name];
			delete valid[field.name];
			if (field.generated && (value === undefined || value === '')) {
				// One key per call: core's 429 retries resend the same headers, so a
				// retried create can't make a second run or job.
				value = crypto.randomUUID();
			}
			if (value === undefined || value === null) continue;
			switch (field.in) {
				case 'path':
					pathParameters[field.name] = String(value);
					break;
				case 'header':
					headers[field.header ?? field.name] = String(value);
					break;
				case 'query':
					query[field.name] = value;
					break;
			}
		}

		const request: AmikaRequest = {
			key: ctx.key,
			method: operation.method,
			path: operation.path,
			pathParameters,
			query,
			headers,
			timeoutMs: timeoutFor(id),
		};
		// Fields Amika sets itself never go back, even when the caller passes an object it read.
		for (const name of operation.serverSetFields ?? []) delete valid[name];
		if (operation.request === 'json') request.body = valid;

		const body = await makeAmikaRequest(request);
		// `unknown` because the response is untrusted until the output schema parses it.
		const response: unknown =
			operation.response === 'empty' ? { success: true } : body;

		// The output schema is built from the documented response; a body that
		// doesn't match it is an error, never replaced with a default.
		const parsedOutput = getAmikaOutputSchema(id).safeParse(response);
		if (!parsedOutput.success) {
			throw new Error(
				`Amika ${id} response did not match its documented schema: ${describeIssues(id, parsedOutput.error.issues, 'output', 3)}`,
			);
		}

		// Inputs and results hold secrets, credentials, commands and env vars: log only which operation ran.
		await logEventFromContext(
			ctx,
			'amika.operation',
			{ operationId: id },
			'completed',
		);
		return parsedOutput.data as AmikaOperationOutputs[Id];
	};
}
