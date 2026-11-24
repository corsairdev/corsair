import { z } from 'zod';

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

const guideStep = z.object({
	text: z.string(),
	copy: z
		.array(
			z.object({
				label: z.string(),
				value: z.string(),
				secret: z.boolean().optional(),
			}),
		)
		.optional(),
	or: z.string().optional(),
});

const clientSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	domain: z.string(),
	terminal: z.boolean().optional(),
	aliases: z.array(z.string()).optional(),
	family: z
		.object({ id: z.string(), name: z.string(), variant: z.string() })
		.optional(),
	auth: z.enum(['sign-in', 'key', 'both', 'secret-url']),
	featured: z.boolean(),
	guide: z.object({
		snippet: z.object({ label: z.string(), code: z.string() }).optional(),
		install: z.object({ label: z.string(), href: z.string() }).optional(),
		or: z.string().optional(),
		steps: z.array(guideStep),
		note: z.string().optional(),
	}),
});

const builtInApp = z.enum(['pm', 'crm', 'files', 'pg']);

const skillSchema = z.object({
	slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
	name: z.string().min(1),
	summary: z.string().min(1),
	category: z.string().min(1),
	required: z.array(z.string()),
	optional: z.array(z.string()),
	builtIn: z.array(builtInApp),
	steps: z.array(z.string()).min(1),
	result: z.string(),
	notes: z.array(z.string()).optional(),
	schedule: z.string().optional(),
});

const contentSchema = z
	.object({
		version: z.literal(VERSION),
		clients: z.array(clientSchema).min(1),
		skills: z.array(skillSchema).min(1),
		skillCategories: z
			.array(
				z.object({
					id: z.string().min(1),
					name: z.string().min(1),
					blurb: z.string(),
				}),
			)
			.min(1),
		builtIns: z.record(builtInApp, z.string()),
		appNames: z.record(z.string(), z.string()),
	})
	.superRefine((content, ctx) => {
		// /skills shows skills inside their category, so one outside every
		// category would vanish from the directory.
		const categories = new Set(content.skillCategories.map((c) => c.id));
		for (const skill of content.skills) {
			if (!categories.has(skill.category)) {
				ctx.addIssue({
					code: 'custom',
					message: `skill ${skill.slug} is in unknown category ${skill.category}`,
				});
			}
		}
	});

/**
 * Checks Hub's answer against everything the pages read, so a bad answer fails
 * the build instead of publishing empty or broken pages. `data` is `unknown`
 * because it is parsed JSON from another service: its type is only known
 * after this check.
 */
export function parseGatewayContent(data: unknown): GatewayContent {
	const result = contentSchema.safeParse(data);
	if (!result.success) {
		const issue = result.error.issues[0];
		const where = issue?.path.length ? ` at ${issue.path.join('.')}` : '';
		throw new Error(`gateway content: ${issue?.message ?? 'invalid'}${where}`);
	}
	return result.data;
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
