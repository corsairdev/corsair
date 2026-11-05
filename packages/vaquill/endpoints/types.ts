import { z } from 'zod';

const CorpusTypeSchema = z.enum([
	'USC',
	'CFR',
	'STATE',
	'CONSTITUTION',
	'FEDERAL_LOCAL_RULES',
	'FEDERAL_RULES',
	'STATE_CONSTITUTION',
	'STATE_RULES',
	'EXECUTIVE_ACTION',
	'REGULATION',
	'FEDERAL_REGISTER',
	'FEDERAL_REGISTER_NOTICE',
	'AGENCY_GUIDANCE',
	'SENTENCING_GUIDELINES',
	'US_TAX_TREATY',
	'STATE_AGENCY_GUIDANCE',
	'STATE_AG_OPINION',
	'SESSION_LAW',
	'STATE_REGISTER',
	'STATUTE_COMPILATION',
	'AGENCY_ADJUDICATION',
	'CFR_ANNUAL',
	'USC_ANNUAL',
]);

const ScopeStateSchema = z.enum([
	'federal',
	'al',
	'ak',
	'az',
	'ar',
	'as',
	'ca',
	'co',
	'ct',
	'de',
	'dc',
	'fl',
	'ga',
	'gu',
	'hi',
	'id',
	'il',
	'in',
	'ia',
	'ks',
	'ky',
	'la',
	'me',
	'md',
	'ma',
	'mi',
	'mn',
	'ms',
	'mo',
	'mp',
	'mt',
	'ne',
	'nv',
	'nh',
	'nj',
	'nm',
	'ny',
	'nc',
	'nd',
	'oh',
	'ok',
	'or',
	'pa',
	'pr',
	'ri',
	'sc',
	'sd',
	'tn',
	'tx',
	'ut',
	'vt',
	'va',
	'vi',
	'wa',
	'wv',
	'wi',
	'wy',
]);

const JurisdictionStateSchema = ScopeStateSchema.exclude(['federal']);

const ActStatusSchema = z.enum([
	'abolished',
	'deleted',
	'expired',
	'in_force',
	'inactive',
	'non_precedential',
	'not_funded',
	'not_yet_effective',
	'omitted',
	'proposed',
	'recodified',
	'recompiled',
	'rejected',
	'relocated',
	'removed',
	'renumbered',
	'repealed',
	'rescinded',
	'reserved',
	'revoked',
	'superseded',
	'terminated',
	'transferred',
	'unconstitutional',
	'vacant',
	'vacated',
	'vetoed',
	'withdrawn',
]);

/** Values that accept one entry or a list, the vendor's own shape. */
const oneOrMany = <T extends z.ZodTypeAny>(inner: T) =>
	z.union([inner, z.array(inner)]);

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/** The section identifier. Encodes the citation's hierarchy, e.g.
 *  `USC_T42_C21_S1983` is Title 42, Chapter 21, Section 1983. */
const ActIdSchema = z
	.string()
	.min(3)
	.max(200)
	.describe(
		'Section identifier, as returned on a search hit or by the citation resolver.',
	);

const StatuteSectionSchema = z.looseObject({
	actId: z.string(),
	citation: z.string().optional(),
	citationShort: z.string().nullable().optional(),
	title: z.string().nullable().optional(),
	corpusType: z.string().optional(),
	state: z.string().nullable().optional(),
	year: z.number().nullable().optional(),
	excerpt: z.string().nullable().optional(),
	body: z.string().nullable().optional(),
	titleNumber: z.union([z.string(), z.number()]).nullable().optional(),
	titleName: z.string().nullable().optional(),
	chapter: z.string().nullable().optional(),
	chapterName: z.string().nullable().optional(),
	sectionNumber: z.string().nullable().optional(),
	sectionTitle: z.string().nullable().optional(),
	displayPath: z.string().nullable().optional(),
	actStatus: z.string().nullable().optional(),
	goodLawStatus: z.string().nullable().optional(),
	effectiveDate: z.string().nullable().optional(),
	wordCount: z.number().nullable().optional(),
	htmlUrl: z.string().nullable().optional(),
	textUrl: z.string().nullable().optional(),
});
export type StatuteSection = z.infer<typeof StatuteSectionSchema>;

const SearchHitSchema = z.looseObject({
	actId: z.string(),
	citation: z.string().optional(),
	title: z.string().nullable().optional(),
	corpusType: z.string().optional(),
	state: z.string().nullable().optional(),
	excerpt: z.string().nullable().optional(),
	body: z.string().nullable().optional(),
	goodLawStatus: z.string().nullable().optional(),
});
export type SearchHit = z.infer<typeof SearchHitSchema>;

const SearchInputSchema = z.object({
	query: z.string().min(2).max(500),
	corpusType: oneOrMany(CorpusTypeSchema).optional(),
	state: oneOrMany(ScopeStateSchema).optional(),
	code: oneOrMany(z.string()).optional(),
	article: oneOrMany(z.string()).optional(),
	yearFrom: z.number().int().min(1700).max(2100).optional(),
	yearTo: z.number().int().min(1700).max(2100).optional(),
	excludeRepealed: z.boolean().optional(),
	actStatus: oneOrMany(ActStatusSchema).optional(),
	changedSince: isoDate.optional(),
	agency: oneOrMany(z.string()).optional(),
	source: z.string().optional(),
	fields: oneOrMany(z.string()).optional(),
	documentType: z.enum(['final', 'proposed', 'presidential']).optional(),
	publishedFrom: isoDate.optional(),
	publishedTo: isoDate.optional(),
	titleNumber: z.number().int().optional(),
	chapter: oneOrMany(z.string()).optional(),
	part: oneOrMany(z.string()).optional(),
	limit: z.number().int().min(1).max(50).optional(),
	/** Results to skip, for paging. `offset` + `limit` reaches 120 at most. */
	offset: z.number().int().min(0).max(70).optional(),
	includeBody: z.boolean().optional(),
	excerptChars: z.number().int().min(100).max(4000).optional(),
	matchType: z.enum(['any', 'all', 'phrase']).optional(),
});
export type SearchInput = z.infer<typeof SearchInputSchema>;

const SearchResponseSchema = z.looseObject({
	results: z.array(SearchHitSchema),
	count: z.number().optional(),
	total: z.number().optional(),
	offset: z.number().optional(),
	hasMore: z.boolean().optional(),
	noGoodMatch: z.boolean().optional(),
	matchQuality: z.string().nullable().optional(),
	citationMissReason: z.string().nullable().optional(),
	rankingDegraded: z.boolean().optional(),
	query: z.string().optional(),
	processingTimeMs: z.number().optional(),
	creditsConsumed: z.number().optional(),
});
export type SearchResponse = z.infer<typeof SearchResponseSchema>;

const CountInputSchema = z.object({
	corpusType: oneOrMany(CorpusTypeSchema).optional(),
	state: oneOrMany(ScopeStateSchema).optional(),
	code: oneOrMany(z.string()).optional(),
	article: oneOrMany(z.string()).optional(),
	titleNumber: z.number().int().optional(),
	chapter: oneOrMany(z.string()).optional(),
	part: oneOrMany(z.string()).optional(),
	actStatus: oneOrMany(ActStatusSchema).optional(),
	excludeRepealed: z.boolean().optional(),
});
export type CountInput = z.infer<typeof CountInputSchema>;

const CountResponseSchema = z.looseObject({
	count: z.number(),
	isExact: z.boolean().optional(),
	// unknown: scope echo; shape varies by corpus and is not consumed here
	scope: z.record(z.string(), z.unknown()).optional(),
	processingTimeMs: z.number().optional(),
	creditsConsumed: z.number().optional(),
});
export type CountResponse = z.infer<typeof CountResponseSchema>;

const CoverageInputSchema = z.looseObject({});
export type CoverageInput = z.infer<typeof CoverageInputSchema>;

const CoverageCorpusSchema = z.looseObject({
	token: z.string(),
	description: z.string().optional(),
	scope: z.string().optional(),
});

const CoverageJurisdictionSchema = z.looseObject({
	code: z.string(),
	name: z.string().optional(),
	kind: z.string().optional(),
	sectionCount: z.number().optional(),
	hasData: z.boolean().optional(),
	// unknown: section counts keyed by status; the key set varies by jurisdiction
	statusBreakdown: z.record(z.string(), z.unknown()).optional(),
});

const CoverageResponseSchema = z.looseObject({
	data: z.looseObject({
		corpusTypes: z.array(CoverageCorpusSchema),
		jurisdictions: z.array(CoverageJurisdictionSchema),
	}),
});
export type CoverageResponse = z.infer<typeof CoverageResponseSchema>;

const DivisionsInputSchema = z.object({
	corpusType: z.enum([
		'USC',
		'CFR',
		'STATE',
		'REGULATION',
		'CONSTITUTION',
		'STATE_CONSTITUTION',
		'FEDERAL_RULES',
	]),
	state: JurisdictionStateSchema.optional(),
	titleNumber: z.number().int().min(1).optional(),
	code: z.string().optional(),
	chapter: z.string().optional(),
	part: z.string().optional(),
	article: z.string().optional(),
	excludeRepealed: z.boolean().optional(),
	actStatus: ActStatusSchema.optional(),
	cursor: z.string().optional(),
});
export type DivisionsInput = z.infer<typeof DivisionsInputSchema>;

const DivisionSchema = z.looseObject({
	identifier: z.string(),
	name: z.string().optional(),
	kind: z.string().optional(),
	isLeaf: z.boolean().optional(),
	actId: z.string().optional(),
});

const DivisionsResponseSchema = z.looseObject({
	corpusType: z.string(),
	level: z.string().optional(),
	parentLabel: z.string().nullable().optional(),
	divisions: z.array(DivisionSchema),
	count: z.number().optional(),
	truncated: z.boolean().optional(),
	nextCursor: z.string().nullable().optional(),
	processingTimeMs: z.number().optional(),
	creditsConsumed: z.number().optional(),
});
export type DivisionsResponse = z.infer<typeof DivisionsResponseSchema>;

const ResolveInputSchema = z.object({
	citations: z.array(z.string()).min(1).max(500),
	state: JurisdictionStateSchema.optional(),
	corpusType: z
		.enum([
			'CONSTITUTION',
			'REGULATION',
			'STATE',
			'STATE_CONSTITUTION',
			'STATE_RULES',
		])
		.optional(),
});
export type ResolveInput = z.infer<typeof ResolveInputSchema>;

const ResolveResultSchema = z.looseObject({
	resolved: z.boolean(),
	inputCitation: z.string(),
	section: StatuteSectionSchema.nullable().optional(),
	// unknown: nested subsection the vendor returns on deep resolves; shape
	// varies by statute and is not consumed here
	subsection: z.unknown().optional(),
});

const ResolveResponseSchema = z.looseObject({
	results: z.array(ResolveResultSchema),
	resolvedCount: z.number().optional(),
	count: z.number().optional(),
	processingTimeMs: z.number().optional(),
	creditsConsumed: z.number().optional(),
});
export type ResolveResponse = z.infer<typeof ResolveResponseSchema>;

const SectionInputSchema = z.object({
	act_id: ActIdSchema,
});
export type SectionInput = z.infer<typeof SectionInputSchema>;

const SectionResponseSchema = z.looseObject({
	section: StatuteSectionSchema,
	processingTimeMs: z.number().optional(),
	creditsConsumed: z.number().optional(),
});
export type SectionResponse = z.infer<typeof SectionResponseSchema>;

const SectionsInputSchema = z.object({
	actIds: z.array(z.string()).min(1).max(50),
	includeBody: z.boolean().optional(),
});
export type SectionsInput = z.infer<typeof SectionsInputSchema>;

const SectionsResponseSchema = z.looseObject({
	sections: z.array(StatuteSectionSchema),
	notFound: z.array(z.string()).optional(),
	// unknown: per-act not-found detail; shape varies by failure reason
	notFoundDetail: z.array(z.unknown()).optional(),
	count: z.number().optional(),
	processingTimeMs: z.number().optional(),
	creditsConsumed: z.number().optional(),
});
export type SectionsResponse = z.infer<typeof SectionsResponseSchema>;

const SectionBodyInputSchema = z.object({
	act_id: ActIdSchema,
	/** `content` is text without notes, `operative` the enacted text alone,
	 *  `both` (default) html plus plain. */
	format: z
		.enum(['all', 'both', 'html', 'markdown', 'plain', 'content', 'operative'])
		.optional(),
	structured: z.boolean().optional(),
	asOf: isoDate.optional(),
});
export type SectionBodyInput = z.infer<typeof SectionBodyInputSchema>;

const SectionBodyResponseSchema = z.looseObject({
	actId: z.string(),
	plain: z.string().nullable().optional(),
	html: z.string().nullable().optional(),
	content: z.string().nullable().optional(),
	operative: z.string().nullable().optional(),
	markdown: z.string().nullable().optional(),
	// unknown: structured body blocks; shapes vary by statute and are not
	// consumed here
	subsections: z.array(z.unknown()).optional(),
	tables: z.array(z.unknown()).optional(),
	figures: z.array(z.unknown()).optional(),
	note: z.string().nullable().optional(),
	source: z.string().nullable().optional(),
	sourceUrl: z.string().nullable().optional(),
	available: z.boolean().optional(),
	// unknown: as-of marker echoed in varying shapes; not consumed here
	asOf: z.unknown().optional(),
	processingTimeMs: z.number().optional(),
	creditsConsumed: z.number().optional(),
});
export type SectionBodyResponse = z.infer<typeof SectionBodyResponseSchema>;

const SectionChangesInputSchema = z.object({
	act_id: ActIdSchema,
	limit: z.number().int().min(1).max(200).optional(),
	sinceId: z.number().int().min(0).optional(),
	beforeId: z.number().int().min(0).optional(),
	changeKind: z.array(z.enum(['added', 'amended', 'removed'])).optional(),
	order: z.enum(['asc', 'desc']).optional(),
});
export type SectionChangesInput = z.infer<typeof SectionChangesInputSchema>;

const SectionChangeSchema = z.looseObject({
	id: z.number(),
	changeKind: z.string().optional(),
	detectedAt: z.string().optional(),
	citation: z.string().optional(),
	displayCitation: z.string().nullable().optional(),
	title: z.string().nullable().optional(),
	hasDiff: z.boolean().optional(),
	corpusType: z.string().optional(),
	state: z.string().nullable().optional(),
});

const SectionChangesResponseSchema = z.looseObject({
	actId: z.string(),
	section: StatuteSectionSchema.optional(),
	changes: z.array(SectionChangeSchema),
	total: z.number().optional(),
	hasMore: z.boolean().optional(),
	cursor: z.number().nullable().optional(),
	observedFrom: z.string().optional(),
	coverage: z.string().optional(),
	processingTimeMs: z.number().optional(),
	creditsConsumed: z.number().optional(),
});
export type SectionChangesResponse = z.infer<
	typeof SectionChangesResponseSchema
>;

const SectionCitedByInputSchema = z.object({
	act_id: ActIdSchema,
	limit: z.number().int().min(1).max(100).optional(),
});
export type SectionCitedByInput = z.infer<typeof SectionCitedByInputSchema>;

const SectionCitedByResponseSchema = z.looseObject({
	section: StatuteSectionSchema,
	citers: z.array(SearchHitSchema),
	total: z.number().optional(),
	truncated: z.boolean().optional(),
	processingTimeMs: z.number().optional(),
	creditsConsumed: z.number().optional(),
});
export type SectionCitedByResponse = z.infer<
	typeof SectionCitedByResponseSchema
>;

const SectionCrossStateInputSchema = z.object({
	act_id: ActIdSchema,
	limit: z.number().int().min(1).max(25).optional(),
});
export type SectionCrossStateInput = z.infer<
	typeof SectionCrossStateInputSchema
>;

const CrossStateNeighborSchema = z.looseObject({
	section: StatuteSectionSchema.nullable().optional(),
	state: z.string().optional(),
	similarity: z.number().optional(),
});

const SectionCrossStateResponseSchema = z.looseObject({
	section: StatuteSectionSchema,
	neighbors: z.array(CrossStateNeighborSchema),
	statesCovered: z.number().optional(),
	processingTimeMs: z.number().optional(),
	creditsConsumed: z.number().optional(),
});
export type SectionCrossStateResponse = z.infer<
	typeof SectionCrossStateResponseSchema
>;

const SectionDefinitionsInputSchema = z.object({
	act_id: ActIdSchema,
});
export type SectionDefinitionsInput = z.infer<
	typeof SectionDefinitionsInputSchema
>;

const DefinedTermSchema = z.looseObject({
	term: z.string(),
	definition: z.string().nullable().optional(),
});

const SectionDefinitionsResponseSchema = z.looseObject({
	section: StatuteSectionSchema,
	definitionsSection: StatuteSectionSchema.nullable().optional(),
	terms: z.array(DefinedTermSchema),
	total: z.number().optional(),
	processingTimeMs: z.number().optional(),
	creditsConsumed: z.number().optional(),
});
export type SectionDefinitionsResponse = z.infer<
	typeof SectionDefinitionsResponseSchema
>;

const SectionRelatedInputSchema = z.object({
	act_id: ActIdSchema,
	limit: z.number().int().min(1).max(10).optional(),
});
export type SectionRelatedInput = z.infer<typeof SectionRelatedInputSchema>;

const SectionRelatedResponseSchema = z.looseObject({
	section: StatuteSectionSchema,
	previous: z.array(StatuteSectionSchema),
	next: z.array(StatuteSectionSchema),
	container: z.string().nullable().optional(),
	processingTimeMs: z.number().optional(),
	creditsConsumed: z.number().optional(),
});
export type SectionRelatedResponse = z.infer<
	typeof SectionRelatedResponseSchema
>;

const ResolveCitationInputSchema = z.object({
	cite: z.string().min(1),
	state: JurisdictionStateSchema.optional(),
	corpusType: z
		.enum([
			'CONSTITUTION',
			'REGULATION',
			'STATE',
			'STATE_CONSTITUTION',
			'STATE_RULES',
		])
		.optional(),
});
export type ResolveCitationInput = z.infer<typeof ResolveCitationInputSchema>;

const ResolveCitationResponseSchema = z.looseObject({
	resolved: z.boolean(),
	inputCitation: z.string().optional(),
	section: StatuteSectionSchema.nullable().optional(),
	// unknown: nested subsection; shape varies by statute and is not consumed
	// here
	subsection: z.unknown().optional(),
	matchLevel: z.string().nullable().optional(),
	missReason: z.string().nullable().optional(),
	// unknown: near-match candidates; shape varies by miss reason
	candidates: z.array(z.unknown()).optional(),
	creditsConsumed: z.number().optional(),
	processingTimeMs: z.number().optional(),
});
export type ResolveCitationResponse = z.infer<
	typeof ResolveCitationResponseSchema
>;

const EnactmentsInputSchema = z.object({
	act_id: ActIdSchema,
});
export type EnactmentsInput = z.infer<typeof EnactmentsInputSchema>;

const EnactmentSchema = z.looseObject({
	sessionLawId: z.string().nullable().optional(),
	href: z.string().nullable().optional(),
	citation: z.string().nullable().optional(),
	title: z.string().nullable().optional(),
	approvedDate: z.string().nullable().optional(),
	action: z.string().nullable().optional(),
	matchQuality: z.string().nullable().optional(),
	textStatus: z.string().nullable().optional(),
});

const EnactmentsResponseSchema = z.looseObject({
	actId: z.string(),
	jurisdiction: z.string().nullable().optional(),
	supported: z.boolean().optional(),
	reason: z.string().nullable().optional(),
	enactments: z.array(EnactmentSchema),
	count: z.number().optional(),
	truncated: z.boolean().optional(),
	creditsConsumed: z.number().optional(),
	processingTimeMs: z.number().optional(),
});
export type EnactmentsResponse = z.infer<typeof EnactmentsResponseSchema>;

const ExtractCitationsInputSchema = z.object({
	text: z.string().min(1),
	state: JurisdictionStateSchema.optional(),
	resolve: z.boolean().optional(),
	includeUnresolved: z.boolean().optional(),
});
export type ExtractCitationsInput = z.infer<typeof ExtractCitationsInputSchema>;

const ExtractedCitationSchema = z.looseObject({
	citation: z.string(),
	resolved: z.boolean().optional(),
	section: StatuteSectionSchema.nullable().optional(),
});

const ExtractCitationsResponseSchema = z.looseObject({
	citations: z.array(ExtractedCitationSchema),
	// unknown: citation counts keyed by extractor; only counts.found is read
	counts: z.record(z.string(), z.unknown()).optional(),
	truncated: z.boolean().optional(),
	textChars: z.number().optional(),
	extractorVersion: z.string().optional(),
	creditsConsumed: z.number().optional(),
	processingTimeMs: z.number().optional(),
});
export type ExtractCitationsResponse = z.infer<
	typeof ExtractCitationsResponseSchema
>;

const SessionLawSchema = z.looseObject({
	sessionLawId: z.string(),
	jurisdiction: z.string().optional(),
	citation: z.string().nullable().optional(),
	citableAs: z.string().nullable().optional(),
	citationShort: z.string().nullable().optional(),
	session: z.string().nullable().optional(),
	series: z.string().nullable().optional(),
	instrumentType: z.string().nullable().optional(),
	number: z.string().nullable().optional(),
	title: z.string().nullable().optional(),
	shortTitle: z.string().nullable().optional(),
	approvedDate: z.string().nullable().optional(),
	effectiveFirst: z.string().nullable().optional(),
	effectiveLast: z.string().nullable().optional(),
	enactmentOutcome: z.string().nullable().optional(),
	isLaw: z.boolean().nullable().optional(),
	textStatus: z.string().nullable().optional(),
	charCount: z.number().nullable().optional(),
	updatedAt: z.string().nullable().optional(),
});
export type SessionLaw = z.infer<typeof SessionLawSchema>;

const SessionLawsChangesInputSchema = z.object({
	sinceId: z.number().int().min(0).optional(),
	jurisdiction: JurisdictionStateSchema.optional(),
	limit: z.number().int().min(1).max(200).optional(),
});
export type SessionLawsChangesInput = z.infer<
	typeof SessionLawsChangesInputSchema
>;

const SessionLawChangeSchema = z.looseObject({
	id: z.number(),
	jurisdiction: z.string().nullable().optional(),
	changeKind: z.string().nullable().optional(),
	sessionLawId: z.string().nullable().optional(),
	citation: z.string().nullable().optional(),
	title: z.string().nullable().optional(),
	detectedAt: z.string().nullable().optional(),
});

const SessionLawsChangesResponseSchema = z.looseObject({
	changes: z.array(SessionLawChangeSchema),
	count: z.number().optional(),
	cursor: z.number().nullable().optional(),
	hasMore: z.boolean().optional(),
	creditsConsumed: z.number().optional(),
	processingTimeMs: z.number().optional(),
});
export type SessionLawsChangesResponse = z.infer<
	typeof SessionLawsChangesResponseSchema
>;

const SessionLawsBatchInputSchema = z.object({
	/** Session-law ids or citations. */
	ids: z.array(z.string()).min(1).max(50),
	jurisdiction: JurisdictionStateSchema.optional(),
	includeBody: z.boolean().optional(),
});
export type SessionLawsBatchInput = z.infer<typeof SessionLawsBatchInputSchema>;

const SessionLawsBatchResponseSchema = z.looseObject({
	laws: z.array(SessionLawSchema),
	// unknown: ids the batch could not expand; shape varies by failure
	resolved: z.array(z.unknown()).optional(),
	notFound: z.array(z.string()).optional(),
	count: z.number().optional(),
	deduped: z.number().optional(),
	creditsConsumed: z.number().optional(),
	processingTimeMs: z.number().optional(),
});
export type SessionLawsBatchResponse = z.infer<
	typeof SessionLawsBatchResponseSchema
>;

const SessionLawsSearchInputSchema = z.object({
	query: z.string().min(2).max(500),
	jurisdiction: JurisdictionStateSchema.optional(),
	session: z.string().optional(),
	series: z.string().optional(),
	instrumentType: z.string().optional(),
	approvedFrom: isoDate.optional(),
	approvedTo: isoDate.optional(),
	limit: z.number().int().min(1).max(25).optional(),
	/** Results to skip, for paging. `offset` + `limit` reaches 84 at most. */
	offset: z.number().int().min(0).max(59).optional(),
});
export type SessionLawsSearchInput = z.infer<
	typeof SessionLawsSearchInputSchema
>;

const SessionLawsSearchResponseSchema = z.looseObject({
	query: z.string().optional(),
	// unknown: parsed-query echo; shape varies by parser version
	parsed: z.unknown().optional(),
	results: z.array(SessionLawSchema),
	count: z.number().optional(),
	offset: z.number().optional(),
	limit: z.number().optional(),
	hasMore: z.boolean().optional(),
	creditsConsumed: z.number().optional(),
	processingTimeMs: z.number().optional(),
});
export type SessionLawsSearchResponse = z.infer<
	typeof SessionLawsSearchResponseSchema
>;

const SessionLawsListInputSchema = z.object({
	jurisdiction: JurisdictionStateSchema,
	session: z.string().optional(),
	series: z.string().optional(),
	instrumentType: z.string().optional(),
	approvedFrom: isoDate.optional(),
	approvedTo: isoDate.optional(),
	effectiveFrom: isoDate.optional(),
	effectiveTo: isoDate.optional(),
	hasText: z.boolean().optional(),
	textStatus: z.enum(['held', 'withheld', 'not_held', 'pending']).optional(),
	isLaw: z.boolean().optional(),
	enactmentOutcome: z.string().optional(),
	updatedSince: isoDate.optional(),
	q: z.string().optional(),
	cursor: z.string().optional(),
	limit: z.number().int().min(1).max(200).optional(),
});
export type SessionLawsListInput = z.infer<typeof SessionLawsListInputSchema>;

const SessionLawsListResponseSchema = z.looseObject({
	results: z.array(SessionLawSchema),
	count: z.number().optional(),
	nextCursor: z.string().nullable().optional(),
	hasMore: z.boolean().optional(),
	// unknown: corpus coverage summary; the vendor does not document its shape
	coverage: z.unknown().optional(),
	creditsConsumed: z.number().optional(),
	processingTimeMs: z.number().optional(),
});
export type SessionLawsListResponse = z.infer<
	typeof SessionLawsListResponseSchema
>;

const SessionLawBodyInputSchema = z.object({
	session_law_id: z.string().min(1),
	cursor: z.string().optional(),
	startChar: z.number().int().min(0).optional(),
	expectTextSha256: z.string().optional(),
});
export type SessionLawBodyInput = z.infer<typeof SessionLawBodyInputSchema>;

const SessionLawBodyResponseSchema = z.looseObject({
	sessionLawId: z.string(),
	citation: z.string().nullable().optional(),
	jurisdiction: z.string().nullable().optional(),
	session: z.string().nullable().optional(),
	approvedDate: z.string().nullable().optional(),
	sourceUrl: z.string().nullable().optional(),
	available: z.boolean().optional(),
	reason: z.string().nullable().optional(),
	textStatus: z.string().nullable().optional(),
	withheldReason: z.string().nullable().optional(),
	text: z.string().nullable().optional(),
	creditsConsumed: z.number().optional(),
	processingTimeMs: z.number().optional(),
});
export type SessionLawBodyResponse = z.infer<
	typeof SessionLawBodyResponseSchema
>;

const SessionLawInputSchema = z.object({
	/** A session-law id or a citation string. */
	session_law_id: z.string().min(1),
	jurisdiction: JurisdictionStateSchema.optional(),
});
export type SessionLawInput = z.infer<typeof SessionLawInputSchema>;

const SessionLawResponseSchema = z.looseObject({
	sessionLawId: z.string().optional(),
	lawId: z.string().nullable().optional(),
	jurisdiction: z.string().nullable().optional(),
	citation: z.string().nullable().optional(),
	citableAs: z.string().nullable().optional(),
	citationShort: z.string().nullable().optional(),
	session: z.string().nullable().optional(),
	series: z.string().nullable().optional(),
	instrumentType: z.string().nullable().optional(),
	title: z.string().nullable().optional(),
	shortTitle: z.string().nullable().optional(),
	approvedDate: z.string().nullable().optional(),
	// unknown: enactment and amendment detail; shapes vary by jurisdiction
	effectiveDates: z.array(z.unknown()).optional(),
	codeSectionsAffected: z.array(z.unknown()).optional(),
	sourceUrl: z.string().nullable().optional(),
	textStatus: z.string().nullable().optional(),
	creditsConsumed: z.number().optional(),
	processingTimeMs: z.number().optional(),
});
export type SessionLawResponse = z.infer<typeof SessionLawResponseSchema>;

const BoardsInputSchema = z.object({
	corpusType: z.string().optional(),
	/** Filter to one jurisdiction. `state=federal` names the federal boards. */
	state: ScopeStateSchema.optional(),
	limit: z.number().int().min(1).max(500).optional(),
	offset: z.number().int().min(0).optional(),
});
export type BoardsInput = z.infer<typeof BoardsInputSchema>;

const BoardSchema = z.looseObject({
	corpusType: z.string(),
	state: z.string().nullable().optional(),
	label: z.string().optional(),
	cadence: z.string().optional(),
	scopable: z.boolean().optional(),
	scopeBrowseCorpus: z.string().nullable().optional(),
});

const BoardsResponseSchema = z.looseObject({
	data: z.looseObject({
		boards: z.array(BoardSchema),
		total: z.number().optional(),
		hasMore: z.boolean().optional(),
	}),
	meta: z
		.looseObject({
			processingTimeMs: z.number().optional(),
			creditsConsumed: z.number().optional(),
		})
		.optional(),
});
export type BoardsResponse = z.infer<typeof BoardsResponseSchema>;

const WatchesListInputSchema = z.object({
	limit: z.number().int().min(1).max(200).optional(),
	offset: z.number().int().min(0).optional(),
});
export type WatchesListInput = z.infer<typeof WatchesListInputSchema>;

const WatchSchema = z.looseObject({
	id: z.union([z.string(), z.number()]),
	corpusType: z.string().optional(),
	state: z.string().nullable().optional(),
	channel: z.string().optional(),
	isActive: z.boolean().optional(),
	// unknown: scope object; values differ across the four watch forms
	scope: z.record(z.string(), z.unknown()).nullable().optional(),
	createdAt: z.string().nullable().optional(),
});

const WatchesListResponseSchema = z.looseObject({
	data: z
		.looseObject({
			watches: z.array(WatchSchema).optional(),
			total: z.number().optional(),
			hasMore: z.boolean().optional(),
		})
		.optional(),
	// unknown: paging and request metadata; keys vary by endpoint
	meta: z.unknown().optional(),
});
export type WatchesListResponse = z.infer<typeof WatchesListResponseSchema>;

const WatchesCreateInputSchema = z.object({
	corpusType: z.string().min(1),
	/** The board's state; `federal` names a federal board. Omit for an
	 *  unscoped board. */
	state: ScopeStateSchema.optional(),
	channel: z.enum(['webhook', 'email', 'both']).optional(),
	webhookUrl: z.string().optional(),
	webhookSecret: z.string().optional(),
	emailAddress: z.string().optional(),
	/** Optional narrowing, e.g. `{"title": "21", "part": "314"}` or
	 *  `{"actId": "..."}`. Four mutually exclusive forms. */
	scope: z.record(z.string(), z.string()).optional(),
	// unknown: webhook auth credentials; shape varies by channel setup
	webhookAuth: z.record(z.string(), z.unknown()).optional(),
});
export type WatchesCreateInput = z.infer<typeof WatchesCreateInputSchema>;

const WatchesCreateResponseSchema = z.looseObject({
	data: z.looseObject({ watch: WatchSchema.nullable().optional() }).optional(),
});
export type WatchesCreateResponse = z.infer<typeof WatchesCreateResponseSchema>;

const WatchesTestInputSchema = z.object({
	watch_id: z.string().min(1),
});
export type WatchesTestInput = z.infer<typeof WatchesTestInputSchema>;

const WatchesTestResponseSchema = z.looseObject({
	// unknown: test-delivery result; shape varies by channel
	data: z.unknown().optional(),
});
export type WatchesTestResponse = z.infer<typeof WatchesTestResponseSchema>;

const WatchesUpdateInputSchema = z.object({
	watch_id: z.string().min(1),
	isActive: z.boolean().optional(),
	webhookUrl: z.string().optional(),
	webhookSecret: z.string().optional(),
	scope: z.record(z.string(), z.string()).nullable().optional(),
	emailAddress: z.string().optional(),
	// unknown: webhook auth credentials; shape varies by channel setup
	webhookAuth: z.record(z.string(), z.unknown()).nullable().optional(),
});
export type WatchesUpdateInput = z.infer<typeof WatchesUpdateInputSchema>;

const WatchesUpdateResponseSchema = z.looseObject({
	data: z.looseObject({ watch: WatchSchema.nullable().optional() }).optional(),
});
export type WatchesUpdateResponse = z.infer<typeof WatchesUpdateResponseSchema>;

const WatchesDeleteInputSchema = z.object({
	watch_id: z.string().min(1),
});
export type WatchesDeleteInput = z.infer<typeof WatchesDeleteInputSchema>;

/** The API answers 204 with no body, so normalize the absent body to an
 *  empty object rather than `undefined`. */
const WatchesDeleteResponseSchema = z
	.looseObject({})
	.optional()
	.transform(() => ({}));
export type WatchesDeleteResponse = z.infer<typeof WatchesDeleteResponseSchema>;

const WatchChangesInputSchema = z.object({
	watch_id: z.string().min(1),
	limit: z.number().int().min(1).max(200).optional(),
	sinceId: z.number().int().min(0).optional(),
	beforeId: z.number().int().min(0).optional(),
	since: z.string().optional(),
	changeKind: z.array(z.enum(['added', 'amended', 'removed'])).optional(),
	order: z.enum(['asc', 'desc']).optional(),
});
export type WatchChangesInput = z.infer<typeof WatchChangesInputSchema>;

const WatchChangeSchema = z.looseObject({
	id: z.number(),
	refreshLogId: z.number().nullable().optional(),
	corpusType: z.string().nullable().optional(),
	state: z.string().nullable().optional(),
	changeKind: z.string().nullable().optional(),
	actId: z.string().nullable().optional(),
	citation: z.string().nullable().optional(),
	title: z.string().nullable().optional(),
	detectedAt: z.string().nullable().optional(),
	hasDiff: z.boolean().optional(),
});

const WatchChangesResponseSchema = z.looseObject({
	data: z.looseObject({ changes: z.array(WatchChangeSchema) }),
	meta: z
		.looseObject({
			processingTimeMs: z.number().optional(),
			creditsConsumed: z.number().optional(),
			cursor: z.number().nullable().optional(),
			hasMore: z.boolean().optional(),
		})
		.optional(),
});
export type WatchChangesResponse = z.infer<typeof WatchChangesResponseSchema>;

const WatchChangeDiffInputSchema = z.object({
	watch_id: z.string().min(1),
	change_id: z.number().int().min(0),
});
export type WatchChangeDiffInput = z.infer<typeof WatchChangeDiffInputSchema>;

const WatchChangeDiffResponseSchema = z.looseObject({
	data: z.looseObject({
		changeId: z.union([z.string(), z.number()]).optional(),
		changeKind: z.string().nullable().optional(),
		beforeText: z.string().nullable().optional(),
		afterText: z.string().nullable().optional(),
		hasBefore: z.boolean().optional(),
		hasAfter: z.boolean().optional(),
	}),
	// unknown: request metadata; keys vary by endpoint
	meta: z.unknown().optional(),
});
export type WatchChangeDiffResponse = z.infer<
	typeof WatchChangeDiffResponseSchema
>;

const WatchDeliveriesInputSchema = z.object({
	watch_id: z.string().min(1),
	limit: z.number().int().min(1).max(200).optional(),
});
export type WatchDeliveriesInput = z.infer<typeof WatchDeliveriesInputSchema>;

const WatchDeliverySchema = z.looseObject({
	deliveryId: z.string().nullable().optional(),
	status: z.string().nullable().optional(),
	firedAt: z.string().nullable().optional(),
});

const WatchDeliveriesResponseSchema = z.looseObject({
	data: z.looseObject({ deliveries: z.array(WatchDeliverySchema) }),
	// unknown: paging metadata; keys vary by endpoint
	meta: z.unknown().optional(),
});
export type WatchDeliveriesResponse = z.infer<
	typeof WatchDeliveriesResponseSchema
>;

const CreditsBalanceInputSchema = z.looseObject({});
export type CreditsBalanceInput = z.infer<typeof CreditsBalanceInputSchema>;

const CreditsBalanceResponseSchema = z.looseObject({
	creditsRemaining: z.number().optional(),
	usdRemaining: z.number().nullable().optional(),
	// unknown: credit totals keyed by source; keys vary by plan
	bySource: z.unknown().optional(),
	nextExpiry: z
		.looseObject({
			at: z.string().optional(),
			credits: z.number().optional(),
		})
		.nullable()
		.optional(),
	plan: z.string().nullable().optional(),
	totalPurchased: z.number().optional(),
	totalConsumed: z.number().optional(),
	// unknown: rate-limit state; keys vary by plan
	rateLimit: z.unknown().optional(),
	asOf: z.string().optional(),
});
export type CreditsBalanceResponse = z.infer<
	typeof CreditsBalanceResponseSchema
>;

const CreditsPricingInputSchema = z.object({
	region: z.string().optional(),
});
export type CreditsPricingInput = z.infer<typeof CreditsPricingInputSchema>;

const CreditsPricingResponseSchema = z.looseObject({
	dollarPerCredit: z.number().optional(),
	minCredits: z.number().optional(),
	maxCredits: z.number().optional(),
	// unknown: per-tier pricing detail; keys vary by region
	costs: z.unknown().optional(),
});
export type CreditsPricingResponse = z.infer<
	typeof CreditsPricingResponseSchema
>;

export type VaquillEndpointInputs = {
	search: SearchInput;
	count: CountInput;
	coverage: CoverageInput;
	divisions: DivisionsInput;
	resolve: ResolveInput;
	resolveCitation: ResolveCitationInput;
	section: SectionInput;
	sections: SectionsInput;
	sectionBody: SectionBodyInput;
	sectionChanges: SectionChangesInput;
	sectionCitedBy: SectionCitedByInput;
	sectionCrossState: SectionCrossStateInput;
	sectionDefinitions: SectionDefinitionsInput;
	sectionRelated: SectionRelatedInput;
	enactments: EnactmentsInput;
	extractCitations: ExtractCitationsInput;
	sessionLawsChanges: SessionLawsChangesInput;
	sessionLawsBatch: SessionLawsBatchInput;
	sessionLawsSearch: SessionLawsSearchInput;
	sessionLawsList: SessionLawsListInput;
	sessionLawBody: SessionLawBodyInput;
	sessionLaw: SessionLawInput;
	boards: BoardsInput;
	watchesList: WatchesListInput;
	watchesCreate: WatchesCreateInput;
	watchesTest: WatchesTestInput;
	watchesUpdate: WatchesUpdateInput;
	watchesDelete: WatchesDeleteInput;
	watchChanges: WatchChangesInput;
	watchChangeDiff: WatchChangeDiffInput;
	watchDeliveries: WatchDeliveriesInput;
	creditsBalance: CreditsBalanceInput;
	creditsPricing: CreditsPricingInput;
};

export type VaquillEndpointOutputs = {
	search: SearchResponse;
	count: CountResponse;
	coverage: CoverageResponse;
	divisions: DivisionsResponse;
	resolve: ResolveResponse;
	resolveCitation: ResolveCitationResponse;
	section: SectionResponse;
	sections: SectionsResponse;
	sectionBody: SectionBodyResponse;
	sectionChanges: SectionChangesResponse;
	sectionCitedBy: SectionCitedByResponse;
	sectionCrossState: SectionCrossStateResponse;
	sectionDefinitions: SectionDefinitionsResponse;
	sectionRelated: SectionRelatedResponse;
	enactments: EnactmentsResponse;
	extractCitations: ExtractCitationsResponse;
	sessionLawsChanges: SessionLawsChangesResponse;
	sessionLawsBatch: SessionLawsBatchResponse;
	sessionLawsSearch: SessionLawsSearchResponse;
	sessionLawsList: SessionLawsListResponse;
	sessionLawBody: SessionLawBodyResponse;
	sessionLaw: SessionLawResponse;
	boards: BoardsResponse;
	watchesList: WatchesListResponse;
	watchesCreate: WatchesCreateResponse;
	watchesTest: WatchesTestResponse;
	watchesUpdate: WatchesUpdateResponse;
	watchesDelete: WatchesDeleteResponse;
	watchChanges: WatchChangesResponse;
	watchChangeDiff: WatchChangeDiffResponse;
	watchDeliveries: WatchDeliveriesResponse;
	creditsBalance: CreditsBalanceResponse;
	creditsPricing: CreditsPricingResponse;
};

export const VaquillEndpointInputSchemas = {
	search: SearchInputSchema,
	count: CountInputSchema,
	coverage: CoverageInputSchema,
	divisions: DivisionsInputSchema,
	resolve: ResolveInputSchema,
	resolveCitation: ResolveCitationInputSchema,
	section: SectionInputSchema,
	sections: SectionsInputSchema,
	sectionBody: SectionBodyInputSchema,
	sectionChanges: SectionChangesInputSchema,
	sectionCitedBy: SectionCitedByInputSchema,
	sectionCrossState: SectionCrossStateInputSchema,
	sectionDefinitions: SectionDefinitionsInputSchema,
	sectionRelated: SectionRelatedInputSchema,
	enactments: EnactmentsInputSchema,
	extractCitations: ExtractCitationsInputSchema,
	sessionLawsChanges: SessionLawsChangesInputSchema,
	sessionLawsBatch: SessionLawsBatchInputSchema,
	sessionLawsSearch: SessionLawsSearchInputSchema,
	sessionLawsList: SessionLawsListInputSchema,
	sessionLawBody: SessionLawBodyInputSchema,
	sessionLaw: SessionLawInputSchema,
	boards: BoardsInputSchema,
	watchesList: WatchesListInputSchema,
	watchesCreate: WatchesCreateInputSchema,
	watchesTest: WatchesTestInputSchema,
	watchesUpdate: WatchesUpdateInputSchema,
	watchesDelete: WatchesDeleteInputSchema,
	watchChanges: WatchChangesInputSchema,
	watchChangeDiff: WatchChangeDiffInputSchema,
	watchDeliveries: WatchDeliveriesInputSchema,
	creditsBalance: CreditsBalanceInputSchema,
	creditsPricing: CreditsPricingInputSchema,
} as const;

export const VaquillEndpointOutputSchemas = {
	search: SearchResponseSchema,
	count: CountResponseSchema,
	coverage: CoverageResponseSchema,
	divisions: DivisionsResponseSchema,
	resolve: ResolveResponseSchema,
	resolveCitation: ResolveCitationResponseSchema,
	section: SectionResponseSchema,
	sections: SectionsResponseSchema,
	sectionBody: SectionBodyResponseSchema,
	sectionChanges: SectionChangesResponseSchema,
	sectionCitedBy: SectionCitedByResponseSchema,
	sectionCrossState: SectionCrossStateResponseSchema,
	sectionDefinitions: SectionDefinitionsResponseSchema,
	sectionRelated: SectionRelatedResponseSchema,
	enactments: EnactmentsResponseSchema,
	extractCitations: ExtractCitationsResponseSchema,
	sessionLawsChanges: SessionLawsChangesResponseSchema,
	sessionLawsBatch: SessionLawsBatchResponseSchema,
	sessionLawsSearch: SessionLawsSearchResponseSchema,
	sessionLawsList: SessionLawsListResponseSchema,
	sessionLawBody: SessionLawBodyResponseSchema,
	sessionLaw: SessionLawResponseSchema,
	boards: BoardsResponseSchema,
	watchesList: WatchesListResponseSchema,
	watchesCreate: WatchesCreateResponseSchema,
	watchesTest: WatchesTestResponseSchema,
	watchesUpdate: WatchesUpdateResponseSchema,
	watchesDelete: WatchesDeleteResponseSchema,
	watchChanges: WatchChangesResponseSchema,
	watchChangeDiff: WatchChangeDiffResponseSchema,
	watchDeliveries: WatchDeliveriesResponseSchema,
	creditsBalance: CreditsBalanceResponseSchema,
	creditsPricing: CreditsPricingResponseSchema,
} as const;
