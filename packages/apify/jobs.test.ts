import type { EndpointJob } from 'corsair/core';
import { request } from 'corsair/http';
import type { z } from 'zod';
import { ApifyRestEndpoints } from './endpoints/rest';
import type { ApifyMcpContext } from './index';
import { apify, apifyEndpointSchemas } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return { ...original, request: jest.fn() };
});

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

const mockRequest = request as jest.MockedFunction<typeof request>;

const meta = apify().endpointMeta as Record<
	string,
	{ job?: EndpointJob } | undefined
>;

// Apify's run and build lifecycle (docs.apify.com/platform/actors/running/
// runs-and-builds). The REST output schema is untyped, so the list lives here.
const STATUSES = [
	'READY',
	'RUNNING',
	'SUCCEEDED',
	'FAILED',
	'TIMING-OUT',
	'TIMED-OUT',
	'ABORTING',
	'ABORTED',
];
const RUNNING = ['READY', 'RUNNING', 'TIMING-OUT', 'ABORTING'];

// unknown: one signature for every REST endpoint looked up by name below; each
// has its own input and output types, which the lookup by string can't carry.
type Endpoint = (ctx: ApifyMcpContext, input: unknown) => Promise<unknown>;

// unknown: steps through ApifyRestEndpoints by the dotted op name, where each
// level is a different object type until the endpoint function is reached.
const endpointAt = (op: string): Endpoint =>
	op
		.split('.')
		.reduce<unknown>(
			(node, key) => (node as Record<string, unknown>)[key],
			ApifyRestEndpoints,
		) as Endpoint;

// unknown: walks a dot path (like a job's idPath or statusPath) through any
// operation's output, so no one output type fits; each step checks it holds an
// object before indexing it.
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

const inputOf = (op: string) =>
	apifyEndpointSchemas[op as keyof typeof apifyEndpointSchemas]
		.input as z.ZodObject;

// unknown: the endpoints read only ctx.key, and a mocked request answers each
// call, so the rest of ApifyMcpContext is never touched in these tests.
const ctx = { key: 'test-token' } as unknown as ApifyMcpContext;

const START_INPUT: Record<string, Record<string, string>> = {
	'acts.runActorAsynchronously': { actorId: 'apify~web-scraper' },
	'acts.buildActor': { actorId: 'apify~web-scraper' },
	'actorTasks.runTaskAsynchronously': { actorTaskId: 'janedoe~my-task' },
};

const jobs = Object.entries(meta).filter(
	(entry): entry is [string, { job: EndpointJob }] => Boolean(entry[1]?.job),
);

describe('Apify jobs', () => {
	beforeEach(() => mockRequest.mockReset());

	it('declares a job on every REST operation that starts a run or build', () => {
		expect(jobs.map(([op]) => op).sort()).toEqual([
			'actorTasks.runTaskAsynchronously',
			'acts.buildActor',
			'acts.runActorAsynchronously',
		]);
	});

	it.each(jobs)(
		'%s reads back and stops through operations this plugin has',
		(_op, { job }) => {
			expect(meta[job.status.op]).toBeDefined();
			expect(inputOf(job.status.op).shape[job.status.idArg]).toBeDefined();
			expect(job.cancel).toBeDefined();
			expect(meta[job.cancel!.op]).toBeDefined();
			expect(inputOf(job.cancel!.op).shape[job.cancel!.idArg]).toBeDefined();
		},
	);

	// Apify answers `{ data: { ... } }`; the paths must reach through it.
	it.each(jobs)(
		'%s: the id and the status sit where the job says',
		async (op, { job }) => {
			mockRequest.mockResolvedValueOnce({
				data: { id: 'HG7ML7M8z78YcAPEB', status: 'READY' },
			});
			const started = await endpointAt(op)(ctx, START_INPUT[op]);
			expect(at(started, job.idPath)).toBe('HG7ML7M8z78YcAPEB');

			mockRequest.mockResolvedValueOnce({
				data: { id: 'HG7ML7M8z78YcAPEB', status: 'SUCCEEDED' },
			});
			const read = await endpointAt(job.status.op)(ctx, {
				[job.status.idArg]: 'HG7ML7M8z78YcAPEB',
			});
			expect(mockRequest.mock.calls[1]?.[1]?.path).toEqual({
				[job.status.idArg]: 'HG7ML7M8z78YcAPEB',
			});
			expect(at(read, job.status.statusPath)).toBe('SUCCEEDED');
		},
	);

	// A status this list doesn't sort would read as "still running" forever,
	// so every documented value must be placed.
	it.each(jobs)('%s sorts every documented status', (_op, { job }) => {
		for (const value of [...job.status.done, ...job.status.failed]) {
			expect(STATUSES).toContain(value);
		}
		expect(
			STATUSES.filter(
				(v) =>
					!RUNNING.includes(v) &&
					!job.status.done.includes(v) &&
					!job.status.failed.includes(v),
			),
		).toEqual([]);
	});
});
