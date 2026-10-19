import type { KlingEndpoints } from '..';
import { createTask, getTaskById, listTasksByCursor } from './tasks';
import { VirtualTryOnCreateInputSchema } from './types';

// Virtual try-on (Solution API). Create uses a dedicated path; querying uses
// the platform-wide solution query endpoints:
// POST /solutions/virtual_try_on
// GET  /solutions?task_ids=
// POST /solutions  (cursor list, `status` filter only)
// https://kling.ai/document-api/api/ecommerce-replication/virtual-try-on

const CREATE_PATH = '/solutions/virtual_try_on';
const QUERY_PATH = '/solutions';

export const virtualTryOnCreate: KlingEndpoints['virtualTryOn']['create'] =
	async (ctx, input) => {
		const parsed = VirtualTryOnCreateInputSchema.parse(input);

		return createTask(
			ctx,
			'kling.virtualTryOn.create',
			CREATE_PATH,
			parsed,
			{},
		);
	};

export const virtualTryOnGet: KlingEndpoints['virtualTryOn']['get'] = (
	ctx,
	input,
) => getTaskById(ctx, 'kling.virtualTryOn.get', QUERY_PATH, input);

export const virtualTryOnList: KlingEndpoints['virtualTryOn']['list'] = (
	ctx,
	input,
) => listTasksByCursor(ctx, 'kling.virtualTryOn.list', QUERY_PATH, input);
