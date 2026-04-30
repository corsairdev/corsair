export function parseListArgs(args: string[]): {
	plugin?: string;
	type?: 'api' | 'webhooks' | 'db';
} {
	let plugin: string | undefined;
	let type: 'api' | 'webhooks' | 'db' | undefined;
	for (const arg of args) {
		if (arg.startsWith('--plugin=')) plugin = arg.slice('--plugin='.length);
		if (arg.startsWith('--type=')) {
			const value = arg.slice('--type='.length);
			if (value === 'api' || value === 'webhooks' || value === 'db') type = value;
		}
	}
	return { plugin, type };
}

export function parseScriptOptions(options: { code?: string; tenant?: string }): {
	code?: string;
	tenant?: string;
} {
	return { code: options.code, tenant: options.tenant };
}

export function parseSetupOptions(options: {
	backfill?: boolean;
	plugin?: string;
	credentials?: string[];
}): { backfill: boolean; credentials: Record<string, Record<string, string>> } {
	const credentials: Record<string, Record<string, string>> = {};
	const plugin = options.plugin;
	if (plugin) credentials[plugin] = {};
	for (const value of options.credentials ?? []) {
		const eq = value.indexOf('=');
		if (!plugin || eq === -1) continue;
		const target = credentials[plugin];
		if (!target) continue;
		target[value.slice(0, eq)] = value.slice(eq + 1);
	}
	return { backfill: Boolean(options.backfill), credentials };
}
