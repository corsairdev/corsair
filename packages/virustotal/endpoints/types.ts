import { z } from 'zod';

// Inputs use VirusTotal's own parameter names. Outputs are `.loose()` and their
// documented fields nullish.
// Reference: https://docs.virustotal.com/reference/overview

/**
 * Every object comes back in the JSON:API envelope `{ data: { type, id,
 * attributes, relationships, links } }`, and a list adds `meta.cursor` rather
 * than a `next` link. Both are modelled once and reused.
 */
const FileObjectSchema = z
	.object({
		type: z.literal('file').nullish(),
		id: z.string().nullish().describe('The SHA-256 of the file.'),
		attributes: z
			.object({
				// The names are VirusTotal's own snake_case keys; a file report has
				// over a hundred, so the common ones are named and the rest pass.
				meaningful_name: z.string().nullish(),
				type_description: z.string().nullish(),
				type_tag: z.string().nullish(),
				size: z.number().nullish(),
				names: z.array(z.string()).nullish(),
				md5: z.string().nullish(),
				sha1: z.string().nullish(),
				sha256: z.string().nullish(),
				ssdeep: z.string().nullish(),
				tlsh: z.string().nullish(),
				first_submission_date: z.number().nullish(),
				last_submission_date: z.number().nullish(),
				last_analysis_date: z.number().nullish(),
				reputation: z.number().nullish(),
				tags: z.array(z.string()).nullish(),
				// The per-engine verdicts and the tallies, which is what a caller
				// usually wants from a file report.
				last_analysis_results: z.record(z.string(), z.unknown()).nullish(),
				last_analysis_stats: z
					.object({
						harmless: z.number().nullish(),
						// Hyphenated on a file report (an analysis's stats use underscores).
						'type-unsupported': z.number().nullish(),
						'confirmed-timeout': z.number().nullish(),
						suspicious: z.number().nullish(),
						undetected: z.number().nullish(),
						timeout: z.number().nullish(),
						failure: z.number().nullish(),
						malicious: z.number().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
		relationships: z.record(z.string(), z.unknown()).nullish(),
		// unknown: HATEOAS links, whose keys are arbitrary relationship names and
		// whose values are URLs; the shape belongs to VirusTotal, not to us.
		links: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type VirustotalFile = z.infer<typeof FileObjectSchema>;

const UrlObjectSchema = z
	.object({
		type: z.literal('url').nullish(),
		id: z
			.string()
			.nullish()
			.describe(
				'The SHA-256 of the canonical URL. `urls.get` also takes the base64url id from `urlId()`.',
			),
		attributes: z
			.object({
				url: z.string().nullish(),
				final_url: z.string().nullish(),
				title: z.string().nullish(),
				first_submission_date: z.number().nullish(),
				last_analysis_date: z.number().nullish(),
				last_final_url: z.string().nullish(),
				reputation: z.number().nullish(),
				tags: z.array(z.string()).nullish(),
				threat_names: z.array(z.string()).nullish(),
				categories: z.record(z.string(), z.string()).nullish(),
				last_analysis_results: z.record(z.string(), z.unknown()).nullish(),
				last_analysis_stats: z
					.object({
						harmless: z.number().nullish(),
						suspicious: z.number().nullish(),
						undetected: z.number().nullish(),
						timeout: z.number().nullish(),
						malicious: z.number().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
		relationships: z.record(z.string(), z.unknown()).nullish(),
		// unknown: HATEOAS links, whose keys are arbitrary relationship names and
		// whose values are URLs; the shape belongs to VirusTotal, not to us.
		links: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type VirustotalUrl = z.infer<typeof UrlObjectSchema>;

const DomainObjectSchema = z
	.object({
		type: z.literal('domain').nullish(),
		id: z.string().nullish(),
		attributes: z
			.object({
				registrar: z.string().nullish(),
				creation_date: z.number().nullish(),
				last_update_date: z.number().nullish(),
				expiration_date: z.number().nullish(),
				categories: z.record(z.string(), z.string()).nullish(),
				reputation: z.number().nullish(),
				tags: z.array(z.string()).nullish(),
				// The IPs the domain currently resolves to.
				last_dns_records: z.array(z.unknown()).nullish(),
				last_dns_records_date: z.number().nullish(),
				last_analysis_stats: z
					.object({
						harmless: z.number().nullish(),
						suspicious: z.number().nullish(),
						undetected: z.number().nullish(),
						timeout: z.number().nullish(),
						malicious: z.number().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
		relationships: z.record(z.string(), z.unknown()).nullish(),
		// unknown: HATEOAS links, whose keys are arbitrary relationship names and
		// whose values are URLs; the shape belongs to VirusTotal, not to us.
		links: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type VirustotalDomain = z.infer<typeof DomainObjectSchema>;

const IpAddressObjectSchema = z
	.object({
		type: z.literal('ip_address').nullish(),
		id: z.string().nullish().describe('The IP address itself.'),
		attributes: z
			.object({
				country: z.string().nullish(),
				continent: z.string().nullish(),
				as_owner: z.string().nullish(),
				asn: z.number().nullish(),
				network: z.string().nullish(),
				regional_internet_registry: z.string().nullish(),
				reputation: z.number().nullish(),
				tags: z.array(z.string()).nullish(),
				last_analysis_date: z.number().nullish(),
				last_analysis_results: z.record(z.string(), z.unknown()).nullish(),
				last_analysis_stats: z
					.object({
						harmless: z.number().nullish(),
						suspicious: z.number().nullish(),
						undetected: z.number().nullish(),
						timeout: z.number().nullish(),
						malicious: z.number().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
		relationships: z.record(z.string(), z.unknown()).nullish(),
		// unknown: HATEOAS links, whose keys are arbitrary relationship names and
		// whose values are URLs; the shape belongs to VirusTotal, not to us.
		links: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type VirustotalIpAddress = z.infer<typeof IpAddressObjectSchema>;

/**
 * An analysis is created by scanning, and reports progress in its `status`: it
 * moves from `queued` to `completed`, so a scan returns an id to poll rather
 * than a verdict.
 */
const AnalysisObjectSchema = z
	.object({
		// `analysis` for a file, `url_analysis` for a URL, `netloc_analysis` for a
		// domain or an IP (seen live 11-12), so it is not a single literal.
		type: z
			.string()
			.nullish()
			.describe('analysis, url_analysis or netloc_analysis.'),
		id: z.string().nullish().describe('Pass this to analyses.get.'),
		attributes: z
			.object({
				status: z
					.string()
					.nullish()
					.describe('queued, in-progress or completed.'),
				date: z.number().nullish(),
				stats: z.record(z.string(), z.unknown()).nullish(),
				results: z.record(z.string(), z.unknown()).nullish(),
			})
			.loose()
			.nullish(),
		// unknown: HATEOAS links, whose keys are arbitrary relationship names and
		// whose values are URLs; the shape belongs to VirusTotal, not to us.
		links: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type VirustotalAnalysis = z.infer<typeof AnalysisObjectSchema>;

const CommentSchema = z
	.object({
		type: z.literal('comment').nullish(),
		id: z.string().nullish(),
		attributes: z
			.object({
				text: z.string().nullish(),
				html: z.string().nullish(),
				date: z.number().nullish(),
				tags: z.array(z.string()).nullish(),
				votes: z
					.object({
						positive: z.number().nullish(),
						negative: z.number().nullish(),
						abuse: z.number().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
		// unknown: HATEOAS links, whose keys are arbitrary relationship names and
		// whose values are URLs; the shape belongs to VirusTotal, not to us.
		links: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type VirustotalComment = z.infer<typeof CommentSchema>;

/** A comment list pages with `meta.cursor`, not a `next` link. */
const CommentsCollectionSchema = z
	.object({
		data: z.array(CommentSchema).nullish(),
		meta: z
			.object({
				cursor: z
					.string()
					.nullish()
					.describe('Pass this as `cursor` to read the next page.'),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type VirustotalComments = z.infer<typeof CommentsCollectionSchema>;

const VoteSchema = z
	.object({
		type: z.literal('vote').nullish(),
		id: z.string().nullish(),
		attributes: z
			.object({
				// Output stays open: an unknown verdict must not fail the read.
				verdict: z
					.union([z.enum(['malicious', 'harmless']), z.string()])
					.nullish(),
				date: z.number().nullish(),
			})
			.loose()
			.nullish(),
		// unknown: HATEOAS links, whose keys are arbitrary relationship names and
		// whose values are URLs; the shape belongs to VirusTotal, not to us.
		links: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type VirustotalVote = z.infer<typeof VoteSchema>;

/**
 * Votes come back with a `meta.cursor` too, but the documented collection is
 * `{ data, links }` — so both are accepted and neither is required.
 */
const VotesCollectionSchema = z
	.object({
		data: z.array(VoteSchema).nullish(),
		meta: z.object({ cursor: z.string().nullish() }).loose().nullish(),
		// unknown: HATEOAS links, whose keys are arbitrary relationship names and
		// whose values are URLs; the shape belongs to VirusTotal, not to us.
		links: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type VirustotalVotes = z.infer<typeof VotesCollectionSchema>;

/**
 * The descriptor a scan or rescan returns. `id` is what `analyses.get` takes, so it
 * is required: an empty `data: {}` with a 200 would otherwise be logged as a
 * completed scan that handed the caller no way to read the result.
 */
const DescriptorSchema = z
	.object({
		data: z
			.object({
				type: z.string(),
				id: z.string().min(1),
			})
			.loose(),
	})
	.loose();

export type VirustotalDescriptor = z.infer<typeof DescriptorSchema>;

// ── shared inputs ─────────────────────────────────────────────────────────

/**
 * A file is addressed by any of its hashes. The id is the SHA-256, but the
 * API resolves MD5 and SHA-1 too, so the input is a plain string.
 */
const FileIdSchema = z
	.string()
	.min(1)
	.describe('A SHA-256, SHA-1 or MD5 hash identifying the file.');

const UrlIdSchema = z
	.string()
	.min(1)
	.describe(
		'The URL identifier: the URL as unpadded base64url, which `urlId()` produces from a raw URL.',
	);

const PagingSchema = {
	limit: z
		.number()
		.int()
		.min(1)
		.max(40)
		.optional()
		.describe('Items per page. VirusTotal caps this at 40.'),
	cursor: z
		.string()
		.optional()
		.describe('The `meta.cursor` from the previous page.'),
};

// ── files ─────────────────────────────────────────────────────────────────

const FilesGetInputSchema = z.object({
	id: FileIdSchema,
	relationships: z
		.string()
		.optional()
		.describe(
			'Comma-separated relationships to include, such as `behaviours`.',
		),
});

export type FilesGetInput = z.infer<typeof FilesGetInputSchema>;

const FileResponseSchema = z.object({ data: FileObjectSchema }).loose();

export type FileResponse = z.infer<typeof FileResponseSchema>;

const FilesRescanInputSchema = z.object({ id: FileIdSchema });

export type FilesRescanInput = z.infer<typeof FilesRescanInputSchema>;

const FilesCommentsInputSchema = z.object({
	id: FileIdSchema,
	...PagingSchema,
});

export type FilesCommentsInput = z.infer<typeof FilesCommentsInputSchema>;

const AddCommentInputSchema = z.object({
	id: FileIdSchema,
	text: z
		.string()
		.min(1)
		.describe('The comment. A word starting with # becomes a tag.'),
});

export type AddCommentInput = z.infer<typeof AddCommentInputSchema>;

const CommentResponseSchema = z.object({ data: CommentSchema }).loose();

export type CommentResponse = z.infer<typeof CommentResponseSchema>;

const FilesVotesInputSchema = z.object({
	id: FileIdSchema,
	...PagingSchema,
});

export type FilesVotesInput = z.infer<typeof FilesVotesInputSchema>;

const VoteInputSchema = z.object({
	id: FileIdSchema,
	verdict: z
		.enum(['malicious', 'harmless'])
		.describe('Which way to vote on the file.'),
});

export type VoteInput = z.infer<typeof VoteInputSchema>;

const VoteResponseSchema = z.object({ data: VoteSchema }).loose();

export type VoteResponse = z.infer<typeof VoteResponseSchema>;

// ── urls ──────────────────────────────────────────────────────────────────

const UrlsScanInputSchema = z.object({
	url: z.string().min(1).describe('The address to scan.'),
});

export type UrlsScanInput = z.infer<typeof UrlsScanInputSchema>;

const UrlsGetInputSchema = z.object({
	id: z
		.string()
		.min(1)
		.describe(
			'The URL identifier, as base64url. Pass `urls.get` a raw URL and it will not resolve — use `urlId()`.',
		),
});

export type UrlsGetInput = z.infer<typeof UrlsGetInputSchema>;

const UrlResponseSchema = z.object({ data: UrlObjectSchema }).loose();

export type UrlResponse = z.infer<typeof UrlResponseSchema>;

const UrlsRescanInputSchema = z.object({ id: UrlIdSchema });

export type UrlsRescanInput = z.infer<typeof UrlsRescanInputSchema>;

const UrlsCommentsInputSchema = z.object({
	id: UrlIdSchema,
	...PagingSchema,
});

export type UrlsCommentsInput = z.infer<typeof UrlsCommentsInputSchema>;

const AddUrlCommentInputSchema = z.object({
	id: UrlIdSchema,
	text: z.string().min(1),
});

export type AddUrlCommentInput = z.infer<typeof AddUrlCommentInputSchema>;

// ── domains and IPs ───────────────────────────────────────────────────────

const DomainsGetInputSchema = z.object({
	domain: z.string().min(1).describe('The domain name, not an identifier.'),
	relationships: z.string().optional(),
});

export type DomainsGetInput = z.infer<typeof DomainsGetInputSchema>;

const DomainResponseSchema = z.object({ data: DomainObjectSchema }).loose();

export type DomainResponse = z.infer<typeof DomainResponseSchema>;

const DomainsRescanInputSchema = z.object({
	id: z.string().min(1).describe('The domain name to reanalyse.'),
});

export type DomainsRescanInput = z.infer<typeof DomainsRescanInputSchema>;

const IpAddressesGetInputSchema = z.object({
	ip: z.string().min(1).describe('The IPv4 or IPv6 address.'),
	relationships: z.string().optional(),
});

export type IpAddressesGetInput = z.infer<typeof IpAddressesGetInputSchema>;

const IpResponseSchema = z.object({ data: IpAddressObjectSchema }).loose();

export type IpResponse = z.infer<typeof IpResponseSchema>;

const IpAddressesRescanInputSchema = z.object({
	id: z.string().min(1).describe('The IP address to reanalyse.'),
});

export type IpAddressesRescanInput = z.infer<
	typeof IpAddressesRescanInputSchema
>;

// ── analyses ──────────────────────────────────────────────────────────────

const AnalysesGetInputSchema = z.object({
	id: z.string().min(1).describe('The analysis id a scan returned.'),
});

export type AnalysesGetInput = z.infer<typeof AnalysesGetInputSchema>;

const AnalysisResponseSchema = z.object({ data: AnalysisObjectSchema }).loose();

export type AnalysisResponse = z.infer<typeof AnalysisResponseSchema>;

// ── comments ──────────────────────────────────────────────────────────────

const CommentsListInputSchema = z.object({
	...PagingSchema,
	filter: z
		.string()
		.optional()
		.describe('A VirusTotal Intelligence filter expression.'),
});

export type CommentsListInput = z.infer<typeof CommentsListInputSchema>;

const CommentsGetInputSchema = z.object({
	id: z.string().min(1),
});

export type CommentsGetInput = z.infer<typeof CommentsGetInputSchema>;

const CommentsDeleteInputSchema = z.object({
	id: z.string().min(1),
});

export type CommentsDeleteInput = z.infer<typeof CommentsDeleteInputSchema>;

/** A delete answers with no useful body, so the plugin states what it did. */
const CommentsDeleteResponseSchema = z.object({
	id: z.string(),
	deleted: z.literal(true),
});

export type CommentsDeleteResponse = z.infer<
	typeof CommentsDeleteResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type VirustotalEndpointInputs = {
	filesGet: FilesGetInput;
	filesRescan: FilesRescanInput;
	filesComments: FilesCommentsInput;
	filesAddComment: AddCommentInput;
	filesVotes: FilesVotesInput;
	filesVote: VoteInput;
	urlsScan: UrlsScanInput;
	urlsGet: UrlsGetInput;
	urlsRescan: UrlsRescanInput;
	urlsComments: UrlsCommentsInput;
	urlsAddComment: AddUrlCommentInput;
	domainsGet: DomainsGetInput;
	domainsRescan: DomainsRescanInput;
	ipAddressesGet: IpAddressesGetInput;
	ipAddressesRescan: IpAddressesRescanInput;
	analysesGet: AnalysesGetInput;
	commentsList: CommentsListInput;
	commentsGet: CommentsGetInput;
	commentsDelete: CommentsDeleteInput;
};

export type VirustotalEndpointOutputs = {
	filesGet: FileResponse;
	filesRescan: VirustotalDescriptor;
	filesComments: VirustotalComments;
	filesAddComment: CommentResponse;
	filesVotes: VirustotalVotes;
	filesVote: VoteResponse;
	urlsScan: VirustotalDescriptor;
	urlsGet: UrlResponse;
	urlsRescan: VirustotalDescriptor;
	urlsComments: VirustotalComments;
	urlsAddComment: CommentResponse;
	domainsGet: DomainResponse;
	domainsRescan: VirustotalDescriptor;
	ipAddressesGet: IpResponse;
	ipAddressesRescan: VirustotalDescriptor;
	analysesGet: AnalysisResponse;
	commentsList: VirustotalComments;
	commentsGet: CommentResponse;
	commentsDelete: CommentsDeleteResponse;
};

export const VirustotalEndpointInputSchemas = {
	filesGet: FilesGetInputSchema,
	filesRescan: FilesRescanInputSchema,
	filesComments: FilesCommentsInputSchema,
	filesAddComment: AddCommentInputSchema,
	filesVotes: FilesVotesInputSchema,
	filesVote: VoteInputSchema,
	urlsScan: UrlsScanInputSchema,
	urlsGet: UrlsGetInputSchema,
	urlsRescan: UrlsRescanInputSchema,
	urlsComments: UrlsCommentsInputSchema,
	urlsAddComment: AddUrlCommentInputSchema,
	domainsGet: DomainsGetInputSchema,
	domainsRescan: DomainsRescanInputSchema,
	ipAddressesGet: IpAddressesGetInputSchema,
	ipAddressesRescan: IpAddressesRescanInputSchema,
	analysesGet: AnalysesGetInputSchema,
	commentsList: CommentsListInputSchema,
	commentsGet: CommentsGetInputSchema,
	commentsDelete: CommentsDeleteInputSchema,
} as const;

export const VirustotalEndpointOutputSchemas = {
	filesGet: FileResponseSchema,
	filesRescan: DescriptorSchema,
	filesComments: CommentsCollectionSchema,
	filesAddComment: CommentResponseSchema,
	filesVotes: VotesCollectionSchema,
	filesVote: VoteResponseSchema,
	urlsScan: DescriptorSchema,
	urlsGet: UrlResponseSchema,
	urlsRescan: DescriptorSchema,
	urlsComments: CommentsCollectionSchema,
	urlsAddComment: CommentResponseSchema,
	domainsGet: DomainResponseSchema,
	domainsRescan: DescriptorSchema,
	ipAddressesGet: IpResponseSchema,
	ipAddressesRescan: DescriptorSchema,
	analysesGet: AnalysisResponseSchema,
	commentsList: CommentsCollectionSchema,
	commentsGet: CommentResponseSchema,
	commentsDelete: CommentsDeleteResponseSchema,
} as const;
