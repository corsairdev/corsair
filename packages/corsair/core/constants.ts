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
	'ably',
	'abstract',
	'abuseipdb',
	'abyssale',
	'accrediblecertificates',
	'activecampaign',
	'activetrail',
	'addresszen',
	'aeroleads',
	'affinda',
	'agencyzoom',
	'agentmail',
	'agentql',
	'agenty',
	'agilitycms',
	'ahrefs',
	'aimlapi',
	'airtable',
	'aivoov',
	'alchemy',
	'algolia',
	'allimagesai',
	'alphavantage',
	'altoviz',
	'alttextai',
	'amara',
	'ambee',
	'ambientweather',
	'amcards',
	'amplitude',
	'anchorbrowser',
	'anonyflow',
	'anthropicadministrator',
	'apaleo',
	'api2pdf',
	'apibible',
	'apify',
	'apilabz',
	'apininjas',
	'apipie',
	'apisports',
	'asana',
	'asindataapi',
	'asticaai',
	'asyncinterview',
	'attio',
	'autom',
	'ayrshare',
	'bart',
	'basecamp',
	'baselinker',
	'basin',
	'betterstack',
	'bigmailer',
	'bigml',
	'bitbucket',
	'bitwarden',
	'blazemeter',
	'bluesky',
	'boloforms',
	'botpress',
	'bouncer',
	'box',
	'breeze',
	'bugsnag',
	'cal',
	'calendly',
	'canva',
	'canvas',
	'chatbotkit',
	'circleci',
	'clientary',
	'clockify',
	'cloudflare',
	'cloudinary',
	'collegefootballdata',
	'confluence',
	'contentfulgraphql',
	'crowterminal',
	'cursor',
	'customgpt',
	'databricks',
	'datadog',
	'deepseek',
	'devinmcp',
	'diffbot',
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
	'formbricks',
	'gemini',
	'github',
	'gitlab',
	'gmail',
	'googleaddressvalidation',
	'googlebigquery',
	'googlecalendar',
	'googlecloudvision',
	'googledocs',
	'googledrive',
	'googlemaps',
	'googlemeet',
	'googlesheets',
	'grafana',
	'groqcloud',
	'habitica',
	'hackernews',
	'harvest',
	'hashnode',
	'heygen',
	'hubspot',
	'huggingface',
	'imgbb',
	'insightoai',
	'instagram',
	'intercom',
	'jira',
	'kaggle',
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
	'openrouter',
	'openweathermap',
	'oura',
	'outlook',
	'pagerduty',
	'pdfmonkey',
	'perplexityai',
	'posthog',
	'razorpay',
	'reddit',
	'resend',
	'retailed',
	'salesforce',
	'securitytrails',
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
	'tavilymcp',
	'teams',
	'telegram',
	'todoist',
	'toggl',
	'trello',
	'twentyonerisk',
	'twilio',
	'twitter',
	'twitterapiio',
	'twochat',
	'typeform',
	'unione',
	'uniswapapi',
	'vapi',
	'vercel',
	'webflow',
	'whatsapp',
	'witai',
	'wiza',
	'workday',
	'xquik',
	'youcom',
	'youtube',
	'zendesk',
	'zohomail',
	'zoom',
	'zoominfo',
] as const;

export const ProviderDisplayNames = {
	ably: 'Ably',
	abstract: 'Abstract',
	abuseipdb: 'AbuseIPDB',
	abyssale: 'Abyssale',
	accrediblecertificates: 'Accredible Certificates',
	activecampaign: 'ActiveCampaign',
	activetrail: 'Active Trail',
	addresszen: 'Addresszen',
	aeroleads: 'Aeroleads',
	affinda: 'Affinda',
	agencyzoom: 'AgencyZoom',
	agentmail: 'AgentMail',
	agentql: 'AgentQL',
	agenty: 'Agenty',
	agilitycms: 'Agility CMS',
	ahrefs: 'Ahrefs',
	aimlapi: 'AI/ML API',
	airtable: 'Airtable',
	aivoov: 'AiVOOV',
	alchemy: 'Alchemy',
	algolia: 'Algolia',
	allimagesai: 'All Images AI',
	alphavantage: 'Alpha Vantage',
	altoviz: 'Altoviz',
	alttextai: 'AltText.ai',
	amara: 'Amara',
	ambee: 'Ambee',
	ambientweather: 'Ambient Weather',
	amcards: 'AMcards',
	amplitude: 'Amplitude',
	anchorbrowser: 'Anchor Browser',
	anonyflow: 'Anonyflow',
	anthropicadministrator: 'Anthropic Administrator',
	apaleo: 'Apaleo',
	api2pdf: 'API2PDF',
	apibible: 'API.Bible',
	apify: 'Apify',
	apilabz: 'API Labz',
	apininjas: 'API Ninjas',
	apipie: 'APIpie AI',
	apisports: 'API-Sports',
	asana: 'Asana',
	asindataapi: 'ASIN Data API',
	asticaai: 'Astica AI',
	asyncinterview: 'Async Interview',
	attio: 'Attio',
	autom: 'Autom',
	ayrshare: 'Ayrshare',
	bart: 'BART',
	basecamp: 'Basecamp',
	baselinker: 'BaseLinker',
	basin: 'Basin',
	betterstack: 'Better Stack',
	bigmailer: 'BigMailer',
	bigml: 'BigML',
	bitbucket: 'Bitbucket',
	bitwarden: 'Bitwarden',
	blazemeter: 'BlazeMeter',
	bluesky: 'Bluesky',
	boloforms: 'Boloforms',
	botpress: 'Botpress',
	bouncer: 'Bouncer',
	box: 'Box',
	breeze: 'Breeze',
	bugsnag: 'BugSnag',
	cal: 'Cal',
	calendly: 'Calendly',
	canva: 'Canva',
	canvas: 'Canvas LMS',
	chatbotkit: 'ChatBotKit',
	circleci: 'CircleCI',
	clientary: 'Clientary',
	clockify: 'Clockify',
	cloudflare: 'Cloudflare',
	cloudinary: 'Cloudinary',
	collegefootballdata: 'College Football Data',
	confluence: 'Confluence',
	contentfulgraphql: 'Contentful GraphQL',
	crowterminal: 'CrowTerminal',
	cursor: 'Cursor',
	customgpt: 'CustomGPT',
	databricks: 'Databricks',
	datadog: 'Datadog',
	deepseek: 'DeepSeek',
	devinmcp: 'Devin MCP',
	diffbot: 'Diffbot',
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
	formbricks: 'Formbricks',
	gemini: 'Gemini',
	github: 'GitHub',
	gitlab: 'GitLab',
	gmail: 'Gmail',
	googleaddressvalidation: 'Google Address Validation',
	googlebigquery: 'Google BigQuery',
	googlecalendar: 'Google Calendar',
	googlecloudvision: 'Google Cloud Vision',
	googledocs: 'Google Docs',
	googledrive: 'Google Drive',
	googlemaps: 'Google Maps',
	googlemeet: 'Google Meet',
	googlesheets: 'Google Sheets',
	grafana: 'Grafana',
	groqcloud: 'GroqCloud',
	habitica: 'Habitica',
	hackernews: 'Hacker News',
	harvest: 'Harvest',
	hashnode: 'Hashnode',
	heygen: 'HeyGen',
	hubspot: 'HubSpot',
	huggingface: 'Hugging Face',
	imgbb: 'ImgBB',
	insightoai: 'Insighto.ai',
	instagram: 'Instagram',
	intercom: 'Intercom',
	jira: 'Jira',
	kaggle: 'Kaggle',
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
	openrouter: 'OpenRouter',
	openweathermap: 'OpenWeatherMap',
	oura: 'Oura',
	outlook: 'Outlook',
	pagerduty: 'PagerDuty',
	pdfmonkey: 'PDFMonkey',
	perplexityai: 'Perplexity AI',
	posthog: 'PostHog',
	razorpay: 'Razorpay',
	reddit: 'Reddit',
	resend: 'Resend',
	retailed: 'Retailed',
	salesforce: 'Salesforce',
	securitytrails: 'SecurityTrails',
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
	tavilymcp: 'Tavily MCP',
	teams: 'Teams',
	telegram: 'Telegram',
	todoist: 'Todoist',
	toggl: 'Toggl',
	trello: 'Trello',
	twentyonerisk: 'TwentyOneRisk',
	twilio: 'Twilio',
	twitter: 'Twitter',
	twitterapiio: 'Twitter API IO',
	twochat: 'TwoChat',
	typeform: 'Typeform',
	unione: 'Unione',
	uniswapapi: 'Uniswap',
	vapi: 'Vapi',
	vercel: 'Vercel',
	webflow: 'Webflow',
	whatsapp: 'WhatsApp',
	witai: 'WitAi',
	wiza: 'Wiza',
	workday: 'Workday',
	xquik: 'XQuik',
	youcom: 'You.com',
	youtube: 'YouTube',
	zendesk: 'Zendesk',
	zohomail: 'Zoho Mail',
	zoom: 'Zoom',
	zoominfo: 'ZoomInfo',
} as const satisfies Record<(typeof BaseProviders)[number], string>;

export function formatProviderDisplayName(plugin: string): string {
	const knownName =
		ProviderDisplayNames[plugin as keyof typeof ProviderDisplayNames];
	if (knownName) return knownName;
	return plugin.charAt(0).toUpperCase() + plugin.slice(1);
}

export type AllProviders =
	| 'ably'
	| 'abstract'
	| 'abuseipdb'
	| 'abyssale'
	| 'accrediblecertificates'
	| 'activecampaign'
	| 'activetrail'
	| 'addresszen'
	| 'aeroleads'
	| 'affinda'
	| 'agencyzoom'
	| 'agentmail'
	| 'agentql'
	| 'agenty'
	| 'agilitycms'
	| 'ahrefs'
	| 'aimlapi'
	| 'airtable'
	| 'aivoov'
	| 'alchemy'
	| 'algolia'
	| 'allimagesai'
	| 'alphavantage'
	| 'altoviz'
	| 'alttextai'
	| 'amara'
	| 'ambee'
	| 'ambientweather'
	| 'amcards'
	| 'amplitude'
	| 'anchorbrowser'
	| 'anonyflow'
	| 'anthropicadministrator'
	| 'apaleo'
	| 'api2pdf'
	| 'apibible'
	| 'apify'
	| 'apilabz'
	| 'apininjas'
	| 'apipie'
	| 'apisports'
	| 'asana'
	| 'asindataapi'
	| 'asticaai'
	| 'asyncinterview'
	| 'attio'
	| 'autom'
	| 'ayrshare'
	| 'bart'
	| 'basecamp'
	| 'baselinker'
	| 'basin'
	| 'betterstack'
	| 'bigmailer'
	| 'bigml'
	| 'bitbucket'
	| 'bitwarden'
	| 'blazemeter'
	| 'bluesky'
	| 'boloforms'
	| 'botpress'
	| 'bouncer'
	| 'box'
	| 'breeze'
	| 'bugsnag'
	| 'cal'
	| 'calendly'
	| 'canva'
	| 'canvas'
	| 'chatbotkit'
	| 'circleci'
	| 'clientary'
	| 'clockify'
	| 'cloudflare'
	| 'cloudinary'
	| 'collegefootballdata'
	| 'confluence'
	| 'contentfulgraphql'
	| 'crowterminal'
	| 'cursor'
	| 'customgpt'
	| 'databricks'
	| 'datadog'
	| 'deepseek'
	| 'devinmcp'
	| 'diffbot'
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
	| 'formbricks'
	| 'gemini'
	| 'github'
	| 'gitlab'
	| 'gmail'
	| 'googleaddressvalidation'
	| 'googlebigquery'
	| 'googlecalendar'
	| 'googlecloudvision'
	| 'googledocs'
	| 'googledrive'
	| 'googlemaps'
	| 'googlemeet'
	| 'googlesheets'
	| 'grafana'
	| 'groqcloud'
	| 'habitica'
	| 'hackernews'
	| 'harvest'
	| 'hashnode'
	| 'heygen'
	| 'hubspot'
	| 'huggingface'
	| 'imgbb'
	| 'insightoai'
	| 'instagram'
	| 'intercom'
	| 'jira'
	| 'kaggle'
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
	| 'openrouter'
	| 'openweathermap'
	| 'oura'
	| 'outlook'
	| 'pagerduty'
	| 'pdfmonkey'
	| 'perplexityai'
	| 'posthog'
	| 'razorpay'
	| 'reddit'
	| 'resend'
	| 'retailed'
	| 'salesforce'
	| 'securitytrails'
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
	| 'tavilymcp'
	| 'teams'
	| 'telegram'
	| 'todoist'
	| 'toggl'
	| 'trello'
	| 'twentyonerisk'
	| 'twilio'
	| 'twitter'
	| 'twitterapiio'
	| 'twochat'
	| 'typeform'
	| 'unione'
	| 'uniswapapi'
	| 'vapi'
	| 'vercel'
	| 'webflow'
	| 'whatsapp'
	| 'witai'
	| 'wiza'
	| 'workday'
	| 'xquik'
	| 'youcom'
	| 'youtube'
	| 'zendesk'
	| 'zohomail'
	| 'zoom'
	| 'zoominfo'
	| (string & {});

export type AuthTypes = 'oauth_2' | 'api_key' | 'bot_token' | 'managed';

export type PickAuth<T extends AuthTypes> = T;
