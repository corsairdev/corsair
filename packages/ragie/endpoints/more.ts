import { toFileOutput } from 'corsair/http';
import { z } from 'zod';
import type { RagieContext } from '..';
import type { RagieRequest } from '../client';
import { segment } from '../client';
import { call } from './call';

// The routes the first version left out: partitions, entity extraction
// (instructions, entities, extraction logs), document elements, single
// chunks and their media, document source files, connection stats and
// authenticators. Shapes follow Ragie's Speakeasy SDK (ragie 2.0.0, built
// from api.ragie.ai/openapi.json) with snake_case wire names. Responses are
// loose: fields the API adds pass through.

type LogFields = Record<string, string | number | boolean | undefined>;

function op<Input extends z.ZodType, Output extends z.ZodType>(spec: {
	event: string;
	input: Input;
	output: Output;
	request: (parsed: z.output<Input>) => RagieRequest;
	shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
	log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
}) {
	const endpoint = (ctx: RagieContext, input: z.input<Input>) =>
		call(
			ctx,
			{ event: spec.event, input: spec.input, output: spec.output },
			input,
			spec.request,
			{ shape: spec.shape, log: spec.log },
		);
	return Object.assign(endpoint, {
		schemas: { input: spec.input, output: spec.output },
	});
}

const Id = (what: string) => z.string().min(1).describe(`The ${what} id`);
const Partition = z
	.string()
	.optional()
	.describe('The partition to read from; omit for the default partition');
const Page = {
	cursor: z.string().optional().describe('Cursor from the previous page'),
	page_size: z.number().int().min(1).max(100).optional(),
};
const PaginationSchema = z
	.object({
		next_cursor: z.string().nullish(),
		total_count: z.number().nullish(),
	})
	.loose();
const OkSchema = z.object({ status: z.string().optional() }).loose();
const Record = z.record(z.string(), z.unknown());

// unknown: raw is core's BinaryResponse; anything else fails here.
function asFile(raw: unknown, filename: string) {
	const binary = raw as { bytes?: Uint8Array; contentType?: string };
	if (!binary?.bytes) throw new Error('Ragie answered without a file body');
	return toFileOutput(binary.bytes, binary.contentType, { filename });
}

// ── partitions ───────────────────────────────────────────────────────────────

const LIMIT_FIELDS = {
	pages_hosted_limit_monthly: z.number().int().nullish(),
	pages_processed_limit_monthly: z.number().int().nullish(),
	pages_hosted_limit_max: z.number().int().nullish(),
	pages_processed_limit_max: z.number().int().nullish(),
	audio_processed_limit_monthly: z.number().nullish(),
	audio_processed_limit_max: z.number().nullish(),
	video_processed_limit_monthly: z.number().nullish(),
	video_processed_limit_max: z.number().nullish(),
	media_streamed_limit_monthly: z.number().nullish(),
	media_streamed_limit_max: z.number().nullish(),
	media_hosted_limit_monthly: z.number().nullish(),
	media_hosted_limit_max: z.number().nullish(),
};

const PartitionSchema = z
	.object({
		name: z.string(),
		is_default: z.boolean().optional(),
		limit_exceeded_at: z.string().nullish(),
		description: z.string().nullish(),
		context_aware: z.boolean().optional(),
		metadata_schema: Record.nullish(),
		limits: z.object(LIMIT_FIELDS).loose().optional(),
		stats: Record.optional(),
	})
	.loose();

const PartitionName = z
	.string()
	.min(1)
	.describe('Partition name: lowercase letters, numbers, _ and -');

export const partitionsList = op({
	event: 'partitions.list',
	input: z.object(Page),
	output: z
		.object({
			partitions: z.array(PartitionSchema),
			pagination: PaginationSchema.optional(),
		})
		.loose(),
	request: (query) => ({ method: 'GET', path: '/partitions', query }),
	log: (_, result) => ({ count: result.partitions.length }),
});

export const partitionsCreate = op({
	event: 'partitions.create',
	input: z.object({
		name: PartitionName,
		description: z.string().nullish(),
		metadata_schema: Record.nullish().describe(
			'JSON schema for document metadata in this partition',
		),
		...LIMIT_FIELDS,
	}),
	output: PartitionSchema,
	request: (body) => ({ method: 'POST', path: '/partitions', body }),
	log: ({ name }) => ({ partition: name }),
});

export const partitionsGet = op({
	event: 'partitions.get',
	input: z.object({ partition_id: PartitionName }),
	output: PartitionSchema,
	request: ({ partition_id }) => ({
		method: 'GET',
		path: `/partitions/${segment(partition_id)}`,
	}),
});

export const partitionsUpdate = op({
	event: 'partitions.update',
	input: z.object({
		partition_id: PartitionName,
		context_aware: z.boolean().nullish(),
		description: z.string().nullish(),
		metadata_schema: Record.nullish(),
	}),
	output: PartitionSchema,
	request: ({ partition_id, ...body }) => ({
		method: 'PATCH',
		path: `/partitions/${segment(partition_id)}`,
		body,
	}),
});

export const partitionsSetLimits = op({
	event: 'partitions.setLimits',
	input: z.object({ partition_id: PartitionName, ...LIMIT_FIELDS }),
	output: PartitionSchema,
	request: ({ partition_id, ...body }) => ({
		method: 'PUT',
		path: `/partitions/${segment(partition_id)}/limits`,
		body,
	}),
});

export const partitionsDelete = op({
	event: 'partitions.delete',
	input: z.object({
		partition_id: PartitionName,
		async: z
			.boolean()
			.optional()
			.describe('Delete in the background and answer at once'),
	}),
	output: OkSchema,
	request: ({ partition_id, async }) => ({
		method: 'DELETE',
		path: `/partitions/${segment(partition_id)}`,
		query: { async },
	}),
	shape: (raw) => raw ?? {},
});

// ── instructions / entities ─────────────────────────────────────────────────

const InstructionSchema = z
	.object({
		id: z.string(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		name: z.string(),
		active: z.boolean().optional(),
		scope: z.string().optional(),
		prompt: z.string().optional(),
		context_template: z.string().nullish(),
		entity_schema: Record.optional(),
		filter: Record.nullish(),
		partition: z.string().nullish(),
	})
	.loose();

const InstructionFields = {
	active: z.boolean().optional(),
	scope: z
		.enum(['document', 'chunk'])
		.optional()
		.describe('Run once per document, or once per chunk'),
	context_template: z.string().optional(),
	filter: Record.optional().describe(
		'Metadata filter for which documents it runs on',
	),
};

export const instructionsList = op({
	event: 'instructions.list',
	input: z.object({}),
	output: z.object({ instructions: z.array(InstructionSchema) }),
	request: () => ({ method: 'GET', path: '/instructions' }),
	shape: (raw) => ({ instructions: z.array(z.unknown()).parse(raw) }),
	log: (_, result) => ({ count: result.instructions.length }),
});

export const instructionsCreate = op({
	event: 'instructions.create',
	input: z.object({
		name: z.string().min(1).describe('Unique instruction name'),
		prompt: z.string().min(1).describe('What to extract'),
		entity_schema: Record.describe('JSON schema of each extracted entity'),
		partition: z.string().optional(),
		...InstructionFields,
	}),
	output: InstructionSchema,
	request: (body) => ({ method: 'POST', path: '/instructions', body }),
	log: (_, result) => ({ instructionId: result.id }),
});

export const instructionsUpdate = op({
	event: 'instructions.update',
	input: z.object({
		instruction_id: Id('instruction'),
		name: z.string().optional(),
		prompt: z.string().optional(),
		entity_schema: Record.optional(),
		...InstructionFields,
	}),
	output: InstructionSchema,
	request: ({ instruction_id, ...body }) => ({
		method: 'PATCH',
		path: `/instructions/${segment(instruction_id)}`,
		body,
	}),
	log: ({ instruction_id }) => ({ instructionId: instruction_id }),
});

export const instructionsDelete = op({
	event: 'instructions.delete',
	input: z.object({ instruction_id: Id('instruction') }),
	output: OkSchema,
	request: ({ instruction_id }) => ({
		method: 'DELETE',
		path: `/instructions/${segment(instruction_id)}`,
	}),
	shape: (raw) => raw ?? {},
	log: ({ instruction_id }) => ({ instructionId: instruction_id }),
});

const EntitySchema = z
	.object({
		id: z.string(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		instruction_id: z.string(),
		document_id: z.string(),
		chunk_id: z.string().nullish(),
		data: Record,
	})
	.loose();

const EntityListSchema = z
	.object({
		entities: z.array(EntitySchema),
		pagination: PaginationSchema.optional(),
	})
	.loose();

export const instructionsListEntities = op({
	event: 'instructions.listEntities',
	input: z.object({
		instruction_id: Id('instruction'),
		partition: Partition,
		...Page,
	}),
	output: EntityListSchema,
	request: ({ instruction_id, partition, ...query }) => ({
		method: 'GET',
		path: `/instructions/${segment(instruction_id)}/entities`,
		query,
		partition,
	}),
	log: (_, result) => ({ count: result.entities.length }),
});

export const instructionsListExtractionLogs = op({
	event: 'instructions.listExtractionLogs',
	input: z.object({
		instruction_id: Id('instruction'),
		partition: Partition,
		document_ids: z.array(z.string()).optional(),
		status: z.enum(['extracted', 'not_found', 'error']).optional(),
		created_after: z.string().optional().describe('ISO 8601 datetime'),
		created_before: z.string().optional().describe('ISO 8601 datetime'),
		...Page,
	}),
	output: z
		.object({
			logs: z.array(
				z
					.object({
						id: z.string(),
						instruction_id: z.string().optional(),
						document_id: z.string().optional(),
						scope: z.string().optional(),
						chunk_index: z.number().nullish(),
						status: z.string(),
						reason_code: z.string().nullish(),
						reason: z.string().nullish(),
						errors: z.array(z.string()).optional(),
						page_count: z.number().optional(),
					})
					.loose(),
			),
			pagination: PaginationSchema.optional(),
		})
		.loose(),
	request: ({ instruction_id, partition, document_ids, ...query }) => ({
		method: 'GET',
		path: `/instructions/${segment(instruction_id)}/entity-extraction-logs`,
		query: { ...query, document_ids },
		partition,
	}),
	log: (_, result) => ({ count: result.logs.length }),
});

export const documentsListEntities = op({
	event: 'documents.listEntities',
	input: z.object({
		document_id: Id('document'),
		partition: Partition,
		...Page,
	}),
	output: EntityListSchema,
	request: ({ document_id, partition, ...query }) => ({
		method: 'GET',
		path: `/documents/${segment(document_id)}/entities`,
		query,
		partition,
	}),
	log: (_, result) => ({ count: result.entities.length }),
});

// ── document elements, chunks, source ───────────────────────────────────────

const ElementSchema = z
	.object({
		id: z.string(),
		document_id: z.string().optional(),
		type: z.string().optional(),
		index: z.number().optional(),
	})
	.loose();

export const documentsListElements = op({
	event: 'documents.listElements',
	input: z.object({
		document_id: Id('document'),
		partition: Partition,
		type: z
			.array(z.string())
			.optional()
			.describe('Only these element types (text, table, image, title...)'),
		index_start: z.number().int().optional(),
		index_end: z.number().int().optional(),
		...Page,
	}),
	output: z
		.object({
			document_elements: z.array(ElementSchema),
			pagination: PaginationSchema.optional(),
		})
		.loose(),
	request: ({ document_id, partition, type, ...query }) => ({
		method: 'GET',
		path: `/documents/${segment(document_id)}/elements`,
		// Repeated keys, as the API's form-style array query expects.
		query: { ...query, type },
		partition,
	}),
	log: (_, result) => ({ count: result.document_elements.length }),
});

export const elementsGet = op({
	event: 'elements.get',
	input: z.object({ element_id: Id('element') }),
	output: ElementSchema,
	request: ({ element_id }) => ({
		method: 'GET',
		path: `/elements/${segment(element_id)}`,
	}),
});

export const documentsGetChunk = op({
	event: 'documents.getChunk',
	input: z.object({
		document_id: Id('document'),
		chunk_id: Id('chunk'),
		partition: Partition,
	}),
	output: z
		.object({
			id: z.string(),
			index: z.number().optional(),
			text: z.string(),
			metadata: Record.optional(),
			links: Record.optional(),
			modality_data: Record.nullish(),
		})
		.loose(),
	request: ({ document_id, chunk_id, partition }) => ({
		method: 'GET',
		path: `/documents/${segment(document_id)}/chunks/${segment(chunk_id)}`,
		partition,
	}),
});

const MEDIA_TYPES = [
	'text/plain',
	'audio/mpeg',
	'video/mp4',
	'image/webp',
	'image/heic',
	'image/bmp',
	'image/png',
	'image/jpeg',
	'image/tiff',
] as const;

export const documentsGetChunkContent = op({
	event: 'documents.getChunkContent',
	input: z.object({
		document_id: Id('document'),
		chunk_id: Id('chunk'),
		partition: Partition,
		media_type: z
			.enum(MEDIA_TYPES)
			.optional()
			.describe('The format to return; defaults to the chunk text'),
		range: z
			.string()
			.optional()
			.describe('HTTP Range for audio and video, e.g. bytes=0-1023'),
	}),
	output: z.object({}).loose(),
	request: ({ document_id, chunk_id, partition, media_type }) => ({
		method: 'GET',
		path: `/documents/${segment(document_id)}/chunks/${segment(chunk_id)}/content`,
		query: { media_type },
		partition,
		responseType: 'binary',
	}),
	shape: (raw, { chunk_id }) => asFile(raw, chunk_id),
});

export const documentsGetSource = op({
	event: 'documents.getSource',
	input: z.object({ document_id: Id('document'), partition: Partition }),
	output: z.object({}).loose(),
	request: ({ document_id, partition }) => ({
		method: 'GET',
		path: `/documents/${segment(document_id)}/source`,
		partition,
		responseType: 'binary',
	}),
	shape: (raw, { document_id }) => asFile(raw, document_id),
	log: ({ document_id }) => ({ documentId: document_id }),
});

// ── connections ──────────────────────────────────────────────────────────────

export const connectionsGetStats = op({
	event: 'connections.getStats',
	input: z.object({ connection_id: Id('connection') }),
	output: z
		.object({ document_count: z.number(), page_count: z.number() })
		.loose(),
	request: ({ connection_id }) => ({
		method: 'GET',
		path: `/connections/${segment(connection_id)}/stats`,
	}),
});

// ── authenticators ───────────────────────────────────────────────────────────

const AuthenticatorSchema = z
	.object({ id: z.string(), name: z.string(), provider: z.string() })
	.loose();

export const authenticatorsList = op({
	event: 'authenticators.list',
	input: z.object(Page),
	output: z
		.object({
			authenticators: z.array(AuthenticatorSchema),
			pagination: PaginationSchema.optional(),
		})
		.loose(),
	request: (query) => ({ method: 'GET', path: '/authenticators', query }),
	log: (_, result) => ({ count: result.authenticators.length }),
});

export const authenticatorsCreate = op({
	event: 'authenticators.create',
	input: z
		.object({
			provider: z
				.string()
				.min(1)
				.describe(
					'OAuth provider: google, atlassian, dropbox, hubspot, microsoft, notion, salesforce or slack',
				),
			name: z.string().min(1),
			client_id: z.string().min(1),
			client_secret: z.string().min(1),
			domain: z.string().nullish(),
			project_number: z.string().nullish(),
		})
		.loose()
		.describe(
			"Your own OAuth app for a provider, so connections show your app's name",
		),
	output: AuthenticatorSchema,
	request: (body) => ({ method: 'POST', path: '/authenticators', body }),
	// The client secret never goes to the log.
	log: (_, result) => ({ authenticatorId: result.id }),
});

export const authenticatorsCreateConnection = op({
	event: 'authenticators.createConnection',
	input: z.object({
		authenticator_id: Id('authenticator'),
		connection: Record.describe(
			"The provider connection: provider, data and the user's OAuth credentials",
		),
		partition_strategy: z
			.union([z.enum(['fast', 'hi_res']), Record])
			.describe('fast, hi_res, or a per-media-type mode object'),
		partition: z.string().nullish(),
		page_limit: z.number().int().nullish(),
		config: Record.nullish(),
		metadata: Record.optional(),
		workflow: z.string().nullish(),
		sync_filter: Record.optional(),
	}),
	output: Record,
	request: ({ authenticator_id, ...body }) => ({
		method: 'POST',
		path: `/authenticators/${segment(authenticator_id)}/connection`,
		body,
	}),
});

export const authenticatorsDelete = op({
	event: 'authenticators.delete',
	input: z.object({ authenticator_id: Id('authenticator') }),
	output: OkSchema,
	request: ({ authenticator_id }) => ({
		method: 'DELETE',
		path: `/authenticators/${segment(authenticator_id)}`,
	}),
	shape: (raw) => raw ?? {},
});
