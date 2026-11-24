import { CLAIM_HREF, ENTERPRISE_CAL_URL } from './site-links';

/**
 * Plans for an MCP URL (the gateway), moved here from lug.dev/pricing.
 * They match the products in Stripe: Pro monthly and yearly, Enterprise and
 * credit packs; no subscription is Free. Pro became 10,000 credits a month and
 * $5 per 1,000 extra on the 11-20 call. The SDK's own plans are on /developers.
 */

export type Billing = 'month' | 'year';

export type GatewayPlan = {
	id: 'free' | 'pro' | 'enterprise';
	name: string;
	price: string;
	/** Price per month when paid yearly; absent when the plan has no yearly price. */
	yearPrice?: string;
	per?: string;
	/** Shown under the price when paid yearly. */
	yearNote?: string;
	blurb: string;
	features: readonly string[];
	cta: { label: string; href: string; external?: boolean };
};

/** Pro paid yearly: $192, i.e. $16 a month, 20% off the monthly price. */
export const PRO_YEARLY_SAVING = '20%';

export const DEALS_MAIL =
	'mailto:team@corsair.dev?subject=Corsair%20startup%20discount';

export const GATEWAY_PLANS: readonly GatewayPlan[] = [
	{
		id: 'free',
		name: 'Free',
		price: '$0',
		blurb: 'For trying it with your own apps.',
		features: [
			'10 connections',
			'100 credits a month',
			'Limited AI usage',
			'5 GB of files',
			'Built-in issues, CRM and files',
		],
		cta: { label: 'Claim your URL', href: CLAIM_HREF },
	},
	{
		id: 'pro',
		name: 'Pro',
		price: '$20',
		yearPrice: '$16',
		per: '/month',
		yearNote: 'Billed $192 a year',
		blurb: 'For agents that work every day.',
		features: [
			'30 connections',
			'10,000 credits a month',
			'More credits at $5 per 1,000',
			'More AI usage',
			'Dedicated Slack support',
			'Everything in Free',
		],
		cta: { label: 'Claim your URL', href: CLAIM_HREF },
	},
	{
		id: 'enterprise',
		name: 'Enterprise',
		price: 'Custom',
		blurb: 'For teams that need more seats and control.',
		features: [
			'Custom seats and connections',
			"AI governance: see which apps and tools your team's agents use",
			'Priority support with an SLA',
			'Everything in Pro',
		],
		cta: { label: 'Contact us', href: ENTERPRISE_CAL_URL, external: true },
	},
];
