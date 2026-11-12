import type { EndpointJob } from 'corsair/core';
import { z } from 'zod';
import { ImageKitEndpointOutputSchemas } from './endpoints/types';
import { imageKitEndpointSchemas, imagekit } from './index';

const meta = imagekit().endpointMeta as Record<
	string,
	{ job?: EndpointJob } | undefined
>;

const OUTPUT_FOR = {
	'folders.copy': ImageKitEndpointOutputSchemas.foldersCopy,
	'folders.move': ImageKitEndpointOutputSchemas.foldersMove,
	'folders.rename': ImageKitEndpointOutputSchemas.foldersRename,
	'cache.purge': ImageKitEndpointOutputSchemas.cachePurge,
} as const;

const shapeOf = (op: string): Record<string, z.ZodType> => {
	const schema = OUTPUT_FOR[op as keyof typeof OUTPUT_FOR];
	return schema instanceof z.ZodObject ? schema.shape : {};
};

// ImageKit documents only Pending and Completed for both job families; there
// is no failed state to name.
const RUNNING = ['Pending'];

const jobs = Object.entries(meta).filter(
	(entry): entry is [string, { job: EndpointJob }] => Boolean(entry[1]?.job),
);

describe('imagekit jobs', () => {
	it('declares a job on the four operations that leave work running', () => {
		expect(jobs.map(([op]) => op).sort()).toEqual([
			'cache.purge',
			'folders.copy',
			'folders.move',
			'folders.rename',
		]);
	});

	it.each(jobs)(
		'%s reads back through an operation this plugin has',
		(op, { job }) => {
			expect(meta[job.status.op]).toBeDefined();
			expect(shapeOf(op)[job.idPath]).toBeDefined();
		},
	);

	it.each(jobs)(
		'%s: the status read takes the job id as its argument',
		(_op, { job }) => {
			const input = imageKitEndpointSchemas[
				job.status.op as keyof typeof imageKitEndpointSchemas
			].input as z.ZodObject;
			expect(input.shape[job.status.idArg]).toBeDefined();
			expect(
				input.safeParse({ [job.status.idArg]: '5d5b1a9b4c8c4c0001f3e4a2' })
					.success,
			).toBe(true);
		},
	);

	it.each(jobs)(
		'%s: every documented status sorts into done or running',
		(_op, { job }) => {
			const statuses = ['Pending', 'Completed'];
			for (const status of statuses) {
				const isDone = job.status.done.includes(status);
				const isFailed = job.status.failed.includes(status);
				expect(isDone || isFailed || RUNNING.includes(status)).toBe(true);
			}
			// Completed finishes the job; Pending is the only running state.
			expect(job.status.done).toEqual(['Completed']);
			expect(job.status.failed).toEqual([]);
		},
	);
});
