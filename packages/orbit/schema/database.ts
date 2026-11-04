import { z } from 'zod';

export const Billing = z
	.object({
		id: z.string().optional(),
		status: z.enum(['open', 'settled']).optional(),
		reservedCredits: z.number().optional(),
		consumedCredits: z.number().optional(),
		releasedCredits: z.number().optional(),
		heldCredits: z.number().optional(),
	})
	.optional();

export type Billing = z.infer<typeof Billing>;

const BillingFields = z.object({
	id: z.string().optional(),
	status: z.enum(['open', 'settled']).optional(),
	reservedCredits: z.number().optional(),
	consumedCredits: z.number().optional(),
	releasedCredits: z.number().optional(),
	heldCredits: z.number().optional(),
});

export function readBilling(value: unknown): Billing {
	// Response billing is an open object. Only the stored credit fields are kept.
	const parsed = BillingFields.safeParse(value);
	if (!parsed.success) return undefined;
	const fields = parsed.data;
	if (
		fields.id === undefined &&
		fields.status === undefined &&
		fields.reservedCredits === undefined &&
		fields.consumedCredits === undefined &&
		fields.releasedCredits === undefined &&
		fields.heldCredits === undefined
	) {
		return undefined;
	}
	return fields;
}

const SearchStatus = z.enum([
	'running',
	'completed',
	'completed_with_errors',
	'failed',
]);

const EnrichStatus = z.enum(['running', 'completed', 'failed']);

const BulkStatus = z.enum([
	'queued',
	'running',
	'waiting_for_credits',
	'needs_attention',
	'completed',
	'completed_with_errors',
	'canceled',
]);

export const SearchRecord = z.object({
	searchId: z.string(),
	status: SearchStatus.optional(),
	requestId: z.string().nullable().optional(),
	updatedAt: z.string().nullable().optional(),
	billing: Billing,
});

export const EnrichRecord = z.object({
	requestId: z.string(),
	profileId: z.string().nullable().optional(),
	status: EnrichStatus.optional(),
	updatedAt: z.string().nullable().optional(),
	billing: Billing,
});

export const BulkRecord = z.object({
	jobId: z.string(),
	status: BulkStatus.optional(),
	requestId: z.string().nullable().optional(),
	updatedAt: z.string().nullable().optional(),
	billing: Billing,
});

export type SearchRecord = z.infer<typeof SearchRecord>;
export type EnrichRecord = z.infer<typeof EnrichRecord>;
export type BulkRecord = z.infer<typeof BulkRecord>;

const SEARCH_TERMINAL = new Set([
	'completed',
	'completed_with_errors',
	'failed',
]);
const ENRICH_TERMINAL = new Set(['completed', 'failed']);
const BULK_TERMINAL = new Set([
	'completed',
	'completed_with_errors',
	'canceled',
]);

type RecordWithStatus = {
	status?: string;
	billing?: Billing;
	updatedAt?: string | null;
};

function mergeRecord<T extends RecordWithStatus>(
	existing: T | null,
	incoming: T,
	terminal: Set<string>,
): T {
	const base = existing ?? incoming;
	const keep =
		base.status !== undefined &&
		terminal.has(base.status) &&
		incoming.status !== undefined &&
		!terminal.has(incoming.status);
	if (!keep) return { ...base, ...incoming };
	const billing = base.billing ?? incoming.billing;
	return { ...base, billing };
}

export function mergeSearch(
	existing: SearchRecord | null,
	incoming: SearchRecord,
): SearchRecord {
	return mergeRecord(existing, incoming, SEARCH_TERMINAL);
}

export function mergeEnrich(
	existing: EnrichRecord | null,
	incoming: EnrichRecord,
): EnrichRecord {
	return mergeRecord(existing, incoming, ENRICH_TERMINAL);
}

export function mergeBulk(
	existing: BulkRecord | null,
	incoming: BulkRecord,
): BulkRecord {
	return mergeRecord(existing, incoming, BULK_TERMINAL);
}
