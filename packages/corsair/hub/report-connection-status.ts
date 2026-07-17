import { getPluginAuthStatus } from '../core/auth/plugin-auth-status';
import type { AuthTypes } from '../core/constants';
import type { CorsairPlugin } from '../core/plugins';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { getPluginAuthType } from '../core/utils/plugin-auth';
import type { CorsairDatabase } from '../db/kysely/database';
import type { WebhookTenantLink } from '../webhooks/tenant-links';
import { hubApiPost } from './client/http';
import { getHubConfig, HubNotConfiguredError } from './config';
import type { ConnectAuthStatusLevel } from './contracts/connect-api';
import type { HubConfig } from './types';

export type ReportConnectionStatusInput = {
	tenantId: string;
	plugin: string;
	authType: AuthTypes;
	status: ConnectAuthStatusLevel;
	connected: boolean;
	verified: boolean;
	missingFields?: string[];
	// BYO webhook routing: the app reports the provider-side routing key so Hub
	// can map inbound webhooks to this tenant, and the verification secret so
	// Hub can verify them. Absent in managed mode (Hub already holds both).
	webhookLink?: WebhookTenantLink;
	webhookSecret?: string;
};

/**
 * Builds a connection report that carries a webhook tenant link. Used to forward
 * a resolved provider identity (OAuth-time or subscription-time) to Hub so it can
 * route inbound webhooks. The connection is reported ready/connected/verified
 * because a resolvable link means the tenant is actively connected.
 */
export function buildWebhookLinkReport(input: {
	plugin: string;
	tenantId: string;
	link: WebhookTenantLink;
	authType?: AuthTypes;
}): ReportConnectionStatusInput {
	return {
		tenantId: input.tenantId,
		plugin: input.plugin,
		authType: input.authType ?? 'oauth_2',
		status: 'ready',
		connected: true,
		verified: true,
		webhookLink: input.link,
	};
}

function buildConnectionStatusReport(input: {
	tenantId: string;
	plugin: string;
	authType: AuthTypes;
	status: ConnectAuthStatusLevel;
	connected: boolean;
	verified: boolean;
	missingFields?: string[];
	webhookLink?: WebhookTenantLink;
	webhookSecret?: string;
}): ReportConnectionStatusInput {
	return {
		tenantId: input.tenantId,
		plugin: input.plugin,
		authType: input.authType,
		status: input.status,
		connected: input.connected,
		verified: input.verified,
		missingFields: input.missingFields,
		webhookLink: input.webhookLink,
		webhookSecret: input.webhookSecret,
	};
}

/**
 * Forwards a resolved webhook tenant link to Hub (fire-and-forget). Called after
 * OAuth completes (email-style links) and after a watch/subscription is created
 * (channel_id / subscription_id). No-op unless Hub is configured.
 */
export async function registerHubWebhookTenantLink(
	hub: HubConfig,
	input: {
		plugin: string;
		tenantId: string;
		link: WebhookTenantLink;
		authType?: AuthTypes;
	},
): Promise<void> {
	// Awaitable (unlike the fire-and-forget status reports) so short-lived CLI
	// callers can ensure the registration completes before the process exits.
	// Never throws — Hub availability must not break connect/subscribe flows.
	await hubApiPost({
		hub,
		path: '/connections/report',
		body: buildWebhookLinkReport(input),
		parseResponse: () => ({ ok: true as const }),
	}).catch(() => {});
}

function fireAndForgetReport(
	corsair: unknown,
	body: ReportConnectionStatusInput,
): void {
	try {
		const hub = getHubConfig(corsair);
		void hubApiPost({
			hub,
			path: '/connections/report',
			body,
			parseResponse: () => ({ ok: true as const }),
		}).catch(() => {
			// Push-only telemetry — never block app operations on hub availability.
		});
	} catch (error) {
		if (error instanceof HubNotConfiguredError) {
			return;
		}
		// Push-only telemetry — never block app operations on hub misconfiguration.
	}
}

async function reportPluginConnectionStatusFromBindingAsync(input: {
	hub?: HubConfig;
	database?: CorsairDatabase;
	kek?: string;
	plugins: readonly CorsairPlugin[];
	plugin: CorsairPlugin;
	tenantId?: string;
	verified?: boolean;
}): Promise<void> {
	if (!input.hub || !input.database || !input.kek) {
		return;
	}

	const internal = {
		database: input.database,
		kek: input.kek,
		plugins: input.plugins,
	} as Parameters<typeof getPluginAuthStatus>[0];

	const authType = getPluginAuthType(input.plugin);
	if (!authType) {
		return;
	}

	const effectiveTenantId = input.tenantId?.trim() || 'default';
	const authStatus = await getPluginAuthStatus(
		internal,
		input.plugin,
		effectiveTenantId,
	);
	if (!authStatus) {
		return;
	}

	reportConnectionStatusForHub(
		input.hub,
		buildConnectionStatusReport({
			tenantId: effectiveTenantId,
			plugin: input.plugin.id,
			authType: authStatus.authType,
			status: authStatus.status,
			connected: authStatus.connected,
			verified: input.verified ?? authStatus.connected,
			missingFields: authStatus.missingRequiredFields,
		}),
	);
}

export function reportConnectionStatus(
	corsair: unknown,
	input: ReportConnectionStatusInput,
): void {
	fireAndForgetReport(corsair, input);
}

export function reportConnectionStatusForHub(
	hub: HubConfig,
	input: ReportConnectionStatusInput,
): void {
	void hubApiPost({
		hub,
		path: '/connections/report',
		body: input,
		parseResponse: () => ({ ok: true as const }),
	}).catch(() => {
		// Push-only telemetry — never block app operations on hub availability.
	});
}

export function reportPluginConnectionStatusFromBinding(input: {
	hub?: HubConfig;
	database?: CorsairDatabase;
	kek?: string;
	plugins: readonly CorsairPlugin[];
	plugin: CorsairPlugin;
	tenantId?: string;
	verified?: boolean;
}): void {
	void reportPluginConnectionStatusFromBindingAsync(input).catch(() => {
		// Push-only telemetry — never block endpoint operations on status reporting.
	});
}

export async function reportPluginConnectionStatus(
	corsair: unknown,
	input: {
		plugin: CorsairPlugin;
		tenantId: string;
		verified?: boolean;
		// BYO webhook routing: carried through to Hub so it can route + verify
		// inbound provider webhooks. Set by the subscribe-on-connect hook.
		webhookLink?: { linkType: string; externalId: string };
		webhookSecret?: string;
	},
): Promise<void> {
	const internal = getCorsairInternal(corsair);
	const authType = getPluginAuthType(input.plugin);
	if (!authType) {
		return;
	}

	const authStatus = await getPluginAuthStatus(
		internal,
		input.plugin,
		input.tenantId,
	);
	if (!authStatus) {
		return;
	}

	reportConnectionStatus(
		corsair,
		buildConnectionStatusReport({
			tenantId: input.tenantId.trim() || 'default',
			plugin: input.plugin.id,
			authType: authStatus.authType,
			status: authStatus.status,
			connected: authStatus.connected,
			verified: input.verified ?? authStatus.connected,
			missingFields: authStatus.missingRequiredFields,
			webhookLink: input.webhookLink,
			webhookSecret: input.webhookSecret,
		}),
	);
}

export async function reportPluginConnectionVerified(
	corsair: unknown,
	input: {
		plugin: CorsairPlugin;
		tenantId: string;
	},
): Promise<void> {
	await reportPluginConnectionStatus(corsair, {
		...input,
		verified: true,
	});
}

export async function reportPluginConnectionAuthMissing(
	corsair: unknown,
	input: {
		plugin: CorsairPlugin;
		tenantId: string;
	},
): Promise<void> {
	const internal = getCorsairInternal(corsair);
	const authType = getPluginAuthType(input.plugin);
	if (!authType) {
		return;
	}

	const authStatus = await getPluginAuthStatus(
		internal,
		input.plugin,
		input.tenantId,
	);

	reportConnectionStatus(
		corsair,
		buildConnectionStatusReport({
			tenantId: input.tenantId.trim() || 'default',
			plugin: input.plugin.id,
			authType: authStatus?.authType ?? authType,
			status: authStatus?.status ?? 'not_started',
			connected: authStatus?.connected ?? false,
			verified: false,
			missingFields: authStatus?.missingRequiredFields ?? [],
		}),
	);
}
