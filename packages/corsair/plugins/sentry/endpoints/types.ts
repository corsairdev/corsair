import { z } from 'zod';

// ── Event Input Schemas ──────────────────────────────────────────────────────

const EventsGetInputSchema = z.object({
	organizationSlug: z.string(),
	projectSlug: z.string(),
	eventId: z.string(),
});

const EventsListInputSchema = z.object({
	organizationSlug: z.string(),
	projectSlug: z.string(),
	cursor: z.string().optional(),
});

// ── Issue Input Schemas ──────────────────────────────────────────────────────

const IssuesGetInputSchema = z.object({
	issueId: z.string(),
});

const IssuesListInputSchema = z.object({
	organizationSlug: z.string(),
	projectSlug: z.string(),
	query: z.string().optional(),
	cursor: z.string().optional(),
});

const IssuesUpdateInputSchema = z.object({
	issueId: z.string(),
	status: z.enum(['resolved', 'unresolved', 'ignored']).optional(),
	assignedTo: z.string().optional(),
	hasSeen: z.boolean().optional(),
	isBookmarked: z.boolean().optional(),
	isPublic: z.boolean().optional(),
	isSubscribed: z.boolean().optional(),
});

const IssuesDeleteInputSchema = z.object({
	issueId: z.string(),
});

// ── Organization Input Schemas ───────────────────────────────────────────────

const OrganizationsGetInputSchema = z.object({
	organizationSlug: z.string(),
});

const OrganizationsListInputSchema = z.object({
	cursor: z.string().optional(),
});

const OrganizationsCreateInputSchema = z.object({
	name: z.string(),
	slug: z.string().optional(),
	agreeTerms: z.boolean().optional(),
});

const OrganizationsUpdateInputSchema = z.object({
	organizationSlug: z.string(),
	name: z.string().optional(),
	slug: z.string().optional(),
});

// ── Project Input Schemas ────────────────────────────────────────────────────

const ProjectsGetInputSchema = z.object({
	organizationSlug: z.string(),
	projectSlug: z.string(),
});

const ProjectsListInputSchema = z.object({
	organizationSlug: z.string(),
	cursor: z.string().optional(),
});

const ProjectsCreateInputSchema = z.object({
	organizationSlug: z.string(),
	teamSlug: z.string(),
	name: z.string(),
	slug: z.string().optional(),
	platform: z.string().optional(),
});

const ProjectsUpdateInputSchema = z.object({
	organizationSlug: z.string(),
	projectSlug: z.string(),
	name: z.string().optional(),
	slug: z.string().optional(),
	platform: z.string().optional(),
	isBookmarked: z.boolean().optional(),
});

const ProjectsDeleteInputSchema = z.object({
	organizationSlug: z.string(),
	projectSlug: z.string(),
});

// ── Release Input Schemas ────────────────────────────────────────────────────

const ReleasesGetInputSchema = z.object({
	organizationSlug: z.string(),
	version: z.string(),
});

const ReleasesListInputSchema = z.object({
	organizationSlug: z.string(),
	query: z.string().optional(),
	cursor: z.string().optional(),
});

const ReleasesCreateInputSchema = z.object({
	organizationSlug: z.string(),
	version: z.string(),
	ref: z.string().optional(),
	url: z.string().optional(),
	projects: z.array(z.string()),
	dateReleased: z.string().optional(),
});

const ReleasesUpdateInputSchema = z.object({
	organizationSlug: z.string(),
	version: z.string(),
	ref: z.string().optional(),
	url: z.string().optional(),
	dateReleased: z.string().optional(),
});

const ReleasesDeleteInputSchema = z.object({
	organizationSlug: z.string(),
	version: z.string(),
});

// ── Team Input Schemas ───────────────────────────────────────────────────────

const TeamsGetInputSchema = z.object({
	organizationSlug: z.string(),
	teamSlug: z.string(),
});

const TeamsListInputSchema = z.object({
	organizationSlug: z.string(),
	cursor: z.string().optional(),
});

const TeamsCreateInputSchema = z.object({
	organizationSlug: z.string(),
	name: z.string(),
	slug: z.string().optional(),
});

const TeamsUpdateInputSchema = z.object({
	organizationSlug: z.string(),
	teamSlug: z.string(),
	name: z.string().optional(),
	slug: z.string().optional(),
});

const TeamsDeleteInputSchema = z.object({
	organizationSlug: z.string(),
	teamSlug: z.string(),
});

// ── Input Schema Map ─────────────────────────────────────────────────────────

export const SentryEndpointInputSchemas = {
	eventsGet: EventsGetInputSchema,
	eventsList: EventsListInputSchema,
	issuesGet: IssuesGetInputSchema,
	issuesList: IssuesListInputSchema,
	issuesUpdate: IssuesUpdateInputSchema,
	issuesDelete: IssuesDeleteInputSchema,
	organizationsGet: OrganizationsGetInputSchema,
	organizationsList: OrganizationsListInputSchema,
	organizationsCreate: OrganizationsCreateInputSchema,
	organizationsUpdate: OrganizationsUpdateInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsList: ProjectsListInputSchema,
	projectsCreate: ProjectsCreateInputSchema,
	projectsUpdate: ProjectsUpdateInputSchema,
	projectsDelete: ProjectsDeleteInputSchema,
	releasesGet: ReleasesGetInputSchema,
	releasesList: ReleasesListInputSchema,
	releasesCreate: ReleasesCreateInputSchema,
	releasesUpdate: ReleasesUpdateInputSchema,
	releasesDelete: ReleasesDeleteInputSchema,
	teamsGet: TeamsGetInputSchema,
	teamsList: TeamsListInputSchema,
	teamsCreate: TeamsCreateInputSchema,
	teamsUpdate: TeamsUpdateInputSchema,
	teamsDelete: TeamsDeleteInputSchema,
} as const;

export type SentryEndpointInputs = {
	[K in keyof typeof SentryEndpointInputSchemas]: z.infer<
		(typeof SentryEndpointInputSchemas)[K]
	>;
};

// ── Output Schemas ───────────────────────────────────────────────────────────

const SentryTagSchema = z.object({
	key: z.string(),
	value: z.string(),
});

const SentryEventOutputSchema = z.object({
	eventID: z.string(),
	title: z.string().nullable().optional(),
	message: z.string().nullable().optional(),
	platform: z.string().nullable().optional(),
	dateCreated: z.string().nullable().optional(),
	dateReceived: z.string().nullable().optional(),
	type: z.string().nullable().optional(),
	groupID: z.string().nullable().optional(),
	tags: z.array(SentryTagSchema).nullable().optional(),
	// Sentry's event context is a free-form map whose value shapes vary by
	// platform and SDK; unknown is the only honest type here.
	context: z.record(z.unknown()).nullable().optional(),
});

const SentryIssueOutputSchema = z.object({
	id: z.string(),
	shortId: z.string(),
	title: z.string(),
	culprit: z.string().nullable().optional(),
	permalink: z.string().nullable().optional(),
	level: z.string().nullable().optional(),
	status: z.string(),
	platform: z.string().nullable().optional(),
	type: z.string().nullable().optional(),
	count: z.string().nullable().optional(),
	userCount: z.number().nullable().optional(),
	firstSeen: z.string().nullable().optional(),
	lastSeen: z.string().nullable().optional(),
	isPublic: z.boolean().nullable().optional(),
	isBookmarked: z.boolean().nullable().optional(),
	hasSeen: z.boolean().nullable().optional(),
	isSubscribed: z.boolean().nullable().optional(),
	// Issue metadata is an open-ended map set by Sentry internals; its value
	// type differs per issue type (string, number, object), so unknown is correct.
	metadata: z.record(z.unknown()).nullable().optional(),
	project: z
		.object({
			id: z.string(),
			name: z.string(),
			slug: z.string(),
		})
		.nullable()
		.optional(),
	assignedTo: z
		.object({
			id: z.string(),
			name: z.string(),
			type: z.string(),
		})
		.nullable()
		.optional(),
});

const SentryOrganizationOutputSchema = z.object({
	id: z.string(),
	slug: z.string(),
	name: z.string(),
	dateCreated: z.string().nullable().optional(),
	status: z
		.object({
			id: z.string(),
			name: z.string(),
		})
		.nullable()
		.optional(),
	isEarlyAdopter: z.boolean().nullable().optional(),
	require2FA: z.boolean().nullable().optional(),
	avatar: z
		.object({
			avatarType: z.string(),
			avatarUuid: z.string().nullable().optional(),
		})
		.nullable()
		.optional(),
});

const SentryProjectOutputSchema = z.object({
	id: z.string(),
	slug: z.string(),
	name: z.string(),
	platform: z.string().nullable().optional(),
	dateCreated: z.string().nullable().optional(),
	isBookmarked: z.boolean().nullable().optional(),
	isMember: z.boolean().nullable().optional(),
	hasAccess: z.boolean().nullable().optional(),
	organization: SentryOrganizationOutputSchema.nullable().optional(),
	team: z
		.object({
			id: z.string(),
			slug: z.string(),
			name: z.string(),
		})
		.nullable()
		.optional(),
});

const SentryReleaseOutputSchema = z.object({
	id: z.number(),
	version: z.string(),
	shortVersion: z.string().nullable().optional(),
	dateCreated: z.string().nullable().optional(),
	dateReleased: z.string().nullable().optional(),
	firstEvent: z.string().nullable().optional(),
	lastEvent: z.string().nullable().optional(),
	newGroups: z.number().nullable().optional(),
	url: z.string().nullable().optional(),
	ref: z.string().nullable().optional(),
	projects: z
		.array(
			z.object({
				id: z.number(),
				slug: z.string(),
				name: z.string(),
			}),
		)
		.nullable()
		.optional(),
});

const SentryTeamOutputSchema = z.object({
	id: z.string(),
	slug: z.string(),
	name: z.string(),
	dateCreated: z.string().nullable().optional(),
	isMember: z.boolean().nullable().optional(),
	memberCount: z.number().nullable().optional(),
	hasAccess: z.boolean().nullable().optional(),
	isPending: z.boolean().nullable().optional(),
	avatar: z
		.object({
			avatarType: z.string(),
			avatarUuid: z.string().nullable().optional(),
		})
		.nullable()
		.optional(),
});

// ── Output Schema Map ────────────────────────────────────────────────────────

export const SentryEndpointOutputSchemas = {
	eventsGet: SentryEventOutputSchema,
	eventsList: z.array(SentryEventOutputSchema),
	issuesGet: SentryIssueOutputSchema,
	issuesList: z.array(SentryIssueOutputSchema),
	issuesUpdate: SentryIssueOutputSchema,
	issuesDelete: z.boolean(),
	organizationsGet: SentryOrganizationOutputSchema,
	organizationsList: z.array(SentryOrganizationOutputSchema),
	organizationsCreate: SentryOrganizationOutputSchema,
	organizationsUpdate: SentryOrganizationOutputSchema,
	projectsGet: SentryProjectOutputSchema,
	projectsList: z.array(SentryProjectOutputSchema),
	projectsCreate: SentryProjectOutputSchema,
	projectsUpdate: SentryProjectOutputSchema,
	projectsDelete: z.boolean(),
	releasesGet: SentryReleaseOutputSchema,
	releasesList: z.array(SentryReleaseOutputSchema),
	releasesCreate: SentryReleaseOutputSchema,
	releasesUpdate: SentryReleaseOutputSchema,
	releasesDelete: z.boolean(),
	teamsGet: SentryTeamOutputSchema,
	teamsList: z.array(SentryTeamOutputSchema),
	teamsCreate: SentryTeamOutputSchema,
	teamsUpdate: SentryTeamOutputSchema,
	teamsDelete: z.boolean(),
} as const;

export type SentryEndpointOutputs = {
	[K in keyof typeof SentryEndpointOutputSchemas]: z.infer<
		(typeof SentryEndpointOutputSchemas)[K]
	>;
};

// ── Exported Types ───────────────────────────────────────────────────────────

export type SentryEventOutput = z.infer<typeof SentryEventOutputSchema>;
export type SentryIssueOutput = z.infer<typeof SentryIssueOutputSchema>;
export type SentryOrganizationOutput = z.infer<
	typeof SentryOrganizationOutputSchema
>;
export type SentryProjectOutput = z.infer<typeof SentryProjectOutputSchema>;
export type SentryReleaseOutput = z.infer<typeof SentryReleaseOutputSchema>;
export type SentryTeamOutput = z.infer<typeof SentryTeamOutputSchema>;
