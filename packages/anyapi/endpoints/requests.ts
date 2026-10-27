import type { AnyApiEndpoints } from '..';
import { call } from './call';

// Free: reads a durable run's status, and its result once it has finished.
export const get: AnyApiEndpoints['requestsGet'] = (ctx, input) =>
	call(ctx, 'requestsGet', 'requests.get', input, (parsed) => ({
		method: 'GET',
		path: `/v1/requests/${encodeURIComponent(parsed.requestId)}`,
	}));
