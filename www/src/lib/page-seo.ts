/**
 * Titles and descriptions for pages whose text is built from data, kept here
 * so the length and fallback rules can be tested without rendering a page.
 */

/** Search results cut a description near 160 characters. */
export const META_DESCRIPTION_MAX = 160;

/**
 * A description that fits a search result. Text over the limit is cut at the
 * last whole word and ends with an ellipsis; shorter text is returned as is.
 */
export function clampMetaDescription(
	text: string,
	max: number = META_DESCRIPTION_MAX,
): string {
	const clean = text.replace(/\s+/g, ' ').trim();
	if (clean.length <= max) {
		return clean;
	}
	const cut = clean.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(' ');
	const words = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
	return `${words.replace(/[\s,;:.!?-]+$/, '')}…`;
}

/**
 * The name to show for a contributor. Accounts created from GitHub often have
 * no display name, so the username stands in for it.
 */
export function contributorDisplayName(
	name: string | null | undefined,
	githubUsername: string,
): string {
	const trimmed = name?.trim();
	return trimmed ? trimmed : githubUsername;
}

/**
 * Title, description and index flag for a contributor page under /oss/u.
 * A profile with nothing claimed is kept out of the index.
 */
export function contributorSeoText({
	name,
	githubUsername,
	integrationCount,
}: {
	name: string | null | undefined;
	githubUsername: string;
	integrationCount: number;
}): { title: string; description: string; indexable: boolean } {
	const displayName = contributorDisplayName(name, githubUsername);
	const handle = `@${githubUsername}`;
	const title =
		displayName.toLowerCase() === githubUsername.toLowerCase()
			? `${handle}, Corsair open-source contributor`
			: `${displayName} (${handle}), Corsair open-source contributor`;
	const claimed = `${integrationCount} integration${integrationCount === 1 ? '' : 's'} claimed`;
	const description = clampMetaDescription(
		`${displayName} (${handle}) contributes to Corsair's open-source integration catalog: ${claimed}. See each integration's status and the points earned.`,
	);
	// A profile with nothing claimed has no content of its own to rank for.
	return { title, description, indexable: integrationCount > 0 };
}

/**
 * Title and description for an /oss/<slug> page. The title talks about
 * contributing so it does not compete with /integrations/<slug> in search.
 */
export function ossIntegrationSeoText(integrationName: string): {
	title: string;
	description: string;
} {
	return {
		title: `${integrationName} integration: status and how to contribute`,
		description: clampMetaDescription(
			`${integrationName} in Corsair's open-source integration catalog: what the integration covers, whether it is built or open to claim, and how to contribute it.`,
		),
	};
}
