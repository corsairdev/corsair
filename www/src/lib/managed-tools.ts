// Tools Corsair pays the provider for: no account or key of your own, calls
// are paid in Corsair credits. On a /me link these show "Ready, no sign-in
// needed" (hub apps/app components/me/status-cell.tsx).
//
// Credit rules: hub packages/api/src/managed-pricing/credits/constants.ts.
// Prices: hub production `managed_pricing_operation_price`, checked
// 2026-10-31 after corsairdev/hub#268 went live. `unit_credits` is what a call
// holds; with `credits_per_unit` set, the call settles to what it used
// (Reducto per page, TinyFish per step, Exa and Context.dev at the provider's
// cost). A provider that isn't enabled there shows "Soon" and no price.

export const CREDITS_PER_USD = 100;
export const MONTHLY_FREE_CREDITS = 100;

export type ManagedPrice =
	/** The same every call. */
	| { kind: 'flat'; credits: number }
	/** Settles to what the call used, per `unit`. */
	| { kind: 'per'; credits: number; unit: string }
	/** Settles to the provider's cost, never below `credits`. */
	| { kind: 'from'; credits: number }
	/** Settles to the provider's cost, at most `credits`. */
	| { kind: 'upTo'; credits: number };

export type ManagedCall = {
	label: string;
	tool: string;
	/** Required once the provider is live. */
	price?: ManagedPrice;
};

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
			{
				label: 'Read a web page',
				tool: 'scrape.run',
				price: { kind: 'flat', credits: 1 },
			},
			{
				label: 'Search the web',
				tool: 'search.run',
				price: { kind: 'flat', credits: 2 },
			},
		],
	},
	{
		app: 'exa',
		name: 'Exa',
		live: true,
		calls: [
			{
				label: 'Search the web by meaning',
				tool: 'search.search',
				price: { kind: 'from', credits: 1 },
			},
			{
				label: 'Answer a question with sources',
				tool: 'answer.get',
				price: { kind: 'from', credits: 1 },
			},
		],
	},
	{
		app: 'apollo',
		name: 'Apollo',
		live: true,
		calls: [
			{
				label: 'Find people by title and company',
				tool: 'people.search',
				price: { kind: 'flat', credits: 1 },
			},
			{
				label: 'Enrich a person',
				tool: 'people.enrich',
				price: { kind: 'flat', credits: 4 },
			},
		],
	},
	{
		app: 'reducto',
		name: 'Reducto',
		live: true,
		calls: [
			{
				label: 'Parse a PDF or document',
				tool: 'parse.parse',
				price: { kind: 'per', credits: 1, unit: 'page' },
			},
			{
				label: 'Extract fields from a document',
				tool: 'extract.extract',
				price: { kind: 'per', credits: 2, unit: 'page' },
			},
		],
	},
	{
		app: 'tinyfish',
		name: 'TinyFish',
		live: true,
		calls: [
			{
				label: 'Search the web',
				tool: 'search.search',
				price: { kind: 'flat', credits: 1 },
			},
			{
				label: 'Fetch a page',
				tool: 'fetch.fetch',
				price: { kind: 'flat', credits: 1 },
			},
		],
	},
	{
		app: 'contextdev',
		name: 'Context.dev',
		live: true,
		calls: [
			{
				label: "Get a company's brand data",
				tool: 'brand.retrieve',
				price: { kind: 'upTo', credits: 4 },
			},
			{
				label: 'Read a web page',
				tool: 'web.scrape',
				price: { kind: 'upTo', credits: 1 },
			},
		],
	},
	{
		app: 'dataforseo',
		name: 'DataForSEO',
		live: false,
		calls: [
			{ label: 'Google results for a keyword', tool: 'serp.googleOrganic' },
		],
	},
	{
		app: 'typesafe',
		name: 'TypeSafe',
		live: false,
		calls: [{ label: 'Ask Jev a typed question', tool: 'systemOne.ask' }],
	},
];

/** "$0.01" for 1 credit, "$0.02" for 2. */
export function creditsInUsd(credits: number): string {
	return `$${(credits / CREDITS_PER_USD).toFixed(2)}`;
}

/** The price as the card shows it: credits, then dollars. */
export function priceText(price: ManagedPrice): {
	credits: string;
	usd: string;
} {
	const n = `${price.credits} ${price.credits === 1 ? 'credit' : 'credits'}`;
	const usd = creditsInUsd(price.credits);
	switch (price.kind) {
		case 'flat':
			return { credits: n, usd };
		case 'per':
			return {
				credits: `${n} / ${price.unit}`,
				usd: `${usd} / ${price.unit}`,
			};
		case 'from':
			return { credits: `from ${n}`, usd: `from ${usd}` };
		case 'upTo':
			return { credits: `up to ${n}`, usd: `up to ${usd}` };
	}
}
