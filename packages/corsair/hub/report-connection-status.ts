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

// Every endpoint call ends in a status report, so a busy connection re-sent
// the same "ready, verified" many times a second. Hub needs a change, plus an
// occasional refresh for its "reported X ago". So the per-call path sends a
// report only when it differs from the last one this process sent for that
// connection, or once REPORT_REFRESH_MS has passed. Explicit reports (connect,
// key saved, webhook link) always go out, and count as the last one sent.
export const REPORT_REFRESH_MS = 10 * 60 * 1000;
const MAX_REMEMBERED = 5000;
const lastSent = new Map<string, { fingerprint: string; at: number }>();

const statusReads = new WeakMap<
	CorsairDatabase,
	Map<string, ReturnType<typeof getPluginAuthStatus>>
>();

function connectionKey(
	hub: HubConfig,
	tenantId: string,
	plugin: string,
): string {
	return [
		hub.apiUrl,
		hub.projectApiKey,
		hub.instanceKey ?? '',
		tenantId,
		plugin,
	].join('\0');
}

function fingerprintOf(body: ReportConnectionStatusInput): string {
	return JSON.stringify([
		body.authType,
		body.status,
		body.connected,
		body.verified,
		body.missingFields ?? [],
	]);
}

function remember(key: string, body: ReportConnectionStatusInput): void {
	// Re-insert so the Map's order stays oldest-first for eviction.
	lastSent.delete(key);
	if (lastSent.size >= MAX_REMEMBERED) {
		const oldest = lastSent.keys().next().value;
		if (oldest !== undefined) lastSent.delete(oldest);
	}
	lastSent.set(key, {
		fingerprint: fingerprintOf(body),
		at: Date.now(),
	});
}

function sendReport(hub: HubConfig, body: ReportConnectionStatusInput): void {
	const key = connectionKey(hub, body.tenantId, body.plugin);
	remember(key, body);
	void hubApiPost({
		hub,
		path: '/connections/report',
		body,
		parseResponse: () => ({ ok: true as const }),
	}).catch(() => {
		// Push-only telemetry — never block app operations on hub availability.
		// Forget it, so the next call reports again.
		lastSent.delete(key);
	});
}

/** Forgets every report this process has sent. For tests. */
export function resetConnectionReportMemory(): void {
	lastSent.clear();
}

function fireAndForgetReport(
	corsair: unknown,
	body: ReportConnectionStatusInput,
): void {
	try {
		sendReport(getHubConfig(corsair), body);
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
	// Always read the stored status: a matching `verified` does not mean the
	// connection is unchanged (e.g. a refused refresh, then a disconnect, both
	// report verified: false while `connected` flips), and credentials can
	// change in another process, so an in-memory invalidation would miss it.
	// Overlapping calls share the read in flight now (never a settled one).
	const inflightKey = connectionKey(
		input.hub,
		effectiveTenantId,
		input.plugin.id,
	);
	let reads = statusReads.get(input.database);
	if (!reads) statusReads.set(input.database, (reads = new Map()));
	let read = reads.get(inflightKey);
	if (!read) {
		read = getPluginAuthStatus(internal, input.plugin, effectiveTenantId);
		const mine = read;
		const done = () => {
			if (reads.get(inflightKey) === mine) reads.delete(inflightKey);
		};
		mine.then(done, done);
		reads.set(inflightKey, read);
	}
	const authStatus = await read;
	if (!authStatus) {
		return;
	}

	const body = buildConnectionStatusReport({
		tenantId: effectiveTenantId,
		plugin: input.plugin.id,
		authType: authStatus.authType,
		status: authStatus.status,
		connected: authStatus.connected,
		verified: input.verified ?? authStatus.connected,
		missingFields: authStatus.missingRequiredFields,
	});
	// Read the last report only after the await, and decide and send without
	// yielding: overlapping calls that finish together then see the report the
	// first of them just sent, instead of each sending the same one.
	const prior = lastSent.get(
		connectionKey(input.hub, effectiveTenantId, input.plugin.id),
	);
	if (
		prior !== undefined &&
		Date.now() - prior.at < REPORT_REFRESH_MS &&
		prior.fingerprint === fingerprintOf(body)
	) {
		return;
	}
	sendReport(input.hub, body);
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
	sendReport(hub, input);
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
