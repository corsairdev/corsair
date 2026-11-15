import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { RecruiteeContext } from '..';
import type { RecruiteeRequest } from '../client';
import { companyPath, makeRecruiteeRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Resolves the company id. A plugin created with `company_id` uses it for every
 * call; otherwise the account's stored value is read. A missing value fails here
 * rather than producing a request to `/c/undefined/…`.
 */
export async function resolveCompanyId(ctx: RecruiteeContext): Promise<string> {
	const configured =
		ctx.options.company_id ?? (await ctx.keys.get_company_id());
	const value = (configured ?? '').trim();
	if (value.length === 0) {
		// The keyBuilder checks this first; this guard covers a context built
		// without it, so a request never goes to `/c//…`.
		throw new AuthMissingError('recruitee', 'api_key');
	}
	return value;
}

/**
 * Validates the input, sends the request, shapes and validates the response,
 * then logs the event. Candidate names and email addresses are personal data, so
 * `log` records ids and counts rather than free text.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: RecruiteeContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (
		companyId: string,
		parsed: z.output<Input>,
	) => Omit<RecruiteeRequest, 'path'> & { path: string },
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const companyId = await resolveCompanyId(ctx);
	const request = toRequest(companyId, parsed);
	const raw = await makeRecruiteeRequest(ctx.key, request);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`recruitee.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** A body member: a scalar, or a list such as a candidate's emails. */
export type RecruiteeValue = string | number | boolean | string[] | number[];

/**
 * Drops unset values so an absent filter is not serialised. Recruitee reads
 * `limit` and `page` strictly enough that an empty value is a different query.
 * The same helper builds a request body, whose candidate members are lists.
 */
export function queryOf(
	values: Record<string, RecruiteeValue | undefined>,
): Record<string, RecruiteeValue> {
	const kept = Object.entries(values).filter(
		(entry): entry is [string, RecruiteeValue] => entry[1] !== undefined,
	);
	return Object.fromEntries(kept);
}

/** The candidate-search fields that become `filters_json` entries. */
type CandidateFilterInput = {
	query?: string;
	offer_id?: number;
	stage?: string;
	status?: string;
	department_id?: number;
	location_id?: number;
};

/**
 * Builds the `filters_json` array `/search/new/candidates` reads, in the shapes
 * its reference documents. Returns undefined when no filter is set, so the
 * parameter is left off.
 */
export function candidateFilters(
	input: CandidateFilterInput,
): string | undefined {
	// unknown: each filter is a free-form JSON object whose keys depend on the
	// filter kind; it is only serialised, never read back.
	const filters: Record<string, unknown>[] = [];
	if (input.query !== undefined) {
		filters.push({ field: 'all', query: input.query });
	}
	if (input.status !== undefined) {
		filters.push({ field: 'status', in: [input.status] });
	}
	if (input.offer_id !== undefined) {
		filters.push({ filter: 'jobs', id: { in: [input.offer_id] } });
	}
	if (input.stage !== undefined) {
		filters.push({ filter: 'stages', name: { in: [input.stage] } });
	}
	if (input.department_id !== undefined) {
		filters.push({
			filter: 'jobs',
			department_id: { in: [input.department_id] },
		});
	}
	if (input.location_id !== undefined) {
		filters.push({
			filter: 'jobs',
			'locations.id': { in: [input.location_id] },
		});
	}
	return filters.length > 0 ? JSON.stringify(filters) : undefined;
}

/** Wraps a path under the company prefix. */
export { companyPath };
