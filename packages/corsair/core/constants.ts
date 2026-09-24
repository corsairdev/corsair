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
	'agiled',
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
	'appointo',
	'aryn',
	'asana',
	'ascora',
	'ashby',
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
	'beamer',
	'beeminder',
	'benchmarkemail',
	'bestbuy',
	'bettercontact',
	'betterproposals',
	'betterstack',
	'bigdatacloud',
	'bigmailer',
	'bigml',
	'bigpictureio',
	'bitbucket',
	'bitwarden',
	'blazemeter',
	'blocknative',
	'bluesky',
	'boldsign',
	'boloforms',
	'boltiot',
	'bonsai',
	'bookingmood',
	'booqable',
	'borneo',
	'botbaba',
	'botpress',
	'botsonic',
	'bouncer',
	'box',
	'boxhero',
	'brandfetch',
	'breathehr',
	'brevo',
	'brex',
	'brightdata',
	'browseai',
	'browserless',
	'browsertool',
	'bubble',
	'bugsnag',
	'buildkite',
	'bunnycdn',
	'byteforms',
	'cal',
	'calendly',
	'campaigncleaner',
	'campayn',
	'canny',
	'canva',
	'canvas',
	'capsulecrm',
	'carbone',
	'castingwords',
	'cdrplatform',
	'certifier',
	'chaser',
	'chatbotkit',
	'chatfai',
	'chmeetings',
	'cincopa',
	'circleci',
	'classmarker',
	'clickhouse',
	'clickmeeting',
	'clientary',
	'clockify',
	'cloudcart',
	'cloudflare',
	'cloudflareapikey',
	'cloudinary',
	'cody',
	'coinbase',
	'collegefootballdata',
	'confluence',
	'connecteam',
	'contentfulgraphql',
	'contextsevenmcp',
	'convoloai',
	'cosmic',
	'countdownapi',
	'crowterminal',
	'currentsapi',
	'cursor',
	'customerio',
	'customgpt',
	'dadataru',
	'databricks',
	'datadog',
	'datarobot',
	'deepseek',
	'devinmcp',
	'diffbot',
	'digitalocean',
	'discord',
	'dockerhub',
	'docupost',
	'dodopayments',
	'doppler',
	'dovetail',
	'dreamstudio',
	'dripcel',
	'dropbox',
	'dropboxsign',
	'dynapictures',
	'emelia',
	'epicgames',
	'everhour',
	'exa',
	'exist',
	'extractaai',
	'facebook',
	'faraday',
	'figma',
	'filevine',
	'filloutforms',
	'finerworks',
	'firecrawl',
	'fireflies',
	'flexisign',
	'flutterwave',
	'formbricks',
	'gemini',
	'giphy',
	'github',
	'gitlab',
	'gladia',
	'gmail',
	'googleaddressvalidation',
	'googleanalytics',
	'googlebigquery',
	'googlecalendar',
	'googlecloudvision',
	'googledocs',
	'googledrive',
	'googlemaps',
	'googlemeet',
	'googlesheets',
	'grafana',
	'griptape',
	'groqcloud',
	'habitica',
	'hackernews',
	'harvest',
	'hashnode',
	'here',
	'heygen',
	'hookdeck',
	'htmltoimage',
	'hubspot',
	'huggingface',
	'imagior',
	'humanitix',
	'imejisio',
	'imgbb',
	'insightoai',
	'instagram',
	'intercom',
	'jigsawstack',
	'jira',
	'kaggle',
	'kibana',
	'leexi',
	'linear',
	'linkedin',
	'loyverse',
	'mailboxlayer',
	'mailcheck',
	'mailchimp',
	'mailtrap',
	'marketstack',
	'merriamwebsterdict',
	'monday',
	'neon',
	'nextdns',
	'northflank',
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
	'pdfco',
	'pdfmonkey',
	'perplexityai',
	'phantombuster',
	'pinecone',
	'plain',
	'posthog',
	'postman',
	'prisma',
	'pushbullet',
	'razorpay',
	'reddit',
	'replicate',
	'removebg',
	'replyio',
	'resend',
	'retailed',
	'rootly',
	'runpod',
	'salesforce',
	'sapsuccessfactors',
	'scaleai',
	'scrapegraphai',
	'securitytrails',
	'semanticscholar',
	'sendgrid',
	'sentry',
	'serpapi',
	'sharepoint',
	'slack',
	'snapchat',
	'slackbot',
	'sourcegraph',
	'spoki',
	'spotify',
	'strava',
	'streamtime',
	'stripe',
	'studiobyai21labs',
	'supabase',
	'supadata',
	'synthflowai',
	'tally',
	'tavily',
	'tavilymcp',
	'teams',
	'telegram',
	'textrazor',
	'ticktick',
	'timecamp',
	'timelink',
	'tinyurl',
	'tisane',
	'todoist',
	'toggl',
	'tokenmetrics',
	'tpscheck',
	'trello',
	'tripadvisor',
	'twentyonerisk',
	'twilio',
	'twitter',
	'twitterapiio',
	'twochat',
	'typeform',
	'unione',
	'uniswapapi',
	'uploadcare',
	'vapi',
	'vercel',
	'veriphone',
	'vestaboard',
	'waboxapp',
	'wakatime',
	'webflow',
	'webscrapingai',
	'webvizio',
	'whatsapp',
	'whoisfreaks',
	'whautomate',
	'winstonai',
	'witai',
	'wix',
	'wiza',
	'workday',
	'workiom',
	'worldnewsapi',
	'xero',
	'writer',
	'xquik',
	'youcom',
	'youtube',
	'zendesk',
	'zenserp',
	'zohobigin',
	'zohoinventory',
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
	agiled: 'Agiled',
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
	appointo: 'Appointo',
	aryn: 'Aryn',
	asana: 'Asana',
	ascora: 'Ascora',
	ashby: 'Ashby',
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
	beamer: 'Beamer',
	beeminder: 'Beeminder',
	benchmarkemail: 'BenchmarkEmail',
	bestbuy: 'Best Buy',
	bettercontact: 'BetterContact',
	betterproposals: 'Better Proposals',
	betterstack: 'Better Stack',
	bigdatacloud: 'BigDataCloud',
	bigmailer: 'BigMailer',
	bigml: 'BigML',
	bigpictureio: 'BigPicture.io',
	bitbucket: 'Bitbucket',
	bitwarden: 'Bitwarden',
	blazemeter: 'BlazeMeter',
	blocknative: 'Blocknative',
	bluesky: 'Bluesky',
	boldsign: 'Boldsign',
	boloforms: 'Boloforms',
	boltiot: 'Bolt IoT',
	bonsai: 'Bonsai',
	bookingmood: 'Bookingmood',
	booqable: 'Booqable',
	borneo: 'Borneo',
	botbaba: 'Botbaba',
	botpress: 'Botpress',
	botsonic: 'Botsonic',
	bouncer: 'Bouncer',
	box: 'Box',
	boxhero: 'BoxHero',
	brandfetch: 'Brandfetch',
	breathehr: 'Breathe HR',
	brevo: 'Brevo',
	brex: 'Brex',
	brightdata: 'Bright Data',
	browseai: 'Browse AI',
	browserless: 'Browserless',
	browsertool: 'Browser Tool',
	bubble: 'Bubble',
	bugsnag: 'BugSnag',
	buildkite: 'Buildkite',
	bunnycdn: 'Bunnycdn',
	byteforms: 'ByteForms',
	cal: 'Cal',
	calendly: 'Calendly',
	campaigncleaner: 'Campaign Cleaner',
	campayn: 'Campayn',
	canny: 'Canny',
	canva: 'Canva',
	canvas: 'Canvas LMS',
	capsulecrm: 'Capsule CRM',
	carbone: 'Carbone',
	castingwords: 'CastingWords',
	cdrplatform: 'CDR Platform',
	certifier: 'Certifier',
	chaser: 'Chaser',
	chatbotkit: 'ChatBotKit',
	chatfai: 'ChatFAI',
	chmeetings: 'ChMeetings',
	cincopa: 'Cincopa',
	circleci: 'CircleCI',
	classmarker: 'ClassMarker',
	clickhouse: 'Clickhouse',
	clickmeeting: 'ClickMeeting',
	clientary: 'Clientary',
	clockify: 'Clockify',
	cloudcart: 'CloudCart',
	cloudflare: 'Cloudflare',
	cloudflareapikey: 'Cloudflare API Key',
	cloudinary: 'Cloudinary',
	cody: 'Cody',
	coinbase: 'Coinbase',
	collegefootballdata: 'College Football Data',
	confluence: 'Confluence',
	connecteam: 'Connecteam',
	contentfulgraphql: 'Contentful GraphQL',
	contextsevenmcp: 'Context7',
	convoloai: 'ConvoloAi',
	cosmic: 'Cosmic',
	countdownapi: 'Countdown API',
	crowterminal: 'CrowTerminal',
	currentsapi: 'CurrentsApi',
	cursor: 'Cursor',
	customerio: 'Customer.io',
	customgpt: 'CustomGPT',
	dadataru: 'Dadataru',
	databricks: 'Databricks',
	datadog: 'Datadog',
	datarobot: 'DataRobot',
	deepseek: 'DeepSeek',
	devinmcp: 'Devin MCP',
	diffbot: 'Diffbot',
	digitalocean: 'DigitalOcean',
	discord: 'Discord',
	dockerhub: 'Docker Hub',
	docupost: 'Docupost',
	dodopayments: 'Dodo Payments',
	doppler: 'Doppler',
	dovetail: 'Dovetail',
	dreamstudio: 'DreamStudio',
	dripcel: 'Dripcel',
	dropbox: 'Dropbox',
	dropboxsign: 'Dropbox Sign',
	dynapictures: 'Dynapictures',
	emelia: 'Emelia',
	epicgames: 'Epic Games',
	everhour: 'Everhour',
	exa: 'Exa',
	exist: 'Exist',
	extractaai: 'Extracta.ai',
	facebook: 'Facebook',
	faraday: 'Faraday',
	figma: 'Figma',
	filevine: 'Filevine',
	filloutforms: 'FilloutForms',
	finerworks: 'FinerWorks',
	firecrawl: 'Firecrawl',
	fireflies: 'Fireflies',
	flexisign: 'Flexisign',
	flutterwave: 'Flutterwave',
	formbricks: 'Formbricks',
	gemini: 'Gemini',
	giphy: 'Giphy',
	github: 'GitHub',
	gitlab: 'GitLab',
	gladia: 'Gladia',
	gmail: 'Gmail',
	googleaddressvalidation: 'Google Address Validation',
	googleanalytics: 'Google Analytics',
	googlebigquery: 'Google BigQuery',
	googlecalendar: 'Google Calendar',
	googlecloudvision: 'Google Cloud Vision',
	googledocs: 'Google Docs',
	googledrive: 'Google Drive',
	googlemaps: 'Google Maps',
	googlemeet: 'Google Meet',
	googlesheets: 'Google Sheets',
	grafana: 'Grafana',
	griptape: 'Griptape',
	groqcloud: 'GroqCloud',
	habitica: 'Habitica',
	hackernews: 'Hacker News',
	harvest: 'Harvest',
	hashnode: 'Hashnode',
	here: 'HERE',
	heygen: 'HeyGen',
	hookdeck: 'Hookdeck',
	htmltoimage: 'HtmlToImage',
	hubspot: 'HubSpot',
	huggingface: 'Hugging Face',
	imagior: 'Imagior',
	humanitix: 'Humanitix',
	imejisio: 'Imejis.io',
	imgbb: 'ImgBB',
	insightoai: 'Insighto.ai',
	instagram: 'Instagram',
	intercom: 'Intercom',
	jigsawstack: 'JigsawStack',
	jira: 'Jira',
	kaggle: 'Kaggle',
	kibana: 'Kibana',
	leexi: 'Leexi',
	linear: 'Linear',
	linkedin: 'LinkedIn',
	loyverse: 'Loyverse',
	mailboxlayer: 'MailboxLayer',
	mailcheck: 'Mailcheck',
	mailchimp: 'Mailchimp',
	mailtrap: 'Mailtrap',
	marketstack: 'Marketstack',
	merriamwebsterdict: 'Merriam-Webster Dictionary',
	monday: 'Monday',
	neon: 'Neon',
	nextdns: 'NextDNS',
	northflank: 'Northflank',
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
	pdfco: 'PDF.co',
	pdfmonkey: 'PDFMonkey',
	perplexityai: 'Perplexity AI',
	phantombuster: 'PhantomBuster',
	pinecone: 'Pinecone',
	plain: 'Plain',
	posthog: 'PostHog',
	postman: 'Postman',
	prisma: 'Prisma',
	pushbullet: 'Pushbullet',
	razorpay: 'Razorpay',
	reddit: 'Reddit',
	replicate: 'Replicate',
	removebg: 'remove.bg',
	replyio: 'Reply.io',
	resend: 'Resend',
	retailed: 'Retailed',
	rootly: 'Rootly',
	runpod: 'RunPod',
	salesforce: 'Salesforce',
	sapsuccessfactors: 'SAP SuccessFactors',
	scaleai: 'Scale AI',
	scrapegraphai: 'ScrapeGraphAI',
	securitytrails: 'SecurityTrails',
	semanticscholar: 'Semantic Scholar',
	sendgrid: 'SendGrid',
	sentry: 'Sentry',
	serpapi: 'Serpapi',
	sharepoint: 'SharePoint',
	slack: 'Slack',
	snapchat: 'Snapchat',
	slackbot: 'Slackbot',
	sourcegraph: 'Sourcegraph',
	spoki: 'Spoki',
	spotify: 'Spotify',
	strava: 'Strava',
	streamtime: 'Streamtime',
	stripe: 'Stripe',
	studiobyai21labs: 'StudioByAI21Labs',
	supabase: 'Supabase',
	supadata: 'Supadata',
	synthflowai: 'Synthflow AI',
	tally: 'Tally',
	tavily: 'Tavily',
	tavilymcp: 'Tavily MCP',
	teams: 'Teams',
	telegram: 'Telegram',
	textrazor: 'TextRazor',
	ticktick: 'TickTick',
	timecamp: 'TimeCamp',
	timelink: 'Timelink',
	tinyurl: 'TinyURL',
	tisane: 'Tisane',
	todoist: 'Todoist',
	toggl: 'Toggl',
	tokenmetrics: 'Token Metrics',
	tpscheck: 'TPSCheck',
	trello: 'Trello',
	tripadvisor: 'Tripadvisor',
	twentyonerisk: 'TwentyOneRisk',
	twilio: 'Twilio',
	twitter: 'Twitter',
	twitterapiio: 'Twitter API IO',
	twochat: 'TwoChat',
	typeform: 'Typeform',
	unione: 'Unione',
	uniswapapi: 'Uniswap',
	uploadcare: 'Uploadcare',
	vapi: 'Vapi',
	vercel: 'Vercel',
	veriphone: 'Veriphone',
	vestaboard: 'Vestaboard',
	waboxapp: 'Waboxapp',
	wakatime: 'WakaTime',
	webflow: 'Webflow',
	webscrapingai: 'WebScraping.AI',
	webvizio: 'Webvizio',
	whatsapp: 'WhatsApp',
	whoisfreaks: 'Whoisfreaks',
	whautomate: 'Whautomate',
	winstonai: 'Winston AI',
	witai: 'WitAi',
	wix: 'Wix',
	wiza: 'Wiza',
	workday: 'Workday',
	workiom: 'Workiom',
	worldnewsapi: 'World News API',
	xero: 'Xero',
	writer: 'Writer',
	xquik: 'XQuik',
	youcom: 'You.com',
	youtube: 'YouTube',
	zendesk: 'Zendesk',
	zenserp: 'Zenserp',
	zohobigin: 'Zoho Bigin',
	zohoinventory: 'Zoho Inventory',
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
	| 'agiled'
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
	| 'appointo'
	| 'aryn'
	| 'asana'
	| 'ascora'
	| 'ashby'
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
	| 'beamer'
	| 'beeminder'
	| 'benchmarkemail'
	| 'bestbuy'
	| 'bettercontact'
	| 'betterproposals'
	| 'betterstack'
	| 'bigdatacloud'
	| 'bigmailer'
	| 'bigml'
	| 'bigpictureio'
	| 'bitbucket'
	| 'bitwarden'
	| 'blazemeter'
	| 'blocknative'
	| 'bluesky'
	| 'boldsign'
	| 'boloforms'
	| 'boltiot'
	| 'bonsai'
	| 'bookingmood'
	| 'booqable'
	| 'borneo'
	| 'botbaba'
	| 'botpress'
	| 'botsonic'
	| 'bouncer'
	| 'box'
	| 'boxhero'
	| 'brandfetch'
	| 'breathehr'
	| 'brevo'
	| 'brex'
	| 'brightdata'
	| 'browseai'
	| 'browserless'
	| 'browsertool'
	| 'bubble'
	| 'bugsnag'
	| 'buildkite'
	| 'bunnycdn'
	| 'byteforms'
	| 'cal'
	| 'calendly'
	| 'campaigncleaner'
	| 'campayn'
	| 'canny'
	| 'canva'
	| 'canvas'
	| 'capsulecrm'
	| 'carbone'
	| 'castingwords'
	| 'cdrplatform'
	| 'certifier'
	| 'chaser'
	| 'chatbotkit'
	| 'chatfai'
	| 'chmeetings'
	| 'cincopa'
	| 'circleci'
	| 'classmarker'
	| 'clickhouse'
	| 'clickmeeting'
	| 'clientary'
	| 'clockify'
	| 'cloudcart'
	| 'cloudflare'
	| 'cloudflareapikey'
	| 'cloudinary'
	| 'cody'
	| 'coinbase'
	| 'collegefootballdata'
	| 'confluence'
	| 'connecteam'
	| 'contentfulgraphql'
	| 'contextsevenmcp'
	| 'convoloai'
	| 'cosmic'
	| 'countdownapi'
	| 'crowterminal'
	| 'currentsapi'
	| 'cursor'
	| 'customerio'
	| 'customgpt'
	| 'dadataru'
	| 'databricks'
	| 'datadog'
	| 'datarobot'
	| 'deepseek'
	| 'devinmcp'
	| 'diffbot'
	| 'digitalocean'
	| 'discord'
	| 'dockerhub'
	| 'docupost'
	| 'dodopayments'
	| 'doppler'
	| 'dovetail'
	| 'dreamstudio'
	| 'dripcel'
	| 'dropbox'
	| 'dropboxsign'
	| 'dynapictures'
	| 'emelia'
	| 'epicgames'
	| 'everhour'
	| 'exa'
	| 'exist'
	| 'extractaai'
	| 'facebook'
	| 'faraday'
	| 'figma'
	| 'filevine'
	| 'filloutforms'
	| 'finerworks'
	| 'firecrawl'
	| 'fireflies'
	| 'flexisign'
	| 'flutterwave'
	| 'formbricks'
	| 'gemini'
	| 'giphy'
	| 'github'
	| 'gitlab'
	| 'gladia'
	| 'gmail'
	| 'googleaddressvalidation'
	| 'googleanalytics'
	| 'googlebigquery'
	| 'googlecalendar'
	| 'googlecloudvision'
	| 'googledocs'
	| 'googledrive'
	| 'googlemaps'
	| 'googlemeet'
	| 'googlesheets'
	| 'grafana'
	| 'griptape'
	| 'groqcloud'
	| 'habitica'
	| 'hackernews'
	| 'harvest'
	| 'hashnode'
	| 'here'
	| 'heygen'
	| 'hookdeck'
	| 'htmltoimage'
	| 'hubspot'
	| 'huggingface'
	| 'imagior'
	| 'humanitix'
	| 'imejisio'
	| 'imgbb'
	| 'insightoai'
	| 'instagram'
	| 'intercom'
	| 'jigsawstack'
	| 'jira'
	| 'kaggle'
	| 'kibana'
	| 'leexi'
	| 'linear'
	| 'linkedin'
	| 'loyverse'
	| 'mailboxlayer'
	| 'mailcheck'
	| 'mailchimp'
	| 'mailtrap'
	| 'marketstack'
	| 'merriamwebsterdict'
	| 'monday'
	| 'neon'
	| 'nextdns'
	| 'northflank'
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
	| 'pdfco'
	| 'pdfmonkey'
	| 'perplexityai'
	| 'phantombuster'
	| 'pinecone'
	| 'plain'
	| 'posthog'
	| 'postman'
	| 'prisma'
	| 'pushbullet'
	| 'razorpay'
	| 'reddit'
	| 'replicate'
	| 'removebg'
	| 'replyio'
	| 'resend'
	| 'retailed'
	| 'rootly'
	| 'runpod'
	| 'salesforce'
	| 'sapsuccessfactors'
	| 'scaleai'
	| 'scrapegraphai'
	| 'securitytrails'
	| 'semanticscholar'
	| 'sendgrid'
	| 'sentry'
	| 'serpapi'
	| 'sharepoint'
	| 'slack'
	| 'snapchat'
	| 'slackbot'
	| 'sourcegraph'
	| 'spoki'
	| 'spotify'
	| 'strava'
	| 'streamtime'
	| 'stripe'
	| 'studiobyai21labs'
	| 'supabase'
	| 'supadata'
	| 'synthflowai'
	| 'tally'
	| 'tavily'
	| 'tavilymcp'
	| 'teams'
	| 'telegram'
	| 'textrazor'
	| 'ticktick'
	| 'timecamp'
	| 'timelink'
	| 'tinyurl'
	| 'tisane'
	| 'todoist'
	| 'toggl'
	| 'tokenmetrics'
	| 'tpscheck'
	| 'trello'
	| 'tripadvisor'
	| 'twentyonerisk'
	| 'twilio'
	| 'twitter'
	| 'twitterapiio'
	| 'twochat'
	| 'typeform'
	| 'unione'
	| 'uniswapapi'
	| 'uploadcare'
	| 'vapi'
	| 'vercel'
	| 'veriphone'
	| 'vestaboard'
	| 'waboxapp'
	| 'wakatime'
	| 'webflow'
	| 'webscrapingai'
	| 'webvizio'
	| 'whatsapp'
	| 'whoisfreaks'
	| 'whautomate'
	| 'winstonai'
	| 'witai'
	| 'wix'
	| 'wiza'
	| 'workday'
	| 'workiom'
	| 'worldnewsapi'
	| 'xero'
	| 'writer'
	| 'xquik'
	| 'youcom'
	| 'youtube'
	| 'zendesk'
	| 'zenserp'
	| 'zohobigin'
	| 'zohoinventory'
	| 'zohomail'
	| 'zoom'
	| 'zoominfo'
	| (string & {});

export type AuthTypes = 'oauth_2' | 'api_key' | 'bot_token' | 'managed';

export type PickAuth<T extends AuthTypes> = T;
