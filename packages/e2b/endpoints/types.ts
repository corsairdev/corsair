import { z } from 'zod';

// Schemas are generated from E2B's official OpenAPI contract; object inputs reject undocumented keys.
const C_CPUCountInputSchema = z.number().int().min(1);
const C_SandboxAutoResumeEnabledInputSchema = z.boolean();
const C_SandboxAutoResumeConfigInputSchema = z
	.object({ enabled: C_SandboxAutoResumeEnabledInputSchema })
	.strict();
const C_SandboxEgressProxyTLSConfigInputSchema = z
	.object({
		enabled: z.boolean(),
		serverName: z.string().max(253).optional(),
		caCert: z.string().max(8192).optional(),
	})
	.strict()
	.nullable();
const C_SandboxEgressProxyConfigInputSchema = z
	.object({
		address: z.string(),
		username: z.string().max(255).optional(),
		password: z.string().max(255).optional(),
		tls: C_SandboxEgressProxyTLSConfigInputSchema.optional(),
	})
	.strict()
	.nullable();
const C_SandboxNetworkTransformInputSchema = z
	.object({ headers: z.object({}).catchall(z.string()).optional() })
	.strict();
const C_SandboxNetworkRuleInputSchema = z
	.object({ transform: C_SandboxNetworkTransformInputSchema.optional() })
	.strict();
const C_SandboxNetworkConfigInputSchema = z
	.object({
		allowPublicTraffic: z.boolean().nullable().optional(),
		allowOut: z.array(z.string()).optional(),
		denyOut: z.array(z.string()).optional(),
		dnsServers: z.array(z.string()).max(10).optional(),
		egressProxy: C_SandboxEgressProxyConfigInputSchema.optional(),
		maskRequestHost: z.string().optional(),
		httpsPorts: z.array(z.number().int().min(1).max(65535)).max(128).optional(),
		rules: z
			.object({})
			.catchall(z.array(C_SandboxNetworkRuleInputSchema))
			.optional(),
	})
	.strict();
const C_SandboxMetadataInputSchema = z.object({}).catchall(z.string());
const C_EnvVarsInputSchema = z.object({}).catchall(z.string());
const C_McpInputSchema = z
	.object({})
	// OpenAPI defines MCP configuration as an extensible JSON object.
	.catchall(z.json())
	.nullable();
const C_SandboxIamTokenInputSchema = z
	.object({ audience: z.string(), tokenType: z.string() })
	.strict();
const C_SandboxIamTokensInputSchema = z
	.object({})
	.catchall(C_SandboxIamTokenInputSchema);
const C_SandboxIamInputSchema = z
	.object({ tokens: C_SandboxIamTokensInputSchema.optional() })
	.strict();
const C_SandboxVolumeMountInputSchema = z
	.object({ name: z.string(), path: z.string() })
	.strict();
const C_NewSandboxV2InputSchema = z
	.object({
		templateID: z.string(),
		timeout: z.number().int().min(1).optional(),
		cpuCount: C_CPUCountInputSchema.optional(),
		autoPause: z.boolean().optional(),
		autoPauseMemory: z.boolean().optional(),
		autoResume: C_SandboxAutoResumeConfigInputSchema.optional(),
		allow_internet_access: z.boolean().optional(),
		network: C_SandboxNetworkConfigInputSchema.optional(),
		metadata: C_SandboxMetadataInputSchema.optional(),
		envVars: C_EnvVarsInputSchema.optional(),
		mcp: C_McpInputSchema.optional(),
		iam: C_SandboxIamInputSchema.optional(),
		volumeMounts: z.array(C_SandboxVolumeMountInputSchema).optional(),
	})
	.strict();
const C_SandboxStateInputSchema = z.union([
	z.literal('running'),
	z.literal('paused'),
]);
const C_OrderDirectionInputSchema = z.union([
	z.literal('asc'),
	z.literal('desc'),
]);
const C_LogsDirectionInputSchema = z.union([
	z.literal('forward'),
	z.literal('backward'),
]);
const C_LogLevelInputSchema = z.string();
const C_SandboxPauseRequestInputSchema = z
	.object({
		memory: z.boolean().optional(),
		requireHealthyGuest: z.boolean().optional(),
	})
	.strict();
const C_SandboxForkRequestInputSchema = z
	.object({
		timeout: z.number().int().min(0).optional(),
		count: z.number().int().min(1).max(100).optional(),
	})
	.strict();
const C_ConnectSandboxV2InputSchema = z
	.object({
		timeout: z.number().int().min(1).optional(),
		memory: z.boolean().optional(),
	})
	.strict();
const C_SandboxTimeoutRequestInputSchema = z
	.object({ timeout: z.number().int().min(0) })
	.strict();
const C_SandboxNetworkUpdateConfigInputSchema = z
	.object({
		allowOut: z.array(z.string()).optional(),
		denyOut: z.array(z.string()).optional(),
		dnsServers: z.array(z.string()).max(10).optional(),
		egressProxy: C_SandboxEgressProxyConfigInputSchema.optional(),
		rules: z
			.object({})
			.catchall(z.array(C_SandboxNetworkRuleInputSchema))
			.optional(),
		allow_internet_access: z.boolean().optional(),
	})
	.strict();
const C_SandboxRefreshRequestInputSchema = z
	.object({ duration: z.number().int().min(0).max(3600).optional() })
	.strict();
const C_SandboxSnapshotRequestInputSchema = z
	.object({ name: z.string().optional(), memory: z.boolean().optional() })
	.strict();
const C_MemoryMBInputSchema = z.number().int().min(128);
const C_MinFreeDiskMbInputSchema = z.number().int().min(0);
const C_TemplateBuildRequestV3InputSchema = z
	.object({
		name: z.string().max(128).optional(),
		tags: z.array(z.string()).optional(),
		alias: z.string().max(128).optional(),
		teamID: z.string().optional(),
		cpuCount: C_CPUCountInputSchema.optional(),
		maxCpuCount: C_CPUCountInputSchema.optional(),
		memoryMB: C_MemoryMBInputSchema.optional(),
		minFreeDiskMb: C_MinFreeDiskMbInputSchema.optional(),
	})
	.strict();
const C_AWSRegistryInputSchema = z
	.object({
		type: z.literal('aws'),
		awsAccessKeyId: z.string(),
		awsSecretAccessKey: z.string(),
		awsRegion: z.string(),
	})
	.strict();
const C_GCPRegistryInputSchema = z
	.object({ type: z.literal('gcp'), serviceAccountJson: z.string() })
	.strict();
const C_GeneralRegistryInputSchema = z
	.object({
		type: z.literal('registry'),
		username: z.string(),
		password: z.string(),
	})
	.strict();
const C_FromImageRegistryInputSchema = z.union([
	C_AWSRegistryInputSchema,
	C_GCPRegistryInputSchema,
	C_GeneralRegistryInputSchema,
]);
const C_TemplateStepInputSchema = z
	.object({
		type: z.string(),
		args: z.array(z.string()).optional(),
		filesHash: z.string().regex(new RegExp('^[0-9a-f]{64}$')).optional(),
		force: z.boolean().optional(),
	})
	.strict();
const C_TemplateBuildStartV2InputSchema = z
	.object({
		fromImage: z.string().min(1).optional(),
		fromTemplate: z.string().min(1).optional(),
		fromImageRegistry: C_FromImageRegistryInputSchema.optional(),
		force: z.boolean().optional(),
		steps: z.array(C_TemplateStepInputSchema).optional(),
		startCmd: z.string().optional(),
		readyCmd: z.string().optional(),
	})
	.strict();
const C_TemplateUpdateRequestInputSchema = z
	.object({ public: z.boolean().optional() })
	.strict();
const C_LogsSourceInputSchema = z.union([
	z.literal('temporary'),
	z.literal('persistent'),
]);
const C_AssignTemplateTagsRequestInputSchema = z
	.object({ target: z.string(), tags: z.array(z.string()) })
	.strict();
const C_DeleteTemplateTagsRequestInputSchema = z
	.object({ name: z.string(), tags: z.array(z.string()) })
	.strict();
const C_NewVolumeInputSchema = z
	.object({ name: z.string().regex(new RegExp('^[a-zA-Z0-9_-]+$')) })
	.strict();
const C_connect_timeout_headerInputSchema = z.number();
const C_filesystem_CreateWatcherRequestInputSchema = z
	.object({
		path: z.string().optional(),
		recursive: z.boolean().optional(),
		includeEntry: z.boolean().optional(),
		allowNetworkMounts: z.boolean().optional(),
	})
	.strict();
const C_filesystem_GetWatcherEventsRequestInputSchema = z
	.object({ watcherId: z.string().optional() })
	.strict();
const C_filesystem_ListDirRequestInputSchema = z
	.object({ path: z.string().optional(), depth: z.number().int().optional() })
	.strict();
const C_filesystem_MakeDirRequestInputSchema = z
	.object({ path: z.string().optional() })
	.strict();
const C_filesystem_MoveRequestInputSchema = z
	.object({ source: z.string().optional(), destination: z.string().optional() })
	.strict();
const C_filesystem_RemoveRequestInputSchema = z
	.object({ path: z.string().optional() })
	.strict();
const C_filesystem_RemoveWatcherRequestInputSchema = z
	.object({ watcherId: z.string().optional() })
	.strict();
const C_filesystem_StatRequestInputSchema = z
	.object({ path: z.string().optional() })
	.strict();
const C_process_ProcessSelectorInputSchema = z.union([
	z.object({ pid: z.number().int() }).strict(),
	z.object({ tag: z.string() }).strict(),
]);
const C_process_CloseStdinRequestInputSchema = z
	.object({ process: C_process_ProcessSelectorInputSchema.optional() })
	.strict();
const C_process_ListRequestInputSchema = z.object({}).strict();
const C_process_ProcessInputInputSchema = z.union([
	z
		.object({
			pty: z
				.string()
				.regex(
					/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
				),
		})
		.strict(),
	z
		.object({
			stdin: z
				.string()
				.regex(
					/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
				),
		})
		.strict(),
]);
const C_process_SendInputRequestInputSchema = z
	.object({
		process: C_process_ProcessSelectorInputSchema.optional(),
		input: C_process_ProcessInputInputSchema.optional(),
	})
	.strict();
const C_process_SignalInputSchema = z.union([
	z.literal('SIGNAL_UNSPECIFIED'),
	z.literal('SIGNAL_SIGTERM'),
	z.literal('SIGNAL_SIGKILL'),
]);
const C_process_SendSignalRequestInputSchema = z
	.object({
		process: C_process_ProcessSelectorInputSchema.optional(),
		signal: C_process_SignalInputSchema.optional(),
	})
	.strict();
const C_process_PTY_SizeInputSchema = z
	.object({
		cols: z.number().int().optional(),
		rows: z.number().int().optional(),
	})
	.strict();
const C_process_PTYInputSchema = z
	.object({ size: C_process_PTY_SizeInputSchema.optional() })
	.strict();
const C_process_UpdateRequestInputSchema = z
	.object({
		process: C_process_ProcessSelectorInputSchema.optional(),
		pty: C_process_PTYInputSchema.nullable().optional(),
	})
	.strict();
const C_SecretMetadataInputSchema = z.object({}).catchall(z.string().max(1024));
const C_NewSecretInputSchema = z
	.object({
		name: z.string().min(1).max(128).regex(new RegExp('^[a-zA-Z0-9_-]+$')),
		value: z.string(),
		metadata: C_SecretMetadataInputSchema.optional(),
	})
	.strict();
const C_SecretUpdateInputSchema = z
	.object({
		value: z.string(),
		metadata: C_SecretMetadataInputSchema.optional(),
	})
	.strict();
const C_EnvdVersionOutputSchema = z.string();
const C_SandboxOutputSchema = z
	.object({
		templateID: z.string(),
		sandboxID: z.string(),
		alias: z.string().optional(),
		clientID: z.string(),
		envdVersion: C_EnvdVersionOutputSchema,
		envdAccessToken: z.string().optional(),
		trafficAccessToken: z.string().nullable().optional(),
		domain: z.string().nullable().optional(),
	})
	.passthrough();
const C_CPUCountOutputSchema = z.number().int().min(1);
const C_MemoryMBOutputSchema = z.number().int().min(128);
const C_DiskSizeMBOutputSchema = z.number().int().min(0);
const C_SandboxMetadataOutputSchema = z.object({}).catchall(z.string());
const C_SandboxStateOutputSchema = z
	.union([z.literal('running'), z.literal('paused')])
	.or(z.string());
const C_EnvdUnresponsiveAtPauseOutputSchema = z.boolean();
const C_SandboxVolumeMountOutputSchema = z
	.object({ name: z.string(), path: z.string() })
	.passthrough();
const C_ListedSandboxOutputSchema = z
	.object({
		templateID: z.string(),
		alias: z.string().optional(),
		sandboxID: z.string(),
		clientID: z.string(),
		startedAt: z.string().datetime(),
		endAt: z.string().datetime(),
		cpuCount: C_CPUCountOutputSchema,
		memoryMB: C_MemoryMBOutputSchema,
		diskSizeMB: C_DiskSizeMBOutputSchema,
		metadata: C_SandboxMetadataOutputSchema.optional(),
		state: C_SandboxStateOutputSchema,
		envdVersion: C_EnvdVersionOutputSchema,
		envdUnresponsiveAtPause: C_EnvdUnresponsiveAtPauseOutputSchema.optional(),
		volumeMounts: z.array(C_SandboxVolumeMountOutputSchema).optional(),
	})
	.passthrough();
const C_SandboxMetricOutputSchema = z
	.object({
		timestamp: z.string().datetime(),
		timestampUnix: z.number().int(),
		cpuCount: z.number().int(),
		cpuUsedPct: z.number(),
		memUsed: z.number().int(),
		memTotal: z.number().int(),
		memCache: z.number().int(),
		diskUsed: z.number().int(),
		diskTotal: z.number().int(),
	})
	.passthrough();
const C_SandboxesWithMetricsOutputSchema = z
	.object({ sandboxes: z.object({}).catchall(C_SandboxMetricOutputSchema) })
	.passthrough();
const C_LogLevelOutputSchema = z.string();
const C_SandboxLogEntryOutputSchema = z
	.object({
		timestamp: z.string().datetime(),
		message: z.string(),
		level: C_LogLevelOutputSchema,
		fields: z.object({}).catchall(z.string()),
	})
	.passthrough();
const C_SandboxLogsV2ResponseOutputSchema = z
	.object({ logs: z.array(C_SandboxLogEntryOutputSchema) })
	.passthrough();
const C_SandboxEgressProxyTLSConfigOutputSchema = z
	.object({
		enabled: z.boolean(),
		serverName: z.string().max(253).optional(),
		caCert: z.string().max(8192).optional(),
	})
	.passthrough()
	.nullable();
const C_SandboxEgressProxyConfigOutputSchema = z
	.object({
		address: z.string(),
		username: z.string().max(255).optional(),
		password: z.string().max(255).optional(),
		tls: C_SandboxEgressProxyTLSConfigOutputSchema.optional(),
	})
	.passthrough()
	.nullable();
const C_SandboxNetworkTransformOutputSchema = z
	.object({ headers: z.object({}).catchall(z.string()).optional() })
	.passthrough();
const C_SandboxNetworkRuleOutputSchema = z
	.object({ transform: C_SandboxNetworkTransformOutputSchema.optional() })
	.passthrough();
const C_SandboxNetworkConfigOutputSchema = z
	.object({
		allowPublicTraffic: z.boolean().nullable().optional(),
		allowOut: z.array(z.string()).optional(),
		denyOut: z.array(z.string()).optional(),
		dnsServers: z.array(z.string()).max(10).optional(),
		egressProxy: C_SandboxEgressProxyConfigOutputSchema.optional(),
		maskRequestHost: z.string().optional(),
		httpsPorts: z.array(z.number().int().min(1).max(65535)).max(128).optional(),
		rules: z
			.object({})
			.catchall(z.array(C_SandboxNetworkRuleOutputSchema))
			.optional(),
	})
	.passthrough();
const C_SandboxOnTimeoutOutputSchema = z
	.union([z.literal('kill'), z.literal('pause')])
	.or(z.string());
const C_SandboxLifecycleOutputSchema = z
	.object({
		autoResume: z.boolean(),
		onTimeout: C_SandboxOnTimeoutOutputSchema,
	})
	.passthrough();
const C_SandboxPauseModeOutputSchema = z
	.union([z.literal('full'), z.literal('filesystem')])
	.or(z.string());
const C_SandboxDetailOutputSchema = z
	.object({
		templateID: z.string(),
		alias: z.string().optional(),
		sandboxID: z.string(),
		clientID: z.string(),
		startedAt: z.string().datetime(),
		endAt: z.string().datetime(),
		envdVersion: C_EnvdVersionOutputSchema,
		envdUnresponsiveAtPause: C_EnvdUnresponsiveAtPauseOutputSchema.optional(),
		envdAccessToken: z.string().optional(),
		allowInternetAccess: z.boolean().nullable().optional(),
		domain: z.string().nullable().optional(),
		cpuCount: C_CPUCountOutputSchema,
		memoryMB: C_MemoryMBOutputSchema,
		diskSizeMB: C_DiskSizeMBOutputSchema,
		metadata: C_SandboxMetadataOutputSchema.optional(),
		state: C_SandboxStateOutputSchema,
		network: C_SandboxNetworkConfigOutputSchema.optional(),
		lifecycle: C_SandboxLifecycleOutputSchema.optional(),
		pauseMode: C_SandboxPauseModeOutputSchema.optional(),
		volumeMounts: z.array(C_SandboxVolumeMountOutputSchema).optional(),
	})
	.passthrough();
const C_ErrorOutputSchema = z
	.object({
		code: z.number().int(),
		error_code: z.string().optional(),
		message: z.string(),
	})
	.passthrough();
const C_SandboxForkResultOutputSchema = z
	.object({
		sandbox: C_SandboxOutputSchema.optional(),
		error: C_ErrorOutputSchema.optional(),
	})
	.passthrough();
const C_SnapshotInfoOutputSchema = z
	.object({ snapshotID: z.string(), names: z.array(z.string()) })
	.passthrough();
const C_TemplateRequestResponseV3OutputSchema = z
	.object({
		templateID: z.string(),
		buildID: z.string(),
		public: z.boolean(),
		names: z.array(z.string()),
		tags: z.array(z.string()),
		aliases: z.array(z.string()),
	})
	.passthrough();
const C_TeamUserOutputSchema = z
	.object({ id: z.string().uuid(), email: z.string().nullable() })
	.passthrough();
const C_TemplateBuildStatusOutputSchema = z
	.union([
		z.literal('building'),
		z.literal('waiting'),
		z.literal('ready'),
		z.literal('error'),
		z.literal('uploaded'),
	])
	.or(z.string());
const C_TemplateOutputSchema = z
	.object({
		templateID: z.string(),
		buildID: z.string(),
		cpuCount: z.union([C_CPUCountOutputSchema, z.literal(0)]),
		maxCpuCount: C_CPUCountOutputSchema.optional(),
		memoryMB: z.union([C_MemoryMBOutputSchema, z.literal(0)]),
		diskSizeMB: C_DiskSizeMBOutputSchema,
		public: z.boolean(),
		aliases: z.array(z.string()),
		names: z.array(z.string()),
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
		createdBy: z.union([C_TeamUserOutputSchema, z.null()]),
		lastSpawnedAt: z.string().datetime().nullable(),
		spawnCount: z.number().int(),
		buildCount: z.number().int(),
		envdVersion: C_EnvdVersionOutputSchema,
		buildStatus: C_TemplateBuildStatusOutputSchema,
		isDefault: z.boolean().optional(),
		description: z.string().optional(),
	})
	.passthrough();
const C_TemplateBuildFileUploadOutputSchema = z
	.object({
		present: z.boolean(),
		url: z.string().optional(),
		headers: z.object({}).catchall(z.string()).optional(),
	})
	.passthrough();
const C_TemplateBuildOutputSchema = z
	.object({
		buildID: z.string().uuid(),
		status: C_TemplateBuildStatusOutputSchema,
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
		finishedAt: z.string().datetime().optional(),
		cpuCount: C_CPUCountOutputSchema,
		maxCpuCount: C_CPUCountOutputSchema.optional(),
		memoryMB: C_MemoryMBOutputSchema,
		diskSizeMB: C_DiskSizeMBOutputSchema.optional(),
		envdVersion: C_EnvdVersionOutputSchema.optional(),
	})
	.passthrough();
const C_TemplateWithBuildsOutputSchema = C_TemplateOutputSchema.and(
	z
		.object({
			builds: z.array(C_TemplateBuildOutputSchema),
			nextToken: z.string().optional(),
		})
		.passthrough(),
);
const C_TemplateUpdateResponseOutputSchema = z
	.object({ names: z.array(z.string()) })
	.passthrough();
const C_BuildLogEntryOutputSchema = z
	.object({
		timestamp: z.string().datetime(),
		message: z.string(),
		level: C_LogLevelOutputSchema,
		step: z.string().optional(),
	})
	.passthrough();
const C_BuildStatusReasonOutputSchema = z
	.object({
		message: z.string(),
		step: z.string().optional(),
		logEntries: z.array(C_BuildLogEntryOutputSchema).optional(),
	})
	.passthrough();
const C_TemplateBuildInfoOutputSchema = z
	.object({
		logs: z.array(z.string()),
		logEntries: z.array(C_BuildLogEntryOutputSchema),
		templateID: z.string(),
		buildID: z.string(),
		status: C_TemplateBuildStatusOutputSchema,
		reason: C_BuildStatusReasonOutputSchema.optional(),
	})
	.passthrough();
const C_TemplateBuildLogsResponseOutputSchema = z
	.object({ logs: z.array(C_BuildLogEntryOutputSchema) })
	.passthrough();
const C_TemplateAliasResponseOutputSchema = z
	.object({ templateID: z.string(), public: z.boolean() })
	.passthrough();
const C_AssignedTemplateTagsOutputSchema = z
	.object({ tags: z.array(z.string()), buildID: z.string().uuid() })
	.passthrough();
const C_TemplateTagOutputSchema = z
	.object({
		tag: z.string(),
		buildID: z.string().uuid(),
		createdAt: z.string().datetime(),
	})
	.passthrough();
const C_TemplateTagAssignmentOutputSchema = z
	.object({
		assignmentId: z.string().uuid(),
		buildId: z.string().uuid(),
		assignedAt: z.string().datetime(),
		buildCreatedAt: z.string().datetime(),
		buildFinishedAt: z.string().datetime().nullable(),
	})
	.passthrough();
const C_TemplateTagGroupOutputSchema = z
	.object({
		tag: z.string(),
		assignments: z.array(C_TemplateTagAssignmentOutputSchema),
		hasMore: z.boolean(),
	})
	.passthrough();
const C_TemplateTagGroupsResponseOutputSchema = z
	.object({
		tags: z.array(C_TemplateTagGroupOutputSchema),
		nextCursor: z.string().nullable(),
	})
	.passthrough();
const C_TemplateTagsCountResponseOutputSchema = z
	.object({ total: z.number().int() })
	.passthrough();
const C_TemplateTagExistsResponseOutputSchema = z
	.object({ exists: z.boolean(), normalizedTag: z.string() })
	.passthrough();
const C_TemplateTagAssignmentsResponseOutputSchema = z
	.object({
		data: z.array(C_TemplateTagAssignmentOutputSchema),
		nextCursor: z.string().nullable(),
	})
	.passthrough();
const C_VolumeOutputSchema = z
	.object({ volumeID: z.string(), name: z.string() })
	.passthrough();
const C_VolumeAndTokenOutputSchema = z
	.object({
		volumeID: z.string(),
		name: z.string(),
		token: z.string(),
		domain: z.string().optional(),
	})
	.passthrough();
const C_OOMKillOutputSchema = z
	.object({ seq: z.number().int(), process: z.string() })
	.passthrough();
const C_MetricsOutputSchema = z
	.object({
		ts: z.number().int().optional(),
		cpu_count: z.number().int().optional(),
		cpu_possible: z.number().int().optional(),
		cpu_target: z.number().int().optional(),
		cpu_target_attempts: z.number().int().optional(),
		cpu_write_pending_ms: z.number().int().optional(),
		cpu_used_pct: z.number().optional(),
		mem_total: z.number().int().optional(),
		mem_used: z.number().int().optional(),
		mem_cache: z.number().int().optional(),
		disk_used: z.number().int().optional(),
		disk_total: z.number().int().optional(),
		oom_kills: z.array(C_OOMKillOutputSchema).optional(),
		mem_used_mib: z.number().int().optional(),
		mem_total_mib: z.number().int().optional(),
	})
	.passthrough();
const C_EnvVarsOutputSchema = z.object({}).catchall(z.string());
const C_filesystem_CreateWatcherResponseOutputSchema = z
	.object({ watcherId: z.string().optional() })
	.passthrough();
const C_filesystem_EventTypeOutputSchema = z
	.union([
		z.literal('EVENT_TYPE_UNSPECIFIED'),
		z.literal('EVENT_TYPE_CREATE'),
		z.literal('EVENT_TYPE_WRITE'),
		z.literal('EVENT_TYPE_REMOVE'),
		z.literal('EVENT_TYPE_RENAME'),
		z.literal('EVENT_TYPE_CHMOD'),
	])
	.or(z.string());
const C_filesystem_FileTypeOutputSchema = z
	.union([
		z.literal('FILE_TYPE_UNSPECIFIED'),
		z.literal('FILE_TYPE_FILE'),
		z.literal('FILE_TYPE_DIRECTORY'),
		z.literal('FILE_TYPE_SYMLINK'),
	])
	.or(z.string());
const C_google_protobuf_TimestampOutputSchema = z.string().datetime();
const C_filesystem_EntryInfoOutputSchema = z
	.object({
		name: z.string().optional(),
		type: C_filesystem_FileTypeOutputSchema.optional(),
		path: z.string().optional(),
		size: z.union([z.number().int(), z.string()]).optional(),
		mode: z.number().int().optional(),
		permissions: z.string().optional(),
		owner: z.string().optional(),
		group: z.string().optional(),
		modifiedTime: C_google_protobuf_TimestampOutputSchema.optional(),
		symlinkTarget: z.string().nullable().optional(),
		metadata: z.object({}).catchall(z.string()).optional(),
		isSymlink: z.boolean().optional(),
	})
	.passthrough();
const C_filesystem_FilesystemEventOutputSchema = z
	.object({
		name: z.string().optional(),
		type: C_filesystem_EventTypeOutputSchema.optional(),
		entry: C_filesystem_EntryInfoOutputSchema.nullable().optional(),
	})
	.passthrough();
const C_filesystem_GetWatcherEventsResponseOutputSchema = z
	.object({
		events: z.array(C_filesystem_FilesystemEventOutputSchema).optional(),
	})
	.passthrough();
const C_filesystem_ListDirResponseOutputSchema = z
	.object({ entries: z.array(C_filesystem_EntryInfoOutputSchema).optional() })
	.passthrough();
const C_filesystem_MakeDirResponseOutputSchema = z
	.object({ entry: C_filesystem_EntryInfoOutputSchema.optional() })
	.passthrough();
const C_filesystem_MoveResponseOutputSchema = z
	.object({ entry: C_filesystem_EntryInfoOutputSchema.optional() })
	.passthrough();
const C_filesystem_RemoveResponseOutputSchema = z.object({}).passthrough();
const C_filesystem_RemoveWatcherResponseOutputSchema = z
	.object({})
	.passthrough();
const C_filesystem_StatResponseOutputSchema = z
	.object({ entry: C_filesystem_EntryInfoOutputSchema.optional() })
	.passthrough();
const C_process_CloseStdinResponseOutputSchema = z.object({}).passthrough();
const C_process_ProcessConfigOutputSchema = z
	.object({
		cmd: z.string().optional(),
		args: z.array(z.string()).optional(),
		envs: z.object({}).catchall(z.string()).optional(),
		cwd: z.string().nullable().optional(),
	})
	.passthrough();
const C_process_ProcessInfoOutputSchema = z
	.object({
		config: C_process_ProcessConfigOutputSchema.optional(),
		pid: z.number().int().optional(),
		tag: z.string().nullable().optional(),
	})
	.passthrough();
const C_process_ListResponseOutputSchema = z
	.object({ processes: z.array(C_process_ProcessInfoOutputSchema).optional() })
	.passthrough();
const C_process_SendInputResponseOutputSchema = z.object({}).passthrough();
const C_process_SendSignalResponseOutputSchema = z.object({}).passthrough();
const C_process_UpdateResponseOutputSchema = z.object({}).passthrough();
const C_TeamMetricOutputSchema = z
	.object({
		timestamp: z.string().datetime(),
		timestampUnix: z.number().int(),
		concurrentSandboxes: z.number().int(),
		sandboxStartRate: z.number(),
	})
	.passthrough();
const C_MaxTeamMetricOutputSchema = z
	.object({
		timestamp: z.string().datetime(),
		timestampUnix: z.number().int(),
		value: z.number(),
	})
	.passthrough();
const C_SecretMetadataOutputSchema = z
	.object({})
	.catchall(z.string().max(1024));
const C_SecretOutputSchema = z
	.object({
		secretID: z.string(),
		name: z.string(),
		currentVersion: z.number().int(),
		metadata: C_SecretMetadataOutputSchema,
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.passthrough();
const C_SandboxPageOutputSchema = z
	.object({
		items: z.array(C_ListedSandboxOutputSchema),
		nextToken: z.string().optional(),
		totalRunning: z.number().int().optional(),
	})
	.passthrough();
const C_SnapshotPageOutputSchema = z
	.object({
		items: z.array(C_SnapshotInfoOutputSchema),
		nextToken: z.string().optional(),
	})
	.passthrough();
const C_TemplatePageOutputSchema = z
	.object({
		items: z.array(C_TemplateOutputSchema),
		nextToken: z.string().optional(),
	})
	.passthrough();
const C_SecretPageOutputSchema = z
	.object({
		items: z.array(C_SecretOutputSchema),
		nextToken: z.string().optional(),
	})
	.passthrough();
const C_SandboxEventOutputSchema = z
	.object({
		id: z.string().uuid(),
		version: z.string(),
		type: z.string(),
		eventCategory: z.string().optional(),
		eventLabel: z.string().optional(),
		eventData: z.object({}).passthrough().nullable().optional(),
		timestamp: z.string().datetime(),
		sandboxId: z.string(),
		sandboxExecutionId: z.string(),
		sandboxTemplateId: z.string(),
		sandboxBuildId: z.string(),
		sandboxTeamId: z.string().uuid(),
	})
	.passthrough();

export const E2bEndpointInputSchemas = {
	'sandboxes.create': z
		.object({
			headers: z
				.object({
					idempotencyKey: z
						.string()
						.min(1)
						.max(255)
						.regex(new RegExp('^[a-z0-9-]+$'))
						.optional(),
				})
				.strict()
				.optional(),
			body: C_NewSandboxV2InputSchema,
		})
		.strict(),
	'sandboxes.list': z
		.object({
			query: z
				.object({
					metadata: z.string().optional(),
					state: z.array(C_SandboxStateInputSchema).optional(),
					order: C_OrderDirectionInputSchema.optional(),
					startedAfter: z.string().datetime().optional(),
					template: z.string().optional(),
					nextToken: z.string().optional(),
					limit: z.number().int().min(1).max(100).optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'sandboxes.listMetrics': z
		.object({
			query: z.object({ sandbox_ids: z.array(z.string()).max(100) }).strict(),
		})
		.strict(),
	'sandboxes.getLogs': z
		.object({
			path: z.object({ sandboxID: z.string() }).strict(),
			query: z
				.object({
					cursor: z.number().int().min(0).optional(),
					limit: z.number().int().min(0).max(1000).optional(),
					direction: C_LogsDirectionInputSchema.optional(),
					level: C_LogLevelInputSchema.optional(),
					search: z.string().max(256).optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'sandboxes.get': z
		.object({ path: z.object({ sandboxID: z.string() }).strict() })
		.strict(),
	'sandboxes.kill': z
		.object({ path: z.object({ sandboxID: z.string() }).strict() })
		.strict(),
	'sandboxes.getMetrics': z
		.object({
			path: z.object({ sandboxID: z.string() }).strict(),
			query: z
				.object({
					start: z.number().int().min(0).optional(),
					end: z.number().int().min(0).optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'sandboxes.pause': z
		.object({
			path: z.object({ sandboxID: z.string() }).strict(),
			body: C_SandboxPauseRequestInputSchema.optional(),
		})
		.strict(),
	'sandboxes.fork': z
		.object({
			path: z.object({ sandboxID: z.string() }).strict(),
			body: C_SandboxForkRequestInputSchema.optional(),
		})
		.strict(),
	'sandboxes.connect': z
		.object({
			path: z.object({ sandboxID: z.string() }).strict(),
			body: C_ConnectSandboxV2InputSchema.optional(),
		})
		.strict(),
	'sandboxes.setTimeout': z
		.object({
			path: z.object({ sandboxID: z.string() }).strict(),
			body: C_SandboxTimeoutRequestInputSchema.optional(),
		})
		.strict(),
	'sandboxes.updateNetwork': z
		.object({
			path: z.object({ sandboxID: z.string() }).strict(),
			body: C_SandboxNetworkUpdateConfigInputSchema,
		})
		.strict(),
	'sandboxes.refresh': z
		.object({
			path: z.object({ sandboxID: z.string() }).strict(),
			body: C_SandboxRefreshRequestInputSchema.optional(),
		})
		.strict(),
	'sandboxes.createSnapshot': z
		.object({
			path: z.object({ sandboxID: z.string() }).strict(),
			headers: z
				.object({
					idempotencyKey: z
						.string()
						.min(1)
						.max(255)
						.regex(new RegExp('^[a-z0-9-]+$'))
						.optional(),
				})
				.strict()
				.optional(),
			body: C_SandboxSnapshotRequestInputSchema,
		})
		.strict(),
	'sandboxes.listSnapshots': z
		.object({
			query: z
				.object({
					sandboxID: z.string().optional(),
					name: z.string().optional(),
					limit: z.number().int().min(1).max(100).optional(),
					nextToken: z.string().optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'templates.create': z
		.object({
			headers: z
				.object({
					idempotencyKey: z
						.string()
						.min(1)
						.max(255)
						.regex(new RegExp('^[a-z0-9-]+$'))
						.optional(),
				})
				.strict()
				.optional(),
			body: C_TemplateBuildRequestV3InputSchema,
		})
		.strict(),
	'templates.list': z
		.object({
			query: z
				.object({
					teamID: z.string().optional(),
					nextToken: z.string().optional(),
					limit: z.number().int().min(1).max(100).optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'templates.getBuildUploadLink': z
		.object({
			path: z
				.object({
					templateID: z.string(),
					hash: z.string().regex(new RegExp('^[0-9a-f]{64}$')),
				})
				.strict(),
		})
		.strict(),
	'templates.listDefault': z.object({}).strict(),
	'templates.get': z
		.object({
			path: z.object({ templateID: z.string() }).strict(),
			query: z
				.object({
					nextToken: z.string().optional(),
					limit: z.number().int().min(1).max(100).optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'templates.delete': z
		.object({ path: z.object({ templateID: z.string() }).strict() })
		.strict(),
	'templates.startBuild': z
		.object({
			path: z.object({ templateID: z.string(), buildID: z.string() }).strict(),
			headers: z
				.object({
					idempotencyKey: z
						.string()
						.min(1)
						.max(255)
						.regex(new RegExp('^[a-z0-9-]+$'))
						.optional(),
				})
				.strict()
				.optional(),
			body: C_TemplateBuildStartV2InputSchema,
		})
		.strict(),
	'templates.update': z
		.object({
			path: z.object({ templateID: z.string() }).strict(),
			body: C_TemplateUpdateRequestInputSchema,
		})
		.strict(),
	'templates.getBuildStatus': z
		.object({
			path: z.object({ templateID: z.string(), buildID: z.string() }).strict(),
			query: z
				.object({
					logsOffset: z.number().int().min(0).optional(),
					limit: z.number().int().min(0).max(100).optional(),
					level: C_LogLevelInputSchema.optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'templates.getBuildLogs': z
		.object({
			path: z.object({ templateID: z.string(), buildID: z.string() }).strict(),
			query: z
				.object({
					cursor: z.number().int().min(0).optional(),
					limit: z.number().int().min(0).max(100).optional(),
					direction: C_LogsDirectionInputSchema.optional(),
					level: C_LogLevelInputSchema.optional(),
					source: C_LogsSourceInputSchema.optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'templates.getByAlias': z
		.object({ path: z.object({ alias: z.string() }).strict() })
		.strict(),
	'tags.assign': z
		.object({ body: C_AssignTemplateTagsRequestInputSchema })
		.strict(),
	'tags.delete': z
		.object({ body: C_DeleteTemplateTagsRequestInputSchema })
		.strict(),
	'tags.list': z
		.object({ path: z.object({ templateID: z.string() }).strict() })
		.strict(),
	'tags.listGroups': z
		.object({
			path: z.object({ templateID: z.string() }).strict(),
			query: z
				.object({
					assignmentLimit: z.number().int().min(1).max(25).optional(),
					tagsLimit: z.number().int().min(1).max(100).optional(),
					tagsCursor: z.string().optional(),
					search: z
						.string()
						.max(64)
						.regex(new RegExp('^[a-z0-9._-]*$'))
						.optional(),
					sort: z
						.union([
							z.literal('latest_desc'),
							z.literal('latest_asc'),
							z.literal('name_asc'),
							z.literal('name_desc'),
						])
						.optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'tags.count': z
		.object({ path: z.object({ templateID: z.string() }).strict() })
		.strict(),
	'tags.exists': z
		.object({
			path: z.object({ templateID: z.string() }).strict(),
			query: z.object({ tag: z.string().min(1) }).strict(),
		})
		.strict(),
	'tags.listAssignments': z
		.object({
			path: z.object({ templateID: z.string(), tag: z.string() }).strict(),
			query: z
				.object({
					cursor: z.string().optional(),
					limit: z.number().int().min(1).max(100).optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'volumes.list': z.object({}).strict(),
	'volumes.create': z.object({ body: C_NewVolumeInputSchema }).strict(),
	'volumes.get': z
		.object({ path: z.object({ volumeID: z.string() }).strict() })
		.strict(),
	'volumes.delete': z
		.object({ path: z.object({ volumeID: z.string() }).strict() })
		.strict(),
	'envd.health': z
		.object({
			headers: z
				.object({
					e2bSandboxId: z.string().min(1),
					e2bSandboxPort: z.number().int().min(1),
				})
				.strict(),
		})
		.strict(),
	'envd.metrics': z
		.object({
			headers: z
				.object({
					e2bSandboxId: z.string().min(1),
					e2bSandboxPort: z.number().int().min(1),
					e2bAccessToken: z.string().min(1).min(1),
				})
				.strict(),
		})
		.strict(),
	'envd.getEnvironmentVariables': z
		.object({
			headers: z
				.object({
					e2bSandboxId: z.string().min(1),
					e2bSandboxPort: z.number().int().min(1),
					e2bAccessToken: z.string().min(1).min(1),
				})
				.strict(),
		})
		.strict(),
	'filesystem.createWatcher': z
		.object({
			headers: z
				.object({
					e2bSandboxId: z.string().min(1),
					e2bSandboxPort: z.number().int().min(1),
					connectTimeoutMs: C_connect_timeout_headerInputSchema.optional(),
					e2bAccessToken: z.string().min(1).min(1),
				})
				.strict(),
			body: C_filesystem_CreateWatcherRequestInputSchema,
		})
		.strict(),
	'filesystem.getWatcherEvents': z
		.object({
			headers: z
				.object({
					e2bSandboxId: z.string().min(1),
					e2bSandboxPort: z.number().int().min(1),
					connectTimeoutMs: C_connect_timeout_headerInputSchema.optional(),
					e2bAccessToken: z.string().min(1).min(1),
				})
				.strict(),
			body: C_filesystem_GetWatcherEventsRequestInputSchema,
		})
		.strict(),
	'filesystem.listDir': z
		.object({
			headers: z
				.object({
					e2bSandboxId: z.string().min(1),
					e2bSandboxPort: z.number().int().min(1),
					connectTimeoutMs: C_connect_timeout_headerInputSchema.optional(),
					e2bAccessToken: z.string().min(1).min(1),
				})
				.strict(),
			body: C_filesystem_ListDirRequestInputSchema,
		})
		.strict(),
	'filesystem.createDir': z
		.object({
			headers: z
				.object({
					e2bSandboxId: z.string().min(1),
					e2bSandboxPort: z.number().int().min(1),
					connectTimeoutMs: C_connect_timeout_headerInputSchema.optional(),
					e2bAccessToken: z.string().min(1).min(1),
				})
				.strict(),
			body: C_filesystem_MakeDirRequestInputSchema,
		})
		.strict(),
	'filesystem.move': z
		.object({
			headers: z
				.object({
					e2bSandboxId: z.string().min(1),
					e2bSandboxPort: z.number().int().min(1),
					connectTimeoutMs: C_connect_timeout_headerInputSchema.optional(),
					e2bAccessToken: z.string().min(1).min(1),
				})
				.strict(),
			body: C_filesystem_MoveRequestInputSchema,
		})
		.strict(),
	'filesystem.remove': z
		.object({
			headers: z
				.object({
					e2bSandboxId: z.string().min(1),
					e2bSandboxPort: z.number().int().min(1),
					connectTimeoutMs: C_connect_timeout_headerInputSchema.optional(),
					e2bAccessToken: z.string().min(1).min(1),
				})
				.strict(),
			body: C_filesystem_RemoveRequestInputSchema,
		})
		.strict(),
	'filesystem.removeWatcher': z
		.object({
			headers: z
				.object({
					e2bSandboxId: z.string().min(1),
					e2bSandboxPort: z.number().int().min(1),
					connectTimeoutMs: C_connect_timeout_headerInputSchema.optional(),
					e2bAccessToken: z.string().min(1).min(1),
				})
				.strict(),
			body: C_filesystem_RemoveWatcherRequestInputSchema,
		})
		.strict(),
	'filesystem.stat': z
		.object({
			headers: z
				.object({
					e2bSandboxId: z.string().min(1),
					e2bSandboxPort: z.number().int().min(1),
					connectTimeoutMs: C_connect_timeout_headerInputSchema.optional(),
					e2bAccessToken: z.string().min(1).min(1),
				})
				.strict(),
			body: C_filesystem_StatRequestInputSchema,
		})
		.strict(),
	'process.closeStdin': z
		.object({
			headers: z
				.object({
					e2bSandboxId: z.string().min(1),
					e2bSandboxPort: z.number().int().min(1),
					connectTimeoutMs: C_connect_timeout_headerInputSchema.optional(),
					e2bAccessToken: z.string().min(1).min(1),
				})
				.strict(),
			body: C_process_CloseStdinRequestInputSchema,
		})
		.strict(),
	'process.list': z
		.object({
			headers: z
				.object({
					e2bSandboxId: z.string().min(1),
					e2bSandboxPort: z.number().int().min(1),
					connectTimeoutMs: C_connect_timeout_headerInputSchema.optional(),
					e2bAccessToken: z.string().min(1).min(1),
				})
				.strict(),
			body: C_process_ListRequestInputSchema,
		})
		.strict(),
	'process.sendInput': z
		.object({
			headers: z
				.object({
					e2bSandboxId: z.string().min(1),
					e2bSandboxPort: z.number().int().min(1),
					connectTimeoutMs: C_connect_timeout_headerInputSchema.optional(),
					e2bAccessToken: z.string().min(1).min(1),
				})
				.strict(),
			body: C_process_SendInputRequestInputSchema,
		})
		.strict(),
	'process.sendSignal': z
		.object({
			headers: z
				.object({
					e2bSandboxId: z.string().min(1),
					e2bSandboxPort: z.number().int().min(1),
					connectTimeoutMs: C_connect_timeout_headerInputSchema.optional(),
					e2bAccessToken: z.string().min(1).min(1),
				})
				.strict(),
			body: C_process_SendSignalRequestInputSchema,
		})
		.strict(),
	'process.update': z
		.object({
			headers: z
				.object({
					e2bSandboxId: z.string().min(1),
					e2bSandboxPort: z.number().int().min(1),
					connectTimeoutMs: C_connect_timeout_headerInputSchema.optional(),
					e2bAccessToken: z.string().min(1).min(1),
				})
				.strict(),
			body: C_process_UpdateRequestInputSchema,
		})
		.strict(),
	'teams.getMetrics': z
		.object({
			path: z.object({ teamID: z.string() }).strict(),
			query: z
				.object({
					start: z.number().int().min(0).optional(),
					end: z.number().int().min(0).optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'teams.getMaxMetrics': z
		.object({
			path: z.object({ teamID: z.string() }).strict(),
			query: z
				.object({
					start: z.number().int().min(0).optional(),
					end: z.number().int().min(0).optional(),
					metric: z.union([
						z.literal('concurrent_sandboxes'),
						z.literal('sandbox_start_rate'),
					]),
				})
				.strict(),
		})
		.strict(),
	'secrets.list': z
		.object({
			query: z
				.object({
					nextToken: z.string().optional(),
					limit: z.number().int().min(1).max(100).optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'secrets.create': z.object({ body: C_NewSecretInputSchema }).strict(),
	'secrets.get': z
		.object({ path: z.object({ secretID: z.string() }).strict() })
		.strict(),
	'secrets.update': z
		.object({
			path: z.object({ secretID: z.string() }).strict(),
			body: C_SecretUpdateInputSchema,
		})
		.strict(),
	'secrets.delete': z
		.object({ path: z.object({ secretID: z.string() }).strict() })
		.strict(),
	'events.listBySandbox': z
		.object({
			path: z.object({ sandboxID: z.string() }).strict(),
			query: z
				.object({
					offset: z.number().int().min(0).optional(),
					limit: z.number().int().min(1).max(100).optional(),
					orderAsc: z.boolean().optional(),
					types: z.array(z.string()).optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
	'events.list': z
		.object({
			query: z
				.object({
					offset: z.number().int().min(0).optional(),
					limit: z.number().int().min(1).max(100).optional(),
					orderAsc: z.boolean().optional(),
					types: z.array(z.string()).optional(),
				})
				.strict()
				.optional(),
		})
		.strict(),
} as const;

export const E2bEndpointOutputSchemas = {
	'sandboxes.create': C_SandboxOutputSchema,
	'sandboxes.list': C_SandboxPageOutputSchema,
	'sandboxes.listMetrics': C_SandboxesWithMetricsOutputSchema,
	'sandboxes.getLogs': C_SandboxLogsV2ResponseOutputSchema,
	'sandboxes.get': C_SandboxDetailOutputSchema,
	'sandboxes.kill': z.void(),
	'sandboxes.getMetrics': z.array(C_SandboxMetricOutputSchema),
	'sandboxes.pause': z.void(),
	'sandboxes.fork': z.array(C_SandboxForkResultOutputSchema),
	'sandboxes.connect': C_SandboxOutputSchema,
	'sandboxes.setTimeout': z.void(),
	'sandboxes.updateNetwork': z.void(),
	'sandboxes.refresh': z.void(),
	'sandboxes.createSnapshot': C_SnapshotInfoOutputSchema,
	'sandboxes.listSnapshots': C_SnapshotPageOutputSchema,
	'templates.create': C_TemplateRequestResponseV3OutputSchema,
	'templates.list': C_TemplatePageOutputSchema,
	'templates.getBuildUploadLink': C_TemplateBuildFileUploadOutputSchema,
	'templates.listDefault': z.array(C_TemplateOutputSchema),
	'templates.get': C_TemplateWithBuildsOutputSchema,
	'templates.delete': z.void(),
	'templates.startBuild': z.void(),
	'templates.update': C_TemplateUpdateResponseOutputSchema,
	'templates.getBuildStatus': C_TemplateBuildInfoOutputSchema,
	'templates.getBuildLogs': C_TemplateBuildLogsResponseOutputSchema,
	'templates.getByAlias': C_TemplateAliasResponseOutputSchema,
	'tags.assign': C_AssignedTemplateTagsOutputSchema,
	'tags.delete': z.void(),
	'tags.list': z.array(C_TemplateTagOutputSchema),
	'tags.listGroups': C_TemplateTagGroupsResponseOutputSchema,
	'tags.count': C_TemplateTagsCountResponseOutputSchema,
	'tags.exists': C_TemplateTagExistsResponseOutputSchema,
	'tags.listAssignments': C_TemplateTagAssignmentsResponseOutputSchema,
	'volumes.list': z.array(C_VolumeOutputSchema),
	'volumes.create': C_VolumeAndTokenOutputSchema,
	'volumes.get': C_VolumeAndTokenOutputSchema,
	'volumes.delete': z.void(),
	'envd.health': z.void(),
	'envd.metrics': C_MetricsOutputSchema,
	'envd.getEnvironmentVariables': C_EnvVarsOutputSchema,
	'filesystem.createWatcher': C_filesystem_CreateWatcherResponseOutputSchema,
	'filesystem.getWatcherEvents':
		C_filesystem_GetWatcherEventsResponseOutputSchema,
	'filesystem.listDir': C_filesystem_ListDirResponseOutputSchema,
	'filesystem.createDir': C_filesystem_MakeDirResponseOutputSchema,
	'filesystem.move': C_filesystem_MoveResponseOutputSchema,
	'filesystem.remove': C_filesystem_RemoveResponseOutputSchema,
	'filesystem.removeWatcher': C_filesystem_RemoveWatcherResponseOutputSchema,
	'filesystem.stat': C_filesystem_StatResponseOutputSchema,
	'process.closeStdin': C_process_CloseStdinResponseOutputSchema,
	'process.list': C_process_ListResponseOutputSchema,
	'process.sendInput': C_process_SendInputResponseOutputSchema,
	'process.sendSignal': C_process_SendSignalResponseOutputSchema,
	'process.update': C_process_UpdateResponseOutputSchema,
	'teams.getMetrics': z.array(C_TeamMetricOutputSchema),
	'teams.getMaxMetrics': C_MaxTeamMetricOutputSchema,
	'secrets.list': C_SecretPageOutputSchema,
	'secrets.create': C_SecretOutputSchema,
	'secrets.get': C_SecretOutputSchema,
	'secrets.update': C_SecretOutputSchema,
	'secrets.delete': z.void(),
	'events.listBySandbox': z.array(C_SandboxEventOutputSchema),
	'events.list': z.array(C_SandboxEventOutputSchema),
} as const;

export type E2bEndpointInputs = {
	[K in keyof typeof E2bEndpointInputSchemas]: z.input<
		(typeof E2bEndpointInputSchemas)[K]
	>;
};
export type E2bEndpointOutputs = {
	[K in keyof typeof E2bEndpointOutputSchemas]: z.output<
		(typeof E2bEndpointOutputSchemas)[K]
	>;
};
