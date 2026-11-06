import { createSign, constants as cryptoConstants } from 'node:crypto';
import { logEventFromContext } from 'corsair/core';
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
		if (
			SENSITIVE_INPUT_KEYS.has(key) ||
			SENSITIVE_INPUT_KEYS.has(camelToSnake(key))
		) {
			out[key] = REDACTED;
		}
	}
	return out;
}

function snakeToCamel(key: string): string {
	return key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

function camelToSnake(key: string): string {
	return key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

// Endpoint input shapes vary across 85 endpoints; accept a generic record
// and return unknown to support snake_case/camelCase property lookups safely.
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
	publicAccount?: unknown,
): Promise<string> {
	const options = ctx.options as {
		accountId?: string;
		account?: string;
	};
	// Authenticated requests must never read the account from endpoint input:
	// an untrusted caller could point the stored bearer token at a host they
	// control. Public endpoints (auth: 'none') carry no token, so their validated
	// account input is a safe fallback for datacenter discovery.
	const direct = options.accountId ?? options.account;
	if (direct) return direct;
	if (typeof publicAccount === 'string' && publicAccount.length > 0) {
		return publicAccount;
	}

	// Necessity: Cast ctx.keys through unknown to access provider-specific key getter functions (e.g. get_account_id).
	// Why stricter typing is not feasible: PluginKeyManager is generic across all Corsair plugins and does not define provider-specific account key accessors.
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

// Token-endpoint helpers default client_id and client_secret to the plugin
// options. Tokens themselves always come from the caller: filling in the
// connection's stored refresh token would hand a live access token to whoever
// calls the operation, and for public clients NetSuite rotates the refresh
// token on use, so the stored connection would stop working.
function applyClientCredentialDefaults(
	ctx: NetSuiteContext,
	input: Record<string, unknown>,
): void {
	const options = ctx.options as {
		clientId?: string;
		clientSecret?: string;
	};
	const fill = (field: string, value: string | null | undefined) => {
		if (value && read(input, field) === undefined) input[field] = value;
	};
	fill('client_id', options.clientId);
	fill('client_secret', options.clientSecret);
}

function assertRefreshInputs(input: Record<string, unknown>): void {
	// A public client (PKCE) has no secret; it sends client_id in the form.
	for (const [field, label] of [
		['client_id', 'client_id'],
		['refresh_token', 'refresh_token'],
	] as const) {
		const value = read(input, field);
		if (typeof value !== 'string' || value.length === 0) {
			throw new Error(
				`[auth-missing:netsuite]: oauth2TokenRefresh requires ${label}. Pass it in the input or configure the NetSuite plugin credentials.`,
			);
		}
	}
}

function clientBasicAuth(
	input: Record<string, unknown>,
	spec: RouteSpec,
): [string, string] | undefined {
	if (!spec.basicAuth) return undefined;
	const id = read(input, spec.basicAuth[0]);
	const secret = read(input, spec.basicAuth[1]);
	const hasSecret = typeof secret === 'string' && secret.length > 0;
	if (spec.basicAuthIfSecret && !hasSecret) return undefined;
	return [String(id ?? ''), String(secret ?? '')];
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

// The only algorithms NetSuite accepts for client-credentials assertions:
// RSA-PSS (PS*) and ECDSA (ES*). RS256 (PKCS#1 v1.5) and HMAC are rejected.
const JWT_DIGESTS = {
	PS256: 'SHA256',
	PS384: 'SHA384',
	PS512: 'SHA512',
	ES256: 'SHA256',
	ES384: 'SHA384',
	ES512: 'SHA512',
} as const;

type JwtAlgorithm = keyof typeof JWT_DIGESTS;

function isJwtAlgorithm(value: string): value is JwtAlgorithm {
	return Object.hasOwn(JWT_DIGESTS, value);
}

function signJwt(alg: string, privateKey: string, data: string): string {
	if (!isJwtAlgorithm(alg)) {
		throw new Error(`[netsuite] unsupported JWT algorithm ${alg}`);
	}
	const signer = createSign(JWT_DIGESTS[alg]).update(data);
	if (alg.startsWith('ES')) {
		return signer.sign(
			{ key: privateKey, dsaEncoding: 'ieee-p1363' },
			'base64url',
		);
	}
	return signer.sign(
		{
			key: privateKey,
			padding: cryptoConstants.RSA_PKCS1_PSS_PADDING,
			saltLength: cryptoConstants.RSA_PSS_SALTLEN_DIGEST,
		},
		'base64url',
	);
}

// NetSuite rejects assertions whose exp is 60 minutes or more after iat.
const MAX_ASSERTION_LIFETIME_SECONDS = 3600;

// NetSuite response payloads have heterogeneous structure; accept unknown
// to recursively search for href links in any response tree safely.
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

type NetSuiteEntityName =
	| 'customers'
	| 'customerPayments'
	| 'employees'
	| 'invoices'
	| 'items'
	| 'itemFulfillments'
	| 'itemReceipts'
	| 'journalEntries'
	| 'purchaseOrders'
	| 'salesOrders'
	| 'vendors'
	| 'vendorBills'
	| 'vendorPayments';

const RECORD_TYPE_ENTITIES: Record<string, NetSuiteEntityName> = {
	customer: 'customers',
	customerPayment: 'customerPayments',
	employee: 'employees',
	invoice: 'invoices',
	item: 'items',
	itemFulfillment: 'itemFulfillments',
	itemReceipt: 'itemReceipts',
	journalEntry: 'journalEntries',
	purchaseOrder: 'purchaseOrders',
	salesOrder: 'salesOrders',
	vendor: 'vendors',
	vendorBill: 'vendorBills',
	vendorPayment: 'vendorPayments',
};

// Type guard to determine if an arbitrary value is an object record.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Accepts unknown recordType input to safely validate string type and non-empty bounds.
function entityForRecordType(
	recordType: unknown,
): NetSuiteEntityName | undefined {
	if (typeof recordType !== 'string' || recordType.length === 0)
		return undefined;
	if (RECORD_TYPE_ENTITIES[recordType]) return RECORD_TYPE_ENTITIES[recordType];
	// Every NetSuite item subtype (inventoryItem, assemblyItem, ...) is stored
	// in the same `items` entity.
	if (recordType.endsWith('Item')) return 'items';
	return undefined;
}

function entityForSpec(
	spec: RouteSpec,
	input: Record<string, unknown>,
): NetSuiteEntityName | undefined {
	// Only top-level record routes map to entities. Sublist and subrecord
	// responses belong to their parent record.
	if (spec.path.startsWith('/record/v1/') && spec.path.split('/').length <= 5) {
		const resource = spec.path.split('/')[3];
		if (resource?.startsWith('{')) {
			const field = resource.slice(1, -1);
			return entityForRecordType(read(input, field));
		}
		if (resource) return entityForRecordType(resource);
	}
	if (spec.path.includes('!transform/')) {
		return entityForRecordType(read(input, 'target_record_type'));
	}
	return undefined;
}

function mergeCacheRecord(
	existing: Record<string, unknown>,
	incoming: Record<string, unknown>,
): Record<string, unknown> {
	const merged = { ...existing };
	for (const [key, value] of Object.entries(incoming)) {
		// NetSuite sends null to clear a field. Removing the key matches that
		// intent and keeps the stored record valid against optional schemas.
		if (value === null) {
			delete merged[key];
			continue;
		}
		merged[key] = value;
	}
	return merged;
}

// Accepts unknown response to extract item arrays from either collection envelopes or direct records.
function cacheItems(response: unknown): Record<string, unknown>[] {
	if (Array.isArray(response)) return response.filter(isRecord);
	if (!isRecord(response)) return [];
	if (Array.isArray(response.items)) return response.items.filter(isRecord);
	if (response.id !== undefined) return [response];
	return [];
}

function idFromLocation(location: string): string | undefined {
	// Only NetSuite record URLs (/record/v1/<recordType>/<id>) represent saved records.
	// Asynchronous job URLs (/async/v1/job/...) or query URLs must never be treated as record IDs.
	if (
		!location.includes('/record/v1/') ||
		/\/(?:async|job|jobs)\//i.test(location)
	) {
		return undefined;
	}
	const match = location.match(/\/record\/v1\/[^/?#]+\/([^/?#]+)/);
	if (!match?.[1]) return undefined;
	let id: string;
	try {
		id = decodeURIComponent(match[1]);
	} catch {
		id = match[1];
	}
	return id.startsWith('eid:') ? undefined : id;
}

// Cache updates for one record run one after another: each reads the saved
// row, merges and writes it back, so two at once could drop each other's
// fields. Keyed by account, entity and record id; within this process only.
const cacheLocks = new Map<string, Promise<void>>();

export async function withCacheLock(
	key: string,
	fn: () => Promise<void>,
): Promise<void> {
	const previous = cacheLocks.get(key) ?? Promise.resolve();
	const run = previous.then(fn);
	const tail = run.catch(() => undefined);
	cacheLocks.set(key, tail);
	try {
		await run;
	} finally {
		if (cacheLocks.get(key) === tail) cacheLocks.delete(key);
	}
}

// Accepts unknown response to sync heterogeneous entity record payloads into local tables.
async function syncEntityCache(
	ctx: NetSuiteContext,
	spec: RouteSpec,
	input: Record<string, unknown>,
	response: unknown,
	accountId: string,
): Promise<void> {
	const entity = entityForSpec(spec, input);
	if (!entity) return;

	// If the write or delete was queued asynchronously via Prefer: respond-async,
	// do not modify local cache until the job finishes successfully.
	const isAsync = /respond-async/i.test(
		String(read(input, 'prefer') ?? read(input, 'Prefer') ?? ''),
	);
	if (isAsync) return;

	// Necessity: Cast ctx.db through unknown to access dynamic local database entity store methods (findByEntityId, upsertByEntityId, deleteByEntityId).
	// Why stricter typing is not feasible: ctx.db has an untyped open record shape in the core plugin context because entity tables are dynamically injected from the plugin's schema definition.
	const db = ctx.db as unknown as
		| Record<
				string,
				| {
						findByEntityId?: (
							entityId: string,
						) => Promise<{ data?: Record<string, unknown> } | null | undefined>;
						upsertByEntityId?: (
							entityId: string,
							data: Record<string, unknown>,
						) => Promise<unknown>;
						deleteByEntityId?: (entityId: string) => Promise<unknown>;
				  }
				| undefined
		  >
		| undefined;
	const client = db?.[entity];
	if (!client) return;
	const lock = (id: string, fn: () => Promise<void>) =>
		withCacheLock(`${accountId}:${entity}:${id}`, fn);

	try {
		if (spec.method === 'DELETE') {
			const id = read(input, 'id');
			if (typeof id === 'string' || typeof id === 'number') {
				await lock(String(id), async () => {
					await client.deleteByEntityId?.(String(id));
				});
			}
			return;
		}
		if (!client.upsertByEntityId) return;

		const location = isRecord(response) ? response.location : undefined;
		const items = cacheItems(response);
		if (items.length > 0) {
			// A single-record GET without `fields` is the whole record. NetSuite
			// leaves empty fields out of it, so it replaces the saved row; merging
			// would keep values that were cleared in NetSuite. List items (id and
			// links only) and `fields=` reads are partial and merge instead.
			const fullRecord =
				spec.method === 'GET' &&
				!(isRecord(response) && Array.isArray(response.items)) &&
				read(input, 'fields') === undefined;
			for (const item of items) {
				const id = item.id ?? item.entityId;
				if (typeof id !== 'string' && typeof id !== 'number') continue;
				const stringId = String(id);
				await lock(stringId, async () => {
					const existing = fullRecord
						? undefined
						: await client.findByEntityId?.(stringId);
					const existingData =
						existing && isRecord(existing.data) ? existing.data : {};
					await client.upsertByEntityId?.(
						stringId,
						mergeCacheRecord(existingData, item),
					);
				});
			}
			return;
		}

		if (typeof location === 'string') {
			const id = idFromLocation(location);
			if (!id) return;
			const body = buildBody(input, spec);
			await lock(id, async () => {
				const existing = await client.findByEntityId?.(id);
				const existingData =
					existing && isRecord(existing.data) ? existing.data : {};
				const merged = mergeCacheRecord(
					existingData,
					isRecord(body) ? body : {},
				);
				// `location` here is the HTTP Location header (a URL). Records have their
				// own `location` field (a reference), so the URL is not stored.
				await client.upsertByEntityId?.(id, { ...merged, id });
			});
		}
	} catch (error) {
		console.warn(`[netsuite] failed to sync ${entity} cache:`, error);
	}
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
		if (
			!Number.isFinite(iat) ||
			!Number.isFinite(exp) ||
			exp <= iat ||
			exp - iat >= MAX_ASSERTION_LIFETIME_SECONDS
		) {
			throw new Error(
				'[netsuite] createJwtClientAssertion needs exp after iat and less than 60 minutes after it',
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
			{
				accountId,
				query:
					read(input, 'expandSubResources') === true
						? { expandSubResources: true }
						: undefined,
			},
		);
		return { field: selectField, ...referenced };
	}

	throw new Error(`[netsuite] unsupported custom endpoint ${key}`);
}

export async function runNetSuite<K extends NetSuiteSpecKey>(
	ctx: NetSuiteContext,
	event: string,
	input: NetSuiteEndpointInputs[K],
	spec: RouteSpec,
): Promise<NetSuiteEndpointOutputs[K]> {
	const resolvedInput = applyDefaults(input as Record<string, unknown>, spec);
	// The system-domain authorize URL is for callers that don't know the
	// account yet (NetSuite sends it back as `company`), so it needs none.
	const accountId =
		spec.custom === 'authorize-system'
			? ''
			: await resolveAccountId(
					ctx,
					spec.auth === 'none' ? read(resolvedInput, 'account') : undefined,
				);
	if (spec.basicAuth) applyClientCredentialDefaults(ctx, resolvedInput);
	if (event === 'oauth2TokenRefresh') assertRefreshInputs(resolvedInput);
	const basicAuth = clientBasicAuth(resolvedInput, spec);
	const formBody = buildForm(resolvedInput, spec);
	// A confidential client authenticates with the Basic header, so client_id
	// does not also go in the body (public clients send only the body field).
	if (basicAuth && formBody) formBody.client_id = undefined;
	const raw = spec.custom
		? await customEndpoint(
				event as NetSuiteSpecKey,
				resolvedInput,
				ctx,
				spec,
				accountId,
			)
		: // Transport returns either parsed object records or raw text (when responseHeader or parseJsonText is requested).
			await makeNetSuiteRequest<Record<string, unknown> | string>(
				spec.path,
				ctx.key,
				{
					method: spec.method,
					accountId,
					path: buildPath(resolvedInput, spec),
					query: buildQuery(resolvedInput, spec),
					headers: buildHeaders(resolvedInput, spec),
					body: buildBody(resolvedInput, spec),
					formBody,
					basicAuth,
					base: spec.base,
					auth: spec.auth,
					accept: spec.acceptFromInput
						? (String(
								read(resolvedInput, 'accept') ??
									spec.accept ??
									'application/json',
							) as string)
						: spec.accept,
					responseHeader: spec.responseHeader,
					parseJsonText: spec.parseJsonText,
				},
			);
	// Necessity: Cast raw response to Record<string, unknown> to inspect and cache NetSuite record properties.
	// Why stricter typing is not feasible: NetSuite REST API returns heterogeneous payloads (record objects, collection listings, metadata schemas, or location headers) across 85 distinct endpoints.
	const response =
		spec.responseHeader && typeof raw === 'string'
			? { location: raw }
			: ((raw ?? {}) as Record<string, unknown>);
	await syncEntityCache(ctx, spec, resolvedInput, response, accountId);
	await logEventFromContext(
		ctx,
		`netsuite.${event}`,
		redactInput(resolvedInput),
		'completed',
	);
	return response as NetSuiteEndpointOutputs[K];
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
