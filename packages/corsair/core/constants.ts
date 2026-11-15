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
	'adyntel',
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
	'cloudconvert',
	'cloudflare',
	'cloudflareapikey',
	'cloudflarebrowserrendering',
	'cloudinary',
	'cloudlayer',
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
	'commcare',
	'companyenrich',
	'composio',
	'confluence',
	'connecteam',
	'contactout',
	'contentfulgraphql',
	'contextdev',
	'contextsevenmcp',
	'conversiontools',
	'convex',
	'convoloai',
	'cosmic',
	'countdownapi',
	'craftmypdf',
	'crowterminal',
	'currentsapi',
	'cursor',
	'customerio',
	'customgpt',
	'customjs',
	'cuttly',
	'dadataru',
	'daffy',
	'databox',
	'databricks',
	'datadog',
	'dataforseo',
	'datarobot',
	'deepseek',
	'demio',
	'deployhq',
	'desktime',
	'devinmcp',
	'dialpad',
	'diffbot',
	'digicert',
	'digitalocean',
	'discord',
	'dnsfilter',
	'dockerhub',
	'docmosis',
	'docsumo',
	'documenso',
	'docupost',
	'docusign',
	'dodopayments',
	'doppler',
	'dovetail',
	'dreamstudio',
	'dripcel',
	'dropbox',
	'dropboxsign',
	'dropcontact',
	'dynapictures',
	'e2b',
	'elevenlabs',
	'elorus',
	'emailoctopus',
	'emelia',
	'encodian',
	'endorsal',
	'enginemailer',
	'enigma',
	'epicgames',
	'esignatures',
	'esputnik',
	'eventbrite',
	'eventee',
	'eventzilla',
	'everhour',
	'exa',
	'excel',
	'exist',
	'extractaai',
	'facebook',
	'fal',
	'faraday',
	'fathom',
	'felt',
	'fibery',
	'fidel',
	'figma',
	'filevine',
	'filloutforms',
	'finage',
	'finerworks',
	'finmei',
	'fireberry',
	'firecrawl',
	'fireflies',
	'fixer',
	'flexisign',
	'flutterwave',
	'fluxguard',
	'folk',
	'followupboss',
	'fomo',
	'formbricks',
	'formdesk',
	'foursquare',
	'fundable',
	'gemini',
	'gagelist',
	'gamma',
	'gatherup',
	'genderapi',
	'genderapiio',
	'genderize',
	'geoapify',
	'giphy',
	'github',
	'gitlab',
	'gladia',
	'gmail',
	'gmicloud',
	'gong',
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
	'googleslides',
	'grafana',
	'griptape',
	'groqcloud',
	'gumroad',
	'habitica',
	'hackernews',
	'happyscribe',
	'harvest',
	'hashnode',
	'here',
	'heygen',
	'heyy',
	'higgsfield',
	'hookdeck',
	'htmltoimage',
	'hubspot',
	'huggingface',
	'humanitix',
	'hunterio',
	'imagekit',
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
	'kadoa',
	'kaggle',
	'kanbanize',
	'keen',
	'keenable',
	'keyword',
	'kibana',
	'kickbox',
	'kit',
	'klaviyo',
	'klazify',
	'kling',
	'knack',
	'kofi',
	'kontentai',
	'krakenio',
	'leexi',
	'leiga',
	'lemonsqueezy',
	'lever',
	'linear',
	'linguapop',
	'linkedin',
	'litescrape',
	'loyverse',
	'magichour',
	'mailboxlayer',
	'mailcheck',
	'mailchimp',
	'mailsso',
	'mailtrap',
	'mapbox',
	'marketstack',
	'melo',
	'mem0',
	'memberspot',
	'merriamwebsterdict',
	'minimax',
	'miro',
	'missive',
	'mixmax',
	'monday',
	'mrscraper',
	'nanonets',
	'neon',
	'netsuite',
	'nextdns',
	'northflank',
	'notion',
	'nutshell',
	'ocrspace',
	'ocrwebservice',
	'octen',
	'ollama',
	'onedesk',
	'onedrive',
	'onepassword',
	'openai',
	'opengraph',
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
	'placid',
	'plain',
	'ploid',
	'posthog',
	'postman',
	'prisma',
	'pushbullet',
	'qdrant',
	'quaderno',
	'radar',
	'ragic',
	'raisely',
	'ramp',
	'razorpay',
	'realphonevalidation',
	'reamaze',
	'route4me',
	'recallai',
	'recruitee',
	'redcircle',
	'reddit',
	'reducto',
	'referralrock',
	'refiner',
	'remarkety',
	'remoet',
	'remoteretrieval',
	'removebg',
	'render',
	'renderform',
	'rentman',
	'repairshopr',
	'replicate',
	'replyio',
	'resend',
	'respondio',
	'retailed',
	'retellai',
	'retently',
	'revai',
	'revolt',
	'ritekit',
	'roam',
	'roboflow',
	'rocketlane',
	'rocketreach',
	'rollbar',
	'rootly',
	'rosette',
	'rudderstacktransform',
	'runpod',
	'salesflare',
	'salesforce',
	'sanity',
	'saperly',
	'sapsuccessfactors',
	'satismeter',
	'scaleai',
	'scrapedo',
	'scrapegraphai',
	'scrapingant',
	'search1api',
	'securitytrails',
	'semanticscholar',
	'sendgrid',
	'sentry',
	'serpapi',
	'servicenow',
	'sharepoint',
	'shippo',
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
	'taggun',
	'tally',
	'tavily',
	'tavilymcp',
	'teamcamp',
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
	'tldv',
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
	'unisender',
	'uniswapapi',
	'updownio',
	'uploadcare',
	'u301',
	'uptimerobot',
	'userflow',
	'userlist',
	'vapi',
	'vaquill',
	'vectorshift',
	'vercel',
	'veriphone',
	'vestaboard',
	'virustotal',
	'waboxapp',
	'wachete',
	'waiverfile',
	'wakatime',
	'wati',
	'webex',
	'webflow',
	'webscraperio',
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
	'worksnaps',
	'worldnewsapi',
	'wrike',
	'writer',
	'xero',
	'xquik',
	'yandex',
	'ynab',
	'youcom',
	'youtube',
	'zendesk',
	'zenrows',
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
	adyntel: 'Adyntel',
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
	cloudconvert: 'CloudConvert',
	cloudflare: 'Cloudflare',
	cloudflareapikey: 'Cloudflare API Key',
	cloudflarebrowserrendering: 'Cloudflare Browser Run',
	cloudinary: 'Cloudinary',
	cloudlayer: 'Cloudlayer',
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
	commcare: 'CommCare',
	companyenrich: 'CompanyEnrich',
	composio: 'Composio',
	confluence: 'Confluence',
	connecteam: 'Connecteam',
	contactout: 'ContactOut',
	contentfulgraphql: 'Contentful GraphQL',
	contextdev: 'Context.dev',
	contextsevenmcp: 'Context7',
	conversiontools: 'Conversion Tools',
	convex: 'Convex',
	convoloai: 'ConvoloAi',
	cosmic: 'Cosmic',
	countdownapi: 'Countdown API',
	craftmypdf: 'CraftMyPDF',
	crowterminal: 'CrowTerminal',
	currentsapi: 'CurrentsApi',
	cursor: 'Cursor',
	customerio: 'Customer.io',
	customgpt: 'CustomGPT',
	customjs: 'CustomJS',
	cuttly: 'Cutt.ly',
	dadataru: 'Dadataru',
	daffy: 'Daffy',
	databox: 'Databox',
	databricks: 'Databricks',
	datadog: 'Datadog',
	dataforseo: 'DataForSEO',
	datarobot: 'DataRobot',
	deepseek: 'DeepSeek',
	demio: 'Demio',
	deployhq: 'DeployHQ',
	desktime: 'DeskTime',
	devinmcp: 'Devin MCP',
	dialpad: 'Dialpad',
	diffbot: 'Diffbot',
	digicert: 'DigiCert',
	digitalocean: 'DigitalOcean',
	discord: 'Discord',
	dnsfilter: 'DNSFilter',
	dockerhub: 'Docker Hub',
	docmosis: 'Docmosis',
	docsumo: 'Docsumo',
	documenso: 'Documenso',
	docupost: 'Docupost',
	docusign: 'DocuSign',
	dodopayments: 'Dodo Payments',
	doppler: 'Doppler',
	dovetail: 'Dovetail',
	dreamstudio: 'DreamStudio',
	dripcel: 'Dripcel',
	dropbox: 'Dropbox',
	dropboxsign: 'Dropbox Sign',
	dropcontact: 'Dropcontact',
	dynapictures: 'Dynapictures',
	e2b: 'E2B',
	elevenlabs: 'ElevenLabs',
	elorus: 'Elorus',
	emailoctopus: 'EmailOctopus',
	emelia: 'Emelia',
	encodian: 'Encodian',
	endorsal: 'Endorsal',
	enginemailer: 'Enginemailer',
	enigma: 'Enigma',
	epicgames: 'Epic Games',
	esignatures: 'eSignatures',
	esputnik: 'eSputnik',
	eventbrite: 'Eventbrite',
	eventee: 'Eventee',
	eventzilla: 'Eventzilla',
	everhour: 'Everhour',
	exa: 'Exa',
	excel: 'Excel',
	exist: 'Exist',
	extractaai: 'Extracta.ai',
	facebook: 'Facebook',
	fal: 'fal',
	faraday: 'Faraday',
	fathom: 'Fathom',
	felt: 'Felt',
	fibery: 'Fibery',
	fidel: 'Fidel',
	figma: 'Figma',
	filevine: 'Filevine',
	filloutforms: 'FilloutForms',
	finage: 'Finage',
	finerworks: 'FinerWorks',
	finmei: 'Finmei',
	fireberry: 'Fireberry',
	firecrawl: 'Firecrawl',
	fireflies: 'Fireflies',
	fixer: 'Fixer',
	flexisign: 'Flexisign',
	flutterwave: 'Flutterwave',
	fluxguard: 'Fluxguard',
	folk: 'Folk',
	followupboss: 'Follow Up Boss',
	fomo: 'Fomo',
	formbricks: 'Formbricks',
	formdesk: 'Formdesk',
	foursquare: 'Foursquare',
	fundable: 'Fundable',
	gemini: 'Gemini',
	gagelist: 'Gagelist',
	gamma: 'Gamma',
	gatherup: 'GatherUp',
	genderapi: 'Gender API',
	genderapiio: 'GenderAPI.io',
	genderize: 'Genderize',
	geoapify: 'Geoapify',
	giphy: 'Giphy',
	github: 'GitHub',
	gitlab: 'GitLab',
	gladia: 'Gladia',
	gmail: 'Gmail',
	gmicloud: 'GMI Cloud',
	gong: 'Gong',
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
	googleslides: 'Google Slides',
	grafana: 'Grafana',
	griptape: 'Griptape',
	groqcloud: 'GroqCloud',
	gumroad: 'Gumroad',
	habitica: 'Habitica',
	hackernews: 'Hacker News',
	happyscribe: 'Happy Scribe',
	harvest: 'Harvest',
	hashnode: 'Hashnode',
	here: 'HERE',
	heygen: 'HeyGen',
	heyy: 'Heyy',
	higgsfield: 'Higgsfield',
	hookdeck: 'Hookdeck',
	htmltoimage: 'HtmlToImage',
	hubspot: 'HubSpot',
	huggingface: 'Hugging Face',
	humanitix: 'Humanitix',
	hunterio: 'Hunter.io',
	imagekit: 'ImageKit',
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
	kadoa: 'Kadoa',
	kaggle: 'Kaggle',
	kanbanize: 'Kanbanize',
	keen: 'Keen',
	keenable: 'Keenable',
	keyword: 'Keyword',
	kibana: 'Kibana',
	kickbox: 'Kickbox',
	kit: 'Kit',
	klaviyo: 'Klaviyo',
	klazify: 'Klazify',
	kling: 'Kling',
	knack: 'Knack',
	kofi: 'Ko-fi',
	kontentai: 'Kontent.ai',
	krakenio: 'Kraken.io',
	leexi: 'Leexi',
	leiga: 'Leiga',
	lemonsqueezy: 'Lemon Squeezy',
	lever: 'Lever',
	linear: 'Linear',
	linguapop: 'Linguapop',
	linkedin: 'LinkedIn',
	litescrape: 'LiteScrape',
	loyverse: 'Loyverse',
	magichour: 'Magic Hour',
	mailboxlayer: 'MailboxLayer',
	mailcheck: 'Mailcheck',
	mailchimp: 'Mailchimp',
	mailsso: 'Mails.so',
	mailtrap: 'Mailtrap',
	mapbox: 'Mapbox',
	marketstack: 'Marketstack',
	melo: 'Melo',
	mem0: 'Mem0',
	memberspot: 'MemberSpot',
	merriamwebsterdict: 'Merriam-Webster Dictionary',
	minimax: 'MiniMax',
	miro: 'Miro',
	missive: 'Missive',
	mixmax: 'Mixmax',
	monday: 'Monday',
	mrscraper: 'MrScraper',
	nanonets: 'Nanonets',
	neon: 'Neon',
	netsuite: 'NetSuite',
	nextdns: 'NextDNS',
	northflank: 'Northflank',
	notion: 'Notion',
	nutshell: 'Nutshell',
	ocrspace: 'OCR.space',
	ocrwebservice: 'OcrWebService',
	octen: 'Octen',
	ollama: 'Ollama',
	onedesk: 'OneDesk',
	onedrive: 'OneDrive',
	onepassword: '1Password',
	openai: 'OpenAI',
	opengraph: 'OpenGraph.io',
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
	placid: 'Placid',
	plain: 'Plain',
	ploid: 'Ploid',
	posthog: 'PostHog',
	postman: 'Postman',
	prisma: 'Prisma',
	pushbullet: 'Pushbullet',
	qdrant: 'Qdrant',
	quaderno: 'Quaderno',
	radar: 'Radar',
	ragic: 'Ragic',
	raisely: 'Raisely',
	ramp: 'Ramp',
	route4me: 'Route4Me',
	razorpay: 'Razorpay',
	realphonevalidation: 'RealPhoneValidation',
	reamaze: 'Re:amaze',
	recallai: 'Recall.ai',
	recruitee: 'Recruitee',
	redcircle: 'RedCircle API',
	reddit: 'Reddit',
	reducto: 'Reducto',
	referralrock: 'Referral Rock',
	refiner: 'Refiner',
	remarkety: 'Remarkety',
	remoet: 'Remoet',
	remoteretrieval: 'Remote Retrieval',
	removebg: 'remove.bg',
	render: 'Render',
	renderform: 'Renderform',
	rentman: 'Rentman',
	repairshopr: 'RepairShopr',
	replicate: 'Replicate',
	replyio: 'Reply.io',
	resend: 'Resend',
	respondio: 'respond.io',
	retailed: 'Retailed',
	retellai: 'Retell AI',
	retently: 'Retently',
	revai: 'RevAI',
	revolt: 'Revolt (Stoat)',
	ritekit: 'RiteKit',
	roam: 'Roam HQ',
	roboflow: 'Roboflow',
	rocketlane: 'Rocketlane',
	rocketreach: 'RocketReach',
	rollbar: 'Rollbar',
	rootly: 'Rootly',
	rosette: 'Rosette',
	rudderstacktransform: 'RudderStack Transformations',
	runpod: 'RunPod',
	salesflare: 'Salesflare',
	salesforce: 'Salesforce',
	sanity: 'Sanity',
	saperly: 'Saperly',
	sapsuccessfactors: 'SAP SuccessFactors',
	satismeter: 'SatisMeter',
	scaleai: 'Scale AI',
	scrapedo: 'Scrape.do',
	scrapegraphai: 'ScrapeGraphAI',
	scrapingant: 'ScrapingAnt',
	search1api: 'Search1API',
	securitytrails: 'SecurityTrails',
	semanticscholar: 'Semantic Scholar',
	sendgrid: 'SendGrid',
	sentry: 'Sentry',
	serpapi: 'Serpapi',
	servicenow: 'ServiceNow',
	sharepoint: 'SharePoint',
	shippo: 'Shippo',
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
	taggun: 'Taggun',
	tally: 'Tally',
	tavily: 'Tavily',
	tavilymcp: 'Tavily MCP',
	teamcamp: 'Teamcamp',
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
	tldv: 'tl;dv',
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
	unisender: 'Unisender',
	uniswapapi: 'Uniswap',
	updownio: 'Updown.io',
	uploadcare: 'Uploadcare',
	u301: 'U301',
	uptimerobot: 'UptimeRobot',
	userflow: 'Userflow',
	userlist: 'Userlist',
	vapi: 'Vapi',
	vaquill: 'Vaquill',
	vectorshift: 'VectorShift',
	vercel: 'Vercel',
	veriphone: 'Veriphone',
	vestaboard: 'Vestaboard',
	virustotal: 'VirusTotal',
	waboxapp: 'Waboxapp',
	wachete: 'Wachete',
	waiverfile: 'WaiverFile',
	wakatime: 'WakaTime',
	wati: 'Wati',
	webex: 'Webex',
	webflow: 'Webflow',
	webscraperio: 'WebScraper.io',
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
	worksnaps: 'Worksnaps',
	worldnewsapi: 'World News API',
	wrike: 'Wrike',
	writer: 'Writer',
	xero: 'Xero',
	xquik: 'XQuik',
	yandex: 'Yandex',
	ynab: 'YNAB',
	youcom: 'You.com',
	youtube: 'YouTube',
	zendesk: 'Zendesk',
	zenrows: 'ZenRows',
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
	| 'adyntel'
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
	| 'builtwith'
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
	| 'cloudconvert'
	| 'cloudflare'
	| 'cloudflareapikey'
	| 'cloudflarebrowserrendering'
	| 'cloudinary'
	| 'cloudlayer'
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
	| 'commcare'
	| 'companyenrich'
	| 'composio'
	| 'confluence'
	| 'connecteam'
	| 'contactout'
	| 'contentfulgraphql'
	| 'contextdev'
	| 'contextsevenmcp'
	| 'conversiontools'
	| 'convex'
	| 'convoloai'
	| 'cosmic'
	| 'countdownapi'
	| 'craftmypdf'
	| 'crowterminal'
	| 'currentsapi'
	| 'cursor'
	| 'customerio'
	| 'customgpt'
	| 'customjs'
	| 'cuttly'
	| 'dadataru'
	| 'daffy'
	| 'databox'
	| 'databricks'
	| 'datadog'
	| 'dataforseo'
	| 'datarobot'
	| 'deepseek'
	| 'demio'
	| 'deployhq'
	| 'desktime'
	| 'devinmcp'
	| 'dialpad'
	| 'diffbot'
	| 'digicert'
	| 'digitalocean'
	| 'discord'
	| 'dnsfilter'
	| 'dockerhub'
	| 'docmosis'
	| 'docsumo'
	| 'documenso'
	| 'docupost'
	| 'docusign'
	| 'dodopayments'
	| 'doppler'
	| 'dovetail'
	| 'dreamstudio'
	| 'dripcel'
	| 'dropbox'
	| 'dropboxsign'
	| 'dropcontact'
	| 'dynapictures'
	| 'e2b'
	| 'elevenlabs'
	| 'elorus'
	| 'emailoctopus'
	| 'emelia'
	| 'encodian'
	| 'endorsal'
	| 'enginemailer'
	| 'enigma'
	| 'epicgames'
	| 'esignatures'
	| 'esputnik'
	| 'eventbrite'
	| 'eventee'
	| 'eventzilla'
	| 'everhour'
	| 'exa'
	| 'excel'
	| 'exist'
	| 'extractaai'
	| 'facebook'
	| 'fal'
	| 'faraday'
	| 'fathom'
	| 'felt'
	| 'fibery'
	| 'fidel'
	| 'figma'
	| 'filevine'
	| 'filloutforms'
	| 'finage'
	| 'finerworks'
	| 'finmei'
	| 'fireberry'
	| 'firecrawl'
	| 'fireflies'
	| 'fixer'
	| 'flexisign'
	| 'flutterwave'
	| 'fluxguard'
	| 'folk'
	| 'followupboss'
	| 'fomo'
	| 'formbricks'
	| 'formdesk'
	| 'foursquare'
	| 'fundable'
	| 'gemini'
	| 'gagelist'
	| 'gamma'
	| 'gatherup'
	| 'genderapi'
	| 'genderapiio'
	| 'genderize'
	| 'geoapify'
	| 'giphy'
	| 'github'
	| 'gitlab'
	| 'gladia'
	| 'gmail'
	| 'gmicloud'
	| 'gong'
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
	| 'googleslides'
	| 'grafana'
	| 'griptape'
	| 'groqcloud'
	| 'gumroad'
	| 'habitica'
	| 'hackernews'
	| 'happyscribe'
	| 'harvest'
	| 'hashnode'
	| 'here'
	| 'heygen'
	| 'heyy'
	| 'higgsfield'
	| 'hookdeck'
	| 'htmltoimage'
	| 'hubspot'
	| 'huggingface'
	| 'humanitix'
	| 'hunterio'
	| 'imagekit'
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
	| 'kadoa'
	| 'kaggle'
	| 'kanbanize'
	| 'keen'
	| 'keenable'
	| 'keyword'
	| 'kibana'
	| 'kickbox'
	| 'kit'
	| 'klaviyo'
	| 'klazify'
	| 'kling'
	| 'knack'
	| 'kofi'
	| 'kontentai'
	| 'krakenio'
	| 'leexi'
	| 'leiga'
	| 'lemonsqueezy'
	| 'lever'
	| 'linear'
	| 'linguapop'
	| 'linkedin'
	| 'litescrape'
	| 'loyverse'
	| 'magichour'
	| 'mailboxlayer'
	| 'mailcheck'
	| 'mailchimp'
	| 'mailsso'
	| 'mailtrap'
	| 'mapbox'
	| 'marketstack'
	| 'melo'
	| 'mem0'
	| 'memberspot'
	| 'merriamwebsterdict'
	| 'minimax'
	| 'miro'
	| 'missive'
	| 'mixmax'
	| 'monday'
	| 'mrscraper'
	| 'nanonets'
	| 'neon'
	| 'netsuite'
	| 'nextdns'
	| 'northflank'
	| 'notion'
	| 'nutshell'
	| 'ocrspace'
	| 'ocrwebservice'
	| 'octen'
	| 'ollama'
	| 'onedesk'
	| 'onedrive'
	| 'onepassword'
	| 'openai'
	| 'opengraph'
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
	| 'placid'
	| 'plain'
	| 'ploid'
	| 'posthog'
	| 'postman'
	| 'prisma'
	| 'pushbullet'
	| 'qdrant'
	| 'quaderno'
	| 'radar'
	| 'ragic'
	| 'raisely'
	| 'ramp'
	| 'razorpay'
	| 'realphonevalidation'
	| 'reamaze'
	| 'route4me'
	| 'recallai'
	| 'recruitee'
	| 'redcircle'
	| 'reddit'
	| 'reducto'
	| 'referralrock'
	| 'refiner'
	| 'remarkety'
	| 'remoet'
	| 'remoteretrieval'
	| 'removebg'
	| 'render'
	| 'renderform'
	| 'rentman'
	| 'repairshopr'
	| 'replicate'
	| 'replyio'
	| 'resend'
	| 'respondio'
	| 'retailed'
	| 'retellai'
	| 'retently'
	| 'revai'
	| 'revolt'
	| 'ritekit'
	| 'roam'
	| 'roboflow'
	| 'rocketlane'
	| 'rocketreach'
	| 'rollbar'
	| 'rootly'
	| 'rosette'
	| 'rudderstacktransform'
	| 'runpod'
	| 'salesflare'
	| 'salesforce'
	| 'sanity'
	| 'saperly'
	| 'sapsuccessfactors'
	| 'satismeter'
	| 'scaleai'
	| 'scrapedo'
	| 'scrapegraphai'
	| 'scrapingant'
	| 'search1api'
	| 'securitytrails'
	| 'semanticscholar'
	| 'sendgrid'
	| 'sentry'
	| 'serpapi'
	| 'servicenow'
	| 'sharepoint'
	| 'shippo'
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
	| 'taggun'
	| 'tally'
	| 'tavily'
	| 'tavilymcp'
	| 'teamcamp'
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
	| 'tldv'
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
	| 'unisender'
	| 'uniswapapi'
	| 'updownio'
	| 'uploadcare'
	| 'u301'
	| 'uptimerobot'
	| 'userflow'
	| 'userlist'
	| 'vapi'
	| 'vaquill'
	| 'vectorshift'
	| 'vercel'
	| 'veriphone'
	| 'vestaboard'
	| 'virustotal'
	| 'waboxapp'
	| 'wachete'
	| 'waiverfile'
	| 'wakatime'
	| 'wati'
	| 'webex'
	| 'webflow'
	| 'webscraperio'
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
	| 'worksnaps'
	| 'worldnewsapi'
	| 'wrike'
	| 'writer'
	| 'xero'
	| 'xquik'
	| 'yandex'
	| 'ynab'
	| 'youcom'
	| 'youtube'
	| 'zendesk'
	| 'zenrows'
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
