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
	'cursor',
	'discord',
	'dodopayments',
	'dropbox',
	'exa',
	'figma',
	'firecrawl',
	'fireflies',
	'github',
	'gitlab',
	'gmail',
	'googlecalendar',
	'googledrive',
	'googlemeet',
	'googlesheets',
	'grafana',
	'hackernews',
	'hubspot',
	'intercom',
	'jira',
	'linear',
	'monday',
	'neon',
	'notion',
	'onedrive',
	'openweathermap',
	'oura',
	'outlook',
	'pagerduty',
	'posthog',
	'razorpay',
	'reddit',
	'resend',
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
	'xquik',
	'youtube',
	'zendesk',
	'zohomail',
	'zoom',
	'instagram',
] as const;

export const ProviderDisplayNames = {
	agentql: 'AgentQL',
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
	cursor: 'Cursor',
	discord: 'Discord',
	dodopayments: 'Dodo Payments',
	dropbox: 'Dropbox',
	exa: 'Exa',
	figma: 'Figma',
	firecrawl: 'Firecrawl',
	fireflies: 'Fireflies',
	github: 'GitHub',
	gitlab: 'GitLab',
	gmail: 'Gmail',
	googlecalendar: 'Google Calendar',
	googledrive: 'Google Drive',
	googlesheets: 'Google Sheets',
	googlemeet: 'Google Meet',
	grafana: 'Grafana',
	hackernews: 'Hacker News',
	hubspot: 'HubSpot',
	intercom: 'Intercom',
	jira: 'Jira',
	linear: 'Linear',
	monday: 'Monday',
	neon: 'Neon',
	notion: 'Notion',
	onedrive: 'OneDrive',
	openweathermap: 'OpenWeatherMap',
	oura: 'Oura',
	outlook: 'Outlook',
	pagerduty: 'PagerDuty',
	posthog: 'PostHog',
	razorpay: 'Razorpay',
	reddit: 'Reddit',
	resend: 'Resend',
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
	xquik: 'XQuik',
	youtube: 'YouTube',
	zendesk: 'Zendesk',
	zohomail: 'Zoho Mail',
	zoom: 'Zoom',
	instagram: 'Instagram',
} as const satisfies Record<(typeof BaseProviders)[number], string>;

export function formatProviderDisplayName(plugin: string): string {
	const knownName =
		ProviderDisplayNames[plugin as keyof typeof ProviderDisplayNames];
	if (knownName) return knownName;
	return plugin.charAt(0).toUpperCase() + plugin.slice(1);
}

export type AllProviders =
	| 'agentql'
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
	| 'cursor'
	| 'discord'
	| 'dodopayments'
	| 'dropbox'
	| 'exa'
	| 'figma'
	| 'firecrawl'
	| 'fireflies'
	| 'github'
	| 'gitlab'
	| 'gmail'
	| 'googlecalendar'
	| 'googledrive'
	| 'googlemeet'
	| 'googlesheets'
	| 'grafana'
	| 'hackernews'
	| 'hubspot'
	| 'intercom'
	| 'jira'
	| 'linear'
	| 'monday'
	| 'neon'
	| 'notion'
	| 'onedrive'
	| 'openweathermap'
	| 'oura'
	| 'outlook'
	| 'pagerduty'
	| 'posthog'
	| 'razorpay'
	| 'reddit'
	| 'resend'
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
	| 'xquik'
	| 'youtube'
	| 'zendesk'
	| 'zohomail'
	| 'zoom'
	| 'instagram'
	| (string & {});

export type AuthTypes = 'oauth_2' | 'api_key' | 'bot_token' | 'managed';

export type PickAuth<T extends AuthTypes> = T;
