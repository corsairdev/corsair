import { z } from 'zod';

// ── Shared building blocks ─────────────────────────────────────────────────

/**
 * Global parameters documented for every Piloterr endpoint
 * (docs.piloterr.com/global-parameters). is_async is intentionally not
 * exposed: the typed outputs below are synchronous.
 */
const globalParams = {
	softFail: z
		.boolean()
		.optional()
		.describe(
			'Answer 200 even on errors, with the message in the error field; errors stay unbilled',
		),
	fields: z
		.string()
		.optional()
		.describe(
			'Comma-separated fields to keep, with dot notation for nested objects; unknown names are ignored',
		),
};

/**
 * Shapes a screenshot answer: binary mode hands back { bytes,
 * contentType }; the docs publish no JSON shape for the 200.
 */
// unknown: raw is the untouched response body — binary bytes or plain
// text — so the shaper stays untyped.
export function shapeScreenshotFile(raw: unknown): unknown {
	const file = (raw ?? {}) as {
		bytes?: Uint8Array;
		contentType?: string | null;
	} | null;
	if (file?.bytes) {
		return {
			contentType: file.contentType ?? undefined,
			fileContent: Buffer.from(file.bytes).toString('base64'),
		};
	}
	// Plain-text answers (an error surfaced as 200 HTML, for instance)
	// are not screenshots; return them for the schema to reject.
	return raw;
}

/** A screenshot the screenshot endpoint captured. */
export const ScreenshotFileSchema = z
	.object({
		contentType: z
			.string()
			.nullish()
			.describe('Image content type, e.g. image/png or application/pdf'),
		fileContent: z.string().describe('The captured file, base64-encoded'),
	})
	.loose()
	.describe('A captured screenshot or PDF');
export type ScreenshotFile = z.infer<typeof ScreenshotFileSchema>;

/** The pagination block Google and LinkedIn search answers carry. */
export const PaginationSchema = z
	.object({
		next: z.number().nullish().describe('Next page number'),
		current: z.number().nullish().describe('Current page number'),
		per_page: z.number().nullish().describe('Results per page'),
		other_pages: z
			.array(z.number())
			.nullish()
			.describe('Other available page numbers'),
		has_next_page: z.boolean().nullish().describe('Whether a next page exists'),
	})
	.loose()
	.describe('Search pagination');
export type Pagination = z.infer<typeof PaginationSchema>;

/** An organic result on Google search and news pages. */
export const OrganicResultSchema = z
	.object({
		link: z.string().nullish().describe('Result URL'),
		title: z.string().nullish().describe('Result title'),
		domain: z.string().nullish().describe('Result domain'),
		source: z.string().nullish().describe('Result source name'),
		snippet: z.string().nullish().describe('Result snippet'),
		position: z.number().nullish().describe('Position on the page'),
		displayed_link: z.string().nullish().describe('Displayed URL'),
		snippet_matched: z
			.array(z.unknown())
			.nullish()
			.describe('Snippet highlights'),
		date: z.string().nullish().describe('Publish date (news results)'),
	})
	.loose()
	.describe('A Google organic result');
export type OrganicResult = z.infer<typeof OrganicResultSchema>;

/** The echo of the query an engine answered with. */
export const SearchParametersSchema = z
	.record(z.string(), z.unknown())
	.nullish()
	.describe('Search parameters echoed by the engine');

// ── web ────────────────────────────────────────────────────────────────────

export const WebCrawlerInputSchema = z
	.object({
		query: z
			.string()
			.min(1)
			.describe(
				'Public website URL to fetch; must include http:// or https://',
			),
		allowRedirects: z
			.boolean()
			.optional()
			.describe(
				'Follow HTTP redirects (default true); set false to inspect the redirect chain',
			),
		returnPageSource: z
			.boolean()
			.optional()
			.describe(
				'Return the exact HTML source instead of processed content (default false)',
			),
		...globalParams,
	})
	.describe('Input for fetching a page with the HTTP crawler engine');
export type WebCrawlerInput = z.infer<typeof WebCrawlerInputSchema>;

/**
 * The crawler answers a JSON-encoded HTML string (the docs' 200 schema is
 * `{"type": "string"}`).
 */
export const WebHtmlOutputSchema = z
	.string()
	.describe('The fetched or rendered HTML');

export const WebRenderingInputSchema = z
	.object({
		query: z
			.string()
			.min(1)
			.describe(
				'Public website URL to render in a headless browser; must include http:// or https://',
			),
		waitInSeconds: z
			.number()
			.optional()
			.describe('Seconds to wait after page load before returning'),
		waitFor: z
			.string()
			.optional()
			.describe(
				'CSS or XPath selector to wait for before returning the rendered HTML',
			),
		blockAds: z
			.boolean()
			.optional()
			.describe('Block ad network requests during rendering'),
		timeout: z
			.number()
			.optional()
			.describe('Maximum seconds to wait for the page to load'),
		returnPageSource: z
			.boolean()
			.optional()
			.describe('Return {"result": html} instead of the raw HTML string'),
		...globalParams,
	})
	.describe('Input for rendering a JavaScript-heavy page');

export const WebScreenshotInputSchema = z
	.object({
		url: z.string().min(1).describe('The URL of the webpage to capture'),
		format: z
			.enum(['jpeg', 'jpg', 'pdf', 'png', 'webp'])
			.optional()
			.describe('Output format of the screenshot'),
		device: z
			.enum([
				'galaxy_fold4',
				'galaxy_s23',
				'galaxy_s23_ultra',
				'galaxy_s8',
				'huawei_mate_50_pro',
				'huawei_p60_pro',
				'ipad',
				'iphone_12',
				'iphone_13_mini',
				'iphone_13_pro_max',
				'iphone_14_pro',
				'iphone_14_pro_max',
				'iphone_x',
				'pixel_5',
				'pixel_6a',
				'pixel_7_pro',
				'redmi_note_11',
				'redmi_note_12_pro',
			])
			.optional()
			.describe('Device type to emulate'),
		fullPage: z
			.boolean()
			.optional()
			.describe('Capture the entire page instead of the viewport'),
		fullPageScroll: z
			.boolean()
			.optional()
			.describe('Scroll the page to load lazy elements before capturing'),
		fullPageScrollDuration: z
			.number()
			.optional()
			.describe('Scroll duration in milliseconds before a full-page capture'),
		viewportWidth: z.number().optional().describe('Viewport width in pixels'),
		viewportHeight: z.number().optional().describe('Viewport height in pixels'),
		scaleFactor: z
			.number()
			.optional()
			.describe('Scale factor for high-resolution screenshots'),
		imageQuality: z
			.string()
			.optional()
			.describe('Custom image quality (jpeg and webp)'),
		selector: z
			.string()
			.optional()
			.describe('Capture a specific element instead of the viewport'),
		cache: z.boolean().optional().describe('Cache the response'),
		cacheTtl: z.number().optional().describe('Cache TTL in seconds'),
		removeSelectors: z
			.string()
			.optional()
			.describe('Comma-separated elements to hide before capturing'),
		removeCookieBanners: z
			.boolean()
			.optional()
			.describe('Remove cookie banners before capturing'),
		removeAds: z.boolean().optional().describe('Remove ads before capturing'),
		blockResources: z
			.string()
			.optional()
			.describe(
				'Comma-separated resource types to block, e.g. image,stylesheet,font',
			),
		blockUrls: z
			.string()
			.optional()
			.describe('Comma-separated URL patterns to block'),
		delay: z.number().optional().describe('Delay in seconds before capturing'),
		waitForSelector: z
			.string()
			.optional()
			.describe('Element to wait for before capturing'),
		...globalParams,
	})
	.describe('Input for capturing a webpage screenshot');
export type WebScreenshotInput = z.infer<typeof WebScreenshotInputSchema>;

export const WebScreenshotOutputSchema = ScreenshotFileSchema;

export const WebTechnologyInputSchema = z
	.object({
		query: z
			.string()
			.min(1)
			.describe('Website URL to analyze; must include http:// or https://'),
		mode: z
			.enum(['expert', 'simple'])
			.optional()
			.describe(
				'expert (default) adds confidence scores, versions and descriptions; simple keeps names and status codes',
			),
		...globalParams,
	})
	.describe('Input for detecting a website technology stack');
export type WebTechnologyInput = z.infer<typeof WebTechnologyInputSchema>;

export const WebTechnologyOutputSchema = z
	.object({
		cms: z.string().nullish().describe('Detected CMS'),
		urls: z
			// unknown: keyed by URL, values carry status codes.
			.record(z.string(), z.unknown())
			.nullish()
			.describe('Checked URLs with their status codes'),
		technologies: z
			.array(z.unknown())
			.nullish()
			.describe('Detected technologies; names in simple mode'),
	})
	.loose()
	.describe('The detected technology stack');

export const WebEmailPhoneExtractorInputSchema = z
	.object({
		query: z
			.string()
			.min(1)
			.describe(
				'Website URL to crawl for contact information; must include http:// or https://',
			),
		countryCode: z
			.string()
			.length(2)
			.optional()
			.describe(
				'ISO 3166-1 alpha-2 country code improving phone number parsing, e.g. FR',
			),
		...globalParams,
	})
	.describe('Input for extracting emails and phone numbers from a website');
export type WebEmailPhoneExtractorInput = z.infer<
	typeof WebEmailPhoneExtractorInputSchema
>;

export const WebEmailPhoneExtractorOutputSchema = z
	.object({
		emails: z.array(z.string()).nullish().describe('Found email addresses'),
		phone_numbers: z
			.array(z.unknown())
			.nullish()
			.describe('Found phone numbers'),
		contact_pages: z
			.array(z.unknown())
			.nullish()
			.describe('Pages the extractor found contacts on'),
		twitter_profiles: z
			.array(z.string())
			.nullish()
			.describe('X/Twitter profiles'),
		linkedin_profiles: z
			.array(z.string())
			.nullish()
			.describe('LinkedIn profiles'),
		instagram_profiles: z
			.array(z.string())
			.nullish()
			.describe('Instagram profiles'),
		facebook_profiles: z
			.array(z.unknown())
			.nullish()
			.describe('Facebook profiles'),
		youtube_channels: z
			.array(z.unknown())
			.nullish()
			.describe('YouTube channels'),
		tiktok_profiles: z.array(z.unknown()).nullish().describe('TikTok profiles'),
		reddit_profiles: z.array(z.unknown()).nullish().describe('Reddit profiles'),
		snapchat_profiles: z
			.array(z.unknown())
			.nullish()
			.describe('Snapchat profiles'),
		telegram_channels: z
			.array(z.unknown())
			.nullish()
			.describe('Telegram channels'),
		pinterest_profiles: z
			.array(z.unknown())
			.nullish()
			.describe('Pinterest profiles'),
		crunchbase_profiles: z
			.array(z.unknown())
			.nullish()
			.describe('Crunchbase profiles'),
	})
	.loose()
	.describe('Contact details extracted from a website');

export const WebWebunlockerInputSchema = z
	.object({
		query: z
			.string()
			.min(1)
			.describe(
				'Public website URL to unlock; the target domain must be on the Piloterr whitelist',
			),
		allowRedirects: z
			.boolean()
			.optional()
			.describe(
				'Follow HTTP redirects (default true); set false to inspect the redirect chain',
			),
		returnPageSource: z
			.boolean()
			.optional()
			.describe(
				'Return the exact HTML source instead of processed content (default false)',
			),
		...globalParams,
	})
	.describe('Input for unlocking a bot-protected page');
export type WebWebunlockerInput = z.infer<typeof WebWebunlockerInputSchema>;

// ── google ─────────────────────────────────────────────────────────────────

const googleParams = {
	googleDomain: z
		.string()
		.optional()
		.describe('Google domain to use, e.g. google.com or google.fr'),
	gl: z
		.string()
		.optional()
		.describe('Two-letter country code for the search, e.g. us'),
	hl: z
		.string()
		.optional()
		.describe('Language code for the search, e.g. en or en-gb'),
	cr: z
		.string()
		.optional()
		.describe('Country restriction as country{XX} joined with |'),
	lr: z
		.string()
		.optional()
		.describe('Language restriction as lang_{xx} joined with |'),
};

export const GoogleSearchInputSchema = z
	.object({
		query: z
			.string()
			.min(1)
			.describe('Search query; supports Google operators'),
		tbs: z
			.string()
			.optional()
			.describe('Time-range filter, e.g. qdr:w for the last week'),
		location: z
			.string()
			.optional()
			.describe('City or region the search originates from'),
		uule: z.string().optional().describe('Google-encoded location string'),
		page: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Page number (default 1)'),
		num: z
			.number()
			.int()
			.optional()
			.describe('Results per page; deprecated by Google and may not apply'),
		safe: z.enum(['active', 'off']).optional().describe('SafeSearch filter'),
		...googleParams,
		...globalParams,
	})
	.describe('Input for scraping Google search results');
export type GoogleSearchInput = z.infer<typeof GoogleSearchInputSchema>;

export const GoogleSearchOutputSchema = z
	.object({
		pagination: PaginationSchema.nullish().describe('Result pagination'),
		organic_results: z
			.array(OrganicResultSchema)
			.nullish()
			.describe('Organic listings'),
		related_searches: z
			.array(z.record(z.string(), z.unknown()))
			.nullish()
			.describe('Related searches'),
		knowledge_graph: z
			.unknown()
			.nullish()
			.describe('Knowledge graph, when present'),
		search_parameters: SearchParametersSchema.describe(
			'Parameters echoed back',
		),
		search_information: z
			.object({
				total_results: z.unknown().nullish().describe('Total results estimate'),
				time_taken_displayed: z
					.unknown()
					.nullish()
					.describe('Displayed search time'),
			})
			.loose()
			.nullish()
			.describe('Search metadata'),
	})
	.loose()
	.describe('A Google search result page');

export const GoogleAutocompleteInputSchema = z
	.object({
		query: z
			.string()
			.min(1)
			.describe('Partial or complete query to autocomplete'),
		cp: z
			.number()
			.int()
			.optional()
			.describe('Cursor position in the query the suggestions complete'),
		...googleParams,
		...globalParams,
	})
	.describe('Input for Google autocomplete suggestions');
export type GoogleAutocompleteInput = z.infer<
	typeof GoogleAutocompleteInputSchema
>;

export const GoogleAutocompleteOutputSchema = z
	.object({
		suggestions: z
			.array(z.record(z.string(), z.unknown()))
			.nullish()
			.describe('Suggested completions, each with a value field'),
		search_parameters: SearchParametersSchema.describe(
			'Parameters echoed back',
		),
	})
	.loose()
	.describe('Google autocomplete suggestions');

export const GoogleNewsInputSchema = z
	.object({
		query: z
			.string()
			.min(1)
			.describe('News search query; supports Google operators'),
		page: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Page number (default 1)'),
		...googleParams,
		...globalParams,
	})
	.describe('Input for scraping Google News');
export type GoogleNewsInput = z.infer<typeof GoogleNewsInputSchema>;

export const GoogleNewsOutputSchema = z
	.object({
		pagination: PaginationSchema.nullish().describe('Result pagination'),
		organic_results: z
			.array(OrganicResultSchema)
			.nullish()
			.describe('News listings, each with a date'),
	})
	.loose()
	.describe('A Google News result page');

// ── linkedin ───────────────────────────────────────────────────────────────

export const LinkedInCompanyInfoInputSchema = z
	.object({
		query: z
			.string()
			.optional()
			.describe(
				'LinkedIn company slug, URL, numeric ID or school URL; mutually exclusive with domain',
			),
		domain: z
			.string()
			.optional()
			.describe(
				'Company website domain for reverse lookup; mutually exclusive with query',
			),
		...globalParams,
	})
	.refine(
		({ query, domain }) => (query !== undefined) !== (domain !== undefined),
		{
			message:
				'Exactly one of query (LinkedIn identifier) or domain (reverse lookup) is required',
		},
	)
	.describe('Input for reading a LinkedIn company');
export type LinkedInCompanyInfoInput = z.infer<
	typeof LinkedInCompanyInfoInputSchema
>;

export const LinkedInCompanyOutputSchema = z
	.object({
		company_id: z.number().nullish().describe('LinkedIn company ID'),
		company_name: z.string().nullish().describe('Company name'),
		company_url: z.string().nullish().describe('LinkedIn company URL'),
		tagline: z.string().nullish().describe('Company tagline'),
		description: z.string().nullish().describe('Company description'),
		website: z.string().nullish().describe('Company website'),
		industry: z.string().nullish().describe('Industry'),
		founded: z.number().nullish().describe('Founding year'),
		staff_count: z.number().nullish().describe('Employee count'),
		staff_range: z.string().nullish().describe('Employee range label'),
		follower_count: z.number().nullish().describe('Follower count'),
		headquarter: z
			.object({
				city: z.string().nullish(),
				line1: z.string().nullish(),
				country: z.string().nullish(),
				postal_code: z.string().nullish(),
			})
			.loose()
			.nullish()
			.describe('Headquarters address'),
		locations: z.array(z.string()).nullish().describe('Office locations'),
		specialities: z.array(z.string()).nullish().describe('Specialities'),
		employees: z
			.array(z.record(z.string(), z.unknown()))
			.nullish()
			.describe('Employee profiles'),
		posts: z
			.array(z.record(z.string(), z.unknown()))
			.nullish()
			.describe('Recent posts'),
		logo_url: z.string().nullish().describe('Logo URL'),
	})
	.loose()
	.describe('A LinkedIn company profile');

export const LinkedInProfileInfoInputSchema = z
	.object({
		query: z
			.string()
			.min(1)
			.describe('LinkedIn username, profile URL or encoded member ID'),
		...globalParams,
	})
	.describe('Input for reading a LinkedIn profile');
export type LinkedInProfileInfoInput = z.infer<
	typeof LinkedInProfileInfoInputSchema
>;

export const LinkedInProfileOutputSchema = z
	.object({
		username: z.string().nullish().describe('LinkedIn username'),
		member_identifier: z.string().nullish().describe('Encoded member ID'),
		full_name: z.string().nullish().describe('Full name'),
		headline: z.string().nullish().describe('Profile headline'),
		summary: z.string().nullish().describe('Profile summary'),
		profile_url: z.string().nullish().describe('Profile URL'),
		photo_url: z.string().nullish().describe('Photo URL'),
		address: z.unknown().nullish().describe('Address'),
		connection_count: z.number().nullish().describe('Connection count'),
		follower_count: z.number().nullish().describe('Follower count'),
		skills: z.array(z.unknown()).nullish().describe('Skills'),
		experiences: z
			.array(z.record(z.string(), z.unknown()))
			.nullish()
			.describe('Work experience entries'),
		educations: z
			.array(z.record(z.string(), z.unknown()))
			.nullish()
			.describe('Education entries'),
		certifications: z.array(z.unknown()).nullish().describe('Certifications'),
		languages: z.array(z.unknown()).nullish().describe('Languages'),
		recommendations: z.array(z.unknown()).nullish().describe('Recommendations'),
		articles: z
			.array(z.record(z.string(), z.unknown()))
			.nullish()
			.describe('Published articles'),
	})
	.loose()
	.describe('A LinkedIn member profile');

export const LinkedInJobInfoInputSchema = z
	.object({
		query: z
			.string()
			.min(1)
			.describe('LinkedIn numeric job ID or full job posting URL'),
		...globalParams,
	})
	.describe('Input for reading a LinkedIn job posting');
export type LinkedInJobInfoInput = z.infer<typeof LinkedInJobInfoInputSchema>;

export const LinkedInJobOutputSchema = z
	.object({
		id: z.number().nullish().describe('LinkedIn job ID'),
		title: z.string().nullish().describe('Job title'),
		job_url: z.string().nullish().describe('Job posting URL'),
		job_description: z.string().nullish().describe('Job description'),
		location: z.string().nullish().describe('Location label'),
		address: z
			.record(z.string(), z.unknown())
			.nullish()
			.describe('Structured address'),
		industry: z.array(z.string()).nullish().describe('Industries'),
		functions: z.array(z.string()).nullish().describe('Job functions'),
		list_date: z.string().nullish().describe('Posting date'),
		employment_type: z.string().nullish().describe('Employment type'),
		seniority_level: z.string().nullish().describe('Seniority level'),
		total_applicants: z.number().nullish().describe('Applicant count'),
		compensation_salary: z.string().nullish().describe('Salary range'),
		company_name: z.string().nullish().describe('Company name'),
		company_url: z.string().nullish().describe('Company URL'),
		company_logo: z.string().nullish().describe('Company logo'),
		recruiter: z
			.record(z.string(), z.unknown())
			.nullish()
			.describe('Recruiter profile'),
	})
	.loose()
	.describe('A LinkedIn job posting');

export const LinkedInJobSearchInputSchema = z
	.object({
		keyword: z
			.string()
			.optional()
			.describe('Job title or keyword; leave empty to match filters only'),
		experienceLevel: z
			.enum([
				'internship',
				'entry_level',
				'associate',
				'mid_senior',
				'director',
			])
			.optional()
			.describe('Seniority filter'),
		jobType: z
			.enum([
				'full_time',
				'part_time',
				'contract',
				'temporary',
				'internship',
				'volunteer',
			])
			.optional()
			.describe('Employment type filter'),
		when: z
			.enum(['day', 'week', 'month'])
			.optional()
			.describe('Posting recency filter'),
		flexibility: z
			.enum(['remote', 'flexible', 'on_site'])
			.optional()
			.describe('Work arrangement filter'),
		distance: z
			.union([
				z.literal(5),
				z.literal(10),
				z.literal(25),
				z.literal(50),
				z.literal(100),
			])
			.optional()
			.describe('Radius in miles from the geo_id location'),
		geoId: z
			.string()
			.optional()
			.describe('LinkedIn geo ID (default 92000000, worldwide)'),
		companyId: z
			.string()
			.optional()
			.describe('LinkedIn numeric company ID filter'),
		page: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Page number (default 1)'),
		...globalParams,
	})
	.describe('Input for searching LinkedIn jobs');
export type LinkedInJobSearchInput = z.infer<
	typeof LinkedInJobSearchInputSchema
>;

export const LinkedInJobSearchOutputSchema = z
	.object({
		results: z
			.array(
				z
					.object({
						id: z.number().nullish().describe('Job ID'),
						url: z.string().nullish().describe('Job URL'),
						title: z.string().nullish().describe('Job title'),
						city: z.string().nullish().describe('City'),
						country: z.string().nullish().describe('Country'),
						location: z.string().nullish().describe('Location label'),
						geo_id: z.string().nullish().describe('LinkedIn geo ID'),
						list_date: z.string().nullish().describe('Posting date'),
						company_name: z.string().nullish().describe('Company name'),
						company_url: z.string().nullish().describe('Company URL'),
					})
					.loose(),
			)
			.describe('Job listings, up to 10 per page'),
		pagination: PaginationSchema.nullish().describe('Result pagination'),
	})
	.loose()
	.describe('A LinkedIn job search page');

export const LinkedInPostInfoInputSchema = z
	.object({
		query: z
			.string()
			.min(1)
			.describe('LinkedIn numeric post ID or full post URL'),
		...globalParams,
	})
	.describe('Input for reading a LinkedIn post');
export type LinkedInPostInfoInput = z.infer<typeof LinkedInPostInfoInputSchema>;

export const LinkedInPostOutputSchema = z
	.object({
		id: z.string().nullish().describe('Post ID'),
		url: z.string().nullish().describe('Post URL'),
		text: z.string().nullish().describe('Post text'),
		author: z
			.record(z.string(), z.unknown())
			.nullish()
			.describe('Author profile'),
		images: z.array(z.string()).nullish().describe('Post images'),
		comments: z
			.array(z.record(z.string(), z.unknown()))
			.nullish()
			.describe('First batch of comments; deep threads may be truncated'),
	})
	.loose()
	.describe('A LinkedIn post');

// ── email ──────────────────────────────────────────────────────────────────

export const EmailFinderInputSchema = z
	.object({
		query: z
			.string()
			.min(1)
			.describe('Full name of the person whose email to find'),
		companyDomain: z
			.string()
			.optional()
			.describe('Company domain, e.g. piloterr.com or a full URL'),
		companyName: z
			.string()
			.optional()
			.describe('Company name; domain is preferred when available'),
		...globalParams,
	})
	.refine(
		({ companyDomain, companyName }) =>
			companyDomain !== undefined || companyName !== undefined,
		{
			message: 'At least one of companyDomain or companyName is required',
		},
	)
	.describe('Input for finding a professional email');
export type EmailFinderInput = z.infer<typeof EmailFinderInputSchema>;

export const EmailFinderOutputSchema = z
	.object({
		email: z.string().nullish().describe('The found email address'),
		status: z.string().nullish().describe('Verification status of the email'),
		first_name: z.string().nullish().describe('First name'),
		last_name: z.string().nullish().describe('Last name'),
		company_domain: z.string().nullish().describe('Company domain'),
	})
	.loose()
	.describe('A found professional email');

export const EmailVerifyInputSchema = z
	.object({
		query: z.string().min(1).describe('The email address to verify'),
		...globalParams,
	})
	.describe('Input for verifying an email address');
export type EmailVerifyInput = z.infer<typeof EmailVerifyInputSchema>;

export const EmailVerifyOutputSchema = z
	.object({
		email: z.string().nullish().describe('The verified email address'),
		status: z
			.enum(['valid', 'invalid', 'unknown'])
			.nullish()
			.describe('Deliverability verdict'),
	})
	.loose()
	.describe('An email verification');

export const EmailAnalyzesInputSchema = z
	.object({
		query: z
			.string()
			.min(1)
			.describe('Bare domain to analyze, e.g. airbus.com'),
		...globalParams,
	})
	.describe('Input for analyzing a domain email infrastructure');
export type EmailAnalyzesInput = z.infer<typeof EmailAnalyzesInputSchema>;

export const EmailAnalyzesOutputSchema = z
	.object({
		is_microsoft_365: z
			.boolean()
			.nullish()
			.describe('Whether the domain uses Microsoft 365'),
		is_google_workspace: z
			.boolean()
			.nullish()
			.describe('Whether the domain uses Google Workspace'),
		microsoft_365_domains: z
			.array(z.string())
			.nullish()
			.describe('Associated Microsoft 365 domains'),
		google_workspace_domains: z
			.array(z.string())
			.nullish()
			.describe('Associated Google Workspace domains'),
		domains: z
			// unknown: SPF and DNS record lists keyed by domain name.
			.record(z.string(), z.unknown())
			.nullish()
			.describe('SPF and DNS records per associated domain'),
	})
	.loose()
	.describe('A domain email infrastructure analysis');

// ── account ────────────────────────────────────────────────────────────────

export const EmptyInputSchema = z.object({}).describe('No input parameters');
export type EmptyInput = z.infer<typeof EmptyInputSchema>;

export const UsageOutputSchema = z
	.object({
		remaining: z.number().describe('Total still available across all balances'),
		total_used: z.number().describe('Total consumed across all balances'),
		renewal_date: z
			.string()
			.nullish()
			.describe('Subscription renewal date (ISO 8601)'),
		period: z
			.object({
				start: z.string().nullish(),
				end: z.string().nullish(),
			})
			.loose()
			.nullish()
			.describe('Current billing period'),
		subscription: z
			.object({
				used: z.number().nullish(),
				total: z.number().nullish(),
				remaining: z.number().nullish(),
				percent_used: z.number().nullish(),
			})
			.loose()
			.nullish()
			.describe('Combined subscription quota plus packs'),
		packs: z.unknown().nullish().describe('One-time pack balances'),
		credits: z
			.object({
				given: z.number().nullish(),
				consumed: z.number().nullish(),
				remaining: z.number().nullish(),
			})
			.loose()
			.nullish()
			.describe('Credit ledger balances'),
		rate_limit: z
			.record(z.string(), z.unknown())
			.nullish()
			.describe('Per-second and per-minute plan limits'),
		account: z
			.record(z.string(), z.unknown())
			.nullish()
			.describe('Account name and slug'),
		api_key: z
			.record(z.string(), z.unknown())
			.nullish()
			.describe('Key alias, active flag, category, expiry and quotas'),
	})
	.loose()
	.describe('Quota, credits and rate limits for the key');

export const JobsGetInputSchema = z
	.object({
		id: z
			.string()
			.min(1)
			.describe('The job_id returned by an endpoint called with is_async=true'),
	})
	.describe('Input for polling an async job');
export type JobsGetInput = z.infer<typeof JobsGetInputSchema>;

export const JobStatusSchema = z
	.object({
		id: z.string().nullish().describe('Job ID'),
		success: z.boolean().nullish().describe('Whether the job succeeded'),
		status: z
			.enum([
				'Queued',
				'Running',
				'CompletedJob',
				'Error',
				'NotFound',
				'BadRequest',
			])
			.nullish()
			.describe(
				'Job state; CompletedJob, Error, NotFound and BadRequest are terminal',
			),
		endpoint: z.string().nullish().describe('Endpoint the job runs'),
		created_at: z.string().nullish().describe('Creation timestamp'),
		started_at: z.string().nullish().describe('Start timestamp'),
		completed_at: z.string().nullish().describe('Completion timestamp'),
		duration_ms: z.number().nullish().describe('Duration in milliseconds'),
		progress: z.number().nullish().describe('Progress from 0 to 100'),
		args: z
			.record(z.string(), z.unknown())
			.nullish()
			.describe('Arguments the job was started with'),
		// unknown: the result carries the wrapped endpoint's own answer shape.
		result: z
			.unknown()
			.nullish()
			.describe('The endpoint answer, once completed'),
	})
	.loose()
	.describe('An async job status');
export type JobStatus = z.infer<typeof JobStatusSchema>;

// ── Operation registry ─────────────────────────────────────────────────────

export const PiloterrEndpointInputSchemas = {
	webCrawler: WebCrawlerInputSchema,
	webRendering: WebRenderingInputSchema,
	webScreenshot: WebScreenshotInputSchema,
	webTechnology: WebTechnologyInputSchema,
	webEmailPhoneExtractor: WebEmailPhoneExtractorInputSchema,
	webWebunlocker: WebWebunlockerInputSchema,
	googleSearch: GoogleSearchInputSchema,
	googleSearchAutocomplete: GoogleAutocompleteInputSchema,
	googleNews: GoogleNewsInputSchema,
	linkedinCompanyInfo: LinkedInCompanyInfoInputSchema,
	linkedinProfileInfo: LinkedInProfileInfoInputSchema,
	linkedinJobInfo: LinkedInJobInfoInputSchema,
	linkedinJobSearch: LinkedInJobSearchInputSchema,
	linkedinPostInfo: LinkedInPostInfoInputSchema,
	emailFinder: EmailFinderInputSchema,
	emailVerify: EmailVerifyInputSchema,
	emailAnalyzes: EmailAnalyzesInputSchema,
	usageGet: EmptyInputSchema,
	jobsGet: JobsGetInputSchema,
};

export const PiloterrEndpointOutputSchemas = {
	webCrawler: WebHtmlOutputSchema,
	webRendering: WebHtmlOutputSchema,
	webScreenshot: WebScreenshotOutputSchema,
	webTechnology: WebTechnologyOutputSchema,
	webEmailPhoneExtractor: WebEmailPhoneExtractorOutputSchema,
	webWebunlocker: WebHtmlOutputSchema,
	googleSearch: GoogleSearchOutputSchema,
	googleSearchAutocomplete: GoogleAutocompleteOutputSchema,
	googleNews: GoogleNewsOutputSchema,
	linkedinCompanyInfo: LinkedInCompanyOutputSchema,
	linkedinProfileInfo: LinkedInProfileOutputSchema,
	linkedinJobInfo: LinkedInJobOutputSchema,
	linkedinJobSearch: LinkedInJobSearchOutputSchema,
	linkedinPostInfo: LinkedInPostOutputSchema,
	emailFinder: EmailFinderOutputSchema,
	emailVerify: EmailVerifyOutputSchema,
	emailAnalyzes: EmailAnalyzesOutputSchema,
	usageGet: UsageOutputSchema,
	jobsGet: JobStatusSchema,
};

export type PiloterrEndpointInputs = {
	[K in keyof typeof PiloterrEndpointInputSchemas]: z.input<
		(typeof PiloterrEndpointInputSchemas)[K]
	>;
};

export type PiloterrEndpointOutputs = {
	[K in keyof typeof PiloterrEndpointOutputSchemas]: z.infer<
		(typeof PiloterrEndpointOutputSchemas)[K]
	>;
};
