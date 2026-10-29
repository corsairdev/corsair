export const DOCS_URL = 'https://docs.corsair.dev';
export const GITHUB_URL = 'https://github.com/corsairdev/corsair';
export const GITHUB_ISSUES_URL = `${GITHUB_URL}/issues`;
export const GITHUB_LICENSE_URL = `${GITHUB_URL}/blob/main/LICENSE`;
export const APP_URL = 'https://hub.corsair.dev';
/** The one hosted MCP address every client adds (docs/cloud/mcp.mdx). */
export const MCP_URL = 'https://mcp.corsair.dev/mcp';
export const MCP_DOCS_URL = `${DOCS_URL}/cloud/mcp`;
/**
 * Cursor's web install link: it opens Cursor's install prompt, and shows the
 * config to paste when Cursor isn't installed (cursor.com/docs/mcp/install-links).
 */
export const CURSOR_INSTALL_URL = `https://cursor.com/install-mcp?${new URLSearchParams(
	{ name: 'corsair', config: btoa(JSON.stringify({ url: MCP_URL })) },
).toString()}`;

function normalizePluginIds(pluginIds: readonly string[]): string {
	return [
		...new Set(pluginIds.map((id) => id.trim().toLowerCase()).filter(Boolean)),
	].join(',');
}

/**
 * Hub login for developers on the SDK (plugin-aware copy on the login card).
 * It lands on /dashboard: no `title`, since that is the agent handoff, which
 * mints a new project on every visit.
 */
export function hubWwwPluginsLoginUrl(pluginIds: readonly string[]): string {
	const params = new URLSearchParams({
		mode: 'www',
		plugins: normalizePluginIds(pluginIds),
	});
	return `${APP_URL}/login?${params.toString()}`;
}

export function hubWwwPluginLoginUrl(pluginId: string): string {
	return hubWwwPluginsLoginUrl([pluginId]);
}

/**
 * Hub login for MCP users: it lands on /me/onboarding with the app already
 * picked. Goes through /login because a signed-out visit to /me loses its
 * query; Hub sends a signed-in visitor straight on.
 */
export function hubMcpConnectUrl(pluginId: string): string {
	const plugins = normalizePluginIds([pluginId]);
	const params = new URLSearchParams({
		mode: 'www',
		plugins,
		redirect: `/me/onboarding?${new URLSearchParams({ plugins })}`,
	});
	return `${APP_URL}/login?${params.toString()}`;
}
export const TWITTER_URL = 'https://x.com/corsairdotdev';
export const DISCORD_URL = 'https://discord.com/invite/uNgCP3mSzU';
export const ENTERPRISE_CONTACT_URL = '';
export const ENTERPRISE_CAL_URL = 'https://cal.com/dev-jain-ar3ec6/30min';
