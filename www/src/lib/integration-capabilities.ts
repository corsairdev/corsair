import type {
	IntegrationCapabilityAction,
	IntegrationCapabilityGroup,
} from '@/lib/integration-page.types';

// Plumbing a visitor can't use: Slack's URL verification handshake arrives as
// a "challenge" event, but it only proves the webhook address to Slack.
const HIDDEN_TRIGGER_RESOURCES = new Set(['challenge']);

// Resources that are admin or API scaffolding rather than everyday work. They
// stay on the page, after the rest, so a visitor first sees messages, issues
// and deals rather than Slack Enterprise Grid admin calls.
const LATE_RESOURCES = new Set([
	'admin',
	'composite',
	'jobs',
	'metadata',
	'uiapi',
]);

export type CapabilityCard = IntegrationCapabilityAction & {
	resource: string;
	resourceLabel: string;
};

export function visibleTriggerGroups(
	groups: IntegrationCapabilityGroup[],
): IntegrationCapabilityGroup[] {
	return groups.filter(
		(group) => !HIDDEN_TRIGGER_RESOURCES.has(group.resource.toLowerCase()),
	);
}

/**
 * Groups in the order a visitor should meet them: the ones holding operations
 * the use cases rely on first (in that order), then the biggest groups, with
 * admin and API scaffolding last. Inside a group, featured operations lead and
 * the rest stay alphabetical.
 */
export function orderCapabilityGroups(
	groups: IntegrationCapabilityGroup[],
	featuredIds: readonly string[] = [],
): IntegrationCapabilityGroup[] {
	const rank = new Map(featuredIds.map((id, index) => [id, index]));
	const firstFeatured = (group: IntegrationCapabilityGroup) =>
		Math.min(...group.actions.map((action) => rank.get(action.id) ?? Infinity));
	const isLate = (group: IntegrationCapabilityGroup) =>
		LATE_RESOURCES.has(group.resource.toLowerCase());

	return [...groups]
		.sort(
			(a, b) =>
				Number(isLate(a)) - Number(isLate(b)) ||
				firstFeatured(a) - firstFeatured(b) ||
				b.actions.length - a.actions.length ||
				a.resourceLabel.localeCompare(b.resourceLabel),
		)
		.map((group) => ({
			...group,
			actions: [...group.actions].sort(
				(a, b) =>
					(rank.get(a.id) ?? Infinity) - (rank.get(b.id) ?? Infinity) ||
					a.label.localeCompare(b.label),
			),
		}));
}

// "Messages" -> "Message", "Activities" -> "Activity", "Branches" -> "Branch",
// "Addresses" -> "Address"; leaves "Status", "Address" and "Analysis" alone.
function singular(word: string): string {
	if (/ies$/i.test(word)) return `${word.slice(0, -3)}y`;
	if (/(ch|sh|x|ss)es$/i.test(word)) return word.slice(0, -2);
	if (/(ss|us|is)$/i.test(word) || !/s$/i.test(word)) return word;
	return word.slice(0, -1);
}

/**
 * Trigger names in the catalog are only the verb ("Opened", "Created"), which
 * reads as nothing on a card of its own. Prefix the resource, singular, in
 * sentence case: "Issue opened", "File shared", "Pull request ready for review".
 */
export function triggerLabel(resourceLabel: string, label: string): string {
	const words = resourceLabel.trim().split(/\s+/).filter(Boolean);
	const resource = words
		.map((word, i) => (i === words.length - 1 ? singular(word) : word))
		.join(' ');
	const verb = label.trim();
	const phrase =
		!resource || verb.toLowerCase().startsWith(resource.toLowerCase())
			? verb
			: `${resource} ${verb}`;
	const lower = phrase.toLowerCase();
	return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function flattenCapabilityGroups(
	groups: IntegrationCapabilityGroup[],
	kind: 'tools' | 'triggers',
): CapabilityCard[] {
	return groups.flatMap((group) =>
		group.actions.map((action) => ({
			...action,
			label:
				kind === 'triggers'
					? triggerLabel(group.resourceLabel, action.label)
					: action.label,
			resource: group.resource,
			resourceLabel: group.resourceLabel,
		})),
	);
}

export function matchesCapabilityQuery(
	card: CapabilityCard,
	query: string,
): boolean {
	const words = query.toLowerCase().split(/\s+/).filter(Boolean);
	if (words.length === 0) return true;
	const haystack =
		`${card.label} ${card.description ?? ''} ${card.id} ${card.resourceLabel}`.toLowerCase();
	return words.every((word) => haystack.includes(word));
}
