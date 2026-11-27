import type { EndpointJob } from 'corsair/core';
import { z } from 'zod';
import {
	GENERATION_STATUSES,
	RENDER_STATUSES,
	ShotstackEndpointOutputSchemas,
	SOURCE_STATUSES,
} from './endpoints/types';
import { shotstack, shotstackEndpointSchemas } from './index';

const meta = shotstack().endpointMeta as Record<
	string,
	{ job?: EndpointJob } | undefined
>;

const jobs = Object.entries(meta).filter(
	(entry): entry is [string, { job: EndpointJob }] => Boolean(entry[1]?.job),
);

/** 'renders.create' is the schema map key 'rendersCreate'. */
function schemaKeyOf(op: string): keyof typeof ShotstackEndpointOutputSchemas {
	const key = op.replace(/\.(.)/, (_match, letter: string) =>
		letter.toUpperCase(),
	);
	return key as keyof typeof ShotstackEndpointOutputSchemas;
}

// Resolves a dot path in a schema: response.status walks the nested object.
// Nullish output fields wrap the enum, so those wrappers come off first.
function at(schema: z.ZodType, path: string): z.ZodType | undefined {
	let current: z.ZodType = schema;
	for (const segment of path.split('.')) {
		while (
			current instanceof z.ZodOptional ||
			current instanceof z.ZodNullable
		) {
			current = current.unwrap() as typeof current;
		}
		if (!(current instanceof z.ZodObject)) return undefined;
		const next = current.shape[segment];
		if (!next) return undefined;
		current = next;
	}
	while (current instanceof z.ZodOptional || current instanceof z.ZodNullable) {
		current = current.unwrap() as typeof current;
	}
	return current;
}

const RUNNING: Record<string, string[]> = {
	'renders.create': RENDER_STATUSES.filter(
		(s) => s !== 'done' && s !== 'failed',
	),
	'templates.render': RENDER_STATUSES.filter(
		(s) => s !== 'done' && s !== 'failed',
	),
	'generations.create': GENERATION_STATUSES.filter(
		(s) => s !== 'done' && s !== 'failed',
	),
	'sources.fetch': SOURCE_STATUSES.filter(
		(s) =>
			s !== 'ready' && s !== 'failed' && s !== 'deleted' && s !== 'overwritten',
	),
};

describe('shotstack jobs', () => {
	it('declares a job on the four operations that leave work running', () => {
		expect(jobs.map(([op]) => op).sort()).toEqual([
			'generations.create',
			'renders.create',
			'sources.fetch',
			'templates.render',
		]);
	});

	it.each(jobs)(
		'%s reads back through operations this plugin has',
		(op, { job }) => {
			expect(meta[job.status.op]).toBeDefined();
			// No provider cancel exists for renders, generations or ingests.
			expect(job.cancel).toBeUndefined();
			expect(
				at(ShotstackEndpointOutputSchemas[schemaKeyOf(op)], job.idPath),
			).toBeDefined();
		},
	);

	it.each(jobs)(
		'%s: the status read takes the job id as its argument',
		(_op, { job }) => {
			const input = shotstackEndpointSchemas[
				job.status.op as keyof typeof shotstackEndpointSchemas
			].input as z.ZodObject;
			expect(input.shape[job.status.idArg]).toBeDefined();
			expect(
				input.safeParse({
					[job.status.idArg]: '2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7',
				}).success,
			).toBe(true);
		},
	);

	// A status the schema gains and this list doesn't sort would read as
	// "still running" forever, so every documented value must be placed.
	it.each(jobs)(
		'%s sorts every status the read can answer with',
		(op, { job }) => {
			const state = at(
				ShotstackEndpointOutputSchemas[schemaKeyOf(job.status.op)],
				job.status.statusPath,
			);
			expect(state).toBeInstanceOf(z.ZodEnum);
			const values = (state as z.ZodEnum).options.map(String);
			const running = RUNNING[op] ?? [];
			for (const value of [...job.status.done, ...job.status.failed]) {
				expect(values).toContain(value);
			}
			expect(
				values.filter(
					(v) =>
						!running.includes(v) &&
						!job.status.done.includes(v) &&
						!job.status.failed.includes(v),
				),
			).toEqual([]);
			expect(running.every((v) => values.includes(v))).toBe(true);
		},
	);

	it('documents every source status value, including overwritten', () => {
		expect([...SOURCE_STATUSES]).toEqual([
			'queued',
			'importing',
			'ready',
			'failed',
			'deleted',
			'overwritten',
		]);
	});
});
