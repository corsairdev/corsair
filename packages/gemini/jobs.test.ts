import type { EndpointJob } from 'corsair/core';
import { z } from 'zod';
import {
	GeminiEndpointOutputSchemas,
	VIDEO_OPERATION_STATES,
} from './endpoints/types';
import { videoOperationState } from './endpoints/videos';
import { gemini, geminiEndpointSchemas } from './index';

const meta = gemini().endpointMeta as Record<
	string,
	{ job?: EndpointJob } | undefined
>;

const OUTPUT_FOR: Record<string, z.ZodType> = {
	'videos.generateVideos': GeminiEndpointOutputSchemas.generateVideos,
	'videos.getVideosOperation': GeminiEndpointOutputSchemas.getVideosOperation,
};

const shapeOf = (op: string): Record<string, z.ZodType> => {
	const schema = OUTPUT_FOR[op];
	return schema instanceof z.ZodObject ? schema.shape : {};
};

const jobs = Object.entries(meta).filter(
	(entry): entry is [string, { job: EndpointJob }] => Boolean(entry[1]?.job),
);

const NAME = 'models/veo-2.0-generate-001/operations/abc123';

describe('Gemini jobs', () => {
	it('declares a job on the operation that starts a Veo generation', () => {
		expect(jobs.map(([op]) => op)).toEqual(['videos.generateVideos']);
	});

	it.each(jobs)(
		'%s reads back through an operation this plugin has',
		(op, { job }) => {
			expect(meta[job.status.op]).toBeDefined();
			expect(job.cancel).toBeUndefined();
			expect(shapeOf(op)[job.idPath]).toBeDefined();
		},
	);

	it.each(jobs)(
		'%s: the status read takes the job id as its argument',
		(_op, { job }) => {
			const input = geminiEndpointSchemas[
				job.status.op as keyof typeof geminiEndpointSchemas
			].input as z.ZodObject;
			expect(input.shape[job.status.idArg]).toBeDefined();
			expect(input.safeParse({ [job.status.idArg]: NAME }).success).toBe(true);
		},
	);

	// A state the schema gains and this list doesn't sort would read as
	// "still running" forever, so every value must be placed.
	it.each(jobs)(
		'%s sorts every state the read can answer with',
		(_op, { job }) => {
			const state = shapeOf(job.status.op)[job.status.statusPath];
			expect(state).toBeInstanceOf(z.ZodEnum);
			const values = (state as z.ZodEnum).options.map(String);
			expect(values).toEqual([...VIDEO_OPERATION_STATES]);
			for (const value of [...job.status.done, ...job.status.failed]) {
				expect(values).toContain(value);
			}
			expect(
				values.filter(
					(v) =>
						v !== 'RUNNING' &&
						!job.status.done.includes(v) &&
						!job.status.failed.includes(v),
				),
			).toEqual([]);
		},
	);
});

describe('videoOperationState', () => {
	it('is RUNNING until the operation is done', () => {
		expect(videoOperationState({ name: NAME })).toBe('RUNNING');
		expect(videoOperationState({ name: NAME, done: false })).toBe('RUNNING');
	});

	it('is SUCCEEDED once done with a generated video', () => {
		expect(
			videoOperationState({
				name: NAME,
				done: true,
				response: {
					generateVideoResponse: {
						generatedSamples: [{ video: { uri: 'files/abc:download' } }],
					},
				},
			}),
		).toBe('SUCCEEDED');
	});

	it('is FAILED with an error, even before done is set', () => {
		expect(
			videoOperationState({
				name: NAME,
				done: true,
				error: { code: 3, message: 'invalid prompt' },
			}),
		).toBe('FAILED');
		expect(
			videoOperationState({
				name: NAME,
				error: { code: 13, message: 'internal' },
			}),
		).toBe('FAILED');
	});

	it('is FAILED when done without a video (all samples filtered)', () => {
		expect(
			videoOperationState({
				name: NAME,
				done: true,
				// Google also sends raiMediaFilteredCount, which the schema
				// doesn't model; what matters is that no sample is left.
				response: { generateVideoResponse: { generatedSamples: [] } },
			}),
		).toBe('FAILED');
	});

	it('answers a value the read schema accepts', () => {
		const parsed = GeminiEndpointOutputSchemas.getVideosOperation.safeParse({
			name: NAME,
			done: false,
			state: videoOperationState({ name: NAME, done: false }),
		});
		expect(parsed.success).toBe(true);
	});
});
