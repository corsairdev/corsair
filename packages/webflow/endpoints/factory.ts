import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeWebflowRequest } from '../client';
import type { WebflowContext } from '../index';
import type { WebflowOperation, webflowOperations } from './operations';
import type { WebflowEndpointInput } from './types';

const PATH_PARAM_KEYS = [
	'site_id',
	'collection_id',
	'field_id',
	'item_id',
	'asset_id',
	'asset_folder_id',
	'page_id',
	'component_id',
	'order_id',
	'webhook_id',
] as const;

const INPUT_CONTROL_KEYS = new Set(['body', 'query', 'headers', 'baseUrl']);
const EVICT_PAGE_SIZE = 100;
const MAX_EVICT_PASSES = 50;

type WebflowOperationKey = (typeof webflowOperations)[number]['key'];

// responses are operation-specific json passed through to callers; they
// stay unknown on this shared handler type and callers narrow them
export type WebflowEndpoint = CorsairEndpoint<
	WebflowContext,
	WebflowEndpointInput,
	unknown
>;

type CacheRule = {
	entity: string;
	idKeys: string[];
	listKeys?: string[];
	itemKeys?: string[];
	deleteInputKeys?: string[];
	// keys in the request body holding arrays of target ids (bare strings
	// or { id } records) whose cached entities should be evicted; webflow
	// bulk deletes and publishes put target ids in the body, not the path
	deleteBodyItemsKeys?: string[];
	omitKeys?: string[];
	// cached field -> request input key. webflow item responses do not echo
	// their parent collection id, so stamp it from the request at upsert
	// time to make cascade eviction possible later
	stampInputKeys?: Record<string, string>;
	// when this rule evicts its entity, also evict cached `entity` rows
	// whose `matchField` equals the evicted id (webflow deletes a
	// collection's items server-side when the collection is deleted)
	cascadeDelete?: { entity: string; matchField: string };
	mergeExisting?: boolean;
	evictAllEntities?: string[];
};

const CACHE_RULES: Partial<Record<WebflowOperationKey, CacheRule>> = {
	listSites: { entity: 'sites', idKeys: ['id'], listKeys: ['sites'] },
	getSite: { entity: 'sites', idKeys: ['id'] },
	updateSite: { entity: 'sites', idKeys: ['id'] },
	publishSite: {
		entity: 'sites',
		idKeys: ['id'],
		deleteInputKeys: ['site_id'],
		evictAllEntities: ['collectionItems'],
	},
	listCollections: {
		entity: 'collections',
		idKeys: ['id'],
		listKeys: ['collections'],
		stampInputKeys: { siteId: 'site_id' },
		mergeExisting: true,
	},
	createCollection: {
		entity: 'collections',
		idKeys: ['id'],
		stampInputKeys: { siteId: 'site_id' },
	},
	getCollection: { entity: 'collections', idKeys: ['id'] },
	createCollectionField: {
		entity: 'collections',
		idKeys: ['id'],
		deleteInputKeys: ['collection_id'],
	},
	updateCollectionField: {
		entity: 'collections',
		idKeys: ['id'],
		deleteInputKeys: ['collection_id'],
	},
	deleteCollectionField: {
		entity: 'collections',
		idKeys: ['id'],
		deleteInputKeys: ['collection_id'],
	},
	deleteCollection: {
		entity: 'collections',
		idKeys: ['id'],
		deleteInputKeys: ['collection_id'],
		cascadeDelete: { entity: 'collectionItems', matchField: 'collectionId' },
	},
	listCollectionItems: {
		entity: 'collectionItems',
		idKeys: ['id'],
		listKeys: ['items'],
		stampInputKeys: { collectionId: 'collection_id' },
	},
	getCollectionItem: {
		entity: 'collectionItems',
		idKeys: ['id'],
		stampInputKeys: { collectionId: 'collection_id' },
	},
	createCollectionItem: {
		entity: 'collectionItems',
		idKeys: ['id'],
		listKeys: ['items'],
		stampInputKeys: { collectionId: 'collection_id' },
	},
	createBulkCollectionItems: {
		entity: 'collectionItems',
		idKeys: ['id'],
		listKeys: ['items'],
		stampInputKeys: { collectionId: 'collection_id' },
	},
	updateCollectionItem: {
		entity: 'collectionItems',
		idKeys: ['id'],
		stampInputKeys: { collectionId: 'collection_id' },
	},
	// deprecated bulk-endpoint variant still returns the updated items, so
	// keep the cache in sync for callers that have not migrated yet
	updateCollectionItemLegacy: {
		entity: 'collectionItems',
		idKeys: ['id'],
		listKeys: ['items'],
		stampInputKeys: { collectionId: 'collection_id' },
	},
	deleteCollectionItem: {
		entity: 'collectionItems',
		idKeys: ['id'],
		deleteInputKeys: ['item_id'],
	},
	deleteCollectionItems: {
		entity: 'collectionItems',
		idKeys: ['id'],
		deleteBodyItemsKeys: ['items'],
	},
	updateLiveCollectionItem: {
		entity: 'collectionItems',
		idKeys: ['id'],
		deleteInputKeys: ['item_id'],
	},
	updateLiveCollectionItems: {
		entity: 'collectionItems',
		idKeys: ['id'],
		deleteBodyItemsKeys: ['items'],
	},
	// publishing flips isDraft server-side but the response only returns
	// publishedItemIds; evict the cached copies instead of serving stale
	// draft state (same strategy as the unpublish operations below). the
	// body is either { itemIds: string[] } or { items: [{ id }] }
	publishCollectionItems: {
		entity: 'collectionItems',
		idKeys: ['id'],
		deleteBodyItemsKeys: ['itemIds', 'items'],
	},
	// unpublishing flips isDraft server-side but returns no body; evict the
	// cached copy instead of serving stale published state (the entity is
	// re-cached on the next read)
	unpublishLiveCollectionItem: {
		entity: 'collectionItems',
		idKeys: ['id'],
		deleteInputKeys: ['item_id'],
	},
	unpublishLiveCollectionItems: {
		entity: 'collectionItems',
		idKeys: ['id'],
		deleteBodyItemsKeys: ['items'],
	},
	listAssets: { entity: 'assets', idKeys: ['id'], listKeys: ['assets'] },
	getAsset: { entity: 'assets', idKeys: ['id'] },
	uploadAsset: {
		entity: 'assets',
		idKeys: ['id'],
		// the upload response includes pre-signed s3 form fields that are
		// short-lived upload credentials; never persist them in the cache
		omitKeys: ['uploadDetails', 'uploadUrl'],
	},
	deleteAsset: {
		entity: 'assets',
		idKeys: ['id'],
		deleteInputKeys: ['asset_id'],
	},
	listAssetFolders: {
		entity: 'assetFolders',
		idKeys: ['id'],
		listKeys: ['assetFolders'],
	},
	createAssetFolder: { entity: 'assetFolders', idKeys: ['id'] },
	getAssetFolder: { entity: 'assetFolders', idKeys: ['id'] },
	listPages: { entity: 'pages', idKeys: ['id'], listKeys: ['pages'] },
	getPage: { entity: 'pages', idKeys: ['id'] },
	updatePageMetadata: { entity: 'pages', idKeys: ['id'] },
	listOrders: {
		entity: 'orders',
		idKeys: ['orderId'],
		listKeys: ['orders'],
		// orders are cached for fulfillment workflows, but card and payment
		// processor references are not needed locally; never persist them
		omitKeys: ['stripeCard', 'stripeDetails', 'paypalDetails'],
	},
	getOrder: {
		entity: 'orders',
		idKeys: ['orderId'],
		// orders are cached for fulfillment workflows, but card and payment
		// processor references are not needed locally; never persist them
		omitKeys: ['stripeCard', 'stripeDetails', 'paypalDetails'],
	},
	updateOrder: {
		entity: 'orders',
		idKeys: ['orderId'],
		// orders are cached for fulfillment workflows, but card and payment
		// processor references are not needed locally; never persist them
		omitKeys: ['stripeCard', 'stripeDetails', 'paypalDetails'],
	},
	fulfillOrder: {
		entity: 'orders',
		idKeys: ['orderId'],
		// orders are cached for fulfillment workflows, but card and payment
		// processor references are not needed locally; never persist them
		omitKeys: ['stripeCard', 'stripeDetails', 'paypalDetails'],
	},
	unfulfillOrder: {
		entity: 'orders',
		idKeys: ['orderId'],
		// orders are cached for fulfillment workflows, but card and payment
		// processor references are not needed locally; never persist them
		omitKeys: ['stripeCard', 'stripeDetails', 'paypalDetails'],
	},
	refundOrder: {
		entity: 'orders',
		idKeys: ['orderId'],
		// orders are cached for fulfillment workflows, but card and payment
		// processor references are not needed locally; never persist them
		omitKeys: ['stripeCard', 'stripeDetails', 'paypalDetails'],
	},
	listWebhooks: {
		entity: 'webhooks',
		idKeys: ['id'],
		listKeys: ['webhooks'],
	},
	deleteWebhook: {
		entity: 'webhooks',
		idKeys: ['id'],
		deleteInputKeys: ['webhook_id'],
	},
};

function encodePathPart(value: unknown): string {
	if (typeof value === 'number') {
		return encodeURIComponent(String(value));
	}
	if (typeof value !== 'string' || value.length === 0) {
		throw new Error('[webflow] missing required path parameter');
	}
	return encodeURIComponent(value);
}

function resolvePath(path: string, input: WebflowEndpointInput): string {
	return path.replace(/\{([^}]+)\}/g, (_, key: string) =>
		encodePathPart(input[key]),
	);
}

function extraInputEntries(
	operation: WebflowOperation,
	input: WebflowEndpointInput,
) {
	const pathParams = new Set(operation.pathParams ?? []);
	return Object.entries(input).filter(([key, value]) => {
		return (
			!pathParams.has(key) &&
			!INPUT_CONTROL_KEYS.has(key) &&
			value !== undefined
		);
	});
}

function requestBody(
	operation: WebflowOperation,
	input: WebflowEndpointInput,
): unknown {
	if ('body' in input) return input.body;

	const body = Object.fromEntries(extraInputEntries(operation, input));
	return Object.keys(body).length > 0 ? body : undefined;
}

function requestQuery(
	operation: WebflowOperation,
	input: WebflowEndpointInput,
): Record<string, unknown> | undefined {
	if (operation.method !== 'GET') {
		return input.query;
	}

	const query = {
		...Object.fromEntries(extraInputEntries(operation, input)),
		...input.query,
	};
	return Object.keys(query).length > 0 ? query : undefined;
}

function safeLogInput(input: WebflowEndpointInput) {
	const logInput: Record<string, unknown> = {};
	for (const key of PATH_PARAM_KEYS) {
		if (input[key] !== undefined) logInput[key] = input[key];
	}
	if (input.query) logInput.query = input.query;
	if (input.body !== undefined) logInput.hasBody = true;
	return logInput;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cacheItems(response: unknown, rule: CacheRule) {
	if (Array.isArray(response)) return response.filter(isRecord);
	if (!isRecord(response)) return [];

	for (const key of rule.listKeys ?? []) {
		const value = response[key];
		if (Array.isArray(value)) return value.filter(isRecord);
	}

	for (const key of rule.itemKeys ?? []) {
		const value = response[key];
		if (isRecord(value)) return [value];
	}

	return [response];
}

function cacheData(
	item: Record<string, unknown>,
	rule: CacheRule,
	input: WebflowEndpointInput,
) {
	if (!rule.omitKeys?.length && !rule.stampInputKeys) return item;
	const data = { ...item };
	for (const key of rule.omitKeys ?? []) {
		delete data[key];
	}
	for (const [field, inputKey] of Object.entries(rule.stampInputKeys ?? {})) {
		const value = input[inputKey];
		if (data[field] === undefined && typeof value === 'string') {
			data[field] = value;
		}
	}
	return data;
}

function cacheEntityId(item: Record<string, unknown>, rule: CacheRule) {
	for (const key of rule.idKeys) {
		const value = item[key];
		if (typeof value === 'string' && value.length > 0) return value;
		if (typeof value === 'number') return String(value);
	}
	return undefined;
}

function cacheDeleteEntityId(input: WebflowEndpointInput, rule: CacheRule) {
	for (const key of rule.deleteInputKeys ?? []) {
		const value = input[key];
		if (typeof value === 'string' && value.length > 0) return value;
		if (typeof value === 'number') return String(value);
	}
	return undefined;
}

function cacheDeleteBodyIds(input: WebflowEndpointInput, rule: CacheRule) {
	if (!rule.deleteBodyItemsKeys?.length) return [];

	// Mirror requestBody's resolution: an explicit `body` wins, otherwise the
	// extra top-level input fields are the body (the shorthand callers use),
	// so eviction sees the same ids the API request actually carried.
	let body: Record<string, unknown>;
	if ('body' in input) {
		if (!isRecord(input.body)) return [];
		body = input.body;
	} else {
		body = input;
	}

	const ids: string[] = [];
	for (const key of rule.deleteBodyItemsKeys) {
		const items = body[key];
		if (!Array.isArray(items)) continue;
		for (const item of items) {
			// bulk deletes and locale-aware publishes send { id } records,
			// while simple publishes send bare string ids
			const value = isRecord(item) ? item.id : item;
			if (typeof value === 'string' && value.length > 0) ids.push(value);
			if (typeof value === 'number') ids.push(String(value));
		}
	}
	return ids;
}

type CacheDbClient = {
	upsertByEntityId?: (
		entityId: string,
		data: Record<string, unknown>,
	) => Promise<unknown>;
	deleteByEntityId?: (entityId: string) => Promise<boolean>;
	findByEntityId?: (entityId: string) => Promise<{ data?: unknown } | null>;
	list?: (options?: {
		limit?: number;
		offset?: number;
	}) => Promise<Array<{ entity_id: string }>>;
	search?: (options: {
		data?: Record<string, unknown>;
		limit?: number;
		offset?: number;
	}) => Promise<Array<{ entity_id: string }>>;
};

type CacheDb = Record<string, CacheDbClient | undefined> | undefined;

async function cascadeDeleteChildren(
	db: CacheDb,
	rule: CacheRule,
	deletedId: string,
) {
	if (!rule.cascadeDelete) return;
	const child = db?.[rule.cascadeDelete.entity];
	if (!child?.search || !child.deleteByEntityId) return;
	const search = child.search;
	const deleteByEntityId = child.deleteByEntityId;

	// webflow removed the children server-side along with their parent, so
	// evict every cached child stamped with the deleted parent id. loop
	// without an offset because each pass deletes the rows it just fetched.
	// stop on an empty page, a no-progress page, or a pass cap so a no-op
	// deleteByEntityId cannot spin forever on the request path
	let previousFirst: string | undefined;
	for (let pass = 0; pass < MAX_EVICT_PASSES; pass++) {
		const rows = await search({
			data: { [rule.cascadeDelete.matchField]: deletedId },
			limit: EVICT_PAGE_SIZE,
		});
		if (rows.length === 0) break;
		const firstId = rows[0]?.entity_id;
		if (firstId !== undefined && firstId === previousFirst) break;
		previousFirst = firstId;
		await Promise.all(rows.map((row) => deleteByEntityId(row.entity_id)));
		if (rows.length < EVICT_PAGE_SIZE) break;
	}
}

async function evictAllOf(db: CacheDb, entityNames: string[]) {
	for (const name of entityNames) {
		const client = db?.[name];
		if (!client?.list || !client.deleteByEntityId) continue;
		const list = client.list;
		const deleteByEntityId = client.deleteByEntityId;
		let previousFirst: string | undefined;
		for (let pass = 0; pass < MAX_EVICT_PASSES; pass++) {
			const rows = await list({ limit: EVICT_PAGE_SIZE });
			if (rows.length === 0) break;
			const firstId = rows[0]?.entity_id;
			if (firstId !== undefined && firstId === previousFirst) break;
			previousFirst = firstId;
			await Promise.all(rows.map((row) => deleteByEntityId(row.entity_id)));
			if (rows.length < EVICT_PAGE_SIZE) break;
		}
	}
}

async function upsertCached(
	client: CacheDbClient,
	entityId: string,
	data: Record<string, unknown>,
	rule: CacheRule,
) {
	if (!client.upsertByEntityId) return;
	if (rule.mergeExisting && client.findByEntityId) {
		const existing = await client.findByEntityId(entityId);
		if (existing && isRecord(existing.data)) {
			data = { ...existing.data, ...data };
		}
	}
	await client.upsertByEntityId(entityId, data);
}

export async function syncWebflowOperationResult(
	ctx: WebflowContext,
	operation: WebflowOperation,
	input: WebflowEndpointInput,
	response: unknown,
) {
	// WebflowOperation.key is a string; the satisfies map is keyed by the
	// literal operation-key union, so index through that union
	const rule = CACHE_RULES[operation.key as WebflowOperationKey];
	if (!rule) return;

	// ctx.db maps entity names to typed clients, but this shared sync path
	// looks clients up dynamically via rule.entity (a plain string), which
	// the concrete mapped type cannot be indexed with; widen structurally
	// to just the methods used here
	const db = ctx.db as CacheDb;
	const client = db?.[rule.entity];

	// the api call already succeeded by the time we sync the cache; a local
	// db failure must not surface to the caller, or they may retry an
	// operation that already completed (duplicate creates, 404s on deletes)
	try {
		// eviction rules are keyed on the rule shape rather than the http
		// verb: bulk deletes use DELETE, but publish (POST) also evicts
		// because its response carries no entity data to upsert
		if (
			rule.deleteInputKeys ||
			rule.deleteBodyItemsKeys ||
			rule.evictAllEntities
		) {
			if (client?.deleteByEntityId) {
				const entityId = cacheDeleteEntityId(input, rule);
				if (entityId) {
					await client.deleteByEntityId(entityId);
					await cascadeDeleteChildren(db, rule, entityId);
				}
				for (const id of cacheDeleteBodyIds(input, rule)) {
					await client.deleteByEntityId(id);
				}
			}
			await evictAllOf(db, rule.evictAllEntities ?? []);
			return;
		}

		if (!client?.upsertByEntityId) return;

		for (const item of cacheItems(response, rule)) {
			const entityId = cacheEntityId(item, rule);
			if (!entityId) continue;
			await upsertCached(client, entityId, cacheData(item, rule, input), rule);
		}
	} catch (error) {
		console.warn(`[webflow] failed to sync ${rule.entity} cache:`, error);
	}
}

export async function logWebflowOperation(
	ctx: WebflowContext,
	input: WebflowEndpointInput,
	operation: WebflowOperation,
) {
	// same rationale as the cache sync above: the api call already
	// succeeded, so a local event-store failure must not surface to the
	// caller as an endpoint error
	try {
		await logEventFromContext(
			ctx,
			`webflow.${operation.group}.${operation.name}`,
			safeLogInput(input),
			'completed',
		);
	} catch (error) {
		console.warn(
			`[webflow] failed to log ${operation.group}.${operation.name}:`,
			error,
		);
	}
}

export async function requestWebflowOperation(
	ctx: WebflowContext,
	input: WebflowEndpointInput,
	operation: WebflowOperation,
) {
	return makeWebflowRequest(resolvePath(operation.path, input), ctx.key, {
		method: operation.method,
		body: requestBody(operation, input),
		query: requestQuery(operation, input),
		headers: input.headers,
		baseUrl: input.baseUrl,
	});
}
