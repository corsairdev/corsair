import { APP_URL } from './site-links';

/**
 * The client setup guides and starter skills, read from Hub (one copy: Hub's
 * onboarding uses the same lists). Hub serves them at /api/public/gateway,
 * built from explorer/src/gateway-content.ts in Corsair's hub repo. The guides
 * come written for a placeholder URL and the skills without their instructions.
 */

export const GATEWAY_CONTENT_URL =
	process.env.GATEWAY_CONTENT_URL ?? `${APP_URL}/api/public/gateway`;

/** The version this site reads. Hub bumps it only when a field changes meaning. */
const VERSION = 1;

export type CopyValue = { label: string; value: string; secret?: boolean };
export type GuideStep = { text: string; copy?: CopyValue[]; or?: string };
export type ClientGuide = {
	snippet?: { label: string; code: string };
	install?: { label: string; href: string };
	or?: string;
	steps: GuideStep[];
	note?: string;
};

export type GatewayClient = {
	id: string;
	name: string;
	domain: string;
	terminal?: boolean;
	aliases?: string[];
	family?: { id: string; name: string; variant: string };
	auth: 'sign-in' | 'key' | 'both' | 'secret-url';
	featured: boolean;
	guide: ClientGuide;
};

export type BuiltInApp = 'pm' | 'crm' | 'files' | 'pg';
export type SkillCategory = {
	id: string;
	name: string;
	blurb: string;
};

export type GatewaySkill = {
	/** The page URL (corsair.dev/skills/<slug>) and the name the skill is saved under. */
	slug: string;
	name: string;
	/** One sentence: the card, the page's lede and its meta description. */
	summary: string;
	category: string;
	/** Catalog app ids the skill can't run without. */
	required: readonly string[];
	/** Catalog app ids that add to it when connected. Each can be skipped. */
	optional: readonly string[];
	builtIn: readonly BuiltInApp[];
	/** What it does, in order. */
	steps: readonly string[];
	/** What the person ends up with. */
	result: string;
	/** The page's "Good to know" list. */
	notes?: readonly string[];
	/** When it runs, as a person would say it. Absent: it runs when asked. */
	schedule?: string;
};

export type GatewayContent = {
	version: number;
	/** Featured clients first. */
	clients: GatewayClient[];
	skills: GatewaySkill[];
	skillCategories: SkillCategory[];
	builtIns: Record<BuiltInApp, string>;
	/** Display names for every app a skill uses. */
	appNames: Record<string, string>;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
	Boolean(value) && typeof value === 'object' && !Array.isArray(value);

/** Checks the shape this site relies on, so a bad answer fails the build instead of publishing empty pages. */
export function parseGatewayContent(data: unknown): GatewayContent {
	if (!isObject(data)) throw new Error('gateway content: not an object');
	if (data.version !== VERSION) {
		throw new Error(
			`gateway content: version ${String(data.version)}, this site reads ${VERSION}`,
		);
	}
	const { clients, skills, skillCategories, builtIns, appNames } = data;
	if (!Array.isArray(clients) || clients.length === 0) {
		throw new Error('gateway content: no clients');
	}
	if (!Array.isArray(skills) || skills.length === 0) {
		throw new Error('gateway content: no skills');
	}
	if (
		!Array.isArray(skillCategories) ||
		!isObject(builtIns) ||
		!isObject(appNames)
	) {
		throw new Error(
			'gateway content: categories, built-ins or app names missing',
		);
	}
	for (const client of clients) {
		if (
			!isObject(client) ||
			typeof client.id !== 'string' ||
			!isObject(client.guide)
		) {
			throw new Error('gateway content: a client without an id or guide');
		}
	}
	for (const skill of skills) {
		if (
			!isObject(skill) ||
			typeof skill.slug !== 'string' ||
			!Array.isArray(skill.required) ||
			!Array.isArray(skill.optional)
		) {
			throw new Error('gateway content: a skill without a slug or apps');
		}
	}
	return data as unknown as GatewayContent;
}

/** Hub's lists, refreshed at most hourly. Throws when Hub can't be read, so a build never ships empty pages. */
export async function getGatewayContent(): Promise<GatewayContent> {
	const res = await fetch(GATEWAY_CONTENT_URL, { next: { revalidate: 3600 } });
	if (!res.ok) {
		throw new Error(
			`gateway content: ${GATEWAY_CONTENT_URL} answered ${res.status}`,
		);
	}
	return parseGatewayContent(await res.json());
}
