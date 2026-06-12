export type IntegrationTagDefinition = {
	name: string;
	slug: string;
	color: string;
	patterns: RegExp[];
	/** Integration slugs that should always receive this tag. */
	slugOverrides?: string[];
};

export type IntegrationTagSummary = {
	slug: string;
	name: string;
	color: string;
};

export const INTEGRATION_TAG_DEFINITIONS: IntegrationTagDefinition[] = [
	{
		name: 'CRM',
		slug: 'crm',
		color: '#fce8ef',
		patterns: [
			/\bcrm\b/i,
			/customer relationship/i,
			/sales pipeline/i,
			/salesforce|hubspot|pipedrive|close\.com|zoho crm|attio|affinity/i,
			/lead management|deal flow|private capital|sales engagement/i,
		],
		slugOverrides: ['attio', 'affinity', 'agencyzoom'],
	},
	{
		name: 'Project Management',
		slug: 'project-management',
		color: '#e8f0fe',
		patterns: [
			/project management|task management|work management|issue tracking/i,
			/\b(jira|asana|trello|clickup|basecamp|linear|monday)\b/i,
			/kanban|sprint|backlog|roadmap/i,
		],
	},
	{
		name: 'Communication',
		slug: 'communication',
		color: '#e6f4ea',
		patterns: [
			/messaging|chat platform|team chat|instant messag|push notification/i,
			/\b(slack|discord|twilio|vonage|telegram|whatsapp|zoom|ably)\b/i,
			/video conferenc|voice call|sms|real-time messag/i,
		],
	},
	{
		name: 'Email',
		slug: 'email',
		color: '#fef3e0',
		patterns: [
			/\bemail\b/i,
			/email (marketing|campaign|verification|deliverability)/i,
			/newsletter|inbox|sendgrid|mailchimp|postmark|mailgun|agent mail/i,
		],
	},
	{
		name: 'Dev Tools',
		slug: 'dev-tools',
		color: '#f3e8ff',
		patterns: [
			/\b(github|gitlab|bitbucket|vercel|heroku|appveyor|circleci|algolia)\b/i,
			/ci\/cd|continuous integration|continuous deployment|pull request/i,
			/source code|repository|developer platform|devops|api documentation/i,
			/hosted search api|search api|headless cms|content management system/i,
			/no-code platform|low-code|website builder|form backend/i,
		],
		slugOverrides: [
			'algolia',
			'agility_cms',
			'appdrag',
			'api_ninjas',
			'abstract',
			'apiflash',
			'better_stack',
			'blazemeter',
		],
	},
	{
		name: 'Analytics',
		slug: 'analytics',
		color: '#e0f7fa',
		patterns: [
			/\banalytics\b|web analytics|product analytics|data insights/i,
			/google analytics|mixpanel|amplitude|segment|heap|posthog/i,
			/\b(ahrefs|semrush|similarweb)\b/i,
			/performance monitoring|usage analytics|conversion tracking|serp/i,
		],
		slugOverrides: ['autom', 'blackboard'],
	},
	{
		name: 'Marketing',
		slug: 'marketing',
		color: '#fff3e0',
		patterns: [
			/marketing (automation|campaign|platform)|digital marketing/i,
			/lead generation|advertising|ad campaign|retargeting|seo tool/i,
			/search engine optim|affiliate marketing|email marketing/i,
			/changelog|product announcement|in-app notification|announce news/i,
		],
		slugOverrides: ['beamer', 'bidsketch', 'better_proposals'],
	},
	{
		name: 'Ecommerce',
		slug: 'ecommerce',
		color: '#fce4ec',
		patterns: [
			/\be-?commerce\b|online store|online shop|marketplace/i,
			/\b(shopify|woocommerce|magento|bigcommerce)\b/i,
			/shopping cart|product catalog|order fulfillment|inventory/i,
			/retail api|product data api|recommendation/i,
		],
		slugOverrides: ['bestbuy'],
	},
	{
		name: 'Payments',
		slug: 'payments',
		color: '#e8eaf6',
		patterns: [
			/payment (process|gateway|platform)|billing platform|subscription/i,
			/\b(stripe|paypal|square|chargebee|paddle)\b/i,
			/\binvoic|recurring billing|merchant|payout|checkout/i,
		],
	},
	{
		name: 'HR & Recruiting',
		slug: 'hr-recruiting',
		color: '#f1f8e9',
		patterns: [
			/human resources|recruiting|talent acquisition|hiring/i,
			/applicant tracking|\bats\b|payroll|onboarding|video interview/i,
			/\b(greenhouse|lever|workday|bamboohr|gusto|rippling)\b/i,
		],
		slugOverrides: ['async_interview'],
	},
	{
		name: 'Finance & Accounting',
		slug: 'finance-accounting',
		color: '#efebe9',
		patterns: [
			/accounting|bookkeeping|expense track|financial (data|report|news)/i,
			/\b(quickbooks|xero|freshbooks|wave)\b/i,
			/stock (market|time series)|market data|trading|investment/i,
			/tax |ledger|accounts payable|accounts receivable|goal-tracking/i,
		],
		slugOverrides: ['alpha_vantage', 'benzinga', 'beeminder'],
	},
	{
		name: 'Customer Support',
		slug: 'customer-support',
		color: '#e0f2f1',
		patterns: [
			/help desk|helpdesk|customer support|support ticket|ticketing/i,
			/\b(zendesk|intercom|freshdesk|gorgias|front app)\b/i,
			/live chat|knowledge base|customer service/i,
		],
	},
	{
		name: 'Cloud & Infrastructure',
		slug: 'cloud-infrastructure',
		color: '#eceff1',
		patterns: [
			/cloud (infrastructure|hosting|compute|platform)/i,
			/\b(aws|azure|gcp|google cloud)\b/i,
			/kubernetes|docker|serverless|hosting platform/i,
			/content delivery network|\bcdn\b|backend-as-a-service|\bbaas\b/i,
		],
		slugOverrides: ['backendless', 'bunnycdn'],
	},
	{
		name: 'AI & ML',
		slug: 'ai-ml',
		color: '#ede7f6',
		patterns: [
			/artificial intelligence|machine learning|generative ai|ai model/i,
			/large language model|\bllm\b|natural language process|computer vision/i,
			/\b(openai|anthropic|cohere|replicate|huggingface)\b/i,
			/ai-powered|ai-driven|text generation|image generat|speech-to-text|alt text/i,
		],
		slugOverrides: ['ai_ml_api', 'alttext_ai'],
	},
	{
		name: 'Security',
		slug: 'security',
		color: '#ffebee',
		patterns: [
			/cybersecurity|password manager|identity (management|access)/i,
			/single sign-on|\bsso\b|authentication|access control|encryption/i,
			/\b(auth0|okta|1password|bitwarden|lastpass)\b/i,
			/vulnerability|compliance|dns filter|ip reputation|abuse|checklist|audit/i,
		],
		slugOverrides: ['1password', 'bitwarden', '21risk', 'control_d'],
	},
	{
		name: 'Social Media',
		slug: 'social-media',
		color: '#e1f5fe',
		patterns: [
			/social media|social network|social scheduling/i,
			/\b(instagram|linkedin|tiktok|youtube|twitter|facebook)\b/i,
			/content (creation|scheduling) for social/i,
		],
	},
	{
		name: 'Productivity',
		slug: 'productivity',
		color: '#f9fbe7',
		patterns: [
			/productivity|collaboration platform|workspace/i,
			/\b(notion|airtable|coda|google workspace|microsoft 365)\b/i,
			/document management|note-taking|calendar|scheduling|time tracking/i,
			/spreadsheet|no-code database|database tool|proposal/i,
		],
		slugOverrides: ['airtable', 'baserow', 'acculynx'],
	},
	{
		name: 'Web3',
		slug: 'web3',
		color: '#fff8e1',
		patterns: [
			/blockchain|cryptocurrency|crypto wallet|web3|\bnft\b|defi/i,
			/ethereum|bitcoin|smart contract|token swap|on-chain/i,
			/\b(alchemy|infura|moralis|opensea)\b/i,
		],
	},
	{
		name: 'Design & Creative',
		slug: 'design-creative',
		color: '#f8bbd0',
		patterns: [
			/graphic design|creative automation|design platform/i,
			/\b(figma|canva|sketch|adobe|invision)\b/i,
			/ui\/ux|prototype|banner|video edit|creative asset/i,
			/generate (images|videos|pdfs|gifs)|subtitle|caption|transcription/i,
		],
		slugOverrides: ['amara', 'castingwords'],
	},
	{
		name: 'Web Scraping & Data',
		slug: 'web-scraping-data',
		color: '#c8e6c9',
		patterns: [
			/web scrap|data extract|web crawl|screen scrap|web unlocker/i,
			/data harvest|scrape website|automation platform.*extract/i,
			/geolocation|geocoding|reverse geocod|data validation|address (autocomplete|verification)/i,
			/sports data|environmental data|weather (data|station|api)|carbon dioxide|renewable energy/i,
		],
		slugOverrides: [
			'agenty',
			'apify',
			'bright_data',
			'browseai',
			'addresszen',
			'bigdatacloud',
			'ambient_weather',
			'ambee',
			'cdr_platform',
			'corrently',
		],
	},
];

const FALLBACK_RULES: { slug: string; patterns: RegExp[] }[] = [
	{
		slug: 'dev-tools',
		patterns: [/developer|developers|api|integrat/i],
	},
	{
		slug: 'productivity',
		patterns: [/business|platform|workflow|streamline|manage|team/i],
	},
	{
		slug: 'web-scraping-data',
		patterns: [/data|information|content|collect|extract/i],
	},
	{
		slug: 'marketing',
		patterns: [/customer|sales|engagement|campaign/i],
	},
	{
		slug: 'analytics',
		patterns: [/track|monitor|report|insight|metric/i],
	},
];

export type IntegrationForTagging = {
	slug: string;
	name: string;
	description: string;
};

function scoreTag(
	integration: IntegrationForTagging,
	tag: IntegrationTagDefinition,
): number {
	const haystack = `${integration.name} ${integration.description}`;
	let score = 0;

	for (const pattern of tag.patterns) {
		if (pattern.test(haystack)) score += 1;
	}

	if (tag.slugOverrides?.includes(integration.slug)) {
		score += 10;
	}

	return score;
}

/** Assign 2–3 tag slugs per integration based on keyword scoring. */
export function assignIntegrationTagSlugs(
	integration: IntegrationForTagging,
): string[] {
	const scored = INTEGRATION_TAG_DEFINITIONS.map((tag) => ({
		slug: tag.slug,
		score: scoreTag(integration, tag),
	}))
		.filter((entry) => entry.score > 0)
		.sort((a, b) => b.score - a.score);

	const assigned = scored.slice(0, 3).map((entry) => entry.slug);

	if (assigned.length >= 2) {
		return assigned;
	}

	const haystack = `${integration.name} ${integration.description}`;

	for (const rule of FALLBACK_RULES) {
		if (assigned.length >= 3) break;
		if (assigned.includes(rule.slug)) continue;
		if (rule.patterns.some((pattern) => pattern.test(haystack))) {
			assigned.push(rule.slug);
		}
	}

	const defaultTags = ['productivity', 'dev-tools'];
	for (const slug of defaultTags) {
		if (assigned.length >= 2) break;
		if (!assigned.includes(slug)) assigned.push(slug);
	}

	return assigned.slice(0, 3);
}

export function getIntegrationTagDefinition(slug: string) {
	return INTEGRATION_TAG_DEFINITIONS.find((tag) => tag.slug === slug);
}
