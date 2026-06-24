import type { CorsairPermission } from '../../db';
import type { HubConfig } from '../../hub';
import {
	createHubPermissionSession,
	formatHubApprovalMessage,
} from '../../hub/permission';
import type {
	CorsairManualConfig,
	CorsairPermissionsOptions,
} from '../plugins';

type ApprovalRoutingConfig = {
	manual?: CorsairManualConfig;
	hub?: HubConfig;
};

export const APPROVAL_SETUP_HINT =
	'Permission approval required. Set manual.approvalBaseUrl (or use hub for hosted approval) so an approval URL can be generated. Optionally set manual.onApprovalRequired to customize the agent message.';

/** @deprecated Use CorsairPermissionsOptions */
export type ApprovalConfigForMessage = CorsairPermissionsOptions;

export type { CorsairPermissionsOptions };

export type ResolveApprovalUrlInput = Pick<
	CorsairPermission,
	'id' | 'token' | 'plugin' | 'endpoint' | 'args' | 'tenant_id' | 'expires_at'
>;

export function usesManualApprovalConfig(
	manual: CorsairManualConfig | undefined,
): boolean {
	if (!manual) return false;
	return (
		manual.approvalBaseUrl !== undefined ||
		manual.onApprovalRequired !== undefined
	);
}

export function buildManualApprovalUrl(
	approvalBaseUrl: string,
	token: string,
): string {
	const base = approvalBaseUrl.replace(/\/+$/, '');
	return `${base}/${token}`;
}

export function formatDefaultApprovalMessage(approvalUrl: string): string {
	return formatHubApprovalMessage(approvalUrl);
}

export async function resolveApprovalUrl(
	internal: ApprovalRoutingConfig,
	record: ResolveApprovalUrlInput,
): Promise<string | null> {
	if (usesManualApprovalConfig(internal.manual)) {
		const baseUrl = internal.manual?.approvalBaseUrl?.trim();
		if (!baseUrl) return null;
		return buildManualApprovalUrl(baseUrl, record.token);
	}

	const hub = internal.hub;
	if (!hub) return null;

	try {
		const session = await createHubPermissionSession(hub, {
			permissionId: record.id,
			permissionToken: record.token,
			plugin: record.plugin,
			endpoint: record.endpoint,
			args: parsePermissionArgs(record.args),
			tenantId: record.tenant_id,
			expiresAt: record.expires_at,
		});
		return session.approvalUrl;
	} catch {
		return null;
	}
}

function parsePermissionArgs(args: string): unknown {
	try {
		return JSON.parse(args) as unknown;
	} catch {
		return args;
	}
}

export async function enrichPermissionWithApprovalUrl<
	T extends CorsairPermission,
>(
	internal: ApprovalRoutingConfig,
	record: T,
): Promise<T & { approvalUrl: string | null }> {
	const actionable =
		record.status === 'pending' || record.status === 'approved';
	if (!actionable) {
		return { ...record, approvalUrl: null };
	}

	const approvalUrl = await resolveApprovalUrl(internal, record);
	return { ...record, approvalUrl };
}

export type ResolveAsyncApprovalMessageInput = {
	permissionsOptions?: CorsairPermissionsOptions;
	manual?: CorsairManualConfig;
	hub?: HubConfig;
	permissionId: string;
	permissionToken: string;
	plugin: string;
	endpoint: string;
	args: unknown;
	tenantId: string;
	expiresAt: string;
	operationPath: string;
};

export async function resolveAsyncApprovalMessage(
	input: ResolveAsyncApprovalMessageInput,
): Promise<string> {
	const {
		permissionsOptions,
		manual,
		hub,
		permissionId,
		permissionToken,
		plugin,
		endpoint,
		args,
		tenantId,
		expiresAt,
		operationPath,
	} = input;

	// TODO: delete formatAsyncMessage ~April 2026 (deprecated on permissions config).
	if (permissionsOptions?.formatAsyncMessage) {
		return permissionsOptions.formatAsyncMessage({
			token: permissionToken,
			id: permissionId,
			plugin,
			endpoint,
			args,
		});
	}

	const internal = { manual, hub };
	const approvalUrl = await resolveApprovalUrl(internal, {
		id: permissionId,
		token: permissionToken,
		plugin,
		endpoint,
		args: JSON.stringify(args),
		tenant_id: tenantId,
		expires_at: expiresAt,
	});

	if (usesManualApprovalConfig(manual)) {
		if (approvalUrl) {
			if (manual?.onApprovalRequired) {
				return manual.onApprovalRequired({ approvalUrl });
			}
			return formatDefaultApprovalMessage(approvalUrl);
		}
		return APPROVAL_SETUP_HINT;
	}

	if (hub) {
		if (approvalUrl) {
			return formatDefaultApprovalMessage(approvalUrl);
		}
		return `Action '${operationPath}' requires user approval before it can run. Could not create approval link. Check hub configuration and server logs.`;
	}

	return APPROVAL_SETUP_HINT;
}
