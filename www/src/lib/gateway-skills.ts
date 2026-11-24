/**
 * Helpers for the starter skills. The skills themselves come from Hub (see
 * gateway-content.ts), so these take the lists they work on as arguments.
 */
import type {
	BuiltInApp,
	GatewayContent,
	GatewaySkill,
} from './gateway-content';

export type { GatewaySkill } from './gateway-content';

export function skillBySlug<S extends { slug: string }>(
	skills: readonly S[],
	slug: string,
): S | undefined {
	return skills.find((s) => s.slug === slug);
}

/** The apps to start a new URL with for this skill: required first, then optional. */
export function skillApps(
	skill: Pick<GatewaySkill, 'required' | 'optional'>,
): string[] {
	return Array.from(new Set([...skill.required, ...skill.optional]));
}

/** Title and meta description for a skill's page. */
export function skillMeta(skill: GatewaySkill): {
	title: string;
	description: string;
} {
	return {
		title: `${skill.name}: a skill for your AI agent`,
		description: `${skill.summary} Set it up on Corsair for Claude, ChatGPT, Cursor or Codex.`,
	};
}

/** "Every weekday at 8:00", or how a skill without a schedule runs. */
export function skillWhen(skill: GatewaySkill): string {
	return skill.schedule ?? 'When you ask';
}

export function builtInNames(
	builtIns: GatewayContent['builtIns'],
	skill: GatewaySkill,
): string[] {
	return skill.builtIn.map((b: BuiltInApp) => builtIns[b] ?? b);
}

export function appName(names: Record<string, string>, id: string): string {
	return names[id] ?? id;
}

/** "Google Calendar and Exa" / "Gmail, Slack and Linear". */
export function listNames(
	names: Record<string, string>,
	ids: readonly string[],
): string {
	const list = ids.map((id) => appName(names, id));
	if (list.length <= 1) return list.join('');
	return `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`;
}
