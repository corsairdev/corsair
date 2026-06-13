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
] as const;

export type AllProviders =
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
	| (string & {});

export type AuthTypes = 'oauth_2' | 'api_key' | 'bot_token';

export type PickAuth<T extends AuthTypes> = T;
