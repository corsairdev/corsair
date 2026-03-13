export type PermissionAdapter = {
	createPermissionRequest(params: {
		endpoint: string;
		args: Record<string, unknown>;
		description: string;
	}): Promise<{ permissionId: string; approvalUrl: string }>;
};

export type BaseMcpOptions = {
	corsair: {
		list_operations: (opts?: {
			plugin?: string;
			type?: 'api' | 'webhooks' | 'db';
		}) => unknown;
		get_schema: (path: string) => unknown;
		setup: () => Promise<void>;
		[key: string]: unknown;
	};
	permissions?: PermissionAdapter;
	basePermissionUrl?: string;
};
