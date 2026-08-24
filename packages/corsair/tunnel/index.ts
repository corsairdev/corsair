import type { CorsairInternalConfig } from '../core';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { processConnectLinkDelivery } from '../hub/connect-link-delivery';
import {
	isConnectionsSyncRetryableError,
	processConnectionsSyncDelivery,
} from '../hub/connections-sync-delivery';
import type {
	ProbeTunnelPayload,
	RunResultPayload,
	RunTunnelPayload,
	TunnelEnvelope,
} from '../hub/contracts/tunnel';
import { SIGNED_TUNNEL_REPLAY_WINDOW_MS } from '../hub/contracts/tunnel';
import { processAuthCredentialsDelivery } from '../hub/credentials-delivery';
import { processIntegrationCredentialsDelivery } from '../hub/integration-credentials-delivery';
import { consumeDeliveryReplayKey } from '../hub/internal/delivery-replay-guard';
import { processManagedOAuthDelivery } from '../hub/managed-oauth';
import type { ServerDeliveryAckBody } from '../hub/signing/envelope';
import { verifySignedTunnelDelivery } from '../hub/signing/envelope';
import { processOAuthCallback } from '../oauth';
import { processWebhook } from '../webhooks';
import {
	resolveAccountFromWebhookLink,
	resolveTenantFromWebhookLink,
	resolveTenantIdFromWebhookLink,
	setWebhookTenantLink,
} from '../webhooks/tenant-links';
import { executeWorkflowRun } from '../workflows/execute';
import { runReadonlyProbe } from '../workflows/probe';

export {
	resolveAccountFromWebhookLink,
	resolveTenantFromWebhookLink,
	resolveTenantIdFromWebhookLink,
	setWebhookTenantLink,
};

export type { TunnelEnvelope, TunnelType } from '../hub/contracts/tunnel';
export { verifySignedTunnelDelivery } from '../hub/signing/envelope';
export {
	type BrowserDeliveryPayload,
	isAuthCredentialsBrowserDelivery,
	isByoOAuthBrowserDelivery,
	isConnectionsSyncBrowserDelivery,
	isManagedBrowserDelivery,
	isPermissionBrowserDelivery,
	verifyBrowserDeliveryToken,
} from './browser-delivery';

export type TunnelAck = {
	status: 'ok' | 'failed';
	retryable?: boolean;
	error?: string;
	webhookResponse?: {
		status?: number;
		body?: unknown;
		headers?: Record<string, string>;
	};
	/**
	 * @deprecated Shipped in v0.1.102. The connect URL now also lives in
	 * `webhookResponse.body`; this alias is kept populated so direct
	 * `processCorsair` consumers that read `ack.connectLink` don't break.
	 */
	connectLink?: {
		connectUrl: string;
		expiresAt?: string;
	};
};

/**
 * Builds the ack for a `connect.create_link` tunnel. Carries the connect URL in
 * both `webhookResponse.body` (current) and the deprecated `connectLink` alias.
 */
export function connectLinkAck(result: {
	connectUrl: string;
	expiresAt?: string;
}): TunnelAck {
	return {
		status: 'ok',
		connectLink: { connectUrl: result.connectUrl, expiresAt: result.expiresAt },
		webhookResponse: {
			status: 200,
			body: {
				status: 'ok',
				connectUrl: result.connectUrl,
				expiresAt: result.expiresAt,
			} satisfies ServerDeliveryAckBody,
		},
	};
}

export type WebhookTunnelPayload = {
	headers: Record<string, string>;
	body: string;
	bodyBase64?: string;
	bodyEncoding?: string;
	query?: Record<string, string | string[] | undefined>;
	plugin?: string;
	linkType?: string;
	externalId?: string;
	tenantId?: string;
	/** Hub already verified the provider signature before signing this delivery. */
	hubVerified?: boolean;
};

export type OAuthCallbackTunnelPayload = {
	code: string;
	state: string;
	redirectUri: string;
	/**
	 * Set by Hub, which authenticates the delivery envelope with the signing
	 * secret and cannot sign a Corsair `state`. When present, the callback is
	 * processed against these instead of decoding `state`.
	 */
	plugin?: string;
	tenantId?: string;
	// Provider callback params (e.g. GitHub's installation_id) Hub forwards; absent from the token body.
	callbackParams?: Record<string, string>;
};

export type OAuthTokensTunnelPayload = {
	plugin: string;
	tenantId: string;
	accessToken: string;
	refreshToken?: string;
	expiresIn?: number;
	scope?: string;
};

export type PermissionDecisionTunnelPayload = {
	token: string;
};

export type AuthCredentialsTunnelPayload = {
	plugin: string;
	tenantId: string;
	credentials: Record<string, string>;
};

export type IntegrationCredentialsTunnelPayload = {
	plugin: string;
	credentials: Record<string, string>;
};

export type ConnectCreateLinkTunnelPayload = {
	tenantId: string;
	plugins: string[];
};

async function handleConnectionsSyncTunnel(
	corsair: unknown,
	signingSecret: string,
): Promise<TunnelAck> {
	try {
		const encrypted = await processConnectionsSyncDelivery(
			corsair,
			signingSecret,
		);
		return {
			status: 'ok',
			webhookResponse: {
				status: 200,
				body: {
					status: 'ok',
					sync: { encrypted },
				} satisfies ServerDeliveryAckBody,
			},
		};
	} catch (error) {
		return {
			status: 'failed',
			retryable: isConnectionsSyncRetryableError(error),
			error:
				error instanceof Error
					? error.message
					: 'Connections sync delivery failed',
		};
	}
}

async function handleConnectCreateLinkTunnel(
	corsair: unknown,
	payload: ConnectCreateLinkTunnelPayload,
): Promise<TunnelAck> {
	try {
		const result = await processConnectLinkDelivery(corsair, payload);
		return connectLinkAck(result);
	} catch (error) {
		return {
			status: 'failed',
			retryable: false,
			error:
				error instanceof Error ? error.message : 'Connect link delivery failed',
		};
	}
}

export type ProcessCorsairRequest = {
	headers: Headers | Record<string, string | string[] | undefined>;
	body: string;
};

function normalizeHeader(
	headers: ProcessCorsairRequest['headers'],
	name: string,
): string | undefined {
	if (headers instanceof Headers) {
		return headers.get(name) ?? undefined;
	}
	const value = headers[name] ?? headers[name.toLowerCase()];
	if (Array.isArray(value)) return value[0];
	return typeof value === 'string' ? value : undefined;
}

async function resolveWebhookTenantId(
	corsair: unknown,
	internal: CorsairInternalConfig,
	payload: WebhookTunnelPayload,
): Promise<string | undefined> {
	const explicitTenantId =
		typeof payload.tenantId === 'string'
			? payload.tenantId
			: typeof payload.query?.tenantId === 'string'
				? payload.query.tenantId
				: undefined;

	if (explicitTenantId) return explicitTenantId;

	if (
		!internal.database ||
		!payload.plugin ||
		!payload.linkType ||
		!payload.externalId
	) {
		return undefined;
	}

	const resolved = await resolveTenantIdFromWebhookLink({
		database: internal.database,
		kek: internal.kek,
		pluginId: payload.plugin,
		linkType: payload.linkType,
		externalId: payload.externalId,
	});

	return resolved ?? undefined;
}

async function handleWebhookTunnel(
	corsair: unknown,
	internal: CorsairInternalConfig,
	payload: WebhookTunnelPayload,
	envelopeVerified: boolean,
): Promise<TunnelAck> {
	const tenantId = await resolveWebhookTenantId(corsair, internal, payload);
	const query = {
		...(payload.query ?? {}),
		...(tenantId ? { tenantId } : {}),
	};

	const result = await processWebhook(
		corsair as Parameters<typeof processWebhook>[0],
		payload.headers,
		payload.body,
		query,
		// Hub routed this by the plugin's own endpoint — dispatch exactly there,
		// never by body shape (MS Graph siblings are indistinguishable). Only
		// honor hubVerified when the envelope itself was authenticated — an
		// unsigned tunnel delivery must never let a caller-supplied flag skip
		// provider signature verification.
		{
			plugin: payload.plugin,
			hubVerified: envelopeVerified && payload.hubVerified === true,
		},
	);

	if (!result.plugin) {
		return {
			status: 'failed',
			retryable: false,
			error: 'No matching webhook handler found',
		};
	}

	if (result.response && result.response.success === false) {
		return {
			status: 'failed',
			retryable: false,
			error:
				typeof result.response.error === 'string'
					? result.response.error
					: 'Webhook handler failed',
		};
	}

	const returnToSender = result.response?.returnToSender;
	const responseBody =
		returnToSender &&
		typeof returnToSender === 'object' &&
		typeof returnToSender.validationToken === 'string' &&
		Object.keys(returnToSender).length === 1
			? returnToSender.validationToken
			: returnToSender
				? returnToSender
				: (result.response?.data ?? result.response);

	return {
		status: 'ok',
		webhookResponse: {
			status: result.response?.statusCode ?? 200,
			body: responseBody,
			headers: result.responseHeaders,
		},
	};
}

async function handleOAuthCallbackTunnel(
	corsair: unknown,
	payload: OAuthCallbackTunnelPayload,
): Promise<TunnelAck> {
	// Envelope signature already verified by processCorsair before dispatch. Take
	// the trusted path only when Hub supplied plugin/tenant; otherwise fall back
	// to HMAC state verification (a Hub deployed before the companion change).
	await processOAuthCallback(corsair, {
		code: payload.code,
		state: payload.state,
		redirectUri: payload.redirectUri,
		callbackParams: payload.callbackParams,
		...(payload.plugin && payload.tenantId
			? { trusted: true, plugin: payload.plugin, tenantId: payload.tenantId }
			: {}),
	});
	return { status: 'ok' };
}

async function handleOAuthTokensTunnel(
	corsair: unknown,
	payload: OAuthTokensTunnelPayload,
): Promise<TunnelAck> {
	await processManagedOAuthDelivery(corsair, {
		plugin: payload.plugin,
		tenantId: payload.tenantId,
		accessToken: payload.accessToken,
		refreshToken: payload.refreshToken,
		expiresIn: payload.expiresIn,
		scope: payload.scope,
	});
	return { status: 'ok' };
}

export async function applyPermissionDecision(
	corsair: unknown,
	token: string,
	decision: 'approved' | 'denied',
): Promise<void> {
	const ack = await handlePermissionDecisionTunnel(
		corsair,
		{ token },
		decision,
	);
	if (ack.status !== 'ok') {
		throw new Error(ack.error ?? 'Permission decision failed');
	}
}

async function handlePermissionDecisionTunnel(
	corsair: unknown,
	payload: PermissionDecisionTunnelPayload,
	decision: 'approved' | 'denied',
): Promise<TunnelAck> {
	const internal = getCorsairInternal(corsair);
	const token = payload.token?.trim();
	if (!token) {
		return {
			status: 'failed',
			retryable: false,
			error: 'Permission token is required',
		};
	}

	if (!internal.database) {
		return {
			status: 'failed',
			retryable: false,
			error: 'Database not configured',
		};
	}

	const now = new Date().toISOString();
	const record = await internal.database.db
		.selectFrom('corsair_permissions')
		.selectAll()
		.where('token', '=', token)
		.executeTakeFirst();

	if (!record) {
		return {
			status: 'failed',
			retryable: false,
			error: 'Permission not found',
		};
	}

	if (record.status !== 'pending') {
		return { status: 'ok' };
	}

	if (record.expires_at < now) {
		await internal.database.db
			.updateTable('corsair_permissions')
			.set({ status: 'expired', updated_at: new Date() })
			.where('id', '=', record.id)
			.execute();
		return {
			status: 'failed',
			retryable: false,
			error: 'Permission has expired',
		};
	}

	await internal.database.db
		.updateTable('corsair_permissions')
		.set({ status: decision, updated_at: new Date() })
		.where('id', '=', record.id)
		.execute();

	return { status: 'ok' };
}

async function handleAuthCredentialsTunnel(
	corsair: unknown,
	payload: AuthCredentialsTunnelPayload,
): Promise<TunnelAck> {
	try {
		await processAuthCredentialsDelivery(corsair, payload);
		return { status: 'ok' };
	} catch (error) {
		return {
			status: 'failed',
			retryable: false,
			error:
				error instanceof Error ? error.message : 'Credential delivery failed',
		};
	}
}

async function handleIntegrationCredentialsTunnel(
	corsair: unknown,
	payload: IntegrationCredentialsTunnelPayload,
): Promise<TunnelAck> {
	try {
		await processIntegrationCredentialsDelivery(corsair, payload);
		return { status: 'ok' };
	} catch (error) {
		return {
			status: 'failed',
			retryable: false,
			error:
				error instanceof Error
					? error.message
					: 'Integration credential delivery failed',
		};
	}
}

/**
 * Scopes the root Corsair instance to the run's tenant. Multi-tenant apps expose
 * plugin namespaces only via `withTenant(...)`; the root wrapper does not, so a
 * workflow calling `corsair.github.api.*` needs the tenant-scoped client. For
 * single-tenant apps there is no `withTenant`, so the instance is used as-is.
 */
function scopeCorsairToTenant(corsair: unknown, tenantId: string): unknown {
	const candidate = corsair as {
		withTenant?: (tenantId: string) => unknown;
	} | null;
	if (tenantId && typeof candidate?.withTenant === 'function') {
		return candidate.withTenant(tenantId);
	}
	return corsair;
}

async function handleRunTunnel(
	corsair: unknown,
	payload: RunTunnelPayload,
): Promise<TunnelAck> {
	try {
		// Scope to the tenant BEFORE handing the client to workflow `main`, so the
		// generated code's `corsair.<plugin>.api.*` calls resolve the right tenant's
		// credentials. Dropping this silently breaks every multi-tenant run.
		const tenantScopedCorsair = scopeCorsairToTenant(corsair, payload.tenantId);
		const result: RunResultPayload = await executeWorkflowRun({
			corsair: tenantScopedCorsair,
			code: payload.code,
			payload: payload.trigger?.payload ?? null,
			memoizedSteps: payload.memoizedSteps,
		});
		// The envelope was processed successfully regardless of whether the workflow
		// itself succeeded — Hub reads the run status/steps from `run` in the ack
		// body. Nested under `run` so the ack's own `status: 'ok'` (envelope
		// success) doesn't collide with the run's `status: 'completed'|'failed'`.
		return {
			status: 'ok',
			webhookResponse: {
				status: 200,
				body: { status: 'ok', run: result } satisfies ServerDeliveryAckBody,
			},
		};
	} catch (error) {
		// Only reached for infrastructure-level failures (e.g. code failed to load).
		return {
			status: 'failed',
			retryable: true,
			error: error instanceof Error ? error.message : 'Workflow run failed',
		};
	}
}

async function handleProbeTunnel(
	corsair: unknown,
	payload: ProbeTunnelPayload,
): Promise<TunnelAck> {
	try {
		// Same tenant scoping as a run: the read-only script resolves the right
		// tenant's credentials. `runReadonlyProbe` runs it under runReadonly, so a
		// write/destructive call throws and comes back as `{ status: 'error' }`.
		const tenantScopedCorsair = scopeCorsairToTenant(corsair, payload.tenantId);
		const probe = await runReadonlyProbe({
			corsair: tenantScopedCorsair,
			code: payload.code,
			timeoutMs: payload.timeoutMs,
		});
		// Envelope succeeded regardless of the script outcome — Hub reads `probe` from
		// the ack. Nested so the ack's own `status: 'ok'` doesn't collide with the
		// probe's `status: 'ok' | 'error'`.
		return {
			status: 'ok',
			webhookResponse: {
				status: 200,
				body: { status: 'ok', probe } satisfies ServerDeliveryAckBody,
			},
		};
	} catch (error) {
		// runReadonlyProbe never throws; this only fires if tenant scoping fails,
		// which is deterministic — not worth retrying.
		return {
			status: 'failed',
			retryable: false,
			error: error instanceof Error ? error.message : 'Probe failed',
		};
	}
}

export type ProcessCorsairOptions = {
	/** HMAC signing secret shared with the tunnel relay. Required unless allowUnsignedTunnel is true. */
	signingSecret?: string;
	/** Local development only. Skips signature verification when signingSecret is omitted. */
	allowUnsignedTunnel?: boolean;
	/**
	 * Opt-in to executing Hub-delivered workflow code (`type: 'run'`). Off by
	 * default because it dynamically evaluates code in-process. See the warning in
	 * workflows/execute.ts — sandbox before enabling in production.
	 */
	allowWorkflowExecution?: boolean;
};

export async function processCorsair(
	corsair: unknown,
	request: ProcessCorsairRequest,
	options: ProcessCorsairOptions = {},
): Promise<TunnelAck> {
	const internal = getCorsairInternal(corsair);
	const signatureHeader = normalizeHeader(
		request.headers,
		'x-corsair-signature',
	);
	const timestampHeader = normalizeHeader(
		request.headers,
		'x-corsair-timestamp',
	);
	const nonceHeader = normalizeHeader(request.headers, 'x-corsair-nonce');

	// hubVerified may only be trusted once we have authenticated the envelope.
	// Unsigned tunnel deliveries leave this false, so a caller-supplied
	// hubVerified can never skip provider verification downstream.
	let envelopeVerified = false;

	if (!options.signingSecret?.trim()) {
		if (!options.allowUnsignedTunnel) {
			return {
				status: 'failed',
				retryable: false,
				error: 'Tunnel signing secret is required',
			};
		}
	} else {
		const verification = verifySignedTunnelDelivery({
			body: request.body,
			signatureHeader,
			timestampHeader,
			signingSecret: options.signingSecret,
		});
		if (!verification.ok) {
			return {
				status: 'failed',
				retryable: false,
				error: verification.error,
			};
		}

		if (!nonceHeader?.trim()) {
			return {
				status: 'failed',
				retryable: false,
				error: 'Missing tunnel nonce',
			};
		}

		const replayCheck = consumeDeliveryReplayKey(
			`nonce:${nonceHeader.trim()}`,
			SIGNED_TUNNEL_REPLAY_WINDOW_MS,
		);
		if (!replayCheck.ok) {
			return {
				status: 'failed',
				retryable: false,
				error: replayCheck.error,
			};
		}

		envelopeVerified = true;
	}

	let envelope: TunnelEnvelope;
	try {
		envelope = JSON.parse(request.body) as TunnelEnvelope;
	} catch {
		return {
			status: 'failed',
			retryable: false,
			error: 'Invalid tunnel envelope JSON',
		};
	}

	if ((envelope.type as string) === 'connect.status') {
		return {
			status: 'failed',
			retryable: false,
			error:
				'connect.status is deprecated; use connections.sync signed delivery instead',
		};
	}

	switch (envelope.type) {
		case 'webhook':
			return handleWebhookTunnel(
				corsair,
				internal,
				envelope.payload as WebhookTunnelPayload,
				envelopeVerified,
			);
		case 'oauth.callback':
			return handleOAuthCallbackTunnel(
				corsair,
				envelope.payload as OAuthCallbackTunnelPayload,
			);
		case 'oauth.tokens':
			return handleOAuthTokensTunnel(
				corsair,
				envelope.payload as OAuthTokensTunnelPayload,
			);
		case 'permission.approve':
			return handlePermissionDecisionTunnel(
				corsair,
				envelope.payload as PermissionDecisionTunnelPayload,
				'approved',
			);
		case 'permission.deny':
			return handlePermissionDecisionTunnel(
				corsair,
				envelope.payload as PermissionDecisionTunnelPayload,
				'denied',
			);
		case 'auth.credentials':
			return handleAuthCredentialsTunnel(
				corsair,
				envelope.payload as AuthCredentialsTunnelPayload,
			);
		case 'integration.credentials':
			return handleIntegrationCredentialsTunnel(
				corsair,
				envelope.payload as IntegrationCredentialsTunnelPayload,
			);
		case 'connect.create_link':
			return handleConnectCreateLinkTunnel(
				corsair,
				envelope.payload as ConnectCreateLinkTunnelPayload,
			);
		case 'connections.sync': {
			const signingSecret = options.signingSecret?.trim();
			if (!signingSecret) {
				return {
					status: 'failed',
					retryable: false,
					error: 'Tunnel signing secret is required for connections.sync',
				};
			}
			return handleConnectionsSyncTunnel(corsair, signingSecret);
		}
		case 'run':
			if (!options.allowWorkflowExecution) {
				return {
					status: 'failed',
					retryable: false,
					error:
						'Workflow execution is not enabled (set allowWorkflowExecution: true)',
				};
			}
			return handleRunTunnel(corsair, envelope.payload as RunTunnelPayload);
		case 'probe':
			// Same gate as `run`: a probe still executes Hub-authored code (read-only).
			// Could be split into its own flag if a tenant ever needs authoring probes
			// without enabling full execution.
			if (!options.allowWorkflowExecution) {
				return {
					status: 'failed',
					retryable: false,
					error:
						'Workflow execution is not enabled (set allowWorkflowExecution: true)',
				};
			}
			return handleProbeTunnel(corsair, envelope.payload as ProbeTunnelPayload);
		default:
			return {
				status: 'failed',
				retryable: false,
				error: `Unsupported tunnel type: ${String(envelope.type)}`,
			};
	}
}
