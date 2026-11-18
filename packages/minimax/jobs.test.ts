import type { EndpointJob } from 'corsair/core';
import { z } from 'zod';
import { MinimaxEndpointOutputSchemas } from './endpoints/types';
import { minimax, minimaxEndpointSchemas } from './index';

const meta = minimax().endpointMeta as Record<
	string,
	{ job?: EndpointJob } | undefined
>;

// Statuses each read answers with before its task ends.
const RUNNING: Record<string, string[]> = {
	'video.query': ['Preparing', 'Queueing', 'Processing'],
	'video.queryV2': ['queued', 'running'],
	'video.templateQuery': ['Preparing', 'Queueing', 'Processing'],
	'speech.queryAsyncTask': ['processing', 'Processing'],
};

const OUTPUT_FOR: Record<string, z.ZodType> = {
	'speech.createAsyncTask': MinimaxEndpointOutputSchemas.speechCreateAsyncTask,
	'speech.queryAsyncTask': MinimaxEndpointOutputSchemas.speechQueryAsyncTask,
	'video.generate': MinimaxEndpointOutputSchemas.videoGenerate,
	'video.query': MinimaxEndpointOutputSchemas.videoQuery,
	'video.generateV2': MinimaxEndpointOutputSchemas.videoGenerateV2,
	'video.contextIr': MinimaxEndpointOutputSchemas.videoContextIr,
	'video.regenerate': MinimaxEndpointOutputSchemas.videoRegenerate,
	'video.queryV2': MinimaxEndpointOutputSchemas.videoQueryV2,
	'video.templateGenerate': MinimaxEndpointOutputSchemas.videoTemplateGenerate,
	'video.templateQuery': MinimaxEndpointOutputSchemas.videoTemplateQuery,
};

const unwrap = (schema: z.ZodType | undefined): z.ZodType | undefined => {
	let cur = schema;
	while (cur instanceof z.ZodOptional || cur instanceof z.ZodNullable) {
		cur = cur.unwrap() as z.ZodType;
	}
	return cur;
};

// The schema at a dot path in an operation's output, through optional and
// nullable fields; undefined when the path isn't there.
const schemaAt = (op: string, path: string): z.ZodType | undefined => {
	let cur = unwrap(OUTPUT_FOR[op]);
	for (const key of path.split('.')) {
		cur = unwrap(cur instanceof z.ZodObject ? cur.shape[key] : undefined);
	}
	return cur;
};

const jobs = Object.entries(meta).filter(
	(entry): entry is [string, { job: EndpointJob }] => Boolean(entry[1]?.job),
);

describe('MiniMax jobs', () => {
	it('declares a job on every operation that starts a speech or video task', () => {
		expect(jobs.map(([op]) => op).sort()).toEqual([
			'speech.createAsyncTask',
			'video.contextIr',
			'video.generate',
			'video.generateV2',
			'video.regenerate',
			'video.templateGenerate',
		]);
	});

	it.each(jobs)(
		'%s reads back through an operation this plugin has',
		(op, { job }) => {
			expect(meta[job.status.op]).toBeDefined();
			expect(job.cancel).toBeUndefined();
			expect(schemaAt(op, job.idPath)).toBeInstanceOf(z.ZodString);
		},
	);

	it.each(jobs)(
		'%s: the status read takes the job id as its argument',
		(_op, { job }) => {
			const input = minimaxEndpointSchemas[
				job.status.op as keyof typeof minimaxEndpointSchemas
			].input as z.ZodObject;
			expect(input.shape[job.status.idArg]).toBeDefined();
			expect(
				input.safeParse({
					[job.status.idArg]: '106916112212032',
				}).success,
			).toBe(true);
		},
	);

	// A status the schema gains and this list doesn't sort would read as
	// "still running" forever, so every value must be placed.
	it.each(jobs)(
		'%s sorts every status the read can answer with',
		(_op, { job }) => {
			const status = schemaAt(job.status.op, job.status.statusPath);
			expect(status).toBeInstanceOf(z.ZodEnum);
			const values = (status as z.ZodEnum).options.map(String);
			for (const value of [...job.status.done, ...job.status.failed]) {
				expect(values).toContain(value);
			}
			expect(
				values.filter(
					(v) =>
						!RUNNING[job.status.op]?.includes(v) &&
						!job.status.done.includes(v) &&
						!job.status.failed.includes(v),
				),
			).toEqual([]);
		},
	);
});
