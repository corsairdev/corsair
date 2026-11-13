import type {
	RampEndpointInputSchemas,
	RampEndpointOutputSchemas,
} from './endpoints/types';
import type { RampContext } from './index';

/** A context carrying only what the endpoints read: `ctx.key`. */
export function fakeContext(key = 'ramp-test-token'): RampContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary
	// rather than reimplementing a context core builds.
	return { key } as unknown as RampContext;
}

export type InputKey = keyof typeof RampEndpointInputSchemas;
export type OutputKey = keyof typeof RampEndpointOutputSchemas;

/**
 * Calls an endpoint the way core does, without core's key resolution, so the
 * endpoint's own request construction and output parse are what is under test.
 *
 * `endpoint` is typed by hand at each call site: the concrete endpoint's
 * parameters are `never`, which every signature accepts.
 */
export function callEndpoint<Output>(
	// unknown: the endpoint's input type differs per operation, and a rejection
	// case passes a value no schema accepts.
	endpoint: (ctx: never, input: never) => Promise<Output>,
	input: unknown,
	key = 'ramp-test-token',
): Promise<Output> {
	return endpoint(fakeContext(key) as never, input as never);
}
