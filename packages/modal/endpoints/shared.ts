import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { ModalCredentials, ModalRuntime } from '../client';
import { withModal } from '../client';
import type { ModalContext } from '../index';

export type ModalRiskLevel = 'read' | 'write' | 'destructive';

export type ModalOperation<
	I extends z.ZodType = z.ZodType,
	O extends z.ZodType = z.ZodType,
> = {
	readonly group: string;
	readonly name: string;
	readonly description: string;
	readonly riskLevel: ModalRiskLevel;
	readonly irreversible?: boolean;
	readonly input: I;
	readonly output: O;
	readonly run: (runtime: ModalRuntime, input: z.output<I>) => Promise<unknown>;
};

export function defineOperation<I extends z.ZodType, O extends z.ZodType>(
	operation: ModalOperation<I, O>,
): ModalOperation<I, O> {
	return operation;
}

export function operationKey(operation: ModalOperation): string {
	return `${operation.group}.${operation.name}`;
}

/** The token id and secret for this call: the account's, or the plugin options'. */
export async function resolveModalCredentials(
	ctx: ModalContext,
	environmentOverride: string | undefined,
): Promise<ModalCredentials> {
	const tokenSecret = ctx.key;
	if (!tokenSecret) throw new AuthMissingError('modal', 'api_key');
	const tokenId =
		ctx.options.tokenId ?? (await ctx.keys.get_token_id()) ?? undefined;
	if (!tokenId) throw new AuthMissingError('modal', 'api_key');
	return {
		tokenId,
		tokenSecret,
		environment: environmentOverride || ctx.options.environment || undefined,
	};
}

export function createModalEndpoint<I extends z.ZodType, O extends z.ZodType>(
	operation: ModalOperation<I, O>,
): CorsairEndpoint<ModalContext, z.input<I>, z.output<O>> {
	const key = operationKey(operation);
	return async (ctx, input) => {
		const parsed = operation.input.parse(input ?? {});
		const environment =
			parsed && typeof parsed === 'object' && 'environment' in parsed
				? (parsed as { environment?: string }).environment
				: undefined;
		const credentials = await resolveModalCredentials(ctx, environment);
		const raw = await withModal(credentials, key, (runtime) =>
			operation.run(runtime, parsed),
		);
		const output = operation.output.parse(raw);
		// Only the operation name is logged: inputs can hold secret values,
		// file contents or function arguments.
		await logEventFromContext(
			ctx,
			`modal.${key}`,
			{ operation: key },
			'completed',
		);
		return output;
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared input pieces
// ─────────────────────────────────────────────────────────────────────────────

export const environmentField = z
	.string()
	.min(1)
	.optional()
	.describe(
		'Modal environment to run in. Defaults to the account environment, else the workspace default.',
	);

export const appNameField = z
	.string()
	.min(1)
	.describe('Name of a Modal App (as deployed or as created by apps.create).');

export const sandboxIdField = z
	.string()
	.min(1)
	.describe('Sandbox id (sb-...), as returned by sandboxes.create.');

export const secretNamesField = z
	.array(z.string().min(1))
	.optional()
	.describe('Names of Modal Secrets to inject as environment variables.');

export const envField = z
	.record(z.string(), z.string())
	.optional()
	.describe('Environment variables to set.');

export const VolumeMountSchema = z.object({
	name: z.string().min(1).describe('Name of an existing Modal Volume.'),
	readOnly: z.boolean().optional(),
	subPath: z
		.string()
		.optional()
		.describe('Mount only this path inside the Volume.'),
});

export const volumesField = z
	.record(z.string(), VolumeMountSchema)
	.optional()
	.describe('Volumes to mount, keyed by mount path (e.g. "/data").');

export const ImageSpecSchema = z
	.object({
		imageId: z
			.string()
			.min(1)
			.optional()
			.describe('An existing image id (im-...).'),
		registry: z
			.string()
			.min(1)
			.optional()
			.describe('A registry image tag, e.g. "python:3.13-slim".'),
		registryType: z
			.enum(['public', 'aws_ecr', 'gcp_artifact_registry'])
			.optional()
			.describe(
				'Where `registry` lives: a public or private Docker registry (default), AWS ECR or GCP Artifact Registry.',
			),
		registrySecret: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Modal Secret with registry credentials (REGISTRY_USERNAME/REGISTRY_PASSWORD, AWS or GCP keys). Required for ECR and Artifact Registry.',
			),
		publishedName: z
			.string()
			.min(1)
			.optional()
			.describe('Name of an image published with images.publish.'),
		dockerfileCommands: z
			.array(z.string().min(1))
			.optional()
			.describe(
				'Dockerfile commands (RUN, ENV, WORKDIR, ...) layered on top of the base image. COPY from a local context is not supported; COPY --from=<image> is.',
			),
		dockerfileEnv: envField,
		dockerfileSecrets: secretNamesField,
		forceBuild: z
			.boolean()
			.optional()
			.describe('Rebuild the layers even if a cached build exists.'),
	})
	.refine(
		(spec) =>
			[spec.imageId, spec.registry, spec.publishedName].filter(Boolean)
				.length === 1,
		{ message: 'Give exactly one of imageId, registry or publishedName.' },
	);

export type ImageSpec = z.output<typeof ImageSpecSchema>;

export const TunnelSchema = z.object({
	port: z.number(),
	host: z.string(),
	url: z.string(),
	tlsPort: z.number(),
	unencryptedHost: z.string().optional(),
	unencryptedPort: z.number().optional(),
});

export const LogEntrySchema = z.object({
	message: z.string(),
	source: z.string(),
	timestamp: z.string(),
	objectId: z.string().optional(),
});

export const logSourceField = z
	.enum(['system', 'stdout', 'stderr'])
	.optional()
	.describe('Only entries from this stream.');

export const OkSchema = z.object({ ok: z.literal(true) });

// ─────────────────────────────────────────────────────────────────────────────
// Runtime helpers
// ─────────────────────────────────────────────────────────────────────────────

type Sdk = ModalRuntime['sdk'];
export type ModalSecret = InstanceType<Sdk['Secret']>;
export type ModalVolume = InstanceType<Sdk['Volume']>;
export type ModalImage = InstanceType<Sdk['Image']>;
export type ModalSandbox = InstanceType<Sdk['Sandbox']>;
export type ModalTunnel = InstanceType<Sdk['Tunnel']>;
export type ModalFunction = InstanceType<Sdk['Function_']>;

export async function resolveSecrets(
	runtime: ModalRuntime,
	names: string[] | undefined,
	inline?: Record<string, string>,
): Promise<ModalSecret[] | undefined> {
	const secrets: ModalSecret[] = [];
	for (const name of names ?? []) {
		secrets.push(await runtime.client.secrets.fromName(name));
	}
	if (inline && Object.keys(inline).length > 0) {
		secrets.push(await runtime.client.secrets.fromObject(inline));
	}
	return secrets.length > 0 ? secrets : undefined;
}

export async function resolveVolumes(
	runtime: ModalRuntime,
	mounts: Record<string, z.output<typeof VolumeMountSchema>> | undefined,
): Promise<Record<string, ModalVolume> | undefined> {
	if (!mounts || Object.keys(mounts).length === 0) return undefined;
	const volumes: Record<string, ModalVolume> = {};
	for (const [path, mount] of Object.entries(mounts)) {
		const volume = await runtime.client.volumes.fromName(mount.name);
		volumes[path] =
			mount.readOnly !== undefined || mount.subPath !== undefined
				? volume.withMountOptions({
						readOnly: mount.readOnly,
						subPath: mount.subPath,
					})
				: volume;
	}
	return volumes;
}

/** An Image handle for the spec; registry images build lazily on first use. */
export async function resolveImage(
	runtime: ModalRuntime,
	spec: ImageSpec,
): Promise<ModalImage> {
	const { client } = runtime;
	let image: ModalImage;
	if (spec.imageId) {
		image = await client.images.fromId(spec.imageId);
	} else if (spec.publishedName) {
		image = await client.images.fromName(spec.publishedName);
	} else {
		const tag = spec.registry as string;
		const secret = spec.registrySecret
			? await client.secrets.fromName(spec.registrySecret)
			: undefined;
		switch (spec.registryType) {
			case 'aws_ecr':
				if (!secret) throw new Error('[modal] aws_ecr needs registrySecret');
				image = client.images.fromAwsEcr(tag, secret);
				break;
			case 'gcp_artifact_registry':
				if (!secret) {
					throw new Error('[modal] gcp_artifact_registry needs registrySecret');
				}
				image = client.images.fromGcpArtifactRegistry(tag, secret);
				break;
			default:
				image = client.images.fromRegistry(tag, secret);
		}
	}
	if (spec.dockerfileCommands?.length) {
		image = image.dockerfileCommands(spec.dockerfileCommands, {
			env: spec.dockerfileEnv,
			secrets: await resolveSecrets(runtime, spec.dockerfileSecrets),
			forceBuild: spec.forceBuild,
		});
	}
	return image;
}

export function tunnelToJson(port: number | string, tunnel: ModalTunnel) {
	return {
		port: Number(port),
		host: tunnel.host,
		url: tunnel.url,
		tlsPort: tunnel.port,
		unencryptedHost: tunnel.unencryptedHost,
		unencryptedPort: tunnel.unencryptedPort,
	};
}

export function tunnelsToJson(tunnels: Record<number, ModalTunnel>) {
	return Object.entries(tunnels).map(([port, tunnel]) =>
		tunnelToJson(port, tunnel),
	);
}

type LogEntryLike = {
	message: string;
	source: string;
	timestamp: Date;
	objectId?: string;
};

export async function collectLogs(
	entries: AsyncIterable<LogEntryLike>,
	limit: number,
) {
	const out: z.output<typeof LogEntrySchema>[] = [];
	for await (const entry of entries) {
		out.push({
			message: entry.message,
			source: entry.source,
			timestamp: entry.timestamp.toISOString(),
			objectId: entry.objectId,
		});
		if (out.length >= limit) break;
	}
	return out;
}

export async function collect<T>(
	items: AsyncIterable<T>,
	limit: number,
): Promise<{ items: T[]; truncated: boolean }> {
	const out: T[] = [];
	for await (const item of items) {
		if (out.length >= limit) return { items: out, truncated: true };
		out.push(item);
	}
	return { items: out, truncated: false };
}

export const limitField = (max: number, def: number) =>
	z
		.number()
		.int()
		.min(1)
		.max(max)
		.default(def)
		.describe(`Most items to return (1-${max}, default ${def}).`);

/** Unix seconds (Modal's list RPCs) to ISO; 0 means unset. */
export function isoFromSeconds(
	seconds: number | undefined,
): string | undefined {
	if (!seconds) return undefined;
	return new Date(seconds * 1000).toISOString();
}

export function isoDate(date: Date | undefined): string | undefined {
	return date ? date.toISOString() : undefined;
}

/** Read a stream fully but keep at most `maxBytes`, so output can't exhaust memory. */
export async function readCapped(
	stream: ReadableStream<string>,
	maxBytes: number,
): Promise<{ text: string; truncated: boolean }> {
	const reader = stream.getReader();
	let text = '';
	let size = 0;
	let truncated = false;
	for (;;) {
		const { done, value } = await reader.read();
		if (done) break;
		if (truncated || value === undefined) continue;
		const bytes = Buffer.byteLength(value);
		if (size + bytes <= maxBytes) {
			text += value;
			size += bytes;
		} else {
			const room = maxBytes - size;
			text += Buffer.from(value).subarray(0, room).toString('utf8');
			size = maxBytes;
			truncated = true;
		}
	}
	return { text, truncated };
}

const LIST_PAGE_SIZE = 100;

export const createdBeforeField = z
	.number()
	.optional()
	.describe(
		'Cursor: only objects created before this Unix time (pass nextCreatedBefore from the previous page).',
	);

/**
 * Page through one of Modal's list RPCs (newest first, cursor = created_at
 * of the last item), the way Modal's own CLI does.
 */
export async function pagedList<T extends { createdAt: number }>(
	fetchPage: (pagination: {
		maxObjects: number;
		createdBefore: number;
	}) => Promise<T[]>,
	limit: number,
	createdBefore: number | undefined,
): Promise<{ items: T[]; nextCreatedBefore?: number }> {
	const items: T[] = [];
	let cursor = createdBefore ?? 0;
	while (items.length < limit) {
		const maxObjects = Math.min(LIST_PAGE_SIZE, limit - items.length);
		const page = await fetchPage({ maxObjects, createdBefore: cursor });
		items.push(...page);
		const last = page[page.length - 1];
		if (page.length < maxObjects || !last) {
			return { items };
		}
		cursor = last.createdAt;
	}
	const last = items[items.length - 1];
	return { items, nextCreatedBefore: last?.createdAt };
}
