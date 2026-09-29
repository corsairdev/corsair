export const DOCS_URL = 'https://docs.corsair.dev';
export const GITHUB_URL = 'https://github.com/corsairdev/corsair';
export const GITHUB_ISSUES_URL = `${GITHUB_URL}/issues`;
export const GITHUB_LICENSE_URL = `${GITHUB_URL}/blob/main/LICENSE`;
export const APP_URL = 'https://hub.corsair.dev';

/** Hub login from www integration pages (plugin-aware copy on the login card). */
export function hubWwwPluginsLoginUrl(pluginIds: readonly string[]): string {
	const plugins = [
		...new Set(pluginIds.map((id) => id.trim().toLowerCase()).filter(Boolean)),
	].join(',');
	const params = new URLSearchParams({
		title: 'app',
		mode: 'www',
		plugins,
	});
	return `${APP_URL}/login?${params.toString()}`;
}

export function hubWwwPluginLoginUrl(pluginId: string): string {
	return hubWwwPluginsLoginUrl([pluginId]);
}
export const TWITTER_URL = 'https://x.com/corsairdotdev';
export const DISCORD_URL = 'https://discord.com/invite/uNgCP3mSzU';
export const ENTERPRISE_CONTACT_URL = '';
export const ENTERPRISE_CAL_URL = 'https://cal.com/dev-jain-ar3ec6/30min';
