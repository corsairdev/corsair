import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { asRecord, defined, linkupPost } from '../client';
import type { LinkupContext } from '../context';
import { LinkupResponseEntity } from '../schema/database';
import { filters, taskListOf, taskOf } from './read';
import type {
	ResearchCreateInput,
	ResponseInput,
	ResponsesResponse,
	TaskListResponse,
	TaskResponse,
	TasksCreateInput,
} from './types';
import {
	ResearchCreateInputSchema,
	ResponseInputSchema,
	TasksCreateInputSchema,
} from './types';

/**
 * Local tables, or undefined when no database is configured. Core still hands
 * out stub tables then, whose writes throw.
 */
function store(ctx: LinkupContext) {
	return ctx.database ? ctx.db : undefined;
}

// Narrows one untyped JSON value.
function text(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export const createResponse: CorsairEndpoint<
	LinkupContext,
	ResponseInput,
	ResponsesResponse
> = async (ctx, input) => {
	const parsed = ResponseInputSchema.parse(input);
	const body = asRecord(
		await linkupPost<unknown>(
			ctx.key,
			'/v1/responses',
			defined({
				input: parsed.input,
				model: parsed.model,
				instructions: parsed.instructions,
			}),
		),
	);
	const response = LinkupResponseEntity.parse({
		id: text(body?.id),
		model: text(body?.model),
		object: text(body?.object),
	});
	const outputText =
		typeof body?.output_text === 'string' ? body.output_text : undefined;
	if (outputText === undefined)
		throw new Error('Linkup response had no output_text');
	try {
		await store(ctx)?.responses?.upsertByEntityId(response.id, response);
	} catch {
		console.warn('Failed to save Linkup response');
	}
	// The prompt and the generated text stay out of the event and database.
	await logEventFromContext(
		ctx,
		'linkup.responses.create',
		{ count: 1 },
		'completed',
	);
	return { response, outputText };
};

export const createResearch: CorsairEndpoint<
	LinkupContext,
	ResearchCreateInput,
	TaskResponse
> = async (ctx, input) => {
	const parsed = ResearchCreateInputSchema.parse(input);
	const outputType = parsed.outputType ?? 'sourcedAnswer';
	if (outputType === 'structured' && !parsed.schema)
		throw new Error('A structured research task needs schema');
	const task = taskOf(
		await linkupPost<unknown>(
			ctx.key,
			'/v1/research',
			defined({
				q: parsed.q,
				outputType,
				// Linkup's own default is L ($1.50); the plugin starts at S ($0.25).
				reasoningDepth: parsed.reasoningDepth ?? 'S',
				mode: parsed.mode,
				structuredOutputSchema: parsed.schema
					? JSON.stringify(parsed.schema)
					: undefined,
				...filters(parsed),
			}),
		),
	);
	await logEventFromContext(
		ctx,
		'linkup.research.create',
		{ count: 1 },
		'completed',
	);
	return { task };
};

export const createTasks: CorsairEndpoint<
	LinkupContext,
	TasksCreateInput,
	TaskListResponse
> = async (ctx, input) => {
	const parsed = TasksCreateInputSchema.parse(input);
	const result = taskListOf(
		await linkupPost<unknown>(ctx.key, '/v1/tasks', parsed.tasks),
	);
	await logEventFromContext(
		ctx,
		'linkup.tasks.create',
		{ count: result.tasks.length },
		'completed',
	);
	return result;
};
