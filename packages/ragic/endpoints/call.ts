import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { RagicContext } from '..';
import type { RagicRequest } from '../client';
import { makeRagicRequest, orderParam, segment, whereFilter } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, shapes and validates the response, then
 * logs the event.
 *
 * Inputs are logged only through `log`: a record's field values are the caller's
 * CRM data, so only the sheet, the record id and counts are reported.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: RagicContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => RagicRequest,
	options: {
		// unknown: raw is the response body, undefined when there is none. The
		// output schema validates whatever this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});
	const raw = await makeRagicRequest(
		ctx.key,
		ctx.options?.server ?? 'www.ragic.com',
		toRequest(parsed),
	);
	const result = operation.output.parse(
		options.shape ? options.shape(raw, parsed) : raw,
	);

	await logEventFromContext(
		ctx,
		`ragic.${operation.event}`,
		options.log?.(parsed, result) ?? {},
		'completed',
	);
	return result;
}

/** The sheet-scoped path every route shares. */
export function sheetPath(
	account: string,
	path: string,
	sheetIndex: number,
): string {
	// The path already starts with a slash in every documented URL, but a caller
	// may omit it; both forms resolve to the same place. Each folder is escaped on
	// its own so a `?` or `#` in the input cannot leave the sheet's URL; the input
	// schema already refuses `.` and `..`.
	const folders = path.split('/').filter((part) => part.length > 0);
	const normalised = folders.map((part) => `/${segment(part)}`).join('');
	return `/${segment(account)}${normalised}/${segment(sheetIndex)}`;
}

/** The record-scoped path, which adds the record id. */
export function recordPath(
	account: string,
	path: string,
	sheetIndex: number,
	recordId: number,
): string {
	return `${sheetPath(account, path, sheetIndex)}/${segment(recordId)}`;
}

/**
 * Builds the query a sheet read shares. `where` repeats once per filter, so it is
 * assembled into an array and left for the HTTP layer to repeat.
 */
export function readQuery(parsed: {
	where?: {
		fieldId: number | string;
		op: Parameters<typeof whereFilter>[1];
		value?: string | number;
	}[];
	fts?: string;
	filterId?: number;
	limit?: number;
	offset?: number;
	taskId?: string;
	order?: { fieldId: number | string; direction: 'ASC' | 'DESC' };
	reverse?: boolean;
	naming?: 'EID' | 'FNAME';
	subtables?: boolean;
	listing?: boolean;
	info?: boolean;
	comment?: boolean;
	history?: boolean;
	conversation?: boolean;
	approval?: boolean;
	fetchDomainIds?: (number | string)[];
}): Record<string, string | number | boolean | string[] | undefined> {
	// Ragic reads several conditions as a repeated `where` parameter, which the
	// HTTP layer produces from an array.
	const where = parsed.where?.map((filter) =>
		whereFilter(filter.fieldId, filter.op, filter.value),
	);

	return {
		where: where && where.length > 0 ? where : undefined,
		fts: parsed.fts,
		filterId: parsed.filterId,
		limit: parsed.limit,
		offset: parsed.offset,
		taskId: parsed.taskId,
		order: parsed.order
			? orderParam(parsed.order.fieldId, parsed.order.direction)
			: undefined,
		reverse: parsed.reverse,
		naming: parsed.naming,
		subtables:
			parsed.subtables === undefined ? undefined : parsed.subtables ? 1 : 0,
		listing: parsed.listing,
		info: parsed.info,
		comment: parsed.comment,
		history: parsed.history,
		conversation: parsed.conversation,
		approval: parsed.approval,
		fetchDomainIds:
			parsed.fetchDomainIds && parsed.fetchDomainIds.length > 0
				? parsed.fetchDomainIds.map((id) => String(id))
				: undefined,
	};
}

/** The write options, which are query flags rather than body fields. */
export function writeQuery(parsed: {
	doFormula?: boolean;
	doDefaultValue?: boolean;
	doLinkLoad?: boolean | 'first';
	doWorkflow?: boolean;
	doAIAgent?: boolean;
	notification?: boolean;
	doValidation?: boolean;
	checkLock?: boolean;
}): Record<string, string | number | boolean | undefined> {
	return {
		doFormula: parsed.doFormula,
		doDefaultValue: parsed.doDefaultValue,
		doLinkLoad:
			parsed.doLinkLoad === undefined
				? undefined
				: parsed.doLinkLoad === 'first'
					? 'first'
					: String(parsed.doLinkLoad),
		doWorkflow: parsed.doWorkflow,
		doAIAgent: parsed.doAIAgent,
		notification: parsed.notification,
		doValidation: parsed.doValidation,
		checkLock: parsed.checkLock,
	};
}
