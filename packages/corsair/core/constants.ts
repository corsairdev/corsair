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
	'appveyor',
	'api2pdf',
	'apibible',
	'apify',
	'apilabz',
	'apininjas',
	'apipie',
	'apisports',
	'asana',
	'ascora',
	'asindataapi',
	'asticaai',
	'asyncinterview',
	'attio',
	'autom',
	'ayrshare',
	'backendless',
	'bannerbear',
	'bart',
	'basecamp',
	'baselinker',
	'basin',
	'beaconstac',
	'beeminder',
	'bettercontact',
	'betterproposals',
	'betterstack',
	'bigdatacloud',
	'bigmailer',
	'bigml',
	'bitbucket',
	'bitwarden',
	'blazemeter',
	'blocknative',
	'bluesky',
	'boloforms',
	'boltiot',
	'bonsai',
	'bookingmood',
	'botpress',
	'botsonic',
	'bouncer',
	'box',
	'boxhero',
	'brandfetch',
	'breathehr',
	'brex',
	'brightdata',
	'browseai',
	'browserless',
	'bubble',
	'bugsnag',
	'buildkite',
	'cal',
	'calendly',
	'canva',
	'canvas',
	'capsulecrm',
	'chatbotkit',
	'chatfai',
	'circleci',
	'clickhouse',
	'clientary',
	'clockify',
	'cloudflare',
	'cloudinary',
	'collegefootballdata',
	'confluence',
	'connecteam',
	'contentfulgraphql',
	'contextsevenmcp',
	'crowterminal',
	'cursor',
	'customgpt',
	'databricks',
	'datadog',
	'datarobot',
	'deepseek',
	'devinmcp',
	'diffbot',
	'digitalocean',
	'discord',
	'dockerhub',
	'dodopayments',
	'doppler',
	'dreamstudio',
	'dripcel',
	'dropbox',
	'dropboxsign',
	'dynapictures',
	'epicgames',
	'exa',
	'facebook',
	'faraday',
	'figma',
	'filloutforms',
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
	'here',
	'heygen',
	'htmltoimage',
	'hubspot',
	'huggingface',
	'imgbb',
	'insightoai',
	'instagram',
	'intercom',
	'jigsawstack',
	'jira',
	'kaggle',
	'linear',
	'linkedin',
	'loyverse',
	'mailboxlayer',
	'mailchimp',
	'mailtrap',
	'marketstack',
	'merriamwebsterdict',
	'monday',
	'neon',
	'nextdns',
	'notion',
	'ocrspace',
	'ocrwebservice',
	'ollama',
	'onedrive',
	'onepassword',
	'openai',
	'openrouter',
	'openweathermap',
	'oura',
	'outlook',
	'pagerduty',
	'parseur',
	'pdfmonkey',
	'perplexityai',
	'pinecone',
	'posthog',
	'razorpay',
	'reddit',
	'removebg',
	'resend',
	'retailed',
	'salesforce',
	'sapsuccessfactors',
	'scrapegraphai',
	'securitytrails',
	'sendgrid',
	'sentry',
	'serpapi',
	'sharepoint',
	'slack',
	'sourcegraph',
	'spotify',
	'strava',
	'streamtime',
	'stripe',
	'studiobyai21labs',
	'supabase',
	'synthflowai',
	'tally',
	'tavily',
	'tavilymcp',
	'teams',
	'telegram',
	'textrazor',
	'ticktick',
	'timelink',
	'tisane',
	'timecamp',
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
	'vestaboard',
	'wakatime',
	'webflow',
	'webvizio',
	'whatsapp',
	'witai',
	'worldnewsapi',
	'wiza',
	'workday',
	'workiom',
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
	appveyor: 'AppVeyor',
	api2pdf: 'API2PDF',
	apibible: 'API.Bible',
	apify: 'Apify',
	apilabz: 'API Labz',
	apininjas: 'API Ninjas',
	apipie: 'APIpie AI',
	apisports: 'API-Sports',
	asana: 'Asana',
	ascora: 'Ascora',
	asindataapi: 'ASIN Data API',
	asticaai: 'Astica AI',
	asyncinterview: 'Async Interview',
	attio: 'Attio',
	autom: 'Autom',
	ayrshare: 'Ayrshare',
	backendless: 'Backendless',
	bannerbear: 'Bannerbear',
	bart: 'BART',
	basecamp: 'Basecamp',
	baselinker: 'BaseLinker',
	basin: 'Basin',
	beaconstac: 'Beaconstac',
	beeminder: 'Beeminder',
	bettercontact: 'BetterContact',
	betterproposals: 'Better Proposals',
	betterstack: 'Better Stack',
	bigdatacloud: 'BigDataCloud',
	bigmailer: 'BigMailer',
	bigml: 'BigML',
	bitbucket: 'Bitbucket',
	bitwarden: 'Bitwarden',
	blazemeter: 'BlazeMeter',
	blocknative: 'Blocknative',
	bluesky: 'Bluesky',
	boloforms: 'Boloforms',
	boltiot: 'Bolt IoT',
	bonsai: 'Bonsai',
	bookingmood: 'Bookingmood',
	botpress: 'Botpress',
	botsonic: 'Botsonic',
	bouncer: 'Bouncer',
	box: 'Box',
	boxhero: 'BoxHero',
	brandfetch: 'Brandfetch',
	breathehr: 'Breathe HR',
	brex: 'Brex',
	brightdata: 'Bright Data',
	browseai: 'Browse AI',
	browserless: 'Browserless',
	bubble: 'Bubble',
	bugsnag: 'BugSnag',
	buildkite: 'Buildkite',
	cal: 'Cal',
	calendly: 'Calendly',
	canva: 'Canva',
	canvas: 'Canvas LMS',
	capsulecrm: 'Capsule CRM',
	chatbotkit: 'ChatBotKit',
	chatfai: 'ChatFAI',
	circleci: 'CircleCI',
	clickhouse: 'Clickhouse',
	clientary: 'Clientary',
	clockify: 'Clockify',
	cloudflare: 'Cloudflare',
	cloudinary: 'Cloudinary',
	collegefootballdata: 'College Football Data',
	confluence: 'Confluence',
	connecteam: 'Connecteam',
	contentfulgraphql: 'Contentful GraphQL',
	contextsevenmcp: 'Context7',
	crowterminal: 'CrowTerminal',
	cursor: 'Cursor',
	customgpt: 'CustomGPT',
	databricks: 'Databricks',
	datadog: 'Datadog',
	datarobot: 'DataRobot',
	deepseek: 'DeepSeek',
	devinmcp: 'Devin MCP',
	diffbot: 'Diffbot',
	digitalocean: 'DigitalOcean',
	discord: 'Discord',
	dockerhub: 'Docker Hub',
	dodopayments: 'Dodo Payments',
	doppler: 'Doppler',
	dreamstudio: 'DreamStudio',
	dripcel: 'Dripcel',
	dropbox: 'Dropbox',
	dropboxsign: 'Dropbox Sign',
	dynapictures: 'Dynapictures',
	epicgames: 'Epic Games',
	exa: 'Exa',
	facebook: 'Facebook',
	faraday: 'Faraday',
	figma: 'Figma',
	filloutforms: 'FilloutForms',
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
	here: 'HERE',
	heygen: 'HeyGen',
	htmltoimage: 'HtmlToImage',
	hubspot: 'HubSpot',
	huggingface: 'Hugging Face',
	imgbb: 'ImgBB',
	insightoai: 'Insighto.ai',
	instagram: 'Instagram',
	intercom: 'Intercom',
	jigsawstack: 'JigsawStack',
	jira: 'Jira',
	kaggle: 'Kaggle',
	linear: 'Linear',
	linkedin: 'LinkedIn',
	loyverse: 'Loyverse',
	mailboxlayer: 'MailboxLayer',
	mailchimp: 'Mailchimp',
	mailtrap: 'Mailtrap',
	marketstack: 'Marketstack',
	merriamwebsterdict: 'Merriam-Webster Dictionary',
	monday: 'Monday',
	neon: 'Neon',
	nextdns: 'NextDNS',
	notion: 'Notion',
	ocrspace: 'OCR.space',
	ocrwebservice: 'OcrWebService',
	ollama: 'Ollama',
	onedrive: 'OneDrive',
	onepassword: '1Password',
	openai: 'OpenAI',
	openrouter: 'OpenRouter',
	openweathermap: 'OpenWeatherMap',
	oura: 'Oura',
	outlook: 'Outlook',
	pagerduty: 'PagerDuty',
	parseur: 'Parseur',
	pdfmonkey: 'PDFMonkey',
	perplexityai: 'Perplexity AI',
	pinecone: 'Pinecone',
	posthog: 'PostHog',
	razorpay: 'Razorpay',
	reddit: 'Reddit',
	removebg: 'remove.bg',
	resend: 'Resend',
	retailed: 'Retailed',
	salesforce: 'Salesforce',
	sapsuccessfactors: 'SAP SuccessFactors',
	scrapegraphai: 'ScrapeGraphAI',
	securitytrails: 'SecurityTrails',
	sendgrid: 'SendGrid',
	sentry: 'Sentry',
	serpapi: 'Serpapi',
	sharepoint: 'SharePoint',
	slack: 'Slack',
	sourcegraph: 'Sourcegraph',
	spotify: 'Spotify',
	strava: 'Strava',
	streamtime: 'Streamtime',
	stripe: 'Stripe',
	studiobyai21labs: 'StudioByAI21Labs',
	supabase: 'Supabase',
	synthflowai: 'Synthflow AI',
	tally: 'Tally',
	tavily: 'Tavily',
	tavilymcp: 'Tavily MCP',
	teams: 'Teams',
	telegram: 'Telegram',
	textrazor: 'TextRazor',
	ticktick: 'TickTick',
	timelink: 'Timelink',
	tisane: 'Tisane',
	timecamp: 'TimeCamp',
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
	vestaboard: 'Vestaboard',
	wakatime: 'WakaTime',
	webflow: 'Webflow',
	webvizio: 'Webvizio',
	whatsapp: 'WhatsApp',
	witai: 'WitAi',
	worldnewsapi: 'World News API',
	wiza: 'Wiza',
	workday: 'Workday',
	workiom: 'Workiom',
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
	| 'ascora'
	| 'asindataapi'
	| 'asticaai'
	| 'asyncinterview'
	| 'attio'
	| 'autom'
	| 'ayrshare'
	| 'backendless'
	| 'bannerbear'
	| 'bart'
	| 'basecamp'
	| 'baselinker'
	| 'basin'
	| 'beaconstac'
	| 'beeminder'
	| 'bettercontact'
	| 'betterproposals'
	| 'betterstack'
	| 'bigdatacloud'
	| 'bigmailer'
	| 'bigml'
	| 'bitbucket'
	| 'bitwarden'
	| 'blazemeter'
	| 'blocknative'
	| 'bluesky'
	| 'boloforms'
	| 'boltiot'
	| 'bonsai'
	| 'bookingmood'
	| 'botpress'
	| 'botsonic'
	| 'bouncer'
	| 'box'
	| 'boxhero'
	| 'brandfetch'
	| 'breathehr'
	| 'brex'
	| 'brightdata'
	| 'browseai'
	| 'browserless'
	| 'bubble'
	| 'bugsnag'
	| 'buildkite'
	| 'cal'
	| 'calendly'
	| 'canva'
	| 'canvas'
	| 'capsulecrm'
	| 'chatbotkit'
	| 'chatfai'
	| 'circleci'
	| 'clickhouse'
	| 'clientary'
	| 'clockify'
	| 'cloudflare'
	| 'cloudinary'
	| 'collegefootballdata'
	| 'confluence'
	| 'connecteam'
	| 'contentfulgraphql'
	| 'contextsevenmcp'
	| 'crowterminal'
	| 'cursor'
	| 'customgpt'
	| 'databricks'
	| 'datadog'
	| 'datarobot'
	| 'deepseek'
	| 'devinmcp'
	| 'diffbot'
	| 'digitalocean'
	| 'discord'
	| 'dockerhub'
	| 'dodopayments'
	| 'doppler'
	| 'dreamstudio'
	| 'dripcel'
	| 'dropbox'
	| 'dropboxsign'
	| 'dynapictures'
	| 'epicgames'
	| 'exa'
	| 'facebook'
	| 'faraday'
	| 'figma'
	| 'filloutforms'
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
	| 'here'
	| 'heygen'
	| 'htmltoimage'
	| 'hubspot'
	| 'huggingface'
	| 'imgbb'
	| 'insightoai'
	| 'instagram'
	| 'intercom'
	| 'jigsawstack'
	| 'jira'
	| 'kaggle'
	| 'linear'
	| 'linkedin'
	| 'loyverse'
	| 'mailboxlayer'
	| 'mailchimp'
	| 'mailtrap'
	| 'marketstack'
	| 'merriamwebsterdict'
	| 'monday'
	| 'neon'
	| 'nextdns'
	| 'notion'
	| 'ocrspace'
	| 'ocrwebservice'
	| 'ollama'
	| 'onedrive'
	| 'onepassword'
	| 'openai'
	| 'openrouter'
	| 'openweathermap'
	| 'oura'
	| 'outlook'
	| 'pagerduty'
	| 'parseur'
	| 'pdfmonkey'
	| 'perplexityai'
	| 'pinecone'
	| 'posthog'
	| 'razorpay'
	| 'reddit'
	| 'removebg'
	| 'resend'
	| 'retailed'
	| 'salesforce'
	| 'sapsuccessfactors'
	| 'scrapegraphai'
	| 'securitytrails'
	| 'sendgrid'
	| 'sentry'
	| 'serpapi'
	| 'sharepoint'
	| 'slack'
	| 'sourcegraph'
	| 'spotify'
	| 'strava'
	| 'streamtime'
	| 'stripe'
	| 'studiobyai21labs'
	| 'supabase'
	| 'synthflowai'
	| 'tally'
	| 'tavily'
	| 'tavilymcp'
	| 'teams'
	| 'telegram'
	| 'textrazor'
	| 'ticktick'
	| 'timelink'
	| 'tisane'
	| 'timecamp'
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
	| 'vestaboard'
	| 'wakatime'
	| 'webflow'
	| 'webvizio'
	| 'whatsapp'
	| 'witai'
	| 'worldnewsapi'
	| 'wiza'
	| 'workday'
	| 'workiom'
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
