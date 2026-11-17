import type { EndpointJob } from 'corsair/core';
import type { z } from 'zod';
import { kling, klingEndpointSchemas } from './index';

const meta = kling().endpointMeta as Record<
	string,
	{ job?: EndpointJob } | undefined
>;

const ID = '893605946402811985';

// The response each API style documents (kling.ai/document-api): the create
// answer, the status read's answer for a given status, and every status the
// docs list. The task schemas are loose strings, so these are the reference.
const STYLES = {
	// .../api/video/2-6/text-to-video and the other versioned video pages.
	versioned: {
		create: { code: 0, data: { id: ID, status: 'submitted' } },
		read: (status: string) => ({ code: 0, data: [{ id: ID, status }] }),
		statuses: ['submitted', 'processing', 'succeeded', 'failed'],
	},
	// .../api/image/2-1/image-generation, lip-sync, effects and the other /v1 pages.
	v1: {
		create: { code: 0, data: { task_id: ID, task_status: 'submitted' } },
		read: (status: string) => ({
			code: 0,
			data: { task_id: ID, task_status: status },
		}),
		statuses: ['submitted', 'processing', 'succeed', 'failed'],
	},
	// .../api/ecommerce-replication/virtual-try-on
	solutions: {
		create: { code: 0, data: { task_id: ID, status: 'submitted' } },
		read: (status: string) => ({ code: 0, data: [{ id: ID, status }] }),
		statuses: ['submitted', 'processing', 'succeed', 'failed'],
	},
} as const;

const RUNNING = ['submitted', 'processing'];

const STYLE_OF: Record<string, keyof typeof STYLES> = {
	'textToVideo.create': 'versioned',
	'imageToVideo.create': 'versioned',
	'omniVideo.create': 'versioned',
	'motionControl.create': 'versioned',
	'imageGeneration.create': 'v1',
	'multiImageToImage.create': 'v1',
	'omniImage.create': 'v1',
	'outpainting.create': 'v1',
	'lipSync.create': 'v1',
	'videoEffects.create': 'v1',
	'virtualTryOn.create': 'solutions',
};

const schemasOf = (op: string) =>
	klingEndpointSchemas[op as keyof typeof klingEndpointSchemas];

const at = (value: unknown, path: string): unknown =>
	path
		.split('.')
		.reduce<unknown>(
			(node, key) =>
				node !== null && typeof node === 'object'
					? (node as Record<string, unknown>)[key]
					: undefined,
			value,
		);

const jobs = Object.entries(meta).filter(
	(entry): entry is [string, { job: EndpointJob }] => Boolean(entry[1]?.job),
);

describe('Kling jobs', () => {
	it('declares a job on every create that starts a task', () => {
		expect(jobs.map(([op]) => op).sort()).toEqual(Object.keys(STYLE_OF).sort());
	});

	it.each(jobs)(
		'%s reads back through its own group, by task id',
		(op, { job }) => {
			expect(job.status.op).toBe(op.replace(/\.create$/, '.get'));
			expect(meta[job.status.op]).toBeDefined();
			expect(job.cancel).toBeUndefined();
			const input = schemasOf(job.status.op).input as z.ZodObject;
			expect(input.shape[job.status.idArg]).toBeDefined();
			expect(input.safeParse({ [job.status.idArg]: ID }).success).toBe(true);
		},
	);

	it.each(jobs)(
		'%s: the id sits where the job says in the documented create answer',
		(op, { job }) => {
			const parsed = schemasOf(op).output.parse(STYLES[STYLE_OF[op]!].create);
			expect(at(parsed, job.idPath)).toBe(ID);
		},
	);

	it.each(jobs)(
		'%s: the status sits where the job says in the documented read answer',
		(op, { job }) => {
			const style = STYLES[STYLE_OF[op]!];
			for (const status of style.statuses) {
				const parsed = schemasOf(job.status.op).output.parse(
					style.read(status),
				);
				expect(at(parsed, job.status.statusPath)).toBe(status);
			}
		},
	);

	// A status this list doesn't sort would read as "still running" forever,
	// so every documented value must be placed.
	it.each(jobs)('%s sorts every documented status', (op, { job }) => {
		const { statuses } = STYLES[STYLE_OF[op]!];
		for (const value of [...job.status.done, ...job.status.failed]) {
			expect(statuses).toContain(value);
		}
		expect(
			statuses.filter(
				(v) =>
					!RUNNING.includes(v) &&
					!job.status.done.includes(v) &&
					!job.status.failed.includes(v),
			),
		).toEqual([]);
	});
});
