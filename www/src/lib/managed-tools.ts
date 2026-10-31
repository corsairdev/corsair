// Tools Corsair pays the provider for: no account or key of your own, calls
// are paid in Corsair credits. On a /me link these show "Ready, no sign-in
// needed" (hub apps/app components/me/status-cell.tsx).
//
// Credit rules: hub packages/api/src/managed-pricing/credits/constants.ts.
// Prices: hub production `managed_pricing_operation_price` (unit_credits),
// checked 2026-10-31, for `live` providers. The others go live with
// corsairdev/hub#268; their prices are the agreed sheet
// (corsair-work/managed-pricing/price-sheet-2026-10-26). Set `live: true` once
// each is enabled in Hub admin with a key and these prices.

export const CREDITS_PER_USD = 100;
export const MONTHLY_FREE_CREDITS = 100;

export type ManagedCall = { label: string; tool: string; credits: number };

export type ManagedTool = {
	app: string;
	name: string;
	live: boolean;
	calls: ManagedCall[];
};

export const MANAGED_TOOLS: ManagedTool[] = [
	{
		app: 'firecrawl',
		name: 'Firecrawl',
		live: true,
		calls: [
			{ label: 'Read a web page', tool: 'scrape.run', credits: 1 },
			{ label: 'Search the web', tool: 'search.run', credits: 2 },
		],
	},
	{
		app: 'exa',
		name: 'Exa',
		live: false,
		calls: [
			{ label: 'Search the web by meaning', tool: 'search.search', credits: 3 },
			{
				label: 'Answer a question with sources',
				tool: 'answer.get',
				credits: 1,
			},
		],
	},
	{
		app: 'reducto',
		name: 'Reducto',
		live: false,
		calls: [
			{ label: 'Parse a PDF or document', tool: 'parse.parse', credits: 20 },
			{
				label: 'Extract fields from a document',
				tool: 'extract.extract',
				credits: 40,
			},
		],
	},
	{
		app: 'tinyfish',
		name: 'TinyFish',
		live: false,
		calls: [
			{ label: 'Search the web', tool: 'search.search', credits: 1 },
			{ label: 'Run a browser agent', tool: 'agent.run', credits: 40 },
		],
	},
	{
		app: 'dataforseo',
		name: 'DataForSEO',
		live: false,
		calls: [
			{
				label: 'Google results for a keyword',
				tool: 'serp.googleOrganic',
				credits: 1,
			},
			{
				label: 'Search volume for keywords',
				tool: 'keywords.searchVolume',
				credits: 15,
			},
		],
	},
];

/** "$0.01" for 1 credit, "$0.02" for 2. */
export function creditsInUsd(credits: number): string {
	return `$${(credits / CREDITS_PER_USD).toFixed(2)}`;
}
