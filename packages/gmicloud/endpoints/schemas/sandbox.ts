// Generated from the GMI Cloud OpenAPI spec: https://docs.gmicloud.ai/api-spec/sandbox_api.yaml
import { z } from 'zod';

// External lifecycle state.
export const SandboxControlState = z.enum([
	'provisioning',
	'running',
	'checkpointing',
	'updating',
	'failed',
]);

export const SandboxControlSummary = z.object({
	id: z
		.string()
		.optional()
		.describe(
			'Unique sandbox resource ID (UUID), used both in control-plane path parameters and as the billing resource_id.',
		),
	sandbox_key: z
		.string()
		.optional()
		.describe(
			"Data-plane addressing key (an 'i' followed by a 20-character random string).",
		),
	template_id: z.string().optional(),
	idc_name: z.string().optional(),
	state: SandboxControlState.optional(),
	metadata: z.record(z.string(), z.string()).optional(),
	created_at: z.string().optional(),
	running_at: z.string().optional(),
});

export const ListSandboxesControlResponse = z.object({
	request_id: z.string().describe('Request tracing ID'),
	total: z.number().int().describe('Total number of active sandboxes'),
	page: z.number().int(),
	page_size: z.number().int(),
	items: z.array(SandboxControlSummary),
});

export const CreateSandboxControlResult = z.object({
	id: z
		.string()
		.optional()
		.describe(
			'Unique sandbox resource ID (UUID), used both in control-plane path parameters and as the billing resource_id.',
		),
	sandbox_key: z
		.string()
		.optional()
		.describe(
			"Data-plane addressing key (an 'i' followed by a 20-character random string).",
		),
	template_id: z.string().optional().describe('Template ID'),
	domain: z.string().optional().describe('Sandbox data-plane domain.'),
	sandbox_access_token: z
		.string()
		.optional()
		.describe('Sandbox data-plane access token (always issued).'),
	traffic_access_token: z
		.string()
		.optional()
		.describe(
			'Traffic token for non-control ports (issued only when secure=true; sent as the traffic-access-token header).',
		),
});

export const CreateSandboxControlResponse = z.object({
	request_id: z.string().describe('Request tracing ID'),
	data: CreateSandboxControlResult,
});

// Compute resources. Fixed when the Template Build is created and snapshotted at sandbox creation; immutable afterwards, and the create request cannot override them.
export const SandboxResources = z.object({
	vcpu: z.number().int().optional(),
	memory_mb: z.number().int().optional(),
	disk_mb: z.number().int().optional(),
});

// The most recent operation and its outcome.
export const SandboxMutationResult = z.object({
	type: z.enum(['create', 'delete', 'set_timeout']),
	status: z.enum(['pending', 'succeeded', 'failed']),
	error_code: z.string().optional(),
	message: z
		.string()
		.optional()
		.describe('Sanitized failure reason; never contains access tokens'),
	completed_at: z.string().optional(),
});

// Non-empty only when state=failed.
export const SandboxFailure = z.object({
	code: z.string().optional(),
	message: z.string().optional(),
	occurred_at: z.string().optional(),
});

export const SandboxControlDetail = z.object({
	id: z
		.string()
		.optional()
		.describe(
			'Unique sandbox resource ID (UUID), used both in control-plane path parameters and as the billing resource_id.',
		),
	sandbox_key: z
		.string()
		.optional()
		.describe(
			"Data-plane addressing key (an 'i' followed by a 20-character random string).",
		),
	template_id: z.string().optional(),
	idc_name: z.string().optional(),
	state: SandboxControlState.optional(),
	product: z
		.string()
		.optional()
		.describe(
			'Catalog SKU when created from a preset; empty for custom resources.',
		),
	product_name: z
		.string()
		.optional()
		.describe(
			'Preset label when created from a preset; empty for custom resources.',
		),
	resources: SandboxResources.optional(),
	metadata: z
		.record(z.string(), z.string())
		.optional()
		.describe(
			'Customer-defined key/value pairs; the platform does not interpret them.',
		),
	latest_operation: SandboxMutationResult.optional(),
	failure: SandboxFailure.optional(),
	created_at: z
		.string()
		.optional()
		.describe('Time the request was accepted, UTC'),
	running_at: z
		.string()
		.optional()
		.describe(
			'Time the instance was confirmed running; empty string while not yet running',
		),
	started_at: z
		.string()
		.optional()
		.describe('UTC timestamp, e.g. 2026-08-04T09:12:31.123456789Z'),
	end_at: z.string().optional().describe('UTC timestamp; the expiry time'),
	domain: z.string().optional(),
});

export const SandboxControlDetailResponse = z.object({
	request_id: z.string().describe('Request tracing ID'),
	data: SandboxControlDetail,
});

export const SandboxDeleteAcceptedResponse = z.object({
	request_id: z.string(),
	data: z.object({
		id: z.string().optional(),
		state: z.string().optional(),
	}),
});

// Same shape as the creation response: identity and data-plane entry point only — no template alias, no backing node identifiers, no agent version.
export const ConnectSandboxControlResult = z.object({
	id: z
		.string()
		.describe(
			'Unique sandbox resource ID (UUID), used both in control-plane path parameters and as the billing resource_id.',
		),
	sandbox_key: z
		.string()
		.describe(
			"Data-plane addressing key (an 'i' followed by a 20-character random string).",
		),
	template_id: z.string(),
	domain: z
		.string()
		.describe(
			"Sandbox data-plane domain — the host suffix for data-plane endpoints such as '/files' ('https://{sandbox_key}.{domain}').",
		),
	sandbox_access_token: z
		.string()
		.describe('Sandbox data-plane access token (always issued).'),
	traffic_access_token: z
		.string()
		.describe(
			'Traffic token for non-control ports (issued only when secure=true; sent as the traffic-access-token header).',
		),
	end_at: z
		.string()
		.describe(
			'The authoritative expiry time (UTC) as settled by this connect call.',
		),
});

export const ConnectSandboxControlResponse = z.object({
	request_id: z.string().describe('Request tracing ID'),
	data: ConnectSandboxControlResult,
});

export const SetSandboxControlTimeoutResponse = z.object({
	request_id: z.string().describe('Request tracing ID'),
	data: z.object({
		id: z.string().describe('Unique sandbox resource ID.'),
		old_end_at: z
			.string()
			.describe('The expiry time (UTC) before this change.'),
		new_end_at: z
			.string()
			.describe('The expiry time (UTC) in effect after this change.'),
	}),
});

export const EffectiveResources = z.object({
	cpu_count: z.number().int().min(1).describe('Effective integer vCPU count.'),
	memory_mb: z.number().int().min(1).describe('Effective memory size in MiB.'),
	disk_size_mb: z
		.number()
		.int()
		.min(1)
		.describe('Effective boot disk size in MiB.'),
	architecture: z
		.enum(['x86_64', 'arm64'])
		.describe('CPU architecture resolved for the selected IDC.'),
});

// One product catalog entry: identity, display name, externally-visible status and effective resources.
export const ProductCatalogItem = z.object({
	resource_type: z.enum(['sandbox']).describe('Resource type of this entry.'),
	product: z
		.string()
		.describe("Catalog SKU (for example 'gmi.sandbox.x-large')."),
	name: z
		.string()
		.describe(
			"Display name of the product (for sandbox, the preset label such as 'SMALL').",
		),
	status: z
		.enum(['active', 'unavailable'])
		.describe('Externally two-valued status.'),
	resources: EffectiveResources,
});

export const ProductCatalogListResponse = z.object({
	request_id: z.string().describe('HTTP request correlation identifier.'),
	data: z.array(ProductCatalogItem),
});

// Build lineage type.
export const BuildSourceType = z.enum(['image', 'template', 'sandbox']);

// Stable human-readable Sandbox resource specification label.
export const ResourceSpecName = z.enum([
	'X_SMALL',
	'SMALL',
	'MEDIUM',
	'LARGE',
	'X_LARGE',
]);

// Normalized Template Build status.
export const BuildStatus = z.enum(['waiting', 'building', 'ready', 'error']);

export const Template = z.object({
	id: z.string().describe('Immutable Template identifier.'),
	name: z.string().describe('Organization-scoped display name.'),
	description: z
		.string()
		.optional()
		.describe('Human-readable Template description.'),
	idc_name: z.string().describe('Immutable owning IDC identifier.'),
	source_type: BuildSourceType,
	product: z
		.string()
		.nullable()
		.optional()
		.describe(
			'Catalog SKU when created from a preset; null for custom resources.',
		),
	product_name: ResourceSpecName.nullable()
		.optional()
		.describe(
			'Preset label when created from a preset; null for custom resources.',
		),
	resources: EffectiveResources,
	labels: z.record(z.string(), z.string()).optional(),
	current_build_id: z
		.string()
		.nullable()
		.optional()
		.describe('Latest successful Build used to create new Sandboxes.'),
	latest_build_id: z
		.string()
		.describe('Most recently created Build, including a failed Build.'),
	latest_build_status: BuildStatus,
	rebuildable: z
		.boolean()
		.optional()
		.describe('False for snapshot-created Templates.'),
	deleted_at: z
		.string()
		.nullable()
		.optional()
		.describe('Logical deletion time in UTC.'),
	created_at: z.string().describe('Template creation time in UTC.'),
	updated_at: z.string().describe('Template update time in UTC.'),
});

export const TemplatePage = z.object({
	request_id: z.string().describe('HTTP request correlation identifier.'),
	total: z
		.number()
		.int()
		.min(0)
		.describe('Total number of matching Templates.'),
	page: z.number().int().min(1).describe('One-based page number.'),
	page_size: z
		.number()
		.int()
		.min(1)
		.max(100)
		.describe('Requested number of Templates per page.'),
	items: z.array(Template),
});

export const PresetResourceSelection = z.object({
	type: z.enum(['preset']),
	product: z
		.string()
		.describe(
			"Sandbox product specification id (catalog SKU, for example 'gmi.sandbox.x-large').",
		),
});

export const CustomResourceSelection = z.object({
	type: z.enum(['custom']),
	cpu_count: z
		.number()
		.int()
		.min(1)
		.max(16)
		.describe('Requested integer vCPU count.'),
	memory_mb: z
		.number()
		.int()
		.min(1)
		.max(65536)
		.describe('Requested integer memory size in MiB.'),
	disk_size_mb: z
		.number()
		.int()
		.min(1)
		.max(65536)
		.describe('Requested integer boot disk size in MiB.'),
	architecture: z
		.enum(['x86_64', 'arm64'])
		.optional()
		.describe('Requested CPU architecture.'),
});

// Resource values may be selected by catalog product SKU or supplied as a custom configuration.
export const ResourceSelection = z.discriminatedUnion('type', [
	PresetResourceSelection,
	CustomResourceSelection,
]);

export const ImageSource = z.object({
	type: z.enum(['image']),
	image: z
		.string()
		.min(1)
		.describe('Debian or Ubuntu container image reference.'),
});

export const TemplateSource = z.object({
	type: z.enum(['template']),
	template_id: z
		.string()
		.describe('Parent Template identifier in the same IDC.'),
	build_id: z.string().optional().describe('Optional parent Build identifier.'),
});

// Manual Build source. Sandbox sources use the snapshot endpoint.
export const BuildSource = z.discriminatedUnion('type', [
	ImageSource,
	TemplateSource,
]);

export const TemplateMutationAccepted = z.object({
	request_id: z.string().describe('HTTP request correlation identifier.'),
	data: z.object({
		id: z.string().describe('Created Template identifier.'),
		build_id: z
			.string()
			.describe('Created initial or snapshot Build identifier.'),
		status: BuildStatus,
	}),
});

export const TemplateResponse = z.object({
	request_id: z.string().describe('HTTP request correlation identifier.'),
	data: Template,
});

export const TemplateDeletionAccepted = z.object({
	request_id: z.string().describe('Deletion request correlation identifier.'),
	data: z.object({
		id: z.string().describe('Logically deleted Template identifier.'),
		deleted: z
			.literal(true)
			.describe('Confirms that logical deletion is complete.'),
	}),
});

// Operation that created the Build.
export const BuildTrigger = z.enum(['initial_build', 'rebuild', 'snapshot']);

// Build artifact availability independent of Build status.
export const ArtifactState = z.enum([
	'absent',
	'unknown',
	'available',
	'reclaimed',
	'retained',
]);

export const BuildFailure = z
	.object({
		code: z.string().describe('Stable failure code.'),
		message: z.string().describe('Sanitized failure message.'),
	})
	.nullable();

export const TemplateBuild = z.object({
	id: z.string().describe('Immutable Build identifier.'),
	template_id: z.string().describe('Owning Template identifier.'),
	trigger: BuildTrigger,
	status: BuildStatus,
	artifact_state: ArtifactState,
	source_type: BuildSourceType,
	// unknown: the OpenAPI spec types this as a free-form object.
	source: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Sanitized Build lineage.'),
	resources: EffectiveResources,
	product: z
		.string()
		.nullable()
		.optional()
		.describe(
			'Catalog SKU when created from a preset; null for custom resources.',
		),
	product_name: ResourceSpecName.nullable()
		.optional()
		.describe(
			'Preset label when created from a preset; null for custom resources.',
		),
	commands: z.array(z.string()).optional().describe('Build command strings.'),
	start_cmd: z
		.string()
		.nullable()
		.optional()
		.describe('Persisted launch command for this Build.'),
	failure: BuildFailure.optional(),
	created_at: z.string().describe('Build creation time in UTC.'),
	started_at: z
		.string()
		.nullable()
		.optional()
		.describe('Build start time in UTC.'),
	finished_at: z
		.string()
		.nullable()
		.optional()
		.describe('Build terminal time in UTC.'),
});

export const BuildPage = z.object({
	request_id: z.string().describe('HTTP request correlation identifier.'),
	total: z
		.number()
		.int()
		.min(0)
		.describe('Total number of Build attempts for the Template.'),
	page: z.number().int().min(1).describe('One-based page number.'),
	page_size: z
		.number()
		.int()
		.min(1)
		.max(100)
		.describe('Requested number of Builds per page.'),
	items: z.array(TemplateBuild),
});

export const TemplateBuildResponse = z.object({
	request_id: z.string().describe('HTTP request correlation identifier.'),
	data: TemplateBuild,
});

export const BuildLogEntry = z.object({
	offset: z
		.number()
		.int()
		.min(0)
		.describe('Normalized zero-based log entry offset.'),
	timestamp: z
		.string()
		.nullable()
		.optional()
		.describe('Log time in UTC when available.'),
	level: z
		.enum(['debug', 'info', 'warn', 'error'])
		.describe('Normalized log level.'),
	message: z.string().describe('Sanitized log message.'),
});

export const BuildLogPage = z.object({
	entries: z.array(BuildLogEntry),
	next_offset: z
		.number()
		.int()
		.min(0)
		.describe('Offset to use for the next request.'),
	has_more: z
		.boolean()
		.describe('Whether more log entries are currently available.'),
});

export const BuildLogPageResponse = z.object({
	request_id: z.string().describe('HTTP request correlation identifier.'),
	data: BuildLogPage,
});

// Public lifecycle status of a sandbox execution.
export const SandboxExecStatus = z.enum([
	'pending',
	'running',
	'canceling',
	'succeeded',
	'failed',
	'canceled',
]);

export const SandboxExecResultResponse = z.object({
	request_id: z
		.string()
		.optional()
		.describe('Echo of X-Request-ID when supplied.'),
	execution_id: z.string(),
	sandbox_id: z
		.string()
		.describe('Echo of the data-plane addressing key (i.e.'),
	status: SandboxExecStatus,
	exit_code: z
		.number()
		.int()
		.nullable()
		.describe('Process exit code; null while non-terminal or when canceled.'),
	stdout: z
		.string()
		.nullable()
		.describe('Captured standard output, or null while not yet available.'),
	stderr: z
		.string()
		.nullable()
		.describe('Captured standard error, or null while not yet available.'),
	stdout_truncated: z.boolean().nullable(),
	stderr_truncated: z.boolean().nullable(),
	started_at: z.string().nullable(),
	completed_at: z.string().nullable(),
});

export const SandboxExecAcceptedResponse = z.object({
	request_id: z
		.string()
		.optional()
		.describe('Echo of X-Request-ID when supplied.'),
	execution_id: z.string().describe('Public execution identifier.'),
	sandbox_id: z
		.string()
		.describe('Echo of the data-plane addressing key (i.e.'),
	status: SandboxExecStatus,
});

// Result entry for a single write.
export const SandboxFileEntry = z.object({
	path: z.string().describe('Absolute path of the file inside the sandbox'),
	name: z.string().describe("File name (the last segment of 'path')"),
	type: z
		.enum(['file'])
		.describe(
			"Entry type. Only files are written today, so this is always 'file'.",
		),
});
