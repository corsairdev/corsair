import { z } from 'zod';

// Shapes follow the Coda API v1 OpenAPI spec: https://coda.io/apis/v1/openapi.json

const AccessTypeNotNoneSchema = z.enum(['readonly', 'write', 'comment']);
const PageContentFormatSchema = z.enum(['html', 'markdown']);
const PageContentSchema = z.object({
	format: PageContentFormatSchema,
	content: z.string(),
});
const PageEmbedRenderMethodSchema = z.enum(['compatibility', 'standard']);
const PageCreateContentSchema = z.union([
	z.object({ type: z.enum(['canvas']), canvasContent: PageContentSchema }),
	z.object({
		type: z.enum(['embed']),
		url: z.string(),
		renderMethod: PageEmbedRenderMethodSchema.optional(),
	}),
	z.union([
		z.object({
			type: z.enum(['syncPage']),
			mode: z.enum(['page']),
			includeSubpages: z.boolean(),
			sourcePageId: z.string(),
			sourceDocId: z.string(),
		}),
		z.object({
			type: z.enum(['syncPage']),
			mode: z.enum(['document']),
			sourceDocId: z.string(),
		}),
	]),
]);
const DocPublishModeSchema = z.enum(['view', 'play', 'edit']);
const AddedEmailPrincipalSchema = z.object({
	type: z.enum(['email']),
	email: z.string(),
});
const AddedGroupPrincipalSchema = z.object({
	type: z.enum(['group']),
	groupId: z.string(),
});
const AddedDomainPrincipalSchema = z.object({
	type: z.enum(['domain']),
	domain: z.string(),
});
const AddedWorkspacePrincipalSchema = z.object({
	type: z.enum(['workspace']),
	workspaceId: z.string(),
});
const AddedAnyonePrincipalSchema = z.object({ type: z.enum(['anyone']) });
const AddedPrincipalSchema = z.union([
	AddedEmailPrincipalSchema,
	AddedGroupPrincipalSchema,
	AddedDomainPrincipalSchema,
	AddedWorkspacePrincipalSchema,
	AddedAnyonePrincipalSchema,
]);
const PageContentInsertionModeSchema = z.enum(['append', 'prepend', 'replace']);
const PageContentOutputFormatSchema = z.enum(['html', 'markdown']);
const SortBySchema = z.enum(['name']);
const TableTypeSchema = z.enum(['table', 'view', 'database']);
const RowsSortBySchema = z.enum(['createdAt', 'natural', 'updatedAt']);
const ValueFormatSchema = z.enum(['simple', 'simpleWithArrays', 'rich']);
const ScalarValueSchema = z.union([z.string(), z.number(), z.boolean()]);
const ValueSchema = z.union([
	ScalarValueSchema,
	z.array(z.union([ScalarValueSchema, z.array(ScalarValueSchema)])),
]);
const CellEditSchema = z.object({ column: z.string(), value: ValueSchema });
const RowEditSchema = z.object({ cells: z.array(CellEditSchema) });
const UpdateCustomDocDomainRequestSchema = z.object({});
const WebhookTriggerPayloadSchema = z.record(z.string(), z.json());
const AnalyticsScaleSchema = z.enum(['daily', 'cumulative']);
const DocAnalyticsOrderBySchema = z.enum([
	'date',
	'docId',
	'title',
	'createdAt',
	'publishedAt',
	'likes',
	'copies',
	'views',
	'sessionsDesktop',
	'sessionsMobile',
	'sessionsOther',
	'totalSessions',
	'aiCreditsChat',
	'aiCreditsBlock',
	'aiCreditsColumn',
	'aiCreditsAssistant',
	'aiCreditsReviewer',
	'aiCredits',
]);
const SortDirectionSchema = z.enum(['ascending', 'descending']);
const PackAnalyticsOrderBySchema = z.enum([
	'date',
	'packId',
	'name',
	'createdAt',
	'docInstalls',
	'workspaceInstalls',
	'numFormulaInvocations',
	'numActionInvocations',
	'numSyncInvocations',
	'numMetadataInvocations',
	'docsActivelyUsing',
	'docsActivelyUsing7Day',
	'docsActivelyUsing30Day',
	'docsActivelyUsing90Day',
	'docsActivelyUsingAllTime',
	'workspacesActivelyUsing',
	'workspacesActivelyUsing7Day',
	'workspacesActivelyUsing30Day',
	'workspacesActivelyUsing90Day',
	'workspacesActivelyUsingAllTime',
	'workspacesWithActiveSubscriptions',
	'workspacesWithSuccessfulTrials',
	'revenueUsd',
]);
const PackFormulaTypeSchema = z.enum(['action', 'formula', 'sync', 'metadata']);
const PackFormulaAnalyticsOrderBySchema = z.enum([
	'date',
	'formulaName',
	'formulaType',
	'formulaInvocations',
	'medianLatencyMs',
	'medianResponseSizeBytes',
	'errors',
	'docsActivelyUsing',
	'docsActivelyUsing7Day',
	'docsActivelyUsing30Day',
	'docsActivelyUsing90Day',
	'docsActivelyUsingAllTime',
	'workspacesActivelyUsing',
	'workspacesActivelyUsing7Day',
	'workspacesActivelyUsing30Day',
	'workspacesActivelyUsing90Day',
	'workspacesActivelyUsingAllTime',
]);
const WorkspaceUserRoleSchema = z.enum(['Admin', 'DocMaker', 'Editor']);
const PackAccessTypeSchema = z.enum(['none', 'view', 'test', 'edit', 'admin']);
const PacksSortBySchema = z.enum(['title', 'createdAt', 'updatedAt']);
const PackEntrypointSchema = z.enum(['go', 'docs']);
const PackCategoryTypeSchema = z.enum(['connector', 'agent', 'customAgent']);
const ImageFileForUpdatePackRequestSchema = z.object({
	assetId: z.string(),
	filename: z.string(),
	mimeType: z.string().optional(),
});
const PackSourceCodeVisibilitySchema = z.enum(['private', 'shared']);
const PackSourceSchema = z.enum(['web', 'cli']);
const PackAssetTypeSchema = z.enum([
	'logo',
	'cover',
	'exampleImage',
	'agentImage',
]);
const PackAccessTypesSchema = z.array(PackAccessTypeSchema);
const PackListingsSortBySchema = z.enum([
	'packId',
	'name',
	'packVersion',
	'packVersionModifiedAt',
	'agentDirectorySort',
]);
const PackListingInstallContextTypeSchema = z.enum(['workspace', 'doc']);
const IngestionPackReleaseChannelSchema = z.enum(['LIVE', 'LATEST']);
const PackUserPrincipalSchema = z.object({
	type: z.enum(['user']),
	email: z.string(),
});
const PackWorkspacePrincipalSchema = z.object({
	type: z.enum(['workspace']),
	workspaceId: z.string(),
});
const PackGlobalPrincipalSchema = z.object({ type: z.enum(['worldwide']) });
const PackNomosOrganizationPrincipalSchema = z.object({
	type: z.enum(['nomosOrganization']),
	nomosOrganizationId: z.string(),
});
const PackGroupPrincipalSchema = z.object({
	type: z.enum(['group']),
	groupId: z.string(),
	groupName: z.string().optional(),
});
const PackGrammarlyInstitutionPrincipalSchema = z.object({
	type: z.enum(['grammarlyInstitution']),
	grammarlyInstitutionId: z.number(),
});
const PackPrincipalSchema = z.union([
	PackUserPrincipalSchema,
	PackWorkspacePrincipalSchema,
	PackGlobalPrincipalSchema,
	PackNomosOrganizationPrincipalSchema,
	PackGroupPrincipalSchema,
	PackGrammarlyInstitutionPrincipalSchema,
]);
const PackFeaturedDocRequestItemSchema = z.object({
	url: z.string(),
	isPinned: z.boolean().optional(),
});
const PackConnectionHeaderCredentialsSchema = z.object({
	type: z.enum(['header']),
	token: z.string(),
});
const PackConnectionMultiHeaderCredentialsSchema = z.object({
	type: z.enum(['multiHeader']),
	tokens: z.array(z.object({ key: z.string(), value: z.string() })),
});
const PackConnectionUrlParamCredentialsSchema = z.object({
	type: z.enum(['urlParam']),
	params: z.array(z.object({ key: z.string(), value: z.string() })),
});
const PackConnectionHttpBasicCredentialsSchema = z.object({
	type: z.enum(['httpBasic']),
	username: z.string(),
	password: z.string().optional(),
});
const PackConnectionCustomCredentialsSchema = z.object({
	type: z.enum(['custom']),
	params: z.array(z.object({ key: z.string(), value: z.string() })),
});
const PackConnectionOauth2ClientCredentialsSchema = z.object({
	type: z.enum(['oauth2ClientCredentials']),
	clientId: z.string(),
	clientSecret: z.string(),
});
const PackConnectionGoogleServiceAccountCredentialsSchema = z.object({
	type: z.enum(['googleServiceAccount']),
	serviceAccountKey: z.string(),
});
const PackConnectionAwsAssumeRoleCredentialsSchema = z.object({
	type: z.enum(['awsAssumeRole']),
	roleArn: z.string(),
	externalId: z.string(),
});
const PackConnectionAwsAccessKeyCredentialsSchema = z.object({
	type: z.enum(['awsAccessKey']),
	accessKeyId: z.string(),
	secretAccessKey: z.string(),
});
const PackSystemConnectionCredentialsSchema = z.union([
	PackConnectionHeaderCredentialsSchema,
	PackConnectionMultiHeaderCredentialsSchema,
	PackConnectionUrlParamCredentialsSchema,
	PackConnectionHttpBasicCredentialsSchema,
	PackConnectionCustomCredentialsSchema,
	PackConnectionOauth2ClientCredentialsSchema,
	PackConnectionGoogleServiceAccountCredentialsSchema,
	PackConnectionAwsAssumeRoleCredentialsSchema,
	PackConnectionAwsAccessKeyCredentialsSchema,
]);
const PackConnectionHeaderPatchSchema = z.object({
	type: z.enum(['header']),
	token: z.string().optional(),
});
const PackConnectionMultiHeaderPatchSchema = z.object({
	type: z.enum(['multiHeader']),
	tokensToPatch: z
		.array(z.object({ key: z.string(), value: z.string() }))
		.optional(),
});
const PackConnectionUrlParamPatchSchema = z.object({
	type: z.enum(['urlParam']),
	paramsToPatch: z
		.array(z.object({ key: z.string(), value: z.string() }))
		.optional(),
});
const PackConnectionHttpBasicPatchSchema = z.object({
	type: z.enum(['httpBasic']),
	username: z.string().optional(),
	password: z.string().optional(),
});
const PackConnectionCustomPatchSchema = z.object({
	type: z.enum(['custom']),
	paramsToPatch: z
		.array(z.object({ key: z.string(), value: z.string() }))
		.optional(),
});
const PackConnectionOauth2ClientCredentialsPatchSchema = z.object({
	type: z.enum(['oauth2ClientCredentials']),
	clientId: z.string().optional(),
	clientSecret: z.string().optional(),
});
const PackConnectionGoogleServiceAccountPatchSchema = z.object({
	type: z.enum(['googleServiceAccount']),
	serviceAccountKey: z.string().optional(),
});
const PackConnectionAwsAssumeRolePatchSchema = z.object({
	type: z.enum(['awsAssumeRole']),
	roleArn: z.string().optional(),
	externalId: z.string().optional(),
});
const PackConnectionAwsAccessKeyPatchSchema = z.object({
	type: z.enum(['awsAccessKey']),
	accessKeyId: z.string().optional(),
	secretAccessKey: z.string().optional(),
});
const PatchPackSystemConnectionRequestSchema = z.union([
	PackConnectionHeaderPatchSchema,
	PackConnectionMultiHeaderPatchSchema,
	PackConnectionUrlParamPatchSchema,
	PackConnectionHttpBasicPatchSchema,
	PackConnectionCustomPatchSchema,
	PackConnectionOauth2ClientCredentialsPatchSchema,
	PackConnectionGoogleServiceAccountPatchSchema,
	PackConnectionAwsAssumeRolePatchSchema,
	PackConnectionAwsAccessKeyPatchSchema,
]);
const PackLogTypeSchema = z.enum([
	'custom',
	'fetcher',
	'invocation',
	'internal',
	'auth',
	'ingestionLifecycle',
	'ingestionDebug',
	'agentRuntime',
	'mcp',
]);
const IngestionStatusSchema = z.enum([
	'QUEUED',
	'STARTED',
	'CANCELLED',
	'UP_FOR_RETRY',
	'COMPLETED',
	'FAILED',
]);
const IngestionExecutionTypeSchema = z.enum(['FULL', 'INCREMENTAL']);
const WorkspaceReferenceSchema = z.object({
	id: z.string(),
	type: z.enum(['workspace']),
	organizationId: z.string().optional(),
	browserLink: z.string(),
	name: z.string().optional(),
});
const UserSchema = z.object({
	name: z.string(),
	loginId: z.string(),
	type: z.enum(['user']),
	pictureLink: z.string().optional(),
	scoped: z.boolean(),
	tokenName: z.string(),
	href: z.string(),
	workspace: WorkspaceReferenceSchema,
});
const TypeSchema = z.enum([
	'aclMetadata',
	'aclPermissions',
	'aclSettings',
	'agentPackLog',
	'agentRun',
	'analyticsLastUpdated',
	'apiLink',
	'automation',
	'column',
	'control',
	'doc',
	'customDocDomain',
	'customDocDomainProvider',
	'docAnalytics',
	'docAnalyticsSummary',
	'docAnalyticsV2',
	'folder',
	'formula',
	'goLink',
	'ingestionBatchExecution',
	'ingestionExecution',
	'ingestionExecutionAttempt',
	'ingestionPackLog',
	'ingestionParentItem',
	'mutationStatus',
	'pack',
	'packAclPermissions',
	'packAnalytics',
	'packAnalyticsSummary',
	'packAsset',
	'packCategory',
	'packConfigurationSchema',
	'packFeaturedDocs',
	'packFormulaAnalytics',
	'packInvitation',
	'packListingDraft',
	'packLog',
	'packMaker',
	'packOauthConfig',
	'packRelease',
	'packReview',
	'packSourceCode',
	'packSystemConnection',
	'packVersion',
	'page',
	'pageContentExport',
	'pageContentExportStatus',
	'principal',
	'row',
	'table',
	'user',
	'workspace',
]);
const ApiLinkResolvedResourceSchema = z.object({
	type: TypeSchema,
	id: z.string(),
	name: z.string().optional(),
	href: z.string(),
});
const ApiLinkSchema = z.object({
	type: z.enum(['apiLink']),
	href: z.string(),
	browserLink: z.string().optional(),
	resource: ApiLinkResolvedResourceSchema,
});
const MutationStatusSchema = z.object({
	completed: z.boolean(),
	warning: z.string().optional(),
});
const DocCategorySchema = z.object({ name: z.string() });
const DocCategoryListSchema = z.object({ items: z.array(DocCategorySchema) });
const IconSchema = z.object({
	name: z.string(),
	type: z.string(),
	browserLink: z.string(),
});
const DocSizeSchema = z.object({
	totalRowCount: z.number(),
	tableAndViewCount: z.number(),
	baseTableCount: z.number().optional(),
	pageCount: z.number(),
	overApiSizeLimit: z.boolean(),
});
const DocPublishedSchema = z.object({
	description: z.string().optional(),
	browserLink: z.string(),
	imageLink: z.string().optional(),
	discoverable: z.boolean(),
	earnCredit: z.boolean(),
	mode: DocPublishModeSchema,
	categories: z.array(DocCategorySchema),
});
const FolderReferenceSchema = z.object({
	id: z.string(),
	type: z.enum(['folder']),
	browserLink: z.string(),
	name: z.string().optional(),
});
const DocSchema = z.object({
	id: z.string(),
	type: z.enum(['doc']),
	href: z.string(),
	browserLink: z.string(),
	icon: IconSchema.optional(),
	name: z.string(),
	owner: z.string(),
	ownerName: z.string(),
	docSize: DocSizeSchema.optional(),
	sourceDoc: z
		.object({
			id: z.string(),
			type: z.enum(['doc']),
			href: z.string(),
			browserLink: z.string(),
		})
		.optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
	published: DocPublishedSchema.optional(),
	folder: FolderReferenceSchema,
	workspace: WorkspaceReferenceSchema,
	workspaceId: z.string(),
	folderId: z.string(),
});
const nextPageTokenSchema = z.string();
const DocListSchema = z.object({
	items: z.array(DocSchema),
	href: z.string().optional(),
	nextPageToken: nextPageTokenSchema.optional(),
	nextPageLink: z.string().optional(),
});
const DocumentCreationResultSchema = z.object({
	id: z.string(),
	type: z.enum(['doc']),
	href: z.string(),
	browserLink: z.string(),
	icon: IconSchema.optional(),
	name: z.string(),
	owner: z.string(),
	ownerName: z.string(),
	docSize: DocSizeSchema.optional(),
	sourceDoc: z
		.object({
			id: z.string(),
			type: z.enum(['doc']),
			href: z.string(),
			browserLink: z.string(),
		})
		.optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
	published: DocPublishedSchema.optional(),
	folder: FolderReferenceSchema,
	workspace: WorkspaceReferenceSchema,
	workspaceId: z.string(),
	folderId: z.string(),
	requestId: z.string().optional(),
});
const DocUpdateResultSchema = z.object({});
const DocDeleteSchema = z.object({});
const PublishResultSchema = z.object({ requestId: z.string() });
const UnpublishResultSchema = z.object({});
const EmailPrincipalSchema = z.object({
	type: z.enum(['email']),
	email: z.string(),
});
const GroupPrincipalSchema = z.object({
	type: z.enum(['group']),
	groupId: z.string(),
	groupName: z.string(),
});
const DomainPrincipalSchema = z.object({
	type: z.enum(['domain']),
	domain: z.string(),
});
const WorkspacePrincipalSchema = z.object({
	type: z.enum(['workspace']),
	workspaceId: z.string(),
});
const AnyonePrincipalSchema = z.object({ type: z.enum(['anyone']) });
const InternalAccessPrincipalSchema = z.object({
	type: z.enum(['internalAccess']),
	internalAccessType: z.string(),
});
const PrincipalSchema = z.union([
	EmailPrincipalSchema,
	GroupPrincipalSchema,
	DomainPrincipalSchema,
	WorkspacePrincipalSchema,
	AnyonePrincipalSchema,
	InternalAccessPrincipalSchema,
]);
const AccessTypeSchema = z.enum(['readonly', 'write', 'comment', 'none']);
const PermissionSchema = z.object({
	principal: PrincipalSchema,
	id: z.string(),
	access: AccessTypeSchema,
});
const AclSchema = z.object({
	items: z.array(PermissionSchema),
	href: z.string(),
	nextPageToken: nextPageTokenSchema.optional(),
	nextPageLink: z.string().optional(),
});
const AddPermissionResultSchema = z.object({});
const DeletePermissionResultSchema = z.object({});
const UserSummarySchema = z.object({
	name: z.string(),
	loginId: z.string(),
	type: z.enum(['user']),
	pictureLink: z.string().optional(),
});
const SearchPrincipalsResponseSchema = z.object({
	users: z.array(UserSummarySchema),
	groups: z.array(GroupPrincipalSchema),
});
const AclMetadataSchema = z.object({
	canShare: z.boolean(),
	canShareWithWorkspace: z.boolean(),
	canShareWithOrg: z.boolean(),
	canCopy: z.boolean(),
});
const AclSettingsSchema = z.object({
	allowEditorsToChangePermissions: z.boolean(),
	allowCopying: z.boolean(),
	allowViewersToRequestEditing: z.boolean(),
});
const ImageSchema = z.object({
	browserLink: z.string(),
	type: z.string().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
});
const PageTypeSchema = z.enum(['canvas', 'embed', 'syncPage']);
const PageReferenceSchema = z.object({
	id: z.string(),
	type: z.enum(['page']),
	href: z.string(),
	browserLink: z.string(),
	name: z.string(),
});
const PersonValueSchema = z.object({
	'@context': z.string(),
	'@type': z.enum(['Person']),
	additionalType: z.string().optional(),
	name: z.string(),
	email: z.string().optional(),
});
const PageSchema = z.object({
	id: z.string(),
	type: z.enum(['page']),
	href: z.string(),
	browserLink: z.string(),
	name: z.string(),
	subtitle: z.string().optional(),
	icon: IconSchema.optional(),
	image: ImageSchema.optional(),
	contentType: PageTypeSchema,
	isHidden: z.boolean(),
	isEffectivelyHidden: z.boolean(),
	parent: PageReferenceSchema.optional(),
	children: z.array(PageReferenceSchema),
	authors: z.array(PersonValueSchema).optional(),
	createdAt: z.string().optional(),
	createdBy: PersonValueSchema.optional(),
	updatedAt: z.string().optional(),
	updatedBy: PersonValueSchema.optional(),
});
const PageListSchema = z.object({
	items: z.array(PageSchema),
	href: z.string().optional(),
	nextPageToken: nextPageTokenSchema.optional(),
	nextPageLink: z.string().optional(),
});
const PageCreateResultSchema = z.object({
	requestId: z.string(),
	id: z.string(),
});
const PageUpdateResultSchema = z.object({
	requestId: z.string(),
	id: z.string(),
});
const PageDeleteResultSchema = z.object({
	requestId: z.string(),
	id: z.string(),
});
const PageContentItemTypeSchema = z.enum(['line']);
const PageLineStyleSchema = z.enum([
	'blockQuote',
	'bulletedList',
	'checkboxList',
	'code',
	'collapsibleList',
	'h1',
	'h2',
	'h3',
	'numberedList',
	'paragraph',
	'pullQuote',
]);
const PageContentItemContentFormatSchema = z.enum(['plainText']);
const PageContentItemContentSchema = z.object({
	style: PageLineStyleSchema,
	format: PageContentItemContentFormatSchema,
	content: z.string(),
	lineLevel: z.number().optional(),
});
const PageContentItemSchema = z.object({
	id: z.string(),
	type: PageContentItemTypeSchema,
	itemContent: PageContentItemContentSchema.optional(),
});
const PageContentListSchema = z.object({
	items: z.array(PageContentItemSchema),
	href: z.string(),
	nextPageToken: nextPageTokenSchema.optional(),
	nextPageLink: z.string().optional(),
});
const PageContentDeleteResultSchema = z.object({
	requestId: z.string(),
	id: z.string(),
});
const BeginPageContentExportResponseSchema = z.object({
	id: z.string(),
	status: z.string(),
	href: z.string(),
});
const PageContentExportStatusResponseSchema = z.object({
	id: z.string(),
	status: z.string(),
	href: z.string(),
	downloadLink: z.string().optional(),
	error: z.string().optional(),
});
const TableReferenceSchema = z.object({
	id: z.string(),
	type: z.enum(['table']),
	tableType: TableTypeSchema,
	href: z.string(),
	browserLink: z.string(),
	name: z.string(),
	parent: PageReferenceSchema.optional(),
});
const TableListSchema = z.object({
	items: z.array(TableReferenceSchema),
	href: z.string().optional(),
	nextPageToken: nextPageTokenSchema.optional(),
	nextPageLink: z.string().optional(),
});
const ColumnReferenceSchema = z.object({
	id: z.string(),
	type: z.enum(['column']),
	href: z.string(),
});
const SortSchema = z.object({
	column: ColumnReferenceSchema,
	direction: SortDirectionSchema,
});
const LayoutSchema = z.enum([
	'default',
	'areaChart',
	'barChart',
	'bubbleChart',
	'calendar',
	'card',
	'detail',
	'form',
	'ganttChart',
	'lineChart',
	'masterDetail',
	'pieChart',
	'scatterChart',
	'slide',
	'wordCloud',
]);
const FormulaDetailSchema = z.object({
	valid: z.boolean(),
	isVolatile: z.boolean().optional(),
	hasUserFormula: z.boolean().optional(),
	hasTodayFormula: z.boolean().optional(),
	hasNowFormula: z.boolean().optional(),
});
const TableSchema = z.object({
	id: z.string(),
	type: z.enum(['table']),
	tableType: TableTypeSchema,
	href: z.string(),
	browserLink: z.string(),
	name: z.string(),
	parent: PageReferenceSchema,
	parentTable: TableReferenceSchema.optional(),
	displayColumn: ColumnReferenceSchema,
	rowCount: z.number(),
	sorts: z.array(SortSchema),
	layout: LayoutSchema,
	filter: FormulaDetailSchema.optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
const ColumnFormatTypeSchema = z.enum([
	'text',
	'person',
	'lookup',
	'number',
	'percent',
	'currency',
	'date',
	'dateTime',
	'time',
	'duration',
	'email',
	'link',
	'slider',
	'scale',
	'image',
	'imageReference',
	'attachments',
	'button',
	'checkbox',
	'select',
	'packObject',
	'reaction',
	'canvas',
	'other',
]);
const ButtonColumnFormatSchema = z.object({
	type: ColumnFormatTypeSchema,
	isArray: z.boolean(),
	label: z.string().optional(),
	disableIf: z.string().optional(),
	action: z.string().optional(),
});
const CheckboxDisplayTypeSchema = z.enum(['toggle', 'check']);
const CheckboxColumnFormatSchema = z.object({
	type: ColumnFormatTypeSchema,
	isArray: z.boolean(),
	displayType: CheckboxDisplayTypeSchema,
});
const DateColumnFormatSchema = z.object({
	type: ColumnFormatTypeSchema,
	isArray: z.boolean(),
	format: z.string().optional(),
});
const DateTimeColumnFormatSchema = z.object({
	type: ColumnFormatTypeSchema,
	isArray: z.boolean(),
	dateFormat: z.string().optional(),
	timeFormat: z.string().optional(),
});
const DurationUnitSchema = z.enum(['days', 'hours', 'minutes', 'seconds']);
const DurationColumnFormatSchema = z.object({
	type: ColumnFormatTypeSchema,
	isArray: z.boolean(),
	precision: z.number().optional(),
	maxUnit: DurationUnitSchema.optional(),
});
const EmailDisplayTypeSchema = z.enum([
	'iconAndEmail',
	'iconOnly',
	'emailOnly',
]);
const EmailColumnFormatSchema = z.object({
	type: ColumnFormatTypeSchema,
	isArray: z.boolean(),
	display: EmailDisplayTypeSchema.optional(),
	autocomplete: z.boolean().optional(),
});
const LinkDisplayTypeSchema = z.enum([
	'iconOnly',
	'url',
	'title',
	'card',
	'embed',
]);
const LinkColumnFormatSchema = z.object({
	type: ColumnFormatTypeSchema,
	isArray: z.boolean(),
	display: LinkDisplayTypeSchema.optional(),
	force: z.boolean().optional(),
});
const CurrencyFormatTypeSchema = z.enum([
	'currency',
	'accounting',
	'financial',
]);
const CurrencyColumnFormatSchema = z.object({
	type: ColumnFormatTypeSchema,
	isArray: z.boolean(),
	currencyCode: z.string().optional(),
	precision: z.number().optional(),
	format: CurrencyFormatTypeSchema.optional(),
});
const NumberOrNumberFormulaSchema = z.union([z.number(), z.string()]);
const ImageShapeStyleSchema = z.enum(['auto', 'circle']);
const ImageReferenceColumnFormatSchema = z.object({
	type: ColumnFormatTypeSchema,
	isArray: z.boolean(),
	width: NumberOrNumberFormulaSchema,
	height: NumberOrNumberFormulaSchema,
	style: ImageShapeStyleSchema,
});
const NumericColumnFormatSchema = z.object({
	type: ColumnFormatTypeSchema,
	isArray: z.boolean(),
	precision: z.number().optional(),
	useThousandsSeparator: z.boolean().optional(),
});
const ReferenceColumnFormatSchema = z.object({
	type: ColumnFormatTypeSchema,
	isArray: z.boolean(),
	table: TableReferenceSchema,
});
const SelectOptionSchema = z.object({
	name: z.string(),
	backgroundColor: z.string().optional(),
	foregroundColor: z.string().optional(),
});
const SelectColumnFormatSchema = z.object({
	type: ColumnFormatTypeSchema,
	isArray: z.boolean(),
	options: z.array(SelectOptionSchema).optional(),
});
const SimpleColumnFormatSchema = z.object({
	type: ColumnFormatTypeSchema,
	isArray: z.boolean(),
});
const IconSetSchema = z.enum([
	'star',
	'circle',
	'fire',
	'bug',
	'diamond',
	'bell',
	'thumbsup',
	'heart',
	'chili',
	'smiley',
	'lightning',
	'currency',
	'coffee',
	'person',
	'battery',
	'cocktail',
	'cloud',
	'sun',
	'checkmark',
	'lightbulb',
]);
const ScaleColumnFormatSchema = z.object({
	type: ColumnFormatTypeSchema,
	isArray: z.boolean(),
	maximum: z.number(),
	icon: IconSetSchema,
});
const SliderDisplayTypeSchema = z.enum(['slider', 'progress']);
const SliderColumnFormatSchema = z.object({
	type: ColumnFormatTypeSchema,
	isArray: z.boolean(),
	minimum: NumberOrNumberFormulaSchema.optional(),
	maximum: NumberOrNumberFormulaSchema.optional(),
	step: NumberOrNumberFormulaSchema.optional(),
	displayType: SliderDisplayTypeSchema.optional(),
	showValue: z.boolean().optional(),
});
const TimeColumnFormatSchema = z.object({
	type: ColumnFormatTypeSchema,
	isArray: z.boolean(),
	format: z.string().optional(),
});
const ColumnFormatSchema = z.union([
	ButtonColumnFormatSchema,
	CheckboxColumnFormatSchema,
	DateColumnFormatSchema,
	DateTimeColumnFormatSchema,
	DurationColumnFormatSchema,
	EmailColumnFormatSchema,
	LinkColumnFormatSchema,
	CurrencyColumnFormatSchema,
	ImageReferenceColumnFormatSchema,
	NumericColumnFormatSchema,
	ReferenceColumnFormatSchema,
	SelectColumnFormatSchema,
	SimpleColumnFormatSchema,
	ScaleColumnFormatSchema,
	SliderColumnFormatSchema,
	TimeColumnFormatSchema,
]);
const ColumnSchema = z.object({
	id: z.string(),
	type: z.enum(['column']),
	href: z.string(),
	name: z.string(),
	display: z.boolean().optional(),
	calculated: z.boolean().optional(),
	formula: z.string().optional(),
	defaultValue: z.string().optional(),
	format: ColumnFormatSchema,
});
const ColumnListSchema = z.object({
	items: z.array(ColumnSchema),
	href: z.string().optional(),
	nextPageToken: nextPageTokenSchema.optional(),
	nextPageLink: z.string().optional(),
});
const ColumnDetailSchema = z.object({
	id: z.string(),
	type: z.enum(['column']),
	href: z.string(),
	name: z.string(),
	display: z.boolean().optional(),
	calculated: z.boolean().optional(),
	formula: z.string().optional(),
	defaultValue: z.string().optional(),
	format: ColumnFormatSchema,
	parent: TableReferenceSchema,
});
const CurrencyAmountSchema = z.union([z.string(), z.number()]);
const CurrencyValueSchema = z.object({
	'@context': z.string(),
	'@type': z.enum(['MonetaryAmount']),
	additionalType: z.string().optional(),
	currency: z.string(),
	amount: CurrencyAmountSchema,
});
const ImageStatusSchema = z.enum(['live', 'deleted', 'failed']);
const ImageUrlValueSchema = z.object({
	'@context': z.string(),
	'@type': z.enum(['ImageObject']),
	additionalType: z.string().optional(),
	name: z.string().optional(),
	url: z.string().optional(),
	height: z.number().optional(),
	width: z.number().optional(),
	status: ImageStatusSchema.optional(),
});
const UrlValueSchema = z.object({
	'@context': z.string(),
	'@type': z.enum(['WebPage']),
	additionalType: z.string().optional(),
	name: z.string().optional(),
	url: z.string(),
});
const RowValueSchema = z.object({
	'@context': z.string(),
	'@type': z.enum(['StructuredValue']),
	additionalType: z.enum(['row']),
	name: z.string(),
	url: z.string(),
	tableId: z.string(),
	rowId: z.string(),
	tableUrl: z.string(),
});
const RichSingleValueSchema = z.union([
	ScalarValueSchema,
	CurrencyValueSchema,
	ImageUrlValueSchema,
	PersonValueSchema,
	UrlValueSchema,
	RowValueSchema,
]);
const RichValueSchema = z.union([
	RichSingleValueSchema,
	z.array(z.union([RichSingleValueSchema, z.array(RichSingleValueSchema)])),
]);
const CellValueSchema = z.union([ValueSchema, RichValueSchema]);
const RowSchema = z.object({
	id: z.string(),
	type: z.enum(['row']),
	href: z.string(),
	name: z.string(),
	index: z.number(),
	browserLink: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	values: z.record(z.string(), CellValueSchema),
});
const nextSyncTokenSchema = z.string();
const RowListSchema = z.object({
	items: z.array(RowSchema),
	href: z.string().optional(),
	nextPageToken: nextPageTokenSchema.optional(),
	nextPageLink: z.string().optional(),
	nextSyncToken: nextSyncTokenSchema.optional(),
});
const RowDetailSchema = z.object({
	id: z.string(),
	type: z.enum(['row']),
	href: z.string(),
	name: z.string(),
	index: z.number(),
	browserLink: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	values: z.record(z.string(), CellValueSchema),
	parent: TableReferenceSchema,
});
const RowsUpsertResultSchema = z.object({
	requestId: z.string(),
	addedRowIds: z.array(z.string()).optional(),
});
const RowUpdateResultSchema = z.object({
	requestId: z.string(),
	id: z.string(),
});
const RowDeleteResultSchema = z.object({
	requestId: z.string(),
	id: z.string(),
});
const RowsDeleteResultSchema = z.object({
	requestId: z.string(),
	rowIds: z.array(z.string()),
});
const PushButtonResultSchema = z.object({
	requestId: z.string(),
	rowId: z.string(),
	columnId: z.string(),
});
const FormulaReferenceSchema = z.object({
	id: z.string(),
	type: z.enum(['formula']),
	href: z.string(),
	name: z.string(),
	parent: PageReferenceSchema.optional(),
});
const FormulaListSchema = z.object({
	items: z.array(FormulaReferenceSchema),
	href: z.string().optional(),
	nextPageToken: nextPageTokenSchema.optional(),
	nextPageLink: z.string().optional(),
});
const FormulaSchema = z.object({
	id: z.string(),
	type: z.enum(['formula']),
	href: z.string(),
	name: z.string(),
	parent: PageReferenceSchema.optional(),
	value: ValueSchema,
});
const ControlReferenceSchema = z.object({
	id: z.string(),
	type: z.enum(['control']),
	href: z.string(),
	name: z.string(),
	parent: PageReferenceSchema.optional(),
});
const ControlListSchema = z.object({
	items: z.array(ControlReferenceSchema),
	href: z.string().optional(),
	nextPageToken: nextPageTokenSchema.optional(),
	nextPageLink: z.string().optional(),
});
const ControlTypeSchema = z.enum([
	'aiBlock',
	'button',
	'checkbox',
	'datePicker',
	'dateRangePicker',
	'dateTimePicker',
	'lookup',
	'multiselect',
	'select',
	'scale',
	'slider',
	'reaction',
	'textbox',
	'timePicker',
]);
const ControlSchema = z.object({
	id: z.string(),
	type: z.enum(['control']),
	href: z.string(),
	name: z.string(),
	parent: PageReferenceSchema.optional(),
	controlType: ControlTypeSchema,
	value: ValueSchema,
});
const CustomDocDomainSetupStatusSchema = z.enum([
	'pending',
	'succeeded',
	'failed',
]);
const CustomDomainConnectedStatusSchema = z.enum(['connected', 'notConnected']);
const CustomDocDomainSchema = z.object({
	customDocDomain: z.string(),
	hasCertificate: z.boolean(),
	hasDnsDocId: z.boolean(),
	setupStatus: CustomDocDomainSetupStatusSchema,
	domainStatus: CustomDomainConnectedStatusSchema,
	lastVerifiedTimestamp: z.string().optional(),
});
const CustomDocDomainListSchema = z.object({
	customDocDomains: z.array(CustomDocDomainSchema),
	nextPageToken: nextPageTokenSchema.optional(),
	nextPageLink: z.string().optional(),
});
const AddCustomDocDomainResponseSchema = z.object({});
const UpdateCustomDocDomainResponseSchema = z.object({});
const DeleteCustomDocDomainResponseSchema = z.object({});
const CustomDocDomainProviderSchema = z.enum([
	'GoDaddy',
	'Namecheap',
	'Hover (Tucows)',
	'Network Solutions',
	'Google Domains',
	'Other',
]);
const CustomDocDomainProviderResponseSchema = z.object({
	provider: CustomDocDomainProviderSchema,
});
const FolderIconColorSchema = z.enum([
	'DARK_BLUE',
	'DARK_YELLOW',
	'DARK_PURPLE',
	'DARK_PINK',
	'DARK_ORANGE',
	'DARK_GREEN',
	'DARK_RED',
	'DARK_GRAY',
	'LIGHT_BLUE',
	'LIGHT_YELLOW',
	'LIGHT_PURPLE',
	'LIGHT_PINK',
	'LIGHT_ORANGE',
	'LIGHT_GREEN',
	'LIGHT_RED',
	'LIGHT_GRAY',
]);
const FolderSchema = z.object({
	id: z.string(),
	type: z.enum(['folder']),
	name: z.string(),
	browserLink: z.string(),
	description: z.string().optional(),
	icon: IconSchema.optional(),
	iconColor: FolderIconColorSchema.optional(),
	createdAt: z.string().optional(),
	canEdit: z.boolean().optional(),
	workspace: WorkspaceReferenceSchema,
});
const FolderListSchema = z.object({
	items: z.array(FolderSchema),
	href: z.string().optional(),
	nextPageToken: nextPageTokenSchema.optional(),
	nextPageLink: z.string().optional(),
});
const DeleteFolderResultSchema = z.object({});
const WebhookTriggerResultSchema = z.object({ requestId: z.string() });
const DocAnalyticsDetailsSchema = z.object({
	id: z.string(),
	type: z.enum(['doc']),
	href: z.string(),
	browserLink: z.string(),
	title: z.string(),
	icon: IconSchema.optional(),
	createdAt: z.string(),
	publishedAt: z.string().optional(),
});
const DocAnalyticsMetricsSchema = z.object({
	date: z.string(),
	views: z.number(),
	copies: z.number(),
	likes: z.number(),
	sessionsMobile: z.number(),
	sessionsDesktop: z.number(),
	sessionsOther: z.number(),
	totalSessions: z.number(),
	aiCreditsChat: z.number().optional(),
	aiCreditsBlock: z.number().optional(),
	aiCreditsColumn: z.number().optional(),
	aiCreditsAssistant: z.number().optional(),
	aiCreditsReviewer: z.number().optional(),
	aiCredits: z.number().optional(),
});
const DocAnalyticsItemSchema = z.object({
	doc: DocAnalyticsDetailsSchema,
	metrics: z.array(DocAnalyticsMetricsSchema),
});
const DocAnalyticsCollectionSchema = z.object({
	items: z.array(DocAnalyticsItemSchema),
	nextPageToken: nextPageTokenSchema.optional(),
	nextPageLink: z.string().optional(),
});
const PageAnalyticsDetailsSchema = z.object({
	id: z.string(),
	name: z.string(),
	icon: IconSchema.optional(),
});
const PageAnalyticsMetricsSchema = z.object({
	date: z.string(),
	views: z.number(),
	sessions: z.number(),
	users: z.number(),
	averageSecondsViewed: z.number(),
	medianSecondsViewed: z.number(),
	tabs: z.number(),
});
const PageAnalyticsItemSchema = z.object({
	page: PageAnalyticsDetailsSchema,
	metrics: z.array(PageAnalyticsMetricsSchema),
});
const PageAnalyticsCollectionSchema = z.object({
	items: z.array(PageAnalyticsItemSchema),
	nextPageToken: nextPageTokenSchema.optional(),
	nextPageLink: z.string().optional(),
});
const DocAnalyticsSummarySchema = z.object({ totalSessions: z.number() });
const PackAnalyticsDetailsSchema = z.object({
	id: z.number(),
	name: z.string(),
	logoUrl: z.string().optional(),
	createdAt: z.string(),
});
const PackAnalyticsMetricsSchema = z.object({
	date: z.string(),
	docInstalls: z.number(),
	workspaceInstalls: z.number(),
	numFormulaInvocations: z.number(),
	numActionInvocations: z.number(),
	numSyncInvocations: z.number(),
	numMetadataInvocations: z.number(),
	docsActivelyUsing: z.number(),
	docsActivelyUsing7Day: z.number(),
	docsActivelyUsing30Day: z.number(),
	docsActivelyUsing90Day: z.number(),
	docsActivelyUsingAllTime: z.number(),
	workspacesActivelyUsing: z.number(),
	workspacesActivelyUsing7Day: z.number(),
	workspacesActivelyUsing30Day: z.number(),
	workspacesActivelyUsing90Day: z.number(),
	workspacesActivelyUsingAllTime: z.number(),
	workspacesActivelyTrialing: z.number(),
	workspacesActivelyTrialing7Day: z.number(),
	workspacesActivelyTrialing30Day: z.number(),
	workspacesActivelyTrialing90Day: z.number(),
	workspacesActivelyTrialingAllTime: z.number(),
	workspacesNewlySubscribed: z.number(),
	workspacesWithActiveSubscriptions: z.number(),
	workspacesWithSuccessfulTrials: z.number(),
	revenueUsd: z.string(),
});
const PackAnalyticsItemSchema = z.object({
	pack: PackAnalyticsDetailsSchema,
	metrics: z.array(PackAnalyticsMetricsSchema),
});
const PackAnalyticsCollectionSchema = z.object({
	items: z.array(PackAnalyticsItemSchema),
	nextPageToken: nextPageTokenSchema.optional(),
	nextPageLink: z.string().optional(),
});
const PackAnalyticsSummarySchema = z.object({
	totalDocInstalls: z.number(),
	totalWorkspaceInstalls: z.number(),
	totalInvocations: z.number(),
});
const PackFormulaIdentifierSchema = z.object({
	name: z.string(),
	type: PackFormulaTypeSchema,
});
const PackFormulaAnalyticsMetricsSchema = z.object({
	date: z.string(),
	formulaInvocations: z.number(),
	errors: z.number(),
	medianLatencyMs: z.number().optional(),
	medianResponseSizeBytes: z.number().optional(),
	docsActivelyUsing: z.number(),
	docsActivelyUsing7Day: z.number(),
	docsActivelyUsing30Day: z.number(),
	docsActivelyUsing90Day: z.number(),
	docsActivelyUsingAllTime: z.number(),
	workspacesActivelyUsing: z.number(),
	workspacesActivelyUsing7Day: z.number(),
	workspacesActivelyUsing30Day: z.number(),
	workspacesActivelyUsing90Day: z.number(),
	workspacesActivelyUsingAllTime: z.number(),
	workspacesActivelyTrialing: z.number().optional(),
	workspacesActivelyTrialing7Day: z.number().optional(),
	workspacesActivelyTrialing30Day: z.number().optional(),
	workspacesActivelyTrialing90Day: z.number().optional(),
	workspacesActivelyTrialingAllTime: z.number().optional(),
	workspacesNewlySubscribed: z.number().optional(),
	workspacesWithActiveSubscriptions: z.number().optional(),
	workspacesWithSuccessfulTrials: z.number().optional(),
	revenueUsd: z.string().optional(),
});
const PackFormulaAnalyticsItemSchema = z.object({
	formula: PackFormulaIdentifierSchema,
	metrics: z.array(PackFormulaAnalyticsMetricsSchema),
});
const PackFormulaAnalyticsCollectionSchema = z.object({
	items: z.array(PackFormulaAnalyticsItemSchema),
	nextPageToken: nextPageTokenSchema.optional(),
	nextPageLink: z.string().optional(),
});
const AnalyticsLastUpdatedResponseSchema = z.object({
	docAnalyticsLastUpdated: z.string(),
	packAnalyticsLastUpdated: z.string(),
	packFormulaAnalyticsLastUpdated: z.string(),
});
const WorkspaceUserSchema = z.object({
	email: z.string(),
	name: z.string(),
	role: WorkspaceUserRoleSchema,
	pictureUrl: z.string().optional(),
	registeredAt: z.string(),
	roleChangedAt: z.string().optional(),
	lastActiveAt: z.string().optional(),
	ownedDocs: z.number().optional(),
	docsLastActiveAt: z.string().optional(),
	docCollaboratorCount: z.number().optional(),
	totalDocs: z.number().optional(),
	totalDocsLastActiveAt: z.string().optional(),
	totalDocCollaboratorsLast90Days: z.number().optional(),
});
const WorkspaceMembersListSchema = z.object({
	items: z.array(WorkspaceUserSchema),
	nextPageToken: nextPageTokenSchema.optional(),
	nextPageLink: z.string().optional(),
});
const WorkspaceRoleActivitySchema = z.object({
	month: z.string(),
	activeAdminCount: z.number(),
	activeDocMakerCount: z.number(),
	activeEditorCount: z.number(),
	inactiveAdminCount: z.number(),
	inactiveDocMakerCount: z.number(),
	inactiveEditorCount: z.number(),
});
const GetWorkspaceRoleActivitySchema = z.object({
	items: z.array(WorkspaceRoleActivitySchema),
});
const ChangeRoleResultSchema = z.object({ roleChangedAt: z.string() });
const PackImageFileSchema = z.object({
	filename: z.string(),
	imageUrl: z.string(),
	assetId: z.string(),
	altText: z.string().optional(),
	mimeType: z.string().optional(),
});
const PublishingCategorySchema = z.object({
	categoryId: z.string(),
	categoryName: z.string(),
	categorySlug: z.string().optional(),
});
const PackSummarySchema = z.object({
	id: z.number(),
	logoUrl: z.string().optional(),
	coverUrl: z.string().optional(),
	exampleImages: z.array(PackImageFileSchema).optional(),
	agentImages: z.array(PackImageFileSchema).optional(),
	workspaceId: z.string(),
	categories: z.array(PublishingCategorySchema),
	certified: z.boolean().optional(),
	certifiedAgent: z.boolean().optional(),
	sourceCodeVisibility: PackSourceCodeVisibilitySchema.optional(),
	packEntrypoints: z.array(PackEntrypointSchema).optional(),
	verifiedVersion: z.string().optional(),
	name: z.string(),
	description: z.string(),
	shortDescription: z.string(),
	agentShortDescription: z.string().optional(),
	agentDescription: z.string().optional(),
	supportEmail: z.string().optional(),
	termsOfServiceUrl: z.string().optional(),
	privacyPolicyUrl: z.string().optional(),
});
const PackSummaryListSchema = z.object({
	items: z.array(PackSummarySchema),
	nextPageToken: nextPageTokenSchema.optional(),
	nextPageLink: z.string().optional(),
});
const PackRateLimitSchema = z.object({
	intervalSeconds: z.number(),
	operationsPerInterval: z.number(),
});
const FeaturedDocStatusSchema = z.enum([
	'docInaccessibleOrDoesNotExist',
	'invalidPublishedDocUrl',
]);
const PackListingAdditionalInformationSchema = z.object({
	privacyCollectsPersonalInfo: z.boolean().nullable().optional(),
	privacyPersonalInfoCategories: z.array(z.string()).nullable().optional(),
	privacyDataUsagePurposes: z.array(z.string()).nullable().optional(),
	privacyDataCollectedBy: z.array(z.string()).nullable().optional(),
});
const PackSchema = z.object({
	id: z.number(),
	logoUrl: z.string().optional(),
	coverUrl: z.string().optional(),
	exampleImages: z.array(PackImageFileSchema).optional(),
	agentImages: z.array(PackImageFileSchema).optional(),
	workspaceId: z.string(),
	categories: z.array(PublishingCategorySchema),
	certified: z.boolean().optional(),
	certifiedAgent: z.boolean().optional(),
	sourceCodeVisibility: PackSourceCodeVisibilitySchema.optional(),
	packEntrypoints: z.array(PackEntrypointSchema).optional(),
	verifiedVersion: z.string().optional(),
	name: z.string(),
	description: z.string(),
	shortDescription: z.string(),
	agentShortDescription: z.string().optional(),
	agentDescription: z.string().optional(),
	supportEmail: z.string().optional(),
	termsOfServiceUrl: z.string().optional(),
	privacyPolicyUrl: z.string().optional(),
	overallRateLimit: PackRateLimitSchema.optional(),
	perConnectionRateLimit: PackRateLimitSchema.optional(),
	featuredDocStatus: FeaturedDocStatusSchema.optional(),
	additionalInformation: PackListingAdditionalInformationSchema.optional(),
});
const CreatePackResponseSchema = z.object({ packId: z.number() });
const DeletePackResponseSchema = z.object({});
const GetPackConfigurationJsonSchemaResponseSchema = z.record(
	z.string(),
	z.json(),
);
const PackVersionSchema = z.object({
	packId: z.number(),
	buildNotes: z.string(),
	createdAt: z.string(),
	creationUserLoginId: z.string(),
	releaseId: z.number().optional(),
	packVersion: z.string(),
	sdkVersion: z.string().optional(),
	source: PackSourceSchema.optional(),
});
const PackVersionListSchema = z.object({
	items: z.array(PackVersionSchema),
	creationUsers: z.array(UserSummarySchema),
	nextPageToken: nextPageTokenSchema.optional(),
	nextPageLink: z.string().optional(),
});
const NextPackVersionInfoSchema = z.object({
	nextVersion: z.string(),
	findings: z.array(z.string()),
	findingDetails: z.array(z.object({ finding: z.string(), path: z.string() })),
});
const PackVersionDiffsSchema = z.object({
	findings: z.array(z.string()),
	findingDetails: z.array(z.object({ finding: z.string(), path: z.string() })),
});
const PackVersionUploadInfoSchema = z.object({
	uploadUrl: z.string(),
	headers: z.record(z.string(), z.string()),
});
const ValidationErrorSchema = z.object({
	path: z.string(),
	message: z.string(),
});
const CreatePackVersionResponseSchema = z.object({
	deprecationWarnings: z.array(ValidationErrorSchema).optional(),
});
const PackSourceCodeUploadInfoSchema = z.object({
	uploadUrl: z.string(),
	uploadedPathName: z.string(),
	headers: z.record(z.string(), z.string()),
});
const PackSourceCodeUploadCompleteResponseSchema = z.object({
	requestId: z.string(),
});
const PackSourceCodeSchema = z.object({
	filename: z.string(),
	url: z.string(),
});
const PackSourceCodeInfoSchema = z.object({
	files: z.array(PackSourceCodeSchema),
});
const PackReleaseSchema = z.object({
	packId: z.number(),
	releaseNotes: z.string(),
	createdAt: z.string(),
	releaseId: z.number(),
	packVersion: z.string(),
	sdkVersion: z.string(),
});
const PackReleaseListSchema = z.object({
	items: z.array(PackReleaseSchema),
	nextPageToken: nextPageTokenSchema.optional(),
	nextPageLink: z.string().optional(),
});
const PackAssetUploadInfoSchema = z.object({
	uploadUrl: z.string(),
	packAssetUploadedPathName: z.string(),
	headers: z.record(z.string(), z.string()),
});
const PackAssetUploadCompleteResponseSchema = z.object({
	requestId: z.string(),
	assetId: z.string(),
});
const MakerSummarySchema = z.object({
	name: z.string(),
	pictureLink: z.string().optional(),
	slug: z.string().optional(),
	jobTitle: z.string().optional(),
	employer: z.string().optional(),
	description: z.string().optional(),
});
const FeatureSetSchema = z.enum(['Basic', 'Pro', 'Team', 'Enterprise']);
const FreePackPlanPricingSchema = z.object({ type: z.enum(['Free']) });
const PackPlanCurrencySchema = z.enum(['USD']);
const MonthlyDocMakerPackPlanPricingSchema = z.object({
	type: z.enum(['MonthlyDocMaker']),
	amount: z.number(),
	currency: PackPlanCurrencySchema,
});
const StandardPackPlanSchema = z.object({
	packPlanId: z.string(),
	packId: z.number(),
	pricing: z.union([
		FreePackPlanPricingSchema,
		MonthlyDocMakerPackPlanPricingSchema,
	]),
	createdAt: z.string(),
});
const PaidFeatureSetSchema = z.enum(['Pro', 'Team', 'Enterprise']);
const BundledPackPlanPricingSchema = z.object({
	type: z.enum(['BundledWithTier']),
	minimumFeatureSet: PaidFeatureSetSchema,
});
const BundledPackPlanSchema = z.object({
	packPlanId: z.string(),
	packId: z.number(),
	pricing: BundledPackPlanPricingSchema,
	createdAt: z.string(),
});
const PackListingSchema = z.object({
	packId: z.number(),
	packVersion: z.string(),
	releaseId: z.number().optional(),
	lastReleasedAt: z.string().optional(),
	logoUrl: z.string(),
	logo: PackImageFileSchema,
	coverUrl: z.string().optional(),
	cover: PackImageFileSchema.optional(),
	exampleImages: z.array(PackImageFileSchema).optional(),
	agentImages: z.array(PackImageFileSchema).optional(),
	name: z.string(),
	description: z.string(),
	shortDescription: z.string(),
	agentShortDescription: z.string().optional(),
	agentDescription: z.string().optional(),
	supportEmail: z.string().optional(),
	termsOfServiceUrl: z.string().optional(),
	privacyPolicyUrl: z.string().optional(),
	categories: z.array(PublishingCategorySchema),
	makers: z.array(MakerSummarySchema),
	certified: z.boolean().optional(),
	certifiedAgent: z.boolean().optional(),
	minimumFeatureSet: FeatureSetSchema.optional(),
	unrestrictedFeatureSet: FeatureSetSchema.optional(),
	externalMetadataUrl: z.string(),
	standardPackPlan: StandardPackPlanSchema.optional(),
	bundledPackPlan: BundledPackPlanSchema.optional(),
	sourceCodeVisibility: PackSourceCodeVisibilitySchema.optional(),
	sdkVersion: z.string(),
	packCategoryType: PackCategoryTypeSchema,
});
const PackListingListSchema = z.object({
	items: z.array(PackListingSchema),
	nextPageToken: nextPageTokenSchema.optional(),
	nextPageLink: z.string().optional(),
});
const PackDiscoverabilitySchema = z.enum([
	'public',
	'nomosOrganization',
	'group',
	'grammarlyInstitution',
	'workspace',
	'private',
]);
const PackConfigurationEntrySchema = z.object({
	configurationId: z.string(),
	name: z.string(),
	policy: z.record(z.string(), z.json()).optional(),
	hasSharedConnection: z.boolean().optional(),
});
const PackOrganizationAccessForDocsSchema = z.object({
	canRequestAccess: z.boolean(),
	hasRequestedAccess: z.boolean(),
	requiresConfiguration: z.boolean(),
	allowedConfigurations: z.array(PackConfigurationEntrySchema).optional(),
	allowedPackIds: z.array(z.number()).optional(),
	incompatibleDocPermissions: z.array(PermissionSchema).optional(),
	incompatibleDocOwner: UserSummarySchema.optional(),
	incompatibleDocFolder: FolderReferenceSchema.optional(),
	isDocOwner: z.boolean().optional(),
});
const PackOrganizationAccessForCodaBrainSchema = z.object({
	canRequestAccess: z.boolean(),
	hasRequestedAccess: z.boolean(),
	requiresConfiguration: z.boolean(),
	allowedConfigurations: z.array(PackConfigurationEntrySchema).optional(),
	allowedPackIds: z.array(z.number()).optional(),
});
const ParameterSettingSchema = z.object({
	default: z.string(),
	allowed: z.array(z.string()),
});
const IngestionTableSettingSchema = z.object({
	maxBytesPerSyncTableOverride: z.number().nullable().optional(),
	excludeIngestionByDefault: z.boolean().optional(),
	parameterLimits: z.record(z.string(), ParameterSettingSchema).optional(),
});
const IngestionLimitSettingsSchema = z.object({
	tableSettings: z.record(z.string(), IngestionTableSettingSchema).optional(),
	maxBytesPerSyncTableDefault: z.number().nullable(),
	allowedTablesCount: z.number(),
});
const PackUserAccessSchema = z.object({
	canEdit: z.boolean(),
	canTest: z.boolean(),
	canView: z.boolean(),
	canInstall: z.boolean(),
	canPurchase: z.boolean(),
	requiresTrial: z.boolean(),
	canConnectAccount: z.boolean(),
	usesSystemConnection: z.boolean().optional(),
	organization: z
		.union([
			PackOrganizationAccessForDocsSchema,
			PackOrganizationAccessForCodaBrainSchema,
		])
		.optional(),
	ingestionLimitSettings: IngestionLimitSettingsSchema.optional(),
});
const PackListingDetailSchema = z.object({
	packId: z.number(),
	packVersion: z.string(),
	releaseId: z.number().optional(),
	lastReleasedAt: z.string().optional(),
	logoUrl: z.string(),
	logo: PackImageFileSchema,
	coverUrl: z.string().optional(),
	cover: PackImageFileSchema.optional(),
	exampleImages: z.array(PackImageFileSchema).optional(),
	agentImages: z.array(PackImageFileSchema).optional(),
	name: z.string(),
	description: z.string(),
	shortDescription: z.string(),
	agentShortDescription: z.string().optional(),
	agentDescription: z.string().optional(),
	supportEmail: z.string().optional(),
	termsOfServiceUrl: z.string().optional(),
	privacyPolicyUrl: z.string().optional(),
	categories: z.array(PublishingCategorySchema),
	makers: z.array(MakerSummarySchema),
	certified: z.boolean().optional(),
	certifiedAgent: z.boolean().optional(),
	minimumFeatureSet: FeatureSetSchema.optional(),
	unrestrictedFeatureSet: FeatureSetSchema.optional(),
	externalMetadataUrl: z.string(),
	standardPackPlan: StandardPackPlanSchema.optional(),
	bundledPackPlan: BundledPackPlanSchema.optional(),
	sourceCodeVisibility: PackSourceCodeVisibilitySchema.optional(),
	sdkVersion: z.string(),
	packCategoryType: PackCategoryTypeSchema,
	discoverability: PackDiscoverabilitySchema,
	userAccess: PackUserAccessSchema,
	codaHelpCenterUrl: z.string().optional(),
	configuration: PackConfigurationEntrySchema.optional(),
});
const DeletePackListingDraftResponseSchema = z.object({});
const PackPermissionSchema = z.object({
	id: z.string(),
	principal: PackPrincipalSchema,
	access: PackAccessTypeSchema,
});
const PackPermissionListSchema = z.object({
	items: z.array(PackPermissionSchema),
	permissionUsers: z.array(UserSummarySchema),
});
const AddPackPermissionResponseSchema = z.object({ permissionId: z.string() });
const DeletePackPermissionResponseSchema = z.object({});
const PackInvitationSchema = z.object({
	invitationId: z.string(),
	packId: z.number(),
	inviteeEmail: z.string(),
	inviterUserId: z.number(),
	access: PackAccessTypeSchema,
	createdAt: z.string(),
	expiresAt: z.string(),
});
const MakerSchema = z.object({
	name: z.string(),
	pictureLink: z.string().optional(),
	slug: z.string().optional(),
	jobTitle: z.string().optional(),
	employer: z.string().optional(),
	description: z.string().optional(),
	loginId: z.string(),
});
const PackInvitationWithPackSchema = z.object({
	invitation: PackInvitationSchema,
	pack: PackSummarySchema,
	makers: z.array(MakerSchema),
	networkDomains: z.array(z.string()),
});
const PackInvitationWithPackListSchema = z.object({
	items: z.array(PackInvitationWithPackSchema),
	nextPageToken: z.string().nullable().optional(),
	nextPageLink: z.string().nullable().optional(),
});
const CreatePackInvitationResponseSchema = z.object({
	invitationId: z.string(),
});
const ListPackMakersResponseSchema = z.object({ makers: z.array(MakerSchema) });
const AddPackMakerResponseSchema = z.object({});
const DeletePackMakerResponseSchema = z.object({});
const ListPackCategoriesResponseSchema = z.object({
	categories: z.array(PublishingCategorySchema),
});
const AddPackCategoryResponseSchema = z.object({});
const DeletePackCategoryResponseSchema = z.object({});
const DocReferenceSchema = z.object({
	id: z.string(),
	type: z.enum(['doc']),
	href: z.string(),
	browserLink: z.string(),
});
const PackFeaturedDocSchema = z.object({
	doc: DocReferenceSchema,
	isPinned: z.boolean(),
	docStatus: FeaturedDocStatusSchema.optional(),
	publishedUrl: z.string().optional(),
});
const PackFeaturedDocsResponseSchema = z.object({
	items: z.array(PackFeaturedDocSchema),
});
const UpdatePackFeaturedDocsResponseSchema = z.object({});
const PackOauthConfigMetadataSchema = z.object({
	maskedClientId: z.string(),
	maskedClientSecret: z.string(),
	authorizationUrl: z.string(),
	tokenUrl: z.string(),
	tokenPrefix: z.string().optional(),
	scopes: z.string().optional(),
	redirectUri: z.string(),
	useDynamicClientRegistration: z.boolean().optional(),
});
const PackConnectionHeaderMetadataSchema = z.object({
	type: z.enum(['header']),
	maskedToken: z.string().optional(),
	headerName: z.string(),
	tokenPrefix: z.string(),
});
const PackConnectionMultiHeaderMetadataSchema = z.object({
	type: z.enum(['multiHeader']),
	headers: z.array(
		z.object({
			headerName: z.string(),
			maskedToken: z.string(),
			tokenPrefix: z.string().optional(),
		}),
	),
	presets: z.array(
		z.object({ headerName: z.string(), tokenPrefix: z.string().optional() }),
	),
});
const PackConnectionUrlParamMetadataSchema = z.object({
	type: z.enum(['urlParam']),
	params: z.array(z.object({ key: z.string(), maskedValue: z.string() })),
	domain: z.string(),
	presetKeys: z.array(z.string()),
});
const PackConnectionHttpBasicMetadataSchema = z.object({
	type: z.enum(['httpBasic']),
	maskedUsername: z.string().optional(),
	maskedPassword: z.string().optional(),
});
const PackConnectionCustomMetadataSchema = z.object({
	type: z.enum(['custom']),
	params: z.array(z.object({ key: z.string(), maskedValue: z.string() })),
	domain: z.string(),
	presetKeys: z.array(z.string()),
});
const PackOAuth2ClientCredentialsLocationSchema = z.enum([
	'automatic',
	'body',
	'header',
]);
const PackConnectionOauth2ClientCredentialsMetadataSchema = z.object({
	type: z.enum(['oauth2ClientCredentials']),
	location: PackOAuth2ClientCredentialsLocationSchema,
	maskedClientId: z.string(),
	maskedClientSecret: z.string(),
});
const PackConnectionGoogleServiceAccountMetadataSchema = z.object({
	type: z.enum(['googleServiceAccount']),
	maskedServiceAccountKey: z.string(),
});
const PackConnectionAwsAssumeRoleMetadataSchema = z.object({
	type: z.enum(['awsAssumeRole']),
	service: z.string(),
	roleArn: z.string(),
	externalId: z.string(),
});
const PackConnectionAwsAccessKeyMetadataSchema = z.object({
	type: z.enum(['awsAccessKey']),
	service: z.string(),
	maskedAccessKeyId: z.string(),
	maskedSecretAccessKey: z.string(),
});
const PackSystemConnectionMetadataSchema = z.union([
	PackConnectionHeaderMetadataSchema,
	PackConnectionMultiHeaderMetadataSchema,
	PackConnectionUrlParamMetadataSchema,
	PackConnectionHttpBasicMetadataSchema,
	PackConnectionCustomMetadataSchema,
	PackConnectionOauth2ClientCredentialsMetadataSchema,
	PackConnectionGoogleServiceAccountMetadataSchema,
	PackConnectionAwsAssumeRoleMetadataSchema,
	PackConnectionAwsAccessKeyMetadataSchema,
]);
const PackLogRequestTypeSchema = z.enum([
	'unknown',
	'connectionNameMetadataRequest',
	'parameterAutocompleteMetadataRequest',
	'postAuthSetupMetadataRequest',
	'propertyOptionsMetadataRequest',
	'getSyncTableSchemaMetadataRequest',
	'getDynamicSyncTableNameMetadataRequest',
	'listSyncTableDynamicUrlsMetadataRequest',
	'searchSyncTableDynamicUrlsMetadataRequest',
	'getDynamicSyncTableDisplayUrlMetadataRequest',
	'getIdentifiersForConnectionRequest',
	'invokeFormulaRequest',
	'invokeSyncFormulaRequest',
	'invokeSyncUpdateFormulaRequest',
	'invokeExecuteGetPermissionsRequest',
	'validateParametersMetadataRequest',
	'mcp',
]);
const PackLogContextSchema = z.object({
	docId: z.string(),
	packId: z.string(),
	packVersion: z.string(),
	formulaName: z.string(),
	userId: z.string(),
	connectionId: z.string(),
	connectionName: z.string().optional(),
	requestId: z.string(),
	requestType: PackLogRequestTypeSchema,
	createdAt: z.string(),
	logId: z.string(),
	docObjectId: z.string().optional(),
	docRowId: z.string().optional(),
	docColumnId: z.string().optional(),
	isSyncTable: z.boolean().optional(),
	isContinuedSyncTable: z.boolean().optional(),
	autocompleteParameterName: z.string().optional(),
	invocationSource: z.string().optional(),
	detailsKey: z.string(),
	ingestionChildExecutionIndex: z.number().optional(),
	ingestionId: z.string().optional(),
	rootIngestionId: z.string().optional(),
	ingestionExecutionId: z.string().optional(),
	ingestionStage: z.string().optional(),
	ingestionParentStage: z.string().optional(),
	ingestionExecutionAttempt: z.number().optional(),
	ingestionParentItemId: z.string().optional(),
	ingestionProcessId: z.string().optional(),
	additionalMetadata: z.object({}).optional(),
	agentSessionId: z.string().optional(),
	agentInstanceId: z.string().optional(),
	executingAgentInstanceId: z.string().optional(),
});
const LogLevelSchema = z.enum([
	'error',
	'warn',
	'info',
	'debug',
	'trace',
	'unknown',
]);
const PackCustomLogSchema = z.object({
	type: z.enum(['custom']),
	context: PackLogContextSchema,
	message: z.string(),
	level: LogLevelSchema,
});
const PackInvocationLogSchema = z.object({
	type: z.enum(['invocation']),
	context: PackLogContextSchema,
	cacheHit: z.boolean().optional(),
	duration: z.number().optional(),
	error: z
		.object({ message: z.string(), stack: z.string().optional() })
		.optional(),
});
const PackFetcherLogSchema = z.object({
	type: z.enum(['fetcher']),
	context: PackLogContextSchema,
	requestSizeBytes: z.number().optional(),
	responseCode: z.number().optional(),
	responseSizeBytes: z.number().optional(),
	method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD']).optional(),
	baseUrl: z.string().optional(),
	cacheHit: z.boolean().optional(),
	duration: z.number().optional(),
});
const PackInternalLogSchema = z.object({
	type: z.enum(['internal']),
	context: PackLogContextSchema,
	message: z.string(),
	level: LogLevelSchema,
});
const PackAuthLogSchema = z.object({
	type: z.enum(['auth']),
	context: PackLogContextSchema,
	path: z.string(),
	errorMessage: z.string().optional(),
	errorStack: z.string().optional(),
});
const PackIngestionLifecycleLogSchema = z.object({
	type: z.enum(['ingestionLifecycle']),
	context: PackLogContextSchema,
	message: z.string(),
	level: LogLevelSchema,
});
const PackIngestionDebugLogSchema = z.object({
	type: z.enum(['ingestionDebug']),
	context: PackLogContextSchema,
	message: z.string(),
	level: LogLevelSchema,
});
const PackAgentRuntimeLogSchema = z.object({
	type: z.enum(['agentRuntime']),
	context: PackLogContextSchema,
	turnType: z.string(),
	durationMs: z.number().optional(),
	name: z.string().optional(),
	model: z.string().optional(),
	tokenUsage: z.string().optional(),
	instructions: z.string().optional(),
	fromAgent: z.string().optional(),
	toAgent: z.string().optional(),
});
const PackMcpLogSchema = z.object({
	type: z.enum(['mcp']),
	context: PackLogContextSchema,
	message: z.string().optional(),
	error: z
		.object({ message: z.string(), stack: z.string().optional() })
		.optional(),
});
const PackLogSchema = z.union([
	PackCustomLogSchema,
	PackInvocationLogSchema,
	PackFetcherLogSchema,
	PackInternalLogSchema,
	PackAuthLogSchema,
	PackIngestionLifecycleLogSchema,
	PackIngestionDebugLogSchema,
	PackAgentRuntimeLogSchema,
	PackMcpLogSchema,
]);
const PackLogsListSchema = z.object({
	items: z.array(PackLogSchema),
	nextPageToken: nextPageTokenSchema.optional(),
	nextPageLink: z.string().optional(),
});
const GroupedPackInvocationLogSchema = z.object({
	type: z.enum(['invocation']),
	invocationLog: PackInvocationLogSchema,
	relatedLogs: z.array(PackLogSchema),
});
const GroupedPackAuthLogSchema = z.object({
	type: z.enum(['auth']),
	authLog: PackAuthLogSchema,
	relatedLogs: z.array(PackLogSchema),
});
const GroupedPackLogSchema = z.union([
	GroupedPackInvocationLogSchema,
	GroupedPackAuthLogSchema,
]);
const GroupedPackLogsListSchema = z.object({
	items: z.array(GroupedPackLogSchema),
	nextPageToken: nextPageTokenSchema.optional(),
	nextPageLink: z.string().optional(),
	incompleteRelatedLogs: z.boolean(),
});
const IngestionBatchExecutionSchema = z.object({
	completionTimestamp: z.number(),
	creationTimestamp: z.number(),
	dynamicLabel: z.string().optional(),
	dynamicUrl: z.string().optional(),
	executionType: IngestionExecutionTypeSchema,
	fullExecutionId: z.string(),
	ingestionExecutionId: z.string(),
	ingestionId: z.string(),
	ingestionName: z.string(),
	ingestionStatusCounts: z.record(z.string(), z.number()).optional(),
	lastFinishedFullWorkflowExecutionId: z.string().optional(),
	lastFinishedIncrementalWorkflowExecutionId: z.string().optional(),
	latestFullWorkflowExecutionId: z.string().optional(),
	latestIncrementalWorkflowExecutionId: z.string().optional(),
	latestIngestionSequenceId: z.string().optional(),
	liveIngestionSequenceId: z.string().optional(),
	parentSyncTableIngestionId: z.string().optional(),
	startTimestamp: z.number(),
	totalRowCount: z.number().optional(),
});
const IngestionBatchExecutionsListSchema = z.object({
	items: z.array(IngestionBatchExecutionSchema),
	nextPageToken: nextPageTokenSchema.optional(),
});
const PackFetcherLogDetailsSchema = z.object({
	type: z.enum(['fetcher']),
	request: z.string(),
	response: z.string().optional(),
});
const PackInvocationLogDetailsSchema = z.object({
	type: z.enum(['invocation']),
	result: z
		.object({
			stringVal: z.string(),
			int64Val: z.number(),
			doubleVal: z.number(),
			objectVal: z.string(),
			boolVal: z.boolean(),
			dateVal: z.number(),
		})
		.optional(),
	resultDetail: z.string().optional(),
	continuationJson: z.string().optional(),
	completionJson: z.string().optional(),
	deletedItemIdsJson: z.string().optional(),
	permissionsContextJson: z.string().optional(),
});
const PackAgentRuntimeLogDetailsSchema = z.object({
	type: z.enum(['agentRuntime']),
	input: z.string().optional(),
	output: z.string().optional(),
});
const PackLogDetailsSchema = z.union([
	PackFetcherLogDetailsSchema,
	PackInvocationLogDetailsSchema,
	PackAgentRuntimeLogDetailsSchema,
]);

const AccountWhoamiInputSchema = z.object({});
const AccountWhoamiOutputSchema = UserSchema;

const AccountResolveBrowserLinkInputSchema = z.object({
	url: z.string().describe('The browser link to try to resolve.'),
	degradeGracefully: z
		.boolean()
		.describe(
			'By default, attempting to resolve the Coda URL of a deleted object will result in an error. If this flag is set, the next-available object, all the way up to the doc itself, will be resolved.',
		)
		.optional(),
});
const AccountResolveBrowserLinkOutputSchema = ApiLinkSchema;

const AccountGetMutationStatusInputSchema = z.object({
	requestId: z.string().describe('ID of the request.'),
});
const AccountGetMutationStatusOutputSchema = MutationStatusSchema;

const CategoriesListInputSchema = z.object({});
const CategoriesListOutputSchema = DocCategoryListSchema;

const DocsListInputSchema = z.object({
	isOwner: z.boolean().describe('Show only docs owned by the user.').optional(),
	isPublished: z.boolean().describe('Show only published docs.').optional(),
	query: z
		.string()
		.describe('Search term used to filter down results.')
		.optional(),
	sourceDoc: z
		.string()
		.describe('Show only docs copied from the specified doc ID.')
		.optional(),
	isStarred: z
		.boolean()
		.describe(
			'If true, returns docs that are starred. If false, returns docs that are not starred.',
		)
		.optional(),
	inGallery: z
		.boolean()
		.describe('Show only docs visible within the gallery.')
		.optional(),
	workspaceId: z
		.string()
		.describe('Show only docs belonging to the given workspace.')
		.optional(),
	folderId: z
		.string()
		.describe('Show only docs belonging to the given folder.')
		.optional(),
	minimumAccess: AccessTypeNotNoneSchema.describe(
		'Show only docs where the user has at least this access. Uses the same access values as doc permissions (`readonly`, `comment`, `write`). `write` includes both editors and managers.',
	).optional(),
	limit: z
		.number()
		.describe('Maximum number of results to return in this query.')
		.optional(),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
});
const DocsListOutputSchema = DocListSchema;

const DocsGetInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
});
const DocsGetOutputSchema = DocSchema;

const DocsCreateInputSchema = z.object({
	title: z
		.string()
		.describe("Title of the new doc. Defaults to 'Untitled'.")
		.optional(),
	sourceDoc: z
		.string()
		.describe('An optional doc ID from which to create a copy.')
		.optional(),
	timezone: z
		.string()
		.describe('The timezone to use for the newly created doc.')
		.optional(),
	folderId: z
		.string()
		.describe(
			'The ID of the folder within which to create this doc. Defaults to your "My docs" folder in the oldest workspace you joined; this is subject to change. You can get this ID by opening the folder in the docs list on your computer and grabbing the `folderId` query parameter.',
		)
		.optional(),
	initialPage: z
		.object({
			name: z.string().optional(),
			subtitle: z.string().optional(),
			iconName: z.string().optional(),
			imageUrl: z.string().optional(),
			parentPageId: z.string().optional(),
			pageContent: PageCreateContentSchema.optional(),
		})
		.optional(),
});
const DocsCreateOutputSchema = DocumentCreationResultSchema;

const DocsCopyInputSchema = z.object({
	title: z
		.string()
		.describe("Title of the new doc. Defaults to 'Untitled'.")
		.optional(),
	sourceDoc: z.string().describe('ID of the doc to copy.'),
	timezone: z
		.string()
		.describe('The timezone to use for the newly created doc.')
		.optional(),
	folderId: z
		.string()
		.describe(
			'The ID of the folder within which to create this doc. Defaults to your "My docs" folder in the oldest workspace you joined; this is subject to change. You can get this ID by opening the folder in the docs list on your computer and grabbing the `folderId` query parameter.',
		)
		.optional(),
	initialPage: z
		.object({
			name: z.string().optional(),
			subtitle: z.string().optional(),
			iconName: z.string().optional(),
			imageUrl: z.string().optional(),
			parentPageId: z.string().optional(),
			pageContent: PageCreateContentSchema.optional(),
		})
		.optional(),
});
const DocsCopyOutputSchema = DocumentCreationResultSchema;

const DocsUpdateInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	title: z.string().describe('Title of the doc.').optional(),
	iconName: z.string().describe('Name of the icon.').optional(),
});
const DocsUpdateOutputSchema = DocUpdateResultSchema;

const DocsDeleteInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
});
const DocsDeleteOutputSchema = DocDeleteSchema;

const DocsPublishInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	slug: z.string().describe('Slug for the published doc.').optional(),
	discoverable: z
		.boolean()
		.describe('If true, indicates that the doc is discoverable.')
		.optional(),
	categoryNames: z
		.array(z.string())
		.describe('The names of categories to apply to the document.')
		.optional(),
	mode: DocPublishModeSchema.describe(
		'Which interaction mode the published doc should use.',
	).optional(),
});
const DocsPublishOutputSchema = PublishResultSchema;

const DocsUnpublishInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
});
const DocsUnpublishOutputSchema = UnpublishResultSchema;

const PermissionsListInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	limit: z
		.number()
		.describe('Maximum number of results to return in this query.')
		.optional(),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
});
const PermissionsListOutputSchema = AclSchema;

const PermissionsAddInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	access: AccessTypeNotNoneSchema.describe('Type of access (excluding none).'),
	principal: AddedPrincipalSchema.describe(
		'Metadata about a principal to add to a doc.',
	),
	suppressEmail: z
		.boolean()
		.describe('When true suppresses email notification')
		.optional(),
});
const PermissionsAddOutputSchema = AddPermissionResultSchema;

const PermissionsDeleteInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	permissionId: z.string().describe('ID of a permission on a doc.'),
});
const PermissionsDeleteOutputSchema = DeletePermissionResultSchema;

const PermissionsSearchPrincipalsInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	query: z
		.string()
		.describe('Search term used to filter down results.')
		.optional(),
});
const PermissionsSearchPrincipalsOutputSchema = SearchPrincipalsResponseSchema;

const PermissionsGetSharingMetadataInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
});
const PermissionsGetSharingMetadataOutputSchema = AclMetadataSchema;

const PermissionsGetAclSettingsInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
});
const PermissionsGetAclSettingsOutputSchema = AclSettingsSchema;

const PermissionsUpdateAclSettingsInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	allowEditorsToChangePermissions: z
		.boolean()
		.describe(
			'When true, allows editors to change doc permissions. When false, only doc owner can change doc permissions.',
		)
		.optional(),
	allowCopying: z
		.boolean()
		.describe('When true, allows doc viewers to copy the doc.')
		.optional(),
	allowViewersToRequestEditing: z
		.boolean()
		.describe('When true, allows doc viewers to request editing permissions.')
		.optional(),
});
const PermissionsUpdateAclSettingsOutputSchema = AclSettingsSchema;

const PagesListInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	limit: z
		.number()
		.describe('Maximum number of results to return in this query.')
		.optional(),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
});
const PagesListOutputSchema = PageListSchema;

const PagesGetInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	pageIdOrName: z
		.string()
		.describe(
			"ID or name of the page. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it. If you provide a name and there are multiple pages with the same name, an arbitrary one will be selected.",
		),
});
const PagesGetOutputSchema = PageSchema;

const PagesCreateInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	name: z.string().describe('Name of the page.').optional(),
	subtitle: z.string().describe('Subtitle of the page.').optional(),
	iconName: z.string().describe('Name of the icon.').optional(),
	imageUrl: z.string().describe('Url of the cover image to use.').optional(),
	parentPageId: z
		.string()
		.describe("The ID of this new page's parent, if creating a subpage.")
		.optional(),
	pageContent: PageCreateContentSchema.describe(
		'Content that can be added to a page at creation time, either text (or rich text) or a URL to create a full-page embed.',
	).optional(),
});
const PagesCreateOutputSchema = PageCreateResultSchema;

const PagesUpdateInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	pageIdOrName: z
		.string()
		.describe(
			"ID or name of the page. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it. If you provide a name and there are multiple pages with the same name, an arbitrary one will be selected.",
		),
	name: z.string().describe('Name of the page.').optional(),
	subtitle: z.string().describe('Subtitle of the page.').optional(),
	iconName: z.string().describe('Name of the icon.').optional(),
	imageUrl: z.string().describe('Url of the cover image to use.').optional(),
	isHidden: z
		.boolean()
		.describe(
			'Whether the page is hidden or not. Note that for pages that cannot be hidden, like the sole top-level page in a doc, this will be ignored.',
		)
		.optional(),
	contentUpdate: z
		.object({
			insertionMode: PageContentInsertionModeSchema,
			elementId: z.string().optional(),
			canvasContent: PageContentSchema,
		})
		.optional(),
});
const PagesUpdateOutputSchema = PageUpdateResultSchema;

const PagesDeleteInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	pageIdOrName: z
		.string()
		.describe(
			"ID or name of the page. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it. If you provide a name and there are multiple pages with the same name, an arbitrary one will be selected.",
		),
});
const PagesDeleteOutputSchema = PageDeleteResultSchema;

const PagesListContentInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	pageIdOrName: z
		.string()
		.describe(
			"ID or name of the page. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it. If you provide a name and there are multiple pages with the same name, an arbitrary one will be selected.",
		),
	limit: z
		.number()
		.describe('Maximum number of content items to return in this query.')
		.optional(),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
	contentFormat: z
		.enum(['plainText'])
		.describe('The format to return content in. Defaults to plainText.')
		.optional(),
});
const PagesListContentOutputSchema = PageContentListSchema;

const PagesDeleteContentInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	pageIdOrName: z
		.string()
		.describe(
			"ID or name of the page. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it. If you provide a name and there are multiple pages with the same name, an arbitrary one will be selected.",
		),
	elementIds: z
		.array(z.string())
		.describe(
			'IDs of the elements to delete from the page. If omitted or empty, all content will be deleted.',
		)
		.optional(),
});
const PagesDeleteContentOutputSchema = PageContentDeleteResultSchema;

const PagesBeginExportInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	pageIdOrName: z
		.string()
		.describe(
			"ID or name of the page. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it. If you provide a name and there are multiple pages with the same name, an arbitrary one will be selected.",
		),
	outputFormat: PageContentOutputFormatSchema.describe(
		'Supported output content formats that can be requested for getting content for an existing page.',
	),
});
const PagesBeginExportOutputSchema = BeginPageContentExportResponseSchema;

const PagesGetExportStatusInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	pageIdOrName: z
		.string()
		.describe(
			"ID or name of the page. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it. If you provide a name and there are multiple pages with the same name, an arbitrary one will be selected.",
		),
	requestId: z.string().describe('ID of the request.'),
});
const PagesGetExportStatusOutputSchema = PageContentExportStatusResponseSchema;

const TablesListInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	limit: z
		.number()
		.describe('Maximum number of results to return in this query.')
		.optional(),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
	sortBy: SortBySchema.describe(
		'Determines how to sort the given objects.',
	).optional(),
	tableTypes: z
		.array(TableTypeSchema)
		.describe(
			'Comma-separated list of table types to include in results. If omitted, includes tables, views, and databases.',
		)
		.optional(),
});
const TablesListOutputSchema = TableListSchema;

const TablesGetInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	tableIdOrName: z
		.string()
		.describe(
			"ID or name of the table. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it.",
		),
	useUpdatedTableLayouts: z
		.boolean()
		.describe(
			'Return "detail" and "form" for the `layout` field of detail and form layouts respectively (instead of "masterDetail" for both)',
		)
		.optional(),
});
const TablesGetOutputSchema = TableSchema;

const ColumnsListInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	tableIdOrName: z
		.string()
		.describe(
			"ID or name of the table. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it.",
		),
	limit: z
		.number()
		.describe('Maximum number of results to return in this query.')
		.optional(),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
	visibleOnly: z
		.boolean()
		.describe(
			'If true, returns only visible columns for the table. This parameter only applies to base tables, and not views.',
		)
		.optional(),
});
const ColumnsListOutputSchema = ColumnListSchema;

const ColumnsGetInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	tableIdOrName: z
		.string()
		.describe(
			"ID or name of the table. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it.",
		),
	columnIdOrName: z
		.string()
		.describe(
			"ID or name of the column. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it.",
		),
});
const ColumnsGetOutputSchema = ColumnDetailSchema;

const RowsListInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	tableIdOrName: z
		.string()
		.describe(
			"ID or name of the table. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it.",
		),
	query: z
		.string()
		.describe(
			'Query used to filter returned rows, specified as `<column_id_or_name>:<value>`. If you\'d like to use a column name instead of an ID, you must quote it (e.g., `"My Column":123`). Also note that `value` is a JSON value; if you\'d like to use a string, you must surround it in quotes (e.g., `"groceries"`).',
		)
		.optional(),
	sortBy: RowsSortBySchema.describe(
		'Specifies the sort order of the rows returned. If left unspecified, rows are returned by creation time ascending. "UpdatedAt" sort ordering is the order of rows based upon when they were last updated. This does not include updates to calculated values. "Natural" sort ordering is the order that the rows appear in the table view in the application. This ordering is only meaningfully defined for rows that are visible (unfiltered). Because of this, using this sort order will imply visibleOnly=true, that is, to only return visible rows. If you pass sortBy=natural and visibleOnly=false explicitly, this will result in a Bad Request error as this condition cannot be satisfied.',
	).optional(),
	useColumnNames: z
		.boolean()
		.describe(
			'Use column names instead of column IDs in the returned output. This is generally discouraged as it is fragile. If columns are renamed, code using original names may throw errors.',
		)
		.optional(),
	valueFormat: ValueFormatSchema.describe(
		'The format that cell values are returned as.',
	).optional(),
	visibleOnly: z
		.boolean()
		.describe('If true, returns only visible rows and columns for the table.')
		.optional(),
	limit: z
		.number()
		.describe('Maximum number of results to return in this query.')
		.optional(),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
	syncToken: z
		.string()
		.describe(
			'An opaque token returned from a previous call that can be used to return results that are relevant to the query since the call where the syncToken was generated.',
		)
		.optional(),
});
const RowsListOutputSchema = RowListSchema;

const RowsGetInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	tableIdOrName: z
		.string()
		.describe(
			"ID or name of the table. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it.",
		),
	rowIdOrName: z
		.string()
		.describe(
			"ID or name of the row. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it. If there are multiple rows with the same value in the identifying column, an arbitrary one will be selected.",
		),
	useColumnNames: z
		.boolean()
		.describe(
			'Use column names instead of column IDs in the returned output. This is generally discouraged as it is fragile. If columns are renamed, code using original names may throw errors.',
		)
		.optional(),
	valueFormat: ValueFormatSchema.describe(
		'The format that cell values are returned as.',
	).optional(),
});
const RowsGetOutputSchema = RowDetailSchema;

const RowsUpsertInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	tableIdOrName: z
		.string()
		.describe(
			"ID or name of the table. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it.",
		),
	disableParsing: z
		.boolean()
		.describe('If true, the API will not attempt to parse the data in any way.')
		.optional(),
	rows: z.array(RowEditSchema),
	keyColumns: z
		.array(z.string())
		.describe(
			'Optional column IDs, URLs, or names (fragile and discouraged), specifying columns to be used as upsert keys.',
		)
		.optional(),
});
const RowsUpsertOutputSchema = RowsUpsertResultSchema;

const RowsUpdateInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	tableIdOrName: z
		.string()
		.describe(
			"ID or name of the table. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it.",
		),
	rowIdOrName: z
		.string()
		.describe(
			"ID or name of the row. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it. If there are multiple rows with the same value in the identifying column, an arbitrary one will be selected.",
		),
	disableParsing: z
		.boolean()
		.describe('If true, the API will not attempt to parse the data in any way.')
		.optional(),
	row: RowEditSchema.describe('An edit made to a particular row.'),
});
const RowsUpdateOutputSchema = RowUpdateResultSchema;

const RowsDeleteInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	tableIdOrName: z
		.string()
		.describe(
			"ID or name of the table. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it.",
		),
	rowIdOrName: z
		.string()
		.describe(
			"ID or name of the row. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it. If there are multiple rows with the same value in the identifying column, an arbitrary one will be selected.",
		),
});
const RowsDeleteOutputSchema = RowDeleteResultSchema;

const RowsDeleteManyInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	tableIdOrName: z
		.string()
		.describe(
			"ID or name of the table. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it.",
		),
	rowIds: z.array(z.string()).describe('Row IDs to delete.'),
});
const RowsDeleteManyOutputSchema = RowsDeleteResultSchema;

const RowsPushButtonInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	tableIdOrName: z
		.string()
		.describe(
			"ID or name of the table. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it.",
		),
	rowIdOrName: z
		.string()
		.describe(
			"ID or name of the row. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it. If there are multiple rows with the same value in the identifying column, an arbitrary one will be selected.",
		),
	columnIdOrName: z
		.string()
		.describe(
			"ID or name of the column. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it.",
		),
});
const RowsPushButtonOutputSchema = PushButtonResultSchema;

const FormulasListInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	limit: z
		.number()
		.describe('Maximum number of results to return in this query.')
		.optional(),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
	sortBy: SortBySchema.describe(
		'Determines how to sort the given objects.',
	).optional(),
});
const FormulasListOutputSchema = FormulaListSchema;

const FormulasGetInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	formulaIdOrName: z
		.string()
		.describe(
			"ID or name of the formula. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it.",
		),
});
const FormulasGetOutputSchema = FormulaSchema;

const ControlsListInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	limit: z
		.number()
		.describe('Maximum number of results to return in this query.')
		.optional(),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
	sortBy: SortBySchema.describe(
		'Determines how to sort the given objects.',
	).optional(),
});
const ControlsListOutputSchema = ControlListSchema;

const ControlsGetInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	controlIdOrName: z
		.string()
		.describe(
			"ID or name of the control. Names are discouraged because they're easily prone to being changed by users. If you're using a name, be sure to URI-encode it.",
		),
});
const ControlsGetOutputSchema = ControlSchema;

const DomainsListInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
});
const DomainsListOutputSchema = CustomDocDomainListSchema;

const DomainsAddInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	customDocDomain: z.string().describe('The custom domain.'),
});
const DomainsAddOutputSchema = AddCustomDocDomainResponseSchema;

const DomainsUpdateInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	customDocDomain: z.string().describe('A custom domain for a published doc.'),
	body: UpdateCustomDocDomainRequestSchema.describe(
		'Credentials patch for the system connection.',
	),
});
const DomainsUpdateOutputSchema = UpdateCustomDocDomainResponseSchema;

const DomainsDeleteInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	customDocDomain: z.string().describe('A custom domain for a published doc.'),
});
const DomainsDeleteOutputSchema = DeleteCustomDocDomainResponseSchema;

const DomainsGetProviderInputSchema = z.object({
	customDocDomain: z.string().describe('A custom domain for a published doc.'),
});
const DomainsGetProviderOutputSchema = CustomDocDomainProviderResponseSchema;

const FoldersListInputSchema = z.object({
	workspaceId: z
		.string()
		.describe('Show only folders belonging to the given workspace.')
		.optional(),
	isStarred: z
		.boolean()
		.describe(
			'If true, returns folders that are starred. If false, returns folders that are not starred. If not specified, returns all folders.',
		)
		.optional(),
	limit: z
		.number()
		.describe('Maximum number of results to return in this query.')
		.optional(),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
});
const FoldersListOutputSchema = FolderListSchema;

const FoldersGetInputSchema = z.object({
	folderId: z.string().describe('ID of the folder.'),
});
const FoldersGetOutputSchema = FolderSchema;

const FoldersCreateInputSchema = z.object({
	name: z.string().describe('Name of the folder.'),
	workspaceId: z
		.string()
		.describe('ID of the workspace where the folder should be created.'),
	description: z.string().describe('Description of the folder.').optional(),
});
const FoldersCreateOutputSchema = FolderSchema;

const FoldersUpdateInputSchema = z.object({
	folderId: z.string().describe('ID of the folder.'),
	name: z.string().describe('Name of the folder.').optional(),
	description: z.string().describe('Description of the folder.').optional(),
});
const FoldersUpdateOutputSchema = FolderSchema;

const FoldersDeleteInputSchema = z.object({
	folderId: z.string().describe('ID of the folder.'),
});
const FoldersDeleteOutputSchema = DeleteFolderResultSchema;

const AutomationsTriggerInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	ruleId: z.string().describe('ID of the automation rule.'),
	payload: WebhookTriggerPayloadSchema.describe(
		'JSON payload passed to the automation.',
	).optional(),
});
const AutomationsTriggerOutputSchema = WebhookTriggerResultSchema;

const AnalyticsListDocsInputSchema = z.object({
	docIds: z.array(z.string()).describe('List of docIds to fetch.').optional(),
	workspaceId: z.string().describe('ID of the workspace.').optional(),
	query: z
		.string()
		.describe('Search term used to filter down results.')
		.optional(),
	isPublished: z
		.boolean()
		.describe('Limit results to only published items.')
		.optional(),
	sinceDate: z
		.string()
		.describe('Limit results to activity on or after this date.')
		.optional(),
	untilDate: z
		.string()
		.describe('Limit results to activity on or before this date.')
		.optional(),
	scale: AnalyticsScaleSchema.describe(
		'Quantization period over which to view analytics. Defaults to daily.',
	).optional(),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
	orderBy: DocAnalyticsOrderBySchema.describe(
		'Use this parameter to order the doc analytics returned.',
	).optional(),
	direction: SortDirectionSchema.describe(
		'Direction to sort results in.',
	).optional(),
	limit: z
		.number()
		.describe('Maximum number of results to return in this query.')
		.optional(),
});
const AnalyticsListDocsOutputSchema = DocAnalyticsCollectionSchema;

const AnalyticsListPagesInputSchema = z.object({
	docId: z.string().describe('ID of the doc.'),
	sinceDate: z
		.string()
		.describe('Limit results to activity on or after this date.')
		.optional(),
	untilDate: z
		.string()
		.describe('Limit results to activity on or before this date.')
		.optional(),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
	limit: z
		.number()
		.describe('Maximum number of results to return in this query.')
		.optional(),
});
const AnalyticsListPagesOutputSchema = PageAnalyticsCollectionSchema;

const AnalyticsGetDocsSummaryInputSchema = z.object({
	isPublished: z
		.boolean()
		.describe('Limit results to only published items.')
		.optional(),
	sinceDate: z
		.string()
		.describe('Limit results to activity on or after this date.')
		.optional(),
	untilDate: z
		.string()
		.describe('Limit results to activity on or before this date.')
		.optional(),
	workspaceId: z.string().describe('ID of the workspace.').optional(),
});
const AnalyticsGetDocsSummaryOutputSchema = DocAnalyticsSummarySchema;

const AnalyticsListPacksInputSchema = z.object({
	packIds: z.array(z.number()).describe('Which Pack IDs to fetch.').optional(),
	workspaceId: z.string().describe('ID of the workspace.').optional(),
	query: z
		.string()
		.describe('Search term used to filter down results.')
		.optional(),
	sinceDate: z
		.string()
		.describe('Limit results to activity on or after this date.')
		.optional(),
	untilDate: z
		.string()
		.describe('Limit results to activity on or before this date.')
		.optional(),
	scale: AnalyticsScaleSchema.describe(
		'Quantization period over which to view analytics. Defaults to daily.',
	).optional(),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
	orderBy: PackAnalyticsOrderBySchema.describe(
		'Use this parameter to order the Pack analytics returned.',
	).optional(),
	direction: SortDirectionSchema.describe(
		'Direction to sort results in.',
	).optional(),
	isPublished: z
		.boolean()
		.describe(
			'Limit results to only published items. If false or unspecified, returns all items including published ones.',
		)
		.optional(),
	limit: z
		.number()
		.describe('Maximum number of results to return in this query.')
		.optional(),
});
const AnalyticsListPacksOutputSchema = PackAnalyticsCollectionSchema;

const AnalyticsGetPacksSummaryInputSchema = z.object({
	packIds: z.array(z.number()).describe('Which Pack IDs to fetch.').optional(),
	workspaceId: z.string().describe('ID of the workspace.').optional(),
	isPublished: z
		.boolean()
		.describe(
			'Limit results to only published items. If false or unspecified, returns all items including published ones.',
		)
		.optional(),
	sinceDate: z
		.string()
		.describe('Limit results to activity on or after this date.')
		.optional(),
	untilDate: z
		.string()
		.describe('Limit results to activity on or before this date.')
		.optional(),
});
const AnalyticsGetPacksSummaryOutputSchema = PackAnalyticsSummarySchema;

const AnalyticsListPackFormulasInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	packFormulaNames: z
		.array(z.string())
		.describe(
			'A list of Pack formula names (case-sensitive) for which to retrieve analytics.',
		)
		.optional(),
	packFormulaTypes: z
		.array(PackFormulaTypeSchema)
		.describe(
			'A list of Pack formula types corresponding to the `packFormulaNames`. If specified, this must have the same length as `packFormulaNames`.',
		)
		.optional(),
	sinceDate: z
		.string()
		.describe('Limit results to activity on or after this date.')
		.optional(),
	untilDate: z
		.string()
		.describe('Limit results to activity on or before this date.')
		.optional(),
	scale: AnalyticsScaleSchema.describe(
		'Quantization period over which to view analytics. Defaults to daily.',
	).optional(),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
	orderBy: PackFormulaAnalyticsOrderBySchema.describe(
		'Use this parameter to order the Pack formula analytics returned.',
	).optional(),
	direction: SortDirectionSchema.describe(
		'Direction to sort results in.',
	).optional(),
	limit: z
		.number()
		.describe('Maximum number of results to return in this query.')
		.optional(),
});
const AnalyticsListPackFormulasOutputSchema =
	PackFormulaAnalyticsCollectionSchema;

const AnalyticsGetLastUpdatedInputSchema = z.object({});
const AnalyticsGetLastUpdatedOutputSchema = AnalyticsLastUpdatedResponseSchema;

const WorkspacesListUsersInputSchema = z.object({
	workspaceId: z.string().describe('ID of the workspace.'),
	includedRoles: z
		.array(WorkspaceUserRoleSchema)
		.describe(
			'Show only the members that match the included roles. Multiple roles can be specified with a comma-delimited list.',
		)
		.optional(),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
});
const WorkspacesListUsersOutputSchema = WorkspaceMembersListSchema;

const WorkspacesListRolesInputSchema = z.object({
	workspaceId: z.string().describe('ID of the workspace.'),
});
const WorkspacesListRolesOutputSchema = GetWorkspaceRoleActivitySchema;

const WorkspacesChangeUserRoleInputSchema = z.object({
	workspaceId: z.string().describe('ID of the workspace.'),
	email: z.string().describe('Email of the user.'),
	newRole: WorkspaceUserRoleSchema,
});
const WorkspacesChangeUserRoleOutputSchema = ChangeRoleResultSchema;

const PacksListInputSchema = z.object({
	accessType: PackAccessTypeSchema.describe(
		'Deprecated, use accessTypes instead. Filter to only return the Packs for which the current user has this access type',
	).optional(),
	accessTypes: z
		.array(PackAccessTypeSchema)
		.describe(
			'Filter to only return the Packs for which the current user has these access types.',
		)
		.optional(),
	sortBy: PacksSortBySchema.describe(
		'The sort order of the Packs returned.',
	).optional(),
	limit: z
		.number()
		.describe('Maximum number of results to return in this query.')
		.optional(),
	direction: SortDirectionSchema.describe(
		'Direction to sort results in.',
	).optional(),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
	onlyWorkspaceId: z
		.string()
		.describe(
			"Use only this workspace (not all of a user's workspaces) to check for Packs shared via workspace ACL.",
		)
		.optional(),
	parentWorkspaceIds: z
		.array(z.string())
		.describe(
			'Filter to only Packs whose parent workspace is one of the given IDs.',
		)
		.optional(),
	excludePublicPacks: z
		.boolean()
		.describe('Only get Packs shared with users/workspaces, not publicly.')
		.optional(),
	packEntrypoint: PackEntrypointSchema.describe(
		'Entrypoint for which this Pack call is being made. Used to filter non relevant Packs',
	).optional(),
	excludePackCategories: z
		.array(PackCategoryTypeSchema)
		.describe(
			'Exclude Packs of one or more category types. Categories not listed stay visible.',
		)
		.optional(),
});
const PacksListOutputSchema = PackSummaryListSchema;

const PacksGetInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
});
const PacksGetOutputSchema = PackSchema;

const PacksCreateInputSchema = z.object({
	workspaceId: z
		.string()
		.describe(
			"The parent workspace for the Pack. If unspecified, the user's default workspace will be used.",
		)
		.optional(),
	name: z.string().describe('The name for the Pack.').optional(),
	description: z
		.string()
		.describe('A brief description of the Pack.')
		.optional(),
	sourcePackId: z
		.number()
		.nullable()
		.describe("The ID of the new Pack's source, if this new Pack was forked.")
		.optional(),
});
const PacksCreateOutputSchema = CreatePackResponseSchema;

const PacksUpdateInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	overallRateLimit: z
		.object({ intervalSeconds: z.number(), operationsPerInterval: z.number() })
		.nullable()
		.describe('Rate limit in Pack settings.')
		.optional(),
	perConnectionRateLimit: z
		.object({ intervalSeconds: z.number(), operationsPerInterval: z.number() })
		.nullable()
		.describe('Rate limit in Pack settings.')
		.optional(),
	logo: z
		.object({
			assetId: z.string(),
			filename: z.string(),
			mimeType: z.string().optional(),
		})
		.nullable()
		.describe('Information about an image file for an update Pack request.')
		.optional(),
	cover: z
		.object({
			assetId: z.string(),
			filename: z.string(),
			mimeType: z.string().optional(),
		})
		.nullable()
		.describe('Information about an image file for an update Pack request.')
		.optional(),
	exampleImages: z
		.array(ImageFileForUpdatePackRequestSchema)
		.nullable()
		.describe('The example images for the Pack.')
		.optional(),
	agentImages: z
		.array(ImageFileForUpdatePackRequestSchema)
		.nullable()
		.describe('The agent images for the Pack.')
		.optional(),
	sourceCodeVisibility: PackSourceCodeVisibilitySchema.nullable()
		.describe("Visibility of a Pack's source code.")
		.optional(),
	packEntrypoints: z
		.array(PackEntrypointSchema)
		.nullable()
		.describe('Pack entrypoints where this Pack is available')
		.optional(),
	name: z.string().describe('The name of the Pack.').optional(),
	description: z
		.string()
		.describe('The full description of the Pack.')
		.optional(),
	shortDescription: z
		.string()
		.describe('A short version of the description of the Pack.')
		.optional(),
	agentShortDescription: z
		.string()
		.describe('A short description for the Pack as an agent.')
		.optional(),
	agentDescription: z
		.string()
		.describe('A full description for the Pack as an agent.')
		.optional(),
	supportEmail: z.string().describe('A contact email for the Pack.').optional(),
	termsOfServiceUrl: z
		.string()
		.describe('A Terms of Service URL for the Pack.')
		.optional(),
	privacyPolicyUrl: z
		.string()
		.describe('A Privacy Policy URL for the Pack.')
		.optional(),
});
const PacksUpdateOutputSchema = PackSchema;

const PacksDeleteInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
});
const PacksDeleteOutputSchema = DeletePackResponseSchema;

const PacksGetConfigurationSchemaInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
});
const PacksGetConfigurationSchemaOutputSchema =
	GetPackConfigurationJsonSchemaResponseSchema;

const PackVersionsListInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	limit: z
		.number()
		.describe('Maximum number of results to return in this query.')
		.optional(),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
});
const PackVersionsListOutputSchema = PackVersionListSchema;

const PackVersionsGetNextInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	proposedMetadata: z
		.string()
		.describe('The metadata for the next version of the Pack.')
		.optional(),
	sdkVersion: z
		.string()
		.describe('The SDK version the metadata was built on.')
		.optional(),
});
const PackVersionsGetNextOutputSchema = NextPackVersionInfoSchema;

const PackVersionsGetDiffInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	basePackVersion: z
		.string()
		.describe('Semantic version of the previous Pack version.'),
	targetPackVersion: z
		.string()
		.describe('Semantic version of the new Pack version.'),
});
const PackVersionsGetDiffOutputSchema = PackVersionDiffsSchema;

const PackVersionsRegisterInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	packVersion: z.string().describe('Semantic version of a Pack'),
	bundleHash: z
		.string()
		.describe('The SHA-256 hash of the file to be uploaded.'),
});
const PackVersionsRegisterOutputSchema = PackVersionUploadInfoSchema;

const PackVersionsUploadCompleteInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	packVersion: z.string().describe('Semantic version of a Pack'),
	notes: z
		.string()
		.describe('Developer notes of the new Pack version.')
		.optional(),
	source: PackSourceSchema.optional(),
	allowOlderSdkVersion: z
		.boolean()
		.describe(
			'Bypass the Coda protection against SDK version regression when multiple makers build versions.',
		)
		.optional(),
});
const PackVersionsUploadCompleteOutputSchema = CreatePackVersionResponseSchema;

const PackVersionsUploadSourceCodeInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	payloadHash: z
		.string()
		.describe('The SHA-256 hash of the image to be uploaded.'),
	filename: z.string(),
	packVersion: z.string().optional(),
});
const PackVersionsUploadSourceCodeOutputSchema = PackSourceCodeUploadInfoSchema;

const PackVersionsSourceCodeUploadCompleteInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	packVersion: z.string().describe('Semantic version of a Pack'),
	filename: z.string(),
	codeHash: z
		.string()
		.describe(
			'A SHA-256 hash of the source code used to identify duplicate uploads.',
		),
});
const PackVersionsSourceCodeUploadCompleteOutputSchema =
	PackSourceCodeUploadCompleteResponseSchema;

const PackVersionsGetSourceCodeInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	packVersion: z.string().describe('Semantic version of a Pack'),
});
const PackVersionsGetSourceCodeOutputSchema = PackSourceCodeInfoSchema;

const PackReleasesListInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	limit: z
		.number()
		.describe('Maximum number of results to return in this query.')
		.optional(),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
});
const PackReleasesListOutputSchema = PackReleaseListSchema;

const PackReleasesCreateInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	packVersion: z
		.string()
		.describe(
			'Which semantic Pack version that the release will be created on.',
		),
	releaseNotes: z.string().describe('Developers notes.').optional(),
});
const PackReleasesCreateOutputSchema = PackReleaseSchema;

const PackReleasesUpdateInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	packReleaseId: z.number().describe('ID of a Pack release'),
	releaseNotes: z
		.string()
		.describe(
			'Notes about key features or changes in this release that the Pack maker wants to communicate to users.',
		)
		.optional(),
});
const PackReleasesUpdateOutputSchema = PackReleaseSchema;

const PackAssetsUploadInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	packAssetType: PackAssetTypeSchema,
	imageHash: z
		.string()
		.describe('The SHA-256 hash of the image to be uploaded.'),
	mimeType: z.string().describe('The media type of the image being sent.'),
	filename: z.string(),
});
const PackAssetsUploadOutputSchema = PackAssetUploadInfoSchema;

const PackAssetsUploadCompleteInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	packAssetId: z.string().describe('Unique identifier for a Pack asset.'),
	packAssetType: PackAssetTypeSchema.describe('Pack asset type.'),
});
const PackAssetsUploadCompleteOutputSchema =
	PackAssetUploadCompleteResponseSchema;

const PackListingsListInputSchema = z.object({
	packAccessTypes:
		PackAccessTypesSchema.describe('Pack access types.').optional(),
	packIds: z.array(z.number()).describe('Which Pack IDs to fetch.').optional(),
	onlyWorkspaceId: z
		.string()
		.describe(
			"Use only this workspace (not all of a user's workspaces) to check for Packs shared via workspace ACL.",
		)
		.optional(),
	parentWorkspaceIds: z
		.array(z.string())
		.describe(
			'Filter to only Packs whose parent workspace is one of the given IDs.',
		)
		.optional(),
	excludePublicPacks: z
		.boolean()
		.describe('Only get Packs shared with users/workspaces, not publicly.')
		.optional(),
	packEntrypoint: PackEntrypointSchema.describe(
		'Entrypoint for which this Pack call is being made. Used to filter non relevant Packs',
	).optional(),
	certifiedAgentsOnly: z
		.boolean()
		.describe(
			'Only include Packs that are certified for agent use. Depending on server configuration, may also include Packs that the user is an admin of.',
		)
		.optional(),
	packCategories: z
		.array(PackCategoryTypeSchema)
		.describe('Filter Packs by one or more category types.')
		.optional(),
	sortBy: PackListingsSortBySchema.describe(
		'Specify a sort order for the returned Pack listings returned.',
	).optional(),
	orderBy: PackListingsSortBySchema.describe(
		'Deprecated: use sortBy instead.',
	).optional(),
	direction: SortDirectionSchema.describe(
		'Direction to sort results in.',
	).optional(),
	limit: z
		.number()
		.describe('Maximum number of results to return in this query.')
		.optional(),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
	installContext: PackListingInstallContextTypeSchema.describe(
		'Type of installation context for which Pack information is being requested.',
	).optional(),
});
const PackListingsListOutputSchema = PackListingListSchema;

const PackListingsGetInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	workspaceId: z
		.string()
		.describe(
			'ID of the target workspace (if applicable) for checking installation privileges.',
		)
		.optional(),
	docId: z
		.string()
		.describe('ID of the target document for checking installation privileges')
		.optional(),
	ingestionId: z
		.string()
		.describe('ID of the target ingestion for checking limit settings')
		.optional(),
	installContext: PackListingInstallContextTypeSchema.describe(
		'Type of installation context for which Pack information is being requested.',
	).optional(),
	releaseChannel: IngestionPackReleaseChannelSchema.describe(
		'Release channel for which Pack information is being requested.',
	).optional(),
});
const PackListingsGetOutputSchema = PackListingDetailSchema;

const PackListingsDeleteDraftInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
});
const PackListingsDeleteDraftOutputSchema =
	DeletePackListingDraftResponseSchema;

const PackPermissionsListInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
});
const PackPermissionsListOutputSchema = PackPermissionListSchema;

const PackPermissionsAddInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	principal: PackPrincipalSchema.describe('Metadata about a Pack principal.'),
	access: PackAccessTypeSchema,
});
const PackPermissionsAddOutputSchema = AddPackPermissionResponseSchema;

const PackPermissionsDeleteInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	permissionId: z.string().describe('ID of a permission on a doc.'),
});
const PackPermissionsDeleteOutputSchema = DeletePackPermissionResponseSchema;

const PackInvitationsListForUserInputSchema = z.object({
	limit: z
		.number()
		.describe('Maximum number of results to return in this query.')
		.optional(),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
});
const PackInvitationsListForUserOutputSchema = PackInvitationWithPackListSchema;

const PackInvitationsCreateInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	email: z.string().describe('Email address of the user to invite'),
	access: PackAccessTypeSchema,
});
const PackInvitationsCreateOutputSchema = CreatePackInvitationResponseSchema;

const PackMakersListInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
});
const PackMakersListOutputSchema = ListPackMakersResponseSchema;

const PackMakersAddInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	loginId: z.string().describe('The email of the Pack maker.'),
});
const PackMakersAddOutputSchema = AddPackMakerResponseSchema;

const PackMakersDeleteInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	loginId: z.string().describe('Email of a Coda user.'),
});
const PackMakersDeleteOutputSchema = DeletePackMakerResponseSchema;

const PackCategoriesListInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
});
const PackCategoriesListOutputSchema = ListPackCategoriesResponseSchema;

const PackCategoriesAddInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	categoryName: z.string().describe('Name of the publishing category.'),
});
const PackCategoriesAddOutputSchema = AddPackCategoryResponseSchema;

const PackCategoriesDeleteInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	categoryName: z.string().describe('Name of a publishing category'),
});
const PackCategoriesDeleteOutputSchema = DeletePackCategoryResponseSchema;

const PackFeaturedDocsListInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
});
const PackFeaturedDocsListOutputSchema = PackFeaturedDocsResponseSchema;

const PackFeaturedDocsUpdateInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	items: z
		.array(PackFeaturedDocRequestItemSchema)
		.describe('A list of docs to set as the featured docs for a Pack.'),
});
const PackFeaturedDocsUpdateOutputSchema = UpdatePackFeaturedDocsResponseSchema;

const PackConnectionsGetOauthConfigInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
});
const PackConnectionsGetOauthConfigOutputSchema = PackOauthConfigMetadataSchema;

const PackConnectionsSetOauthConfigInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	clientId: z.string().optional(),
	clientSecret: z.string().optional(),
	redirectUri: z.string().optional(),
});
const PackConnectionsSetOauthConfigOutputSchema = PackOauthConfigMetadataSchema;

const PackConnectionsGetSystemConnectionInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
});
const PackConnectionsGetSystemConnectionOutputSchema =
	PackSystemConnectionMetadataSchema;

const PackConnectionsSetSystemConnectionInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	credentials: PackSystemConnectionCredentialsSchema.describe(
		'Credentials of a Pack connection.',
	),
});
const PackConnectionsSetSystemConnectionOutputSchema =
	PackSystemConnectionMetadataSchema;

const PackConnectionsPatchSystemConnectionInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	body: PatchPackSystemConnectionRequestSchema.describe(
		'Credentials patch for the system connection.',
	),
});
const PackConnectionsPatchSystemConnectionOutputSchema =
	PackSystemConnectionMetadataSchema;

const PackLogsListInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	docId: z.string().describe('ID of the doc.'),
	limit: z
		.number()
		.describe('Maximum number of results to return in this query.')
		.optional(),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
	logTypes: z
		.array(PackLogTypeSchema)
		.describe('Only return logs of the given types.')
		.optional(),
	beforeTimestamp: z
		.string()
		.describe('Only return logs before the given time (non-inclusive).')
		.optional(),
	afterTimestamp: z
		.string()
		.describe('Only return logs after the given time (non-inclusive).')
		.optional(),
	order: z
		.enum(['asc', 'desc'])
		.describe(
			'Specifies if the logs will be returned in time desc or asc. Default is desc.',
		)
		.optional(),
	q: z
		.string()
		.describe('A search query that follows Lucene syntax.')
		.optional(),
	requestIds: z
		.array(z.string())
		.describe('Only return logs matching provided request IDs.')
		.optional(),
});
const PackLogsListOutputSchema = PackLogsListSchema;

const PackLogsListGroupedInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	docId: z.string().describe('ID of the doc.'),
	limit: z
		.number()
		.describe('Maximum number of results to return in this query.')
		.optional(),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
	beforeTimestamp: z
		.string()
		.describe('Only return logs before the given time (non-inclusive).')
		.optional(),
	afterTimestamp: z
		.string()
		.describe('Only return logs after the given time (non-inclusive).')
		.optional(),
	order: z
		.enum(['asc', 'desc'])
		.describe(
			'Specifies if the logs will be returned in time desc or asc. Default is desc.',
		)
		.optional(),
	q: z
		.string()
		.describe('A search query that follows Lucene syntax.')
		.optional(),
});
const PackLogsListGroupedOutputSchema = GroupedPackLogsListSchema;

const PackLogsListIngestionInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	tenantId: z.string().describe('ID of the tenant.'),
	rootIngestionId: z.string().describe('ID of the root ingestion.'),
	limit: z
		.number()
		.describe('Maximum number of results to return in this query.')
		.optional(),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
	logTypes: z
		.array(PackLogTypeSchema)
		.describe('Only return logs of the given types.')
		.optional(),
	ingestionExecutionId: z
		.string()
		.describe('ID of the ingestion execution.')
		.optional(),
	beforeTimestamp: z
		.string()
		.describe('Only return logs before the given time (non-inclusive).')
		.optional(),
	afterTimestamp: z
		.string()
		.describe('Only return logs after the given time (non-inclusive).')
		.optional(),
	ingestionStatus: IngestionStatusSchema.describe(
		'Only fetch logs with the given ingestion status. This only works in combination with the onlyExecutionCompletions parameter.',
	).optional(),
	onlyExecutionCompletions: z
		.boolean()
		.describe(
			'Only fetch logs that represent the completion of a child execution.',
		)
		.optional(),
	order: z
		.enum(['asc', 'desc'])
		.describe(
			'Specifies if the logs will be returned in time desc or asc. Default is desc.',
		)
		.optional(),
	q: z
		.string()
		.describe('A search query that follows Lucene syntax.')
		.optional(),
	requestIds: z
		.array(z.string())
		.describe('Only return logs matching provided request IDs.')
		.optional(),
});
const PackLogsListIngestionOutputSchema = PackLogsListSchema;

const PackLogsListGroupedIngestionInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	tenantId: z.string().describe('ID of the tenant.'),
	rootIngestionId: z.string().describe('ID of the root ingestion.'),
	limit: z
		.number()
		.describe('Maximum number of results to return in this query.')
		.optional(),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
	ingestionExecutionId: z
		.string()
		.describe('ID of the ingestion execution.')
		.optional(),
	beforeTimestamp: z
		.string()
		.describe('Only return logs before the given time (non-inclusive).')
		.optional(),
	afterTimestamp: z
		.string()
		.describe('Only return logs after the given time (non-inclusive).')
		.optional(),
	order: z
		.enum(['asc', 'desc'])
		.describe(
			'Specifies if the logs will be returned in time desc or asc. Default is desc.',
		)
		.optional(),
	q: z
		.string()
		.describe('A search query that follows Lucene syntax.')
		.optional(),
});
const PackLogsListGroupedIngestionOutputSchema = GroupedPackLogsListSchema;

const PackLogsListIngestionExecutionsInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	tenantId: z.string().describe('ID of the tenant.'),
	rootIngestionId: z.string().describe('ID of the root ingestion.'),
	pageToken: z
		.string()
		.describe('An opaque token used to fetch the next page of results.')
		.optional(),
	limit: z
		.number()
		.describe('Maximum number of results to return in this query.')
		.optional(),
	datasource: z
		.string()
		.describe('Only show batch executions for this datasource (sync table).')
		.optional(),
	executionType: IngestionExecutionTypeSchema.describe(
		'Only show batch executions with this execution type.',
	).optional(),
	includeDeletedIngestions: z
		.boolean()
		.describe('Include deleted ingestion executions in the response')
		.optional(),
	ingestionExecutionId: z
		.string()
		.describe('Only retrieve this single batch execution.')
		.optional(),
	ingestionId: z
		.string()
		.describe('Only show batch executions for this sync table ingestion.')
		.optional(),
	ingestionStatus: IngestionStatusSchema.describe(
		'Only show batch executions with this status.',
	).optional(),
});
const PackLogsListIngestionExecutionsOutputSchema =
	IngestionBatchExecutionsListSchema;

const PackLogsGetDetailsInputSchema = z.object({
	packId: z.number().describe('ID of a Pack'),
	tenantId: z.string().describe('ID of the tenant.'),
	rootIngestionId: z.string().describe('ID of the root ingestion.'),
	logId: z.string().describe('The id of the log to retrieve.'),
	detailsKey: z.string().describe('The key of the details to retrieve.'),
});
const PackLogsGetDetailsOutputSchema = PackLogDetailsSchema;

export type AccountWhoamiInput = z.infer<typeof AccountWhoamiInputSchema>;
export type AccountWhoamiOutput = z.infer<typeof AccountWhoamiOutputSchema>;
export type AccountResolveBrowserLinkInput = z.infer<
	typeof AccountResolveBrowserLinkInputSchema
>;
export type AccountResolveBrowserLinkOutput = z.infer<
	typeof AccountResolveBrowserLinkOutputSchema
>;
export type AccountGetMutationStatusInput = z.infer<
	typeof AccountGetMutationStatusInputSchema
>;
export type AccountGetMutationStatusOutput = z.infer<
	typeof AccountGetMutationStatusOutputSchema
>;
export type CategoriesListInput = z.infer<typeof CategoriesListInputSchema>;
export type CategoriesListOutput = z.infer<typeof CategoriesListOutputSchema>;
export type DocsListInput = z.infer<typeof DocsListInputSchema>;
export type DocsListOutput = z.infer<typeof DocsListOutputSchema>;
export type DocsGetInput = z.infer<typeof DocsGetInputSchema>;
export type DocsGetOutput = z.infer<typeof DocsGetOutputSchema>;
export type DocsCreateInput = z.infer<typeof DocsCreateInputSchema>;
export type DocsCreateOutput = z.infer<typeof DocsCreateOutputSchema>;
export type DocsCopyInput = z.infer<typeof DocsCopyInputSchema>;
export type DocsCopyOutput = z.infer<typeof DocsCopyOutputSchema>;
export type DocsUpdateInput = z.infer<typeof DocsUpdateInputSchema>;
export type DocsUpdateOutput = z.infer<typeof DocsUpdateOutputSchema>;
export type DocsDeleteInput = z.infer<typeof DocsDeleteInputSchema>;
export type DocsDeleteOutput = z.infer<typeof DocsDeleteOutputSchema>;
export type DocsPublishInput = z.infer<typeof DocsPublishInputSchema>;
export type DocsPublishOutput = z.infer<typeof DocsPublishOutputSchema>;
export type DocsUnpublishInput = z.infer<typeof DocsUnpublishInputSchema>;
export type DocsUnpublishOutput = z.infer<typeof DocsUnpublishOutputSchema>;
export type PermissionsListInput = z.infer<typeof PermissionsListInputSchema>;
export type PermissionsListOutput = z.infer<typeof PermissionsListOutputSchema>;
export type PermissionsAddInput = z.infer<typeof PermissionsAddInputSchema>;
export type PermissionsAddOutput = z.infer<typeof PermissionsAddOutputSchema>;
export type PermissionsDeleteInput = z.infer<
	typeof PermissionsDeleteInputSchema
>;
export type PermissionsDeleteOutput = z.infer<
	typeof PermissionsDeleteOutputSchema
>;
export type PermissionsSearchPrincipalsInput = z.infer<
	typeof PermissionsSearchPrincipalsInputSchema
>;
export type PermissionsSearchPrincipalsOutput = z.infer<
	typeof PermissionsSearchPrincipalsOutputSchema
>;
export type PermissionsGetSharingMetadataInput = z.infer<
	typeof PermissionsGetSharingMetadataInputSchema
>;
export type PermissionsGetSharingMetadataOutput = z.infer<
	typeof PermissionsGetSharingMetadataOutputSchema
>;
export type PermissionsGetAclSettingsInput = z.infer<
	typeof PermissionsGetAclSettingsInputSchema
>;
export type PermissionsGetAclSettingsOutput = z.infer<
	typeof PermissionsGetAclSettingsOutputSchema
>;
export type PermissionsUpdateAclSettingsInput = z.infer<
	typeof PermissionsUpdateAclSettingsInputSchema
>;
export type PermissionsUpdateAclSettingsOutput = z.infer<
	typeof PermissionsUpdateAclSettingsOutputSchema
>;
export type PagesListInput = z.infer<typeof PagesListInputSchema>;
export type PagesListOutput = z.infer<typeof PagesListOutputSchema>;
export type PagesGetInput = z.infer<typeof PagesGetInputSchema>;
export type PagesGetOutput = z.infer<typeof PagesGetOutputSchema>;
export type PagesCreateInput = z.infer<typeof PagesCreateInputSchema>;
export type PagesCreateOutput = z.infer<typeof PagesCreateOutputSchema>;
export type PagesUpdateInput = z.infer<typeof PagesUpdateInputSchema>;
export type PagesUpdateOutput = z.infer<typeof PagesUpdateOutputSchema>;
export type PagesDeleteInput = z.infer<typeof PagesDeleteInputSchema>;
export type PagesDeleteOutput = z.infer<typeof PagesDeleteOutputSchema>;
export type PagesListContentInput = z.infer<typeof PagesListContentInputSchema>;
export type PagesListContentOutput = z.infer<
	typeof PagesListContentOutputSchema
>;
export type PagesDeleteContentInput = z.infer<
	typeof PagesDeleteContentInputSchema
>;
export type PagesDeleteContentOutput = z.infer<
	typeof PagesDeleteContentOutputSchema
>;
export type PagesBeginExportInput = z.infer<typeof PagesBeginExportInputSchema>;
export type PagesBeginExportOutput = z.infer<
	typeof PagesBeginExportOutputSchema
>;
export type PagesGetExportStatusInput = z.infer<
	typeof PagesGetExportStatusInputSchema
>;
export type PagesGetExportStatusOutput = z.infer<
	typeof PagesGetExportStatusOutputSchema
>;
export type TablesListInput = z.infer<typeof TablesListInputSchema>;
export type TablesListOutput = z.infer<typeof TablesListOutputSchema>;
export type TablesGetInput = z.infer<typeof TablesGetInputSchema>;
export type TablesGetOutput = z.infer<typeof TablesGetOutputSchema>;
export type ColumnsListInput = z.infer<typeof ColumnsListInputSchema>;
export type ColumnsListOutput = z.infer<typeof ColumnsListOutputSchema>;
export type ColumnsGetInput = z.infer<typeof ColumnsGetInputSchema>;
export type ColumnsGetOutput = z.infer<typeof ColumnsGetOutputSchema>;
export type RowsListInput = z.infer<typeof RowsListInputSchema>;
export type RowsListOutput = z.infer<typeof RowsListOutputSchema>;
export type RowsGetInput = z.infer<typeof RowsGetInputSchema>;
export type RowsGetOutput = z.infer<typeof RowsGetOutputSchema>;
export type RowsUpsertInput = z.infer<typeof RowsUpsertInputSchema>;
export type RowsUpsertOutput = z.infer<typeof RowsUpsertOutputSchema>;
export type RowsUpdateInput = z.infer<typeof RowsUpdateInputSchema>;
export type RowsUpdateOutput = z.infer<typeof RowsUpdateOutputSchema>;
export type RowsDeleteInput = z.infer<typeof RowsDeleteInputSchema>;
export type RowsDeleteOutput = z.infer<typeof RowsDeleteOutputSchema>;
export type RowsDeleteManyInput = z.infer<typeof RowsDeleteManyInputSchema>;
export type RowsDeleteManyOutput = z.infer<typeof RowsDeleteManyOutputSchema>;
export type RowsPushButtonInput = z.infer<typeof RowsPushButtonInputSchema>;
export type RowsPushButtonOutput = z.infer<typeof RowsPushButtonOutputSchema>;
export type FormulasListInput = z.infer<typeof FormulasListInputSchema>;
export type FormulasListOutput = z.infer<typeof FormulasListOutputSchema>;
export type FormulasGetInput = z.infer<typeof FormulasGetInputSchema>;
export type FormulasGetOutput = z.infer<typeof FormulasGetOutputSchema>;
export type ControlsListInput = z.infer<typeof ControlsListInputSchema>;
export type ControlsListOutput = z.infer<typeof ControlsListOutputSchema>;
export type ControlsGetInput = z.infer<typeof ControlsGetInputSchema>;
export type ControlsGetOutput = z.infer<typeof ControlsGetOutputSchema>;
export type DomainsListInput = z.infer<typeof DomainsListInputSchema>;
export type DomainsListOutput = z.infer<typeof DomainsListOutputSchema>;
export type DomainsAddInput = z.infer<typeof DomainsAddInputSchema>;
export type DomainsAddOutput = z.infer<typeof DomainsAddOutputSchema>;
export type DomainsUpdateInput = z.infer<typeof DomainsUpdateInputSchema>;
export type DomainsUpdateOutput = z.infer<typeof DomainsUpdateOutputSchema>;
export type DomainsDeleteInput = z.infer<typeof DomainsDeleteInputSchema>;
export type DomainsDeleteOutput = z.infer<typeof DomainsDeleteOutputSchema>;
export type DomainsGetProviderInput = z.infer<
	typeof DomainsGetProviderInputSchema
>;
export type DomainsGetProviderOutput = z.infer<
	typeof DomainsGetProviderOutputSchema
>;
export type FoldersListInput = z.infer<typeof FoldersListInputSchema>;
export type FoldersListOutput = z.infer<typeof FoldersListOutputSchema>;
export type FoldersGetInput = z.infer<typeof FoldersGetInputSchema>;
export type FoldersGetOutput = z.infer<typeof FoldersGetOutputSchema>;
export type FoldersCreateInput = z.infer<typeof FoldersCreateInputSchema>;
export type FoldersCreateOutput = z.infer<typeof FoldersCreateOutputSchema>;
export type FoldersUpdateInput = z.infer<typeof FoldersUpdateInputSchema>;
export type FoldersUpdateOutput = z.infer<typeof FoldersUpdateOutputSchema>;
export type FoldersDeleteInput = z.infer<typeof FoldersDeleteInputSchema>;
export type FoldersDeleteOutput = z.infer<typeof FoldersDeleteOutputSchema>;
export type AutomationsTriggerInput = z.infer<
	typeof AutomationsTriggerInputSchema
>;
export type AutomationsTriggerOutput = z.infer<
	typeof AutomationsTriggerOutputSchema
>;
export type AnalyticsListDocsInput = z.infer<
	typeof AnalyticsListDocsInputSchema
>;
export type AnalyticsListDocsOutput = z.infer<
	typeof AnalyticsListDocsOutputSchema
>;
export type AnalyticsListPagesInput = z.infer<
	typeof AnalyticsListPagesInputSchema
>;
export type AnalyticsListPagesOutput = z.infer<
	typeof AnalyticsListPagesOutputSchema
>;
export type AnalyticsGetDocsSummaryInput = z.infer<
	typeof AnalyticsGetDocsSummaryInputSchema
>;
export type AnalyticsGetDocsSummaryOutput = z.infer<
	typeof AnalyticsGetDocsSummaryOutputSchema
>;
export type AnalyticsListPacksInput = z.infer<
	typeof AnalyticsListPacksInputSchema
>;
export type AnalyticsListPacksOutput = z.infer<
	typeof AnalyticsListPacksOutputSchema
>;
export type AnalyticsGetPacksSummaryInput = z.infer<
	typeof AnalyticsGetPacksSummaryInputSchema
>;
export type AnalyticsGetPacksSummaryOutput = z.infer<
	typeof AnalyticsGetPacksSummaryOutputSchema
>;
export type AnalyticsListPackFormulasInput = z.infer<
	typeof AnalyticsListPackFormulasInputSchema
>;
export type AnalyticsListPackFormulasOutput = z.infer<
	typeof AnalyticsListPackFormulasOutputSchema
>;
export type AnalyticsGetLastUpdatedInput = z.infer<
	typeof AnalyticsGetLastUpdatedInputSchema
>;
export type AnalyticsGetLastUpdatedOutput = z.infer<
	typeof AnalyticsGetLastUpdatedOutputSchema
>;
export type WorkspacesListUsersInput = z.infer<
	typeof WorkspacesListUsersInputSchema
>;
export type WorkspacesListUsersOutput = z.infer<
	typeof WorkspacesListUsersOutputSchema
>;
export type WorkspacesListRolesInput = z.infer<
	typeof WorkspacesListRolesInputSchema
>;
export type WorkspacesListRolesOutput = z.infer<
	typeof WorkspacesListRolesOutputSchema
>;
export type WorkspacesChangeUserRoleInput = z.infer<
	typeof WorkspacesChangeUserRoleInputSchema
>;
export type WorkspacesChangeUserRoleOutput = z.infer<
	typeof WorkspacesChangeUserRoleOutputSchema
>;
export type PacksListInput = z.infer<typeof PacksListInputSchema>;
export type PacksListOutput = z.infer<typeof PacksListOutputSchema>;
export type PacksGetInput = z.infer<typeof PacksGetInputSchema>;
export type PacksGetOutput = z.infer<typeof PacksGetOutputSchema>;
export type PacksCreateInput = z.infer<typeof PacksCreateInputSchema>;
export type PacksCreateOutput = z.infer<typeof PacksCreateOutputSchema>;
export type PacksUpdateInput = z.infer<typeof PacksUpdateInputSchema>;
export type PacksUpdateOutput = z.infer<typeof PacksUpdateOutputSchema>;
export type PacksDeleteInput = z.infer<typeof PacksDeleteInputSchema>;
export type PacksDeleteOutput = z.infer<typeof PacksDeleteOutputSchema>;
export type PacksGetConfigurationSchemaInput = z.infer<
	typeof PacksGetConfigurationSchemaInputSchema
>;
export type PacksGetConfigurationSchemaOutput = z.infer<
	typeof PacksGetConfigurationSchemaOutputSchema
>;
export type PackVersionsListInput = z.infer<typeof PackVersionsListInputSchema>;
export type PackVersionsListOutput = z.infer<
	typeof PackVersionsListOutputSchema
>;
export type PackVersionsGetNextInput = z.infer<
	typeof PackVersionsGetNextInputSchema
>;
export type PackVersionsGetNextOutput = z.infer<
	typeof PackVersionsGetNextOutputSchema
>;
export type PackVersionsGetDiffInput = z.infer<
	typeof PackVersionsGetDiffInputSchema
>;
export type PackVersionsGetDiffOutput = z.infer<
	typeof PackVersionsGetDiffOutputSchema
>;
export type PackVersionsRegisterInput = z.infer<
	typeof PackVersionsRegisterInputSchema
>;
export type PackVersionsRegisterOutput = z.infer<
	typeof PackVersionsRegisterOutputSchema
>;
export type PackVersionsUploadCompleteInput = z.infer<
	typeof PackVersionsUploadCompleteInputSchema
>;
export type PackVersionsUploadCompleteOutput = z.infer<
	typeof PackVersionsUploadCompleteOutputSchema
>;
export type PackVersionsUploadSourceCodeInput = z.infer<
	typeof PackVersionsUploadSourceCodeInputSchema
>;
export type PackVersionsUploadSourceCodeOutput = z.infer<
	typeof PackVersionsUploadSourceCodeOutputSchema
>;
export type PackVersionsSourceCodeUploadCompleteInput = z.infer<
	typeof PackVersionsSourceCodeUploadCompleteInputSchema
>;
export type PackVersionsSourceCodeUploadCompleteOutput = z.infer<
	typeof PackVersionsSourceCodeUploadCompleteOutputSchema
>;
export type PackVersionsGetSourceCodeInput = z.infer<
	typeof PackVersionsGetSourceCodeInputSchema
>;
export type PackVersionsGetSourceCodeOutput = z.infer<
	typeof PackVersionsGetSourceCodeOutputSchema
>;
export type PackReleasesListInput = z.infer<typeof PackReleasesListInputSchema>;
export type PackReleasesListOutput = z.infer<
	typeof PackReleasesListOutputSchema
>;
export type PackReleasesCreateInput = z.infer<
	typeof PackReleasesCreateInputSchema
>;
export type PackReleasesCreateOutput = z.infer<
	typeof PackReleasesCreateOutputSchema
>;
export type PackReleasesUpdateInput = z.infer<
	typeof PackReleasesUpdateInputSchema
>;
export type PackReleasesUpdateOutput = z.infer<
	typeof PackReleasesUpdateOutputSchema
>;
export type PackAssetsUploadInput = z.infer<typeof PackAssetsUploadInputSchema>;
export type PackAssetsUploadOutput = z.infer<
	typeof PackAssetsUploadOutputSchema
>;
export type PackAssetsUploadCompleteInput = z.infer<
	typeof PackAssetsUploadCompleteInputSchema
>;
export type PackAssetsUploadCompleteOutput = z.infer<
	typeof PackAssetsUploadCompleteOutputSchema
>;
export type PackListingsListInput = z.infer<typeof PackListingsListInputSchema>;
export type PackListingsListOutput = z.infer<
	typeof PackListingsListOutputSchema
>;
export type PackListingsGetInput = z.infer<typeof PackListingsGetInputSchema>;
export type PackListingsGetOutput = z.infer<typeof PackListingsGetOutputSchema>;
export type PackListingsDeleteDraftInput = z.infer<
	typeof PackListingsDeleteDraftInputSchema
>;
export type PackListingsDeleteDraftOutput = z.infer<
	typeof PackListingsDeleteDraftOutputSchema
>;
export type PackPermissionsListInput = z.infer<
	typeof PackPermissionsListInputSchema
>;
export type PackPermissionsListOutput = z.infer<
	typeof PackPermissionsListOutputSchema
>;
export type PackPermissionsAddInput = z.infer<
	typeof PackPermissionsAddInputSchema
>;
export type PackPermissionsAddOutput = z.infer<
	typeof PackPermissionsAddOutputSchema
>;
export type PackPermissionsDeleteInput = z.infer<
	typeof PackPermissionsDeleteInputSchema
>;
export type PackPermissionsDeleteOutput = z.infer<
	typeof PackPermissionsDeleteOutputSchema
>;
export type PackInvitationsListForUserInput = z.infer<
	typeof PackInvitationsListForUserInputSchema
>;
export type PackInvitationsListForUserOutput = z.infer<
	typeof PackInvitationsListForUserOutputSchema
>;
export type PackInvitationsCreateInput = z.infer<
	typeof PackInvitationsCreateInputSchema
>;
export type PackInvitationsCreateOutput = z.infer<
	typeof PackInvitationsCreateOutputSchema
>;
export type PackMakersListInput = z.infer<typeof PackMakersListInputSchema>;
export type PackMakersListOutput = z.infer<typeof PackMakersListOutputSchema>;
export type PackMakersAddInput = z.infer<typeof PackMakersAddInputSchema>;
export type PackMakersAddOutput = z.infer<typeof PackMakersAddOutputSchema>;
export type PackMakersDeleteInput = z.infer<typeof PackMakersDeleteInputSchema>;
export type PackMakersDeleteOutput = z.infer<
	typeof PackMakersDeleteOutputSchema
>;
export type PackCategoriesListInput = z.infer<
	typeof PackCategoriesListInputSchema
>;
export type PackCategoriesListOutput = z.infer<
	typeof PackCategoriesListOutputSchema
>;
export type PackCategoriesAddInput = z.infer<
	typeof PackCategoriesAddInputSchema
>;
export type PackCategoriesAddOutput = z.infer<
	typeof PackCategoriesAddOutputSchema
>;
export type PackCategoriesDeleteInput = z.infer<
	typeof PackCategoriesDeleteInputSchema
>;
export type PackCategoriesDeleteOutput = z.infer<
	typeof PackCategoriesDeleteOutputSchema
>;
export type PackFeaturedDocsListInput = z.infer<
	typeof PackFeaturedDocsListInputSchema
>;
export type PackFeaturedDocsListOutput = z.infer<
	typeof PackFeaturedDocsListOutputSchema
>;
export type PackFeaturedDocsUpdateInput = z.infer<
	typeof PackFeaturedDocsUpdateInputSchema
>;
export type PackFeaturedDocsUpdateOutput = z.infer<
	typeof PackFeaturedDocsUpdateOutputSchema
>;
export type PackConnectionsGetOauthConfigInput = z.infer<
	typeof PackConnectionsGetOauthConfigInputSchema
>;
export type PackConnectionsGetOauthConfigOutput = z.infer<
	typeof PackConnectionsGetOauthConfigOutputSchema
>;
export type PackConnectionsSetOauthConfigInput = z.infer<
	typeof PackConnectionsSetOauthConfigInputSchema
>;
export type PackConnectionsSetOauthConfigOutput = z.infer<
	typeof PackConnectionsSetOauthConfigOutputSchema
>;
export type PackConnectionsGetSystemConnectionInput = z.infer<
	typeof PackConnectionsGetSystemConnectionInputSchema
>;
export type PackConnectionsGetSystemConnectionOutput = z.infer<
	typeof PackConnectionsGetSystemConnectionOutputSchema
>;
export type PackConnectionsSetSystemConnectionInput = z.infer<
	typeof PackConnectionsSetSystemConnectionInputSchema
>;
export type PackConnectionsSetSystemConnectionOutput = z.infer<
	typeof PackConnectionsSetSystemConnectionOutputSchema
>;
export type PackConnectionsPatchSystemConnectionInput = z.infer<
	typeof PackConnectionsPatchSystemConnectionInputSchema
>;
export type PackConnectionsPatchSystemConnectionOutput = z.infer<
	typeof PackConnectionsPatchSystemConnectionOutputSchema
>;
export type PackLogsListInput = z.infer<typeof PackLogsListInputSchema>;
export type PackLogsListOutput = z.infer<typeof PackLogsListOutputSchema>;
export type PackLogsListGroupedInput = z.infer<
	typeof PackLogsListGroupedInputSchema
>;
export type PackLogsListGroupedOutput = z.infer<
	typeof PackLogsListGroupedOutputSchema
>;
export type PackLogsListIngestionInput = z.infer<
	typeof PackLogsListIngestionInputSchema
>;
export type PackLogsListIngestionOutput = z.infer<
	typeof PackLogsListIngestionOutputSchema
>;
export type PackLogsListGroupedIngestionInput = z.infer<
	typeof PackLogsListGroupedIngestionInputSchema
>;
export type PackLogsListGroupedIngestionOutput = z.infer<
	typeof PackLogsListGroupedIngestionOutputSchema
>;
export type PackLogsListIngestionExecutionsInput = z.infer<
	typeof PackLogsListIngestionExecutionsInputSchema
>;
export type PackLogsListIngestionExecutionsOutput = z.infer<
	typeof PackLogsListIngestionExecutionsOutputSchema
>;
export type PackLogsGetDetailsInput = z.infer<
	typeof PackLogsGetDetailsInputSchema
>;
export type PackLogsGetDetailsOutput = z.infer<
	typeof PackLogsGetDetailsOutputSchema
>;

export type CodaEndpointInputs = {
	accountWhoami: AccountWhoamiInput;
	accountResolveBrowserLink: AccountResolveBrowserLinkInput;
	accountGetMutationStatus: AccountGetMutationStatusInput;
	categoriesList: CategoriesListInput;
	docsList: DocsListInput;
	docsGet: DocsGetInput;
	docsCreate: DocsCreateInput;
	docsCopy: DocsCopyInput;
	docsUpdate: DocsUpdateInput;
	docsDelete: DocsDeleteInput;
	docsPublish: DocsPublishInput;
	docsUnpublish: DocsUnpublishInput;
	permissionsList: PermissionsListInput;
	permissionsAdd: PermissionsAddInput;
	permissionsDelete: PermissionsDeleteInput;
	permissionsSearchPrincipals: PermissionsSearchPrincipalsInput;
	permissionsGetSharingMetadata: PermissionsGetSharingMetadataInput;
	permissionsGetAclSettings: PermissionsGetAclSettingsInput;
	permissionsUpdateAclSettings: PermissionsUpdateAclSettingsInput;
	pagesList: PagesListInput;
	pagesGet: PagesGetInput;
	pagesCreate: PagesCreateInput;
	pagesUpdate: PagesUpdateInput;
	pagesDelete: PagesDeleteInput;
	pagesListContent: PagesListContentInput;
	pagesDeleteContent: PagesDeleteContentInput;
	pagesBeginExport: PagesBeginExportInput;
	pagesGetExportStatus: PagesGetExportStatusInput;
	tablesList: TablesListInput;
	tablesGet: TablesGetInput;
	columnsList: ColumnsListInput;
	columnsGet: ColumnsGetInput;
	rowsList: RowsListInput;
	rowsGet: RowsGetInput;
	rowsUpsert: RowsUpsertInput;
	rowsUpdate: RowsUpdateInput;
	rowsDelete: RowsDeleteInput;
	rowsDeleteMany: RowsDeleteManyInput;
	rowsPushButton: RowsPushButtonInput;
	formulasList: FormulasListInput;
	formulasGet: FormulasGetInput;
	controlsList: ControlsListInput;
	controlsGet: ControlsGetInput;
	domainsList: DomainsListInput;
	domainsAdd: DomainsAddInput;
	domainsUpdate: DomainsUpdateInput;
	domainsDelete: DomainsDeleteInput;
	domainsGetProvider: DomainsGetProviderInput;
	foldersList: FoldersListInput;
	foldersGet: FoldersGetInput;
	foldersCreate: FoldersCreateInput;
	foldersUpdate: FoldersUpdateInput;
	foldersDelete: FoldersDeleteInput;
	automationsTrigger: AutomationsTriggerInput;
	analyticsListDocs: AnalyticsListDocsInput;
	analyticsListPages: AnalyticsListPagesInput;
	analyticsGetDocsSummary: AnalyticsGetDocsSummaryInput;
	analyticsListPacks: AnalyticsListPacksInput;
	analyticsGetPacksSummary: AnalyticsGetPacksSummaryInput;
	analyticsListPackFormulas: AnalyticsListPackFormulasInput;
	analyticsGetLastUpdated: AnalyticsGetLastUpdatedInput;
	workspacesListUsers: WorkspacesListUsersInput;
	workspacesListRoles: WorkspacesListRolesInput;
	workspacesChangeUserRole: WorkspacesChangeUserRoleInput;
	packsList: PacksListInput;
	packsGet: PacksGetInput;
	packsCreate: PacksCreateInput;
	packsUpdate: PacksUpdateInput;
	packsDelete: PacksDeleteInput;
	packsGetConfigurationSchema: PacksGetConfigurationSchemaInput;
	packVersionsList: PackVersionsListInput;
	packVersionsGetNext: PackVersionsGetNextInput;
	packVersionsGetDiff: PackVersionsGetDiffInput;
	packVersionsRegister: PackVersionsRegisterInput;
	packVersionsUploadComplete: PackVersionsUploadCompleteInput;
	packVersionsUploadSourceCode: PackVersionsUploadSourceCodeInput;
	packVersionsSourceCodeUploadComplete: PackVersionsSourceCodeUploadCompleteInput;
	packVersionsGetSourceCode: PackVersionsGetSourceCodeInput;
	packReleasesList: PackReleasesListInput;
	packReleasesCreate: PackReleasesCreateInput;
	packReleasesUpdate: PackReleasesUpdateInput;
	packAssetsUpload: PackAssetsUploadInput;
	packAssetsUploadComplete: PackAssetsUploadCompleteInput;
	packListingsList: PackListingsListInput;
	packListingsGet: PackListingsGetInput;
	packListingsDeleteDraft: PackListingsDeleteDraftInput;
	packPermissionsList: PackPermissionsListInput;
	packPermissionsAdd: PackPermissionsAddInput;
	packPermissionsDelete: PackPermissionsDeleteInput;
	packInvitationsListForUser: PackInvitationsListForUserInput;
	packInvitationsCreate: PackInvitationsCreateInput;
	packMakersList: PackMakersListInput;
	packMakersAdd: PackMakersAddInput;
	packMakersDelete: PackMakersDeleteInput;
	packCategoriesList: PackCategoriesListInput;
	packCategoriesAdd: PackCategoriesAddInput;
	packCategoriesDelete: PackCategoriesDeleteInput;
	packFeaturedDocsList: PackFeaturedDocsListInput;
	packFeaturedDocsUpdate: PackFeaturedDocsUpdateInput;
	packConnectionsGetOauthConfig: PackConnectionsGetOauthConfigInput;
	packConnectionsSetOauthConfig: PackConnectionsSetOauthConfigInput;
	packConnectionsGetSystemConnection: PackConnectionsGetSystemConnectionInput;
	packConnectionsSetSystemConnection: PackConnectionsSetSystemConnectionInput;
	packConnectionsPatchSystemConnection: PackConnectionsPatchSystemConnectionInput;
	packLogsList: PackLogsListInput;
	packLogsListGrouped: PackLogsListGroupedInput;
	packLogsListIngestion: PackLogsListIngestionInput;
	packLogsListGroupedIngestion: PackLogsListGroupedIngestionInput;
	packLogsListIngestionExecutions: PackLogsListIngestionExecutionsInput;
	packLogsGetDetails: PackLogsGetDetailsInput;
};

export type CodaEndpointOutputs = {
	accountWhoami: AccountWhoamiOutput;
	accountResolveBrowserLink: AccountResolveBrowserLinkOutput;
	accountGetMutationStatus: AccountGetMutationStatusOutput;
	categoriesList: CategoriesListOutput;
	docsList: DocsListOutput;
	docsGet: DocsGetOutput;
	docsCreate: DocsCreateOutput;
	docsCopy: DocsCopyOutput;
	docsUpdate: DocsUpdateOutput;
	docsDelete: DocsDeleteOutput;
	docsPublish: DocsPublishOutput;
	docsUnpublish: DocsUnpublishOutput;
	permissionsList: PermissionsListOutput;
	permissionsAdd: PermissionsAddOutput;
	permissionsDelete: PermissionsDeleteOutput;
	permissionsSearchPrincipals: PermissionsSearchPrincipalsOutput;
	permissionsGetSharingMetadata: PermissionsGetSharingMetadataOutput;
	permissionsGetAclSettings: PermissionsGetAclSettingsOutput;
	permissionsUpdateAclSettings: PermissionsUpdateAclSettingsOutput;
	pagesList: PagesListOutput;
	pagesGet: PagesGetOutput;
	pagesCreate: PagesCreateOutput;
	pagesUpdate: PagesUpdateOutput;
	pagesDelete: PagesDeleteOutput;
	pagesListContent: PagesListContentOutput;
	pagesDeleteContent: PagesDeleteContentOutput;
	pagesBeginExport: PagesBeginExportOutput;
	pagesGetExportStatus: PagesGetExportStatusOutput;
	tablesList: TablesListOutput;
	tablesGet: TablesGetOutput;
	columnsList: ColumnsListOutput;
	columnsGet: ColumnsGetOutput;
	rowsList: RowsListOutput;
	rowsGet: RowsGetOutput;
	rowsUpsert: RowsUpsertOutput;
	rowsUpdate: RowsUpdateOutput;
	rowsDelete: RowsDeleteOutput;
	rowsDeleteMany: RowsDeleteManyOutput;
	rowsPushButton: RowsPushButtonOutput;
	formulasList: FormulasListOutput;
	formulasGet: FormulasGetOutput;
	controlsList: ControlsListOutput;
	controlsGet: ControlsGetOutput;
	domainsList: DomainsListOutput;
	domainsAdd: DomainsAddOutput;
	domainsUpdate: DomainsUpdateOutput;
	domainsDelete: DomainsDeleteOutput;
	domainsGetProvider: DomainsGetProviderOutput;
	foldersList: FoldersListOutput;
	foldersGet: FoldersGetOutput;
	foldersCreate: FoldersCreateOutput;
	foldersUpdate: FoldersUpdateOutput;
	foldersDelete: FoldersDeleteOutput;
	automationsTrigger: AutomationsTriggerOutput;
	analyticsListDocs: AnalyticsListDocsOutput;
	analyticsListPages: AnalyticsListPagesOutput;
	analyticsGetDocsSummary: AnalyticsGetDocsSummaryOutput;
	analyticsListPacks: AnalyticsListPacksOutput;
	analyticsGetPacksSummary: AnalyticsGetPacksSummaryOutput;
	analyticsListPackFormulas: AnalyticsListPackFormulasOutput;
	analyticsGetLastUpdated: AnalyticsGetLastUpdatedOutput;
	workspacesListUsers: WorkspacesListUsersOutput;
	workspacesListRoles: WorkspacesListRolesOutput;
	workspacesChangeUserRole: WorkspacesChangeUserRoleOutput;
	packsList: PacksListOutput;
	packsGet: PacksGetOutput;
	packsCreate: PacksCreateOutput;
	packsUpdate: PacksUpdateOutput;
	packsDelete: PacksDeleteOutput;
	packsGetConfigurationSchema: PacksGetConfigurationSchemaOutput;
	packVersionsList: PackVersionsListOutput;
	packVersionsGetNext: PackVersionsGetNextOutput;
	packVersionsGetDiff: PackVersionsGetDiffOutput;
	packVersionsRegister: PackVersionsRegisterOutput;
	packVersionsUploadComplete: PackVersionsUploadCompleteOutput;
	packVersionsUploadSourceCode: PackVersionsUploadSourceCodeOutput;
	packVersionsSourceCodeUploadComplete: PackVersionsSourceCodeUploadCompleteOutput;
	packVersionsGetSourceCode: PackVersionsGetSourceCodeOutput;
	packReleasesList: PackReleasesListOutput;
	packReleasesCreate: PackReleasesCreateOutput;
	packReleasesUpdate: PackReleasesUpdateOutput;
	packAssetsUpload: PackAssetsUploadOutput;
	packAssetsUploadComplete: PackAssetsUploadCompleteOutput;
	packListingsList: PackListingsListOutput;
	packListingsGet: PackListingsGetOutput;
	packListingsDeleteDraft: PackListingsDeleteDraftOutput;
	packPermissionsList: PackPermissionsListOutput;
	packPermissionsAdd: PackPermissionsAddOutput;
	packPermissionsDelete: PackPermissionsDeleteOutput;
	packInvitationsListForUser: PackInvitationsListForUserOutput;
	packInvitationsCreate: PackInvitationsCreateOutput;
	packMakersList: PackMakersListOutput;
	packMakersAdd: PackMakersAddOutput;
	packMakersDelete: PackMakersDeleteOutput;
	packCategoriesList: PackCategoriesListOutput;
	packCategoriesAdd: PackCategoriesAddOutput;
	packCategoriesDelete: PackCategoriesDeleteOutput;
	packFeaturedDocsList: PackFeaturedDocsListOutput;
	packFeaturedDocsUpdate: PackFeaturedDocsUpdateOutput;
	packConnectionsGetOauthConfig: PackConnectionsGetOauthConfigOutput;
	packConnectionsSetOauthConfig: PackConnectionsSetOauthConfigOutput;
	packConnectionsGetSystemConnection: PackConnectionsGetSystemConnectionOutput;
	packConnectionsSetSystemConnection: PackConnectionsSetSystemConnectionOutput;
	packConnectionsPatchSystemConnection: PackConnectionsPatchSystemConnectionOutput;
	packLogsList: PackLogsListOutput;
	packLogsListGrouped: PackLogsListGroupedOutput;
	packLogsListIngestion: PackLogsListIngestionOutput;
	packLogsListGroupedIngestion: PackLogsListGroupedIngestionOutput;
	packLogsListIngestionExecutions: PackLogsListIngestionExecutionsOutput;
	packLogsGetDetails: PackLogsGetDetailsOutput;
};

export const CodaEndpointInputSchemas = {
	accountWhoami: AccountWhoamiInputSchema,
	accountResolveBrowserLink: AccountResolveBrowserLinkInputSchema,
	accountGetMutationStatus: AccountGetMutationStatusInputSchema,
	categoriesList: CategoriesListInputSchema,
	docsList: DocsListInputSchema,
	docsGet: DocsGetInputSchema,
	docsCreate: DocsCreateInputSchema,
	docsCopy: DocsCopyInputSchema,
	docsUpdate: DocsUpdateInputSchema,
	docsDelete: DocsDeleteInputSchema,
	docsPublish: DocsPublishInputSchema,
	docsUnpublish: DocsUnpublishInputSchema,
	permissionsList: PermissionsListInputSchema,
	permissionsAdd: PermissionsAddInputSchema,
	permissionsDelete: PermissionsDeleteInputSchema,
	permissionsSearchPrincipals: PermissionsSearchPrincipalsInputSchema,
	permissionsGetSharingMetadata: PermissionsGetSharingMetadataInputSchema,
	permissionsGetAclSettings: PermissionsGetAclSettingsInputSchema,
	permissionsUpdateAclSettings: PermissionsUpdateAclSettingsInputSchema,
	pagesList: PagesListInputSchema,
	pagesGet: PagesGetInputSchema,
	pagesCreate: PagesCreateInputSchema,
	pagesUpdate: PagesUpdateInputSchema,
	pagesDelete: PagesDeleteInputSchema,
	pagesListContent: PagesListContentInputSchema,
	pagesDeleteContent: PagesDeleteContentInputSchema,
	pagesBeginExport: PagesBeginExportInputSchema,
	pagesGetExportStatus: PagesGetExportStatusInputSchema,
	tablesList: TablesListInputSchema,
	tablesGet: TablesGetInputSchema,
	columnsList: ColumnsListInputSchema,
	columnsGet: ColumnsGetInputSchema,
	rowsList: RowsListInputSchema,
	rowsGet: RowsGetInputSchema,
	rowsUpsert: RowsUpsertInputSchema,
	rowsUpdate: RowsUpdateInputSchema,
	rowsDelete: RowsDeleteInputSchema,
	rowsDeleteMany: RowsDeleteManyInputSchema,
	rowsPushButton: RowsPushButtonInputSchema,
	formulasList: FormulasListInputSchema,
	formulasGet: FormulasGetInputSchema,
	controlsList: ControlsListInputSchema,
	controlsGet: ControlsGetInputSchema,
	domainsList: DomainsListInputSchema,
	domainsAdd: DomainsAddInputSchema,
	domainsUpdate: DomainsUpdateInputSchema,
	domainsDelete: DomainsDeleteInputSchema,
	domainsGetProvider: DomainsGetProviderInputSchema,
	foldersList: FoldersListInputSchema,
	foldersGet: FoldersGetInputSchema,
	foldersCreate: FoldersCreateInputSchema,
	foldersUpdate: FoldersUpdateInputSchema,
	foldersDelete: FoldersDeleteInputSchema,
	automationsTrigger: AutomationsTriggerInputSchema,
	analyticsListDocs: AnalyticsListDocsInputSchema,
	analyticsListPages: AnalyticsListPagesInputSchema,
	analyticsGetDocsSummary: AnalyticsGetDocsSummaryInputSchema,
	analyticsListPacks: AnalyticsListPacksInputSchema,
	analyticsGetPacksSummary: AnalyticsGetPacksSummaryInputSchema,
	analyticsListPackFormulas: AnalyticsListPackFormulasInputSchema,
	analyticsGetLastUpdated: AnalyticsGetLastUpdatedInputSchema,
	workspacesListUsers: WorkspacesListUsersInputSchema,
	workspacesListRoles: WorkspacesListRolesInputSchema,
	workspacesChangeUserRole: WorkspacesChangeUserRoleInputSchema,
	packsList: PacksListInputSchema,
	packsGet: PacksGetInputSchema,
	packsCreate: PacksCreateInputSchema,
	packsUpdate: PacksUpdateInputSchema,
	packsDelete: PacksDeleteInputSchema,
	packsGetConfigurationSchema: PacksGetConfigurationSchemaInputSchema,
	packVersionsList: PackVersionsListInputSchema,
	packVersionsGetNext: PackVersionsGetNextInputSchema,
	packVersionsGetDiff: PackVersionsGetDiffInputSchema,
	packVersionsRegister: PackVersionsRegisterInputSchema,
	packVersionsUploadComplete: PackVersionsUploadCompleteInputSchema,
	packVersionsUploadSourceCode: PackVersionsUploadSourceCodeInputSchema,
	packVersionsSourceCodeUploadComplete:
		PackVersionsSourceCodeUploadCompleteInputSchema,
	packVersionsGetSourceCode: PackVersionsGetSourceCodeInputSchema,
	packReleasesList: PackReleasesListInputSchema,
	packReleasesCreate: PackReleasesCreateInputSchema,
	packReleasesUpdate: PackReleasesUpdateInputSchema,
	packAssetsUpload: PackAssetsUploadInputSchema,
	packAssetsUploadComplete: PackAssetsUploadCompleteInputSchema,
	packListingsList: PackListingsListInputSchema,
	packListingsGet: PackListingsGetInputSchema,
	packListingsDeleteDraft: PackListingsDeleteDraftInputSchema,
	packPermissionsList: PackPermissionsListInputSchema,
	packPermissionsAdd: PackPermissionsAddInputSchema,
	packPermissionsDelete: PackPermissionsDeleteInputSchema,
	packInvitationsListForUser: PackInvitationsListForUserInputSchema,
	packInvitationsCreate: PackInvitationsCreateInputSchema,
	packMakersList: PackMakersListInputSchema,
	packMakersAdd: PackMakersAddInputSchema,
	packMakersDelete: PackMakersDeleteInputSchema,
	packCategoriesList: PackCategoriesListInputSchema,
	packCategoriesAdd: PackCategoriesAddInputSchema,
	packCategoriesDelete: PackCategoriesDeleteInputSchema,
	packFeaturedDocsList: PackFeaturedDocsListInputSchema,
	packFeaturedDocsUpdate: PackFeaturedDocsUpdateInputSchema,
	packConnectionsGetOauthConfig: PackConnectionsGetOauthConfigInputSchema,
	packConnectionsSetOauthConfig: PackConnectionsSetOauthConfigInputSchema,
	packConnectionsGetSystemConnection:
		PackConnectionsGetSystemConnectionInputSchema,
	packConnectionsSetSystemConnection:
		PackConnectionsSetSystemConnectionInputSchema,
	packConnectionsPatchSystemConnection:
		PackConnectionsPatchSystemConnectionInputSchema,
	packLogsList: PackLogsListInputSchema,
	packLogsListGrouped: PackLogsListGroupedInputSchema,
	packLogsListIngestion: PackLogsListIngestionInputSchema,
	packLogsListGroupedIngestion: PackLogsListGroupedIngestionInputSchema,
	packLogsListIngestionExecutions: PackLogsListIngestionExecutionsInputSchema,
	packLogsGetDetails: PackLogsGetDetailsInputSchema,
} as const;

export const CodaEndpointOutputSchemas = {
	accountWhoami: AccountWhoamiOutputSchema,
	accountResolveBrowserLink: AccountResolveBrowserLinkOutputSchema,
	accountGetMutationStatus: AccountGetMutationStatusOutputSchema,
	categoriesList: CategoriesListOutputSchema,
	docsList: DocsListOutputSchema,
	docsGet: DocsGetOutputSchema,
	docsCreate: DocsCreateOutputSchema,
	docsCopy: DocsCopyOutputSchema,
	docsUpdate: DocsUpdateOutputSchema,
	docsDelete: DocsDeleteOutputSchema,
	docsPublish: DocsPublishOutputSchema,
	docsUnpublish: DocsUnpublishOutputSchema,
	permissionsList: PermissionsListOutputSchema,
	permissionsAdd: PermissionsAddOutputSchema,
	permissionsDelete: PermissionsDeleteOutputSchema,
	permissionsSearchPrincipals: PermissionsSearchPrincipalsOutputSchema,
	permissionsGetSharingMetadata: PermissionsGetSharingMetadataOutputSchema,
	permissionsGetAclSettings: PermissionsGetAclSettingsOutputSchema,
	permissionsUpdateAclSettings: PermissionsUpdateAclSettingsOutputSchema,
	pagesList: PagesListOutputSchema,
	pagesGet: PagesGetOutputSchema,
	pagesCreate: PagesCreateOutputSchema,
	pagesUpdate: PagesUpdateOutputSchema,
	pagesDelete: PagesDeleteOutputSchema,
	pagesListContent: PagesListContentOutputSchema,
	pagesDeleteContent: PagesDeleteContentOutputSchema,
	pagesBeginExport: PagesBeginExportOutputSchema,
	pagesGetExportStatus: PagesGetExportStatusOutputSchema,
	tablesList: TablesListOutputSchema,
	tablesGet: TablesGetOutputSchema,
	columnsList: ColumnsListOutputSchema,
	columnsGet: ColumnsGetOutputSchema,
	rowsList: RowsListOutputSchema,
	rowsGet: RowsGetOutputSchema,
	rowsUpsert: RowsUpsertOutputSchema,
	rowsUpdate: RowsUpdateOutputSchema,
	rowsDelete: RowsDeleteOutputSchema,
	rowsDeleteMany: RowsDeleteManyOutputSchema,
	rowsPushButton: RowsPushButtonOutputSchema,
	formulasList: FormulasListOutputSchema,
	formulasGet: FormulasGetOutputSchema,
	controlsList: ControlsListOutputSchema,
	controlsGet: ControlsGetOutputSchema,
	domainsList: DomainsListOutputSchema,
	domainsAdd: DomainsAddOutputSchema,
	domainsUpdate: DomainsUpdateOutputSchema,
	domainsDelete: DomainsDeleteOutputSchema,
	domainsGetProvider: DomainsGetProviderOutputSchema,
	foldersList: FoldersListOutputSchema,
	foldersGet: FoldersGetOutputSchema,
	foldersCreate: FoldersCreateOutputSchema,
	foldersUpdate: FoldersUpdateOutputSchema,
	foldersDelete: FoldersDeleteOutputSchema,
	automationsTrigger: AutomationsTriggerOutputSchema,
	analyticsListDocs: AnalyticsListDocsOutputSchema,
	analyticsListPages: AnalyticsListPagesOutputSchema,
	analyticsGetDocsSummary: AnalyticsGetDocsSummaryOutputSchema,
	analyticsListPacks: AnalyticsListPacksOutputSchema,
	analyticsGetPacksSummary: AnalyticsGetPacksSummaryOutputSchema,
	analyticsListPackFormulas: AnalyticsListPackFormulasOutputSchema,
	analyticsGetLastUpdated: AnalyticsGetLastUpdatedOutputSchema,
	workspacesListUsers: WorkspacesListUsersOutputSchema,
	workspacesListRoles: WorkspacesListRolesOutputSchema,
	workspacesChangeUserRole: WorkspacesChangeUserRoleOutputSchema,
	packsList: PacksListOutputSchema,
	packsGet: PacksGetOutputSchema,
	packsCreate: PacksCreateOutputSchema,
	packsUpdate: PacksUpdateOutputSchema,
	packsDelete: PacksDeleteOutputSchema,
	packsGetConfigurationSchema: PacksGetConfigurationSchemaOutputSchema,
	packVersionsList: PackVersionsListOutputSchema,
	packVersionsGetNext: PackVersionsGetNextOutputSchema,
	packVersionsGetDiff: PackVersionsGetDiffOutputSchema,
	packVersionsRegister: PackVersionsRegisterOutputSchema,
	packVersionsUploadComplete: PackVersionsUploadCompleteOutputSchema,
	packVersionsUploadSourceCode: PackVersionsUploadSourceCodeOutputSchema,
	packVersionsSourceCodeUploadComplete:
		PackVersionsSourceCodeUploadCompleteOutputSchema,
	packVersionsGetSourceCode: PackVersionsGetSourceCodeOutputSchema,
	packReleasesList: PackReleasesListOutputSchema,
	packReleasesCreate: PackReleasesCreateOutputSchema,
	packReleasesUpdate: PackReleasesUpdateOutputSchema,
	packAssetsUpload: PackAssetsUploadOutputSchema,
	packAssetsUploadComplete: PackAssetsUploadCompleteOutputSchema,
	packListingsList: PackListingsListOutputSchema,
	packListingsGet: PackListingsGetOutputSchema,
	packListingsDeleteDraft: PackListingsDeleteDraftOutputSchema,
	packPermissionsList: PackPermissionsListOutputSchema,
	packPermissionsAdd: PackPermissionsAddOutputSchema,
	packPermissionsDelete: PackPermissionsDeleteOutputSchema,
	packInvitationsListForUser: PackInvitationsListForUserOutputSchema,
	packInvitationsCreate: PackInvitationsCreateOutputSchema,
	packMakersList: PackMakersListOutputSchema,
	packMakersAdd: PackMakersAddOutputSchema,
	packMakersDelete: PackMakersDeleteOutputSchema,
	packCategoriesList: PackCategoriesListOutputSchema,
	packCategoriesAdd: PackCategoriesAddOutputSchema,
	packCategoriesDelete: PackCategoriesDeleteOutputSchema,
	packFeaturedDocsList: PackFeaturedDocsListOutputSchema,
	packFeaturedDocsUpdate: PackFeaturedDocsUpdateOutputSchema,
	packConnectionsGetOauthConfig: PackConnectionsGetOauthConfigOutputSchema,
	packConnectionsSetOauthConfig: PackConnectionsSetOauthConfigOutputSchema,
	packConnectionsGetSystemConnection:
		PackConnectionsGetSystemConnectionOutputSchema,
	packConnectionsSetSystemConnection:
		PackConnectionsSetSystemConnectionOutputSchema,
	packConnectionsPatchSystemConnection:
		PackConnectionsPatchSystemConnectionOutputSchema,
	packLogsList: PackLogsListOutputSchema,
	packLogsListGrouped: PackLogsListGroupedOutputSchema,
	packLogsListIngestion: PackLogsListIngestionOutputSchema,
	packLogsListGroupedIngestion: PackLogsListGroupedIngestionOutputSchema,
	packLogsListIngestionExecutions: PackLogsListIngestionExecutionsOutputSchema,
	packLogsGetDetails: PackLogsGetDetailsOutputSchema,
} as const;
