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
	'anyapi',
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
	'browserless',
	'browsertool',
	'browseruse',
	'bubble',
	'bugsnag',
	'buildkite',
	'builtwith',
	'bunnycdn',
	'bytedance',
	'byteforms',
	'cal',
	'calendly',
	'callingly',
	'callpage',
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
	'clicksend',
	'clickup',
	'clientary',
	'clockify',
	'cloro',
	'close',
	'cloudcart',
	'cloudflare',
	'cloudflareapikey',
	'cloudinary',
	'coassemble',
	'coda',
	'codacy',
	'codeinterpreter',
	'codereadr',
	'cody',
	'coinbase',
	'coinmarketcal',
	'coinmarketcap',
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
	'desktime',
	'devinmcp',
	'diffbot',
	'digitalocean',
	'discord',
	'dnsfilter',
	'dockerhub',
	'docmosis',
	'docsumo',
	'docupost',
	'docusign',
	'dodopayments',
	'doppler',
	'dovetail',
	'dreamstudio',
	'dripcel',
	'dropbox',
	'dropboxsign',
	'dynapictures',
	'elevenlabs',
	'emailoctopus',
	'emelia',
	'enginemailer',
	'enigma',
	'epicgames',
	'esignatures',
	'esputnik',
	'eventzilla',
	'everhour',
	'exa',
	'excel',
	'exist',
	'extractaai',
	'facebook',
	'fal',
	'faraday',
	'fidel',
	'figma',
	'filevine',
	'filloutforms',
	'finerworks',
	'firecrawl',
	'fireflies',
	'fixer',
	'flexisign',
	'flutterwave',
	'followupboss',
	'formbricks',
	'foursquare',
	'fundable',
	'gemini',
	'giphy',
	'github',
	'gitlab',
	'gladia',
	'gmail',
	'gmicloud',
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
	'gumroad',
	'habitica',
	'hackernews',
	'harvest',
	'hashnode',
	'here',
	'heygen',
	'higgsfield',
	'hookdeck',
	'htmltoimage',
	'hubspot',
	'huggingface',
	'humanitix',
	'hunterio',
	'imagior',
	'imejisio',
	'imgbb',
	'inboxkit',
	'insightoai',
	'instagram',
	'instantly',
	'intercom',
	'jigsawstack',
	'jira',
	'kaggle',
	'keenable',
	'kibana',
	'klaviyo',
	'kling',
	'leexi',
	'lever',
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
	'mem0',
	'merriamwebsterdict',
	'minimax',
	'miro',
	'missive',
	'monday',
	'mrscraper',
	'neon',
	'netsuite',
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
	'opensea',
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
	'qdrant',
	'quaderno',
	'razorpay',
	'reamaze',
	'recallai',
	'reddit',
	'reducto',
	'remoet',
	'removebg',
	'render',
	'replicate',
	'replicate',
	'replyio',
	'resend',
	'retailed',
	'retellai',
	'revai',
	'rootly',
	'runpod',
	'salesflare',
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
	'servicenow',
	'sharepoint',
	'slack',
	'slackbot',
	'snapchat',
	'snowflake',
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
	'surf',
	'suzanne',
	'synthflowai',
	'tally',
	'tavily',
	'tavilymcp',
	'teams',
	'telegram',
	'textrazor',
	'ticketmaster',
	'ticktick',
	'tikhub',
	'timecamp',
	'timelink',
	'timely',
	'tinyfish',
	'tinypng',
	'tinyurl',
	'tisane',
	'todoist',
	'toggl',
	'tokenmetrics',
	'tpscheck',
	'trello',
	'tripadvisor',
	'turbotpipes',
	'turso',
	'twentyonerisk',
	'twilio',
	'twitter',
	'twitterapiio',
	'twochat',
	'typeform',
	'typesafe',
	'unione',
	'unipile',
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
	'woodpeckerco',
	'workable',
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
	'zohodesk',
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
	anyapi: 'AnyAPI',
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
	browserless: 'Browserless',
	browsertool: 'Browser Tool',
	browseruse: 'Browser Use',
	bubble: 'Bubble',
	bugsnag: 'BugSnag',
	buildkite: 'Buildkite',
	builtwith: 'BuiltWith',
	bunnycdn: 'Bunnycdn',
	bytedance: 'ByteDance',
	byteforms: 'ByteForms',
	cal: 'Cal',
	calendly: 'Calendly',
	callingly: 'Callingly',
	callpage: 'CallPage',
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
	clicksend: 'ClickSend',
	clickup: 'ClickUp',
	clientary: 'Clientary',
	clockify: 'Clockify',
	cloro: 'cloro',
	close: 'Close',
	cloudcart: 'CloudCart',
	cloudflare: 'Cloudflare',
	cloudflareapikey: 'Cloudflare API Key',
	cloudinary: 'Cloudinary',
	coassemble: 'Coassemble',
	coda: 'Coda',
	codacy: 'Codacy',
	codeinterpreter: 'CodeInterpreter',
	codereadr: 'CodeREADr',
	cody: 'Cody',
	coinbase: 'Coinbase',
	coinmarketcal: 'Coinmarketcal',
	coinmarketcap: 'CoinMarketCap',
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
	desktime: 'DeskTime',
	devinmcp: 'Devin MCP',
	diffbot: 'Diffbot',
	digitalocean: 'DigitalOcean',
	discord: 'Discord',
	dnsfilter: 'DNSFilter',
	dockerhub: 'Docker Hub',
	docmosis: 'Docmosis',
	docsumo: 'Docsumo',
	docupost: 'Docupost',
	docusign: 'DocuSign',
	dodopayments: 'Dodo Payments',
	doppler: 'Doppler',
	dovetail: 'Dovetail',
	dreamstudio: 'DreamStudio',
	dripcel: 'Dripcel',
	dropbox: 'Dropbox',
	dropboxsign: 'Dropbox Sign',
	dynapictures: 'Dynapictures',
	elevenlabs: 'ElevenLabs',
	emailoctopus: 'EmailOctopus',
	emelia: 'Emelia',
	enginemailer: 'Enginemailer',
	enigma: 'Enigma',
	epicgames: 'Epic Games',
	esignatures: 'eSignatures',
	esputnik: 'eSputnik',
	eventzilla: 'Eventzilla',
	everhour: 'Everhour',
	exa: 'Exa',
	excel: 'Excel',
	exist: 'Exist',
	extractaai: 'Extracta.ai',
	facebook: 'Facebook',
	fal: 'fal',
	faraday: 'Faraday',
	fidel: 'Fidel',
	figma: 'Figma',
	filevine: 'Filevine',
	filloutforms: 'FilloutForms',
	finerworks: 'FinerWorks',
	firecrawl: 'Firecrawl',
	fireflies: 'Fireflies',
	fixer: 'Fixer',
	flexisign: 'Flexisign',
	flutterwave: 'Flutterwave',
	followupboss: 'Follow Up Boss',
	formbricks: 'Formbricks',
	foursquare: 'Foursquare',
	fundable: 'Fundable',
	gemini: 'Gemini',
	giphy: 'Giphy',
	github: 'GitHub',
	gitlab: 'GitLab',
	gladia: 'Gladia',
	gmail: 'Gmail',
	gmicloud: 'GMI Cloud',
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
	gumroad: 'Gumroad',
	habitica: 'Habitica',
	hackernews: 'Hacker News',
	harvest: 'Harvest',
	hashnode: 'Hashnode',
	here: 'HERE',
	heygen: 'HeyGen',
	higgsfield: 'Higgsfield',
	hookdeck: 'Hookdeck',
	htmltoimage: 'HtmlToImage',
	hubspot: 'HubSpot',
	huggingface: 'Hugging Face',
	humanitix: 'Humanitix',
	hunterio: 'Hunter.io',
	imagior: 'Imagior',
	imejisio: 'Imejis.io',
	imgbb: 'ImgBB',
	inboxkit: 'InboxKit',
	insightoai: 'Insighto.ai',
	instagram: 'Instagram',
	instantly: 'Instantly',
	intercom: 'Intercom',
	jigsawstack: 'JigsawStack',
	jira: 'Jira',
	kaggle: 'Kaggle',
	keenable: 'Keenable',
	kibana: 'Kibana',
	klaviyo: 'Klaviyo',
	kling: 'Kling',
	leexi: 'Leexi',
	lever: 'Lever',
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
	mem0: 'Mem0',
	merriamwebsterdict: 'Merriam-Webster Dictionary',
	minimax: 'MiniMax',
	miro: 'Miro',
	missive: 'Missive',
	monday: 'Monday',
	mrscraper: 'MrScraper',
	neon: 'Neon',
	netsuite: 'NetSuite',
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
	opensea: 'OpenSea',
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
	qdrant: 'Qdrant',
	quaderno: 'Quaderno',
	razorpay: 'Razorpay',
	reamaze: 'Re:amaze',
	recallai: 'Recall.ai',
	reddit: 'Reddit',
	reducto: 'Reducto',
	remoet: 'Remoet',
	removebg: 'remove.bg',
	render: 'Render',
	replicate: 'Replicate',
	replyio: 'Reply.io',
	resend: 'Resend',
	retailed: 'Retailed',
	retellai: 'Retell AI',
	revai: 'RevAI',
	rootly: 'Rootly',
	runpod: 'RunPod',
	salesflare: 'Salesflare',
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
	servicenow: 'ServiceNow',
	sharepoint: 'SharePoint',
	slack: 'Slack',
	slackbot: 'Slackbot',
	snapchat: 'Snapchat',
	snowflake: 'Snowflake',
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
	surf: 'Surf',
	suzanne: 'Suzanne',
	synthflowai: 'Synthflow AI',
	tally: 'Tally',
	tavily: 'Tavily',
	tavilymcp: 'Tavily MCP',
	teams: 'Teams',
	telegram: 'Telegram',
	textrazor: 'TextRazor',
	ticketmaster: 'Ticketmaster',
	ticktick: 'TickTick',
	tikhub: 'TikHub',
	timecamp: 'TimeCamp',
	timelink: 'Timelink',
	timely: 'Timely',
	tinyfish: 'TinyFish',
	tinypng: 'TinyPNG',
	tinyurl: 'TinyURL',
	tisane: 'Tisane',
	todoist: 'Todoist',
	toggl: 'Toggl',
	tokenmetrics: 'Token Metrics',
	tpscheck: 'TPSCheck',
	trello: 'Trello',
	tripadvisor: 'Tripadvisor',
	turbotpipes: 'Turbot Pipes',
	turso: 'Turso',
	twentyonerisk: 'TwentyOneRisk',
	twilio: 'Twilio',
	twitter: 'Twitter',
	twitterapiio: 'Twitter API IO',
	twochat: 'TwoChat',
	typeform: 'Typeform',
	typesafe: 'TypeSafe',
	unione: 'Unione',
	unipile: 'Unipile',
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
	woodpeckerco: 'Woodpecker Co',
	workable: 'Workable',
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
	zohodesk: 'Zoho Desk',
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
	| 'anyapi'
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
	| 'browseruse'
	| 'bubble'
	| 'bugsnag'
	| 'buildkite'
	| 'bunnycdn'
	| 'bytedance'
	| 'byteforms'
	| 'cal'
	| 'calendly'
	| 'callingly'
	| 'callpage'
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
	| 'clicksend'
	| 'clickup'
	| 'clientary'
	| 'clockify'
	| 'cloro'
	| 'close'
	| 'cloudcart'
	| 'cloudflare'
	| 'cloudflareapikey'
	| 'cloudinary'
	| 'coassemble'
	| 'coda'
	| 'codacy'
	| 'codeinterpreter'
	| 'codereadr'
	| 'cody'
	| 'coinbase'
	| 'coinmarketcal'
	| 'coinmarketcap'
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
	| 'desktime'
	| 'devinmcp'
	| 'diffbot'
	| 'digitalocean'
	| 'discord'
	| 'dockerhub'
	| 'docmosis'
	| 'docsumo'
	| 'docupost'
	| 'docusign'
	| 'dodopayments'
	| 'doppler'
	| 'dovetail'
	| 'dreamstudio'
	| 'dripcel'
	| 'dropbox'
	| 'dropboxsign'
	| 'dynapictures'
	| 'elevenlabs'
	| 'emailoctopus'
	| 'emelia'
	| 'enginemailer'
	| 'enigma'
	| 'epicgames'
	| 'esignatures'
	| 'esputnik'
	| 'eventzilla'
	| 'everhour'
	| 'exa'
	| 'excel'
	| 'exist'
	| 'extractaai'
	| 'facebook'
	| 'fal'
	| 'faraday'
	| 'fidel'
	| 'figma'
	| 'filevine'
	| 'filloutforms'
	| 'finerworks'
	| 'firecrawl'
	| 'fireflies'
	| 'fixer'
	| 'flexisign'
	| 'flutterwave'
	| 'followupboss'
	| 'formbricks'
	| 'foursquare'
	| 'fundable'
	| 'gemini'
	| 'giphy'
	| 'github'
	| 'gitlab'
	| 'gladia'
	| 'gmail'
	| 'gmicloud'
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
	| 'gumroad'
	| 'habitica'
	| 'hackernews'
	| 'harvest'
	| 'hashnode'
	| 'here'
	| 'heygen'
	| 'higgsfield'
	| 'hookdeck'
	| 'htmltoimage'
	| 'hubspot'
	| 'huggingface'
	| 'humanitix'
	| 'hunterio'
	| 'imagior'
	| 'imejisio'
	| 'imgbb'
	| 'inboxkit'
	| 'insightoai'
	| 'instagram'
	| 'instantly'
	| 'intercom'
	| 'jigsawstack'
	| 'jira'
	| 'kaggle'
	| 'keenable'
	| 'kibana'
	| 'klaviyo'
	| 'kling'
	| 'leexi'
	| 'lever'
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
	| 'mem0'
	| 'merriamwebsterdict'
	| 'minimax'
	| 'miro'
	| 'missive'
	| 'monday'
	| 'mrscraper'
	| 'neon'
	| 'netsuite'
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
	| 'opensea'
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
	| 'qdrant'
	| 'quaderno'
	| 'razorpay'
	| 'reamaze'
	| 'recallai'
	| 'reddit'
	| 'reducto'
	| 'remoet'
	| 'removebg'
	| 'render'
	| 'replicate'
	| 'replicate'
	| 'replyio'
	| 'resend'
	| 'retailed'
	| 'retellai'
	| 'revai'
	| 'rootly'
	| 'runpod'
	| 'salesflare'
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
	| 'servicenow'
	| 'sharepoint'
	| 'slack'
	| 'slackbot'
	| 'snapchat'
	| 'snowflake'
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
	| 'surf'
	| 'suzanne'
	| 'synthflowai'
	| 'tally'
	| 'tavily'
	| 'tavilymcp'
	| 'teams'
	| 'telegram'
	| 'textrazor'
	| 'ticketmaster'
	| 'ticktick'
	| 'tikhub'
	| 'timecamp'
	| 'timelink'
	| 'timely'
	| 'tinyfish'
	| 'tinypng'
	| 'tinyurl'
	| 'tisane'
	| 'todoist'
	| 'toggl'
	| 'tokenmetrics'
	| 'tpscheck'
	| 'trello'
	| 'tripadvisor'
	| 'turbotpipes'
	| 'turso'
	| 'twentyonerisk'
	| 'twilio'
	| 'twitter'
	| 'twitterapiio'
	| 'twochat'
	| 'typeform'
	| 'typesafe'
	| 'unione'
	| 'unipile'
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
	| 'woodpeckerco'
	| 'workable'
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
	| 'zohodesk'
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
