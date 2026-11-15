import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';
import type { CoassemblePluginOptions } from './index';

export const COASSEMBLE_API_BASE = 'https://api.coassemble.com/api';

export function requireWorkspaceId(
	workspaceId: string | null | undefined,
): string {
	if (!workspaceId) {
		throw new Error('Coassemble workspace ID is missing');
	}
	return workspaceId;
}

export async function resolveWorkspaceId(ctx: {
	options: Pick<CoassemblePluginOptions, 'key' | 'workspaceId'>;
	keys?: {
		get_workspace_id?: () => Promise<string | null | undefined>;
	};
}): Promise<string> {
	if (ctx.options.key) {
		return requireWorkspaceId(ctx.options.workspaceId);
	}
	const stored = await ctx.keys?.get_workspace_id?.();
	return requireWorkspaceId(stored);
}

export async function makeCoassembleRequest<T>(
	endpoint: string,
	apiKey: string,
	workspaceId: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Justification for unknown: HTTP request body payload may carry arbitrary JSON values for mutations.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: COASSEMBLE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `COASSEMBLE:${workspaceId}:${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	// No wrapping: ApiError must propagate so error handlers can read status/retryAfter.
	return request<T>(config, requestOptions);
}
