// "Built with Corsair": projects outside the team built on Corsair. The list lives in
// github.com/corsairdev/awesome-corsair (data/projects.yaml), whose build writes data/built-with.json; this page
// reads that file, so a merged entry shows up within the revalidate window without a deploy here.

export const BUILT_WITH_REPO = 'https://github.com/corsairdev/awesome-corsair';
export const BUILT_WITH_SUBMIT = `${BUILT_WITH_REPO}/blob/main/CONTRIBUTING.md#how-to-submit`;
const DATA_URL =
	'https://raw.githubusercontent.com/corsairdev/awesome-corsair/main/data/built-with.json';
/** Seconds between re-reads of the list. */
export const BUILT_WITH_REVALIDATE = 3600;

export type BuiltWithCategory = { id: string; title: string; blurb: string };

export type BuiltWithProject = {
	id: string;
	name: string;
	url: string;
	repo: string;
	author: string;
	category: string;
	kind: string[];
	lang: string[];
	corsair: string[];
	description: string;
	event: string;
	hosted: boolean;
	added: string;
	verified: boolean;
};

export type BuiltWith = {
	categories: BuiltWithCategory[];
	projects: BuiltWithProject[];
};

const isProject = (p: unknown): p is BuiltWithProject => {
	const o = p as Record<string, unknown>;
	return (
		Boolean(o) &&
		typeof o.id === 'string' &&
		typeof o.name === 'string' &&
		typeof o.url === 'string' &&
		/^https?:\/\//.test(o.url) &&
		typeof o.repo === 'string' &&
		typeof o.description === 'string' &&
		typeof o.category === 'string' &&
		Array.isArray(o.corsair)
	);
};

/** Keeps only well-formed entries, so a bad row in the source can't break the page. */
export function parseBuiltWith(json: unknown): BuiltWith | null {
	const o = json as Record<string, unknown>;
	if (!o || !Array.isArray(o.categories) || !Array.isArray(o.projects))
		return null;
	const categories = (o.categories as BuiltWithCategory[]).filter(
		(c) => c && typeof c.id === 'string' && typeof c.title === 'string',
	);
	const projects = (o.projects as unknown[]).filter(isProject).map((p) => ({
		...p,
		kind: Array.isArray(p.kind) ? p.kind : [],
		lang: Array.isArray(p.lang) ? p.lang : [],
		event: typeof p.event === 'string' ? p.event : '',
		hosted: p.hosted === true,
		verified: p.verified === true,
	}));
	return { categories, projects };
}

export async function getBuiltWith(): Promise<BuiltWith | null> {
	try {
		const res = await fetch(DATA_URL, {
			next: { revalidate: BUILT_WITH_REVALIDATE },
		});
		if (!res.ok) return null;
		return parseBuiltWith(await res.json());
	} catch {
		return null;
	}
}

/** Categories in the source's order, each with its projects by name; empty categories are left out. */
export function builtWithByCategory(data: BuiltWith) {
	return data.categories
		.map((category) => ({
			category,
			projects: data.projects
				.filter((p) => p.category === category.id)
				.sort((a, b) => a.name.localeCompare(b.name)),
		}))
		.filter((g) => g.projects.length > 0);
}

const APP_NAMES: Record<string, string> = {
	gmail: 'Gmail',
	googlecalendar: 'Google Calendar',
	googledrive: 'Google Drive',
	googlesheets: 'Google Sheets',
	github: 'GitHub',
	slack: 'Slack',
	linear: 'Linear',
	notion: 'Notion',
	outlook: 'Outlook',
	jira: 'Jira',
	hubspot: 'HubSpot',
	zendesk: 'Zendesk',
	discord: 'Discord',
	telegram: 'Telegram',
	calendly: 'Calendly',
	stripe: 'Stripe',
	exa: 'Exa',
	firecrawl: 'Firecrawl',
	resend: 'Resend',
	airtable: 'Airtable',
	asana: 'Asana',
	trello: 'Trello',
	todoist: 'Todoist',
	zoom: 'Zoom',
	sentry: 'Sentry',
	posthog: 'PostHog',
};

/** The apps a project uses that have a logo: real plugin ids only, not the "mcp" marker or a "plus-N-more" count. */
export function builtWithApps(project: BuiltWithProject): string[] {
	return project.corsair.filter((id) => /^[a-z0-9]+$/.test(id) && id !== 'mcp');
}

/** How many more plugins the source counted than it listed ("plus-278-more"). */
export function builtWithMoreApps(project: BuiltWithProject): number {
	const more = project.corsair
		.map((id) => /^plus-(\d+)-more$/.exec(id)?.[1])
		.find(Boolean);
	return more ? Number(more) : 0;
}

export function builtWithAppName(id: string): string {
	return APP_NAMES[id] ?? id.charAt(0).toUpperCase() + id.slice(1);
}

export function builtWithCategorySlug(id: string): string {
	return id.replace(/[^a-z0-9-]/g, '');
}
