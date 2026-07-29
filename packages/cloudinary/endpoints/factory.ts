import type { AccountKeyManagerFor, CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { cloudinaryAuthConfig } from '../auth-config';
import type { CloudinaryCredentials } from '../client';
import {
	makeCloudinaryAdminRequest,
	makeCloudinaryLiveRequest,
	makeCloudinaryUploadRequest,
	parseCloudinaryCredentials,
} from '../client';
import type { CloudinaryContext } from '../plugin-types';
import type { CloudinaryOperation } from './operation-types';
import type { CloudinaryEndpointInput } from './types';

type CloudinaryAccountKeys = AccountKeyManagerFor<
	'api_key',
	typeof cloudinaryAuthConfig
>;

const CLOUDINARY_RESOURCE_TYPES = ['image', 'video', 'raw'] as const;

const CONTROL_KEYS = new Set([
	'query',
	'body',
	'resource_type',
	'upload_resource_type',
	'file',
	'content_range',
	'x_unique_upload_id',
]);

const LIST_RESPONSE_KEYS = [
	'resources',
	'folders',
	'presets',
	'transformations',
	'mappings',
	'triggers',
	'metadata_fields',
	'rules',
	'live_streams',
	'outputs',
	'tags',
	'derived',
] as const;

type CacheRule = {
	entity: keyof CloudinaryContext['db'];
	idKeys: string[];
	listKeys?: string[];
};

const CACHE_RULES: Partial<Record<string, CacheRule>> = {
	getResourceByAssetId: { entity: 'resources', idKeys: ['asset_id', 'id'] },
	getResourceByPublicId: {
		entity: 'resources',
		idKeys: ['asset_id', 'public_id'],
	},
	listImages: {
		entity: 'resources',
		idKeys: ['asset_id', 'public_id'],
		listKeys: ['resources'],
	},
	listVideos: {
		entity: 'resources',
		idKeys: ['asset_id', 'public_id'],
		listKeys: ['resources'],
	},
	listRawFiles: {
		entity: 'resources',
		idKeys: ['asset_id', 'public_id'],
		listKeys: ['resources'],
	},
	listResourcesByType: {
		entity: 'resources',
		idKeys: ['asset_id', 'public_id'],
		listKeys: ['resources'],
	},
	searchAssets: {
		entity: 'resources',
		idKeys: ['asset_id', 'public_id'],
		listKeys: ['resources'],
	},
	getRootFolders: {
		entity: 'folders',
		idKeys: ['external_id', 'path', 'name'],
		listKeys: ['folders'],
	},
	showFolder: {
		entity: 'folders',
		idKeys: ['external_id', 'path', 'name'],
		listKeys: ['folders'],
	},
	getUploadPreset: { entity: 'uploadPresets', idKeys: ['name'] },
	listUploadPresets: {
		entity: 'uploadPresets',
		idKeys: ['name'],
		listKeys: ['presets'],
	},
	getTransformation: { entity: 'transformations', idKeys: ['name'] },
	getTransformations: {
		entity: 'transformations',
		idKeys: ['name'],
		listKeys: ['transformations'],
	},
	getMetadataFieldById: { entity: 'metadataFields', idKeys: ['external_id'] },
	listMetadataFields: {
		entity: 'metadataFields',
		idKeys: ['external_id'],
		listKeys: ['metadata_fields'],
	},
	getLiveStream: { entity: 'liveStreams', idKeys: ['id'] },
	getLiveStreams: {
		entity: 'liveStreams',
		idKeys: ['id'],
		listKeys: ['live_streams'],
	},
};

export type CloudinaryEndpoint = CorsairEndpoint<
	CloudinaryContext,
	CloudinaryEndpointInput,
	unknown
>;

/** Encode a Cloudinary path value, preserving `/` as segment separators. */
export function encodeCloudinaryPathPart(value: unknown): string {
	if (typeof value !== 'string' || value.length === 0) {
		throw new Error('[cloudinary] missing required path parameter');
	}
	return value
		.split('/')
		.map((segment) => encodeURIComponent(segment))
		.join('/');
}

export function resolveCloudinaryPath(
	path: string,
	input: CloudinaryEndpointInput,
): string {
	return path.replace(/\{([^}]+)\}/g, (_, key: string) =>
		encodeCloudinaryPathPart(input[key]),
	);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function resolveCloudName(ctx: CloudinaryContext): Promise<string> {
	if (ctx.options.credentials?.cloudName)
		return ctx.options.credentials.cloudName;
	if (ctx.options.cloudName) return ctx.options.cloudName;
	if (ctx.cloudName) return ctx.cloudName;
	const fromKeys = await (ctx.keys as CloudinaryAccountKeys).get_cloud_name();
	if (fromKeys) return fromKeys;
	throw new Error('[cloudinary] cloud_name is required');
}

async function credentialsFromContextAsync(
	ctx: CloudinaryContext,
): Promise<CloudinaryCredentials> {
	const { apiKey, apiSecret } = parseCloudinaryCredentials(ctx.key);
	const cloudName = await resolveCloudName(ctx);
	return { apiKey, apiSecret, cloudName };
}

function buildQuery(
	operation: CloudinaryOperation,
	input: CloudinaryEndpointInput,
): Record<string, string | number | boolean | undefined> | undefined {
	const query: Record<string, string | number | boolean | undefined> = {
		...(input.query as Record<string, string | number | boolean | undefined>),
	};

	for (const key of operation.queryParams ?? []) {
		if (input[key] !== undefined) {
			query[key] = input[key] as string | number | boolean;
		}
	}

	return Object.keys(query).length > 0 ? query : undefined;
}

function requestBody(
	operation: CloudinaryOperation,
	input: CloudinaryEndpointInput,
): Record<string, unknown> | undefined {
	if ('body' in input && input.body !== undefined) {
		return isRecord(input.body) ? input.body : undefined;
	}

	const pathParams = new Set(operation.pathParams ?? []);
	const body = Object.fromEntries(
		Object.entries(input).filter(([key, value]) => {
			return (
				!pathParams.has(key) &&
				!CONTROL_KEYS.has(key) &&
				value !== undefined &&
				!(operation.queryParams ?? []).includes(key)
			);
		}),
	);

	return Object.keys(body).length > 0 ? body : undefined;
}

function uploadResourceType(
	operation: CloudinaryOperation,
	input: CloudinaryEndpointInput,
): string {
	return (
		(typeof input.resource_type === 'string' && input.resource_type) ||
		(typeof input.upload_resource_type === 'string' &&
			input.upload_resource_type) ||
		operation.uploadResourceType ||
		'image'
	);
}

function uploadBody(
	input: CloudinaryEndpointInput,
	baseBody: Record<string, unknown> | undefined,
): Record<string, unknown> {
	const body: Record<string, unknown> = { ...(baseBody ?? {}) };
	for (const key of ['file', 'content_range', 'x_unique_upload_id'] as const) {
		if (input[key] !== undefined) {
			body[key] = input[key];
		}
	}
	return body;
}

function uploadHeaders(
	input: CloudinaryEndpointInput,
): Record<string, string> | undefined {
	const headers: Record<string, string> = {};
	if (typeof input.content_range === 'string' && input.content_range) {
		headers['Content-Range'] = input.content_range;
	}
	if (
		typeof input.x_unique_upload_id === 'string' &&
		input.x_unique_upload_id
	) {
		headers['X-Unique-Upload-Id'] = input.x_unique_upload_id;
	}
	return Object.keys(headers).length > 0 ? headers : undefined;
}

async function requestOperation(
	ctx: CloudinaryContext,
	input: CloudinaryEndpointInput,
	operation: CloudinaryOperation,
) {
	// Cloudinary has no Admin API to enumerate resource types; return the supported set.
	if (operation.key === 'listResourceTypes') {
		return { resource_types: [...CLOUDINARY_RESOURCE_TYPES] };
	}

	const credentials = await credentialsFromContextAsync(ctx);
	const path = resolveCloudinaryPath(operation.path, input);
	const query = buildQuery(operation, input);
	const body = requestBody(operation, input);

	if (operation.api === 'live') {
		return makeCloudinaryLiveRequest(path, credentials, {
			method: operation.method,
			body,
			query,
		});
	}

	if (operation.api === 'upload') {
		return makeCloudinaryUploadRequest(
			path,
			credentials,
			uploadResourceType(operation, input),
			{
				method: 'POST',
				body: uploadBody(input, body),
				bodyKind: operation.bodyKind === 'multipart' ? 'multipart' : 'form',
				headers: uploadHeaders(input),
			},
		);
	}

	return makeCloudinaryAdminRequest(path, credentials, {
		method: operation.method,
		body,
		query,
	});
}

function cacheItems(
	response: unknown,
	listKeys: string[],
): Record<string, unknown>[] {
	if (Array.isArray(response)) return response.filter(isRecord);
	if (!isRecord(response)) return [];

	for (const key of listKeys) {
		const value = response[key];
		if (Array.isArray(value)) return value.filter(isRecord);
	}

	for (const key of LIST_RESPONSE_KEYS) {
		const value = response[key];
		if (Array.isArray(value)) return value.filter(isRecord);
	}

	return isRecord(response) ? [response] : [];
}

function cacheEntityId(item: Record<string, unknown>, idKeys: string[]) {
	for (const key of idKeys) {
		const value = item[key];
		if (typeof value === 'string' && value.length > 0) return value;
		if (typeof value === 'number') return String(value);
	}
	return undefined;
}

async function syncOperationResult(
	ctx: CloudinaryContext,
	operation: CloudinaryOperation,
	response: unknown,
) {
	const rule = CACHE_RULES[operation.key];
	if (!rule) return;

	const db = ctx.db[rule.entity];
	if (!db?.upsertByEntityId) return;

	for (const item of cacheItems(response, rule.listKeys ?? [])) {
		const entityId = cacheEntityId(item, rule.idKeys);
		if (!entityId) continue;
		// upsertByEntityId is generated per-entity with a narrow payload type; API
		// responses are untyped records, so never is required at this cache boundary.
		await db.upsertByEntityId(entityId, item as never);
	}
}

export function createCloudinaryEndpoint(
	operation: CloudinaryOperation,
): CloudinaryEndpoint {
	return async (ctx, input = {}) => {
		const result = await requestOperation(ctx, input, operation);
		try {
			await syncOperationResult(ctx, operation, result);
		} catch {
			// Cache sync is best-effort; never fail a successful API response.
		}
		try {
			await logEventFromContext(
				ctx,
				`cloudinary.${operation.group}.${operation.key}`,
				{
					...(operation.pathParams ?? []).reduce<Record<string, unknown>>(
						(acc, key) => {
							if (input[key] !== undefined) acc[key] = input[key];
							return acc;
						},
						{},
					),
					query: input.query,
				},
				'completed',
			);
		} catch {
			// Event logging is best-effort.
		}
		return result;
	};
}
