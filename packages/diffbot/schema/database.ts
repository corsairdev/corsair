import { z } from 'zod';

/**
 * DiffbotArticle — cached article entity.
 * Represents structured article data extracted by Diffbot Article API / Knowledge Graph.
 * @see https://docs.diffbot.com/docs/ontology/article
 */
export const DiffbotArticle = z.object({
	id: z.string().optional(),
	type: z.literal('article').optional(),
	pageUrl: z.string(),
	resolvedPageUrl: z.string().optional(),
	title: z.string().optional(),
	text: z.string().optional(),
	html: z.string().optional(),
	date: z.string().optional(),
	estimatedDate: z.string().optional(),
	author: z.string().optional(),
	authorUrl: z.string().optional(),
	siteName: z.string().optional(),
	humanLanguage: z.string().optional(),
	numPages: z.number().optional(),
	nextPage: z.string().optional(),
	nextPages: z.array(z.string()).optional(),
	images: z
		.array(
			z
				.object({
					url: z.string().optional(),
					title: z.string().optional(),
					naturalHeight: z.number().optional(),
					naturalWidth: z.number().optional(),
					width: z.number().optional(),
					height: z.number().optional(),
					primary: z.boolean().optional(),
					xpath: z.string().optional(),
				})
				.passthrough(),
		)
		.optional(),
	videos: z
		.array(
			z
				.object({
					url: z.string().optional(),
					title: z.string().optional(),
					duration: z.number().optional(),
				})
				.passthrough(),
		)
		.optional(),
	tags: z
		.array(
			z
				.object({
					id: z.number().optional(),
					label: z.string(),
					uri: z.string().optional(),
					score: z.number().optional(),
					types: z.array(z.string()).optional(),
				})
				.passthrough(),
		)
		.optional(),
	links: z.array(z.string()).optional(),
	breadcrumb: z
		.array(
			z.object({ link: z.string().optional(), name: z.string().optional() }),
		)
		.optional(),
	publisherRegion: z.string().optional(),
	publisherCountry: z.string().optional(),
	sentiment: z.number().optional(),
	diffbotUri: z.string().optional(),
	extractedAt: z.coerce.date().nullable().optional(),
});

export type DiffbotArticle = z.infer<typeof DiffbotArticle>;

/**
 * DiffbotProduct — cached product entity.
 * Represents structured product data extracted by Diffbot Product API / Knowledge Graph.
 * @see https://docs.diffbot.com/docs/ontology/product
 */
export const DiffbotProduct = z.object({
	id: z.string().optional(),
	type: z.literal('product').optional(),
	pageUrl: z.string(),
	resolvedPageUrl: z.string().optional(),
	title: z.string().optional(),
	text: z.string().optional(),
	brand: z.string().optional(),
	offerPrice: z.string().optional(),
	offerPriceDetails: z
		.object({
			amount: z.number().optional(),
			symbol: z.string().optional(),
			text: z.string().optional(),
		})
		.passthrough()
		.optional(),
	regularPrice: z.string().optional(),
	saveAmount: z.string().optional(),
	shippingAmount: z.string().optional(),
	availability: z.boolean().optional(),
	sku: z.string().optional(),
	mpn: z.string().optional(),
	upc: z.string().optional(),
	isbn: z.string().optional(),
	images: z
		.array(
			z
				.object({
					url: z.string().optional(),
					title: z.string().optional(),
					primary: z.boolean().optional(),
				})
				.passthrough(),
		)
		.optional(),
	offers: z
		.array(
			z
				.object({
					price: z.string().optional(),
					priceCurrency: z.string().optional(),
					seller: z.string().optional(),
					availability: z.boolean().optional(),
				})
				.passthrough(),
		)
		.optional(),
	colors: z.array(z.string()).optional(),
	humanLanguage: z.string().optional(),
	tags: z
		.array(
			z
				.object({
					label: z.string(),
					score: z.number().optional(),
				})
				.passthrough(),
		)
		.optional(),
	diffbotUri: z.string().optional(),
	extractedAt: z.coerce.date().nullable().optional(),
});

export type DiffbotProduct = z.infer<typeof DiffbotProduct>;

/**
 * DiffbotDiscussion — cached discussion thread entity.
 * @see https://docs.diffbot.com/docs/ontology/discussion
 */
export const DiffbotDiscussion = z.object({
	id: z.string().optional(),
	type: z.literal('discussion').optional(),
	pageUrl: z.string(),
	resolvedPageUrl: z.string().optional(),
	title: z.string().optional(),
	numPosts: z.number().optional(),
	numParticipants: z.number().optional(),
	participants: z.array(z.string()).optional(),
	rssUrl: z.string().optional(),
	posts: z
		.array(
			z
				.object({
					id: z.number().optional(),
					text: z.string().optional(),
					html: z.string().optional(),
					author: z.string().optional(),
					authorUrl: z.string().optional(),
					date: z.string().optional(),
					parentId: z.number().optional(),
					voteCount: z.number().optional(),
				})
				.passthrough(),
		)
		.optional(),
	humanLanguage: z.string().optional(),
	diffbotUri: z.string().optional(),
	extractedAt: z.coerce.date().nullable().optional(),
});

export type DiffbotDiscussion = z.infer<typeof DiffbotDiscussion>;

/**
 * DiffbotImage — cached image extraction entity.
 * @see https://docs.diffbot.com/docs/ontology/image
 */
export const DiffbotImage = z.object({
	id: z.string().optional(),
	type: z.literal('image').optional(),
	pageUrl: z.string(),
	resolvedPageUrl: z.string().optional(),
	url: z.string().optional(),
	title: z.string().optional(),
	naturalHeight: z.number().optional(),
	naturalWidth: z.number().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
	primary: z.boolean().optional(),
	xpath: z.string().optional(),
	attrTitle: z.string().optional(),
	attrAlt: z.string().optional(),
	caption: z.string().optional(),
	humanLanguage: z.string().optional(),
	diffbotUri: z.string().optional(),
	extractedAt: z.coerce.date().nullable().optional(),
});

export type DiffbotImage = z.infer<typeof DiffbotImage>;

/**
 * DiffbotVideo — cached video extraction entity.
 * @see https://docs.diffbot.com/docs/ontology/video
 */
export const DiffbotVideo = z.object({
	id: z.string().optional(),
	type: z.literal('video').optional(),
	pageUrl: z.string(),
	resolvedPageUrl: z.string().optional(),
	url: z.string().optional(),
	title: z.string().optional(),
	naturalHeight: z.number().optional(),
	naturalWidth: z.number().optional(),
	duration: z.number().optional(),
	viewCount: z.number().optional(),
	uploadDate: z.string().optional(),
	author: z.string().optional(),
	embedUrl: z.string().optional(),
	html: z.string().optional(),
	humanLanguage: z.string().optional(),
	diffbotUri: z.string().optional(),
	extractedAt: z.coerce.date().nullable().optional(),
});

export type DiffbotVideo = z.infer<typeof DiffbotVideo>;

/**
 * DiffbotEvent — cached event entity.
 * @see https://docs.diffbot.com/docs/ontology/event
 */
export const DiffbotEvent = z.object({
	id: z.string().optional(),
	type: z.literal('event').optional(),
	pageUrl: z.string(),
	resolvedPageUrl: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	location: z.string().optional(),
	venue: z
		.object({
			name: z.string().optional(),
			address: z.string().optional(),
			city: z.string().optional(),
			state: z.string().optional(),
			country: z.string().optional(),
		})
		.passthrough()
		.optional(),
	organizer: z.string().optional(),
	ticketUrl: z.string().optional(),
	humanLanguage: z.string().optional(),
	diffbotUri: z.string().optional(),
	extractedAt: z.coerce.date().nullable().optional(),
});

export type DiffbotEvent = z.infer<typeof DiffbotEvent>;

/**
 * DiffbotJob — cached job posting entity.
 * @see https://docs.diffbot.com/docs/ontology/jobpost
 */
export const DiffbotJob = z.object({
	id: z.string().optional(),
	type: z.literal('job').optional(),
	pageUrl: z.string(),
	resolvedPageUrl: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	company: z
		.object({
			name: z.string().optional(),
			url: z.string().optional(),
		})
		.passthrough()
		.optional(),
	locations: z.array(z.string()).optional(),
	employmentType: z.string().optional(),
	compensation: z
		.object({
			min: z.number().optional(),
			max: z.number().optional(),
			currency: z.string().optional(),
			interval: z.string().optional(),
		})
		.passthrough()
		.optional(),
	requirements: z.array(z.string()).optional(),
	skills: z.array(z.string()).optional(),
	postedDate: z.string().optional(),
	humanLanguage: z.string().optional(),
	diffbotUri: z.string().optional(),
	extractedAt: z.coerce.date().nullable().optional(),
});

export type DiffbotJob = z.infer<typeof DiffbotJob>;

/**
 * DiffbotList — cached list extraction entity.
 * @see https://docs.diffbot.com/docs/extract/list
 */
export const DiffbotList = z.object({
	id: z.string().optional(),
	type: z.literal('list').optional(),
	pageUrl: z.string(),
	resolvedPageUrl: z.string().optional(),
	title: z.string().optional(),
	numItems: z.number().optional(),
	items: z
		.array(
			z
				.object({
					title: z.string().optional(),
					link: z.string().optional(),
					description: z.string().optional(),
					image: z.string().optional(),
					price: z.string().optional(),
				})
				.passthrough(),
		)
		.optional(),
	humanLanguage: z.string().optional(),
	extractedAt: z.coerce.date().nullable().optional(),
});

export type DiffbotList = z.infer<typeof DiffbotList>;

/**
 * DiffbotOrganization — Knowledge Graph organization entity.
 * @see https://docs.diffbot.com/docs/ontology/organization
 */
export const DiffbotOrganization = z.object({
	id: z.string(),
	name: z.string(),
	type: z.literal('Organization').optional(),
	types: z.array(z.string()).optional(),
	diffbotUri: z.string().optional(),
	homepageUri: z.string().optional(),
	description: z.string().optional(),
	summary: z.string().optional(),
	logo: z.string().optional(),
	image: z.string().optional(),
	images: z.array(z.string()).optional(),
	nbEmployees: z.number().optional(),
	nbEmployeesMin: z.number().optional(),
	nbEmployeesMax: z.number().optional(),
	revenue: z.number().optional(),
	yearlyRevenues: z
		.array(
			z
				.object({
					year: z.number().optional(),
					revenue: z.number().optional(),
				})
				.passthrough(),
		)
		.optional(),
	isPublic: z.boolean().optional(),
	isNonProfit: z.boolean().optional(),
	isAcquired: z.boolean().optional(),
	isDissolved: z.boolean().optional(),
	founders: z
		.array(
			z
				.object({
					name: z.string().optional(),
					id: z.string().optional(),
				})
				.passthrough(),
		)
		.optional(),
	ceo: z
		.object({
			name: z.string().optional(),
			id: z.string().optional(),
		})
		.passthrough()
		.optional(),
	boardMembers: z
		.array(
			z
				.object({
					name: z.string().optional(),
					id: z.string().optional(),
				})
				.passthrough(),
		)
		.optional(),
	competitors: z
		.array(
			z
				.object({
					name: z.string().optional(),
					id: z.string().optional(),
				})
				.passthrough(),
		)
		.optional(),
	totalInvestment: z.number().optional(),
	location: z
		.object({
			city: z.string().optional(),
			region: z.string().optional(),
			country: z.string().optional(),
			address: z.string().optional(),
		})
		.passthrough()
		.optional(),
	locations: z.array(z.record(z.string(), z.unknown())).optional(),
	emailAddresses: z.array(z.string()).optional(),
	phoneNumbers: z.array(z.string()).optional(),
	linkedInUri: z.string().optional(),
	twitterUri: z.string().optional(),
	facebookUri: z.string().optional(),
	githubUri: z.string().optional(),
	wikipediaUri: z.string().optional(),
	crunchbaseUri: z.string().optional(),
	angellistUri: z.string().optional(),
	categories: z.array(z.string()).optional(),
	industries: z.array(z.string()).optional(),
	naicsClassification: z.string().optional(),
	sicClassification: z.string().optional(),
	naceClassification: z.string().optional(),
	crawlTimestamp: z.number().optional(),
	importance: z.number().optional(),
	origin: z.string().optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

export type DiffbotOrganization = z.infer<typeof DiffbotOrganization>;

/**
 * DiffbotPerson — Knowledge Graph person entity.
 * @see https://docs.diffbot.com/docs/ontology/person
 */
export const DiffbotPerson = z.object({
	id: z.string(),
	name: z.string(),
	type: z.literal('Person').optional(),
	types: z.array(z.string()).optional(),
	diffbotUri: z.string().optional(),
	description: z.string().optional(),
	summary: z.string().optional(),
	image: z.string().optional(),
	images: z.array(z.string()).optional(),
	gender: z.string().optional(),
	birthDate: z.string().optional(),
	deathDate: z.string().optional(),
	educations: z.array(z.record(z.string(), z.unknown())).optional(),
	employments: z.array(z.record(z.string(), z.unknown())).optional(),
	awards: z.array(z.record(z.string(), z.unknown())).optional(),
	skills: z.array(z.string()).optional(),
	interests: z.array(z.string()).optional(),
	location: z
		.object({
			city: z.string().optional(),
			region: z.string().optional(),
			country: z.string().optional(),
		})
		.passthrough()
		.optional(),
	emailAddresses: z.array(z.string()).optional(),
	phoneNumbers: z.array(z.string()).optional(),
	linkedInUri: z.string().optional(),
	twitterUri: z.string().optional(),
	facebookUri: z.string().optional(),
	githubUri: z.string().optional(),
	wikipediaUri: z.string().optional(),
	crunchbaseUri: z.string().optional(),
	angellistUri: z.string().optional(),
	homepageUri: z.string().optional(),
	crawlTimestamp: z.number().optional(),
	importance: z.number().optional(),
	origin: z.string().optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

export type DiffbotPerson = z.infer<typeof DiffbotPerson>;

/**
 * DiffbotCrawlJob — Crawl job record.
 * @see https://docs.diffbot.com/docs/crawl/
 */
export const DiffbotCrawlJob = z.object({
	name: z.string(),
	jobStatus: z
		.object({
			status: z.number().optional(),
			message: z.string().optional(),
		})
		.passthrough()
		.optional(),
	sentToCrawler: z.number().optional(),
	objectsHarvested: z.number().optional(),
	urlsHarvested: z.number().optional(),
	pageRounds: z.number().optional(),
	maxRounds: z.number().optional(),
	maxHops: z.number().optional(),
	pause: z.number().optional(),
	roundProxy: z.number().optional(),
	seeds: z.string().optional(),
	apiUrl: z.string().optional(),
	downloadUrl: z.string().optional(),
	maxTags: z.number().optional(),
	status: z.string().optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

export type DiffbotCrawlJob = z.infer<typeof DiffbotCrawlJob>;

/**
 * DiffbotBulkJob — Bulk extract or Bulk enhance job record.
 * @see https://docs.diffbot.com/docs/bulk/
 */
export const DiffbotBulkJob = z.object({
	id: z.string(),
	name: z.string().optional(),
	bulkjobId: z.string().optional(),
	kind: z.enum(['extract', 'enhance']).optional(),
	status: z.string().optional(),
	jobStatus: z
		.object({
			status: z.number().optional(),
			message: z.string().optional(),
		})
		.passthrough()
		.optional(),
	total: z.number().optional(),
	completed: z.number().optional(),
	failed: z.number().optional(),
	format: z.string().optional(),
	apiUrl: z.string().optional(),
	urls: z.string().optional(),
	downloadUrl: z.string().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

export type DiffbotBulkJob = z.infer<typeof DiffbotBulkJob>;

/**
 * DiffbotCustomApi — Custom API extraction configuration.
 * @see https://docs.diffbot.com/docs/custom-api/
 */
export const DiffbotCustomApi = z.object({
	id: z.string(),
	api: z.string(),
	url: z.string(),
	pattern: z.string().optional(),
	ruleset: z.record(z.string(), z.unknown()).optional(),
	selectors: z.record(z.string(), z.unknown()).optional(),
	testUrl: z.string().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

export type DiffbotCustomApi = z.infer<typeof DiffbotCustomApi>;

/**
 * DiffbotAccount — Account details and API quota.
 * @see https://docs.diffbot.com/docs/account
 */
export const DiffbotAccount = z.object({
	id: z.string(),
	token: z.string(),
	name: z.string().optional(),
	email: z.string().optional(),
	plan: z.string().optional(),
	planStart: z.string().optional(),
	planCalls: z.number().optional(),
	apiCalls: z.number().optional(),
	status: z.string().optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

export type DiffbotAccount = z.infer<typeof DiffbotAccount>;
