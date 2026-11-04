import { z } from 'zod';
import * as Compute from './schemas/compute';
import * as Iam from './schemas/iam';
import * as Idc from './schemas/idc';
import * as Inference from './schemas/inference';
import * as Sandbox from './schemas/sandbox';

const ApiKeysGetCurrentInputSchema = z.object({});
const ApiKeysGetCurrentResponseSchema = Iam.VerifyAPIKeyResponse;

const IdcsListInputSchema = z.object({});
const IdcsListResponseSchema = Idc.ListIDCsResponse;

const BaremetalsListInputSchema = z.object({
	idc: Compute.IdcName.optional(),
});
const BaremetalsListResponseSchema = z.array(Compute.BaremetalResp);

const BaremetalsCreateInputSchema = z.object({
	count: z.number().int().min(1),
	enableZabbixAgent: z
		.boolean()
		.optional()
		.describe('Whether to enable Zabbix agent on the baremetal node'),
	idc: Compute.IdcName,
	imageId: z
		.string()
		.describe('The ID of the image to use for creating the baremetal instance'),
	internalIp: z
		.string()
		.min(7)
		.max(15)
		.optional()
		.describe('Manually allocate internal IP address(IPv4 only).'),
	name: Compute.Name,
	product: Compute.ProductName,
	sshKey: z.string().min(1).optional(),
	sshKeyIdList: Compute.UuidList.optional().describe(
		'The list of SSH key IDs to use for creating the baremetal instance',
	),
});
const BaremetalsCreateResponseSchema = z.array(Compute.UuidObject);

const BaremetalsGetInputSchema = z.object({
	id: z.string().min(1),
});
const BaremetalsGetResponseSchema = Compute.BaremetalResp;

const BaremetalsUpdateInputSchema = z.object({
	id: z.string().min(1),
	name: z.string(),
});
const BaremetalsUpdateResponseSchema = Compute.BaremetalResp;

const BaremetalsDeleteInputSchema = z.object({
	id: z.string().min(1),
});
const BaremetalsDeleteResponseSchema = z.object({
	result: z.string(),
});

const BaremetalsActionInputSchema = z.object({
	id: z.string().min(1),
	type: z.enum(['start', 'stop', 'powercycle', 'reboot']),
});
const BaremetalsActionResponseSchema = z.object({
	result: z.string(),
});

const BaremetalsListProductsInputSchema = z.object({
	idc: Compute.IdcName.optional(),
});
const BaremetalsListProductsResponseSchema = z.array(Compute.Product);

const ContainersListInputSchema = z.object({});
const ContainersListResponseSchema = z.array(Compute.ContainersResp);

const ContainersCreateInputSchema = z.object({
	count: z.number().int().min(1),
	idc: Compute.IdcName,
	product: Compute.ProductName,
	args: z
		.array(z.string())
		.optional()
		.describe('Optional container command arguments'),
	command: z.string().optional().describe('Optional container start command'),
	envs: z.array(Compute.Env).optional(),
	name: Compute.Name,
	ports: z.array(Compute.ExposedPort).optional(),
	sshKeyIdList: Compute.UuidList.optional().describe(
		'The list of SSH key IDs to use in the container',
	),
	templateId: z.string().describe('template id'),
});
const ContainersCreateResponseSchema = z.array(Compute.UuidObject);

const ContainersGetInputSchema = z.object({
	id: z.string().min(1),
});
const ContainersGetResponseSchema = Compute.ContainersResp;

const ContainersUpdateInputSchema = z.object({
	id: z.string().min(1),
	args: z
		.array(z.string())
		.optional()
		.describe('Optional container command arguments'),
	command: z.string().optional().describe('Optional container start command'),
	envs: z.array(Compute.Env).optional(),
	name: Compute.Name,
	ports: z.array(Compute.ExposedPort).optional(),
	sshKeyIdList: Compute.UuidList.optional().describe(
		'The list of SSH key IDs to use in the container',
	),
	templateId: z.string().describe('template id'),
});
const ContainersUpdateResponseSchema = z.object({
	id: z.string().optional(),
});

const ContainersDeleteInputSchema = z.object({
	id: z.string().min(1),
});
const ContainersDeleteResponseSchema = z.object({
	result: z.string(),
});

const ContainersGetLogsInputSchema = z.object({
	id: z.string().min(1),
});
const ContainersGetLogsResponseSchema = z.object({ text: z.string() });

const ContainersRestartInputSchema = z.object({
	id: z.string().min(1),
});
const ContainersRestartResponseSchema = z.object({
	result: z.string(),
});

const ContainersCreateShellInputSchema = z.object({
	id: z.string().min(1),
});
const ContainersCreateShellResponseSchema = z.object({
	urlPath: z.string(),
});

const ContainersListProductsInputSchema = z.object({
	idc: Compute.IdcName.optional(),
});
const ContainersListProductsResponseSchema = z.array(Compute.Product);

const ElasticIpsListInputSchema = z.object({});
const ElasticIpsListResponseSchema = z.array(Compute.ElasticIPResp);

const ElasticIpsAllocateInputSchema = z.object({
	count: z.number().int().min(1),
	idc: Compute.IdcName,
	name: Compute.Name.describe('Name of the elastic IP'),
	product: Compute.ProductName,
});
const ElasticIpsAllocateResponseSchema = z.array(Compute.UuidObject);

const ElasticIpsGetInputSchema = z.object({
	id: z.string().min(1),
});
const ElasticIpsGetResponseSchema = Compute.ElasticIPResp;

const ElasticIpsReleaseInputSchema = z.object({
	id: z.string().min(1),
});
const ElasticIpsReleaseResponseSchema = z.object({
	result: z.string(),
});

const ElasticIpsAssociateInputSchema = z.object({
	id: z.string().min(1),
	instanceID: z
		.string()
		.nullable()
		.optional()
		.describe(
			'set instanceID and instanceType to associate the elastic IP to the instance, set to null to disassociate the elastic IP from the instance',
		),
	instanceType: Compute.InstanceType.optional(),
});
const ElasticIpsAssociateResponseSchema = z.object({
	result: z.string(),
});

const ElasticIpsDisassociateInputSchema = z.object({
	id: z.string().min(1),
});
const ElasticIpsDisassociateResponseSchema = z.object({
	result: z.string(),
});

const ElasticIpsListProductsInputSchema = z.object({
	idc: Compute.IdcName.optional(),
});
const ElasticIpsListProductsResponseSchema = z.array(Compute.Product);

const FirewallsListInputSchema = z.object({
	idc: Compute.IdcName.optional(),
});
const FirewallsListResponseSchema = z.array(Compute.FirewallResp);

const FirewallsCreateInputSchema = z.object({
	description: z.string().max(255).optional(),
	inboundRules: Compute.FirewallRules,
	name: z.string().max(255),
	idc: Compute.IdcName,
});
const FirewallsCreateResponseSchema = Compute.FirewallResp;

const FirewallsGetInputSchema = z.object({
	id: z.string().min(1),
});
const FirewallsGetResponseSchema = Compute.FirewallResp;

const FirewallsUpdateInputSchema = z.object({
	id: z.string().min(1),
	description: z.string().max(255).optional(),
	inboundRules: Compute.FirewallRules,
	name: z.string().max(255),
});
const FirewallsUpdateResponseSchema = Compute.FirewallResp;

const FirewallsDeleteInputSchema = z.object({
	id: z.string().min(1),
});
const FirewallsDeleteResponseSchema = z.object({
	result: z.string(),
});

const FirewallsAssociateInputSchema = z.object({
	id: z.string().min(1),
	instances: Compute.UuidList,
	instanceType: z.enum(['baremetal', 'container']).optional(),
});
const FirewallsAssociateResponseSchema = z.object({
	result: z.string(),
});

const FirewallsDisassociateInputSchema = z.object({
	id: z.string().min(1),
	instances: Compute.UuidList,
	instanceType: z.enum(['baremetal', 'container']).optional(),
});
const FirewallsDisassociateResponseSchema = z.object({
	result: z.string(),
});

const ImagesListInputSchema = z.object({
	idc: Compute.IdcName.optional(),
	product: Compute.ProductName.optional(),
});
const ImagesListResponseSchema = z.array(Compute.ImageResp);

const ImagesGetInputSchema = z.object({
	id: z.string().min(1),
});
const ImagesGetResponseSchema = Compute.ImageResp;

const TemplatesListInputSchema = z.object({});
const TemplatesListResponseSchema = z.array(Compute.TemplateResp);

const TemplatesCreateInputSchema = z.object({
	credential: Compute.Credential.optional(),
	description: z.string().min(0).max(4096).optional(),
	name: Compute.Name,
	path: z.string().max(253).regex(/^\S+$/),
	status: z.enum(['draft', 'published', 'unpublished']).optional(),
});
const TemplatesCreateResponseSchema = z.object({
	id: z.string().optional(),
});

const TemplatesGetInputSchema = z.object({
	id: z.string().min(1),
});
const TemplatesGetResponseSchema = Compute.TemplateResp;

const TemplatesUpdateInputSchema = z.object({
	id: z.string().min(1),
	credential: Compute.Credential.optional(),
	description: z.string().min(0).max(4096).optional(),
	name: Compute.Name,
	path: z.string().max(253).regex(/^\S+$/),
	status: z.enum(['draft', 'published', 'unpublished']).optional(),
});
const TemplatesUpdateResponseSchema = z.object({
	modified: z.string().optional(),
});

const TemplatesDeleteInputSchema = z.object({
	id: z.string().min(1),
});
const TemplatesDeleteResponseSchema = z.object({
	result: z.string(),
});

const VpcsListInputSchema = z.object({
	idc: Compute.IdcName.optional(),
});
const VpcsListResponseSchema = z.array(Compute.Vpc);

const VpcsAllocateInputSchema = z.object({
	idc: Compute.IdcName,
});
const VpcsAllocateResponseSchema = Compute.Vpc;

const VpcsGetInputSchema = z.object({
	id: z.string().min(1),
});
const VpcsGetResponseSchema = Compute.Vpc;

const VpcsReleaseInputSchema = z.object({
	id: z.string().min(1),
});
const VpcsReleaseResponseSchema = z.object({
	result: z.string(),
});

const SandboxesListInputSchema = z.object({
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page number, starting from 1; default 1'),
	page_size: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Items per page; default 20, maximum 100'),
	idc_name: z.string().optional().describe('Filter by data center name, e.g.'),
	state: z
		.array(z.enum(['provisioning', 'running', 'failed']))
		.optional()
		.describe('Filter by external state.'),
	metadata: z
		.record(z.string(), z.string())
		.optional()
		.describe('Filter by customer metadata key/value, e.g.'),
});
const SandboxesListResponseSchema = Sandbox.ListSandboxesControlResponse;

const SandboxesCreateInputSchema = z.object({
	idempotency_key: z
		.string()
		.min(1)
		.max(64)
		.optional()
		.describe(
			'Optional caller-generated idempotency key (a UUID is recommended).',
		),
	template_id: z.string().describe('Template identifier or name.'),
	idc_name: z.string().optional().describe('Target data center name, e.g.'),
	timeout: z.number().int().optional().describe('Time-to-live in seconds.'),
	env_vars: z.record(z.string(), z.string()).optional(),
	metadata: z
		.record(z.string(), z.string())
		.optional()
		.describe(
			'Customer-defined key/value pairs; the platform does not interpret them.',
		),
});
const SandboxesCreateResponseSchema = Sandbox.CreateSandboxControlResponse;

const SandboxesGetInputSchema = z.object({
	id: z
		.string()
		.min(1)
		.describe(
			"Unique sandbox resource ID (UUID; the 'id' field of the create response).",
		),
});
const SandboxesGetResponseSchema = Sandbox.SandboxControlDetailResponse;

const SandboxesUpdateMetadataInputSchema = z.object({
	id: z
		.string()
		.min(1)
		.describe(
			"Unique sandbox resource ID (UUID; the 'id' field of the create response).",
		),
	metadata: z
		.record(z.string(), z.string())
		.describe('Customer metadata, replaced as a whole.'),
});
const SandboxesUpdateMetadataResponseSchema =
	Sandbox.SandboxControlDetailResponse;

const SandboxesDeleteInputSchema = z.object({
	id: z
		.string()
		.min(1)
		.describe(
			"Unique sandbox resource ID (UUID; the 'id' field of the create response).",
		),
});
const SandboxesDeleteResponseSchema = Sandbox.SandboxDeleteAcceptedResponse;

const SandboxesConnectInputSchema = z.object({
	id: z
		.string()
		.min(1)
		.describe(
			"Unique sandbox resource ID (UUID; the 'id' field of the create response).",
		),
	timeout: z
		.number()
		.int()
		.optional()
		.describe(
			'When greater than 0, extends the lifetime of a running sandbox (extend-only, never shortens).',
		),
});
const SandboxesConnectResponseSchema = Sandbox.ConnectSandboxControlResponse;

const SandboxesSetTimeoutInputSchema = z.object({
	id: z
		.string()
		.min(1)
		.describe(
			"Unique sandbox resource ID (UUID; the 'id' field of the create response).",
		),
	timeout: z
		.number()
		.int()
		.optional()
		.describe('Time-to-live in seconds, measured from the current time.'),
});
const SandboxesSetTimeoutResponseSchema =
	Sandbox.SetSandboxControlTimeoutResponse;

const SandboxProductsListInputSchema = z.object({
	idc_name: z
		.string()
		.describe('IDC identifier used for capability and resource resolution.'),
	resource_type: z
		.enum(['sandbox'])
		.optional()
		.describe('Resource type to list.'),
	include_unavailable: z
		.boolean()
		.optional()
		.describe("Include products whose status is 'unavailable'."),
});
const SandboxProductsListResponseSchema = Sandbox.ProductCatalogListResponse;

const SandboxTemplatesListInputSchema = z.object({
	idc_name: z.string().optional().describe('Filter by data center name, e.g.'),
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page number, starting from 1; default 1'),
	page_size: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Items per page; default 20, maximum 100'),
});
const SandboxTemplatesListResponseSchema = Sandbox.TemplatePage;

const SandboxTemplatesCreateInputSchema = z.object({
	idempotency_key: z
		.string()
		.min(1)
		.max(64)
		.describe(
			'Caller-generated key that makes the mutation safe to retry (a UUID is recommended).',
		),
	name: z
		.string()
		.min(1)
		.max(64)
		.regex(/^[A-Za-z0-9_-]+$/)
		.describe('Organization-scoped Template display name.'),
	description: z
		.string()
		.max(256)
		.optional()
		.describe('Human-readable Template description.'),
	idc_name: z
		.string()
		.optional()
		.describe('IDC that permanently owns the Template.'),
	resources: Sandbox.ResourceSelection,
	labels: z
		.record(z.string(), z.string().max(256))
		.optional()
		.describe('User-defined labels used for filtering.'),
	build: z
		.object({
			source: Sandbox.BuildSource,
			commands: z
				.array(z.string().min(1).max(8192))
				.max(100)
				.optional()
				.describe(
					'Shell command strings executed sequentially during the Build.',
				),
			envs: z
				.record(z.string(), z.string().max(32768))
				.optional()
				.describe(
					'Environment variables available only during the Template Build.',
				),
			start_cmd: z
				.string()
				.min(1)
				.max(8192)
				.optional()
				.describe(
					'Launch command persisted with the Build and applied when Sandboxes created from this Template start.',
				),
		})
		.optional()
		.describe(
			'Initial Build definition created and started with the Template (combined flow, every IDC supports it).',
		),
});
const SandboxTemplatesCreateResponseSchema = Sandbox.TemplateMutationAccepted;

const SandboxTemplatesGetInputSchema = z.object({
	id: z.string().min(1).describe('Template identifier.'),
	idc_name: z.string().optional().describe('Filter by data center name, e.g.'),
});
const SandboxTemplatesGetResponseSchema = Sandbox.TemplateResponse;

const SandboxTemplatesUpdateInputSchema = z.object({
	id: z.string().min(1).describe('Template identifier.'),
	idc_name: z.string().optional().describe('Filter by data center name, e.g.'),
	name: z
		.string()
		.min(1)
		.max(64)
		.regex(/^[A-Za-z0-9_-]+$/)
		.optional()
		.describe('New organization-scoped display name.'),
	description: z
		.string()
		.max(256)
		.optional()
		.describe('New human-readable description.'),
	labels: z
		.record(z.string(), z.string().max(256))
		.optional()
		.describe('Complete replacement of user-defined labels.'),
});
const SandboxTemplatesUpdateResponseSchema = Sandbox.TemplateResponse;

const SandboxTemplatesDeleteInputSchema = z.object({
	id: z.string().min(1).describe('Template identifier.'),
	idc_name: z.string().optional().describe('Filter by data center name, e.g.'),
});
const SandboxTemplatesDeleteResponseSchema = Sandbox.TemplateDeletionAccepted;

const SandboxTemplatesListBuildsInputSchema = z.object({
	template_id: z.string().min(1).describe('Owning Template identifier.'),
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page number, starting from 1; default 1'),
	page_size: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Items per page; default 20, maximum 100'),
});
const SandboxTemplatesListBuildsResponseSchema = Sandbox.BuildPage;

const SandboxTemplatesGetBuildInputSchema = z.object({
	template_id: z.string().min(1).describe('Owning Template identifier.'),
	id: z.string().min(1).describe('Template Build identifier.'),
});
const SandboxTemplatesGetBuildResponseSchema = Sandbox.TemplateBuildResponse;

const SandboxTemplatesGetBuildLogsInputSchema = z.object({
	template_id: z.string().min(1).describe('Owning Template identifier.'),
	id: z.string().min(1).describe('Template Build identifier.'),
	offset: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Zero-based normalized log entry offset.'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Maximum number of log entries to return.'),
	level: z
		.enum(['debug', 'info', 'warn', 'error'])
		.optional()
		.describe('Optional normalized log level filter.'),
});
const SandboxTemplatesGetBuildLogsResponseSchema = Sandbox.BuildLogPageResponse;

const SandboxExecRunInputSchema = z.object({
	sandbox_key: z
		.string()
		.regex(/^[A-Za-z0-9-]+$/)
		.describe('sandbox_key returned by sandboxes.create or sandboxes.connect'),
	domain: z
		.string()
		.regex(/^[A-Za-z0-9.-]+$/)
		.describe('domain returned by sandboxes.create or sandboxes.connect'),
	access_token: z
		.string()
		.min(1)
		.describe(
			'sandbox_access_token returned by sandboxes.create or sandboxes.connect',
		),
	request_id: z
		.string()
		.min(1)
		.max(128)
		.optional()
		.describe(
			'Optional request correlation identifier echoed in the response.',
		),
	wait: z
		.boolean()
		.optional()
		.describe('Wait for a terminal result before responding.'),
	wait_timeout_seconds: z
		.number()
		.int()
		.min(1)
		.max(25)
		.optional()
		.describe("Maximum time to wait when 'wait=true', in seconds."),
	action: z.literal('exec').default('exec'),
	parameters: z.object({
		command: z.string().describe('Shell command to execute.'),
		envs: z
			.record(z.string(), z.string())
			.optional()
			.describe('Environment variables for the command.'),
		cwd: z.string().optional().describe('Absolute working directory.'),
	}),
});
const SandboxExecRunResponseSchema = z.union([
	Sandbox.SandboxExecResultResponse,
	Sandbox.SandboxExecAcceptedResponse,
]);

const SandboxExecGetInputSchema = z.object({
	sandbox_key: z
		.string()
		.regex(/^[A-Za-z0-9-]+$/)
		.describe('sandbox_key returned by sandboxes.create or sandboxes.connect'),
	domain: z
		.string()
		.regex(/^[A-Za-z0-9.-]+$/)
		.describe('domain returned by sandboxes.create or sandboxes.connect'),
	access_token: z
		.string()
		.min(1)
		.describe(
			'sandbox_access_token returned by sandboxes.create or sandboxes.connect',
		),
	execution_id: z
		.string()
		.min(1)
		.describe('Public execution identifier returned by the create operation.'),
	request_id: z
		.string()
		.min(1)
		.max(128)
		.optional()
		.describe(
			'Optional request correlation identifier echoed in the response.',
		),
});
const SandboxExecGetResponseSchema = Sandbox.SandboxExecResultResponse;

const SandboxExecCancelInputSchema = z.object({
	sandbox_key: z
		.string()
		.regex(/^[A-Za-z0-9-]+$/)
		.describe('sandbox_key returned by sandboxes.create or sandboxes.connect'),
	domain: z
		.string()
		.regex(/^[A-Za-z0-9.-]+$/)
		.describe('domain returned by sandboxes.create or sandboxes.connect'),
	access_token: z
		.string()
		.min(1)
		.describe(
			'sandbox_access_token returned by sandboxes.create or sandboxes.connect',
		),
	execution_id: z
		.string()
		.min(1)
		.describe('Public execution identifier returned by the create operation.'),
	request_id: z
		.string()
		.min(1)
		.max(128)
		.optional()
		.describe(
			'Optional request correlation identifier echoed in the response.',
		),
});
const SandboxExecCancelResponseSchema = z.union([
	Sandbox.SandboxExecResultResponse,
	Sandbox.SandboxExecAcceptedResponse,
]);

const SandboxFilesDownloadInputSchema = z.object({
	sandbox_key: z
		.string()
		.regex(/^[A-Za-z0-9-]+$/)
		.describe('sandbox_key returned by sandboxes.create or sandboxes.connect'),
	domain: z
		.string()
		.regex(/^[A-Za-z0-9.-]+$/)
		.describe('domain returned by sandboxes.create or sandboxes.connect'),
	access_token: z
		.string()
		.min(1)
		.describe(
			'sandbox_access_token returned by sandboxes.create or sandboxes.connect',
		),
	path: z.string().min(1).describe('**Absolute path** inside the sandbox.'),
	username: z
		.string()
		.optional()
		.describe(
			"Perform the file operation as this user; defaults to the sandbox's default user.",
		),
	range: z
		.string()
		.optional()
		.describe(
			"Only honored in data centers with 'Accept-Ranges: bytes'; format 'bytes=<start>-<end>'.",
		),
});
const SandboxFilesDownloadResponseSchema = z.object({
	path: z.string(),
	contentType: z.string(),
	size: z.number().int(),
	contentBase64: z.string(),
});

const SandboxFilesUploadInputSchema = z.object({
	sandbox_key: z
		.string()
		.regex(/^[A-Za-z0-9-]+$/)
		.describe('sandbox_key returned by sandboxes.create or sandboxes.connect'),
	domain: z
		.string()
		.regex(/^[A-Za-z0-9.-]+$/)
		.describe('domain returned by sandboxes.create or sandboxes.connect'),
	access_token: z
		.string()
		.min(1)
		.describe(
			'sandbox_access_token returned by sandboxes.create or sandboxes.connect',
		),
	path: z.string().min(1).describe('**Absolute path** inside the sandbox.'),
	username: z
		.string()
		.optional()
		.describe(
			"Perform the file operation as this user; defaults to the sandbox's default user.",
		),
	content: z
		.string()
		.describe('File content, as UTF-8 text or base64 (see encoding)'),
	encoding: z.enum(['utf8', 'base64']).default('utf8'),
});
const SandboxFilesUploadResponseSchema = z.array(Sandbox.SandboxFileEntry);

export const GmicloudEndpointInputSchemas = {
	modelsList: Inference.ModelsListInputSchema,
	chatCreateCompletion: Inference.ChatCreateCompletionInputSchema,
	routerAutoroute: Inference.RouterAutorouteInputSchema,
	mediaModelsList: Inference.MediaModelsListInputSchema,
	mediaModelsGet: Inference.MediaModelsGetInputSchema,
	mediaRequestsCreate: Inference.MediaRequestsCreateInputSchema,
	mediaRequestsGet: Inference.MediaRequestsGetInputSchema,
	uploadsCreateUrl: Inference.UploadsCreateUrlInputSchema,
	apiKeysGetCurrent: ApiKeysGetCurrentInputSchema,
	idcsList: IdcsListInputSchema,
	baremetalsList: BaremetalsListInputSchema,
	baremetalsCreate: BaremetalsCreateInputSchema,
	baremetalsGet: BaremetalsGetInputSchema,
	baremetalsUpdate: BaremetalsUpdateInputSchema,
	baremetalsDelete: BaremetalsDeleteInputSchema,
	baremetalsAction: BaremetalsActionInputSchema,
	baremetalsListProducts: BaremetalsListProductsInputSchema,
	containersList: ContainersListInputSchema,
	containersCreate: ContainersCreateInputSchema,
	containersGet: ContainersGetInputSchema,
	containersUpdate: ContainersUpdateInputSchema,
	containersDelete: ContainersDeleteInputSchema,
	containersGetLogs: ContainersGetLogsInputSchema,
	containersRestart: ContainersRestartInputSchema,
	containersCreateShell: ContainersCreateShellInputSchema,
	containersListProducts: ContainersListProductsInputSchema,
	elasticIpsList: ElasticIpsListInputSchema,
	elasticIpsAllocate: ElasticIpsAllocateInputSchema,
	elasticIpsGet: ElasticIpsGetInputSchema,
	elasticIpsRelease: ElasticIpsReleaseInputSchema,
	elasticIpsAssociate: ElasticIpsAssociateInputSchema,
	elasticIpsDisassociate: ElasticIpsDisassociateInputSchema,
	elasticIpsListProducts: ElasticIpsListProductsInputSchema,
	firewallsList: FirewallsListInputSchema,
	firewallsCreate: FirewallsCreateInputSchema,
	firewallsGet: FirewallsGetInputSchema,
	firewallsUpdate: FirewallsUpdateInputSchema,
	firewallsDelete: FirewallsDeleteInputSchema,
	firewallsAssociate: FirewallsAssociateInputSchema,
	firewallsDisassociate: FirewallsDisassociateInputSchema,
	imagesList: ImagesListInputSchema,
	imagesGet: ImagesGetInputSchema,
	templatesList: TemplatesListInputSchema,
	templatesCreate: TemplatesCreateInputSchema,
	templatesGet: TemplatesGetInputSchema,
	templatesUpdate: TemplatesUpdateInputSchema,
	templatesDelete: TemplatesDeleteInputSchema,
	vpcsList: VpcsListInputSchema,
	vpcsAllocate: VpcsAllocateInputSchema,
	vpcsGet: VpcsGetInputSchema,
	vpcsRelease: VpcsReleaseInputSchema,
	sandboxesList: SandboxesListInputSchema,
	sandboxesCreate: SandboxesCreateInputSchema,
	sandboxesGet: SandboxesGetInputSchema,
	sandboxesUpdateMetadata: SandboxesUpdateMetadataInputSchema,
	sandboxesDelete: SandboxesDeleteInputSchema,
	sandboxesConnect: SandboxesConnectInputSchema,
	sandboxesSetTimeout: SandboxesSetTimeoutInputSchema,
	sandboxProductsList: SandboxProductsListInputSchema,
	sandboxTemplatesList: SandboxTemplatesListInputSchema,
	sandboxTemplatesCreate: SandboxTemplatesCreateInputSchema,
	sandboxTemplatesGet: SandboxTemplatesGetInputSchema,
	sandboxTemplatesUpdate: SandboxTemplatesUpdateInputSchema,
	sandboxTemplatesDelete: SandboxTemplatesDeleteInputSchema,
	sandboxTemplatesListBuilds: SandboxTemplatesListBuildsInputSchema,
	sandboxTemplatesGetBuild: SandboxTemplatesGetBuildInputSchema,
	sandboxTemplatesGetBuildLogs: SandboxTemplatesGetBuildLogsInputSchema,
	sandboxExecRun: SandboxExecRunInputSchema,
	sandboxExecGet: SandboxExecGetInputSchema,
	sandboxExecCancel: SandboxExecCancelInputSchema,
	sandboxFilesDownload: SandboxFilesDownloadInputSchema,
	sandboxFilesUpload: SandboxFilesUploadInputSchema,
} as const;

export const GmicloudEndpointOutputSchemas = {
	modelsList: Inference.ModelsListResponseSchema,
	chatCreateCompletion: Inference.ChatCreateCompletionResponseSchema,
	routerAutoroute: Inference.RouterAutorouteResponseSchema,
	mediaModelsList: Inference.MediaModelsListResponseSchema,
	mediaModelsGet: Inference.MediaModelsGetResponseSchema,
	mediaRequestsCreate: Inference.MediaRequestsCreateResponseSchema,
	mediaRequestsGet: Inference.MediaRequestsGetResponseSchema,
	uploadsCreateUrl: Inference.UploadsCreateUrlResponseSchema,
	apiKeysGetCurrent: ApiKeysGetCurrentResponseSchema,
	idcsList: IdcsListResponseSchema,
	baremetalsList: BaremetalsListResponseSchema,
	baremetalsCreate: BaremetalsCreateResponseSchema,
	baremetalsGet: BaremetalsGetResponseSchema,
	baremetalsUpdate: BaremetalsUpdateResponseSchema,
	baremetalsDelete: BaremetalsDeleteResponseSchema,
	baremetalsAction: BaremetalsActionResponseSchema,
	baremetalsListProducts: BaremetalsListProductsResponseSchema,
	containersList: ContainersListResponseSchema,
	containersCreate: ContainersCreateResponseSchema,
	containersGet: ContainersGetResponseSchema,
	containersUpdate: ContainersUpdateResponseSchema,
	containersDelete: ContainersDeleteResponseSchema,
	containersGetLogs: ContainersGetLogsResponseSchema,
	containersRestart: ContainersRestartResponseSchema,
	containersCreateShell: ContainersCreateShellResponseSchema,
	containersListProducts: ContainersListProductsResponseSchema,
	elasticIpsList: ElasticIpsListResponseSchema,
	elasticIpsAllocate: ElasticIpsAllocateResponseSchema,
	elasticIpsGet: ElasticIpsGetResponseSchema,
	elasticIpsRelease: ElasticIpsReleaseResponseSchema,
	elasticIpsAssociate: ElasticIpsAssociateResponseSchema,
	elasticIpsDisassociate: ElasticIpsDisassociateResponseSchema,
	elasticIpsListProducts: ElasticIpsListProductsResponseSchema,
	firewallsList: FirewallsListResponseSchema,
	firewallsCreate: FirewallsCreateResponseSchema,
	firewallsGet: FirewallsGetResponseSchema,
	firewallsUpdate: FirewallsUpdateResponseSchema,
	firewallsDelete: FirewallsDeleteResponseSchema,
	firewallsAssociate: FirewallsAssociateResponseSchema,
	firewallsDisassociate: FirewallsDisassociateResponseSchema,
	imagesList: ImagesListResponseSchema,
	imagesGet: ImagesGetResponseSchema,
	templatesList: TemplatesListResponseSchema,
	templatesCreate: TemplatesCreateResponseSchema,
	templatesGet: TemplatesGetResponseSchema,
	templatesUpdate: TemplatesUpdateResponseSchema,
	templatesDelete: TemplatesDeleteResponseSchema,
	vpcsList: VpcsListResponseSchema,
	vpcsAllocate: VpcsAllocateResponseSchema,
	vpcsGet: VpcsGetResponseSchema,
	vpcsRelease: VpcsReleaseResponseSchema,
	sandboxesList: SandboxesListResponseSchema,
	sandboxesCreate: SandboxesCreateResponseSchema,
	sandboxesGet: SandboxesGetResponseSchema,
	sandboxesUpdateMetadata: SandboxesUpdateMetadataResponseSchema,
	sandboxesDelete: SandboxesDeleteResponseSchema,
	sandboxesConnect: SandboxesConnectResponseSchema,
	sandboxesSetTimeout: SandboxesSetTimeoutResponseSchema,
	sandboxProductsList: SandboxProductsListResponseSchema,
	sandboxTemplatesList: SandboxTemplatesListResponseSchema,
	sandboxTemplatesCreate: SandboxTemplatesCreateResponseSchema,
	sandboxTemplatesGet: SandboxTemplatesGetResponseSchema,
	sandboxTemplatesUpdate: SandboxTemplatesUpdateResponseSchema,
	sandboxTemplatesDelete: SandboxTemplatesDeleteResponseSchema,
	sandboxTemplatesListBuilds: SandboxTemplatesListBuildsResponseSchema,
	sandboxTemplatesGetBuild: SandboxTemplatesGetBuildResponseSchema,
	sandboxTemplatesGetBuildLogs: SandboxTemplatesGetBuildLogsResponseSchema,
	sandboxExecRun: SandboxExecRunResponseSchema,
	sandboxExecGet: SandboxExecGetResponseSchema,
	sandboxExecCancel: SandboxExecCancelResponseSchema,
	sandboxFilesDownload: SandboxFilesDownloadResponseSchema,
	sandboxFilesUpload: SandboxFilesUploadResponseSchema,
} as const;

export type GmicloudEndpointInputs = {
	[K in keyof typeof GmicloudEndpointInputSchemas]: z.input<
		(typeof GmicloudEndpointInputSchemas)[K]
	>;
};

export type GmicloudEndpointOutputs = {
	[K in keyof typeof GmicloudEndpointOutputSchemas]: z.infer<
		(typeof GmicloudEndpointOutputSchemas)[K]
	>;
};
