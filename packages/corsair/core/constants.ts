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
	'akta',
	'alchemy',
	'algolia',
	'alibaba',
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
	'apollo',
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
	'benzinga',
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
	'blackbaud',
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
	'builtwith',
	'browserless',
	'browsertool',
	'bubble',
	'bugsnag',
	'buildkite',
	'bunnycdn',
	'bytedance',
	'byteforms',
	'cal',
	'callpage',
	'calendly',
	'callingly',
	'campaigncleaner',
	'campayn',
	'canny',
	'canva',
	'canvas',
	'capsulecrm',
	'carbone',
	'castingwords',
	'cdrplatform',
	'celigo',
	'certifier',
	'chaser',
	'chatbotkit',
	'chatfai',
	'chatwork',
	'chmeetings',
	'cincopa',
	'circleci',
	'claidai',
	'classmarker',
	'clay',
	'clickhouse',
	'clickmeeting',
	'clickup',
	'clicksend',
	'clientary',
	'clockify',
	'close',
	'cloro',
	'cloudcart',
	'cloudflare',
	'cloudflareapikey',
	'cloudinary',
	'coassemble',
	'codeinterpreter',
	'coda',
	'cody',
	'coinbase',
	'coinmarketcal',
	'collegefootballdata',
	'composio',
	'confluence',
	'connecteam',
	'contactout',
	'contentfulgraphql',
	'contextdev',
	'contextsevenmcp',
	'convex',
	'convoloai',
	'cosmic',
	'countdownapi',
	'crowterminal',
	'currentsapi',
	'cursor',
	'customerio',
	'customgpt',
	'cuttly',
	'dadataru',
	'daffy',
	'databricks',
	'datadog',
	'dataforseo',
	'datarobot',
	'deepseek',
	'devinmcp',
	'diffbot',
	'digitalocean',
	'discord',
	'dockerhub',
	'docmosis',
	'docupost',
	'docsumo',
	'docusign',
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
	'firecrawl',
	'fireflies',
	'fixer',
	'flexisign',
	'flutterwave',
	'formbricks',
	'fundable',
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
	'humanitix',
	'hunterio',
	'imagior',
	'imejisio',
	'imgbb',
	'insightoai',
	'instagram',
	'instantly',
	'intercom',
	'jigsawstack',
	'jira',
	'kaggle',
	'keenable',
	'kibana',
	'kling',
	'leexi',
	'linear',
	'linkedin',
	'litescrape',
	'loyverse',
	'magichour',
	'mailboxlayer',
	'mailcheck',
	'mailchimp',
	'mailtrap',
	'marketstack',
	'merriamwebsterdict',
	'minimax',
	'monday',
	'mrscraper',
	'neon',
	'nextdns',
	'northflank',
	'notion',
	'ocrspace',
	'ocrwebservice',
	'octen',
	'ollama',
	'onedrive',
	'onepassword',
	'openai',
	'openrouter',
	'openweathermap',
	'orbit',
	'oura',
	'outlook',
	'pagerduty',
	'parseur',
	'pdfco',
	'pdfmonkey',
	'pdl',
	'perplexityai',
	'phantombuster',
	'pinecone',
	'plain',
	'ploid',
	'posthog',
	'postman',
	'prisma',
	'pushbullet',
	'razorpay',
	'reddit',
	'reducto',
	'remoet',
	'replicate',
	'removebg',
	'replicate',
	'replyio',
	'resend',
	'retailed',
	'revai',
	'rootly',
	'runpod',
	'salesforce',
	'saperly',
	'sapsuccessfactors',
	'scaleai',
	'scrapegraphai',
	'search1api',
	'securitytrails',
	'semanticscholar',
	'sendgrid',
	'sentry',
	'serpapi',
	'sharepoint',
	'slack',
	'slackbot',
	'snapchat',
	'sourcegraph',
	'spoki',
	'spotify',
	'starton',
	'strava',
	'streamtime',
	'stripe',
	'studiobyai21labs',
	'supabase',
	'supadata',
	'suzanne',
	'surf',
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
	'tinypng',
	'tinyfish',
	'tinyurl',
	'tisane',
	'todoist',
	'toggl',
	'tokenmetrics',
	'tpscheck',
	'trello',
	'tripadvisor',
	'turso',
	'twentyonerisk',
	'twilio',
	'twitter',
	'twitterapiio',
	'twochat',
	'typeform',
	'unione',
	'uniswapapi',
	'updownio',
	'uploadcare',
	'vapi',
	'vaquill',
	'vercel',
	'veriphone',
	'vestaboard',
	'waboxapp',
	'wakatime',
	'webflow',
	'webscrapingai',
	'webvizio',
	'whatsapp',
	'whautomate',
	'whoisfreaks',
	'winstonai',
	'witai',
	'wix',
	'wiza',
	'workday',
	'workiom',
	'worldnewsapi',
	'writer',
	'xero',
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
	akta: 'Akta',
	alchemy: 'Alchemy',
	algolia: 'Algolia',
	alibaba: 'Alibaba Cloud Model Studio',
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
	apollo: 'Apollo',
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
	benzinga: 'Benzinga',
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
	blackbaud: 'Blackbaud',
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
	builtwith: 'BuiltWith',
	browserless: 'Browserless',
	browsertool: 'Browser Tool',
	bubble: 'Bubble',
	bugsnag: 'BugSnag',
	buildkite: 'Buildkite',
	bunnycdn: 'Bunnycdn',
	bytedance: 'ByteDance',
	byteforms: 'ByteForms',
	cal: 'Cal',
	callpage: 'CallPage',
	calendly: 'Calendly',
	callingly: 'Callingly',
	campaigncleaner: 'Campaign Cleaner',
	campayn: 'Campayn',
	canny: 'Canny',
	canva: 'Canva',
	canvas: 'Canvas LMS',
	capsulecrm: 'Capsule CRM',
	carbone: 'Carbone',
	castingwords: 'CastingWords',
	cdrplatform: 'CDR Platform',
	celigo: 'Celigo',
	certifier: 'Certifier',
	chaser: 'Chaser',
	chatbotkit: 'ChatBotKit',
	chatfai: 'ChatFAI',
	chatwork: 'Chatwork',
	chmeetings: 'ChMeetings',
	cincopa: 'Cincopa',
	circleci: 'CircleCI',
	claidai: 'Claid.ai',
	classmarker: 'ClassMarker',
	clay: 'Clay',
	clickhouse: 'Clickhouse',
	clickmeeting: 'ClickMeeting',
	clickup: 'ClickUp',
	clicksend: 'ClickSend',
	clientary: 'Clientary',
	clockify: 'Clockify',
	close: 'Close',
	cloro: 'cloro',
	cloudcart: 'CloudCart',
	cloudflare: 'Cloudflare',
	cloudflareapikey: 'Cloudflare API Key',
	cloudinary: 'Cloudinary',
	coassemble: 'Coassemble',
	codeinterpreter: 'CodeInterpreter',
	coda: 'Coda',
	cody: 'Cody',
	coinbase: 'Coinbase',
	coinmarketcal: 'Coinmarketcal',
	collegefootballdata: 'College Football Data',
	composio: 'Composio',
	confluence: 'Confluence',
	connecteam: 'Connecteam',
	contactout: 'ContactOut',
	contentfulgraphql: 'Contentful GraphQL',
	contextdev: 'Context.dev',
	contextsevenmcp: 'Context7',
	convex: 'Convex',
	convoloai: 'ConvoloAi',
	cosmic: 'Cosmic',
	countdownapi: 'Countdown API',
	crowterminal: 'CrowTerminal',
	currentsapi: 'CurrentsApi',
	cursor: 'Cursor',
	customerio: 'Customer.io',
	customgpt: 'CustomGPT',
	cuttly: 'Cutt.ly',
	dadataru: 'Dadataru',
	daffy: 'Daffy',
	databricks: 'Databricks',
	datadog: 'Datadog',
	dataforseo: 'DataForSEO',
	datarobot: 'DataRobot',
	deepseek: 'DeepSeek',
	devinmcp: 'Devin MCP',
	diffbot: 'Diffbot',
	digitalocean: 'DigitalOcean',
	discord: 'Discord',
	dockerhub: 'Docker Hub',
	docmosis: 'Docmosis',
	docupost: 'Docupost',
	docsumo: 'Docsumo',
	docusign: 'DocuSign',
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
	firecrawl: 'Firecrawl',
	fireflies: 'Fireflies',
	fixer: 'Fixer',
	flexisign: 'Flexisign',
	flutterwave: 'Flutterwave',
	formbricks: 'Formbricks',
	fundable: 'Fundable',
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
	humanitix: 'Humanitix',
	hunterio: 'Hunter.io',
	imagior: 'Imagior',
	imejisio: 'Imejis.io',
	imgbb: 'ImgBB',
	insightoai: 'Insighto.ai',
	instagram: 'Instagram',
	instantly: 'Instantly',
	intercom: 'Intercom',
	jigsawstack: 'JigsawStack',
	jira: 'Jira',
	kaggle: 'Kaggle',
	keenable: 'Keenable',
	kibana: 'Kibana',
	kling: 'Kling',
	leexi: 'Leexi',
	linear: 'Linear',
	linkedin: 'LinkedIn',
	litescrape: 'LiteScrape',
	loyverse: 'Loyverse',
	magichour: 'Magic Hour',
	mailboxlayer: 'MailboxLayer',
	mailcheck: 'Mailcheck',
	mailchimp: 'Mailchimp',
	mailtrap: 'Mailtrap',
	marketstack: 'Marketstack',
	merriamwebsterdict: 'Merriam-Webster Dictionary',
	minimax: 'MiniMax',
	monday: 'Monday',
	mrscraper: 'MrScraper',
	neon: 'Neon',
	nextdns: 'NextDNS',
	northflank: 'Northflank',
	notion: 'Notion',
	ocrspace: 'OCR.space',
	ocrwebservice: 'OcrWebService',
	octen: 'Octen',
	ollama: 'Ollama',
	onedrive: 'OneDrive',
	onepassword: '1Password',
	openai: 'OpenAI',
	openrouter: 'OpenRouter',
	openweathermap: 'OpenWeatherMap',
	orbit: 'Orbit',
	oura: 'Oura',
	outlook: 'Outlook',
	pagerduty: 'PagerDuty',
	parseur: 'Parseur',
	pdfco: 'PDF.co',
	pdfmonkey: 'PDFMonkey',
	pdl: 'People Data Labs',
	perplexityai: 'Perplexity AI',
	phantombuster: 'PhantomBuster',
	pinecone: 'Pinecone',
	plain: 'Plain',
	ploid: 'Ploid',
	posthog: 'PostHog',
	postman: 'Postman',
	prisma: 'Prisma',
	pushbullet: 'Pushbullet',
	razorpay: 'Razorpay',
	reddit: 'Reddit',
	reducto: 'Reducto',
	remoet: 'Remoet',
	removebg: 'remove.bg',
	replicate: 'Replicate',
	replyio: 'Reply.io',
	resend: 'Resend',
	retailed: 'Retailed',
	revai: 'RevAI',
	rootly: 'Rootly',
	runpod: 'RunPod',
	salesforce: 'Salesforce',
	saperly: 'Saperly',
	sapsuccessfactors: 'SAP SuccessFactors',
	scaleai: 'Scale AI',
	scrapegraphai: 'ScrapeGraphAI',
	search1api: 'Search1API',
	securitytrails: 'SecurityTrails',
	semanticscholar: 'Semantic Scholar',
	sendgrid: 'SendGrid',
	sentry: 'Sentry',
	serpapi: 'Serpapi',
	sharepoint: 'SharePoint',
	slack: 'Slack',
	slackbot: 'Slackbot',
	snapchat: 'Snapchat',
	sourcegraph: 'Sourcegraph',
	spoki: 'Spoki',
	spotify: 'Spotify',
	starton: 'Starton',
	strava: 'Strava',
	streamtime: 'Streamtime',
	stripe: 'Stripe',
	studiobyai21labs: 'StudioByAI21Labs',
	supabase: 'Supabase',
	supadata: 'Supadata',
	suzanne: 'Suzanne',
	surf: 'Surf',
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
	tinypng: 'TinyPNG',
	tinyfish: 'TinyFish',
	tinyurl: 'TinyURL',
	tisane: 'Tisane',
	todoist: 'Todoist',
	toggl: 'Toggl',
	tokenmetrics: 'Token Metrics',
	tpscheck: 'TPSCheck',
	trello: 'Trello',
	tripadvisor: 'Tripadvisor',
	turso: 'Turso',
	twentyonerisk: 'TwentyOneRisk',
	twilio: 'Twilio',
	twitter: 'Twitter',
	twitterapiio: 'Twitter API IO',
	twochat: 'TwoChat',
	typeform: 'Typeform',
	unione: 'Unione',
	uniswapapi: 'Uniswap',
	updownio: 'Updown.io',
	uploadcare: 'Uploadcare',
	vapi: 'Vapi',
	vaquill: 'Vaquill',
	vercel: 'Vercel',
	veriphone: 'Veriphone',
	vestaboard: 'Vestaboard',
	waboxapp: 'Waboxapp',
	wakatime: 'WakaTime',
	webflow: 'Webflow',
	webscrapingai: 'WebScraping.AI',
	webvizio: 'Webvizio',
	whatsapp: 'WhatsApp',
	whautomate: 'Whautomate',
	whoisfreaks: 'Whoisfreaks',
	winstonai: 'Winston AI',
	witai: 'WitAi',
	wix: 'Wix',
	wiza: 'Wiza',
	workday: 'Workday',
	workiom: 'Workiom',
	worldnewsapi: 'World News API',
	writer: 'Writer',
	xero: 'Xero',
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
	| 'akta'
	| 'alchemy'
	| 'algolia'
	| 'alibaba'
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
	| 'apollo'
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
	| 'benzinga'
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
	| 'blackbaud'
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
	| 'bytedance'
	| 'byteforms'
	| 'cal'
	| 'callpage'
	| 'calendly'
	| 'callingly'
	| 'campaigncleaner'
	| 'campayn'
	| 'canny'
	| 'canva'
	| 'canvas'
	| 'capsulecrm'
	| 'carbone'
	| 'castingwords'
	| 'cdrplatform'
	| 'celigo'
	| 'certifier'
	| 'chaser'
	| 'chatbotkit'
	| 'chatfai'
	| 'chatwork'
	| 'chmeetings'
	| 'cincopa'
	| 'circleci'
	| 'claidai'
	| 'classmarker'
	| 'clay'
	| 'clickhouse'
	| 'clickmeeting'
	| 'clickup'
	| 'clicksend'
	| 'clientary'
	| 'clockify'
	| 'close'
	| 'cloro'
	| 'cloudcart'
	| 'cloudflare'
	| 'cloudflareapikey'
	| 'cloudinary'
	| 'coassemble'
	| 'codeinterpreter'
	| 'coda'
	| 'cody'
	| 'coinbase'
	| 'coinmarketcal'
	| 'collegefootballdata'
	| 'composio'
	| 'confluence'
	| 'connecteam'
	| 'contactout'
	| 'contentfulgraphql'
	| 'contextdev'
	| 'contextsevenmcp'
	| 'convex'
	| 'convoloai'
	| 'cosmic'
	| 'countdownapi'
	| 'crowterminal'
	| 'currentsapi'
	| 'cursor'
	| 'customerio'
	| 'customgpt'
	| 'cuttly'
	| 'dadataru'
	| 'daffy'
	| 'databricks'
	| 'datadog'
	| 'dataforseo'
	| 'datarobot'
	| 'deepseek'
	| 'devinmcp'
	| 'diffbot'
	| 'digitalocean'
	| 'discord'
	| 'dockerhub'
	| 'docmosis'
	| 'docupost'
	| 'docsumo'
	| 'docusign'
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
	| 'firecrawl'
	| 'fireflies'
	| 'fixer'
	| 'flexisign'
	| 'flutterwave'
	| 'formbricks'
	| 'fundable'
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
	| 'humanitix'
	| 'hunterio'
	| 'imagior'
	| 'imejisio'
	| 'imgbb'
	| 'insightoai'
	| 'instagram'
	| 'instantly'
	| 'intercom'
	| 'jigsawstack'
	| 'jira'
	| 'kaggle'
	| 'keenable'
	| 'kibana'
	| 'kling'
	| 'leexi'
	| 'linear'
	| 'linkedin'
	| 'litescrape'
	| 'loyverse'
	| 'magichour'
	| 'mailboxlayer'
	| 'mailcheck'
	| 'mailchimp'
	| 'mailtrap'
	| 'marketstack'
	| 'merriamwebsterdict'
	| 'minimax'
	| 'monday'
	| 'mrscraper'
	| 'neon'
	| 'nextdns'
	| 'northflank'
	| 'notion'
	| 'ocrspace'
	| 'ocrwebservice'
	| 'octen'
	| 'ollama'
	| 'onedrive'
	| 'onepassword'
	| 'openai'
	| 'openrouter'
	| 'openweathermap'
	| 'orbit'
	| 'oura'
	| 'outlook'
	| 'pagerduty'
	| 'parseur'
	| 'pdfco'
	| 'pdfmonkey'
	| 'pdl'
	| 'perplexityai'
	| 'phantombuster'
	| 'pinecone'
	| 'plain'
	| 'ploid'
	| 'posthog'
	| 'postman'
	| 'prisma'
	| 'pushbullet'
	| 'razorpay'
	| 'reddit'
	| 'reducto'
	| 'remoet'
	| 'replicate'
	| 'removebg'
	| 'replicate'
	| 'replyio'
	| 'resend'
	| 'retailed'
	| 'revai'
	| 'rootly'
	| 'runpod'
	| 'salesforce'
	| 'saperly'
	| 'sapsuccessfactors'
	| 'scaleai'
	| 'scrapegraphai'
	| 'search1api'
	| 'securitytrails'
	| 'semanticscholar'
	| 'sendgrid'
	| 'sentry'
	| 'serpapi'
	| 'sharepoint'
	| 'slack'
	| 'slackbot'
	| 'snapchat'
	| 'sourcegraph'
	| 'spoki'
	| 'spotify'
	| 'starton'
	| 'strava'
	| 'streamtime'
	| 'stripe'
	| 'studiobyai21labs'
	| 'supabase'
	| 'supadata'
	| 'suzanne'
	| 'surf'
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
	| 'tinypng'
	| 'tinyfish'
	| 'tinyurl'
	| 'tisane'
	| 'todoist'
	| 'toggl'
	| 'tokenmetrics'
	| 'tpscheck'
	| 'trello'
	| 'tripadvisor'
	| 'turso'
	| 'twentyonerisk'
	| 'twilio'
	| 'twitter'
	| 'twitterapiio'
	| 'twochat'
	| 'typeform'
	| 'unione'
	| 'uniswapapi'
	| 'updownio'
	| 'uploadcare'
	| 'vapi'
	| 'vaquill'
	| 'vercel'
	| 'veriphone'
	| 'vestaboard'
	| 'waboxapp'
	| 'wakatime'
	| 'webflow'
	| 'webscrapingai'
	| 'webvizio'
	| 'whatsapp'
	| 'whautomate'
	| 'whoisfreaks'
	| 'winstonai'
	| 'witai'
	| 'wix'
	| 'wiza'
	| 'workday'
	| 'workiom'
	| 'worldnewsapi'
	| 'writer'
	| 'xero'
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

export type AuthTypes =
	| 'oauth_2'
	| 'api_key'
	| 'bot_token'
	| 'managed'
	| 'managed_pricing';

export type PickAuth<T extends AuthTypes> = T;
