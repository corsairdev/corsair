import type { EndpointJob } from 'corsair/core';
import { ReplicateEndpointOutputSchemas } from './endpoints/types';
import { replicate } from './index';

const meta = replicate().endpointMeta as Record<
	string,
	{ job?: EndpointJob } | undefined
>;

// Statuses a prediction or training passes through before it ends.
const RUNNING = ['starting', 'processing'];

// The output schema each operation answers with, by its endpointMeta path.
const OUTPUT_FOR: Record<string, keyof typeof ReplicateEndpointOutputSchemas> =
	{
		'deployments.predictionsCreate': 'deploymentsPredictionsCreate',
		'models.predictionsCreate': 'modelsPredictionsCreate',
		'predictions.create': 'predictionsCreate',
		'predictions.get': 'predictionsGet',
		'trainings.create': 'trainingsCreate',
		'trainings.get': 'trainingsGet',
	};

const statusValues = (op: string): string[] => {
	const schema = ReplicateEndpointOutputSchemas[OUTPUT_FOR[op]!] as unknown as {
		shape: Record<string, { options?: string[] }>;
	};
	return schema.shape.status?.options ?? [];
};

const jobs = Object.entries(meta).filter(
	(entry): entry is [string, { job: EndpointJob }] => Boolean(entry[1]?.job),
);

describe('Replicate jobs', () => {
	it('declares a job on every operation that starts a prediction or training', () => {
		expect(jobs.map(([op]) => op).sort()).toEqual([
			'deployments.predictionsCreate',
			'models.predictionsCreate',
			'predictions.create',
			'trainings.create',
		]);
	});

	it.each(jobs)(
		'%s reads back through operations this plugin has',
		(op, { job }) => {
			expect(meta[job.status.op]).toBeDefined();
			if (job.cancel) expect(meta[job.cancel.op]).toBeDefined();
			const startShape = (
				ReplicateEndpointOutputSchemas[OUTPUT_FOR[op]!] as unknown as {
					shape: Record<string, unknown>;
				}
			).shape;
			expect(startShape[job.idPath]).toBeDefined();
		},
	);

	// A status the schema gains and this list doesn't sort would read as
	// "still running" forever, so every value must be placed.
	it.each(jobs)(
		'%s sorts every status its read can answer with',
		(_op, { job }) => {
			const values = statusValues(job.status.op);
			expect(values.length).toBeGreaterThan(0);
			expect(job.status.done.length).toBeGreaterThan(0);
			for (const value of [...job.status.done, ...job.status.failed]) {
				expect(values).toContain(value);
			}
			expect(
				values.filter(
					(v) =>
						!RUNNING.includes(v) &&
						!job.status.done.includes(v) &&
						!job.status.failed.includes(v),
				),
			).toEqual([]);
		},
	);
});
