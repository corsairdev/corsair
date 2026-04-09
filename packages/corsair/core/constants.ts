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
	'box',
	'cal',
	'calendly',
	'cursor',
	'discord',
	'dropbox',
	'exa',
	'figma',
	'fireflies',
	'github',
	'gmail',
	'googlecalendar',
	'googledrive',
	'googlesheets',
	'hackernews',
	'hubspot',
	'intercom',
	'jira',
	'linear',
	'monday',
	'notion',
	'onedrive',
	'oura',
	'outlook',
	'pagerduty',
	'posthog',
	'razorpay',
	'resend',
	'sentry',
	'sharepoint',
	'slack',
	'spotify',
	'strava',
	'stripe',
	'tavily',
	'teams',
	'telegram',
	'todoist',
	'trello',
	'twitter',
	'twitterapiio',
	'youtube',
	'typeform',
	'zoom',
] as const;

export type AllProviders =
	| 'airtable'
	| 'amplitude'
	| 'asana'
	| 'box'
	| 'cal'
	| 'calendly'
	| 'cursor'
	| 'discord'
	| 'dropbox'
	| 'exa'
	| 'figma'
	| 'fireflies'
	| 'github'
	| 'gmail'
	| 'googlecalendar'
	| 'googledrive'
	| 'googlesheets'
	| 'hackernews'
	| 'hubspot'
	| 'intercom'
	| 'jira'
	| 'linear'
	| 'monday'
	| 'notion'
	| 'onedrive'
	| 'oura'
	| 'outlook'
	| 'pagerduty'
	| 'posthog'
	| 'razorpay'
	| 'resend'
	| 'sentry'
	| 'sharepoint'
	| 'slack'
	| 'spotify'
	| 'strava'
	| 'stripe'
	| 'tavily'
	| 'teams'
	| 'telegram'
	| 'todoist'
	| 'trello'
	| 'twitter'
	| 'twitterapiio'
	| 'youtube'
	| 'typeform'
	| 'zoom'
	| (string & {});

export type AuthTypes = 'oauth_2' | 'api_key' | 'bot_token';

export type PickAuth<T extends AuthTypes> = T;
