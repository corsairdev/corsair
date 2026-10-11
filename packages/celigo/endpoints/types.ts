import { z } from 'zod';

// Celigo resource documents (exports, imports, flows, connections, ...) carry
// hundreds of adaptor-specific fields. Inputs and outputs name the fields
// callers rely on and keep the rest instead of stripping it.

const PathSegment = z
	.string()
	.min(1)
	.refine((id) => !/[/?#]/.test(id) && !/^\.{1,2}$/.test(id), {
		message:
			'must be a single URL path segment without delimiters or dot segments',
	});

const Id = PathSegment.describe('Celigo resource _id');
// Connector-specific blocks (http, netsuite, salesforce, ...) and user-defined
// settings have no fixed schema in the Celigo API, so they stay open records.
const Json = z.record(z.string(), z.unknown());
const Records = z.array(Json);

const EmptyInput = z.object({});
const IdInput = z.object({ id: Id });

const PageFields = {
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Maximum number of results per page'),
	after: z
		.string()
		.optional()
		.describe('Return results after this _id (cursor from the Link header)'),
};
const IncludeExcludeFields = {
	include: z.string().optional().describe('Comma-separated fields to return'),
	exclude: z.string().optional().describe('Comma-separated fields to omit'),
};

const PageInput = z.object(PageFields);
const IncludeExcludeIdInput = IdInput.extend(IncludeExcludeFields);
const LimitIdInput = IdInput.extend({ limit: PageFields.limit });

const Resource = z.looseObject({
	_id: z.string(),
	name: z.string().optional(),
	createdAt: z.string().optional(),
	lastModified: z.string().optional(),
});
const ResourceList = z.array(Resource);
const Success = z.object({ success: z.literal(true) });

const AuditAction = z.enum([
	'create',
	'update',
	'delete',
	'view',
	'restore',
	'purge',
	'signin',
	'signout',
	'purgelogs',
]);
const AuditSource = z.enum([
	'ui',
	'api',
	'system',
	'connector',
	'script',
	'stack',
	'sso',
	'cli',
	'mcp',
	'ora',
]);
const AuditFilterFields = {
	...PageFields,
	from: z.string().optional().describe('ISO timestamp lower bound'),
	to: z.string().optional().describe('ISO timestamp upper bound'),
	action: AuditAction.optional(),
	source: AuditSource.optional(),
	_byUserId: z.string().optional(),
};
const ResourceAuditInput = IdInput.extend(AuditFilterFields);
const ListAuditLogsInput = z.object({
	...AuditFilterFields,
	resourceType: z
		.string()
		.optional()
		.describe('Singular resource type, e.g. flow, export, connection'),
	_resourceId: z.string().optional(),
	fieldPath: z.string().optional(),
});
const AuditLogList = z.array(
	z.looseObject({
		_id: z.string(),
		resourceType: z.string().optional(),
		_resourceId: z.string().optional(),
		source: z.string().optional(),
		action: z.string().optional(),
		time: z.string().optional(),
		byUser: z
			.looseObject({
				_id: z.string().optional(),
				email: z.string().optional(),
				name: z.string().optional(),
			})
			.optional(),
	}),
);

const TokenInfo = z.looseObject({ _userId: z.string() });
const ListLicensesInput = z.object({ type: z.enum(['io']).optional() });
const LicenseList = z.array(
	z.looseObject({
		_id: z.string(),
		type: z.string().optional(),
		tier: z.string().optional(),
		expires: z.string().optional(),
	}),
);

// Connections

const ConnectionType = z
	.string()
	.min(1)
	.describe(
		'Connection type, e.g. http, netsuite, salesforce, ftp, s3, rdbms, mongodb, wrapper',
	);
const ConnectionFields = {
	name: z.string().min(1),
	type: ConnectionType,
	externalId: z.string().optional(),
	assistant: z.string().optional(),
};
const CreateConnectionInput = z.looseObject(ConnectionFields);
const UpdateConnectionInput = z.looseObject({
	id: Id,
	...ConnectionFields,
});
const ListConnectionsInput = z.object({
	...PageFields,
	...IncludeExcludeFields,
	fetchQueueSize: z.boolean().optional(),
	externalId: z.string().optional(),
});
const PingResult = z.union([
	z.looseObject({ code: z.number() }),
	z.looseObject({ errors: z.array(Json) }),
]);
const DebugLogs = z.object({ logs: z.string() });
// Keyed by dependent resource type (flows, imports, ...); entry shape differs per type.
const Dependencies = z.record(z.string(), z.unknown());

const VirtualExportInput = IdInput.extend({
	export: Json.describe('Export definition to run without saving it'),
});
const VirtualExportResult = z.looseObject({
	data: Records,
	dataURIs: z.array(z.string().nullable()).optional(),
});
const VirtualExportPagedInput = VirtualExportInput.extend({
	pagedExportState: Json.optional().describe(
		'pagedExportState from the previous page; omit for the first page',
	),
});
const VirtualExportPagedResult = VirtualExportResult.extend({
	pagedExportState: Json.optional(),
});
const VirtualImportInput = IdInput.extend({
	import: Json.describe('Import definition to run without saving it'),
	data: Records.describe('Records to send through the import'),
});
const ImportResultList = z.array(
	z.looseObject({
		statusCode: z.number().optional(),
		id: z.string().optional(),
		_json: Json.optional(),
		ignored: z.boolean().optional(),
		stage: z.string().optional(),
		errors: z.array(Json).optional(),
	}),
);
// Celigo documents this as "the set of post-mapped records" without a schema.
const MappedRecords = z.union([z.array(z.unknown()), Json]);

// Flow step errors

const StepInput = IdInput.extend({
	stepId: PathSegment.describe('_id of the export or import step in the flow'),
});
const ErrorFilterFields = {
	_flowJobId: z.string().optional(),
	occurredAt_gte: z.string().optional(),
	occurredAt_lte: z.string().optional(),
	tags: z.array(z.string()).optional(),
};
const ListStepErrorsInput = StepInput.extend(ErrorFilterFields);
const ListResolvedErrorsInput = StepInput.extend({
	...ErrorFilterFields,
	resolvedAt_gte: z.string().optional(),
	resolvedAt_lte: z.string().optional(),
	resolvedBy: z.array(z.string()).optional(),
});
const StepError = z.looseObject({
	errorId: z.string(),
	occurredAt: z.string().optional(),
	source: z.string().optional(),
	code: z.string().optional(),
	message: z.string().optional(),
	_flowJobId: z.string().optional(),
	traceKey: z.string().optional(),
	retryDataKey: z.string().optional(),
});
const StepErrors = z.looseObject({
	errors: z.array(StepError),
	nextPageURL: z.string().optional(),
});
const ResolvedErrors = z.looseObject({
	resolved: z.array(StepError),
	nextPageURL: z.string().optional(),
});
const SelectionFields = {
	selectAll: z.boolean().optional(),
	lastErrorAt: z
		.string()
		.optional()
		.describe('With selectAll, only errors at or before this timestamp'),
};
const ErrorSelectionInput = StepInput.extend({
	errors: z.array(z.string()).optional().describe('errorIds to act on'),
	...SelectionFields,
});
const RetryErrorsInput = StepInput.extend({
	retryDataKeys: z.array(z.string()).optional(),
	...SelectionFields,
});
const RetryResult = z.looseObject({
	retryErrorCount: z.number().optional(),
});
const AssignErrorsInput = StepInput.extend({
	errorIds: z.array(z.string()).min(1),
	email: z.string().email(),
});
const AssignErrorsResult = z.looseObject({
	errorsToReturn: z.array(z.string()).optional(),
});
const UpdateErrorTagsInput = StepInput.extend({
	errors: z
		.array(
			z.looseObject({ id: z.string().optional(), rdk: z.string().optional() }),
		)
		.min(1),
	tagIds: z.array(z.string()),
});
const UpdateErrorTagsResult = z.looseObject({
	errorsToReturn: Json.optional(),
});

// Generic resource documents

const DocInput = z.looseObject({ name: z.string().optional() });
const UpdateDocInput = z.looseObject({
	id: Id,
	name: z.string().optional(),
});
const JsonPatchOp = z.object({
	op: z.enum(['replace', 'add', 'remove']),
	path: z.string().min(1).describe('JSON Pointer, e.g. /name'),
	// RFC 6902 allows any JSON value here.
	value: z.unknown().optional(),
});
const PatchInput = IdInput.extend({
	operations: z.array(JsonPatchOp).min(1),
});
const PatchIClientInput = IdInput.extend({
	operations: z
		.array(
			z.object({
				op: z.enum(['replace', 'add', 'remove']),
				path: z.literal('/oauth2/failPath'),
				value: z.string().optional(),
			}),
		)
		.min(1),
});
const ConnectionMap = z
	.record(z.string(), z.string())
	.describe('Maps source connection _id to target connection _id');
const CloneInput = IdInput.extend({
	name: z.string().optional(),
	connectionMap: ConnectionMap.optional(),
});
const CloneFlowInput = CloneInput.extend({ _integrationId: z.string() });
const CloneIntegrationInput = IdInput.extend({
	name: z.string().optional(),
	description: z.string().optional(),
	envId: z.string().optional(),
	connectionMap: ConnectionMap,
});
const CloneResult = z.union([
	Resource,
	z.array(
		z.looseObject({
			model: z.string(),
			_id: z.string(),
			name: z.string().optional(),
		}),
	),
]);

const ListExportsInput = z.object({
	externalId: z.string().optional(),
	...PageFields,
	...IncludeExcludeFields,
});
const ListImportsInput = z.object({
	externalId: z.string().optional(),
	...IncludeExcludeFields,
});
const InvokeImportInput = IdInput.extend({ data: Records.optional() });

const ListFlowsInput = z.object({
	_abstractFlowId: z.string().optional(),
	externalId: z.string().optional(),
	name: z.string().optional(),
	disabled: z.boolean().optional(),
	_integrationId: z.string().optional(),
	sort_by: z.enum(['lastExecutedAt']).optional(),
	includeInstances: z.boolean().optional(),
	...PageFields,
	...IncludeExcludeFields,
});
const GetFlowInput = IdInput.extend({
	mergeInstance: z.boolean().optional(),
});
const FlowDescendants = z.looseObject({
	exports: ResourceList.optional(),
	imports: ResourceList.optional(),
	tools: ResourceList.optional(),
});
const LastExportDateTime = z.looseObject({
	lastExportDateTime: z.string().nullable(),
});
const TemplateDownload = z.looseObject({
	signedURL: z.string(),
	key: z.string().optional(),
});

const ListIntegrationsInput = z.object({
	...IncludeExcludeFields,
	limit: PageFields.limit,
});
const ListIntegrationFlowsInput = LimitIdInput.extend({
	includeInstances: z.boolean().optional(),
});
const IntegrationErrorList = z.array(
	z.looseObject({
		_flowId: z.string(),
		numError: z.number().optional(),
		lastErrorAt: z.string().optional(),
	}),
);
const CreateRevisionInput = IdInput.extend({
	description: z.string().min(1),
});
const Revision = z.looseObject({
	_id: z.string(),
	_integrationId: z.string().optional(),
	type: z.string().optional(),
	status: z.string().optional(),
});
const IntegrationConnectionInput = IdInput.extend({
	connectionId: PathSegment.describe('Connection _id'),
});
const RegisterConnectionsInput = IdInput.extend({
	_connectionId: z.string().min(1),
});

const ListFileDefinitionsInput = z.object({
	...IncludeExcludeFields,
	externalId: z.string().optional(),
	limit: PageFields.limit,
});

// Jobs

const JobStatus = z.enum([
	'queued',
	'running',
	'completed',
	'failed',
	'canceled',
	'canceling',
	'retrying',
]);
const ListJobsInput = z.object({
	_integrationId: z.string().optional(),
	_exportId: z.string().optional(),
	_importId: z.string().optional(),
	_flowId: z.string().optional(),
	_flowJobId: z.string().optional(),
	_flowId_in: z.string().optional().describe('Comma-separated flow ids'),
	status_in: z.string().optional().describe('Comma-separated statuses'),
	createdAt_lte: z.string().optional(),
	createdAt_gte: z.string().optional(),
	status: JobStatus.optional(),
	numSuccess_lte: z.number().int().optional(),
	numSuccess_gte: z.number().int().optional(),
	numIgnore_lte: z.number().int().optional(),
	numIgnore_gte: z.number().int().optional(),
	numError_gte: z.number().int().optional(),
	numError_lte: z.number().int().optional(),
	type: z.enum(['flow', 'export', 'import', 'retry', 'bulk_retry']).optional(),
});
const JobList = z.array(
	z.looseObject({
		_id: z.string(),
		type: z.string().optional(),
		status: z.string().optional(),
		_flowId: z.string().optional(),
		numError: z.number().optional(),
		numSuccess: z.number().optional(),
		startedAt: z.string().optional(),
		endedAt: z.string().optional(),
	}),
);
const JobErrorList = z.array(
	z.looseObject({
		code: z.string().optional(),
		message: z.string().optional(),
		source: z.string().optional(),
		createdAt: z.string().optional(),
		_jobId: z.string().optional(),
		_retryId: z.string().optional(),
	}),
);

// Processors

const ParseCsvInput = z.object({
	data: z.string(),
	rules: Json.optional().describe(
		'columnDelimiter, rowDelimiter, hasHeaderRow, rowsToSkip, keyColumns, ...',
	),
	options: z
		.looseObject({ includeEmptyValues: z.boolean().optional() })
		.optional(),
});
const ParseXmlInput = z.object({
	data: z.string(),
	rules: Json.optional().describe(
		'resourcePath, groupByFields, sortByFields, doc',
	),
});
const ParseStructuredFileInput = z.object({
	data: z.string(),
	rules: Json.describe('fileDefinition or _fileDefinitionId, resourcePath'),
	options: Json.optional(),
});
const GenerateStructuredFileInput = z.object({
	data: Records,
	rules: z.looseObject({
		name: z.string(),
		version: z.enum(['1', '2']),
		format: z.enum([
			'delimited',
			'delimited/x12',
			'delimited/edifact',
			'fixed',
		]),
		rules: z.array(Json),
	}),
	options: Json.optional(),
});
const ParsedRecords = z.looseObject({
	mediaType: z.string().optional(),
	// Rows parsed from the caller's file, so their fields are whatever the file holds.
	data: z.array(z.unknown()),
	duration: z.number().optional(),
});
const GeneratedFile = z.looseObject({
	mediaType: z.string().optional(),
	data: z.string(),
	duration: z.number().optional(),
});

// Scripts

const ScriptFields = {
	name: z.string().min(1),
	description: z.string().optional(),
	content: z.string().optional().describe('JavaScript source'),
	postResponseHookToProcessOnChildRecord: z.boolean().optional(),
};
const ScriptInput = z.object(ScriptFields);
const UpdateScriptInput = IdInput.extend(ScriptFields);
const Script = z.looseObject({
	_id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	content: z.string().optional(),
	createdAt: z.string(),
	lastModified: z.string(),
});
const ScriptLogsInput = IdInput.extend({
	time_lte: z.number().int().optional().describe('Epoch milliseconds'),
	time_gt: z.number().int().optional().describe('Epoch milliseconds'),
	_flowId: z.string().optional(),
	_resourceId: z.string().optional(),
	functionType: z.string().optional(),
});
const ScriptLogs = z.looseObject({
	logs: z.array(Json),
	nextPageURL: z.string().optional(),
});

// State

const StateKey = PathSegment.describe('State key');
const StateResourceType = z.enum(['exports', 'imports', 'integrations']);
// State values are arbitrary JSON the caller stores and reads back.
const StateValueBody = z.union([Json, z.array(z.unknown())]);
const StateKeys = z.object({ keys: z.array(z.string()) });
const StateKeyInput = z.object({ key: StateKey });
const StateValue = StateValueBody;
const SetStateInput = StateKeyInput.extend({ value: StateValueBody });
const StateWriteResult = z.object({
	result: z.string().describe('OK when replaced, Created when new'),
});
const ResourceStateInput = z.object({
	resourceType: StateResourceType,
	resourceId: PathSegment.describe('_id of the export, import or integration'),
});
const ResourceStateKeyInput = ResourceStateInput.extend({ key: StateKey });
const SetResourceStateInput = ResourceStateKeyInput.extend({
	value: StateValueBody,
});

// Tags

const Tag = z.looseObject({
	_id: z.string(),
	tag: z.string().optional(),
	tagId: z.string().optional(),
});
const TagList = z.array(Tag);
const TagInput = z.object({ tag: z.string().min(1) });
const UpdateTagInput = IdInput.extend({ tag: z.string().min(1) });

// Users

const AccessLevel = z.enum(['monitor', 'manage', 'administrator', 'none']);
const AccessFields = {
	accessLevel: AccessLevel.optional().describe('Account-wide access level'),
	integrationAccessLevel: z
		.array(
			z.object({
				_integrationId: z.string(),
				accessLevel: AccessLevel,
			}),
		)
		.optional(),
	accountSSORequired: z.boolean().optional(),
	accountMFARequired: z.boolean().optional(),
	allowAccessToAPIM: z.boolean().optional(),
	allowToEditRetryData: z.boolean().optional(),
	allowIntegrationWorkspaceCreation: z.boolean().optional(),
};
const ListUsersInput = z.object({
	userType: z.enum(['workspace', 'end-user']).optional(),
});
const User = z.looseObject({
	_id: z.string(),
	accessLevel: z.string().optional(),
	accepted: z.boolean().optional(),
	disabled: z.boolean().optional(),
	sharedWithUser: z
		.looseObject({
			_id: z.string().optional(),
			email: z.string().optional(),
			name: z.string().optional(),
		})
		.optional(),
});
const UserList = z.array(User);
const InviteUserInput = z.object({
	email: z.string().email(),
	...AccessFields,
});
const InviteUsersInput = z.object({
	emails: z.array(z.string().email()).min(1),
	...AccessFields,
});
const InviteResults = z.array(
	z.looseObject({ statusCode: z.number().optional(), doc: User.optional() }),
);
const UpdateUserInput = IdInput.extend(AccessFields);

export const CeligoEndpointInputSchemas = {
	accountGetTokenInfo: EmptyInput,
	accountListLicenses: ListLicensesInput,
	auditList: ListAuditLogsInput,
	connectionsList: ListConnectionsInput,
	connectionsGet: IdInput,
	connectionsCreate: CreateConnectionInput,
	connectionsUpdate: UpdateConnectionInput,
	connectionsPatch: PatchInput,
	connectionsDelete: IdInput,
	connectionsPing: IdInput,
	connectionsTestVirtual: CreateConnectionInput,
	connectionsGetDebugLogs: IdInput,
	connectionsGetDependencies: IdInput,
	connectionsGetAudit: ResourceAuditInput,
	connectionsExecuteVirtualExport: VirtualExportInput,
	connectionsExecuteVirtualExportPaged: VirtualExportPagedInput,
	connectionsExecuteVirtualImport: VirtualImportInput,
	connectionsEvaluateVirtualImportMap: VirtualImportInput,
	ediProfilesList: EmptyInput,
	errorsList: ListStepErrorsInput,
	errorsListResolved: ListResolvedErrorsInput,
	errorsResolve: ErrorSelectionInput,
	errorsDeleteResolved: ErrorSelectionInput,
	errorsRetry: RetryErrorsInput,
	errorsAssign: AssignErrorsInput,
	errorsUpdateTags: UpdateErrorTagsInput,
	exportsList: ListExportsInput,
	exportsGet: IdInput,
	exportsCreate: DocInput,
	exportsUpdate: UpdateDocInput,
	exportsPatch: PatchInput,
	exportsDelete: IdInput,
	exportsClone: CloneInput,
	exportsGetAudit: ResourceAuditInput,
	importsList: ListImportsInput,
	importsGet: IdInput,
	importsCreate: DocInput,
	importsUpdate: UpdateDocInput,
	importsPatch: PatchInput,
	importsDelete: IdInput,
	importsClone: CloneInput,
	importsGetAudit: ResourceAuditInput,
	importsGetDependencies: IdInput,
	importsInvoke: InvokeImportInput,
	flowsList: ListFlowsInput,
	flowsGet: GetFlowInput,
	flowsCreate: DocInput,
	flowsUpdate: UpdateDocInput,
	flowsPatch: PatchInput,
	flowsDelete: IdInput,
	flowsClone: CloneFlowInput,
	flowsGetAudit: ResourceAuditInput,
	flowsGetDependencies: IdInput,
	flowsGetDescendants: IdInput,
	flowsGetLastExportDateTime: IdInput,
	flowsGetLatestJobs: IncludeExcludeIdInput,
	flowsGetTemplate: IdInput,
	integrationsList: ListIntegrationsInput,
	integrationsGet: IdInput,
	integrationsCreate: DocInput,
	integrationsUpdate: UpdateDocInput,
	integrationsPatch: PatchInput,
	integrationsDelete: IdInput,
	integrationsClone: CloneIntegrationInput,
	integrationsGetAudit: ResourceAuditInput,
	integrationsGetDependencies: IdInput,
	integrationsListFlows: ListIntegrationFlowsInput,
	integrationsListExports: LimitIdInput,
	integrationsListImports: LimitIdInput,
	integrationsListConnections: LimitIdInput,
	integrationsListUsers: IdInput,
	integrationsListErrors: IdInput,
	integrationsGetTemplate: IdInput,
	integrationsCreateRevision: CreateRevisionInput,
	integrationsRegisterConnection: IntegrationConnectionInput,
	integrationsRegisterConnections: RegisterConnectionsInput,
	integrationsUnregisterConnection: IntegrationConnectionInput,
	fileDefinitionsList: ListFileDefinitionsInput,
	fileDefinitionsGet: IdInput,
	fileDefinitionsCreate: DocInput,
	iClientsList: PageInput,
	iClientsGet: IdInput,
	iClientsCreate: DocInput,
	iClientsUpdate: UpdateDocInput,
	iClientsPatch: PatchIClientInput,
	iClientsDelete: IdInput,
	jobsList: ListJobsInput,
	jobsGetErrors: IdInput,
	processorsParseCsv: ParseCsvInput,
	processorsParseXml: ParseXmlInput,
	processorsParseStructuredFile: ParseStructuredFileInput,
	processorsGenerateStructuredFile: GenerateStructuredFileInput,
	scriptsGet: IdInput,
	scriptsCreate: ScriptInput,
	scriptsUpdate: UpdateScriptInput,
	scriptsDelete: IdInput,
	scriptsGetLogs: ScriptLogsInput,
	stateList: EmptyInput,
	stateGet: StateKeyInput,
	stateSet: SetStateInput,
	stateDelete: StateKeyInput,
	stateDeleteAll: EmptyInput,
	stateListForResource: ResourceStateInput,
	stateGetForResource: ResourceStateKeyInput,
	stateSetForResource: SetResourceStateInput,
	stateDeleteForResource: ResourceStateKeyInput,
	stateDeleteAllForResource: ResourceStateInput,
	tagsList: PageInput,
	tagsGet: IdInput,
	tagsCreate: TagInput,
	tagsUpdate: UpdateTagInput,
	tagsDelete: IdInput,
	usersList: ListUsersInput,
	usersGet: IdInput,
	usersInvite: InviteUserInput,
	usersInviteMultiple: InviteUsersInput,
	usersUpdate: UpdateUserInput,
	usersDelete: IdInput,
} as const;

export const CeligoEndpointOutputSchemas = {
	accountGetTokenInfo: TokenInfo,
	accountListLicenses: LicenseList,
	auditList: AuditLogList,
	connectionsList: ResourceList,
	connectionsGet: Resource,
	connectionsCreate: Resource,
	connectionsUpdate: Resource,
	connectionsPatch: Success,
	connectionsDelete: Success,
	connectionsPing: PingResult,
	connectionsTestVirtual: PingResult,
	connectionsGetDebugLogs: DebugLogs,
	connectionsGetDependencies: Dependencies,
	connectionsGetAudit: AuditLogList,
	connectionsExecuteVirtualExport: VirtualExportResult,
	connectionsExecuteVirtualExportPaged: VirtualExportPagedResult,
	connectionsExecuteVirtualImport: ImportResultList,
	connectionsEvaluateVirtualImportMap: MappedRecords,
	ediProfilesList: ResourceList,
	errorsList: StepErrors,
	errorsListResolved: ResolvedErrors,
	errorsResolve: Success,
	errorsDeleteResolved: Success,
	errorsRetry: RetryResult,
	errorsAssign: AssignErrorsResult,
	errorsUpdateTags: UpdateErrorTagsResult,
	exportsList: ResourceList,
	exportsGet: Resource,
	exportsCreate: Resource,
	exportsUpdate: Resource,
	exportsPatch: Success,
	exportsDelete: Success,
	exportsClone: CloneResult,
	exportsGetAudit: AuditLogList,
	importsList: ResourceList,
	importsGet: Resource,
	importsCreate: Resource,
	importsUpdate: Resource,
	importsPatch: Success,
	importsDelete: Success,
	importsClone: CloneResult,
	importsGetAudit: AuditLogList,
	importsGetDependencies: Dependencies,
	importsInvoke: ImportResultList,
	flowsList: ResourceList,
	flowsGet: Resource,
	flowsCreate: Resource,
	flowsUpdate: Resource,
	flowsPatch: Success,
	flowsDelete: Success,
	flowsClone: CloneResult,
	flowsGetAudit: AuditLogList,
	flowsGetDependencies: Dependencies,
	flowsGetDescendants: FlowDescendants,
	flowsGetLastExportDateTime: LastExportDateTime,
	flowsGetLatestJobs: JobList,
	flowsGetTemplate: TemplateDownload,
	integrationsList: ResourceList,
	integrationsGet: Resource,
	integrationsCreate: Resource,
	integrationsUpdate: Resource,
	integrationsPatch: Success,
	integrationsDelete: Success,
	integrationsClone: CloneResult,
	integrationsGetAudit: AuditLogList,
	integrationsGetDependencies: Dependencies,
	integrationsListFlows: ResourceList,
	integrationsListExports: ResourceList,
	integrationsListImports: ResourceList,
	integrationsListConnections: ResourceList,
	integrationsListUsers: ResourceList,
	integrationsListErrors: IntegrationErrorList,
	integrationsGetTemplate: TemplateDownload,
	integrationsCreateRevision: Revision,
	integrationsRegisterConnection: Success,
	integrationsRegisterConnections: Success,
	integrationsUnregisterConnection: Success,
	fileDefinitionsList: ResourceList,
	fileDefinitionsGet: Resource,
	fileDefinitionsCreate: Resource,
	iClientsList: ResourceList,
	iClientsGet: Resource,
	iClientsCreate: Resource,
	iClientsUpdate: Resource,
	iClientsPatch: Success,
	iClientsDelete: Success,
	jobsList: JobList,
	jobsGetErrors: JobErrorList,
	processorsParseCsv: ParsedRecords,
	processorsParseXml: ParsedRecords,
	processorsParseStructuredFile: ParsedRecords,
	processorsGenerateStructuredFile: GeneratedFile,
	scriptsGet: Script,
	scriptsCreate: Script,
	scriptsUpdate: Script,
	scriptsDelete: Success,
	scriptsGetLogs: ScriptLogs,
	stateList: StateKeys,
	stateGet: StateValue,
	stateSet: StateWriteResult,
	stateDelete: Success,
	stateDeleteAll: Success,
	stateListForResource: StateKeys,
	stateGetForResource: StateValue,
	stateSetForResource: StateWriteResult,
	stateDeleteForResource: Success,
	stateDeleteAllForResource: Success,
	tagsList: TagList,
	tagsGet: Tag,
	tagsCreate: Tag,
	tagsUpdate: Tag,
	tagsDelete: Success,
	usersList: UserList,
	usersGet: User,
	usersInvite: User,
	usersInviteMultiple: InviteResults,
	usersUpdate: Success,
	usersDelete: Success,
} as const;

export type CeligoEndpointInputs = {
	[K in keyof typeof CeligoEndpointInputSchemas]: z.infer<
		(typeof CeligoEndpointInputSchemas)[K]
	>;
};

export type CeligoEndpointOutputs = {
	[K in keyof typeof CeligoEndpointOutputSchemas]: z.infer<
		(typeof CeligoEndpointOutputSchemas)[K]
	>;
};

export type CeligoResource = z.infer<typeof Resource>;
export type CeligoUser = z.infer<typeof User>;
export type CeligoJob = z.infer<typeof JobList>[number];
export type CeligoAuditLog = z.infer<typeof AuditLogList>[number];
