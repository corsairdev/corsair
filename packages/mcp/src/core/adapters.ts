export type PermissionAdapter = {
	createPermissionRequest(params: {
		endpoint: string;
		args: Record<string, unknown>;
		description: string;
	}): Promise<{ permissionId: string; approvalUrl: string }>;
};

export type BaseMcpOptions = {
	corsair: { [key: string]: unknown };
	permissions?: PermissionAdapter;
	setup?: boolean;
	/**
	 * Default tenant used by the corsair_setup tool. The tool input can override
	 * this per call. If omitted, setupCorsair uses its "default" tenant behavior.
	 */
	tenantId?: string;
	basePermissionUrl?: string;
};
