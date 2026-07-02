import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeNeonRequest } from '../client';
import type { NeonContext } from '../index';
import type { NeonOperation } from './operations';
import type { NeonEndpointInput } from './types';

const PATH_PARAM_KEYS = [
	'project_id',
	'branch_id',
	'database_name',
	'role_name',
	'endpoint_id',
	'operation_id',
	'permission_id',
	'request_id',
	'jwks_id',
	'key_id',
	'org_id',
	'member_id',
	'oauth_provider_id',
	'auth_user_id',
	'source_org_id',
	'region_id',
	'vpc_endpoint_id',
	'snapshot_id',
] as const;

const INPUT_CONTROL_KEYS = new Set(['body', 'query', 'headers', 'baseUrl']);

export type NeonEndpoint = CorsairEndpoint<
	NeonContext,
	NeonEndpointInput,
	unknown
>;

type CacheRule = {
	entity: string;
	idKeys: string[];
	listKeys?: string[];
	itemKeys?: string[];
	deleteInputKeys?: string[];
	omitKeys?: string[];
};

const CACHE_RULES: Record<string, CacheRule> = {
	listProjects: {
		entity: 'projects',
		idKeys: ['id'],
		listKeys: ['projects'],
	},
	listSharedProjects: {
		entity: 'projects',
		idKeys: ['id'],
		listKeys: ['projects'],
	},
	getProject: { entity: 'projects', idKeys: ['id'], itemKeys: ['project'] },
	createProject: { entity: 'projects', idKeys: ['id'], itemKeys: ['project'] },
	updateProject: { entity: 'projects', idKeys: ['id'], itemKeys: ['project'] },
	deleteProject: {
		entity: 'projects',
		idKeys: ['id'],
		deleteInputKeys: ['project_id'],
	},
	listProjectBranches: {
		entity: 'branches',
		idKeys: ['id'],
		listKeys: ['branches'],
	},
	getProjectBranch: {
		entity: 'branches',
		idKeys: ['id'],
		itemKeys: ['branch'],
	},
	createProjectBranch: {
		entity: 'branches',
		idKeys: ['id'],
		itemKeys: ['branch'],
	},
	updateProjectBranch: {
		entity: 'branches',
		idKeys: ['id'],
		itemKeys: ['branch'],
	},
	deleteProjectBranch: {
		entity: 'branches',
		idKeys: ['id'],
		deleteInputKeys: ['branch_id'],
	},
	listProjectBranchDatabases: {
		entity: 'databases',
		idKeys: ['name', 'id'],
		listKeys: ['databases'],
	},
	getProjectBranchDatabase: {
		entity: 'databases',
		idKeys: ['name', 'id'],
		itemKeys: ['database'],
	},
	createProjectBranchDatabase: {
		entity: 'databases',
		idKeys: ['name', 'id'],
		itemKeys: ['database'],
	},
	updateProjectBranchDatabase: {
		entity: 'databases',
		idKeys: ['name', 'id'],
		itemKeys: ['database'],
	},
	deleteProjectBranchDatabase: {
		entity: 'databases',
		idKeys: ['name', 'id'],
		deleteInputKeys: ['database_name'],
	},
	listProjectBranchRoles: {
		entity: 'roles',
		idKeys: ['name'],
		listKeys: ['roles'],
	},
	getProjectBranchRole: {
		entity: 'roles',
		idKeys: ['name'],
		itemKeys: ['role'],
	},
	createProjectBranchRole: {
		entity: 'roles',
		idKeys: ['name'],
		itemKeys: ['role'],
	},
	deleteProjectBranchRole: {
		entity: 'roles',
		idKeys: ['name'],
		deleteInputKeys: ['role_name'],
	},
	listProjectEndpoints: {
		entity: 'computeEndpoints',
		idKeys: ['id'],
		listKeys: ['endpoints'],
	},
	getProjectEndpoint: {
		entity: 'computeEndpoints',
		idKeys: ['id'],
		itemKeys: ['endpoint'],
	},
	createProjectEndpoint: {
		entity: 'computeEndpoints',
		idKeys: ['id'],
		itemKeys: ['endpoint'],
	},
	updateProjectEndpoint: {
		entity: 'computeEndpoints',
		idKeys: ['id'],
		itemKeys: ['endpoint'],
	},
	deleteProjectEndpoint: {
		entity: 'computeEndpoints',
		idKeys: ['id'],
		deleteInputKeys: ['endpoint_id'],
	},
	getOrganization: { entity: 'organizations', idKeys: ['id'] },
	getCurrentUserOrganizations: {
		entity: 'organizations',
		idKeys: ['id'],
		listKeys: ['organizations'],
	},
	listSnapshots: {
		entity: 'snapshots',
		idKeys: ['id'],
		listKeys: ['snapshots'],
	},
	createSnapshot: {
		entity: 'snapshots',
		idKeys: ['id'],
		itemKeys: ['snapshot'],
	},
	updateSnapshot: {
		entity: 'snapshots',
		idKeys: ['id'],
		itemKeys: ['snapshot'],
	},
	deleteSnapshot: {
		entity: 'snapshots',
		idKeys: ['id'],
		deleteInputKeys: ['snapshot_id'],
	},
	listApiKeys: { entity: 'apiKeys', idKeys: ['id'] },
	createApiKey: {
		entity: 'apiKeys',
		idKeys: ['id'],
		// the create response is the only place neon returns the plaintext
		// token; never persist it in the local cache
		omitKeys: ['key'],
	},
	revokeApiKey: {
		entity: 'apiKeys',
		idKeys: ['id'],
		deleteInputKeys: ['key_id'],
	},
};

function encodePathPart(value: unknown): string {
	if (typeof value === 'number') {
		return encodeURIComponent(String(value));
	}
	if (typeof value !== 'string' || value.length === 0) {
		throw new Error('[neon] missing required path parameter');
	}
	return encodeURIComponent(value);
}

function resolvePath(path: string, input: NeonEndpointInput): string {
	return path.replace(/\{([^}]+)\}/g, (_, key: string) =>
		encodePathPart(input[key]),
	);
}

function extraInputEntries(operation: NeonOperation, input: NeonEndpointInput) {
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
	operation: NeonOperation,
	input: NeonEndpointInput,
): unknown {
	if ('body' in input) return input.body;

	const body = Object.fromEntries(extraInputEntries(operation, input));
	return Object.keys(body).length > 0 ? body : undefined;
}

function requestQuery(
	operation: NeonOperation,
	input: NeonEndpointInput,
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

function safeLogInput(input: NeonEndpointInput) {
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

function cacheData(item: Record<string, unknown>, rule: CacheRule) {
	if (!rule.omitKeys?.length) return item;
	const data = { ...item };
	for (const key of rule.omitKeys) {
		delete data[key];
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

function cacheDeleteEntityId(input: NeonEndpointInput, rule: CacheRule) {
	for (const key of rule.deleteInputKeys ?? []) {
		const value = input[key];
		if (typeof value === 'string' && value.length > 0) return value;
		if (typeof value === 'number') return String(value);
	}
	return undefined;
}

export async function syncNeonOperationResult(
	ctx: NeonContext,
	operation: NeonOperation,
	input: NeonEndpointInput,
	response: unknown,
) {
	const rule = CACHE_RULES[operation.key];
	if (!rule) return;

	// ctx.db maps entity names to typed clients, but this shared sync path
	// looks clients up dynamically via rule.entity (a plain string), which
	// the concrete mapped type cannot be indexed with; widen structurally
	// to just the two methods used here
	const db = ctx.db as
		| Record<
				string,
				| {
						upsertByEntityId?: (
							entityId: string,
							data: Record<string, unknown>,
						) => Promise<unknown>;
						deleteByEntityId?: (entityId: string) => Promise<boolean>;
				  }
				| undefined
		  >
		| undefined;
	const client = db?.[rule.entity];

	// the api call already succeeded by the time we sync the cache; a local
	// db failure must not surface to the caller, or they may retry an
	// operation that already completed (duplicate creates, 404s on deletes)
	try {
		if (operation.method === 'DELETE' && rule.deleteInputKeys) {
			const entityId = cacheDeleteEntityId(input, rule);
			if (entityId && client?.deleteByEntityId) {
				await client.deleteByEntityId(entityId);
			}
			return;
		}

		if (!client?.upsertByEntityId) return;

		for (const item of cacheItems(response, rule)) {
			const entityId = cacheEntityId(item, rule);
			if (!entityId) continue;
			await client.upsertByEntityId(entityId, cacheData(item, rule));
		}
	} catch (error) {
		console.warn(`[neon] failed to sync ${rule.entity} cache:`, error);
	}
}

export async function logNeonOperation(
	ctx: NeonContext,
	input: NeonEndpointInput,
	operation: NeonOperation,
) {
	await logEventFromContext(
		ctx,
		`neon.${operation.group}.${operation.name}`,
		safeLogInput(input),
		'completed',
	);
}

export async function requestNeonOperation(
	ctx: NeonContext,
	input: NeonEndpointInput,
	operation: NeonOperation,
) {
	return makeNeonRequest(resolvePath(operation.path, input), ctx.key, {
		method: operation.method,
		body: requestBody(operation, input),
		query: requestQuery(operation, input),
		headers: input.headers,
		baseUrl: input.baseUrl,
	});
}
