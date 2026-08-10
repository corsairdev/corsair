import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared fragments
// ─────────────────────────────────────────────────────────────────────────────

const Pagination = z
	.object({
		start: z.number().optional(),
		count: z.number().optional(),
		total: z.number().optional(),
		links: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.optional();

const Urn = z
	.string()
	.describe(
		'A LinkedIn URN, e.g. urn:li:person:123, urn:li:organization:456, or urn:li:ugcPost:789.',
	);

// ─────────────────────────────────────────────────────────────────────────────
// Inputs
// ─────────────────────────────────────────────────────────────────────────────

const GetMyInfoInputSchema = z
	.object({
		projection: z
			.string()
			.optional()
			.describe(
				'Optional projection of profile fields to return (e.g. "(sub,name,email)").',
			),
	})
	.describe(
		"Fetch the authenticated LinkedIn member's profile (name, headline, profile picture).",
	);

const GetPersonInputSchema = z
	.object({
		person_id: z
			.string()
			.describe(
				'The LinkedIn member ID of the person whose profile to retrieve.',
			),
		projection: z
			.string()
			.optional()
			.describe(
				'Optional projection of fields. Defaults to the lite profile; add headline and vanityName for the basic profile (requires r_basicprofile).',
			),
	})
	.describe('Retrieve a LinkedIn member profile by person ID.');

const CreatePostInputSchema = z
	.object({
		author: Urn.describe(
			'Author URN. Use urn:li:person:... to post as a person (w_member_social) or urn:li:organization:... to post as an organization (w_organization_social).',
		),
		commentary: z.string().describe('The text commentary (body) of the post.'),
		visibility: z
			.enum(['PUBLIC', 'CONNECTIONS', 'LOGGED_IN_MEMBERS'])
			.optional()
			.describe('Who can see the post. Defaults to PUBLIC.'),
		lifecycleState: z
			.enum(['PUBLISHED', 'DRAFT'])
			.optional()
			.describe('PUBLISHED to post immediately, DRAFT to save as a draft.'),
		isReshareDisabledByAuthor: z
			.boolean()
			.optional()
			.describe('When true, other members cannot reshare this post.'),
		article_url: z
			.string()
			.optional()
			.describe('Optional URL to attach as article content with the post.'),
		article_title: z
			.string()
			.optional()
			.describe('Title for the attached article. Requires article_url.'),
		article_description: z
			.string()
			.optional()
			.describe('Description for the attached article. Requires article_url.'),
		image_urn: Urn.optional().describe(
			'Optional image URN to attach as media.',
		),
	})
	.refine((data) => !(data.article_url && data.image_urn), {
		message:
			'A post can attach either an article (article_url) or an image (image_urn), not both.',
	})
	.describe('Create a new LinkedIn post for a member or organization.');

const CreateArticleShareInputSchema = z
	.object({
		authorUrn: Urn.describe(
			'Author URN, e.g. urn:li:person:... or urn:li:organization:....',
		),
		text: z
			.string()
			.optional()
			.describe('Optional commentary to include alongside the shared URL.'),
		article_url: z.string().describe('The URL to share as an article.'),
		article_title: z
			.string()
			.optional()
			.describe('Optional title for the article.'),
		article_description: z
			.string()
			.optional()
			.describe('Optional description for the article.'),
		article_thumbnail: z
			.string()
			.optional()
			.describe('Optional thumbnail URL for the article.'),
		visibility: z
			.enum(['PUBLIC', 'CONNECTIONS'])
			.optional()
			.describe('Visibility of the share. Defaults to PUBLIC.'),
		lifecycleState: z
			.enum(['PUBLISHED', 'DRAFT'])
			.optional()
			.describe('PUBLISHED to post immediately, DRAFT to save as a draft.'),
	})
	.describe(
		'Create an article or URL share on LinkedIn via the UGC Posts API.',
	);

const GetPostContentInputSchema = z
	.object({
		post_urn: z
			.string()
			.describe(
				'The post URN (e.g. urn:li:post:1234567890) whose content to retrieve.',
			),
	})
	.describe('Retrieve detailed content of a specific LinkedIn post.');

const DeletePostInputSchema = z
	.object({
		post_id: z
			.string()
			.describe(
				'The post URN or ID to delete via the Posts API (idempotent, returns 204).',
			),
	})
	.describe('Delete a LinkedIn post using the Posts API REST endpoint.');

const DeleteSharePostInputSchema = z
	.object({
		share_id: z
			.string()
			.describe('The share ID of the LinkedIn share to delete.'),
	})
	.describe('Delete a specific LinkedIn post (share) by its share_id.');

const DeleteUgcPostInputSchema = z
	.object({
		ugc_post_urn: z
			.string()
			.describe('The UGC post URN (e.g. urn:li:ugcPost:12345) to delete.'),
	})
	.describe(
		'Delete a UGC post using the legacy v2/ugcPosts endpoint (idempotent).',
	);

const CreateCommentInputSchema = z
	.object({
		commented_on_urn: z
			.string()
			.describe(
				'URN of the object being commented on: a share, UGC post, or parent comment.',
			),
		actor: Urn.describe(
			'URN of the member or organization posting the comment, e.g. urn:li:person:... or urn:li:organization:....',
		),
		message: z
			.string()
			.describe('The text of the comment (max 3000 characters).'),
	})
	.describe(
		'Create a first-level or nested comment on a LinkedIn share, UGC post, or comment.',
	);

const ListReactionsInputSchema = z
	.object({
		entity_urn: z
			.string()
			.describe(
				'URN of the entity (share, post, or comment) whose reactions to list.',
			),
		start: z
			.number()
			.optional()
			.describe('Pagination start index. Defaults to 0.'),
		count: z
			.number()
			.optional()
			.describe('Number of reactions to return per page.'),
	})
	.describe(
		'Retrieve reactions (likes, celebrations, etc.) on a LinkedIn entity.',
	);

const GetImageInputSchema = z
	.object({
		image_urn: z
			.string()
			.describe(
				'The image URN (e.g. urn:li:image:C4D22...) whose details to retrieve.',
			),
	})
	.describe('Retrieve details of a single LinkedIn image by its URN.');

const GetImagesInputSchema = z
	.object({
		owner: Urn.optional().describe(
			'Owner URN. Returns images owned by this member/org.',
		),
		urns: z
			.array(z.string())
			.optional()
			.describe('Specific image URNs to fetch in a single batch request.'),
		start: z.number().optional().describe('Pagination start index.'),
		count: z.number().optional().describe('Number of images per page.'),
	})
	.refine((data) => !!(data.owner || (data.urns && data.urns.length > 0)), {
		message:
			'getImages requires owner or a non-empty urns list — LinkedIn rejects /v2/images without a q finder.',
	})
	.describe(
		'Retrieve LinkedIn image metadata (download URLs, status, dimensions).',
	);

const InitializeImageUploadInputSchema = z
	.object({
		owner: Urn.describe(
			'Owner URN that will own the uploaded image, e.g. urn:li:person:... or urn:li:organization:....',
		),
	})
	.describe(
		'Initialize a LinkedIn image upload and return a presigned upload URL plus the image URN.',
	);

const RegisterImageUploadInputSchema = z
	.object({
		owner: Urn.describe(
			'Owner URN for the media asset, e.g. urn:li:person:... or urn:li:organization:....',
		),
	})
	.describe(
		'Register a native LinkedIn image upload for feed shares and return a presigned upload URL plus the digital media asset URN.',
	);

const GetVideosInputSchema = z
	.object({
		video_urn: z
			.string()
			.optional()
			.describe('A single video URN to retrieve.'),
		owner: Urn.optional().describe(
			'Owner URN. Returns videos owned by this account.',
		),
		urns: z
			.array(z.string())
			.optional()
			.describe('Specific video URNs to fetch in a batch.'),
		start: z.number().optional().describe('Pagination start index.'),
		count: z.number().optional().describe('Number of videos per page.'),
	})
	.refine(
		(data) =>
			!!(data.video_urn || data.owner || (data.urns && data.urns.length > 0)),
		{
			message:
				'getVideos requires video_urn, owner, or a non-empty urns list — LinkedIn rejects /v2/videos without a q finder.',
		},
	)
	.describe(
		'Retrieve LinkedIn video metadata (duration, dimensions, download URLs).',
	);

const GetCompanyInfoInputSchema = z
	.object({
		role_assignee: Urn.optional().describe(
			'Person URN whose organization roles to list. Defaults to the authenticated member.',
		),
		role: z
			.array(
				z.enum([
					'ADMINISTRATOR',
					'DIRECT_SPONSORED_CONTENT_POSTER',
					'RECRUITING_POSTER',
					'LEAD_GEN_FORMS_MANAGER',
					'CONTENT_ADMIN',
					'ANALYTICS_ROLE',
				]),
			)
			.optional()
			.describe('Filter to specific organization roles.'),
		state: z
			.enum(['APPROVED', 'PENDING', 'REVOKED'])
			.optional()
			.describe('Filter to ACLs in a given state. Defaults to APPROVED.'),
		start: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe('Zero-based pagination offset into the role list.'),
		count: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Maximum number of roles to return per page.'),
	})
	.describe(
		'Retrieve organizations where the authenticated user has specific roles (ACLs).',
	);

const GetNetworkSizeInputSchema = z
	.object({
		organization_urn: Urn.describe(
			'The organization URN (e.g. urn:li:organization:2414183) whose follower count to retrieve.',
		),
	})
	.describe('Retrieve the follower count for a LinkedIn organization.');

const GetOrgPageStatsInputSchema = z
	.object({
		organization_urn: Urn.describe(
			'The organization URN whose page statistics to retrieve.',
		),
		time_integrated: z
			.object({
				// Epoch milliseconds — LinkedIn's timeIntervals timeDuration takes
				// numeric start/end values, and strings would serialize malformed.
				start: z.number().optional(),
				end: z.number().optional(),
			})
			.optional()
			.describe('Optional time range for time-bound (aggregate) statistics.'),
		start: z.number().optional().describe('Pagination start index.'),
		count: z.number().optional().describe('Number of results per page.'),
	})
	.describe(
		'Retrieve page statistics (page views, custom button clicks) for a LinkedIn organization.',
	);

const GetShareStatsInputSchema = z
	.object({
		organization_urn: Urn.describe(
			'The organization URN whose share statistics to retrieve.',
		),
		time_integrated: z
			.object({
				// Epoch milliseconds, matching the timeIntervals serialization.
				start: z.number().optional(),
				end: z.number().optional(),
			})
			.optional()
			.describe('Optional time range to filter statistics.'),
		start: z.number().optional().describe('Pagination start index.'),
		count: z.number().optional().describe('Number of results per page.'),
	})
	.describe(
		'Retrieve share statistics (impressions, clicks, likes, comments, shares) for an organization.',
	);

const GetAdTargetingFacetsInputSchema = z
	.object({})
	.describe(
		'Retrieve available ad targeting facets from the LinkedIn Marketing API (locations, industries, job functions, etc.).',
	);

const GetAudienceCountsInputSchema = z
	.object({
		target: z
			.record(z.string(), z.unknown())
			.describe(
				'Targeting criteria to estimate audience size for, as a LinkedIn targeting object (e.g. { and: [ { or: [...] }] }).',
			),
	})
	.describe('Retrieve audience size counts for specified targeting criteria.');

const SearchAdTargetingEntitiesInputSchema = z
	.object({
		query: z
			.string()
			.describe('Typeahead search query for targeting entities.'),
		type: z
			.string()
			.optional()
			.describe(
				'Optional facet type to scope the search (e.g. locations, titles, industries).',
			),
	})
	.describe(
		'Search ad targeting entities (geographies, job titles, industries) via typeahead search.',
	);

export const LinkedInEndpointInputSchemas = {
	GetMyInfo: GetMyInfoInputSchema,
	GetPerson: GetPersonInputSchema,
	CreatePost: CreatePostInputSchema,
	CreateArticleShare: CreateArticleShareInputSchema,
	GetPostContent: GetPostContentInputSchema,
	DeletePost: DeletePostInputSchema,
	DeleteSharePost: DeleteSharePostInputSchema,
	DeleteUgcPost: DeleteUgcPostInputSchema,
	CreateComment: CreateCommentInputSchema,
	ListReactions: ListReactionsInputSchema,
	GetImage: GetImageInputSchema,
	GetImages: GetImagesInputSchema,
	InitializeImageUpload: InitializeImageUploadInputSchema,
	RegisterImageUpload: RegisterImageUploadInputSchema,
	GetVideos: GetVideosInputSchema,
	GetCompanyInfo: GetCompanyInfoInputSchema,
	GetNetworkSize: GetNetworkSizeInputSchema,
	GetOrgPageStats: GetOrgPageStatsInputSchema,
	GetShareStats: GetShareStatsInputSchema,
	GetAdTargetingFacets: GetAdTargetingFacetsInputSchema,
	GetAudienceCounts: GetAudienceCountsInputSchema,
	SearchAdTargetingEntities: SearchAdTargetingEntitiesInputSchema,
} as const;

export type LinkedInEndpointInputs = {
	[K in keyof typeof LinkedInEndpointInputSchemas]: z.infer<
		(typeof LinkedInEndpointInputSchemas)[K]
	>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Outputs
// ─────────────────────────────────────────────────────────────────────────────

const GetMyInfoOutputSchema = z
	.object({
		sub: z.string().optional(),
		id: z.string().optional(),
		name: z.string().nullable().optional(),
		given_name: z.string().nullable().optional(),
		family_name: z.string().nullable().optional(),
		picture: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		locale: z.string().nullable().optional(),
		vanityName: z.string().optional(),
		headline: z.string().optional(),
	})
	.loose()
	.describe('The authenticated LinkedIn member profile.');

const PersonProfileSchema = z
	.object({
		id: z.string().describe('The member ID.'),
		localizedFirstName: z.string().optional(),
		localizedLastName: z.string().optional(),
		localizedHeadline: z.string().optional(),
		vanityName: z.string().optional(),
		firstName: z.record(z.string(), z.unknown()).optional(),
		lastName: z.record(z.string(), z.unknown()).optional(),
		headline: z.record(z.string(), z.unknown()).optional(),
		profilePicture: z
			.object({
				'displayImage~': z.string().optional(),
				'displayImage~:playableStreams': z
					.array(z.record(z.string(), z.unknown()))
					.optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const CreatePostOutputSchema = z
	.object({
		id: z.string().describe('The URN of the newly created post.'),
	})
	.describe('Result of creating a LinkedIn post.');

const CreateArticleShareOutputSchema = z
	.object({
		id: z.string().describe('The URN of the newly created UGC post.'),
		activity: z.string().optional(),
	})
	.describe('Result of creating an article/URL share.');

const GetPostContentOutputSchema = z
	.object({
		id: z.string(),
		author: z.string().optional(),
		commentary: z.string().optional(),
		visibility: z.string().optional(),
		lifecycleState: z.string().optional(),
		createdAt: z.record(z.string(), z.unknown()).optional(),
		isReshareDisabledByAuthor: z.boolean().optional(),
		media: z.record(z.string(), z.unknown()).optional(),
		content: z.record(z.string(), z.unknown()).optional(),
	})
	.loose()
	.describe('Detailed content of a LinkedIn post.');

const DeleteResultSchema = z
	.object({
		success: z.boolean().describe('Whether the delete operation completed.'),
	})
	.describe('Result of deleting a post.');

const CreateCommentOutputSchema = z
	.object({
		id: z.string().optional().describe('The URN of the created comment.'),
		message: z.string().optional().describe('The comment text.'),
		object: z
			.string()
			.optional()
			.describe('The URN the comment was posted on.'),
		lastModified: z.record(z.string(), z.unknown()).optional(),
	})
	.loose()
	.describe('Result of creating a comment.');

const ReactionElementSchema = z
	.object({
		actor: z.string().optional().describe('URN of the member who reacted.'),
		type: z
			.string()
			.optional()
			.describe('Reaction type, e.g. LIKE, CELEBRATION.'),
		created: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

const ListReactionsOutputSchema = z
	.object({
		elements: z
			.array(ReactionElementSchema)
			.describe('The reactions on the entity.'),
		paging: Pagination,
	})
	.loose()
	.describe('Reactions on a LinkedIn entity.');

const ImageSchema = z
	.object({
		id: z.string().describe('The image URN.'),
		owner: z.string().optional(),
		status: z
			.string()
			.optional()
			.describe('UPLOADING, AVAILABLE, WAITING_UPLOAD, etc.'),
		downloadUrl: z.string().nullable().optional(),
		original: z
			.object({
				size: z.string().optional(),
				width: z.number().optional(),
				height: z.number().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const GetImageOutputSchema = ImageSchema;

const GetImagesOutputSchema = z
	.object({
		elements: z.array(ImageSchema),
		paging: Pagination,
	})
	.loose();

const InitializeImageUploadOutputSchema = z
	.object({
		value: z
			.object({
				image: z
					.string()
					.describe(
						'The new image URN to use when attaching the image to a post.',
					),
				uploadUrl: z
					.string()
					.optional()
					.describe('Presigned URL to PUT the image bytes to.'),
				uploadUrlExpiresAt: z
					.number()
					.optional()
					.describe('Epoch millis when the upload URL expires.'),
			})
			.loose(),
	})
	.loose()
	.describe('Result of initializing an image upload.');

const RegisterImageUploadOutputSchema = z
	.object({
		value: z
			.object({
				asset: z
					.string()
					.describe('The digital media asset URN to reference in a post.'),
				mediaArtifact: z.string().optional(),
				uploadMechanism: z
					.record(z.string(), z.unknown())
					.optional()
					.describe(
						'Contains the uploadUrl under com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest.',
					),
			})
			.loose(),
	})
	.loose()
	.describe('Result of registering an image upload.');

const VideoSchema = z
	.object({
		id: z.string().describe('The video URN.'),
		owner: z.string().optional(),
		status: z.string().optional().describe('UPLOADING, AVAILABLE, etc.'),
		downloadUrl: z.string().nullable().optional(),
		durationMilliseconds: z.number().optional(),
		original: z
			.object({ width: z.number().optional(), height: z.number().optional() })
			.loose()
			.optional(),
	})
	.loose();

const GetVideosOutputSchema = z
	.object({
		elements: z.array(VideoSchema),
		paging: Pagination,
	})
	.loose();

const CompanyAclElementSchema = z
	.object({
		organization: z.string().optional().describe('Organization URN.'),
		organizationRoleAssignee: z.string().optional(),
		role: z.string().optional().describe('The role held, e.g. ADMINISTRATOR.'),
		state: z.string().optional(),
	})
	.loose();

const GetCompanyInfoOutputSchema = z
	.object({
		elements: z.array(CompanyAclElementSchema),
		paging: Pagination,
	})
	.loose();

const GetNetworkSizeOutputSchema = z
	.object({
		totalFollowerCount: z
			.number()
			.optional()
			.describe('Total followers of the organization.'),
		organizationFollowerCount: z.number().optional(),
		elements: z.array(z.record(z.string(), z.unknown())).optional(),
		paging: Pagination,
	})
	.loose()
	.describe('Follower count for a LinkedIn organization.');

// LinkedIn analytics responses are dynamic (element shape varies by requested
// metric/facet), so these outputs are intentionally typed as records of unknown.
// Output schemas only describe the shape for the agent and are not used for
// runtime validation, mirroring other plugins in the monorepo.
const StatsElementSchema = z.record(z.string(), z.unknown());

const GetOrgPageStatsOutputSchema = z
	.object({
		elements: z.array(StatsElementSchema).describe('Page statistics entries.'),
		paging: Pagination,
	})
	.loose();

const GetShareStatsOutputSchema = z
	.object({
		elements: z.array(StatsElementSchema).describe('Share statistics entries.'),
		paging: Pagination,
	})
	.loose();

const GetAdTargetingFacetsOutputSchema = z
	.object({
		facets: z
			.array(z.record(z.string(), z.unknown()))
			.optional()
			.describe('Available targeting facets.'),
		elements: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.loose();

const GetAudienceCountsOutputSchema = z
	.object({
		elements: z
			.array(z.record(z.string(), z.unknown()))
			.optional()
			.describe('Audience size entries for the given targeting criteria.'),
		paging: Pagination,
	})
	.loose();

const SearchAdTargetingEntitiesOutputSchema = z
	.object({
		elements: z
			.array(z.record(z.string(), z.unknown()))
			.optional()
			.describe('Matching targeting entities.'),
		paging: Pagination,
	})
	.loose();

export const LinkedInEndpointOutputSchemas = {
	GetMyInfo: GetMyInfoOutputSchema,
	GetPerson: PersonProfileSchema,
	CreatePost: CreatePostOutputSchema,
	CreateArticleShare: CreateArticleShareOutputSchema,
	GetPostContent: GetPostContentOutputSchema,
	DeletePost: DeleteResultSchema,
	DeleteSharePost: DeleteResultSchema,
	DeleteUgcPost: DeleteResultSchema,
	CreateComment: CreateCommentOutputSchema,
	ListReactions: ListReactionsOutputSchema,
	GetImage: GetImageOutputSchema,
	GetImages: GetImagesOutputSchema,
	InitializeImageUpload: InitializeImageUploadOutputSchema,
	RegisterImageUpload: RegisterImageUploadOutputSchema,
	GetVideos: GetVideosOutputSchema,
	GetCompanyInfo: GetCompanyInfoOutputSchema,
	GetNetworkSize: GetNetworkSizeOutputSchema,
	GetOrgPageStats: GetOrgPageStatsOutputSchema,
	GetShareStats: GetShareStatsOutputSchema,
	GetAdTargetingFacets: GetAdTargetingFacetsOutputSchema,
	GetAudienceCounts: GetAudienceCountsOutputSchema,
	SearchAdTargetingEntities: SearchAdTargetingEntitiesOutputSchema,
} as const;

export type LinkedInEndpointOutputs = {
	[K in keyof typeof LinkedInEndpointOutputSchemas]: z.infer<
		(typeof LinkedInEndpointOutputSchemas)[K]
	>;
};
