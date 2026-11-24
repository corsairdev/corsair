import type { z } from 'zod';
import type { SpondyrContext } from '..';
import { call } from './call';

/** The validated write input: the create, update or delete body, snake_case. */
export type WriteInput = Record<string, string | number | boolean | undefined>;

export type WriteLog = Record<string, string | number | boolean | undefined>;

/**
 * The five admin resources (Transaction Types, Event Types, Recipients,
 * Conditions, Search Filters) each expose list, get, create, update and delete
 * over the same `/{Resource}` route shape. This helper builds the three write
 * operations, which differ only in the resource name and the body.
 *
 * Spondyr takes the resource's own name in the body on an update (`PUT`), and
 * in the query on a delete (`DELETE`), so the caller passes the name key.
 */
export function adminWrites<
	CreateIn extends z.ZodType,
	CreateOut extends z.ZodType,
	UpdateIn extends z.ZodType,
	UpdateOut extends z.ZodType,
	DeleteIn extends z.ZodType,
	DeleteOut extends z.ZodType,
>(config: {
	/** The route segment: `TransactionType`, `Recipient`, and so on. */
	resource: string;
	/** The event prefix: `transactionTypes`. */
	event: string;
	create: { input: CreateIn; output: CreateOut };
	update: { input: UpdateIn; output: UpdateOut };
	delete: { input: DeleteIn; output: DeleteOut };
	/** Builds the PascalCase body from the validated input. */
	body: (parsed: WriteInput) => Record<string, unknown>; // unknown: the wire body.
	/** Reads the resource name out of the validated delete input. */
	name: (parsed: WriteInput) => string;
	/** Reads the Transaction Type filter, when the resource is scoped by one. */
	filter?: (parsed: WriteInput) => string | undefined;
	/** The safe log fields for a write; never the whole document. */
	logCreate: (parsed: WriteInput) => WriteLog;
}) {
	const create = async (
		ctx: SpondyrContext,
		input: unknown,
	): Promise<z.output<CreateOut>> =>
		// unknown: parsed inside `call`.
		call(
			ctx,
			{
				event: `${config.event}.create`,
				input: config.create.input,
				output: config.create.output,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: config.resource,
				body: config.body(parsed as WriteInput),
			}),
			{ log: (parsed) => config.logCreate(parsed as WriteInput) },
		);

	const update = async (
		ctx: SpondyrContext,
		input: unknown,
	): Promise<z.output<UpdateOut>> =>
		// unknown: parsed inside `call`.
		call(
			ctx,
			{
				event: `${config.event}.update`,
				input: config.update.input,
				output: config.update.output,
			},
			input,
			(parsed) => ({
				method: 'PUT',
				path: config.resource,
				body: config.body(parsed as WriteInput),
			}),
			{ log: (parsed) => config.logCreate(parsed as WriteInput) },
		);

	const remove = async (
		ctx: SpondyrContext,
		input: unknown,
	): Promise<z.output<DeleteOut>> =>
		// unknown: parsed inside `call`.
		call(
			ctx,
			{
				event: `${config.event}.delete`,
				input: config.delete.input,
				output: config.delete.output,
			},
			input,
			(parsed) => {
				const raw = parsed as WriteInput;
				const filter = config.filter?.(raw);
				return {
					method: 'DELETE',
					path: config.resource,
					query: {
						...(filter === undefined ? {} : { TransactionType: filter }),
						[config.resource]: config.name(raw),
					},
				};
			},
			{ log: (parsed) => config.logCreate(parsed as WriteInput) },
		);

	return { create, update, remove };
}
