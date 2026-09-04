import type { GoogleSubscribePlugin } from '../lib/google/plugins';
import { GOOGLE_SUBSCRIBE_PLUGINS } from '../lib/google/plugins';

export { GOOGLE_SUBSCRIBE_PLUGINS };

export const MICROSOFT_SUBSCRIBE_PLUGINS = [
	'outlook',
	'sharepoint',
	'teams',
	'onedrive',
] as const;

export const SUBSCRIBE_PLUGINS = [
	...MICROSOFT_SUBSCRIBE_PLUGINS,
	...GOOGLE_SUBSCRIBE_PLUGINS,
] as const;

export type SubscribePluginId = (typeof SUBSCRIBE_PLUGINS)[number];

export function isSubscribePluginId(
	pluginId: string,
): pluginId is SubscribePluginId {
	return (SUBSCRIBE_PLUGINS as readonly string[]).includes(pluginId);
}

export function formatSubscribePluginList(): string {
	return SUBSCRIBE_PLUGINS.join(', ');
}

export function isGoogleSubscribePlugin(
	pluginId: string,
): pluginId is GoogleSubscribePlugin {
	return (GOOGLE_SUBSCRIBE_PLUGINS as readonly string[]).includes(pluginId);
}

export function isMicrosoftSubscribePlugin(
	pluginId: string,
): pluginId is (typeof MICROSOFT_SUBSCRIBE_PLUGINS)[number] {
	return (MICROSOFT_SUBSCRIBE_PLUGINS as readonly string[]).includes(pluginId);
}

export async function runWebhookSubscription(
	cwd: string,
	pluginId: string,
): Promise<void> {
	if (!isSubscribePluginId(pluginId)) {
		console.error(
			`[#corsair]: Webhook subscription not supported for plugin '${pluginId}'. Supported: ${formatSubscribePluginList()}`,
		);
		process.exit(1);
	}

	if (isMicrosoftSubscribePlugin(pluginId)) {
		const microsoftPluginRunner = {
			outlook: 'runOutlookSubscribe',
			sharepoint: 'runSharepointSubscribe',
			teams: 'runTeamsSubscribe',
			onedrive: 'runOnedriveSubscribe',
		} as const;

		const mod = await import('../lib/microsoft/subscribe-microsoft');
		const fn = mod[microsoftPluginRunner[pluginId]];
		if (typeof fn === 'function') {
			await (fn as (args: { cwd: string }) => Promise<void>)({ cwd });
			return;
		}
	}

	if (isGoogleSubscribePlugin(pluginId)) {
		const { runGoogleSubscribe } = await import(
			'../lib/google/subscribe-google'
		);
		await runGoogleSubscribe({ cwd, pluginId });
		return;
	}

	console.error(
		`[#corsair]: Webhook subscription not supported for plugin '${pluginId}'. Supported: ${formatSubscribePluginList()}`,
	);
	process.exit(1);
}
