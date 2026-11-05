import {
	createHmac,
	createSign,
	constants as cryptoConstants,
} from 'node:crypto';
import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import type { NetSuiteContext } from '..';
import {
	makeNetSuiteRequest,
	netSuiteAccountBase,
	normalizeAccountHost,
} from '../client';
import type { NetSuiteSpecKey, RouteSpec } from './specs';
import { netSuiteSpecs } from './specs';
import type { NetSuiteEndpointInputs, NetSuiteEndpointOutputs } from './types';
import {
	NetSuiteEndpointInputSchemas,
	NetSuiteEndpointOutputSchemas,
} from './types';

const CLIENT_ASSERTION_TYPE =
	'urn:ietf:params:oauth:client-assertion-type:jwt-bearer';

const REDACTED = '[redacted]';
const SENSITIVE_INPUT_KEYS = new Set([
	'client_secret',
	'private_key_pem',
	'token',
	'refresh_token',
	'code',
	'code_verifier',
	'client_assertion',
	'id_token_hint',
]);

function redactInput(input: Record<string, unknown>): Record<string, unknown> {
	const out: Record<string, unknown> = { ...input };
	for (const key of Object.keys(out)) {
		if (SENSITIVE_INPUT_KEYS.has(key)) out[key] = REDACTED;
	}
	return out;
}

function snakeToCamel(key: string): string {
	return key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

function camelToSnake(key: string): string {
	return key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

function read(input: Record<string, unknown>, key: string): unknown {
	if (input[key] !== undefined) return input[key];
	const camel = snakeToCamel(key);
	if (input[camel] !== undefined) return input[camel];
	const snake = camelToSnake(key);
	if (input[snake] !== undefined) return input[snake];
	return undefined;
}

async function resolveAccountId(
	ctx: NetSuiteContext,
	input: Record<string, unknown>,
): Promise<string> {
	const options = ctx.options as {
		accountId?: string;
		account?: string;
	};
	const direct =
		(typeof read(input, 'account_id') === 'string'
			? (read(input, 'account_id') as string)
			: undefined) ??
		options.accountId ??
		options.account;
	if (direct) return direct;

	const keys = ctx.keys as unknown as Record<
		string,
		(() => Promise<string | null | undefined>) | undefined
	>;
	for (const name of ['get_account_id', 'get_account', 'get_accountId']) {
		const value = await keys?.[name]?.();
		if (value) return value;
	}
	throw new Error(
		'[auth-missing:netsuite]: NetSuite accountId is required. Set `accountId` on the plugin options or store it under the `account_id` account key.',
	);
}

function applyDefaults(
	input: Record<string, unknown>,
	spec: RouteSpec,
): Record<string, unknown> {
	if (!spec.defaults) return input;
	const out = { ...input };
	for (const [key, value] of Object.entries(spec.defaults)) {
		if (read(out, key) === undefined) out[key] = value;
	}
	return out;
}

function buildPath(
	input: Record<string, unknown>,
	spec: RouteSpec,
): Record<string, string> | undefined {
	if (!spec.pathParams?.length) return undefined;
	const path: Record<string, string> = {};
	for (const key of spec.pathParams) {
		const value = read(input, key);
		if (value === undefined || value === null || value === '') {
			throw new Error(`[netsuite] missing path parameter ${key}`);
		}
		path[key] = String(value);
	}
	return path;
}

function buildQuery(
	input: Record<string, unknown>,
	spec: RouteSpec,
): Record<string, string | number | boolean | undefined> | undefined {
	if (!spec.query?.length) return undefined;
	const query: Record<string, string | number | boolean | undefined> = {};
	for (const key of spec.query) {
		const value = read(input, key);
		if (value === undefined || value === null) continue;
		query[key] = Array.isArray(value)
			? value.join(',')
			: (value as string | number | boolean);
	}
	return query;
}

function buildHeaders(
	input: Record<string, unknown>,
	spec: RouteSpec,
): Record<string, string> | undefined {
	const headers: Record<string, string> = {};
	for (const [header, aliases] of Object.entries(spec.headers ?? {})) {
		for (const alias of aliases) {
			const value = read(input, alias);
			if (value !== undefined && value !== null && value !== '') {
				headers[header] = String(value);
				break;
			}
		}
	}
	if (spec.preferTransient) headers.Prefer = 'transient';
	return Object.keys(headers).length > 0 ? headers : undefined;
}

function collectInputBody(
	input: Record<string, unknown>,
	spec: RouteSpec,
): Record<string, unknown> {
	const reserved = new Set<string>([
		'Prefer',
		'prefer',
		'replace',
		'replaceSelectedFields',
		'replace_selected_fields',
		'idempotency_key',
		'property_name_validation',
		'property_value_validation',
		'X-NetSuite-Idempotency-Key',
		'X-NetSuite-PropertyNameValidation',
		'X-NetSuite-PropertyValueValidation',
		...(spec.pathParams ?? []),
		...(spec.query ?? []),
		...Object.values(spec.headers ?? {}).flat(),
	]);
	const body: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(input)) {
		if (!reserved.has(key) && value !== undefined) body[key] = value;
	}
	return body;
}

function buildBody(
	input: Record<string, unknown>,
	spec: RouteSpec,
): Record<string, unknown> | undefined {
	if (spec.bodyFromInput?.length) {
		const body: Record<string, unknown> = {};
		for (const key of spec.bodyFromInput) {
			const value = read(input, key);
			if (value !== undefined) body[key] = value;
		}
		return body;
	}
	if (spec.body === 'none') return undefined;
	if (spec.body === 'input') return collectInputBody(input, spec);
	if (spec.body === 'body')
		return (input.body as Record<string, unknown> | undefined) ?? {};
	if (spec.body === 'data')
		return (input.data as Record<string, unknown> | undefined) ?? {};
	if (spec.body === 'record_body')
		return (input.record_body as Record<string, unknown> | undefined) ?? {};
	return undefined;
}

function buildForm(
	input: Record<string, unknown>,
	spec: RouteSpec,
): Record<string, string | number | boolean | undefined> | undefined {
	if (!spec.formBody && !spec.staticForm) return undefined;
	const form: Record<string, string | number | boolean | undefined> = {};
	for (const [formKey, inputKey] of Object.entries(spec.formBody ?? {})) {
		const value = read(input, inputKey);
		if (value !== undefined && value !== null) {
			form[formKey] = value as string | number | boolean;
		}
	}
	return { ...form, ...spec.staticForm };
}

function base64Url(value: string | Buffer): string {
	return Buffer.from(value).toString('base64url');
}

function signJwt(alg: string, privateKey: string, data: string): string {
	if (alg === 'HS256') {
		return createHmac('sha256', privateKey).update(data).digest('base64url');
	}
	if (alg === 'RS256') {
		return createSign('RSA-SHA256').update(data).sign(privateKey, 'base64url');
	}
	if (alg === 'ES256') {
		return createSign('SHA256')
			.update(data)
			.sign({ key: privateKey, dsaEncoding: 'ieee-p1363' }, 'base64url');
	}
	return createSign('RSA-SHA256').update(data).sign(
		{
			key: privateKey,
			padding: cryptoConstants.RSA_PKCS1_PSS_PADDING,
			saltLength: cryptoConstants.RSA_PSS_SALTLEN_DIGEST,
		},
		'base64url',
	);
}

function firstHref(value: unknown, depth = 0): string | undefined {
	if (!value || depth > 4) return undefined;
	if (Array.isArray(value)) {
		for (const item of value) {
			const found = firstHref(item, depth + 1);
			if (found) return found;
		}
		return undefined;
	}
	if (typeof value !== 'object') return undefined;
	const obj = value as Record<string, unknown>;
	const links = obj.links;
	if (Array.isArray(links)) {
		for (const link of links) {
			if (!link || typeof link !== 'object') continue;
			const href = (link as Record<string, unknown>).href;
			if (typeof href === 'string' && href) return href;
		}
	}
	for (const nested of Object.values(obj)) {
		const found = firstHref(nested, depth + 1);
		if (found) return found;
	}
	return undefined;
}

function assertPathSegment(value: string): string {
	if (/[/\\?#]/.test(value)) {
		throw new Error('[netsuite] invalid path segment');
	}
	return value;
}

function toRequestPath(href: string): string {
	let path = href;
	if (/^https?:\/\//i.test(href)) {
		const url = new URL(href);
		path = `${url.pathname}${url.search}`;
	}
	if (path.startsWith('/services/rest'))
		path = path.slice('/services/rest'.length);
	return path || '/';
}

async function customEndpoint(
	key: NetSuiteSpecKey,
	input: Record<string, unknown>,
	ctx: NetSuiteContext,
	spec: RouteSpec,
	accountId: string,
): Promise<Record<string, unknown>> {
	if (
		spec.custom === 'authorize-account' ||
		spec.custom === 'authorize-system'
	) {
		const system = spec.custom === 'authorize-system';
		const url = new URL(
			system
				? 'https://system.netsuite.com/app/login/oauth2/authorize.nl'
				: `https://${normalizeAccountHost(accountId)}.app.netsuite.com/app/login/oauth2/authorize.nl`,
		);
		const control = new Set(['response_type']);
		if (!input.response_type) url.searchParams.set('response_type', 'code');
		for (const [param, value] of Object.entries(input)) {
			if (value === undefined || value === null || value === '') continue;
			if (control.has(param) && input.response_type === undefined) continue;
			url.searchParams.set(param, String(value));
		}
		return { authorization_url: url.toString(), url: url.toString() };
	}

	if (spec.custom === 'jwt-client-assertion') {
		const alg = String(input.alg ?? 'PS256');
		const iat = Number(input.iat ?? Math.floor(Date.now() / 1000));
		const exp = Number(input.exp ?? iat + 300);
		const options = ctx.options as {
			clientId?: string;
			certificateId?: string;
			privateKeyPem?: string;
		};
		const clientId =
			(input.client_id as string | undefined) ?? options.clientId;
		const certificateId =
			(input.certificate_id as string | undefined) ?? options.certificateId;
		const privateKey =
			(input.private_key_pem as string | undefined) ?? options.privateKeyPem;
		const aud =
			(input.aud as string | undefined) ??
			`${netSuiteAccountBase(accountId)}/services/rest/auth/oauth2/v1/token`;
		if (!clientId || !privateKey || !certificateId) {
			throw new Error(
				'[netsuite] createJwtClientAssertion requires client_id, certificate_id, and private_key_pem',
			);
		}
		const header = base64Url(
			JSON.stringify({ alg, typ: 'JWT', kid: certificateId }),
		);
		const payload = base64Url(
			JSON.stringify({
				iss: clientId,
				scope: input.scope,
				aud,
				iat,
				exp,
			}),
		);
		const signature = signJwt(alg, privateKey, `${header}.${payload}`);
		return {
			client_assertion: `${header}.${payload}.${signature}`,
			client_assertion_type: CLIENT_ASSERTION_TYPE,
			token_url: aud,
			expires_at: exp,
		};
	}

	if (spec.custom === 'reference-select') {
		const recordType = assertPathSegment(String(read(input, 'record_type')));
		const id = assertPathSegment(String(read(input, 'id')));
		const selectField = String(read(input, 'select_field'));
		const parent = await makeNetSuiteRequest<Record<string, unknown>>(
			`/record/v1/${recordType}/${id}`,
			ctx.key,
			{ accountId, query: { fields: selectField } },
		);
		const field = parent[selectField];
		const href = firstHref(field);
		if (!href) return { field: selectField, value: field };
		const referenced = await makeNetSuiteRequest<Record<string, unknown>>(
			toRequestPath(href),
			ctx.key,
			{ accountId },
		);
		return { field: selectField, ...referenced };
	}

	if (spec.custom === 'list-integrations') {
		const query = buildQuery(input, spec);
		const run = async (table: string) =>
			await makeNetSuiteRequest<Record<string, unknown>>(
				'/query/v1/suiteql',
				ctx.key,
				{
					method: 'POST',
					accountId,
					query,
					headers: { Prefer: 'transient' },
					body: { q: `SELECT * FROM ${table} ORDER BY id` },
				},
			);
		try {
			return await run('integrationapplication');
		} catch (error) {
			if (
				error instanceof ApiError &&
				error.status === 400 &&
				/integrationapplication|invalid table|unknown table/i.test(
					String(error.message),
				)
			) {
				return await run('integration');
			}
			throw error;
		}
	}

	throw new Error(`[netsuite] unsupported custom endpoint ${key}`);
}

export async function runNetSuite<K extends NetSuiteSpecKey>(
	ctx: NetSuiteContext,
	event: string,
	input: NetSuiteEndpointInputs[K],
	spec: RouteSpec,
): Promise<NetSuiteEndpointOutputs[K]> {
	const accountId = await resolveAccountId(
		ctx,
		input as Record<string, unknown>,
	);
	const resolvedInput = applyDefaults(input as Record<string, unknown>, spec);
	const response = spec.custom
		? await customEndpoint(
				event as NetSuiteSpecKey,
				resolvedInput,
				ctx,
				spec,
				accountId,
			)
		: await makeNetSuiteRequest<Record<string, unknown>>(spec.path, ctx.key, {
				method: spec.method,
				accountId,
				path: buildPath(resolvedInput, spec),
				query: buildQuery(resolvedInput, spec),
				headers: buildHeaders(resolvedInput, spec),
				body: buildBody(resolvedInput, spec),
				formBody: buildForm(resolvedInput, spec),
				basicAuth: spec.basicAuth
					? [
							String(read(resolvedInput, spec.basicAuth[0]) ?? ''),
							String(read(resolvedInput, spec.basicAuth[1]) ?? ''),
						]
					: undefined,
				base: spec.base,
				auth: spec.auth,
				accept: spec.acceptFromInput
					? (String(
							read(resolvedInput, 'accept') ??
								spec.accept ??
								'application/json',
						) as string)
					: spec.accept,
			});
	await logEventFromContext(
		ctx,
		`netsuite.${event}`,
		redactInput(resolvedInput),
		'completed',
	);
	return (response ?? {}) as NetSuiteEndpointOutputs[K];
}

export type NetSuiteEndpointHandler = <K extends NetSuiteSpecKey>(
	ctx: NetSuiteContext,
	input: NetSuiteEndpointInputs[K],
) => Promise<NetSuiteEndpointOutputs[K]>;

export function makeNetSuiteEndpoint<K extends NetSuiteSpecKey>(
	key: K,
): (
	ctx: NetSuiteContext,
	input: NetSuiteEndpointInputs[K],
) => Promise<NetSuiteEndpointOutputs[K]> {
	const inputSchema = NetSuiteEndpointInputSchemas[key];
	const outputSchema = NetSuiteEndpointOutputSchemas[key];
	const handler = async (
		ctx: NetSuiteContext,
		input: NetSuiteEndpointInputs[K],
	) => {
		const validated = inputSchema.parse(input);
		const response = await runNetSuite<K>(
			ctx,
			key,
			validated as NetSuiteEndpointInputs[K],
			netSuiteSpecs[key],
		);
		return outputSchema.parse(response) as NetSuiteEndpointOutputs[K];
	};
	return handler;
}
