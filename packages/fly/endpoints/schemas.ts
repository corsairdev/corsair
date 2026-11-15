import { z } from 'zod';

// Shapes follow Fly's OpenAPI spec (https://docs.fly.io/api/machines/openapi.json,
// fetched 2026-11-16) and the responses api.machines.dev returned in the live run.
// The spec marks no response field required, so output fields are nullish.

const str = z.string().nullish();
const int = z.number().int().nullish();
const num = z.number().nullish();
const bool = z.boolean().nullish();
const strings = z.array(z.string()).nullish();
const stringMap = z.record(z.string(), z.string()).nullish();

/** Path values: Fly app names, Machine/volume IDs, hostnames, IPs. */
export const nonEmpty = z.string().trim().min(1);
export const appName = nonEmpty.describe('Fly app name');
export const machineId = nonEmpty.describe('Machine ID');
export const volumeId = nonEmpty.describe(
	'Volume ID, such as vol_1234567890abcdef',
);
export const orgSlug = nonEmpty.describe(
	"Organization slug, or 'personal' for your personal organization",
);
export const leaseNonce = nonEmpty.describe(
	'Nonce of a lease you hold on the Machine (sent as fly-machine-lease-nonce)',
);

export const ok = z.object({ ok: z.boolean() });

// ---------- apps ----------
export const app = z.object({
	id: z.string(),
	name: z.string(),
	internal_numeric_id: int,
	machine_count: int,
	volume_count: int,
	network: str,
	network_cidr: str,
	cname_target: str,
	app_role: str,
	// Output enums accept values Fly adds later; inputs stay strict.
	status: z.enum(['pending', 'deployed', 'suspended']).or(z.string()).nullish(),
	organization: z
		.object({ name: str, slug: str, internal_numeric_id: int })
		.nullish(),
});

// ---------- machines ----------
const guestOutput = z
	.object({
		cpu_kind: str,
		cpus: int,
		memory_mb: int,
		max_memory_mb: int,
	})
	.passthrough();

// Fly's MachineConfig has ~25 nested sections (services, checks, files, init…);
// the common ones are typed and the rest are kept as Fly returns them.
const machineConfigOutput = z
	.object({
		image: str,
		guest: guestOutput.nullish(),
		env: stringMap,
		metadata: stringMap,
		auto_destroy: bool,
		schedule: str,
		restart: z
			.object({ policy: str, max_retries: int })
			.passthrough()
			.nullish(),
		mounts: z
			.array(
				z
					.object({ volume: str, path: str, name: str, size_gb: int })
					.passthrough(),
			)
			.nullish(),
		services: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.passthrough();

export const machineEvent = z.object({
	id: str,
	type: str,
	status: str,
	source: str,
	timestamp: int,
	// Event-specific details (exit codes, new versions); shape varies by type.
	request: z.record(z.string(), z.unknown()).nullish(),
});

export const machine = z.object({
	id: z.string(),
	name: str,
	state: str,
	region: str,
	instance_id: str,
	version: str,
	private_ip: str,
	cordoned: bool,
	host_status: z
		.enum(['ok', 'unknown', 'unreachable'])
		.or(z.string())
		.nullish(),
	created_at: str,
	updated_at: str,
	config: machineConfigOutput.nullish(),
	incomplete_config: machineConfigOutput.nullish(),
	image_ref: z
		.object({
			registry: str,
			repository: str,
			tag: str,
			digest: str,
			labels: stringMap,
		})
		.nullish(),
	events: z.array(machineEvent).nullish(),
	checks: z
		.array(
			z.object({
				name: str,
				status: z
					.enum(['passing', 'warning', 'critical'])
					.or(z.string())
					.nullish(),
				output: str,
				updated_at: str,
			}),
		)
		.nullish(),
	lease: z.object({ owner: str, description: str, expires_at: int }).nullish(),
	/** Lease nonce, returned only when the Machine was created with lease_ttl. */
	nonce: str,
});

export const orgMachine = z.object({
	id: z.string(),
	app_name: str,
	name: str,
	state: str,
	region: str,
	version: str,
	private_ip: str,
	created_at: str,
	updated_at: str,
	config: z
		.object({ image: str, guest: guestOutput.nullish(), metadata: stringMap })
		.nullish(),
});

export const lease = z.object({
	nonce: str,
	owner: str,
	description: str,
	expires_at: int,
	version: str,
});

export const processStat = z.object({
	pid: int,
	command: str,
	directory: str,
	cpu: int,
	rss: int,
	rtime: int,
	stime: int,
	listen_sockets: z.array(z.object({ address: str, proto: str })).nullish(),
});

// ---------- machine config input ----------
const signal = z.enum([
	'SIGHUP',
	'SIGINT',
	'SIGQUIT',
	'SIGKILL',
	'SIGUSR1',
	'SIGUSR2',
	'SIGTERM',
]);
export const stopSignal = signal;

const guestInput = z
	.object({
		cpu_kind: z.enum(['shared', 'performance']).optional(),
		cpus: z.number().int().positive().optional(),
		memory_mb: z.number().int().positive().optional(),
		max_memory_mb: z.number().int().positive().optional(),
	})
	.strict();

const portInput = z
	.object({
		port: z.number().int().optional(),
		start_port: z.number().int().optional(),
		end_port: z.number().int().optional(),
		handlers: z.array(z.string()).optional(),
		force_https: z.boolean().optional(),
	})
	// TLS, HTTP and proxy-protocol options go to Fly as given.
	.catchall(z.unknown());

const serviceInput = z
	.object({
		protocol: z.enum(['tcp', 'udp']).optional(),
		internal_port: z.number().int().optional(),
		ports: z.array(portInput).optional(),
		autostart: z.boolean().optional(),
		autostop: z
			.union([z.boolean(), z.enum(['off', 'stop', 'suspend'])])
			.optional(),
		min_machines_running: z.number().int().optional(),
	})
	// Concurrency limits and service checks go to Fly as given.
	.catchall(z.unknown());

export const machineConfigInput = z
	.object({
		image: nonEmpty.describe('Container image to run, such as nginx:alpine'),
		guest: guestInput.optional(),
		env: z.record(z.string(), z.string()).optional(),
		metadata: z.record(z.string(), z.string()).optional(),
		services: z.array(serviceInput).optional(),
		mounts: z
			.array(
				z
					.object({ volume: nonEmpty, path: nonEmpty })
					// Automatic-extension settings go to Fly as given.
					.catchall(z.unknown()),
			)
			.optional(),
		restart: z
			.object({
				policy: z.enum(['no', 'always', 'on-failure', 'spot-price']).optional(),
				max_retries: z.number().int().optional(),
			})
			.strict()
			.optional(),
		auto_destroy: z.boolean().optional(),
		schedule: z.enum(['hourly', 'daily', 'weekly', 'monthly']).optional(),
		stop_config: z
			.object({ signal: signal.optional(), timeout: z.string().optional() })
			.strict()
			.optional(),
	})
	// The other MachineConfig sections (checks, files, init, processes, dns,
	// containers…) are sent to Fly unchanged; Fly validates them.
	.catchall(z.unknown());

// ---------- volumes ----------
export const volume = z.object({
	id: z.string(),
	name: str,
	state: str,
	region: str,
	zone: str,
	size_gb: int,
	encrypted: bool,
	fstype: str,
	type: z.enum(['local', 'cache']).or(z.string()).nullish(),
	attached_machine_id: str,
	attached_alloc_id: str,
	auto_backup_enabled: bool,
	snapshot_retention: int,
	block_size: int,
	blocks: int,
	blocks_avail: int,
	blocks_free: int,
	bytes_total: int,
	bytes_used: int,
	host_status: z
		.enum(['ok', 'unknown', 'unreachable'])
		.or(z.string())
		.nullish(),
	created_at: str,
	required_host_features: strings,
});

export const orgVolume = volume.extend({ app_name: str, updated_at: str });

export const volumeSnapshot = z.object({
	id: z.string(),
	status: str,
	digest: str,
	size: int,
	volume_size: int,
	retention_days: int,
	created_at: str,
});

// ---------- secrets ----------
// Secret values are never returned: Fly echoes them on set, and they would
// land in tool results and logs.
export const secret = z.object({
	name: z.string(),
	digest: str,
	created_at: str,
	updated_at: str,
});

// ---------- certificates ----------
const certificateEntry = z.object({
	source: z.enum(['custom', 'fly']).or(z.string()).nullish(),
	status: str,
	created_at: str,
	expires_at: str,
	issuer: str,
	issued: z
		.array(z.object({ certificate_authority: str, expires_at: str, type: str }))
		.nullish(),
});

export const certificateSummary = z.object({
	hostname: z.string(),
	status: str,
	configured: bool,
	acme_requested: bool,
	acme_alpn_configured: bool,
	acme_dns_configured: bool,
	acme_http_configured: bool,
	ownership_txt_configured: bool,
	has_custom_certificate: bool,
	has_fly_certificate: bool,
	dns_provider: str,
	created_at: str,
	updated_at: str,
});

export const certificateDetail = z.object({
	hostname: z.string(),
	status: str,
	configured: bool,
	acme_requested: bool,
	dns_provider: str,
	rate_limited_until: str,
	certificates: z.array(certificateEntry).nullish(),
	dns_requirements: z
		.object({
			a: strings,
			aaaa: strings,
			cname: str,
			acme_challenge: z.object({ name: str, target: str }).nullish(),
			ownership: z
				.object({ name: str, app_value: str, org_value: str })
				.nullish(),
		})
		.nullish(),
	validation: z
		.object({
			alpn_configured: bool,
			dns_configured: bool,
			http_configured: bool,
			ownership_txt_configured: bool,
		})
		.nullish(),
	validation_errors: z
		.array(
			z.object({ code: str, message: str, remediation: str, timestamp: str }),
		)
		.nullish(),
});

export const certificateCheck = certificateDetail.extend({
	dns_records: z
		.object({
			a: strings,
			aaaa: strings,
			cname: strings,
			acme_challenge_cname: str,
			ownership_txt: str,
			resolved_addresses: strings,
			soa: str,
		})
		.nullish(),
});

// ---------- IP assignments ----------
const ipNetwork = z.object({ name: str, org_slug: str }).nullish();
export const ipAssignment = z.object({
	ip: str,
	region: str,
	service_name: str,
	shared: bool,
	egress: bool,
	created_at: str,
	network: ipNetwork,
	ip_pair: z.object({ v4: str, v6: str }).nullish(),
});

// ---------- platform / tokens ----------
export const region = z.object({
	code: z.string(),
	name: str,
	latitude: num,
	longitude: num,
	gateway_available: bool,
	mpg_available: bool,
	requires_paid_plan: bool,
	deprecated: bool,
	geo_region: str,
	capacity: int,
});

export const tokenInfo = z.object({
	token_id: str,
	organization: str,
	org_slug: str,
	apps: strings,
	restricted_to_machine: str,
	/** Opaque 7-character hash of the user ID, not an email address. */
	user: str,
});
