import { z } from 'zod';

// -----------------------------------------------------------------------------
// GraphQL Fragments (reusable field selections)
// -----------------------------------------------------------------------------

const USER_FRAGMENT = `
  fragment UserFields on User {
    id
    name
    username
    profilePicture
    coverImage
    bio {
      text
      html
      markdown
    }
    socialMediaLinks {
      twitter
      github
      linkedin
      website
    }
    location
    dateJoined
  }
`;

const MY_USER_FRAGMENT = `
  fragment MyUserFields on MyUser {
    id
    name
    username
    email
    profilePicture
    coverImage
    bio {
      text
      html
      markdown
    }
    socialMediaLinks {
      twitter
      github
      linkedin
      website
    }
    location
    dateJoined
  }
`;

const PUBLICATION_FRAGMENT = `
  fragment PublicationFields on Publication {
    id
    title
    displayTitle
    url
    favicon
    about {
      text
      html
      markdown
    }
    seo {
      title
      description
    }
    author {
      ...UserFields
    }
    ogMetaData {
      image
    }
    isTeam
    links {
      twitter
      github
      linkedin
      website
    }
    followersCount
    pinnedPost {
      id
      title
      slug
    }
    features {
      newsletter {
        isEnabled
      }
    }
  }
  ${USER_FRAGMENT}
`;

const POST_FRAGMENT = `
  fragment PostFields on Post {
    id
    title
    subtitle
    slug
    brief
    url
    coverImage {
      url
      isPortrait
      attribution
    }
    author {
      ...UserFields
    }
    publication {
      id
      title
      url
      displayTitle
    }
    tags {
      id
      name
      slug
    }
    content {
      html
      markdown
      text
    }
    seo {
      title
      description
    }
    ogMetaData {
      image
    }
    publishedAt
    updatedAt
    readTimeInMinutes
    reactionCount
    responseCount
    replyCount
    series {
      id
      name
      slug
    }
    featured
    features {
      tableOfContents {
        isEnabled
      }
    }
    preferences {
      pinnedToBlog
      disableComments
      isDelisted
    }
  }
  ${USER_FRAGMENT}
`;

const COMMENT_FRAGMENT = `
  fragment CommentFields on Comment {
    id
    content {
      html
      markdown
      text
    }
    author {
      ...UserFields
    }
    totalReactions
    dateAdded
  }
  ${USER_FRAGMENT}
`;

const PAGE_FRAGMENT = `
  fragment PageFields on StaticPage {
    id
    title
    slug
    content {
      html
      markdown
      text
    }
    hidden
    ogMetaData {
      image
    }
    seo {
      title
      description
    }
  }
`;

const SERIES_FRAGMENT = `
  fragment SeriesFields on Series {
    id
    name
    slug
    description {
      text
      html
      markdown
    }
    coverImage
    author {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;

const DRAFT_FRAGMENT = `
  fragment DraftFields on Draft {
    id
    title
    subtitle
    slug
    content {
      markdown
      html
      text
    }
    author {
      ...UserFields
    }
    coverImage {
      url
      attribution
    }
    tags {
      id
      name
      slug
    }
    publication {
      id
      title
    }
    series {
      id
      name
      slug
    }
    updatedAt
    scheduledDate
    readTimeInMinutes
    isSubmittedForReview
    features {
      tableOfContents {
        isEnabled
      }
    }
  }
  ${USER_FRAGMENT}
`;

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

export const ME_QUERY = `
  query Me {
    me {
      ...MyUserFields
    }
  }
  ${MY_USER_FRAGMENT}
`;

export const PUBLICATION_QUERY = `
  query Publication($host: String!) {
    publication(host: $host) {
      ...PublicationFields
    }
  }
  ${PUBLICATION_FRAGMENT}
`;

export const PUBLICATIONS_QUERY = `
  query Publications($first: Int!, $after: String) {
    me {
      publications(first: $first, after: $after) {
        edges {
          node {
            ...PublicationFields
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${PUBLICATION_FRAGMENT}
`;

export const POSTS_QUERY = `
  query Posts($host: String!, $first: Int!, $after: String, $filter: PublicationPostConnectionFilter) {
    publication(host: $host) {
      posts(first: $first, after: $after, filter: $filter) {
        edges {
          node {
            ...PostFields
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        totalDocuments
      }
    }
  }
  ${POST_FRAGMENT}
`;

export const POST_QUERY = `
  query Post($id: ID!) {
    post(id: $id) {
      ...PostFields
    }
  }
  ${POST_FRAGMENT}
`;

export const POST_BY_SLUG_QUERY = `
  query PostBySlug($host: String!, $slug: String!) {
    publication(host: $host) {
      post(slug: $slug) {
        ...PostFields
      }
    }
  }
  ${POST_FRAGMENT}
`;

export const FEED_QUERY = `
  query Feed($first: Int!, $after: String, $filter: FeedFilter) {
    feed(first: $first, after: $after, filter: $filter) {
      edges {
        node {
          ...PostFields
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${POST_FRAGMENT}
`;

export const SEARCH_POSTS_OF_PUBLICATION_QUERY = `
  query SearchPostsOfPublication($first: Int!, $after: String, $sortBy: PostSortBy, $filter: SearchPostsOfPublicationFilter!) {
    searchPostsOfPublication(first: $first, after: $after, sortBy: $sortBy, filter: $filter) {
      edges {
        node {
          ...PostFields
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${POST_FRAGMENT}
`;

export const USER_QUERY = `
  query User($username: String!) {
    user(username: $username) {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;

export const TAG_QUERY = `
  query Tag($slug: String!) {
    tag(slug: $slug) {
      id
      name
      slug
      tagline
      logo
      postsCount
      followersCount
    }
  }
`;

export const POST_COMMENTS_QUERY = `
  query PostComments($postId: ID!, $first: Int!, $after: String) {
    post(id: $postId) {
      comments(first: $first, after: $after) {
        edges {
          node {
            ...CommentFields
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${COMMENT_FRAGMENT}
`;

export const PAGES_QUERY = `
  query Pages($host: String!, $first: Int!, $after: String) {
    publication(host: $host) {
      staticPages(first: $first, after: $after) {
        edges {
          node {
            ...PageFields
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${PAGE_FRAGMENT}
`;

export const PAGE_QUERY = `
  query Page($host: String!, $slug: String!) {
    publication(host: $host) {
      staticPage(slug: $slug) {
        ...PageFields
      }
    }
  }
  ${PAGE_FRAGMENT}
`;

export const SERIES_QUERY = `
  query Series($slug: String!) {
    series(slug: $slug) {
      ...SeriesFields
    }
  }
  ${SERIES_FRAGMENT}
`;

export const SERIES_LIST_QUERY = `
  query SeriesList($host: String!, $first: Int!, $after: String) {
    publication(host: $host) {
      seriesList(first: $first, after: $after) {
        edges {
          node {
            ...SeriesFields
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${SERIES_FRAGMENT}
`;

export const DRAFT_QUERY = `
  query Draft($id: ObjectId!) {
    draft(id: $id) {
      ...DraftFields
    }
  }
  ${DRAFT_FRAGMENT}
`;

// -----------------------------------------------------------------------------
// Mutations
// -----------------------------------------------------------------------------

export const PUBLISH_POST_MUTATION = `
  mutation PublishPost($input: PublishPostInput!) {
    publishPost(input: $input) {
      post {
        ...PostFields
      }
    }
  }
  ${POST_FRAGMENT}
`;

export const UPDATE_POST_MUTATION = `
  mutation UpdatePost($input: UpdatePostInput!) {
    updatePost(input: $input) {
      post {
        ...PostFields
      }
    }
  }
  ${POST_FRAGMENT}
`;

export const CREATE_DRAFT_MUTATION = `
  mutation CreateDraft($input: CreateDraftInput!) {
    createDraft(input: $input) {
      draft {
        ...DraftFields
      }
    }
  }
  ${DRAFT_FRAGMENT}
`;

export const UPDATE_DRAFT_MUTATION = `
  mutation UpdateDraft($input: UpdateDraftInput!) {
    updateDraft(input: $input) {
      draft {
        ...DraftFields
      }
    }
  }
  ${DRAFT_FRAGMENT}
`;

export const PUBLISH_DRAFT_MUTATION = `
  mutation PublishDraft($input: PublishDraftInput!) {
    publishDraft(input: $input) {
      post {
        ...PostFields
      }
    }
  }
  ${POST_FRAGMENT}
`;

export const DELETE_DRAFT_MUTATION = `
  mutation DeleteDraft($input: DeleteDraftInput!) {
    deleteDraft(input: $input) {
      draft {
        id
      }
    }
  }
`;

export const CREATE_IMAGE_UPLOAD_URL_MUTATION = `
  mutation CreateImageUploadURL($input: CreateImageUploadInput!) {
    createImageUploadURL(input: $input) {
      presignedPost {
        url
        fields
      }
    }
  }
`;

// -----------------------------------------------------------------------------
// Zod Input Schemas
// -----------------------------------------------------------------------------

const PaginationInputSchema = z.object({
	first: z.number().min(1).max(100).default(10),
	after: z.string().optional(),
});

const HostInputSchema = z.object({
	host: z.string(),
});

const FeedFilterSchema = z.object({
	tags: z.array(z.string()).optional(),
	excludeTags: z.array(z.string()).optional(),
	publications: z.array(z.string()).optional(),
	excludePublications: z.array(z.string()).optional(),
});

const PublicationPostConnectionFilterSchema = z.object({
	tagSlugs: z.array(z.string()).optional(),
});

const SearchPostsOfPublicationFilterSchema = z.object({
	query: z.string().optional(),
	publicationId: z.string(),
	deletedOnly: z.boolean().optional(),
	authorIds: z.array(z.string()).optional(),
	tagIds: z.array(z.string()).optional(),
});

const PublishPostTagInputSchema = z.object({
	slug: z.string(),
	name: z.string().optional(),
});

const CoverImageOptionsInputSchema = z.object({
	coverImageURL: z.string().optional(),
	coverImageAttribution: z.string().optional(),
	coverImagePhotographer: z.string().optional(),
	isCoverAttributionHidden: z.boolean().optional(),
	stickCoverToBottom: z.boolean().optional(),
});

const CreateDraftSettingsInputSchema = z.object({
	enableTableOfContent: z.boolean().optional(),
	delist: z.boolean().optional(),
	activateNewsletter: z.boolean().optional(),
	slugOverridden: z.boolean().optional(),
});

const MetaTagsInputSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	image: z.string().optional(),
});

const MeInputSchema = z.object({}).optional();

const PublicationInputSchema = HostInputSchema;

const PublicationsInputSchema = PaginationInputSchema;

const PostBySlugInputSchema = z.object({
	host: z.string(),
	slug: z.string(),
});

const PostByIdInputSchema = z.object({
	id: z.string(),
});

const PostsInputSchema = z.object({
	host: z.string(),
	first: z.number().min(1).max(100).default(10),
	after: z.string().optional(),
	filter: PublicationPostConnectionFilterSchema.optional(),
});

const FeedInputSchema = z.object({
	first: z.number().min(1).max(100).default(10),
	after: z.string().optional(),
	filter: FeedFilterSchema.optional(),
});

const SearchPostsOfPublicationInputSchema = z.object({
	first: z.number().min(1).max(100).default(10),
	after: z.string().optional(),
	sortBy: z.enum(['DATE_PUBLISHED_ASC', 'DATE_PUBLISHED_DESC']).optional(),
	filter: SearchPostsOfPublicationFilterSchema,
});

const PublishPostInputSchemaForZod = z.object({
	title: z.string().min(1),
	publicationId: z.string(),
	contentMarkdown: z.string(),
	subtitle: z.string().optional(),
	slug: z.string().optional(),
	coverImage: z.string().optional(),
	tags: z.array(PublishPostTagInputSchema).max(15).optional(),
	originalArticleURL: z.string().optional(),
	metaTitle: z.string().optional(),
	metaDescription: z.string().optional(),
	ogImage: z.string().optional(),
	disableComments: z.boolean().optional(),
	isDelisted: z.boolean().optional(),
	enableToc: z.boolean().optional(),
	publishAs: z.string().optional(),
	coAuthors: z.array(z.string()).max(4).optional(),
	seriesId: z.string().optional(),
	publishedAt: z.string().optional(),
});

const UpdatePostInputSchemaForZod = z.object({
	id: z.string(),
	title: z.string().optional(),
	subtitle: z.string().optional(),
	contentMarkdown: z.string().optional(),
	slug: z.string().optional(),
	coverImage: z.string().optional(),
	tags: z.array(PublishPostTagInputSchema).max(15).optional(),
	originalArticleURL: z.string().optional(),
	metaTitle: z.string().optional(),
	metaDescription: z.string().optional(),
	ogImage: z.string().optional(),
	disableComments: z.boolean().optional(),
	isDelisted: z.boolean().optional(),
	enableToc: z.boolean().optional(),
	publishAs: z.string().optional(),
	coAuthors: z.array(z.string()).max(4).optional(),
	seriesId: z.string().optional(),
	publishedAt: z.string().optional(),
});

const CreateDraftInputSchema = z.object({
	publicationId: z.string(),
	title: z.string().optional(),
	subtitle: z.string().optional(),
	contentMarkdown: z.string().optional(),
	slug: z.string().optional(),
	tags: z.array(PublishPostTagInputSchema).max(15).optional(),
	seriesId: z.string().optional(),
	disableComments: z.boolean().optional(),
	originalArticleURL: z.string().optional(),
	publishedAt: z.string().optional(),
	settings: CreateDraftSettingsInputSchema.optional(),
	metaTags: MetaTagsInputSchema.optional(),
	coverImageOptions: CoverImageOptionsInputSchema.optional(),
	publishAs: z.string().optional(),
	coAuthors: z.array(z.string()).max(4).optional(),
});

const UpdateDraftInputSchema = z.object({
	draftId: z.string(),
	title: z.string().optional(),
	subtitle: z.string().optional(),
	contentMarkdown: z.string().optional(),
	slug: z.string().optional(),
	tags: z.array(PublishPostTagInputSchema).max(15).optional(),
	seriesId: z.string().optional(),
	disableComments: z.boolean().optional(),
	originalArticleURL: z.string().optional(),
	publishedAt: z.string().optional(),
	settings: CreateDraftSettingsInputSchema.optional(),
	metaTags: MetaTagsInputSchema.optional(),
	coverImageOptions: CoverImageOptionsInputSchema.optional(),
	publishAs: z.string().optional(),
	coAuthors: z.array(z.string()).max(4).optional(),
});

const PublishDraftInputSchema = z.object({
	draftId: z.string(),
});

const DeleteDraftInputSchema = z.object({
	draftId: z.string(),
});

const CreateImageUploadInputSchema = z.object({
	contentType: z.string().regex(/^image\//, 'Must start with image/'),
});

const UserInputSchema = z.object({
	username: z.string(),
});

const TagInputSchema = z.object({
	slug: z.string(),
});

const PostCommentsInputSchema = z.object({
	postId: z.string(),
	first: z.number().min(1).max(100).default(10),
	after: z.string().optional(),
});

const SeriesListInputSchema = z.object({
	host: z.string(),
	first: z.number().min(1).max(100).default(10),
	after: z.string().optional(),
});

const SeriesInputSchema = z.object({
	slug: z.string(),
});

const PagesInputSchema = z.object({
	host: z.string(),
	first: z.number().min(1).max(100).default(10),
	after: z.string().optional(),
});

const PageInputSchema = z.object({
	host: z.string(),
	slug: z.string(),
});

const DraftInputSchema = z.object({
	id: z.string(),
});

// -----------------------------------------------------------------------------
// Endpoint Input Maps
// -----------------------------------------------------------------------------

export const HashnodeEndpointInputSchemas = {
	me: MeInputSchema,
	getPublication: PublicationInputSchema,
	listPublications: PublicationsInputSchema,
	getPost: PostByIdInputSchema,
	getPostBySlug: PostBySlugInputSchema,
	listPosts: PostsInputSchema,
	feed: FeedInputSchema,
	searchPostsOfPublication: SearchPostsOfPublicationInputSchema,
	publishPost: PublishPostInputSchemaForZod,
	updatePost: UpdatePostInputSchemaForZod,
	getUser: UserInputSchema,
	getTag: TagInputSchema,
	listPostComments: PostCommentsInputSchema,
	listSeries: SeriesListInputSchema,
	getSeries: SeriesInputSchema,
	listPages: PagesInputSchema,
	getPage: PageInputSchema,
	getDraft: DraftInputSchema,
	createDraft: CreateDraftInputSchema,
	updateDraft: UpdateDraftInputSchema,
	publishDraft: PublishDraftInputSchema,
	deleteDraft: DeleteDraftInputSchema,
	createImageUploadURL: CreateImageUploadInputSchema,
} as const;

export type HashnodeEndpointInputs = {
	[K in keyof typeof HashnodeEndpointInputSchemas]: z.infer<
		(typeof HashnodeEndpointInputSchemas)[K]
	>;
};

// -----------------------------------------------------------------------------
// Zod Response / Output Schemas
// -----------------------------------------------------------------------------

export const PageInfoSchema = z.object({
	hasNextPage: z.boolean(),
	endCursor: z.string().nullable(),
});

export const SocialMediaLinksSchema = z
	.object({
		twitter: z.string().optional().nullable(),
		github: z.string().optional().nullable(),
		linkedin: z.string().optional().nullable(),
		website: z.string().optional().nullable(),
	})
	.optional()
	.nullable();

export const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	username: z.string(),
	profilePicture: z.string().optional().nullable(),
	coverImage: z.string().optional().nullable(),
	bio: z
		.object({
			text: z.string().optional().nullable(),
			html: z.string().optional(),
			markdown: z.string().optional(),
		})
		.optional()
		.nullable(),
	socialMediaLinks: SocialMediaLinksSchema,
	location: z.string().optional().nullable(),
	dateJoined: z.string().optional().nullable(),
});

export const MyUserSchema = z.object({
	id: z.string(),
	name: z.string(),
	username: z.string(),
	email: z.string(),
	profilePicture: z.string().optional().nullable(),
	coverImage: z.string().optional().nullable(),
	bio: z
		.object({
			text: z.string().optional().nullable(),
			html: z.string().optional(),
			markdown: z.string().optional(),
		})
		.optional()
		.nullable(),
	socialMediaLinks: SocialMediaLinksSchema,
	location: z.string().optional().nullable(),
	dateJoined: z.string().optional().nullable(),
});

export const PublicationSchema = z.object({
	id: z.string(),
	title: z.string(),
	displayTitle: z.string().optional().nullable(),
	url: z.string().optional().nullable(),
	favicon: z.string().optional().nullable(),
	about: z
		.object({
			text: z.string().optional().nullable(),
			html: z.string().optional(),
			markdown: z.string().optional(),
		})
		.optional()
		.nullable(),
	seo: z
		.object({
			title: z.string().optional().nullable(),
			description: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
	author: UserSchema.optional().nullable(),
	ogMetaData: z
		.object({
			image: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
	isTeam: z.boolean().optional(),
	links: z
		.object({
			twitter: z.string().optional().nullable(),
			github: z.string().optional().nullable(),
			linkedin: z.string().optional().nullable(),
			website: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
	followersCount: z.number().optional().nullable(),
});

export const PostSchema = z.object({
	id: z.string(),
	title: z.string(),
	subtitle: z.string().optional().nullable(),
	slug: z.string(),
	brief: z.string(),
	url: z.string(),
	coverImage: z
		.object({
			url: z.string().optional().nullable(),
			isPortrait: z.boolean().optional(),
			attribution: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
	author: UserSchema.optional().nullable(),
	publication: z
		.object({
			id: z.string(),
			title: z.string(),
			url: z.string().optional().nullable(),
			displayTitle: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
	tags: z
		.array(
			z.object({
				id: z.string(),
				name: z.string(),
				slug: z.string(),
			}),
		)
		.optional()
		.nullable(),
	content: z
		.object({
			html: z.string().optional(),
			markdown: z.string().optional(),
			text: z.string().optional(),
		})
		.optional()
		.nullable(),
	seo: z
		.object({
			title: z.string().optional().nullable(),
			description: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
	ogMetaData: z
		.object({
			image: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
	publishedAt: z.string(),
	updatedAt: z.string().optional().nullable(),
	readTimeInMinutes: z.number(),
	reactionCount: z.number(),
	responseCount: z.number(),
	replyCount: z.number().optional(),
	series: z
		.object({
			id: z.string(),
			name: z.string(),
			slug: z.string(),
		})
		.optional()
		.nullable(),
	featured: z.boolean().optional(),
});

export const CommentSchema = z.object({
	id: z.string(),
	content: z.object({
		html: z.string().optional(),
		markdown: z.string().optional(),
		text: z.string().optional(),
	}),
	author: UserSchema.optional().nullable(),
	totalReactions: z.number(),
	dateAdded: z.string(),
});

export const StaticPageSchema = z.object({
	id: z.string(),
	title: z.string(),
	slug: z.string(),
	content: z
		.object({
			html: z.string().optional(),
			markdown: z.string().optional(),
			text: z.string().optional(),
		})
		.optional()
		.nullable(),
	hidden: z.boolean().optional(),
	ogMetaData: z
		.object({
			image: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
	seo: z
		.object({
			title: z.string().optional().nullable(),
			description: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
});

export const SeriesSchema = z.object({
	id: z.string(),
	name: z.string(),
	slug: z.string(),
	description: z
		.object({
			text: z.string().optional().nullable(),
			html: z.string().optional(),
			markdown: z.string().optional(),
		})
		.optional()
		.nullable(),
	coverImage: z.string().optional().nullable(),
	author: UserSchema.optional().nullable(),
});

export const TagSchema = z.object({
	id: z.string(),
	name: z.string(),
	slug: z.string(),
	tagline: z.string().optional().nullable(),
	logo: z.string().optional().nullable(),
	postsCount: z.number().optional(),
	followersCount: z.number().optional(),
});

export const DraftSchema = z.object({
	id: z.string(),
	title: z.string().optional().nullable(),
	subtitle: z.string().optional().nullable(),
	slug: z.string().optional().nullable(),
	content: z
		.object({
			markdown: z.string().optional(),
			html: z.string().optional(),
			text: z.string().optional(),
		})
		.optional()
		.nullable(),
	author: UserSchema.optional().nullable(),
	coverImage: z
		.object({
			url: z.string().optional().nullable(),
			attribution: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
	tags: z
		.array(
			z.object({
				id: z.string(),
				name: z.string(),
				slug: z.string(),
			}),
		)
		.optional()
		.nullable(),
	publication: z
		.object({
			id: z.string(),
			title: z.string(),
		})
		.optional()
		.nullable(),
	series: z
		.object({
			id: z.string(),
			name: z.string(),
			slug: z.string(),
		})
		.optional()
		.nullable(),
	updatedAt: z.string(),
	scheduledDate: z.string().optional().nullable(),
	readTimeInMinutes: z.number().optional(),
	isSubmittedForReview: z.boolean().optional(),
});

export const PresignedPostSchema = z.object({
	url: z.string(),
	fields: z.record(z.string(), z.unknown()),
});

// -----------------------------------------------------------------------------
// Response Wrapper Schemas
// -----------------------------------------------------------------------------

const MeResponseSchema = z.object({
	me: MyUserSchema,
});

const PublicationResponseSchema = z.object({
	publication: PublicationSchema.nullable(),
});

const PublicationsResponseSchema = z.object({
	me: z.object({
		publications: z.object({
			edges: z.array(
				z.object({
					node: PublicationSchema,
					cursor: z.string(),
				}),
			),
			pageInfo: PageInfoSchema,
		}),
	}),
});

const PostsResponseSchema = z.object({
	publication: z.object({
		posts: z.object({
			edges: z.array(
				z.object({
					node: PostSchema,
					cursor: z.string(),
				}),
			),
			pageInfo: PageInfoSchema,
			totalDocuments: z.number().optional(),
		}),
	}),
});

const PostResponseSchema = z.object({
	post: PostSchema.nullable(),
});

const PostBySlugResponseSchema = z.object({
	publication: z.object({
		post: PostSchema.nullable(),
	}),
});

const FeedResponseSchema = z.object({
	feed: z.object({
		edges: z.array(
			z.object({
				node: PostSchema,
				cursor: z.string(),
			}),
		),
		pageInfo: PageInfoSchema,
	}),
});

const SearchPostsOfPublicationResponseSchema = z.object({
	searchPostsOfPublication: z.object({
		edges: z.array(
			z.object({
				node: PostSchema,
				cursor: z.string(),
			}),
		),
		pageInfo: PageInfoSchema,
	}),
});

const UserResponseSchema = z.object({
	user: UserSchema.nullable(),
});

const TagResponseSchema = z.object({
	tag: TagSchema.nullable(),
});

const PostCommentsResponseSchema = z.object({
	post: z.object({
		comments: z.object({
			edges: z.array(
				z.object({
					node: CommentSchema,
					cursor: z.string(),
				}),
			),
			pageInfo: PageInfoSchema,
		}),
	}),
});

const PublishPostResponseSchema = z.object({
	publishPost: z.object({
		post: PostSchema,
	}),
});

const UpdatePostResponseSchema = z.object({
	updatePost: z.object({
		post: PostSchema,
	}),
});

const PagesResponseSchema = z.object({
	publication: z.object({
		staticPages: z.object({
			edges: z.array(
				z.object({
					node: StaticPageSchema,
					cursor: z.string(),
				}),
			),
			pageInfo: PageInfoSchema,
		}),
	}),
});

const PageResponseSchema = z.object({
	publication: z.object({
		staticPage: StaticPageSchema.nullable(),
	}),
});

const SeriesResponseSchema = z.object({
	series: SeriesSchema.nullable(),
});

const SeriesListResponseSchema = z.object({
	publication: z.object({
		seriesList: z.object({
			edges: z.array(
				z.object({
					node: SeriesSchema,
					cursor: z.string(),
				}),
			),
			pageInfo: PageInfoSchema,
		}),
	}),
});

const DraftResponseSchema = z.object({
	draft: DraftSchema.nullable(),
});

const CreateDraftResponseSchema = z.object({
	createDraft: z.object({
		draft: DraftSchema,
	}),
});

const UpdateDraftResponseSchema = z.object({
	updateDraft: z.object({
		draft: DraftSchema,
	}),
});

const PublishDraftResponseSchema = z.object({
	publishDraft: z.object({
		post: PostSchema,
	}),
});

const DeleteDraftResponseSchema = z.object({
	deleteDraft: z.object({
		draft: z.object({ id: z.string() }).nullable(),
	}),
});

const CreateImageUploadURLResponseSchema = z.object({
	createImageUploadURL: z.object({
		presignedPost: PresignedPostSchema,
	}),
});

// -----------------------------------------------------------------------------
// Endpoint Output Map
// -----------------------------------------------------------------------------

export const HashnodeEndpointOutputSchemas = {
	me: MeResponseSchema,
	getPublication: PublicationResponseSchema,
	listPublications: PublicationsResponseSchema,
	getPost: PostResponseSchema,
	getPostBySlug: PostBySlugResponseSchema,
	listPosts: PostsResponseSchema,
	feed: FeedResponseSchema,
	searchPostsOfPublication: SearchPostsOfPublicationResponseSchema,
	publishPost: PublishPostResponseSchema,
	updatePost: UpdatePostResponseSchema,
	getUser: UserResponseSchema,
	getTag: TagResponseSchema,
	listPostComments: PostCommentsResponseSchema,
	listSeries: SeriesListResponseSchema,
	getSeries: SeriesResponseSchema,
	listPages: PagesResponseSchema,
	getPage: PageResponseSchema,
	getDraft: DraftResponseSchema,
	createDraft: CreateDraftResponseSchema,
	updateDraft: UpdateDraftResponseSchema,
	publishDraft: PublishDraftResponseSchema,
	deleteDraft: DeleteDraftResponseSchema,
	createImageUploadURL: CreateImageUploadURLResponseSchema,
} as const;

export type HashnodeEndpointOutputs = {
	[K in keyof typeof HashnodeEndpointOutputSchemas]: z.infer<
		(typeof HashnodeEndpointOutputSchemas)[K]
	>;
};
