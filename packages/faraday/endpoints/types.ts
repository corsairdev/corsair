import { z } from 'zod';
import { FaradayAccount, FaradayGraphEdge } from '../schema/database';
import type { FaradayInputKind, FaradayOp, FaradayOpKey } from './catalog';
import { FARADAY_OPS, opKey } from './catalog';

const FaradayResource = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		resource_type: z.string().optional(),
		status: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		archived_at: z.string().nullable().optional(),
	})
	.loose();

const FaradayAccountPublic = FaradayAccount;

const EmptyOk = z.object({ ok: z.literal(true) });
const FaradayObject = z.record(z.string(), z.unknown());
const FaradayList = z.array(FaradayResource);
const FaradayText = z.object({ content: z.string() });

const IdsInput = z.object({
	ids: z.array(z.string()).max(100).optional(),
});

const IdInput = z
	.object({
		account_id: z.string().optional(),
		cohort_id: z.string().optional(),
		dataset_id: z.string().optional(),
		stream_id: z.string().optional(),
		outcome_id: z.string().optional(),
		persona_set_id: z.string().optional(),
		place_id: z.string().optional(),
		scope_id: z.string().optional(),
		target_id: z.string().optional(),
		trait_id: z.string().optional(),
		connection_id: z.string().optional(),
		webhook_endpoint_id: z.string().optional(),
		id: z.string().optional(),
	})
	.passthrough()
	.refine(
		(value) =>
			Boolean(
				value.account_id ||
					value.cohort_id ||
					value.dataset_id ||
					value.stream_id ||
					value.outcome_id ||
					value.persona_set_id ||
					value.place_id ||
					value.scope_id ||
					value.target_id ||
					value.trait_id ||
					value.connection_id ||
					value.webhook_endpoint_id ||
					value.id,
			),
		{ message: 'resource id is required' },
	);

const CreateInput = z
	.object({
		name: z.string(),
	})
	.passthrough();

const AccountCreateInput = z
	.object({
		name: z.string().min(1).max(64),
		branding: z
			.object({
				suppress_from_reports: z.boolean().optional(),
			})
			.optional(),
	})
	.passthrough();

const PatchInput = IdInput;

const CascadeInput = IdInput.and(
	z.object({
		cascade_to: z.array(z.string()).optional(),
		cascade_to_all: z.boolean().optional(),
	}),
);

const UploadInput = z.object({
	directory: z.string(),
	filename: z.string(),
});

const WebhookCreateInput = z.object({
	url: z.url(),
	enabled_events: z.array(
		z.enum(['resource.errored', 'resource.ready_with_update']),
	),
});

const WebhookUpdateInput = z
	.object({
		webhook_endpoint_id: z.string(),
		url: z.url().optional(),
		status: z.enum(['enabled', 'disabled']).optional(),
		enabled_events: z
			.array(z.enum(['resource.errored', 'resource.ready_with_update']))
			.optional(),
	})
	.passthrough();

const PreviewInput = z
	.object({
		target_id: z.string(),
	})
	.passthrough();

const NoneInput = z.object({}).optional();

function inputSchema(kind: FaradayInputKind) {
	switch (kind) {
		case 'none':
			return NoneInput;
		case 'ids':
			return IdsInput;
		case 'id':
			return IdInput;
		case 'create':
			return CreateInput;
		case 'accountCreate':
			return AccountCreateInput;
		case 'patch':
			return PatchInput;
		case 'cascade':
			return CascadeInput;
		case 'upload':
			return UploadInput;
		case 'webhookCreate':
			return WebhookCreateInput;
		case 'webhookUpdate':
			return WebhookUpdateInput;
		case 'preview':
			return PreviewInput;
	}
}

function outputSchema(op: FaradayOp) {
	if (
		op.method === 'DELETE' ||
		op.name === 'archive' ||
		op.name === 'unarchive' ||
		op.name === 'forceUpdate' ||
		op.name === 'createPreview'
	) {
		return EmptyOk.or(FaradayObject).or(FaradayResource);
	}
	if (
		op.group === 'accounts' &&
		(op.name === 'list' ||
			op.name === 'get' ||
			op.name === 'getCurrent' ||
			op.name === 'create' ||
			op.name === 'update')
	) {
		return op.name === 'list'
			? z.array(FaradayAccountPublic)
			: FaradayAccountPublic;
	}
	if (op.group === 'graph') {
		return z.array(FaradayGraphEdge);
	}
	if (op.name === 'getCsv') {
		return FaradayText;
	}
	if (op.group === 'uploads' && op.name === 'get') {
		return FaradayText.or(FaradayObject);
	}
	if (op.input === 'ids' || op.name === 'list') {
		return FaradayList.or(FaradayObject);
	}
	return FaradayResource.or(FaradayObject).or(EmptyOk);
}

export const FaradayEndpointInputSchemas = Object.fromEntries(
	FARADAY_OPS.map((op) => [opKey(op), inputSchema(op.input)]),
) as { [K in FaradayOpKey]: ReturnType<typeof inputSchema> };

export const FaradayEndpointOutputSchemas = Object.fromEntries(
	FARADAY_OPS.map((op) => [opKey(op), outputSchema(op)]),
) as { [K in FaradayOpKey]: ReturnType<typeof outputSchema> };

export type FaradayEndpointInputs = {
	[K in keyof typeof FaradayEndpointInputSchemas]: z.infer<
		(typeof FaradayEndpointInputSchemas)[K]
	>;
};

export type FaradayEndpointOutputs = {
	[K in keyof typeof FaradayEndpointOutputSchemas]: z.infer<
		(typeof FaradayEndpointOutputSchemas)[K]
	>;
};
