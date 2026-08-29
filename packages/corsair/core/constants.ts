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
	'abstract',
	'activecampaign',
	'activetrail',
	'addresszen',
	'affinda',
	'agencyzoom',
	'agentmail',
	'agentql',
	'agenty',
	'ahrefs',
	'aimlapi',
	'airtable',
	'alchemy',
	'algolia',
	'alphavantage',
	'altoviz',
	'alttextai',
	'amara',
	'ambee',
	'ambientweather',
	'amcards',
	'amplitude',
	'apaleo',
	'apibible',
	'apify',
	'apilabz',
	'apininjas',
	'apisports',
	'asana',
	'asindataapi',
	'asyncinterview',
	'ayrshare',
	'baselinker',
	'betterstack',
	'bigmailer',
	'bigml',
	'bitbucket',
	'bitwarden',
	'blazemeter',
	'bluesky',
	'boloforms',
	'botpress',
	'box',
	'bugsnag',
	'cal',
	'calendly',
	'canvas',
	'canva',
	'circleci',
	'clientary',
	'cloudflare',
	'cloudinary',
	'collegefootballdata',
	'confluence',
	'cursor',
	'databricks',
	'datadog',
	'deepseek',
	'digitalocean',
	'discord',
	'dockerhub',
	'dodopayments',
	'doppler',
	'dropbox',
	'epicgames',
	'exa',
	'facebook',
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
	'googlemaps',
	'googlemeet',
	'googlesheets',
	'grafana',
	'habitica',
	'hackernews',
	'harvest',
	'hashnode',
	'heygen',
	'hubspot',
	'huggingface',
	'insightoai',
	'instagram',
	'intercom',
	'jira',
	'linear',
	'linkedin',
	'loyverse',
	'mailchimp',
	'mailtrap',
	'monday',
	'neon',
	'nextdns',
	'notion',
	'ocrspace',
	'ollama',
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
	'salesforce',
	'sentry',
	'serpapi',
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
	'toggl',
	'trello',
	'twilio',
	'twitter',
	'twitterapiio',
	'twochat',
	'typeform',
	'vapi',
	'vercel',
	'webflow',
	'whatsapp',
	'wiza',
	'workday',
	'xquik',
	'youcom',
	'youtube',
	'zendesk',
	'zohomail',
	'zoom',
] as const;

export const ProviderDisplayNames = {
	abstract: 'Abstract',
	activecampaign: 'ActiveCampaign',
	activetrail: 'Active Trail',
	addresszen: 'Addresszen',
	affinda: 'Affinda',
	agencyzoom: 'AgencyZoom',
	agentmail: 'AgentMail',
	agentql: 'AgentQL',
	agenty: 'Agenty',
	ahrefs: 'Ahrefs',
	aimlapi: 'AI/ML API',
	airtable: 'Airtable',
	alchemy: 'Alchemy',
	algolia: 'Algolia',
	alphavantage: 'Alpha Vantage',
	altoviz: 'Altoviz',
	alttextai: 'AltText.ai',
	amara: 'Amara',
	ambee: 'Ambee',
	ambientweather: 'Ambient Weather',
	amcards: 'AMcards',
	amplitude: 'Amplitude',
	apaleo: 'Apaleo',
	apibible: 'API.Bible',
	apify: 'Apify',
	apilabz: 'API Labz',
	apininjas: 'API Ninjas',
	apisports: 'API-Sports',
	asana: 'Asana',
	asindataapi: 'ASIN Data API',
	asyncinterview: 'Async Interview',
	ayrshare: 'Ayrshare',
	baselinker: 'BaseLinker',
	betterstack: 'Better Stack',
	bigmailer: 'BigMailer',
	bigml: 'BigML',
	bitbucket: 'Bitbucket',
	bitwarden: 'Bitwarden',
	blazemeter: 'BlazeMeter',
	bluesky: 'Bluesky',
	boloforms: 'Boloforms',
	botpress: 'Botpress',
	box: 'Box',
	bugsnag: 'BugSnag',
	cal: 'Cal',
	calendly: 'Calendly',
	canvas: 'Canvas LMS',
	canva: 'Canva',
	circleci: 'CircleCI',
	clientary: 'Clientary',
	cloudflare: 'Cloudflare',
	cloudinary: 'Cloudinary',
	collegefootballdata: 'College Football Data',
	confluence: 'Confluence',
	cursor: 'Cursor',
	databricks: 'Databricks',
	datadog: 'Datadog',
	deepseek: 'DeepSeek',
	digitalocean: 'DigitalOcean',
	discord: 'Discord',
	dockerhub: 'Docker Hub',
	dodopayments: 'Dodo Payments',
	doppler: 'Doppler',
	dropbox: 'Dropbox',
	epicgames: 'Epic Games',
	exa: 'Exa',
	facebook: 'Facebook',
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
	googlemaps: 'Google Maps',
	googlemeet: 'Google Meet',
	googlesheets: 'Google Sheets',
	grafana: 'Grafana',
	habitica: 'Habitica',
	hackernews: 'Hacker News',
	harvest: 'Harvest',
	hashnode: 'Hashnode',
	heygen: 'HeyGen',
	hubspot: 'HubSpot',
	huggingface: 'Hugging Face',
	insightoai: 'Insighto.ai',
	instagram: 'Instagram',
	intercom: 'Intercom',
	jira: 'Jira',
	linear: 'Linear',
	linkedin: 'LinkedIn',
	loyverse: 'Loyverse',
	mailchimp: 'Mailchimp',
	mailtrap: 'Mailtrap',
	monday: 'Monday',
	neon: 'Neon',
	nextdns: 'NextDNS',
	notion: 'Notion',
	ocrspace: 'OCR.space',
	ollama: 'Ollama',
	onedrive: 'OneDrive',
	onepassword: '1Password',
	openai: 'OpenAI',
	openweathermap: 'OpenWeatherMap',
	oura: 'Oura',
	outlook: 'Outlook',
	pagerduty: 'PagerDuty',
	perplexityai: 'Perplexity AI',
	posthog: 'PostHog',
	razorpay: 'Razorpay',
	reddit: 'Reddit',
	resend: 'Resend',
	retailed: 'Retailed',
	salesforce: 'Salesforce',
	sentry: 'Sentry',
	serpapi: 'Serpapi',
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
	toggl: 'Toggl',
	trello: 'Trello',
	twilio: 'Twilio',
	twitter: 'Twitter',
	twitterapiio: 'Twitter API IO',
	twochat: 'TwoChat',
	typeform: 'Typeform',
	vapi: 'Vapi',
	vercel: 'Vercel',
	webflow: 'Webflow',
	whatsapp: 'WhatsApp',
	wiza: 'Wiza',
	workday: 'Workday',
	xquik: 'XQuik',
	youcom: 'You.com',
	youtube: 'YouTube',
	zendesk: 'Zendesk',
	zohomail: 'Zoho Mail',
	zoom: 'Zoom',
} as const;

export function formatProviderDisplayName(plugin: string): string {
	const knownName =
		ProviderDisplayNames[plugin as keyof typeof ProviderDisplayNames];
	if (knownName) return knownName;
	return plugin.charAt(0).toUpperCase() + plugin.slice(1);
}

export type AllProviders =
	| 'abstract'
	| 'activecampaign'
	| 'activetrail'
	| 'addresszen'
	| 'affinda'
	| 'agencyzoom'
	| 'agentmail'
	| 'agentql'
	| 'agenty'
	| 'ahrefs'
	| 'aimlapi'
	| 'airtable'
	| 'alchemy'
	| 'algolia'
	| 'alphavantage'
	| 'altoviz'
	| 'alttextai'
	| 'amara'
	| 'ambee'
	| 'ambientweather'
	| 'amcards'
	| 'amplitude'
	| 'apaleo'
	| 'apibible'
	| 'apify'
	| 'apilabz'
	| 'apininjas'
	| 'apisports'
	| 'asana'
	| 'asindataapi'
	| 'asyncinterview'
	| 'ayrshare'
	| 'baselinker'
	| 'betterstack'
	| 'bigmailer'
	| 'bigml'
	| 'bitbucket'
	| 'bitwarden'
	| 'blazemeter'
	| 'bluesky'
	| 'boloforms'
	| 'botpress'
	| 'box'
	| 'bugsnag'
	| 'cal'
	| 'calendly'
	| 'canva'
	| 'canvas'
	| 'circleci'
	| 'clientary'
	| 'cloudflare'
	| 'cloudinary'
	| 'collegefootballdata'
	| 'confluence'
	| 'cursor'
	| 'databricks'
	| 'datadog'
	| 'deepseek'
	| 'digitalocean'
	| 'discord'
	| 'dockerhub'
	| 'dodopayments'
	| 'doppler'
	| 'dropbox'
	| 'epicgames'
	| 'exa'
	| 'facebook'
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
	| 'googlemaps'
	| 'googlemeet'
	| 'googlesheets'
	| 'grafana'
	| 'habitica'
	| 'hackernews'
	| 'harvest'
	| 'hashnode'
	| 'heygen'
	| 'hubspot'
	| 'huggingface'
	| 'insightoai'
	| 'instagram'
	| 'intercom'
	| 'jira'
	| 'linear'
	| 'linkedin'
	| 'loyverse'
	| 'mailchimp'
	| 'mailtrap'
	| 'monday'
	| 'neon'
	| 'nextdns'
	| 'notion'
	| 'ocrspace'
	| 'ollama'
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
	| 'salesforce'
	| 'sentry'
	| 'serpapi'
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
	| 'toggl'
	| 'trello'
	| 'twilio'
	| 'twitter'
	| 'twitterapiio'
	| 'twochat'
	| 'typeform'
	| 'vapi'
	| 'vercel'
	| 'webflow'
	| 'whatsapp'
	| 'wiza'
	| 'workday'
	| 'xquik'
	| 'youcom'
	| 'youtube'
	| 'zendesk'
	| 'zohomail'
	| 'zoom'
	| (string & {});

export type AuthTypes = 'oauth_2' | 'api_key' | 'bot_token' | 'managed';

export type PickAuth<T extends AuthTypes> = T;
