export async function runWebhookSubscription(
	cwd: string,
	pluginId: string,
): Promise<void> {
	const microsoftPluginRunner: Record<string, string> = {
		outlook: 'runOutlookSubscribe',
		sharepoint: 'runSharepointSubscribe',
		teams: 'runTeamsSubscribe',
		onedrive: 'runOnedriveSubscribe',
	};

	if (pluginId in microsoftPluginRunner) {
		const mod = await import('../lib/microsoft/subscribe-microsoft');
		const fn = mod[microsoftPluginRunner[pluginId] as keyof typeof mod];
		if (typeof fn === 'function') {
			await (fn as (args: { cwd: string }) => Promise<void>)({ cwd });
			return;
		}
	}

	if (
		['gmail', 'googledrive', 'googlecalendar', 'googlesheets'].includes(
			pluginId,
		)
	) {
		const { runGoogleSubscribe } = await import(
			'../lib/google/subscribe-google'
		);
		await runGoogleSubscribe({ cwd, pluginId });
		return;
	}

	console.error(
		`[#corsair]: Webhook subscription not supported for plugin '${pluginId}'.`,
	);
	process.exit(1);
}
