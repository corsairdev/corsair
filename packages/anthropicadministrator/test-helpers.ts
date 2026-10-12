import { z } from 'zod';
import type {
	AnthropicAdministratorContext,
	AnthropicAdministratorKeyBuilderContext,
} from './index';

export const ADMIN_KEY = 'sk-ant-admin01-test';
export const INFERENCE_KEY = 'sk-ant-api03-test';

type ContextOptions = {
	admin?: string | null;
	tenantInference?: string | null;
	optionsInference?: string;
	authType?: 'api_key' | 'oauth_2';
	withDb?: boolean;
};

export type CacheWrite =
	| { op: 'upsert'; entity: string; id: string; data: object }
	| { op: 'delete'; entity: string; id: string };

/**
 * Builds an endpoint context backed by in-memory key and cache stores, and
 * records every cache write so tests can assert on them.
 */
export function makeContext({
	admin = ADMIN_KEY,
	tenantInference = INFERENCE_KEY,
	optionsInference,
	authType = 'api_key',
	withDb = true,
}: ContextOptions = {}) {
	const writes: CacheWrite[] = [];
	const entity = (name: string) => ({
		upsertByEntityId: async (id: string, data: object) => {
			writes.push({ op: 'upsert', entity: name, id, data });
			return data;
		},
		deleteByEntityId: async (id: string) => {
			writes.push({ op: 'delete', entity: name, id });
			return true;
		},
	});
	const context = {
		key: '',
		options: { authType, inferenceKey: optionsInference },
		keys: {
			get_api_key: async () => admin,
			get_access_token: async () => admin,
			get_inference_key: async () => tenantInference,
		},
		db: withDb
			? {
					users: entity('users'),
					invites: entity('invites'),
					workspaces: entity('workspaces'),
					workspaceMembers: entity('workspaceMembers'),
					apiKeys: entity('apiKeys'),
				}
			: undefined,
		$getAccountId: async () => 'acct_test',
	};
	// Safe: endpoints read only options, keys, db and $getAccountId, all provided above.
	// A narrower type is not practical because the full context also carries every bound endpoint, the database adapter and tenant services.
	const ctx = context as AnthropicAdministratorContext;
	return { ctx, writes };
}

/** Key-builder context with an in-memory key store. */
export function makeKeyBuilderContext(
	authType: 'api_key' | 'oauth_2',
	keys: {
		get_api_key?: () => Promise<string | undefined>;
		get_access_token?: () => Promise<string | undefined>;
		get_inference_key?: () => Promise<string | undefined>;
	},
) {
	// Safe: the key builder reads only authType and the three key getters supplied here.
	// A narrower type is not practical because the full key-builder context also carries tenant and integration services.
	return { authType, keys } as AnthropicAdministratorKeyBuilderContext;
}

export function jsonResponse(
	status: number,
	body: object,
	headers: Record<string, string> = {},
): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json', ...headers },
	});
}

/** Replaces global fetch with a stub that answers with `responses` in order. */
export function stubFetch(...responses: Response[]) {
	const queue = [...responses];
	return jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
		const next = queue.shift();
		if (!next) throw new Error('fetch called more times than stubbed');
		return next;
	});
}

// Safe: tests only compare body values with toEqual against literal expectations.
// A narrower type is not practical because each operation sends a different JSON payload.
const JsonBodySchema = z.record(z.string(), z.unknown());

type SentRequest = {
	url: string;
	method: string | undefined;
	headers: Headers;
	body: z.infer<typeof JsonBodySchema> | undefined;
};

/** The URL, method, headers and JSON body of the n-th stubbed fetch call. */
export function sentRequest(
	fetchMock: ReturnType<typeof stubFetch>,
	n = 0,
): SentRequest {
	const call = fetchMock.mock.calls[n];
	if (!call) throw new Error(`fetch call ${n} was never made`);
	const [input, init] = call;
	const headers = new Headers(init?.headers);
	return {
		url: String(input),
		method: init?.method,
		headers,
		body:
			typeof init?.body === 'string'
				? JsonBodySchema.parse(JSON.parse(init.body))
				: undefined,
	};
}
