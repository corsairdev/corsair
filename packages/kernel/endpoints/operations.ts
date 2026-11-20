import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { BinaryResponse, FileInput } from 'corsair/http';
import { resolveFileInput, toFileOutput } from 'corsair/http';
import type { KernelRequest } from '../client';
import { makeKernelPagedRequest, makeKernelRequest } from '../client';
import type { KernelContext } from '../index';
import type { KernelOperationDefinition } from './manifest';
import {
	getKernelInputSchema,
	getKernelOutputSchema,
	kernelInputFields,
	kernelOperationFor,
	kernelPagingField,
} from './openapi-schema';
import type {
	KernelOperationId,
	KernelOperationInputs,
	KernelOperationOutputs,
} from './operation-types';

export type KernelOperationEndpoint<Id extends KernelOperationId> =
	CorsairEndpoint<
		KernelContext,
		KernelOperationInputs[Id],
		KernelOperationOutputs[Id]
	>;

/** The largest file an upload reads from a URL or base64 (core's own default). */
export const KERNEL_UPLOAD_MAX_BYTES = 25 * 1024 * 1024;

const SECOND = 1000;
/** Time for the answer to travel back after Kernel's own deadline. */
const MARGIN_MS = 30 * SECOND;
const SLOW_CALL_MS = 120 * SECOND;

/**
 * Calls that take longer than core's 20 s default: starting a browser (more so
 * with stealth or a profile), deleting one (a profile saves on delete), file
 * transfers, and managed-auth logins. Calls with their own deadline wait for
 * it plus a margin (see timeoutFor).
 */
const SLOW_OPERATIONS = new Set<string>([
	'auditLogs.exportChunk',
	'auditLogs.exportDestinations.test',
	'auth.connections.create',
	'auth.connections.login',
	'auth.connections.submit',
	'browserPools.create',
	'browserPools.flush',
	'browserPools.update',
	'browsers.computer.batch',
	'browsers.computer.captureScreenshot',
	'browsers.create',
	'browsers.delete',
	'browsers.fs.downloadDirZip',
	'browsers.fs.readFile',
	'browsers.fs.upload',
	'browsers.fs.uploadZip',
	'browsers.fs.writeFile',
	'browsers.loadExtensions',
	'browsers.replays.download',
	'browsers.replays.stop',
	'browsers.saveProfile',
	'configRegistry.resolve',
	'credentialProviders.test',
	'deployments.create',
	'extensions.download',
	'extensions.downloadFromChromeStore',
	'extensions.upload',
	'invocations.create',
	'profiles.download',
	'proxies.check',
	'workloadIdentityIssuers.verify',
]);

// `unknown` because the value is a validated input field of any type.
function number(value: unknown, fallback: number): number {
	return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/** How long to wait for one call, from the operation and its own deadline field. */
// `unknown` because each operation's validated input has its own fields.
export function timeoutFor(id: string, input: Record<string, unknown>): number {
	switch (id) {
		case 'browsers.playwright.execute':
		case 'browsers.repl':
		case 'browsers.webmcp.invokeTool':
			return number(input.timeout_sec, 60) * SECOND + MARGIN_MS;
		case 'browsers.process.exec':
			return number(input.timeout_sec, 90) * SECOND + MARGIN_MS;
		case 'browsers.curl':
		case 'search.create':
			return number(input.timeout_ms, 30_000) + MARGIN_MS;
		case 'search.contents.fetch':
			return number(input.timeout_ms, 60_000) + MARGIN_MS;
		case 'browserPools.acquire':
			return number(input.acquire_timeout_seconds, 60) * SECOND + MARGIN_MS;
		case 'vaults.items.get':
		case 'vaults.items.events':
			return number(input.wait, 0) * SECOND + MARGIN_MS;
	}
	return SLOW_OPERATIONS.has(id) ? SLOW_CALL_MS : MARGIN_MS;
}

// `unknown` because a multipart value is a validated scalar, file, list or object.
function isFileValue(value: unknown): value is FileInput {
	if (typeof Blob !== 'undefined' && value instanceof Blob) return true;
	if (typeof value === 'string') return false;
	return (
		typeof value === 'object' &&
		value !== null &&
		!Array.isArray(value) &&
		('base64' in value || 'url' in value)
	);
}

/**
 * Forms whose list items go as consecutive unindexed pairs. The browser's own
 * server reads an extension upload as `extensions.name` then
 * `extensions.zip_file`, one pair per extension, and refuses
 * `extensions[0][name]` with 400 "invalid field" (kernel-images
 * server/cmd/api/api/chromium.go; found in the live test).
 */
const DOTTED_FORMS = new Set(['browsers.loadExtensions']);

/**
 * Multipart fields the way Kernel's SDK sends them: `files[0][file]`,
 * `files[0][dest_path]`, `env_vars[KEY]`. Each file field is turned into
 * bytes with core's `resolveFileInput` (a public URL is downloaded, base64 is
 * decoded) before the form is built.
 */
async function buildForm(
	operation: KernelOperationDefinition,
	// `unknown` because the body fields are validated per operation.
	body: Record<string, unknown>,
): Promise<FormData> {
	const fileFields = fileFieldNames(operation);
	const dotted = DOTTED_FORMS.has(operation.id);
	const form = new FormData();
	// `unknown` because a multipart value is a validated scalar, file, list or object.
	const add = async (key: string, value: unknown, leaf: string) => {
		if (value === undefined || value === null) return;
		if (fileFields.has(leaf) && isFileValue(value)) {
			const resolved = await resolveFileInput(value, {
				maxBytes: KERNEL_UPLOAD_MAX_BYTES,
				fallbackName: leaf === 'zip_file' ? 'archive.zip' : 'file',
			});
			form.append(key, resolved.file, resolved.filename);
			return;
		}
		if (
			typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'boolean'
		) {
			form.append(key, String(value));
			return;
		}
		if (Array.isArray(value)) {
			for (const [index, item] of value.entries()) {
				await add(dotted ? key : `${key}[${index}]`, item, leaf);
			}
			return;
		}
		if (typeof value === 'object') {
			for (const [name, inner] of Object.entries(value)) {
				await add(dotted ? `${key}.${name}` : `${key}[${name}]`, inner, name);
			}
		}
	};
	for (const [name, value] of Object.entries(body)) {
		await add(name, value, name);
	}
	return form;
}

/** Names of the properties that hold a file anywhere in the operation's input. */
function fileFieldNames(operation: KernelOperationDefinition): Set<string> {
	const names = new Set<string>();
	// `unknown` because the walk covers raw JSON Schema documents.
	const visit = (schema: unknown, name: string | undefined) => {
		if (typeof schema !== 'object' || schema === null) return;
		const record = schema as Record<string, unknown>;
		if (record.format === 'binary' && name) names.add(name);
		const properties = record.properties;
		if (typeof properties === 'object' && properties !== null) {
			for (const [key, value] of Object.entries(properties)) visit(value, key);
		}
		if (record.items) visit(record.items, name);
	};
	visit(operation.input, undefined);
	return names;
}

/** What to call a downloaded file, from the operation and the call's inputs. */
// `unknown` because each operation's validated input has its own fields.
export function fileNameFor(
	id: string,
	input: Record<string, unknown>,
): string {
	const text = (value: unknown, fallback: string) =>
		typeof value === 'string' && value.length > 0 ? value : fallback;
	const base = (path: unknown, fallback: string) =>
		text(path, fallback).replace(/\/+$/, '').split('/').pop() || fallback;
	switch (id) {
		case 'browsers.computer.captureScreenshot':
			return 'screenshot.png';
		case 'browsers.fs.readFile':
			return base(input.path, 'file');
		case 'browsers.fs.downloadDirZip':
			return `${base(input.path, 'directory')}.zip`;
		case 'browsers.replays.download':
			return `replay-${text(input.replay_id, 'recording')}.mp4`;
		case 'profiles.download':
			return `profile-${text(input.id_or_name, 'archive')}.${text(input.format, 'tar.zst')}`;
		case 'extensions.download':
			return `${text(input.id_or_name, 'extension')}.zip`;
		case 'extensions.downloadFromChromeStore':
			return 'chrome-extension.zip';
		case 'auditLogs.exportChunk':
			return `audit-logs.${text(input.format, 'jsonl.gz')}`;
	}
	return 'file';
}

/** Recordings and profile archives answer 202 with no body while Kernel is still preparing them. */
const PREPARED_DOWNLOADS = new Set([
	'browsers.replays.download',
	'profiles.download',
]);

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
 * One endpoint per manifest operation. The caller passes one flat object;
 * each named field goes to the path, query string or a header as the spec
 * says, and everything else is the request body.
 */
export function createKernelOperation<Id extends KernelOperationId>(
	id: Id,
): KernelOperationEndpoint<Id> {
	return async (ctx, input) => {
		const operation = kernelOperationFor(id);
		const parsedInput = getKernelInputSchema(id).safeParse(input ?? {});
		if (!parsedInput.success) {
			// Paths and messages only: zod's messages name what was expected, not the value sent.
			const issues = parsedInput.error.issues
				.slice(0, 5)
				.map((issue) => `${issue.path.join('.') || 'input'}: ${issue.message}`)
				.join('; ');
			throw new Error(`Invalid input for kernel ${id}: ${issues}`);
		}
		// Send what was validated, not the caller's object.
		// `unknown` is necessary because the fields differ per operation; each was just validated.
		const valid: Record<string, unknown> = { ...parsedInput.data };

		const pathParameters: Record<string, string> = {};
		// `unknown` because query values are validated scalars, arrays or a string map.
		const query: Record<string, unknown> = {};
		const headers: Record<string, string> = {};
		for (const field of kernelInputFields(id)) {
			if (field.in === 'body') continue;
			const value = valid[field.name];
			delete valid[field.name];
			if (value === undefined || value === null) continue;
			if (field.in === 'path') pathParameters[field.name] = String(value);
			else if (field.in === 'header')
				headers[field.header ?? field.name] = String(value);
			else if (field.commaSeparated && Array.isArray(value))
				query[field.name] = value.join(',');
			else query[field.name] = value;
		}

		const request: KernelRequest = {
			apiKey: ctx.key,
			method: operation.method,
			path: operation.path,
			pathParameters,
			query,
			headers,
			timeoutMs: timeoutFor(id, parsedInput.data),
		};
		if (operation.request === 'json') {
			request.body = valid;
		} else if (operation.request === 'multipart') {
			request.body = await buildForm(operation, valid);
		} else if (operation.request === 'binary') {
			const resolved = await resolveFileInput(valid.file as FileInput, {
				maxBytes: KERNEL_UPLOAD_MAX_BYTES,
				fallbackName: 'file',
			});
			request.body = new Blob([new Uint8Array(resolved.bytes)], {
				type: 'application/octet-stream',
			});
		}

		// `unknown` because the response is untrusted until the output schema parses it.
		let response: unknown;
		const pagingField = kernelPagingField(operation);
		if (operation.paging) {
			if (operation.response === 'file') request.responseType = 'binary';
			const page = await makeKernelPagedRequest(request);
			const hasMore = page.headers.get('x-has-more') === 'true';
			const nextHeader =
				operation.paging === 'offset'
					? 'x-next-offset'
					: operation.paging === 'page_token'
						? 'x-next-page-token'
						: 'x-next-cursor';
			const nextRaw = page.headers.get(nextHeader);
			const next =
				!hasMore || nextRaw === null || nextRaw === ''
					? null
					: operation.paging === 'offset'
						? Number(nextRaw)
						: nextRaw;
			if (operation.response === 'file') {
				if (!isBinaryResponse(page.body))
					throw new Error('Kernel returned no file');
				response = {
					...toFileOutput(page.body.bytes, page.body.contentType, {
						filename: fileNameFor(id, parsedInput.data),
					}),
					has_more: hasMore,
					next_cursor: next,
				};
			} else {
				response = {
					items: page.body,
					has_more: hasMore,
					[pagingField ?? 'next_offset']: next,
				};
			}
		} else if (operation.response === 'file') {
			request.responseType = 'binary';
			const binary = await makeKernelRequest(request);
			if (!isBinaryResponse(binary)) throw new Error('Kernel returned no file');
			if (binary.bytes.byteLength === 0 && PREPARED_DOWNLOADS.has(id)) {
				throw new Error(
					'Kernel is still preparing this file (202 Accepted); call again in a few seconds.',
				);
			}
			response = toFileOutput(binary.bytes, binary.contentType, {
				filename: fileNameFor(id, parsedInput.data),
			});
		} else {
			const body = await makeKernelRequest(request);
			if (operation.response === 'empty') {
				response = { success: true };
			} else if (
				operation.emptyMeansNone &&
				(body === undefined || body === '')
			) {
				response = null;
			} else {
				response = body;
			}
		}

		// The output schema is built from the documented response; a body that
		// doesn't match it is an error, never replaced with a default.
		const parsedOutput = getKernelOutputSchema(id).safeParse(response);
		if (!parsedOutput.success) {
			const issues = parsedOutput.error.issues
				.slice(0, 3)
				.map(
					(issue) => `${issue.path.join('.') || 'response'}: ${issue.message}`,
				)
				.join('; ');
			throw new Error(
				`Kernel ${id} response did not match its documented schema: ${issues}`,
			);
		}

		// Inputs and results hold page content, code and credentials: log only which operation ran.
		await logEventFromContext(
			ctx,
			'kernel.operation',
			{ operationId: id },
			'completed',
		);
		return parsedOutput.data as KernelOperationOutputs[Id];
	};
}
