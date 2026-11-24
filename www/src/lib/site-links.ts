export const DOCS_URL = 'https://docs.corsair.dev';
export const GITHUB_URL = 'https://github.com/corsairdev/corsair';
export const GITHUB_ISSUES_URL = `${GITHUB_URL}/issues`;
export const GITHUB_LICENSE_URL = `${GITHUB_URL}/blob/main/LICENSE`;
export const APP_URL = 'https://hub.corsair.dev';
/** The one hosted MCP address every client adds (docs/cloud/mcp.mdx). */
export const MCP_URL = 'https://mcp.corsair.dev/mcp';
export const MCP_DOCS_URL = `${DOCS_URL}/cloud/mcp`;
/** The agent onboarding file (www/public/skill.md). */
export const SKILL_URL = 'https://corsair.dev/skill.md';
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
 * Hub login for MCP users: /me?add=<app> opens the app's connect panel on their
 * link, or onboarding with the app picked if they have none. Goes through
 * /login because a signed-out visit to /me loses its query; Hub sends a
 * signed-in visitor straight on.
 */
export function hubMcpConnectUrl(pluginId: string): string {
	const plugins = normalizePluginIds([pluginId]);
	// mode=lug: Hub counts them as MCP gateway users, so later visits land on /me too.
	const params = new URLSearchParams({
		mode: 'lug',
		plugins,
		redirect: `/me?${new URLSearchParams({ add: plugins })}`,
	});
	return `${APP_URL}/login?${params.toString()}`;
}
/** Lug: personal MCP addresses, yourname.lug.dev (hub apps/lug). */
export const LUG_URL = 'https://lug.dev';

// Mirrors hub apps/lug/src/lib/handle.ts (format and reserved names). Hub is
// the authority: it re-checks the handle, its blocklist and availability.
const LUG_HANDLE_RE = /^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$/;
const LUG_RESERVED = new Set([
	'www',
	'api',
	'app',
	'mcp',
	'hub',
	'admin',
	'auth',
	'oauth',
	'login',
	'signup',
	'docs',
	'mail',
	'smtp',
	'status',
	'help',
	'support',
	'blog',
	'dashboard',
	'console',
	'corsair',
	'static',
	'cdn',
	'assets',
	'root',
	'security',
	'abuse',
	'postmaster',
	'billing',
	'_box',
]);

export function lugHandleProblem(handle: string): 'format' | 'reserved' | null {
	if (!LUG_HANDLE_RE.test(handle)) return 'format';
	// xn-- renders as unicode, so one handle could pass for another.
	if (handle.slice(2, 4) === '--') return 'format';
	if (LUG_RESERVED.has(handle)) return 'reserved';
	return null;
}

/**
 * Claiming a handle typed on corsair.dev: Hub sign-in in Lug mode, which
 * names the handle on the login card, then /me, whose claim box opens with it
 * filled in and checks that it is free (hub apps/app components/me/address.tsx).
 */
export function hubLugClaimUrl(handle: string): string {
	const h = handle.trim().toLowerCase();
	const params = new URLSearchParams({
		mode: 'lug',
		handle: h,
		redirect: `/me?${new URLSearchParams({ handle: h })}`,
	});
	return `${APP_URL}/login?${params.toString()}`;
}

/**
 * Where "Claim your URL" and "Get started" go: corsair.dev/start, the steps
 * lug.dev had (name, apps, agents), which hand off to Hub's sign-in.
 */
export const CLAIM_HREF = '/start';

/**
 * Hub sign-in for people who already have an MCP URL. `mode=lug` is Hub's
 * internal flag for the MCP gateway: it lands them on /me (their links and
 * apps), not on the developer dashboard.
 */
export function hubMeSignInUrl(): string {
	const params = new URLSearchParams({ mode: 'lug', redirect: '/me' });
	return `${APP_URL}/login?${params.toString()}`;
}

/** "Set up" links that start the claim with apps (and a skill) already picked. */
export function claimHref(
	opts: { apps?: readonly string[]; skill?: string } = {},
): string {
	const apps = normalizePluginIds(opts.apps ?? []);
	const params = new URLSearchParams();
	if (apps) params.set('apps', apps);
	if (opts.skill) params.set('skill', opts.skill);
	const query = params.toString();
	return query ? `${CLAIM_HREF}?${query}` : CLAIM_HREF;
}

/** Sign in and open /me with a skill ready to set up, for people who already have an MCP URL. */
export function hubMeSkillUrl(skill: string): string {
	const params = new URLSearchParams({
		mode: 'lug',
		redirect: `/me?${new URLSearchParams({ skill })}`,
	});
	return `${APP_URL}/login?${params.toString()}`;
}

/**
 * The agent signup steps (auth.md). corsair.dev/auth.md redirects to Hub's
 * copy; an agent that reads it can sign its person up and send them a claim email.
 */
export const AGENT_SIGNUP_URL = 'https://corsair.dev/auth.md';

/**
 * The developer console on Hub. /console always opens the dashboard, even for
 * someone who also has an MCP URL (Hub sends those to /me otherwise).
 */
export const CONSOLE_URL = `${APP_URL}/console`;

/** Billing for an MCP URL's plan, on Hub. */
export const HUB_ME_BILLING_URL = `${APP_URL}/me/billing`;

/** Corsair's MCP server in the ChatGPT, Cursor, Claude Code and Hermes listings. */
export const CHATGPT_LISTING_URL =
	'https://chatgpt.com/plugins/plugin_asdk_app_6ae189f951708191920e9f41269c8cde';
export const CURSOR_DIRECTORY_URL = 'https://cursor.directory/plugins/corsair';

export const TWITTER_URL = 'https://x.com/corsairdotdev';
export const DISCORD_URL = 'https://discord.com/invite/uNgCP3mSzU';
export const ENTERPRISE_CONTACT_URL = '';
export const ENTERPRISE_CAL_URL = 'https://cal.com/dev-jain-ar3ec6/30min';
