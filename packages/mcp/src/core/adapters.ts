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
	basePermissionUrl?: string;
};
