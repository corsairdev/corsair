export type AllErrors =
	| 'RATE_LIMIT_ERROR'
	| 'AUTH_ERROR'
	| 'PERMISSION_ERROR'
	| 'NETWORK_ERROR'
	| 'TIMEOUT_ERROR'
	| 'SERVER_ERROR'
	| 'VALIDATION_ERROR'
	| 'NOT_FOUND_ERROR'
	| 'BAD_REQUEST_ERROR'
	| 'PARSING_ERROR'
	| 'DEFAULT'
	| (string & {});

export const BaseProviders = [
	'agentql',
	'algolia',
	'ahrefs',
	'airtable',
	'amplitude',
	'asana',
	'bitwarden',
	'bluesky',
	'box',
	'cal',
	'calendly',
	'cloudflare',
	'confluence',
	'cursor',
	'datadog',
	'deepseek',
	'digitalocean',
	'discord',
	'dodopayments',
	'dropbox',
	'exa',
	'figma',
	'firecrawl',
	'fireflies',
	'gemini',
	'github',
	'gitlab',
	'gmail',
	'googlebigquery',
	'googlecalendar',
	'googledocs',
	'googledrive',
	'googlemeet',
	'googlesheets',
	'grafana',
	'hackernews',
	'heygen',
	'hubspot',
	'insightoai',
	'instagram',
	'intercom',
	'jira',
	'linear',
	'linkedin',
	'mailchimp',
	'monday',
	'neon',
	'notion',
	'onedrive',
	'onepassword',
	'openai',
	'openweathermap',
	'oura',
	'outlook',
	'pagerduty',
	'perplexityai',
	'posthog',
	'razorpay',
	'reddit',
	'resend',
	'retailed',
	'sentry',
	'sharepoint',
	'slack',
	'spotify',
	'strava',
	'stripe',
	'supabase',
	'tally',
	'tavily',
	'teams',
	'telegram',
	'todoist',
	'trello',
	'twilio',
	'twitter',
	'twitterapiio',
	'typeform',
	'vapi',
	'whatsapp',
	'vercel',
	'xquik',
	'youtube',
	'zendesk',
	'zohomail',
	'zoom',
] as const;

export const ProviderDisplayNames = {
	agentql: 'AgentQL',
	algolia: 'Algolia',
	ahrefs: 'Ahrefs',
	airtable: 'Airtable',
	amplitude: 'Amplitude',
	asana: 'Asana',
	bitwarden: 'Bitwarden',
	bluesky: 'Bluesky',
	box: 'Box',
	cal: 'Cal',
	calendly: 'Calendly',
	cloudflare: 'Cloudflare',
	confluence: 'Confluence',
	cursor: 'Cursor',
	datadog: 'Datadog',
	deepseek: 'DeepSeek',
	digitalocean: 'DigitalOcean',
	discord: 'Discord',
	dodopayments: 'Dodo Payments',
	dropbox: 'Dropbox',
	exa: 'Exa',
	figma: 'Figma',
	firecrawl: 'Firecrawl',
	fireflies: 'Fireflies',
	gemini: 'Gemini',
	github: 'GitHub',
	gitlab: 'GitLab',
	gmail: 'Gmail',
	googlebigquery: 'Google BigQuery',
	googlecalendar: 'Google Calendar',
	googledocs: 'Google Docs',
	googledrive: 'Google Drive',
	googlemeet: 'Google Meet',
	googlesheets: 'Google Sheets',
	grafana: 'Grafana',
	hackernews: 'Hacker News',
	heygen: 'HeyGen',
	hubspot: 'HubSpot',
	insightoai: 'Insighto.ai',
	instagram: 'Instagram',
	intercom: 'Intercom',
	jira: 'Jira',
	linear: 'Linear',
	linkedin: 'LinkedIn',
	mailchimp: 'Mailchimp',
	monday: 'Monday',
	neon: 'Neon',
	notion: 'Notion',
	onedrive: 'OneDrive',
	onepassword: '1Password',
	openai: 'OpenAI',
	openweathermap: 'OpenWeatherMap',
	oura: 'Oura',
	outlook: 'Outlook',
	pagerduty: 'PagerDuty',
	posthog: 'PostHog',
	razorpay: 'Razorpay',
	reddit: 'Reddit',
	resend: 'Resend',
	retailed: 'Retailed',
	sentry: 'Sentry',
	sharepoint: 'SharePoint',
	slack: 'Slack',
	spotify: 'Spotify',
	strava: 'Strava',
	stripe: 'Stripe',
	supabase: 'Supabase',
	tally: 'Tally',
	tavily: 'Tavily',
	teams: 'Teams',
	telegram: 'Telegram',
	todoist: 'Todoist',
	trello: 'Trello',
	twilio: 'Twilio',
	twitter: 'Twitter',
	twitterapiio: 'Twitter API IO',
	typeform: 'Typeform',
	vapi: 'Vapi',
	whatsapp: 'WhatsApp',
	vercel: 'Vercel',
	xquik: 'XQuik',
	youtube: 'YouTube',
	zendesk: 'Zendesk',
	zohomail: 'Zoho Mail',
	zoom: 'Zoom',
	perplexityai: 'Perplexity AI',
} as const satisfies Record<(typeof BaseProviders)[number], string>;

export function formatProviderDisplayName(plugin: string): string {
	const knownName =
		ProviderDisplayNames[plugin as keyof typeof ProviderDisplayNames];
	if (knownName) return knownName;
	return plugin.charAt(0).toUpperCase() + plugin.slice(1);
}

export type AllProviders =
	| 'agentql'
	| 'algolia'
	| 'ahrefs'
	| 'airtable'
	| 'amplitude'
	| 'asana'
	| 'bitwarden'
	| 'bluesky'
	| 'box'
	| 'cal'
	| 'calendly'
	| 'cloudflare'
	| 'confluence'
	| 'cursor'
	| 'datadog'
	| 'deepseek'
	| 'digitalocean'
	| 'discord'
	| 'dodopayments'
	| 'dropbox'
	| 'exa'
	| 'figma'
	| 'firecrawl'
	| 'fireflies'
	| 'gemini'
	| 'github'
	| 'gitlab'
	| 'gmail'
	| 'googlebigquery'
	| 'googlecalendar'
	| 'googledocs'
	| 'googledrive'
	| 'googlemeet'
	| 'googlesheets'
	| 'grafana'
	| 'hackernews'
	| 'heygen'
	| 'hubspot'
	| 'insightoai'
	| 'instagram'
	| 'intercom'
	| 'jira'
	| 'linear'
	| 'linkedin'
	| 'mailchimp'
	| 'monday'
	| 'neon'
	| 'notion'
	| 'onedrive'
	| 'onepassword'
	| 'openai'
	| 'openweathermap'
	| 'oura'
	| 'outlook'
	| 'pagerduty'
	| 'perplexityai'
	| 'posthog'
	| 'razorpay'
	| 'reddit'
	| 'resend'
	| 'retailed'
	| 'sentry'
	| 'sharepoint'
	| 'slack'
	| 'spotify'
	| 'strava'
	| 'stripe'
	| 'supabase'
	| 'tally'
	| 'tavily'
	| 'teams'
	| 'telegram'
	| 'todoist'
	| 'trello'
	| 'twilio'
	| 'twitter'
	| 'twitterapiio'
	| 'typeform'
	| 'vapi'
	| 'whatsapp'
	| 'vercel'
	| 'xquik'
	| 'youtube'
	| 'zendesk'
	| 'zohomail'
	| 'zoom'
	| (string & {});

export type AuthTypes = 'oauth_2' | 'api_key' | 'bot_token' | 'managed';

export type PickAuth<T extends AuthTypes> = T;
