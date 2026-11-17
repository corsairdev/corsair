/// <reference types="jest" />
// heygen's tsconfig loads only node types; jest's come from its devDependencies.
import type { EndpointJob } from 'corsair/core';
import { z } from 'zod';
import { HeygenEndpointOutputSchemas } from './endpoints/types';
import { heygen, heygenEndpointSchemas } from './index';

const meta = heygen().endpointMeta as Record<
	string,
	{ job?: EndpointJob } | undefined
>;

// Statuses each read answers with before its job ends.
const RUNNING: Record<string, string[]> = {
	'videos.getStatus': ['pending', 'processing'],
	'videos.translateStatus': ['pending', 'running'],
	'lipsync.get': ['pending', 'running'],
	'hyperframes.get': ['queued', 'rendering'],
	'aiClipping.get': ['pending', 'running'],
	'videoAgents.getSession': ['thinking', 'reviewing', 'generating'],
};

const OUTPUT_FOR: Record<string, z.ZodType> = {
	'videos.generate': HeygenEndpointOutputSchemas.videosGenerate,
	'videos.templateGenerate': HeygenEndpointOutputSchemas.videosTemplateGenerate,
	'videos.createWebm': HeygenEndpointOutputSchemas.videosCreateWebm,
	'videos.getStatus': HeygenEndpointOutputSchemas.videosGetStatus,
	'proofread.generateVideo': HeygenEndpointOutputSchemas.proofreadGenerateVideo,
	'videos.translateStatus': HeygenEndpointOutputSchemas.videosTranslateStatus,
	'lipsync.create': HeygenEndpointOutputSchemas.lipsyncCreate,
	'lipsync.get': HeygenEndpointOutputSchemas.lipsyncGet,
	'hyperframes.create': HeygenEndpointOutputSchemas.hyperframesCreate,
	'hyperframes.get': HeygenEndpointOutputSchemas.hyperframesGet,
	'aiClipping.create': HeygenEndpointOutputSchemas.aiClippingCreate,
	'aiClipping.get': HeygenEndpointOutputSchemas.aiClippingGet,
	'videoAgents.createSession':
		HeygenEndpointOutputSchemas.videoAgentsCreateSession,
	'videoAgents.getSession': HeygenEndpointOutputSchemas.videoAgentsGetSession,
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

describe('HeyGen jobs', () => {
	it('declares a job on every operation that starts a render, translation, lipsync, clipping job or agent session', () => {
		expect(jobs.map(([op]) => op).sort()).toEqual([
			'aiClipping.create',
			'hyperframes.create',
			'lipsync.create',
			'proofread.generateVideo',
			'videoAgents.createSession',
			'videos.createWebm',
			'videos.generate',
			'videos.templateGenerate',
		]);
	});

	it.each(jobs)(
		'%s reads back through an operation this plugin has',
		(op, { job }) => {
			expect(meta[job.status.op]).toBeDefined();
			expect(schemaAt(op, job.idPath)).toBeInstanceOf(z.ZodString);
			if (job.cancel) {
				expect(meta[job.cancel.op]).toBeDefined();
				const input = heygenEndpointSchemas[
					job.cancel.op as keyof typeof heygenEndpointSchemas
				].input as z.ZodObject;
				expect(input.shape[job.cancel.idArg]).toBeDefined();
			}
		},
	);

	it.each(jobs)(
		'%s: the status read takes the job id as its argument',
		(_op, { job }) => {
			const input = heygenEndpointSchemas[
				job.status.op as keyof typeof heygenEndpointSchemas
			].input as z.ZodObject;
			expect(input.shape[job.status.idArg]).toBeDefined();
			expect(
				input.safeParse({
					[job.status.idArg]: '0b7c1a2d3e4f5a6b7c8d9e0f1a2b3c4d',
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
