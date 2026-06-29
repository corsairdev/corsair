import type { AuthTypes } from '../core/constants';
import type {
	ConnectAuthKind,
	ConnectAuthStatusLevel,
} from './contracts/connect-api';
import type { CorsairPlugin } from '../core/plugins';
import { getPluginAuthStatus } from '../core/auth/plugin-auth-status';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { getPluginAuthType } from '../core/utils/plugin-auth';
import { hubApiPost } from './client/http';
import type { CorsairDatabase } from '../db/kysely/database';
import { getHubConfig, HubNotConfiguredError } from './config';
import type { HubConfig } from './types';

export type ReportConnectionStatusInput = {
	tenantId: string;
	plugin: string;
	authKind: ConnectAuthKind;
	authType: AuthTypes;
	status: ConnectAuthStatusLevel;
	connected: boolean;
	verified: boolean;
	missingFields?: string[];
};

function toConnectAuthKind(authType: AuthTypes): ConnectAuthKind {
	if (authType === 'oauth_2' || authType === 'managed') {
		return 'oauth';
	}
	if (authType === 'bot_token') {
		return 'bot_token';
	}
	return 'api_key';
}

function buildConnectionStatusReport(input: {
	tenantId: string;
	plugin: string;
	authType: AuthTypes;
	status: ConnectAuthStatusLevel;
	connected: boolean;
	verified: boolean;
	missingFields?: string[];
}): ReportConnectionStatusInput {
	return {
		tenantId: input.tenantId,
		plugin: input.plugin,
		authKind: toConnectAuthKind(input.authType),
		authType: input.authType,
		status: input.status,
		connected: input.connected,
		verified: input.verified,
		missingFields: input.missingFields,
	};
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
			authType,
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
			authType,
			status: authStatus.status,
			connected: authStatus.connected,
			verified: input.verified ?? authStatus.connected,
			missingFields: authStatus.missingRequiredFields,
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
			authType,
			status: authStatus?.status ?? 'not_started',
			connected: authStatus?.connected ?? false,
			verified: false,
			missingFields: authStatus?.missingRequiredFields ?? [],
		}),
	);
}
