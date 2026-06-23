import { getHubConfig, HubNotConfiguredError } from './config';
import { createHubConnectSession } from './connect';
import { resolveConnectSourceFromDeliveryUrl } from './delivery-url';
import type {
	HubConnectSessionInput,
	HubConnectSource,
	HubOAuthMode,
} from './types';

export { isLoopbackDeliveryUrl, resolveConnectSourceFromDeliveryUrl } from './delivery-url';

export type HubConnectSessionRequestBody = {
	plugin?: string;
	tenantId?: string;
	source?: string;
	oauthMode?: string;
	providerName?: string;
};

export type HubConnectSessionParseError = {
	error: string;
	status: number;
};

export type HubConnectSessionSuccessBody = {
	ok: true;
	connectUrl: string;
	token: string;
	projectId: string;
	expiresAt?: string;
};

export type ResolveHubConnectTenantId = (
	request: Request,
) => Promise<string | null | undefined> | string | null | undefined;

export type HubConnectSessionResponseOptions = {
	/**
	 * When provided, tenantId from the request body or query is ignored.
	 * Return null or undefined to respond with 401 Unauthorized.
	 */
	resolveTenantId?: ResolveHubConnectTenantId;
	/** Used when resolveTenantId is not provided. Defaults to "default". */
	defaultTenantId?: string;
};

function parseOAuthMode(value: unknown): HubOAuthMode | undefined {
	if (value === 'byo' || value === 'managed') {
		return value;
	}
	return undefined;
}

function parseSource(value: unknown): HubConnectSource | undefined {
	if (value === 'client' || value === 'server') {
		return value;
	}
	return undefined;
}

export function parseHubConnectSessionBody(
	body: HubConnectSessionRequestBody,
): HubConnectSessionInput | HubConnectSessionParseError {
	const plugin = body.plugin?.trim();
	const tenantId = body.tenantId?.trim() || 'default';
	const source = parseSource(body.source);
	const oauthMode = parseOAuthMode(body.oauthMode);
	const providerName = body.providerName?.trim();

	if (!plugin) {
		return { error: 'plugin is required', status: 400 };
	}

	if (
		body.source !== undefined &&
		body.source !== null &&
		String(body.source).trim() !== '' &&
		!source
	) {
		return {
			error: 'source must be "client" or "server"',
			status: 400,
		};
	}

	if (body.oauthMode && !oauthMode) {
		return { error: 'oauthMode must be "byo" or "managed"', status: 400 };
	}

	const input: HubConnectSessionInput = {
		plugin,
		tenantId,
		oauthMode,
	};

	if (source) {
		input.source = source;
	}

	if (providerName) {
		input.providerName = providerName;
	}

	return input;
}

export function parseHubConnectSessionSearchParams(
	url: string,
): HubConnectSessionRequestBody {
	const { searchParams } = new URL(url);
	const oauthMode = searchParams.get('oauthMode');

	return {
		plugin: searchParams.get('plugin') ?? undefined,
		tenantId: searchParams.get('tenantId') ?? undefined,
		source: searchParams.get('source') ?? undefined,
		oauthMode: oauthMode ?? undefined,
		providerName: searchParams.get('providerName') ?? undefined,
	};
}

function connectSessionToResponseBody(
	session: Awaited<ReturnType<typeof createHubConnectSession>>,
): HubConnectSessionSuccessBody {
	return {
		ok: true,
		connectUrl: session.connectUrl,
		token: session.token,
		projectId: session.projectId,
		expiresAt: session.expiresAt,
	};
}

async function resolveConnectSessionTenantId(
	request: Request,
	body: HubConnectSessionRequestBody,
	options?: HubConnectSessionResponseOptions,
): Promise<string | HubConnectSessionParseError> {
	if (options?.resolveTenantId) {
		const tenantId = await options.resolveTenantId(request);
		if (!tenantId?.trim()) {
			return { error: 'Unauthorized', status: 401 };
		}
		return tenantId.trim();
	}

	return body.tenantId?.trim() || options?.defaultTenantId?.trim() || 'default';
}

export async function handleHubConnectSessionRequest(
	corsair: unknown,
	request: Request,
	options?: HubConnectSessionResponseOptions,
): Promise<HubConnectSessionSuccessBody | HubConnectSessionParseError> {
	const method = request.method.toUpperCase();
	const body =
		method === 'GET'
			? parseHubConnectSessionSearchParams(request.url)
			: ((await request
					.json()
					.catch(() => null)) as HubConnectSessionRequestBody | null);

	if (!body) {
		return { error: 'Invalid JSON body', status: 400 };
	}

	const tenantId = await resolveConnectSessionTenantId(request, body, options);
	if (typeof tenantId !== 'string') {
		return tenantId;
	}

	const parsed = parseHubConnectSessionBody({ ...body, tenantId });
	if ('error' in parsed) {
		return parsed;
	}

	const hub = getHubConfig(corsair);
	const connectInput: HubConnectSessionInput = {
		...parsed,
		source:
			parsed.source ??
			resolveConnectSourceFromDeliveryUrl(hub.deliveryUrl),
	};

	const session = await createHubConnectSession(corsair, connectInput);
	return connectSessionToResponseBody(session);
}

export async function respondToHubConnectSession(
	corsair: unknown,
	request: Request,
	options?: HubConnectSessionResponseOptions,
): Promise<Response> {
	try {
		const result = await handleHubConnectSessionRequest(
			corsair,
			request,
			options,
		);

		if ('error' in result) {
			return Response.json({ error: result.error }, { status: result.status });
		}

		return Response.json(result);
	} catch (error) {
		if (error instanceof HubNotConfiguredError) {
			return Response.json({ error: error.message }, { status: 503 });
		}

		const message = error instanceof Error ? error.message : String(error);
		return Response.json({ error: message }, { status: 500 });
	}
}

export async function respondToHubConnectSessionFromRequest(
	corsair: unknown,
	request: Request,
	options?: HubConnectSessionResponseOptions,
): Promise<Response> {
	const method = request.method.toUpperCase();
	if (method !== 'GET' && method !== 'POST') {
		return Response.json({ error: 'Method not allowed' }, { status: 405 });
	}

	return respondToHubConnectSession(corsair, request, options);
}
