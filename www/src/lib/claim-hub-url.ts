// The hand-off from corsair.dev/start to Hub's sign-in, ported from lug.dev
// (hub apps/lug/src/lib/hub-url.ts). Hub's login (mode=lug) and its /me
// onboarding read this exact shape, so keep it byte for byte.
import type { Campaign } from './claim-campaign';
import { campaignParams } from './claim-campaign';
import { handleProblem, linkProblem } from './claim-handle';
import { APP_URL } from './site-links';

export type Draft = {
	handle: string;
	link?: string;
	apps: readonly string[];
	/** The agents picked, first one first; Hub opens on it and offers the rest. */
	clients: readonly string[];
	/** A skill slug, passed on so Hub can set that skill up. */
	skill?: string;
};

export const DEFAULT_LINK = 'work';
// Hub's login card shows at most 8 icons; sending more would make onboarding
// seed apps the visitor never saw on that card.
const MAX_APPS = 8;
const ID_RE = /^[a-z0-9]+$/;
const CLIENT_RE = /^[a-z0-9-]+$/;
const SKILL_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// PostHog's anonymous id. corsair.dev and Hub share PostHog's .corsair.dev
// cookie in production; the link carries it anyway, as lug.dev's did.
const DISTINCT_ID_RE =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL ?? APP_URL;

function appList(apps: readonly string[]): string {
	const seen = new Set<string>();
	for (const raw of apps) {
		const id = raw.trim().toLowerCase();
		if (ID_RE.test(id)) seen.add(id);
		if (seen.size === MAX_APPS) break;
	}
	return Array.from(seen).join(',');
}

/** `&skill=<slug>` for Hub's redirect, or nothing; a malformed slug is dropped rather than failing the hand-off. */
function skillParam(skill: string | undefined): string {
	return skill && SKILL_RE.test(skill) ? `&skill=${skill}` : '';
}

function distinctIdParam(id: string | undefined): string {
	return id && DISTINCT_ID_RE.test(id) ? `&ph_did=${id}` : '';
}

/** The hand-off: a full-page navigation target that Hub's login and onboarding read. */
export function buildHubUrl(
	draft: Draft,
	hub: string = HUB_URL,
	distinctId?: string,
	campaign?: Campaign,
): string {
	const link = draft.link || DEFAULT_LINK;
	if (handleProblem(draft.handle)) {
		throw new Error(`invalid handle: ${draft.handle}`);
	}
	if (linkProblem(link)) throw new Error(`invalid link name: ${link}`);
	const clients = Array.from(new Set(draft.clients));
	if (!clients.length) throw new Error('no client');
	for (const id of clients) {
		if (!CLIENT_RE.test(id)) throw new Error(`invalid client: ${id}`);
	}

	const plugins = appList(draft.apps);
	// Comma-separated plugins must stay literal in the nested query; URLSearchParams
	// would encode them and encodeURIComponent(redirect) would double-encode.
	// `client` stays for Hubs that read one agent; `clients` lists them all.
	const redirect = `/me?handle=${draft.handle}&path=${link}&plugins=${plugins}&client=${clients[0]}&clients=${clients.join(',')}${skillParam(draft.skill)}`;
	return `${hub.replace(/\/+$/, '')}/login?mode=lug&handle=${draft.handle}&plugins=${plugins}&redirect=${encodeURIComponent(redirect)}${distinctIdParam(distinctId)}${campaignParams(campaign)}`;
}

/** For people who already have an MCP URL; a draft prefills Hub's login card (handle, apps) and keeps its skill. */
export function hubSignInUrl(
	hub: string = HUB_URL,
	draft?: Draft | null,
	distinctId?: string,
	campaign?: Campaign,
): string {
	const base = hub.replace(/\/+$/, '');
	const skill = skillParam(draft?.skill);
	const redirect = encodeURIComponent(skill ? `/me?${skill.slice(1)}` : '/me');
	if (!draft?.handle || handleProblem(draft.handle)) {
		return `${base}/login?mode=lug&redirect=${redirect}${distinctIdParam(distinctId)}${campaignParams(campaign)}`;
	}
	const plugins = appList(draft.apps);
	let url = `${base}/login?mode=lug&handle=${encodeURIComponent(draft.handle)}&redirect=${redirect}`;
	if (plugins) url += `&plugins=${plugins}`;
	return url + distinctIdParam(distinctId) + campaignParams(campaign);
}
