export function createIntegrationAndAccount(
	adapter: any,
	pluginId: string,
	tenantId = 'default',
) {
	const now = Date.now();
	const integrationId = `${pluginId}-integration`;
	const accountId = `${pluginId}-account`;

	return adapter
		.insert({
			table: 'corsair_integrations',
			data: {
				id: integrationId,
				created_at: now,
				updated_at: now,
				name: pluginId,
				config: JSON.stringify({}),
				dek: null,
			},
		})
		.then(() =>
			adapter.insert({
				table: 'corsair_accounts',
				data: {
					id: accountId,
					created_at: now,
					updated_at: now,
					tenant_id: tenantId,
					integration_id: integrationId,
					config: JSON.stringify({}),
					dek: null,
				},
			}),
		);
}
