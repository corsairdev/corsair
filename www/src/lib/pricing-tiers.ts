import { APP_URL } from './site-links';

// The pricing tiers on the homepage. Also rendered into /index.md.
export const TIERS = [
	{
		id: 'hobby' as const,
		name: 'Hobby',
		price: '$0',
		priceSuffix: '/mo',
		description: 'For small projects',
		cta: {
			label: 'Get started',
			href: APP_URL,
			external: true,
			variant: 'link' as const,
		},
		highlighted: false,
	},
	{
		id: 'pro' as const,
		name: 'Pro',
		price: '$200',
		priceSuffix: '/mo',
		description: 'For teams in production',
		cta: {
			label: 'Get started',
			href: `${APP_URL}/login?redirect=${encodeURIComponent('/upgrade')}`,
			external: true,
			variant: 'link' as const,
		},
		highlighted: true,
	},
	{
		id: 'enterprise' as const,
		name: 'Enterprise',
		price: 'Custom',
		priceSuffix: null,
		description: 'For custom needs',
		cta: { label: 'Contact us', variant: 'dialog' as const },
		highlighted: false,
	},
] as const;
