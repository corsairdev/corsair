import { z } from 'zod';
import type { ModalRuntime } from '../client';
import { lookupApp } from './apps';
import {
	appNameField,
	collect,
	collectLogs,
	defineOperation,
	envField,
	environmentField,
	ImageSpecSchema,
	LogEntrySchema,
	limitField,
	logSourceField,
	OkSchema,
	readCapped,
	resolveImage,
	resolveSecrets,
	resolveVolumes,
	sandboxIdField,
	secretNamesField,
	TunnelSchema,
	tunnelsToJson,
	volumesField,
} from './shared';

export const DEFAULT_SANDBOX_APP = 'corsair-sandboxes';
export const DEFAULT_SANDBOX_IMAGE = 'python:3.13-slim';
const DEFAULT_MAX_OUTPUT_BYTES = 1_000_000;

const SandboxRefSchema = z.object({ sandboxId: z.string() });

const SandboxStatusSchema = z.object({
	sandboxId: z.string(),
	running: z.boolean(),
	exitCode: z
		.number()
		.nullable()
		.describe('Exit code once the sandbox has finished, else null.'),
});

const ImageRefSchema = z.object({ imageId: z.string() });

const CloudBucketMountSchema = z.object({
	bucketName: z.string().min(1),
	secretName: z
		.string()
		.min(1)
		.optional()
		.describe('Modal Secret with the bucket credentials.'),
	readOnly: z.boolean().optional(),
	requesterPays: z.boolean().optional(),
	bucketEndpointUrl: z
		.string()
		.optional()
		.describe('Endpoint for S3-compatible stores (R2, GCS, MinIO).'),
	keyPrefix: z.string().optional(),
	oidcAuthRoleArn: z.string().optional(),
});

const ProbeSchema = z
	.object({
		tcpPort: z.number().int().min(1).max(65535).optional(),
		execCommand: z.array(z.string()).optional(),
		intervalMs: z.number().int().min(1).optional(),
	})
	.refine((probe) => Boolean(probe.tcpPort) !== Boolean(probe.execCommand), {
		message: 'Give either tcpPort or execCommand.',
	});

const portsField = (what: string) =>
	z.array(z.number().int().min(1).max(65535)).optional().describe(what);

const CreateSandboxInput = z.object({
	environment: environmentField,
	appName: appNameField
		.default(DEFAULT_SANDBOX_APP)
		.describe(
			`App the sandbox belongs to; created if missing (default "${DEFAULT_SANDBOX_APP}").`,
		),
	image: ImageSpecSchema.optional().describe(
		`Image to run. Defaults to the registry image "${DEFAULT_SANDBOX_IMAGE}".`,
	),
	name: z
		.string()
		.min(1)
		.optional()
		.describe('Name, unique within the App; lets sandboxes.getByName find it.'),
	command: z
		.array(z.string())
		.optional()
		.describe(
			'Entrypoint program and arguments. By default the sandbox sleeps until its timeout.',
		),
	workdir: z.string().optional(),
	env: envField,
	secrets: secretNamesField,
	volumes: volumesField,
	cloudBucketMounts: z
		.record(z.string(), CloudBucketMountSchema)
		.optional()
		.describe('S3/R2/GCS buckets to mount, keyed by mount path.'),
	cpu: z
		.number()
		.positive()
		.optional()
		.describe('Reserved CPU cores (can be fractional).'),
	cpuLimit: z.number().positive().optional(),
	memoryMiB: z.number().int().positive().optional(),
	memoryLimitMiB: z.number().int().positive().optional(),
	gpu: z
		.string()
		.optional()
		.describe('GPU type and count, e.g. "T4", "A100-80GB:2". GPUs cost more.'),
	timeoutMs: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Maximum lifetime in ms (Modal default 5 minutes).'),
	idleTimeoutMs: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Terminate after this long without activity.'),
	encryptedPorts: portsField('Ports to expose through TLS tunnels.'),
	h2Ports: portsField('Ports to expose through HTTP/2 TLS tunnels.'),
	unencryptedPorts: portsField('Ports to expose through plain TCP tunnels.'),
	blockNetwork: z.boolean().optional().describe('Block all network access.'),
	outboundCidrAllowlist: z.array(z.string()).optional(),
	outboundDomainAllowlist: z
		.array(z.string())
		.optional()
		.describe('Domains the sandbox may reach; wildcards like *.example.com.'),
	inboundCidrAllowlist: z.array(z.string()).optional(),
	cloud: z.string().optional().describe('Cloud provider, e.g. "aws", "gcp".'),
	regions: z.array(z.string()).optional(),
	runtime: z.enum(['gvisor', 'vm']).optional(),
	pty: z.boolean().optional(),
	tags: z
		.record(z.string(), z.string())
		.optional()
		.describe('Tags, filterable with sandboxes.list.'),
	proxyName: z
		.string()
		.optional()
		.describe('Name of a Modal Proxy (static outbound IP) to route through.'),
	readinessProbe: ProbeSchema.optional(),
	includeOidcIdentityToken: z.boolean().optional(),
	enableMemorySnapshot: z
		.boolean()
		.optional()
		.describe(
			'Allow sandboxes.snapshotMemory on this sandbox (no GPUs or Volumes; not with enableExitSnapshot).',
		),
	enableExitSnapshot: z
		.boolean()
		.optional()
		.describe(
			'Capture the filesystem when the sandbox exits (read it with sandboxes.getExitSnapshot). Not with enableMemorySnapshot.',
		),
	persistent: z
		.boolean()
		.optional()
		.describe(
			'Experimental: allow sandboxes.pause and sandboxes.resume. Not enabled on every workspace (Modal answers 403); takes no timeoutMs or idleTimeoutMs.',
		),
	backend: z
		.enum(['default', 'v2'])
		.optional()
		.describe(
			'"v2" uses the experimental V2 backend (no GPUs; not returned by sandboxes.list).',
		),
	tunnelTimeoutMs: z
		.number()
		.int()
		.positive()
		.default(30_000)
		.describe('When ports are exposed, how long to wait for their tunnels.'),
});

async function createSandbox(
	runtime: ModalRuntime,
	input: z.output<typeof CreateSandboxInput>,
) {
	const { client, sdk } = runtime;
	const app = await lookupApp(runtime, input.appName, true);
	const image = await resolveImage(
		runtime,
		input.image ?? { registry: DEFAULT_SANDBOX_IMAGE },
	);
	let cloudBucketMounts:
		| Record<string, ReturnType<typeof client.cloudBucketMounts.create>>
		| undefined;
	if (input.cloudBucketMounts) {
		cloudBucketMounts = {};
		for (const [path, mount] of Object.entries(input.cloudBucketMounts)) {
			cloudBucketMounts[path] = client.cloudBucketMounts.create(
				mount.bucketName,
				{
					secret: mount.secretName
						? await client.secrets.fromName(mount.secretName)
						: undefined,
					readOnly: mount.readOnly,
					requesterPays: mount.requesterPays,
					bucketEndpointUrl: mount.bucketEndpointUrl,
					keyPrefix: mount.keyPrefix,
					oidcAuthRoleArn: mount.oidcAuthRoleArn,
				},
			);
		}
	}
	const probe = input.readinessProbe;
	const readinessProbe = probe
		? probe.tcpPort
			? sdk.Probe.withTcp(
					probe.tcpPort,
					probe.intervalMs ? { intervalMs: probe.intervalMs } : undefined,
				)
			: sdk.Probe.withExec(
					probe.execCommand as string[],
					probe.intervalMs ? { intervalMs: probe.intervalMs } : undefined,
				)
		: undefined;
	const experimentalOptions = input.enableExitSnapshot
		? { enable_exit_snapshot: true }
		: undefined;
	const params = {
		name: input.name,
		command: input.command,
		workdir: input.workdir,
		env: input.env,
		secrets: await resolveSecrets(runtime, input.secrets),
		volumes: await resolveVolumes(runtime, input.volumes),
		cloudBucketMounts,
		cpu: input.cpu,
		cpuLimit: input.cpuLimit,
		memoryMiB: input.memoryMiB,
		memoryLimitMiB: input.memoryLimitMiB,
		gpu: input.gpu,
		timeoutMs: input.timeoutMs,
		idleTimeoutMs: input.idleTimeoutMs,
		encryptedPorts: input.encryptedPorts,
		h2Ports: input.h2Ports,
		unencryptedPorts: input.unencryptedPorts,
		blockNetwork: input.blockNetwork,
		outboundCidrAllowlist: input.outboundCidrAllowlist,
		outboundDomainAllowlist: input.outboundDomainAllowlist,
		inboundCidrAllowlist: input.inboundCidrAllowlist,
		cloud: input.cloud,
		regions: input.regions,
		runtime: input.runtime,
		pty: input.pty,
		tags: input.tags,
		proxy: input.proxyName
			? await client.proxies.fromName(input.proxyName)
			: undefined,
		readinessProbe,
		includeOidcIdentityToken: input.includeOidcIdentityToken,
		experimentalEnableSnapshot: input.enableMemorySnapshot,
		experimentalPersistent: input.persistent,
		experimentalOptions,
	};
	const sandbox =
		input.backend === 'v2'
			? await client.sandboxes.experimentalCreate(app, image, params)
			: await client.sandboxes.create(app, image, params);
	const hasPorts = Boolean(
		input.encryptedPorts?.length ||
			input.h2Ports?.length ||
			input.unencryptedPorts?.length,
	);
	const result = {
		sandboxId: sandbox.sandboxId,
		appId: app.appId,
		name: input.name,
	};
	if (!hasPorts) return result;
	try {
		return {
			...result,
			tunnels: tunnelsToJson(await sandbox.tunnels(input.tunnelTimeoutMs)),
		};
	} catch (error) {
		// The sandbox is running (and billed) either way: hand back its id so the
		// caller can fetch the tunnels later or terminate it, instead of losing it.
		const name = error instanceof Error ? error.name : 'Error';
		return {
			...result,
			tunnelsError: `Tunnels not ready (${name}); call sandboxes.tunnels later, or sandboxes.terminate.`,
		};
	}
}

export const createSandboxOp = defineOperation({
	group: 'sandboxes',
	name: 'create',
	description:
		'Start a Modal Sandbox (a container billed per second for CPU, memory and any GPU) from a registry image, a built image or a published one. Returns its id, plus tunnel URLs when ports are exposed.',
	riskLevel: 'destructive',
	input: CreateSandboxInput,
	output: z.object({
		sandboxId: z.string(),
		appId: z.string(),
		name: z.string().optional(),
		tunnels: z.array(TunnelSchema).optional(),
		tunnelsError: z
			.string()
			.optional()
			.describe(
				'Set when the sandbox started but its tunnels failed or were not ready within tunnelTimeoutMs. The sandbox keeps running.',
			),
	}),
	run: createSandbox,
});

async function sandboxFromId(runtime: ModalRuntime, sandboxId: string) {
	return runtime.client.sandboxes.fromId(sandboxId);
}

async function sandboxStatus(
	sandbox: Awaited<ReturnType<typeof sandboxFromId>>,
) {
	const exitCode = await sandbox.poll();
	return {
		sandboxId: sandbox.sandboxId,
		running: exitCode === null,
		exitCode,
	};
}

const SandboxIdInput = z.object({ sandboxId: sandboxIdField });

export const getSandbox = defineOperation({
	group: 'sandboxes',
	name: 'get',
	description:
		'Whether a sandbox is still running, and its exit code once it has finished.',
	riskLevel: 'read',
	input: SandboxIdInput,
	output: SandboxStatusSchema,
	run: async (runtime, input) =>
		sandboxStatus(await sandboxFromId(runtime, input.sandboxId)),
});

export const getSandboxByName = defineOperation({
	group: 'sandboxes',
	name: 'getByName',
	description:
		'Find a running sandbox by the name it was created with, inside a deployed App.',
	riskLevel: 'read',
	input: z.object({
		environment: environmentField,
		appName: appNameField,
		name: z.string().min(1),
		includeTerminated: z
			.boolean()
			.optional()
			.describe(
				'If none is running, return the most recent terminated one instead.',
			),
		backend: z
			.enum(['default', 'v2'])
			.optional()
			.describe('"v2" for sandboxes created with backend "v2".'),
	}),
	output: SandboxStatusSchema,
	run: async (runtime, input) => {
		const params = { includeTerminated: input.includeTerminated };
		const sandbox =
			input.backend === 'v2'
				? await runtime.client.sandboxes.experimentalFromName(
						input.appName,
						input.name,
						params,
					)
				: await runtime.client.sandboxes.fromName(
						input.appName,
						input.name,
						params,
					);
		return sandboxStatus(sandbox);
	},
});

export const listSandboxes = defineOperation({
	group: 'sandboxes',
	name: 'list',
	description:
		'List running sandboxes in the environment, or in one App, optionally filtered by tags.',
	riskLevel: 'read',
	input: z.object({
		environment: environmentField,
		appName: z
			.string()
			.min(1)
			.optional()
			.describe('Only sandboxes of this App.'),
		tags: z
			.record(z.string(), z.string())
			.optional()
			.describe('Only sandboxes that have all of these tags.'),
		includeV2: z
			.boolean()
			.optional()
			.describe('Also list sandboxes created with backend "v2".'),
		limit: limitField(1000, 100),
	}),
	output: z.object({
		sandboxes: z.array(SandboxRefSchema),
		truncated: z.boolean(),
	}),
	run: async (runtime, input) => {
		const appId = input.appName
			? (await lookupApp(runtime, input.appName)).appId
			: undefined;
		const params = { appId, tags: input.tags };
		const iterator = input.includeV2
			? runtime.client.sandboxes.experimentalList(params)
			: runtime.client.sandboxes.list(params);
		const { items, truncated } = await collect(iterator, input.limit);
		return {
			sandboxes: items.map((sandbox) => ({ sandboxId: sandbox.sandboxId })),
			truncated,
		};
	},
});

export const execSandbox = defineOperation({
	group: 'sandboxes',
	name: 'exec',
	description:
		'Run a command in a running sandbox and wait for it: returns exit code, stdout and stderr. For a shell line pass ["sh", "-c", "..."].',
	riskLevel: 'destructive',
	input: z.object({
		sandboxId: sandboxIdField,
		command: z
			.array(z.string())
			.min(1)
			.describe('Program and arguments, e.g. ["python", "-c", "print(1)"].'),
		stdin: z
			.string()
			.optional()
			.describe("Text written to the command's stdin, which is then closed."),
		workdir: z.string().optional(),
		env: envField,
		secrets: secretNamesField,
		timeoutMs: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('Kill the command after this long (default: no limit).'),
		pty: z.boolean().optional(),
		maxOutputBytes: z
			.number()
			.int()
			.positive()
			.max(10_000_000)
			.default(DEFAULT_MAX_OUTPUT_BYTES)
			.describe('Keep at most this many bytes of stdout and of stderr.'),
	}),
	output: z.object({
		exitCode: z.number(),
		stdout: z.string(),
		stderr: z.string(),
		stdoutTruncated: z.boolean(),
		stderrTruncated: z.boolean(),
	}),
	run: async (runtime, input) => {
		const sandbox = await sandboxFromId(runtime, input.sandboxId);
		const proc = await sandbox.exec(input.command, {
			mode: 'text',
			stdout: 'pipe',
			stderr: 'pipe',
			workdir: input.workdir,
			env: input.env,
			secrets: await resolveSecrets(runtime, input.secrets),
			timeoutMs: input.timeoutMs,
			pty: input.pty,
		});
		const writer = proc.stdin.getWriter();
		if (input.stdin !== undefined) await writer.write(input.stdin);
		await writer.close();
		const [stdout, stderr, exitCode] = await Promise.all([
			readCapped(proc.stdout, input.maxOutputBytes),
			readCapped(proc.stderr, input.maxOutputBytes),
			proc.wait(),
		]);
		return {
			exitCode,
			stdout: stdout.text,
			stderr: stderr.text,
			stdoutTruncated: stdout.truncated,
			stderrTruncated: stderr.truncated,
		};
	},
});

export const terminateSandbox = defineOperation({
	group: 'sandboxes',
	name: 'terminate',
	description:
		'Stop a sandbox and end its billing. Its filesystem is lost unless it was snapshotted.',
	riskLevel: 'destructive',
	irreversible: true,
	input: SandboxIdInput.extend({
		wait: z
			.boolean()
			.optional()
			.describe('Wait for it to finish and return the exit code.'),
	}),
	output: z.object({
		terminated: z.literal(true),
		exitCode: z.number().optional(),
	}),
	run: async (runtime, input) => {
		const sandbox = await sandboxFromId(runtime, input.sandboxId);
		if (input.wait) {
			const exitCode = await sandbox.terminate({ wait: true });
			return { terminated: true as const, exitCode };
		}
		await sandbox.terminate();
		return { terminated: true as const };
	},
});

export const waitSandbox = defineOperation({
	group: 'sandboxes',
	name: 'wait',
	description:
		'Wait for a sandbox to finish (up to timeoutMs) and return its exit code.',
	riskLevel: 'read',
	input: SandboxIdInput.extend({
		timeoutMs: z
			.number()
			.int()
			.positive()
			.max(600_000)
			.default(60_000)
			.describe('Stop waiting after this long (max 10 minutes).'),
	}),
	output: SandboxStatusSchema,
	run: async (runtime, input) => {
		const sandbox = await sandboxFromId(runtime, input.sandboxId);
		let timer: ReturnType<typeof setTimeout> | undefined;
		const timedOut = new Promise<null>((resolve) => {
			timer = setTimeout(() => resolve(null), input.timeoutMs);
		});
		try {
			const exitCode = await Promise.race([sandbox.wait(), timedOut]);
			return {
				sandboxId: sandbox.sandboxId,
				running: exitCode === null,
				exitCode,
			};
		} finally {
			clearTimeout(timer);
		}
	},
});

export const waitUntilReadySandbox = defineOperation({
	group: 'sandboxes',
	name: 'waitUntilReady',
	description:
		'Wait until a sandbox is ready: its readiness probe passes, or it has started when it has none.',
	riskLevel: 'read',
	input: SandboxIdInput.extend({
		timeoutMs: z.number().int().positive().max(600_000).default(60_000),
	}),
	output: z.object({ ready: z.literal(true) }),
	run: async (runtime, input) => {
		const sandbox = await sandboxFromId(runtime, input.sandboxId);
		await sandbox.waitUntilReady(input.timeoutMs);
		return { ready: true as const };
	},
});

export const getSandboxTunnels = defineOperation({
	group: 'sandboxes',
	name: 'tunnels',
	description:
		'Public URLs and TCP endpoints for the ports a sandbox exposes (encryptedPorts, h2Ports, unencryptedPorts).',
	riskLevel: 'read',
	input: SandboxIdInput.extend({
		timeoutMs: z.number().int().positive().max(300_000).default(30_000),
	}),
	output: z.object({ tunnels: z.array(TunnelSchema) }),
	run: async (runtime, input) => {
		const sandbox = await sandboxFromId(runtime, input.sandboxId);
		return { tunnels: tunnelsToJson(await sandbox.tunnels(input.timeoutMs)) };
	},
});

export const getSandboxTags = defineOperation({
	group: 'sandboxes',
	name: 'getTags',
	description: 'The tags on a sandbox.',
	riskLevel: 'read',
	input: SandboxIdInput,
	output: z.object({ tags: z.record(z.string(), z.string()) }),
	run: async (runtime, input) => {
		const sandbox = await sandboxFromId(runtime, input.sandboxId);
		return { tags: await sandbox.getTags() };
	},
});

export const setSandboxTags = defineOperation({
	group: 'sandboxes',
	name: 'setTags',
	description: 'Replace all tags on a sandbox (an empty object clears them).',
	riskLevel: 'write',
	input: SandboxIdInput.extend({ tags: z.record(z.string(), z.string()) }),
	output: OkSchema,
	run: async (runtime, input) => {
		const sandbox = await sandboxFromId(runtime, input.sandboxId);
		await sandbox.setTags(input.tags);
		return { ok: true as const };
	},
});

export const setSandboxName = defineOperation({
	group: 'sandboxes',
	name: 'setName',
	description:
		'Name a running V2 sandbox that has none (once only), so sandboxes.getByName can find it.',
	riskLevel: 'write',
	input: SandboxIdInput.extend({ name: z.string().min(1) }),
	output: OkSchema,
	run: async (runtime, input) => {
		const sandbox = await sandboxFromId(runtime, input.sandboxId);
		await sandbox.experimentalSetName(input.name);
		return { ok: true as const };
	},
});

export const createSandboxConnectToken = defineOperation({
	group: 'sandboxes',
	name: 'createConnectToken',
	description:
		'Create a URL and bearer token for HTTP requests into a sandbox port (default 8080). Treat the token as a secret.',
	riskLevel: 'write',
	input: SandboxIdInput.extend({
		port: z.number().int().min(1).max(65535).optional(),
		userMetadata: z
			.string()
			.optional()
			.describe('Added to forwarded requests as a header by the proxy.'),
	}),
	output: z.object({ url: z.string(), token: z.string() }),
	run: async (runtime, input) => {
		const sandbox = await sandboxFromId(runtime, input.sandboxId);
		return sandbox.createConnectToken({
			port: input.port,
			userMetadata: input.userMetadata,
		});
	},
});

const ttlField = z
	.number()
	.int()
	.positive()
	.nullable()
	.optional()
	.describe(
		'Keep the image this long in ms (default 30 days); null keeps it until deleted.',
	);

export const snapshotSandboxFilesystem = defineOperation({
	group: 'sandboxes',
	name: 'snapshotFilesystem',
	description:
		"Save a sandbox's filesystem as an Image; pass its id to sandboxes.create to start a copy.",
	riskLevel: 'write',
	input: SandboxIdInput.extend({
		timeoutMs: z.number().int().positive().optional(),
		ttlMs: ttlField,
	}),
	output: ImageRefSchema,
	run: async (runtime, input) => {
		const sandbox = await sandboxFromId(runtime, input.sandboxId);
		const image = await sandbox.snapshotFilesystem({
			timeoutMs: input.timeoutMs,
			ttlMs: input.ttlMs,
		});
		return { imageId: image.imageId };
	},
});

export const snapshotSandboxDirectory = defineOperation({
	group: 'sandboxes',
	name: 'snapshotDirectory',
	description:
		'Save one directory of a running sandbox as an Image (mount it elsewhere with sandboxes.mountImage).',
	riskLevel: 'write',
	input: SandboxIdInput.extend({
		path: z.string().min(1),
		timeoutMs: z.number().int().positive().optional(),
		ttlMs: ttlField,
	}),
	output: ImageRefSchema,
	run: async (runtime, input) => {
		const sandbox = await sandboxFromId(runtime, input.sandboxId);
		const image = await sandbox.snapshotDirectory(input.path, {
			timeoutMs: input.timeoutMs,
			ttlMs: input.ttlMs,
		});
		return { imageId: image.imageId };
	},
});

export const snapshotSandboxMemory = defineOperation({
	group: 'sandboxes',
	name: 'snapshotMemory',
	description:
		'Snapshot filesystem and memory of a sandbox created with enableMemorySnapshot (and no Volumes). The sandbox stops once the snapshot is taken; sandboxes.restoreSnapshot starts a copy.',
	riskLevel: 'write',
	input: SandboxIdInput,
	output: z.object({ snapshotId: z.string() }),
	run: async (runtime, input) => {
		const sandbox = await sandboxFromId(runtime, input.sandboxId);
		const snapshot = await sandbox.experimentalSnapshot();
		return { snapshotId: snapshot.snapshotId };
	},
});

export const restoreSandboxSnapshot = defineOperation({
	group: 'sandboxes',
	name: 'restoreSnapshot',
	description:
		'Start a new sandbox from a memory snapshot (billed like any sandbox).',
	riskLevel: 'destructive',
	input: z.object({
		environment: environmentField,
		snapshotId: z.string().min(1),
		name: z
			.string()
			.nullable()
			.optional()
			.describe(
				"Name for the new sandbox; omit to reuse the original's, null for none.",
			),
	}),
	output: SandboxRefSchema,
	run: async (runtime, input) => {
		const snapshot = await runtime.client.sandboxSnapshots.fromId(
			input.snapshotId,
		);
		const sandbox = await runtime.client.sandboxes.experimentalFromSnapshot(
			snapshot,
			input.name === undefined ? undefined : { name: input.name },
		);
		return { sandboxId: sandbox.sandboxId };
	},
});

export const getSandboxExitSnapshot = defineOperation({
	group: 'sandboxes',
	name: 'getExitSnapshot',
	description:
		'The filesystem Image captured when a sandbox created with enableExitSnapshot exited.',
	riskLevel: 'read',
	input: SandboxIdInput.extend({
		timeoutMs: z
			.number()
			.int()
			.min(0)
			.max(600_000)
			.default(60_000)
			.describe('How long to wait for the snapshot (0 = check once).'),
	}),
	output: ImageRefSchema,
	run: async (runtime, input) => {
		const sandbox = await sandboxFromId(runtime, input.sandboxId);
		const image = await sandbox.experimentalGetExitSnapshot({
			timeoutMs: input.timeoutMs,
		});
		return { imageId: image.imageId };
	},
});

export const mountSandboxImage = defineOperation({
	group: 'sandboxes',
	name: 'mountImage',
	description:
		'Mount an Image (e.g. from sandboxes.snapshotDirectory) at a path in a running sandbox; without imageId an empty directory is mounted.',
	riskLevel: 'write',
	input: SandboxIdInput.extend({
		path: z.string().min(1),
		imageId: z.string().min(1).optional(),
	}),
	output: OkSchema,
	run: async (runtime, input) => {
		const sandbox = await sandboxFromId(runtime, input.sandboxId);
		const image = input.imageId
			? await runtime.client.images.fromId(input.imageId)
			: undefined;
		await sandbox.mountImage(input.path, image);
		return { ok: true as const };
	},
});

export const unmountSandboxImage = defineOperation({
	group: 'sandboxes',
	name: 'unmountImage',
	description: 'Unmount an Image mounted with sandboxes.mountImage.',
	riskLevel: 'write',
	input: SandboxIdInput.extend({ path: z.string().min(1) }),
	output: OkSchema,
	run: async (runtime, input) => {
		const sandbox = await sandboxFromId(runtime, input.sandboxId);
		await sandbox.unmountImage(input.path);
		return { ok: true as const };
	},
});

export const updateSandboxNetworkPolicy = defineOperation({
	group: 'sandboxes',
	name: 'updateNetworkPolicy',
	description:
		'Replace the outbound allowlists of a running sandbox. Pass both lists; [] blocks that dimension, ["0.0.0.0/0"] or ["*"] allows all. Only works on a sandbox created with outboundCidrAllowlist/outboundDomainAllowlist (to start open, create it with ["0.0.0.0/0"] and ["*"]); Modal answers 409 otherwise.',
	riskLevel: 'write',
	input: SandboxIdInput.extend({
		outboundCidrAllowlist: z.array(z.string()),
		outboundDomainAllowlist: z.array(z.string()),
	}),
	output: OkSchema,
	run: async (runtime, input) => {
		const sandbox = await sandboxFromId(runtime, input.sandboxId);
		await sandbox.updateNetworkPolicy({
			outboundCidrAllowlist: input.outboundCidrAllowlist,
			outboundDomainAllowlist: input.outboundDomainAllowlist,
		});
		return { ok: true as const };
	},
});

export const reloadSandboxVolumes = defineOperation({
	group: 'sandboxes',
	name: 'reloadVolumes',
	description:
		'Reload the Volumes mounted in a sandbox to see changes committed elsewhere.',
	riskLevel: 'write',
	input: SandboxIdInput.extend({
		timeoutMs: z.number().int().positive().optional(),
	}),
	output: OkSchema,
	run: async (runtime, input) => {
		const sandbox = await sandboxFromId(runtime, input.sandboxId);
		await sandbox.reloadVolumes({ timeoutMs: input.timeoutMs });
		return { ok: true as const };
	},
});

export const pauseSandbox = defineOperation({
	group: 'sandboxes',
	name: 'pause',
	description:
		'Stop the container of a persistent sandbox, keeping its state for sandboxes.resume. Persistent sandboxes are not enabled on every workspace yet.',
	riskLevel: 'write',
	input: SandboxIdInput,
	output: OkSchema,
	run: async (runtime, input) => {
		const sandbox = await sandboxFromId(runtime, input.sandboxId);
		await sandbox.experimentalPause();
		return { ok: true as const };
	},
});

export const resumeSandbox = defineOperation({
	group: 'sandboxes',
	name: 'resume',
	description:
		'Start a paused persistent sandbox again from its saved state (billed while running).',
	riskLevel: 'destructive',
	input: SandboxIdInput,
	output: OkSchema,
	run: async (runtime, input) => {
		const sandbox = await sandboxFromId(runtime, input.sandboxId);
		await sandbox.experimentalResume();
		return { ok: true as const };
	},
});

export const tailSandboxLogs = defineOperation({
	group: 'sandboxes',
	name: 'logs',
	description:
		'The most recent entrypoint log lines of a sandbox (not the output of sandboxes.exec commands).',
	riskLevel: 'read',
	input: SandboxIdInput.extend({
		entries: z.number().int().min(1).max(1000).default(100),
		source: logSourceField,
	}),
	output: z.object({ entries: z.array(LogEntrySchema) }),
	run: async (runtime, input) => {
		const sandbox = await sandboxFromId(runtime, input.sandboxId);
		return {
			entries: await collectLogs(
				sandbox.logs.tail({ entries: input.entries, source: input.source }),
				input.entries,
			),
		};
	},
});

export const fetchSandboxLogs = defineOperation({
	group: 'sandboxes',
	name: 'fetchLogs',
	description:
		"A sandbox's entrypoint logs over a time range, with optional text search.",
	riskLevel: 'read',
	input: SandboxIdInput.extend({
		since: z.iso.datetime().describe('Range start (ISO 8601).'),
		until: z.iso.datetime().optional(),
		source: logSourceField,
		searchText: z.string().optional(),
		limit: limitField(5000, 500),
	}),
	output: z.object({ entries: z.array(LogEntrySchema) }),
	run: async (runtime, input) => {
		const sandbox = await sandboxFromId(runtime, input.sandboxId);
		return {
			entries: await collectLogs(
				sandbox.logs.fetch({
					since: new Date(input.since),
					until: input.until ? new Date(input.until) : undefined,
					source: input.source,
					searchText: input.searchText,
				}),
				input.limit,
			),
		};
	},
});

export const sandboxesOperations = [
	createSandboxOp,
	getSandbox,
	getSandboxByName,
	listSandboxes,
	execSandbox,
	terminateSandbox,
	waitSandbox,
	waitUntilReadySandbox,
	getSandboxTunnels,
	getSandboxTags,
	setSandboxTags,
	setSandboxName,
	createSandboxConnectToken,
	snapshotSandboxFilesystem,
	snapshotSandboxDirectory,
	snapshotSandboxMemory,
	restoreSandboxSnapshot,
	getSandboxExitSnapshot,
	mountSandboxImage,
	unmountSandboxImage,
	updateSandboxNetworkPolicy,
	reloadSandboxVolumes,
	pauseSandbox,
	resumeSandbox,
	tailSandboxLogs,
	fetchSandboxLogs,
] as const;
